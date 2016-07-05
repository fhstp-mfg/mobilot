#!/bin/sh

echo '> Mobilot: Have you created a MySQL database named "mobilot"? (Y/n)'
read answer
if [[ $answer == n ]];
then
  echo '> Mobilot: Create a database named "mobilot" first and then run this script again.'
  exit 0
fi


echo '> Mobilot: Running "composer install"'
sudo composer install


echo '> Mobilot: Creating storage folders under app/storage'
mkdir app/storage
mkdir app/storage/cache
mkdir app/storage/logs
mkdir app/storage/meta
mkdir app/storage/sessions
mkdir app/storage/views

echo '> Mobilot: Setting permissions for app/storage'
chown -R $USER app/storage/

echo '> Mobilot: Creating public/upload folder'
mkdir public/upload


echo '> Mobilot: (IMPORTANT)'
echo '    Manually copy "setup/database.php" to'
echo '      > "app/config" (for MAMP, XAMPP) or'
echo '      > "app/config/local" (for Homestead)'
echo '    and configure accordingly.'


echo '> Mobilot: Have you configured your database.php? (Y/n)'
read answer
if [[ $answer == n ]];
then
  exit 0
fi


echo '> Mobilot: Migrations'
php artisan migrate


echo '> Mobilot: Finished!'
exit 0
