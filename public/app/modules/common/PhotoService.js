(function () {
'use strict';

angular
  .module('Mobilot')
  .factory('PhotoService', PhotoService);

PhotoService.$inject = [
  '$log', '$http', '$stateParams', '$q',
  '$mdDialog'
];

function PhotoService(
  $log, $http, $stateParams, $q,
  $mdDialog
) {
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
  function _drawImageIOSFix (ctx, img, sx, sy, sw, sh, dx, dy, dw, dh, exifOr)
  {
    var vertSquashRatio = _detectVerticalSquash(img);
    // Works only if whole image is displayed:
    //                 ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
    //                 The following works correct also when only a part of the image is displayed:
    ctx.save();
    ctx.translate(dw / 2, dh / 2);

    switch (exifOr) {
      case 6:
        ctx.rotate(90 * Math.PI / 180);
        break;
      case 3:
        ctx.rotate(180 * Math.PI / 180);
        break;
      case 8:
        ctx.rotate(-90 * Math.PI / 180);
        break;
    }
    if (exifOr == 8 || exifOr == 6) {
      var tempWidth = dw;
      dw = dh;
      dh = tempWidth;
    }

    ctx.drawImage(img, sx * vertSquashRatio, sy * vertSquashRatio,
      sw * vertSquashRatio, sh * vertSquashRatio,
      0 - dw / 2, 0 - dh / 2, dw, dh);

    ctx.restore();
  }

  function _detectVerticalSquash (img)
  {
    var iw = img.naturalWidth,
      ih = img.naturalHeight;
    var canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = ih;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    var data = ctx.getImageData(0, 0, 1, ih).data;
    // search image edge pixel position in case it is squashed vertically.
    var sy = 0;
    var ey = ih;
    var py = ih;
    while (py > sy) {
      var alpha = data[(py - 1) * 4 + 3];
      if (alpha === 0) {
        ey = py;
      } else {
        sy = py;
      }
      py = (ey + sy) >> 1;
    }
    var ratio = (py / ih);
    return (ratio === 0) ? 1 : ratio;
  }

  /// services
  function uploadPhoto (file, componentId)
  {
    return $q(function(resolve, reject) {
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
          _drawImageIOSFix(ctx, image, 0, 0, image.width, image.height, 0, 0, Math.round(imageWidth), Math.round(imageHeight), exifOr);

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
              'extension': '.jpg',
              'componentId': componentId,
              'stationCode': $stateParams.stationCode
            };

              $http.post('/' + $stateParams.mobidulCode + '/saveImage', JSON.stringify(File)).then(function (response) {
                resolve(response.data);
              }, function (error) {
                reject(error);
              });

          } else {
          }
        };
      };
      reader.readAsDataURL(file);
    });
  }

  return service;
}
})();
