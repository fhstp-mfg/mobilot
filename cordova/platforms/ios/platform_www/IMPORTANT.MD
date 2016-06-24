Don't run:

```
$ cordova prepare ios
```

from the **cordova** folder, since the **cordova/www** folder does not contain anything but this **IMPORTANT.MD** file.


Instead run (for iOS only):

```
$ python cordova_prepare_ios.py
```

from the *root* folder. This will clone the **public** folder to **platforms/ios/www**.

*Remember that python is required for this operation.*


However, when new plugins are installed, Cordova has to be built again:

```
$ cordova build ios
```

After the build has succeeded, the **plugins** folder and the **cordova_plugins.js** file inside the **platform/ios/www** folder. These have to be copied to the **platforms/ios/platform_www** folder.

ONLY AFTERWARDS the **cordova_prepare_ios.py** script should be executed.
