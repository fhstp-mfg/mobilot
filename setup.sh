#!/bin/bash

### constants
USER=`ls -l setup.sh | awk '{print $3}'`


### functions
function echo_further_help {
  echo ""
  echo "Hints:"
  echo "> To manually serve Mobilot run: \"php artisan serve\""
  echo "> If something went wrong on the way like mistyping or misconfiguring the \"database.php\", you can confidently try repeating the process."
  echo ""
  echo "Further help  – https://github.com/fhstp-mfg/mobilot/wiki/Setup"
  echo "Report issues – https://github.com/fhstp-mfg/mobilot/issues"
  echo ""
}


### main
echo ""
echo "Hello $USER!"
echo ""
echo "This setup will guide you through the process of installing Mobilot on your machine."


echo ""
echo "> Have you created a MySQL database named \"mobilot\"? (Y/n)"
read answer
if [[ $answer == N || $answer == n ]]
then
  echo "> Create a database named \"mobilot\" first and then run this script again."
  exit 0
fi


echo "> Creating storage folders \"app/storage\""
if [ ! -d "app/storage" ]; then
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
echo "> Creating uploads folder \"public/upload\""
if [ ! -d "public/upload" ]; then
  sudo -u $USER mkdir public/upload
fi

echo ""
echo "> composer install"
echo "One moment please ..."
sudo composer install


echo ""
echo "> What kind of environment are you using? (H̲omestead/M̲AMP/X̲AMPP)"
read answer
if [[ $answer == H || $answer == h ]]
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
  if [[ $answer == M || $answer == m || $answer == X || $answer == x ]]
  then
    path="\"app/config/database.php\""
    echo "> Copying \"setup/database.php\" to $path"
    sudo cp -p setup/database.php app/config/database.php
  fi
fi


echo ""
echo "> IMPORTANT: Configure $path before continuing then press ENTER. Note that for some local environments (such as MAMP) you might need to specify a \"unix_socket\"."
read answer
echo ""


echo "> php artisan migrate"
echo "One moment please ..."
php artisan migrate

echo ""
echo "Finally let us take a deep breath ..."
echo "... and install npm and bower modules! (press ENTER)"
read answer

cd public

echo "> npm install"
npm install

echo "> bower install"
echo "When asked, always choose the later module versions required by Mobilot."
bower install

echo "> Running development build gulp task."
gulp

echo ""
echo "> Mobilot setup completed!"

echo_further_help

echo "> Would you like to serve Mobilot locally? (Y/n)"
read answer
if [[ $answer == Y || $answer == y ]]
then
  cd ..
  echo "> php artisan serve"
  php artisan serve
fi

echo "Good bye then :)"
exit 0
