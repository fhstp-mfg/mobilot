<?php

use App\Models\Mobidul;


/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

// call this to get the app files needed to be included in index.html
//Route::get('includes', function () {
//  return View::make('includes');
//});

Route::get('RequestValidCode/{stationCode?}', 'WebServicesController@GenerateStationCode');

Route::get('/{mobidulCode}/GetForCode/{stationCode}', 'WebServicesController@GetForCode');
Route::get('/{mobidulCode}/GetForCategory/{categoryId}', 'WebServicesController@GetForCategoryId');
Route::get('/{mobidulCode}/GetForLocation/{lat}/{lon}/{acc}/', 'WebServicesController@GetForLocation');
Route::get('/{mobidulCode}/GetStations', 'WebServicesController@GetStations');
Route::get('/{mobidulCode}/GetStations/All', 'WebServicesController@GetAllStations');
Route::get('/{mobidulCode}/GetOptions', 'WebServicesController@GetOptions');
//Route::get('/{mobidulCode}/GetNearLocation/{lat}/{lon}/{dist}', 'WebServicesController@GetNearLocation');
//Route::get('/{mobidulCode}/GetForTime/{time}', 'WebServicesController@GetForTime');
//Route::get('/{mobidulCode}/GetNearTime/{time}/{timespan}', 'WebServicesController@GetNearTime');
Route::get('/{mobidulCode}/GetCategories', 'WebServicesController@GetCategories');

Route::get('GetMobiduls', 'WebServicesController@GetMobiduls');
Route::get('MyMobiduls','WebServicesController@GetMyMobiduls');
Route::get('GetNewestMobiduls','WebServicesController@GetNewestMobiduls');
Route::get('MobidulNearMe/{latitude}/{longitude}', 'WebServicesController@MobidulNearMe');

Route::get('/GetContent/{stationid}', 'WebServicesController@GetContent');
Route::get('/GetContentForCode/{mobidul}/{stationcode}', 'WebServicesController@GetContentForCode');
Route::get('{mobidulCode}/GetStation/{station_id}', 'WebServicesController@GetStation');
Route::get('{mobidulCode}/GetCategoriesForStation/{stationid}', 'WebServicesController@GetCategoriesForStation');
Route::get('isCodeValid/{code}', 'CodeController@isCodeValid');
Route::get('Play/{code}', 'CodeController@play');
Route::get('JoinMobidul/{code}', 'CodeController@JoinMobidul');
Route::get('mobilePlay/{code}', 'CodeController@mobilePlay'); // mobile route
Route::get('CanPlay/{mobidulCode}', 'CodeController@canIPlay');
Route::get('GetOwnerOfMobidul/{mobidulCode}', 'WebServicesController@GetOwnerOfMobidul');
Route::get('IsOwnerOfMobidul/{mobidulCode}', 'WebServicesController@IsOwnerOfMobidul');
Route::get('RoleForMobidul/{mobidulCode}', 'WebServicesController@GetRoleForMobidul');
Route::get('IsLoggedIn', 'WebServicesController@IsLoggedIn');

Route::get('existsMobidul/{mobidul}', 'WebServicesController@checkMobidulCode');
Route::get('existsStation/{mobidulCode}/{stationCode}', 'WebServicesController@stationExists');
Route::get('stationExistsById/{mobidulCode}/{stationId}', 'WebServicesController@stationExistsById');

/* Brauchen identifikation */
Route::post('/{mobidulCode}/PushActivity', 'WebServicesController@PushActivity')->before('auth')
Route::post('/{mobidulCode}/SetOptions', 'WebServicesController@SetOptions')->before('auth');
Route::post('NewMobidul', 'WebServicesController@NewMobidul')->before('auth');
//Route::get('UpdateMobidul/{code}/{name}/{description}', 'WebServicesController@UpdateMobidul')->before('auth');
Route::post('{mobidulCode}/UpdateMobidul', 'WebServicesController@UpdateMobidul')->before('auth');
Route::post('{mobidulCode}/AddCategories', 'WebServicesController@AddCategories');
Route::post('{mobidulCode}/UpdateCategories', 'WebServicesController@UpdateCategories');
Route::post('{mobidulCode}/RemoveCategories', 'WebServicesController@RemoveCategories');
Route::get('{mobidulCode}/RemoveCategory/{categoryId}', 'WebServicesController@RemoveCategory');
Route::get('{mobidulCode}/clone', 'WebServicesController@CloneMobidul');


/*
 * Stations
 */
Route::post('{mobidulCode}/AddStation', 'WebServicesController@AddStation');
Route::post('{mobidulCode}/SaveStation/{stationCode}', 'WebServicesController@SaveStation');
Route::post('{mobidulCode}/UpdateContent/{stationCode}', 'WebServicesController@updateStationContent');
Route::post('{mobidulCode}/SetStation', 'WebServicesController@SetStation');
Route::get('{mobidulCode}/RemoveStation/{stationId}', 'WebServicesController@RemoveStation');
Route::get('{mobidulCode}/RemoveStationByCode/{stationCode}', 'WebServicesController@RemoveStationByCode');
Route::put('{mobidulCode}/changeOrder', 'WebServicesController@ChangeOrder');

Route::post('{mobidulCode}/UpdateNavigation', 'ConfigController@UpdateNavigation');
Route::post('{mobidulCode}/GetPlayCode','CodeController@getPlayCode')->before('auth');
Route::get('/Codes/{mobidulCode}','CodeController@getCodes')->before('auth');
Route::get('/CloseCode/{Code}','CodeController@closeCode')->before('auth');
Route::get('/OpenCode/{Code}','CodeController@openCode')->before('auth');
Route::get('/DeleteCode/{Code}','CodeController@deleteCode')->before('auth');

Route::post('/{mobidulCode}/UpdateStartPage','ConfigController@updateStartPage')->before('auth');

Route::get('login', array('as' => 'login', 'uses' => 'UserController@showLogin'));
Route::post('login', array('as' => 'login', 'uses' => 'UserController@login'));
Route::get('logout','UserController@logout');
Route::post('register','UserController@register');
Route::get('currentUser', 'UserController@getCurrentUser');
Route::post('requestRestore', 'UserController@requestRestore');
Route::post('changePassword', 'UserController@changePassword')->before('auth');
Route::post('changePasswordNoAuth', 'UserController@changePassword');

Route::post('DeleteMobidul', 'WebServicesController@DeleteMobidul')->before('auth');

Route::get('/', 'HomeController@showStart');
Route::get('', 'HomeController@showStart');
Route::get('/index.html', 'HomeController@showStart');
Route::get('restorePassword/{token}', 'HomeController@showStart');
Route::get('activateAccount/{token}', 'HomeController@activateAccount');

Route::get('{mobName}/index.html','HomeController@showMobidul');
Route::get('{mobidulCode}/', 'HomeController@showMobidul');
Route::get('{mobidulCode}', 'HomeController@showMobidul');
Route::get('{mobidulCode}/#/content/{stationId}', 'HomeController@changeToStation');

//returns config with given Mobidul-Name from DB
Route::get('{mobName}/getConfig', 'ConfigController@getConfiguration');

//looks if given Name is existing Mobidul, if not found--> error
Route::get('{mobName}/isMobidul', 'ConfigController@isMobidul');

//gets mobidul with certain station loaded. for qr codes or quicklinks
Route::get('{mobidulCode}/{stationCode}', 'HomeController@showMobidulWithCode');

//check if Image with certain hash has already been uploaded
Route::get('/image/checkHash/{hash}', 'ImageController@checkHash');
//gets image with a certain size
Route::get('/image/{size}/{file}', 'ImageController@getImage');
Route::post('/{mobidulCode}/saveImage/', 'ImageController@saveImage');
Route::post('/{mobidulCode}/saveImageForStation/', 'ImageController@saveImageForStation');

//exit;
