@ECHO OFF

echo.
echo Hello %USERNAME%!
echo.
echo "This setup will guide you through the process of installing mobilot on your machine."
echo.

SET /p answer= ^> Have you created a MySQL database named "mobilot"? (Y/n)

IF NOT "%answer%"=="n" (

  echo.
  echo ^> Creating storage folders "app/storage/" ...
  mkdir app\storage\logs
  mkdir app\storage\cache
  mkdir app\storage\meta
  mkdir app\storage\sessions
  mkdir app\storage\views

  echo.
  echo ^> Creating uploads folder "public/" ...
  mkdir public\upload

  echo.
  echo ^> composer install
  echo One moment please ...
  call composer install

  echo.
  goto CopyDatabasePHP

)

IF "%answer%"=="n" (
  echo ^>  Create a database named "mobilot" and than run this script again.
  exit /b
)

:CopyDatabasePHP
SET /p answer2= ^> What kind of environment are you using? (H)omestead/(X)AMPP:
SET location = ""
IF "%answer2%"=="H" (
  SET location=app\config\local
  goto CopiedDatabasePHP
)
IF "%answer2%"=="X" (
  SET location=app\config
  goto CopiedDatabasePHP
)

:CopiedDatabasePHP
echo.
echo ^> Copying "setup\database.php" to "%location%"
@xcopy /s /I setup %location%

echo.
SET /p answer3= ^> IMPORTANT: Configure %location% before continuing (press ENTER). Note that for some local environments (such as MAMP) you might need to specify a unix_socket.

echo.
echo ^> php artisan migrate
echo One moment please ...
call php artisan migrate

echo.
SET /p answer5= ^> Finally let us take a deep breath ... ... and install npm and bower modules! (press ENTER)
echo ^> npm install
npm install

echo ^> bower install
echo "When asked, always choose the later module versions required by Mobilot."
cd public
bower install

echo.
echo ^> Mobilot setup completed!

echo.
echo Hints:
echo ^> To manually serve Mobilot run: php artisan serve
echo ^> If something went wrong on the way like mistyping or misconfiguring the "database.php", you can confidently try repeating the process.
echo.
echo Further help  – https://github.com/fhstp-mfg/mobilot/wiki/Setup
echo Report issues – https://github.com/fhstp-mfg/mobilot/issues
echo.

SET /p answer4= ^> Would you like to serve Mobilot now? (Y/n) 

IF NOT "%answer4%"=="n" (
  echo ^> php artisan serve
  php artisan serve
)
IF "%answer4%"=="n" (
  echo ^> INFO: To serve Mobilot run: "php artisan serve"
)

echo ^> Good bye then :)
exit /b 0
