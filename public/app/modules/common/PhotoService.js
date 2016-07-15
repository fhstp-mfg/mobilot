(function () {
'use strict';

angular
  .module('Mobilot')
  .factory('PhotoService', PhotoService);

PhotoService.$inject = [
  '$log'
];

function PhotoService($log) {
  /// PhotoService
  var service =
  {
    /// constants
    MAX_WIDTH: 1024,
    MAX_HEIGHT: 768,


    /// vars
    // ...


    /// functions
    uploadPhoto: uploadPhoto

  };


  /// private helpers
  // ...


  /// services

  function uploadPhoto (file)
  {
    var reader = new FileReader();

    reader.onloadend = function () {
      var image = new Image();
      image.src = reader.result;

      image.onload = function () {
        var exifOr = 'x',
          onloadCtx = this;

        EXIF.getData(image, function () {
          exifOr = image.exifdata.Orientation;
        });

        var maxWidth = service.MAX_WIDTH,
          maxHeight = service.MAX_HEIGHT,
          imageWidth = image.width,
          imageHeight = image.height;

        if (imageWidth > imageHeight) {
          if (imageWidth > maxWidth) {
            imageHeight *= maxWidth / imageWidth;
            imageWidth = maxWidth;
          }
        } else {
          if (imageHeight > maxHeight) {
            imageWidth *= maxHeight / imageHeight;
            imageHeight = maxHeight;
          }
        }

        //you have to create a new canvas element for each upload.
        //reusing an existing one isn't working on iphones due to safari resource limits.
        var canvas = document.createElement('canvas');// that.$.myCanvas;

        //if portrait picture: switch imagewidth and imageheight
        if (exifOr == 8 || exifOr == 6) {
          var tempWidth = imageWidth;
          imageWidth = imageHeight;
          imageHeight = tempWidth;
        }

        canvas.width = Math.round(imageWidth);
        canvas.height = Math.round(imageHeight);

        var ctx = canvas.getContext("2d");

        //ctx.(image, 0, 0, imageWidth, imageHeight);
        scope.drawImageIOSFix(ctx, image, 0, 0, image.width, image.height, 0, 0, Math.round(imageWidth), Math.round(imageHeight), exifOr)

        // The resized file ready for upload
        var finalFile = canvas.toDataURL("image/jpeg", 0.7);
        var newFileName = file.name.split('.');

        //TODO change it so that it works with angular
        //that.$.file.value = "";
        newFileName.pop();
        newFileName.join('.');

        if (finalFile.length > 6) {

          //Check if file is already in MediaList
          var hash = CryptoJS.MD5(finalFile).toString(CryptoJS.enc.Base64);

          var File = {
            'name': 'file',
            'file': finalFile,
            'filename': newFileName + ".jpg",
            'hash': hash,
            'extension': '.jpg'
          };

          //upload it and add the link to the content area

          //checkHash
          $http
            .get( '/image/checkHash/' + File.hash )
            .success(function (response, status, headers, config)
            {

              //Add image to list
              if(response.exists)
                scope.addedImage(hash);

              //upload it
              else
              {
                $http.post('/'+$stateParams.mobidulCode+'/saveImage', JSON.stringify(File)).
                then(function(response) {
                  // this callback will be called asynchronously
                  // when the response is available

                  scope.addedImage(hash);
                }, function(response) {
                  // called asynchronously if an error occurs
                  // or server returns response with an error status.
                });
              }


            })
            .error(function (response, status, headers, config)
            {
              console.log(response);
              console.log(status);
            });

        } else {
        }
      };
    };
    reader.readAsDataURL(file);
  }

  return service;
}
})();