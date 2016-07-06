@ECHO OFF

echo.
echo Welcome %USERNAME%!
echo "This setup will guide you through the process of installing mobilot on your machine."
echo.

SET /p answer= ^> Have you created a MySQL database named "mobilot"? (Y/n)

IF NOT "%answer%"=="n" (

  echo.
  echo ^> Creating folders under "app/storage/" ...
  mkdir app\storage\logs
  mkdir app\storage\cache
  mkdir app\storage\meta
  mkdir app\storage\sessions
  mkdir app\storage\views

  echo.
  echo ^> Creating folders under "public/" ...
  mkdir public\upload

  echo.
  echo ^> composer install
  call composer install

  echo.
  goto CopyDatabasePHP

)

IF "%answer%"=="n" (
  echo ^>  Create a database named "mobilot" and than run this script again
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
SET /p answer3= ^> IMPORTANT: Configure %location% before continuing (press ENTER)
echo.
call php artisan migrate

echo.
echo ^> Mobilot setup completed!

SET /p answer4= ^> Would you like to serve Mobilot now? (Y/n) 

IF NOT "%answer4%"=="n" (
  echo ^> php artisan serve
  php artisan serve
)
IF "%answer4%"=="n" (
  echo ^> INFO: To serve Mobilot run: "php artisan serve"
)

echo ^> Good bye!
exit /b 0
