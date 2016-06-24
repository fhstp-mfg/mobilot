<?php namespace App\Libraries\Image;

// We need to add these namespaces
// in order to have access to these classes.
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Config;

class Image {

    protected $imagine;

    // We instantiate the Imagine library with Imagick or GD
    public function __construct($library = null)
    {
        if ( !$this->imagine) {
            if ( !$library and class_exists('Imagick')) {
                $this->imagine = new \Imagine\Imagick\Imagine();
            } else {
                $this->imagine = new \Imagine\Gd\Imagine();
            }
        }
    }
    
    private function getPictureSize($width, $height, $maxWidth, $maxHeight) {
        $newWidth = $width; 
        $newHeight = $height;
        if ($width > $height) {
            if ($width > $maxWidth) {
                $newHeight *= $maxWidth / $width;
                $newWidth = $maxWidth;
            }
        } else {
            if ($height > $maxHeight) {
                $newWidth *= $maxHeight / $height;
                $newHeight = $maxHeight;
            }
        }
    return array('width'=> $newWidth, 'height'=>$newHeight );
    }

    /*
     * Resize function.
     * @param string filename
     * @param string sizeString
     *
     * @return blob image contents.
     */
    public function resize($filename, $newWidth) {

        // We can read the output path from our configuration file.
        $outputDir = public_path().'/'.Config::get('assets.images.paths.output');

        // Create an output file path from the size and the filename.
        $outputFile = $outputDir . $newWidth . '_' . $filename;

        // If the resized file already exists we will just return it.
        if (File::isFile($outputFile)) {
            return File::get($outputFile);
        }

        // File doesn't exist yet, so we will resize the original.
        $inputDir = public_path().'/'.Config::get('assets.images.paths.input');
        $inputFile = $inputDir . '/' . $filename;
        
        list($width, $height)=getimagesize($inputFile); 
        // Get the width and the height of the chosen size from the Config file.
        
        $height = $height* ($newWidth/$width) ;

        // We want to crop the image so we set the resize mode and size.
        $size = new \Imagine\Image\Box($newWidth, $height);
        $mode = \Imagine\Image\ImageInterface::THUMBNAIL_OUTBOUND;

        // Create the output directory if it doesn't exist yet.
        if (!File::isDirectory($outputDir)) {
            File::makeDirectory($outputDir);
        }

        // Open the file, resize it and save it.
        $this->imagine->open($inputFile)
            ->thumbnail($size, $mode)
            ->save($outputFile, array('quality' => 90));

        // Return the resized file.
        return File::get($outputFile);

    }

    /**
     * @param string $filename
     * @return string mimetype
     */
    public function getMimeType($filename) {

        // Make the input file path.
        $inputDir = public_path().'/'.Config::get('assets.images.paths.input');
        $inputFile = $inputDir . '/' .  $filename;

        // Get the file mimetype using the Symfony File class.
        $file = new \Symfony\Component\HttpFoundation\File\File($inputFile);
        return $file->getMimeType();
    }

}