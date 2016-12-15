<?php

use App\Models\Station;
use App\Models\Category;
use App\Models\Category2Station;
use App\Models\Mobidul;
use App\Models\User;
use App\Models\User2Mobidul;
use App\Models\Attachment;
use App\Models\RestoreToken;

class UserController extends BaseController
{

  public function login ($credentials = null)
  {
    if ( is_null($credentials) ) {
      $request = Request::instance();
      $params  = $request->getContent();
      $params  = json_decode($params);

      $credentials = [
        'username' => $params->user,
        'password' => $params->password
      ];
    }

    $sessionId = Session::getId();
    $guest = User::where('username', $sessionId)->first();

    $authAttempt = Auth::attempt($credentials, true);

    if ($authAttempt) {
      $user = User::getCurrentUser();

      if ($user) {
        return 'success';
      } else {
        return 'wrong';
      }

      // if ($guest) {
      //   $mobidul = User2Mobidul::where('userId', $guest->id)->get();
      //
      //   foreach ($mobidul as $right) {
      //     $existingRight = User2Mobidul::where('mobidulId', $right->mobidulId)
      //       ->where('userId', $user->id)
      //       ->first();
      //
      //     if ( $existingRight
      //       && $existingRight->rights >= $right->rights
      //     ) {
      //       User2Mobidul::where('mobidulId', $right->mobidulId)
      //         ->where('userId', $user->id)
      //         ->delete();
      //
      //       if ( $existingRight->rights >= $right->rights ) {
      //         User2Mobidul::where('mobidulId', $right->mobidulId)
      //           ->where('userId', $right->userId)
      //           ->update([ 'userId' => $user->id ]);
      //       } else {
      //         User2Mobidul::where('mobidulId', $right->mobidulId)
      //           ->where('userId', $right->userId)
      //           ->delete();
      //       }
      //     }
      //
      //     Station::where('creator', $guest->id)
      //       ->update([ 'creator' => $user->id ]);
      //
      //     Attachment::where('userId', $guest->id)
      //       ->update([ 'userId' => $user->id ]);
      //
      //     $guest->delete();
      //   }
      //
      //   return 'success';
      // } else {
      //   return 'wrong';
      // }
    } else {
      return 'wrong';
    }
  }


  public function logout ()
  {
    Auth::logout();
    Session::flush();
    // NOTE: This is not necessarily needed !
    // Session::regenerate();

    return 'success';
  }


  public function register ()
  {
    $request  = Request::instance();
    $params   = $request->getContent();
    $params   = json_decode($params);

    $username = $params->user;
    $password = $params->password;
    $email    = $params->email;

    if ( ! $this->userExists($username) )
    {
      if ( ! $this->emailExists($email) )
      {
        $user = User::getCurrentUser();

        $token = $this->uuid(5, $email);

        $user->username = $username;
        $user->email = $email;
        $user->password = Hash::make($password);
        $user->activation_code = $token;
        $user->guest = false;
        $user->save();


        // NOTE: sends email with link to activate user account
        Mail::queue('emails.register', [ 'token' => $token ],
          function ($message) use ($email) {
            $message->to($email);
            $message->subject('Willkommen bei Mobilot :)');
          }
        );


        $credentials = [
          'username' => $username,
          'password' => $password
        ];

        $authAttempt = Auth::attempt($credentials, true);


        return $authAttempt ? 'success' : 'error';
      } else {
        return 'email-exists';
      }
    } else {
      return 'username-exists';
    }
  }


  public function getCurrentUser ()
  {
    return User::getCurrentUser();
  }


  public function sendFeedback () {
    $request = Request::instance();
    $params  = $request->getContent();
    $params  = json_decode($params);

    if ( isset($params->user)
      && isset($params->code)
      && isset($params->feedback)
    ) {
      $feedbackData = [
        'user' => $params->user,
        'code' => $params->code,
        'feedback' => $params->feedback
      ];

      $validator = Validator::make($feedbackData, [
        'user' => 'required|integer',
        'code' => 'required|string:255',
        'feedback' => 'required|string|min:3'
      ]);

      if ( $validator->passes() ) {
        $success = DB::table('feedback')->insert($feedbackData);
        echo 'ok';
      } else {
        echo 'wrong';
      }
    } else {
      echo 'wrong';
    }
  }


  public function changePassword ()
  {
    $request = Request::instance();
    $params  = $request->getContent();
    $params  = json_decode($params);

    $resetPassword = false;

    /// user data
    \Log::info('Route: ' . $params->route);
    $userData = array(
      'route'       => $params->route,
      'newPassword' => $params->newPassword
    );

    $rules = array(
      'newPassword' => 'required|between:6,30'
    );


    if ( strpos($userData['route'], 'changePasswordNoAuth') !== false ) {
      // route: changePasswordNoAuth

      $resetPassword = true;

      $userData['resetToken']      = $params->resetToken;
      $userData['confirmPassword'] = $params->confirmPassword;

      $rules['resetToken']      = 'required|size:32';
      $rules['confirmPassword'] = 'required|between:6,30';

      // NOTE: in order to have the right order in the error message if validation fails
      $rules['newPassword']     = $rules['newPassword'] . '|same:confirmPassword';
    } else {
      // route: changePassword

      $userData['oldPassword'] = $params->oldPassword;
      $rules['oldPassword'] = 'required|between:6,30';
    }


    $validator = Validator::make($userData, $rules);

    if ( $validator->fails() ) {
      // TODO: use own (german) messages
      return $validator->messages();
    } else {
      if ( ! $resetPassword ) {
        $user  = Auth::user();

        if ( ! Hash::check($params->oldPassword, $user->password) ) {
          $errorObj = array(
            'oldPassword' => array(
              'Das eingegebene Passwort stimmt nicht mit dem alten Passwort überein.'
            )
          );

          return json_encode($errorObj);
        } else {
          $currentUser = $this->getCurrentUser();
          $currentUser->password = Hash::make($params->newPassword);
          $currentUser->save();

          return 'success';
        }
      } else {
        // get email address for token
        $restoreToken = RestoreToken::getByToken($params->resetToken);

        // attempt to convert saved string to timestamp
        try {
          $tokenAddedOn = strtotime($restoreToken->added_on);
        } catch (Exception $ex) {
          $tokenAddedOn = false;
        }


        if ($tokenAddedOn !== false) {
          // check if token is still valid
          $now = time();
          $tokenValidTime = 86400; // 24h -> 60*60*24 = 86400 // seconds
          $validUntil = $tokenAddedOn + $tokenValidTime; // seconds

          if ($now < $validUntil) {
            // get user by email
            $user = User::getUserByEmail($restoreToken->email);

            // NOTE: no email is sent in the first place,
            // if a user with the given email address doesn't exist.

            $user->password = Hash::make($params->newPassword);
            $user->save();

            $credentials = [
              'username' => $user->username,
              'password' => $params->newPassword
            ];

            $loginResponse = $this->login($credentials);

            $retObj = $loginResponse;
          } else {
            $retObj = [
              'msg' => [
                0 => 'Dieses Wiederherstellungscode is nicht mehr gültig. Versuche ein neues anzufordern.'
              ]
            ];
          }


          // NOTE: finally remove this restore token
          try {
            $restoreToken->delete();
          } catch (Exception $ex) {
            // TODO: check which output to handle here
            Log::info($ex);
            Log::info($ex->getMessage());
          }

          return $retObj;
        } else {
          return [
            'msg' => [
              0 => 'Dieses Wiederherstellungscode is ungültig. Versuche ein neues anzufordern.'
            ]
          ];
        }
      }
    }
  }


  public function requestRestore ()
  {
    $request = Request::instance();
    $params  = $request->getContent();
    $params  = json_decode($params);


    $data = array(
      'email' => $params->email
    );

    $rules = array(
      'email' => 'required|email'
    );


    $validator = Validator::make($data, $rules);

    if ($validator->fails()) {
      // TODO: use own (german or better translated) messages
      return $validator->messages();
    } else {
      // TODO: check if user already has generated code, delete it

      // select user with that email address (if it exists)
      $userWithEmail = DB::table('user')
        ->where('email', $params->email)
        ->first();

      // only if it exists, generate restore code and send the email
      if ($userWithEmail) {
        // $token = str_random(32);
        $token = $this->uuid(5, $params->email);

        $restoreToken = new RestoreToken;
        $restoreToken->token    = $token;
        $restoreToken->email    = $params->email;
        $restoreToken->added_on = date('Y-m-d H:i:s', time());
        $restoreToken->save();


        // NOTE: sends email with link to restore password
        Mail::queue('emails.restore',
          array('token' => $token),

          function ($message) use ($params) {
            $message->to($params->email);
            $message->subject('Passwort bei Mobilot zurücksetzen');
          }
        );
      }

      // NOTE: even if there is no user assigned to the given email adress,
      //       the user is told, that an Email is on the way, since the
      //       user should not be told whether an email exists or not,
      //       and the real user will receive either way an email,
      //       if the email address really exists

      return 'success';
    }
  }


  public function userExists ($username)
  {
    return DB::table('user')
      ->select('username')
      ->where('username', $username)
      ->first();
  }


  public function emailExists ($email)
  {
    return DB::table('user')
      ->select('username')
      ->where('email',$email)
      ->first();
  }



  /// Helpers

  // TODO: move helper function to better location
  // NOTE: adapted from http://codegolf.stackexchange.com/a/20371
  private function uuid ($v, $d, $s = '')
  {
    $d .= time();
    $u  = hash($v^3?'sha1':'md5', $v^4?$d.$s:gmp_strval(gmp_random(4)));
    $u[12] = $v;
    $u[16] = dechex(+"0x$u[16]"&3|8);

    // NOTE - last param,changed from 36 to 32, since no "-" delimiters
    return substr(preg_replace('/^.{8}|.{4}/', '\0', $u, 4), 0, 32);
  }
}
