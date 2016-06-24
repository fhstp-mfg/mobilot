<?php

use App\Models\Mobidul;
use App\Models\Station;
use App\Models\User;

class HomeController extends BaseController {

    /*
    |--------------------------------------------------------------------------
    | Default Home Controller
    |--------------------------------------------------------------------------
    |
    | You may wish to use controllers instead of, or in addition to, Closure
    | based routes. That's great! Here is an example controller method to
    | get you started. To route to this controller, just add the route:
    |
    |    Route::get('/', 'HomeController@showWelcome');
    |
    */

    public function showWelcome()
    {
        return View::make('hello');
    }

    public function showMobidul($mobidulCode)
    {
        $mob = Mobidul::where('code', $mobidulCode)->first();

        if ( ! $mob )
        {
            //App::abort(202, 'No entry found.');
            return View::make('generateNew');
        }
        else
        {
            return View::make('mobimer', array('mobidul'      => $mobidulCode,
                                               'mobidulName'  => $mob->name,
                                               'startAbility' => $mob->startAbility,
                                               'startItemId'  => $mob->startItemId));
        }
    }

    public function showMobidulWithCode($mobidulCode, $stationCode)
    {
        $mob = Mobidul::where('code', $mobidulCode)->first();
        // \Log::info("mobidulid ".$mob->id);
        //
        // \Log::info("GETCONTENTFORCODE ");
        // \Log::info($mobidulCode."  ".$stationCode);

        //find stationid
        $station = Station::where('mobidulId', $mob->id)
                          ->where('code', $stationCode)
                          ->first();

        // \Log::info($station);


        if(!$mob) {
            //App::abort(202, 'No entry found.');
            return View::make('generateNew');
        }
        elseif(!$station)
        {
            return View::make('mobimer', array('mobidul'=>$mobidulCode, 'mobidulName'=>$mob->name));
        }
        else
        {
            \Log::info("station-mobid".$station->mobidulId." mob-mobid".$mob->id);
            if($station->mobidulId==$mob->id)
            {
                return Redirect::to($mobidulCode . '/#/content/' . $station->id);
                // 'stationCode'=>$station->id, 'mobidulName'=>$mob->name));//)->with('mobidul',$mobidulCode, $stationCode);
            }
            else
            {
                return View::make('mobimer', array('mobidul'=>$mobidulCode, 'mobidulName'=>$mob->name));
            }
        }
    }

    public function changeToStation($mobidulCode,$stationId)
    {
        $mob = Mobidul::where('code', $mobidulCode)->first();
        return View::make('mobimer', array('mobidul'=>$mobidulCode,
                                               'mobidulName'=>$mob->name,
                                                   'startAbility'=>"switchcontent",
                                                    'startItemId'=>$station));
    }

    public function showStart ($token = null)
    {
        // public_path() . '/index.html';

        if ( is_null($token) )
            return Response::make( file_get_contents(public_path() . '/angular.html') );
        else
            return Redirect::to('/#/restore/' . $token);

        // return View::make('index');
    }


    public function activateAccount ($token = null)
    {
        if ( is_null($token) )
            return Redirect::to('/');
        else
        {
            $activated = User::activate($token);

            if ( ! $activated )
                return Redirect::to('/#/');
            else
                return Redirect::to('/#/activate');
        }
    }

}
