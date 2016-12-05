<?php

use App\Models\Codes;
use App\Models\Mobidul;
use App\Models\User;
use App\Models\User2Mobidul;


class CodeController extends BaseController
{

  public function play ($code)
  {
    \Log::info('Play Request: ' . $code);

    $response = $this->JoinMobidul($code);

    if ( $response['success'] ) {
      $mobidulCode = $response['code'];

      return Redirect::to('/#/' . $mobidulCode . '/map');
    } else {
      App::abort(404);
    }
  }


  public function JoinMobidul ($code)
  {
    \Log::info('JoinMobidul : ' . $code);

    if ( $this->isCodeValid($code) )  {
      $mobidulId =
        DB::table('codes')
          ->select('mobidulId')
          ->where('code', $code)
          ->first()
          ->mobidulId;

      \Log::info("play with $mobidulId");

      $userId = User::getCurrentUserId();

      \Log::info("user is logged in");

      if (
        ! DB::table('user2mobidul')
            ->where('userId', $userId)
            ->where('mobidulId', $mobidulId)
            ->first()
      ) {
        \Log::info("insert into $mobidulId");

        DB::table('user2mobidul')
          ->insert([
            'userId'    => $userId,
            'mobidulId' => $mobidulId,
            'rights'    => 2,
            'code'     => $code
          ]);

        \Log::info("created rights for play");
      } else {
        \Log::info("already plays in db $mobidulId");
      }

      $mobidulCode =
        DB::table('mobidul')
          ->select('code')
          ->where('id', $mobidulId)
          ->first()
          ->code;

      return [
        'success' => true,
        'code'    => $mobidulCode
      ];
    } else {
      return [
        'success' => false
      ];
    }
  }


  public function mobilePlay ($code)
  {
    if ( $this->isCodeValid($code) ) {
      $mobidulId =
        DB::table('codes')
          ->select('mobidulId')
          ->where('code', $code)
          ->first()
          ->mobidulId;

        \Log::info("play $mobidulId");

        $userId = User::getCurrentUserId();

        \Log::info("user is logged in");

        if (
          ! DB::table('user2mobidul')
              ->where('userId', $userId)
              ->where('mobidulId', $mobidulId)
              ->first()
        ) {
          \Log::info("insert into $mobidulId");

          DB::table('user2mobidul')
            ->insert([
              'userId'    => $userId,
              'mobidulId' => $mobidulId,
              'rights'    => 2,
              'code'     => $code
            ]);

          \Log::info("created rights");
        } else {
          \Log::info("already in db $mobidulId");
        }

        $mobidulCode =
          DB::table('mobidul')
            ->select('code')
            ->where('id', $mobidulId)
            ->first()
            ->code;

      return $mobidulCode;
    } else {
      return 'invalid';
    }
  }


  public function canIPlay ($mobidulCode)
  {
    $mobidulId = Mobidul::GetId($mobidulCode);
    $user = User::getCurrentUser();
    $user2Mobidul = $user->user2Mobidul()->where('mobidulId', $mobidulId)->first();

    if ( ! is_null($user2Mobidul) ) {
      $rights = $user2Mobidul->rights;

      if ( $rights == 2 ) {
        return 'allowed';
      }
    }

    return 'not-allowed';
  }


  public function getPlayCode ($mobidulCode)
  {
    $mobidulId = Mobidul::GetId($mobidulCode);

    if ( ! $this->GetIsOwnerOfMobidul($mobidulId) ) {
      return 'not owner';
    }


    $request   = Request::instance();
    $content   = $request->getContent();
    $params    = json_decode($content);
    $mobidulId = Mobidul::GetId($mobidulCode);
    $length    = 6;

    // TODO: document PWGen parameters
    $pwgen     = new PWGen($length, false, true, false, true);
    $code      = $pwgen->generate();
    $counter   = 0;
    $maxTrys   = 1000;


    while ( $this->HasCode($code) ) {
      if ( $counter > $maxTrys ) {
        $counter = 0;
        $length++;
      }

      $code = $pwgen->generate();
      $counter++;
    }

    // TODO: implement max trys exception and try again functionality
    Codes::create(
      array(
        'code'       => $code,
        'mobidulId' => $mobidulId
      )
    );

    return $code;
  }


  public function getCodes ($mobidulCode)
  {
    $mobidulId = Mobidul::GetId($mobidulCode);

    if ( $this->GetIsOwnerOfMobidul($mobidulId) ) {
      return Codes::where('mobidulId', $mobidulId)->get();
    } else {
      return 'not owner';
    }
  }


  public function closeCode ($co)
  {
    $code = Codes::find($co);

    if ( $code ) {
      if ( $this->GetIsOwnerOfMobidul($code->mobidulId) ) {
        $code->locked = true;
        $code->save();

        return 'success';
      } else {
        return 'not owner';
      }
    } else {
      return 'not existing';
    }
  }


  public function openCode ($co)
  {
    $code = Codes::find($co);

    if ( $code ) {
      if ( $this->GetIsOwnerOfMobidul($code->mobidulId) ) {
        $code->locked = false;
        $code->save();

        return 'success';
      } else {
        return 'not owner';
      }
    } else {
      return 'not existing';
    }
  }


  public function deleteCode ($co)
  {
    $code = Codes::find($co);

    if ( $code ) {
      if ( $this->GetIsOwnerOfMobidul($code->mobidulId) ) {
        $code->delete();

        return 'success';
      } else {
        return 'not owner';
      }
    } else {
      return 'not existing';
    }
  }


  public function GetOwnerOfMobidul ($mobidulId)
  {
    $users =
      User2Mobidul::where('mobidulId', $mobidulId)
                  ->where('rights', 1)
                  ->get();

    if ( ! is_null($users->first())
      && ! is_null($users->first()->userId)
    ) {
      return $users->first()->userId;
    } else {
      return -1;
    }
  }


  public function GetIsOwnerOfMobidul ($mobidulId)
  {
    if ( Auth::check() && Auth::user()->username == 'admin' ) {
      return true;
    }

    // if ( $this->GetOwnerOfMobidul($mobidulId) == Auth::id() ) {
    //   return true;
    // } else {
    //   return false;
    // }

    $isOwnerOfMobidul = $this->GetOwnerOfMobidul($mobidulId) == Auth::id();

    return $isOwnerOfMobidul;
  }


  public function HasCode ($code)
  {
    \Log::info("code");
    \Log::info($code);

    $hasCode =
      DB::table('codes')
        ->select('code')
        ->where('code', $code)
        ->first();

    return $hasCode;
  }


  public function isCodeValid ($code)
  {
    $code = Codes::find($code);
    $isCodeValid = false;

    if ( $code ) {
      // $isCodeValid = $code->locked == 0;
      $isCodeValid = ! $code->locked;
    }

    return (int) $isCodeValid;
  }
}
