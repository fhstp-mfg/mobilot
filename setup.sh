#!/bin/bash

### constants
USER=`ls -l setup.sh | awk '{print $3}'`


### functions
# ...


### main
echo ""
echo "Welcome $USER!"
echo "This setup will guide you through the process of installing Mobilot on your machine."


echo ""
echo "> Have you created a MySQL database named \"mobilot\"? (Y/n)"
read answer
if [[ $answer == n ]]
then
  echo "> Create a database named \"mobilot\" first and then run this script again."
  exit 0
fi


echo "> Creating storage folders under \"app/storage\""
if [ ! -d app/storage ]; then
  sudo -u $USER mkdir app/storage
  sudo -u $USER mkdir app/storage/cache
  sudo -u $USER mkdir app/storage/logs
  sudo -u $USER mkdir app/storage/meta
  sudo -u $USER mkdir app/storage/sessions
  sudo -u $USER mkdir app/storage/views
fi

# echo "> "Setting permissions for app/storage"
# sudo chown -R $USER app/storage/

echo ""
echo "> Creating \"public/upload\" folder"
if [ ! -d public/upload ]; then
  sudo -u $USER mkdir public/upload
fi

echo ""
echo "> composer install"
sudo composer install


echo ""
echo "> What kind of environment are you using? (H̲omestead/M̲AMP/X̲AMPP)"
read answer
if [[ $answer == H ]]
then
  path="\"app/config/local/database.php\""
  echo "> Copying \"setup/database.php\" to $path"

  # the directory "local" might be missing
  if [ ! -d "app/config/local" ]
  then
    sudo -u $USER mkdir app/config/local
  fi
  sudo cp -p setup/database.php app/config/local/database.php
else
  if [[ $answer == M || $answer == X ]]
  then
    path="\"app/config/database.php\""
    echo "> Copying \"setup/database.php\" to $path"
    sudo cp -p setup/database.php app/config/database.php
  fi
fi


echo ""
echo "> IMPORTANT: Configure $path before continuing (press ENTER)"
read answer
echo ""


echo "> php artisan migrate"
php artisan migrate

echo "> npm install"
npm install

echo ">bower install"
cd public
bower install

echo ""
echo "> Mobilot setup completed!"


echo "> Would you like to serve Mobilot now? (Y/n)"
read answer
if [[ $answer == n ]]
then
  echo "> INFO: To serve Mobilot run: \"php artisan serve\""
else
  echo "> php artisan serve"
  php artisan serve
fi

echo "Good bye!"
exit 0
