#!/bin/bash

echo "Building Mobilot for iOS !"

cd public/

echo "> Run production build gulp task"
gulp build

cd ..

echo "> Copy files for Cordova iOS"
python cordova_prepare_ios.py

cd cordova/

echo "> Cordova build iOS version"
cordova build ios

echo "> Open Xcode project"
open platforms/ios/Mobilot.xcodeproj

cd ..

echo "Done building Mobilot for iOS !"
