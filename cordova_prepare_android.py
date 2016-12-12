# @author florian grassinger <fgrass91@gmail.com>

import os
import shutil

from distutils import dir_util

from time import gmtime, strftime
print strftime("> %d.%m.%Y %H:%M:%S", gmtime())


root_www = "cordova/www"

cordova_js         = "cordova/platforms/android/platform_www/cordova.js"
cordova_plugins_js = "cordova/platforms/android/platform_www/cordova_plugins.js"

buildExtra = "utilities/build-extras.gradle"
androidPath = "cordova/platforms/android"

public_ignored = [
    # dirs
    ".excluded",
    "app",
    "lib",
    "node_modules",
    "temp",
    "upload",
    # files
    ".bowerrc",
    ".htaccess",
    "bower.json",
    "gulpfile.js",
    "index.php",
    "karma.conf.js",
    "package.json",
    "robots.txt",
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

print '  o  copy "cordova.js" to "%s"' % root_www
shutil.copy2(cordova_js, root_www)

print '  o  copy "cordova_plugins.js" to "%s"' % root_www
shutil.copy2(cordova_plugins_js, root_www)

print '  o  copy "build-extras.gradle" to "%s"' % androidPath
shutil.copy2(buildExtra, androidPath)

print '> cordova android platform is ready'
