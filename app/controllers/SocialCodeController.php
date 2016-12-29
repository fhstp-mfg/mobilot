<?php


use App\Models\Mobidul;
use App\Models\Station;
use App\Models\SocialCodes;

class SocialCodeController extends BaseController
{
  public function getSocialCodes ($mobidulCode, $stationCode, $componentId)
  {
        $codeCheck = SocialCodes::where('stationStatus', $componentId)->first();

        if(!$codeCheck)
        {
          // Generate code
          $mobidulId = Mobidul::GetId($mobidulCode);
          $stationId = Station::GetId($stationCode);

          $request   = Request::instance();
          $content   = $request->getContent();
          $params    = json_decode($content);
          $length    = 6;

          // TODO: document PWGen parameters
          $pwgen    = new PWGen($length, false, true, false, true);
          $code     = $pwgen->generate();

          $counter   = 0;
          $maxTrys   = 1000;

          while ( $this->HasCode($code) )
          {
            if ( $counter > $maxTrys )
            {
              $counter = 0;
              $length++;
            }

            $code = $pwgen->generate();
            $counter++;
          }

          // TODO: implement max trys exception and try again functionality

          SocialCodes::create(
            array(
              'code'      => $code,
              'mobidulId' => $mobidulId,
              'stationId' => $stationId,
              'stationStatus' => $componentId
            )
          );

          return $code;
        }
        else
        {
          // send existing code
          return $codeCheck['code'];
        }
  }

  public function HasCode ($code)
  {
    \Log::info("code");
    \Log::info($code);

    return DB::table('socialcodes')
          ->select('code')
          ->where('code', $code)
          ->first();
  }

  public function social ($code)
  {
    \Log::info('Social Request: ' . $code);

    $response = $this->SocialCheck($code);

    if ( $response['success'] ) {
      $mobidulCode = $response['code'];
      $stationCode = $response['stationCode'];
      $componentId = $response['componentId'];

      return Redirect::to('/#/' . $mobidulCode . '/' . $stationCode . '/socialConfirm/'. $componentId . '/' .$code);
    }
    else {
      App::abort(404);
    }
  }

  public function JoinSocial ($code, $componentId)
  {
    \Log::info('JoinSocial : ' . $code . ' + ' . $componentId);

    $response = $this->SocialCheck($code);

    if ( $response['success'] )
    {
      if ($componentId == $response['componentId'])
      {
        return $response;
      } else {
        return [
          'success' => false,
          'errormsg' => 'componentFalse'
        ];
      }
    }
    else
    {
      return [
        'success' => false,
        'errormsg' => 'codeNotExists'
      ];
    }
  }

  public function SocialCheck ($code)
  {
    if ( $this->isCodeValid($code) )
    {
      $mobidulId = DB::table('socialcodes')
              ->select('mobidulId')
              ->where('code', $code)
              ->first()
              ->mobidulId;
      $stationId = DB::table('socialcodes')
              ->select('stationId')
              ->where('code', $code)
              ->first()
              ->stationId;
      $componentId = DB::table('socialcodes')
              ->select('stationStatus')
              ->where('code', $code)
              ->first()
              ->stationStatus;
     // TODO join these three calls together

      \Log::info("play with mobidulId");

      $mobidulCode = DB::table('mobidul')
                  ->select('code')
                  ->where('id', $mobidulId)
                  ->first()
                  ->code;
      $stationCode = DB::table('station')
                  ->select('code')
                  ->where('id', $stationId)
                  ->first()
                  ->code;

        return [
          'success' => true,
          'code'    => $mobidulCode,
          'stationCode' => $stationCode,
          'componentId' => $componentId
        ];
    }
    else
      return [
        'success' => false
      ];
    }

    public function isCodeValid ($code)
    {
      $code = SocialCodes::find($code);

      $isCodeValid = false;

      if ($code) {
        // $isCodeValid = $code->locked == 0;
        $isCodeValid = ! $code->locked;
      }

      return (int) $isCodeValid;
    }
}
