#!/bin/sh

echo 'Running "composer install" ...'
composer install

echo 'Creating folders under "app/storage/" ...'
mkdir app/storage/cache
mkdir app/storage/logs
mkdir app/storage/meta
mkdir app/storage/sessions
mkdir app/storage/views
echo 'Creating folders under "public/" ...'
mkdir public/upload

echo 'NOTE: Manually create "database.php" (if necessary)'
echo 'NOTE: Manually create database named "mobilot" (MySQL)'
