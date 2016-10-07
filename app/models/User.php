<?php

namespace App\Models;
use Auth;
use Log;
use Session;
use App;

use App\Models\User2Mobidul;
use App\Models\Mobidul;

class User extends \Eloquent /*implements RemindableInterface*/ {

  // use RemindableTrait;


  /**
   * The database table used by the model.
   *
   * @var string
   */
  protected $table = 'user';

  /**
   * The attributes excluded from the model's JSON form.
   *
   * @var array
   */
  protected $hidden   = array('password');
  protected $fillable = array('username', 'email', 'password', 'activated_at', 'activation_code', 'guest');



  public function user2Mobidul ()
  {
    return $this->hasMany('\App\Models\User2Mobidul', 'userId', 'id');
  }


  public static function getOrCreateGuest ()
  {
    $sessionId = Session::getId();
    $guest = static::where('username', $sessionId)->first();

    if ( ! $guest ) {
      $guest = new static;
      $guest->guest = true;
      $guest->username = $sessionId;
      $guest->save();
    } else {
      if ( ! $guest->guest ) {
        App::error(function (InvalidUserException $exception) {
          Log::error($exception);

          return 'Interner Fehler, dieser Account ist kein Gast!';
        });
      }
    }

    return $guest;
  }


  public static function getCurrentUser ()
  {
    if (Auth::check()) {
      $user = static::find( Auth::id() );

      if ($user->guest) {
        App::error(function (InvalidUserException $exception) {
          Log::error($exception);

          return 'Interner Fehler, dieser Account ist ein Gast!';
        });
      }
    } else {
      $user = static::getOrCreateGuest();

      if ( ! $user->guest ) {
        App::error(function (InvalidUserException $exception) {
          Log::error($exception);

          return 'Interner Fehler, dieser Account ist kein Gast!';
        });
      }
    }

    // NOTE: query user roles for (optionally given) mobidul

    // if ( ! is_null($mobidulCode) )
    // {
    //   \Log.info('Getting mobidulId for mobidulCode : ');
    //   \Log::info($mobidulCode);
    //
    //   $mobidulId = Mobidul::GetId($mobidulCode);
    //   \Log::info($mobidulId);
    //
    //
    //   if ( $this->isAdminInMobidul($mobidulId) )
    //   $user->role = 1;
    //
    //   else if ( $this->isPlayerInMobidul($mobidulId) )
    //   $user->role = 2;
    //
    //   else
    //   $user->role = 0;
    // }
    // else
    //   \Log::info('No mobidul code given.');
    //
    //
    // \Log::info('Returning CurrentUser');
    // \Log::info($user);


    return $user;
  }


  public static function getUserByEmail ($email)
  {
    $user = static::where('email', '=', $email)->first();

    return $user;
  }


  public static function getCurrentUserId ()
  {
    return static::getCurrentUser()->id;
  }


  public static function activate ($token)
  {
    $user = static::where('activation_code', '=', $token)->first();

    if ($user) {
      if ( ! $user->activated_at ) {
        \Log::info('Activating user at: ' . date('Y-m-d H:i:s', time()));
        $user->activated_at = date('Y-m-d H:i:s', time());
        $user->save();
      }

      return true;
    }

    return false;
  }


  public function isPlayerInMobidul ($mobidulId)
  {
    $user2Mobidul = static::user2Mobidul()
      ->where('userId', $this->id)
      ->where('mobidulId', $mobidulId)
      ->first();


    if ($user2Mobidul) {
      return $user2Mobidul->isPlayer();
    } else {
      return false;
    }
  }


  /**
   * @deprecated
   */
  public function isAdminInMobidul ($mobidulId)
  {
    if ($this->username == 'admin') {
      return true;
    }

    $rights = static::user2Mobidul()
      ->where('mobidulId', $mobidulId)
      ->first();

    if ($rights) {
      return $rights->rights == 1;
    } else {
      return false;
    }
  }


  /*public function isPlayerInMobidul ($mobidulId)
  {
    return static::user2Mobidul()
      ->where('userId',   $this->userId)
      ->where('mobidulId', $this->$mobidulId)
      ->first()
      ->rights == 2;
  }*/
}
