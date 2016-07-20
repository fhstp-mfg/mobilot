<?php

use App\Models\Mobidul;
use App\Models\NavigationItem;
use App\Models\Attachment;
use App\Models\Station;
use App\Models\User;
use Illuminate\Support\Facades\Config;

class ImageController extends BaseController
{

  public function checkHash ($hash)
  {
    $att = Attachment::where('hash', $hash)->first();

    if ( isset($att) )
    {
      return Response::json(array("exists" => true, "attachment" => $att));
    }
    else
    {
      return Response::json(array("exists" => false));
    }
  }

  public function saveImage ($mobName)
  {
    // First we fetch the Request instance
    $request = Request::instance();
    // Now we can get the content from it
    $content = $request->getContent();
    $postData = json_decode($content);
    $componentId = property_exists($postData, 'componentId') ? $postData->componentId : ' ';

    $filename = $postData->hash.$postData->extension;

    if ( Auth::check() ){
      $userId = Auth::id();
    }else{
      $userId = User::where('username', Session::getId())->first()->id;
    }

    //add attachement entry
    $mob = Mobidul::where('code', $mobName)->first();

    if ( ! $mob )
    {
      return 'failed, no mobidul found';
    }
    else
    {
      $attachment = Attachment::create(
        array(
          'mobidulId' => $mob->id,
          'url'       => $filename,
          'hash'      => $postData->hash,
          'userId'    => $userId,
          'componentId' => $componentId
        )
      );
    }

    //var_dump($postData);
    //read all input-files

    //set the destination path
    $destinationPath = public_path() . '/' . Config::get('assets.images.paths.input') . '/';

    //convert the dataurl-format to a normal file
    list($type, $data) = explode(';', $postData->file);
    list(, $data)      = explode(',', $data);
    $data = base64_decode($data);

    file_put_contents($destinationPath . $filename, $data);

    return Response::json(array("success" => true, "fileName" => $filename, "attachment" => $attachment));
  }

  public function saveImageForStation ($mobName)
  {
    // First we fetch the Request instance
    $request  = Request::instance();
    // Now we can get the content from it
    $content  = $request->getContent();
    $postData = json_decode($content);

    $filename = $postData->hash.$postData->extension;

    //add attachement entry
    $mob = Mobidul::where('code', $mobName)->first();

    if ( ! $mob )
    {
      return 'failed, no mobidul found';
    }
    else
    {
      //if attachment exists!!
      $attachment = Attachment::where('hash', $postData->hash)->first();

      if ( ! $attachment )
      {
        $attachment = Attachment::create(
          array(
            'mobidulId' => $mob->id,
            'url'       => $filename,
            'hash'      => $postData->hash
          )
        );
      }
      else
      {
        $attachment->url = $filename;
        $attachment->save();
      }


      //get station by stationid in  $postdata
      //add attachement
      $station = Station::find($postData->stationId);

      if ( ! $station )
      {
        $station->attachments()->attach($attachment);
      }
    }

    //var_dump($postData);
    //read all input-files

    //set the destination path
    $destinationPath = public_path() . '/' . Config::get('assets.images.paths.input') . '/';

    //convert the dataurl-format to a normal file
    list($type, $data) = explode(';', $postData->file);
    list(, $data)      = explode(',', $data);
    $data = base64_decode($data);

    file_put_contents($destinationPath.$filename, $data);

    return Response::json(array("success" => true, "fileName" => $filename));
  }

  public function getImage ($size, $filename)
  {
    // Make a new response out of the contents of the file
    // We refactor this to use the image resize function.
    // Set the response status code to 200 OK
    if ( File::isFile(public_path() . '/' . Config::get('assets.images.paths.input') . '/' . $filename) )
    {
      $response = Response::make(
        \Image::resize($filename, $size),
        200
      );

      // Set the mime type for the response.
      // We now use the Image class for this also.
      $response->header(
        'content-type',
        \Image::getMimeType($filename)
      );

      // We return our image here.
      return $response;
    }
  }

  public function exportPicturesFromComponent ()
  {

  }
}
