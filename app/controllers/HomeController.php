<?php

use App\Models\Mobidul;
use App\Models\Station;
use App\Models\User;

class HomeController extends BaseController
{

  public function showMobidul($mobidulCode)
  {
    $mobidul = Mobidul::where('code', $mobidulCode)->first();

    if ( ! $mobidul ) {
      // App::abort(202, 'No entry found.');
      return View::make('generateNew');
    } else {
      return View::make('mobimer', [
        'mobidul' => $mobidulCode,
        'mobidulName' => $mobidul->name,
        'startAbility' => $mobidul->startAbility,
        'startItemId' => $mobidul->startItemId
      ]);
    }
  }


  public function showMobidulWithCode($mobidulCode, $stationCode)
  {
    // TODO: There is a weird annomaly here.
    // Somehow this method gets called with $mobidulCode = 'dist' and
    // $stationCode = 'angulartics-google-analytics.min.js.map'

    $mobidul = Mobidul::where('code', $mobidulCode)->first();


    if ( ! $mobidul ) {
      // App::abort(202, 'No entry found.');
      return View::make('generateNew');
    } else {
      $station = Station::where('mobidulId', $mobidul->id)
        ->where('code', $stationCode)
        ->first();

      if ( ! $station ) {
        return View::make('mobimer', [
          'mobidul' => $mobidulCode,
          'mobidulName' => $mobidul->name
        ]);
      } else {
        \Log::info('station-mobid' . $station->mobidulId . ' mob-mobid' . $mobidul->id);

        if ( $station->mobidulId == $mobidul->id ) {
          return Redirect::to($mobidulCode . '/#/content/' . $station->id);
        } else {
          return View::make('mobimer', [
            'mobidul' => $mobidulCode,
            'mobidulName' => $mobidul->name
          ]);
        }
      }
    }
  }


  public function changeToStation($mobidulCode, $stationId)
  {
    $mobidul = Mobidul::where('code', $mobidulCode)->first();

    return View::make('mobimer', [
      'mobidul' => $mobidulCode,
      'mobidulName' => $mobidul->name,
      'startAbility' => 'switchcontent',
      'startItemId' => $station
    ]);
  }


  public function showStart($token = null)
  {
    if ( is_null($token) ) {
      return Response::make( file_get_contents(public_path() . '/angular.html') );
    } else {
      return Redirect::to('/#/restore/' . $token);
    }
  }


  public function activateAccount($token = null)
  {
    if ( is_null($token) ) {
      return Redirect::to('/');
    } else {
      $activated = User::activate($token);

      if ( ! $activated ) {
        return Redirect::to('/#/');
      } else {
        return Redirect::to('/#/activate');
      }
    }
  }
}
