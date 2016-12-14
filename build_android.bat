@ECHO OFF

echo Building Mobilot for Android !

cd public/

echo ^> Run production build task
gulp build

cd ../

echo ^> Copy files for Cordova iOS
python cordova_prepare_android.py

cd cordova/

echo ^> Cordova build and run Android version (requires phone or starts emulator)
cordova build android


cd ../

echo Done building Mobilot for Android !
