@ECHO OFF
Title Mobilot Setup

ECHO Running "composer install" ...
composer install

<<<<<<< HEAD
SET /p answer= ^> Have you created a MySQL database named "mobilot"? (Y/n)
=======
ECHO Creating folders under "app/storage/" ...
mkdir app\storage\logs
mkdir app\storage\cache
mkdir app\storage\meta
mkdir app\storage\sessions
mkdir app\storage\views
>>>>>>> 06682382d07acfec9edeb619a772afa727895c55

ECHO Creating folders under "public/" ...
mkdir public\upload

<<<<<<< HEAD
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
SET /p answer2= ^> What kind of environemnt are you using? (H)omestead/(X)AMPP: 
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
SET /p answer3= ^> IMPORTANT: Configure %location% before continuning (press ENTER) 
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
=======
ECHO NOTE: Manually create "database.php" (if necessary)
ECHO NOTE: Manually create database named "mobilot" (MySQL)
>>>>>>> 06682382d07acfec9edeb619a772afa727895c55
