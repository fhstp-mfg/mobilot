#!/usr/bin/python
#
# @author: iosif miclaus <iosif.miclaus@gmail.com>
#
# TODO: cordova_after_build_ios.py
# should copy "plugins" folder, "cordova.js" and "cordova_plugins.js"
# from ios platform "www" folder to "platform_www" for later ussage in this file.
#

import os
import shutil

from distutils import dir_util

from time import gmtime, strftime
print strftime("> %d.%m.%Y %H:%M:%S", gmtime())


root_www = "cordova/www"
ios_www  = "cordova/platforms/ios/www"

plugins     = "cordova/platforms/ios/platform_www/plugins";
plugins_ios = "cordova/www/plugins";

cordova_js         = "cordova/platforms/ios/platform_www/cordova.js"
cordova_plugins_js = "cordova/platforms/ios/platform_www/cordova_plugins.js"


# for Mobilot Polymer version

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



# print '> empty "%s"' % root_www
# if os.path.isdir(root_www):
#     shutil.rmtree(root_www)

# print '  o  copy from "public" to "%s"' % root_www
# shutil.copytree("public", root_www, ignore=copyignore)

print '> empty "%s"' % ios_www
if os.path.isdir(ios_www):
    shutil.rmtree(ios_www)

print '  o  copy from "public" to "%s"' % ios_www
shutil.copytree("public", ios_www, ignore=copyignore)

print '  o  copy "plugins" to "%s"' % plugins_ios
dir_util.copy_tree(plugins, plugins_ios)

print '  o  copy "cordova.js" to "%s"' % root_www
shutil.copy2(cordova_js, root_www)

print '  o  copy "cordova_plugins.js" to "%s"' % root_www
shutil.copy2(cordova_plugins_js, root_www)

print '> cordova ios platform is ready'
