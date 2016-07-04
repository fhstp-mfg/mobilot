@ECHO OFF
Title Mobilot Setup

ECHO Running "composer install" ...
composer install

ECHO Creating folders under "app/storage/" ...
mkdir app\storage\logs
mkdir app\storage\cache
mkdir app\storage\meta
mkdir app\storage\sessions
mkdir app\storage\views

ECHO Creating folders under "public/" ...
mkdir public\upload

ECHO NOTE: Manually create "database.php" (if necessary)
ECHO NOTE: Manually create database named "mobilot" (MySQL)