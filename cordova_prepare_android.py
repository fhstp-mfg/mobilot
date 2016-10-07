# author : florian grassinger <fgrass91@gmail.com>


import os
import shutil

from distutils import dir_util

from time import gmtime, strftime
print strftime("> %d.%m.%Y %H:%M:%S", gmtime())


root_www = "cordova/www"

plugins     = "cordova/platforms/android/platform_www/plugins";
plugins_android = "cordova/www/plugins";

cordova_js           = "cordova/platforms/android/platform_www/cordova.js"
cordova_plugins_js   = "cordova/platforms/android/platform_www/cordova_plugins.js"

buildExtra = "utilities/build-extras.gradle"
androidPath = "cordova/platforms/android"

public_ignored = [
    ".excluded"
    "upload",
    ".htaccess",
    "disableDebug.php",
    "enableDebug.php",
    "update.php",
    "updatedb.php",
    "vulcanize.php"
]


def copyignore(src, files):
    if src == "public":
        return public_ignored
    return []



print '> empty "%s"' % root_www
if os.path.isdir(root_www):
    shutil.rmtree(root_www)

print '  o  copy from "public" to "%s"' % root_www
shutil.copytree("public", root_www, ignore=copyignore)

print '  o  copy "plugins" to "%s"' % root_www
dir_util.copy_tree(plugins, plugins_android)

print '  o  copy "cordova.js" to "%s"' % root_www
shutil.copy2(cordova_js, root_www)

print '  o  copy "cordova_plugins.js" to "%s"' % root_www
shutil.copy2(cordova_plugins_js, root_www)

print '  o  copy "build-extras.gradle" to "%s"' % androidPath
shutil.copy2(buildExtra, androidPath)

print '> cordova android platform is ready'
