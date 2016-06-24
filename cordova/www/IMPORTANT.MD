Don't run:

```
$ cordova prepare ios
```

from the **cordova** folder, since the **www** folder does not contain anything but this **IMPORTANT.MD** file.


Instead run:

```
$ python cordova_prepare_ios.py
```

from the *root* folder. This will clone the **public** folder to **cordova/platforms/ios/www**.

*Remember that python is required for this operation.*
