#!/usr/bin/python
#
# author : iosif miclaus <iosif.miclaus@gmail.com>
#
# TODO cordova_after_build_ios.py
#       should copy "plugins" folder, "cordova.js" and "cordova_plugins.js"
#       from ios platform "www" folder to "platform_www" for later ussage in this file.
#

import os
import shutil

from distutils import dir_util

from time import gmtime, strftime
print strftime("> %d.%m.%Y %H:%M:%S", gmtime())


root_www = "cordova/www"
ios_www  = "cordova/platforms/ios/www"

plugins     = "cordova/platforms/ios/platform_www/plugins";
plugins_ios = "cordova/platforms/ios/www/plugins";

cordova_js           = "cordova/platforms/ios/platform_www/cordova.js"
cordova_plugins_js   = "cordova/platforms/ios/platform_www/cordova_plugins.js"
# important_md         = "cordova/platforms/ios/platform_www/IMPORTANT.MD"
# mobimer_html         = "cordova/platforms/ios/platform_www/mobimer.html"

# for Mobilot Polymer version

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

# for Mobilot NG version
# public_ignored = [
#     "elements",
#     ".bowerrc",
#     ".DS_Store",
#     "gulpfile.js",
#     "index.php"
# ]


def copyignore(src, files):
    if src == "public":
        return public_ignored
    return []


# print '> empty "%s"' % root_www
# if os.path.isdir(root_www):
#     shutil.rmtree(root_www)
#
# print '  o  copy "IMPORTANT.MD" notice to "%s"' % root_www
# shutil.copy2(important_md, root_www)


print '> empty "%s"' % ios_www
if os.path.isdir(ios_www):
    shutil.rmtree(ios_www)

print '  o  copy from "public" to "%s"' % ios_www
shutil.copytree("public", ios_www, ignore=copyignore)

print '  o  copy "plugins" to "%s"' % plugins_ios
dir_util.copy_tree(plugins, plugins_ios)

print '  o  copy "cordova.js" to "%s"' % ios_www
shutil.copy2(cordova_js, ios_www)

print '  o  copy "cordova_plugins.js" to "%s"' % ios_www
shutil.copy2(cordova_plugins_js, ios_www)

print '> cordova ios platform is ready'
