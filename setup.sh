#!/bin/sh

echo 'Have you created a database named "mobilot" (MySQL) ? (Y/n)'
read answer
if [ $answer = n ] then
  echo 'Create a database named "mobilot" first and then run this script again.'
  exit 0
fi

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

echo 'Migrations'
php artisan migrate

echo 'NOTE: Manually copy "setup/database.php" to "app/config/" (for MAMP, XAMPP) or "app/config/local/" (for Homestead) and configure accordingly.'

echo 'Finish!'
