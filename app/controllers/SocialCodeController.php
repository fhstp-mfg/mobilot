<?php


use App\Models\Mobidul;
use App\Models\Station;
use App\Models\SocialCodes;

class SocialCodeController extends BaseController
{
  public function getSocialCodes ($mobidulCode, $stationCode, $status)
  {
        $mobidulId = Mobidul::GetId($mobidulCode);
        $stationId = Station::GetId($stationCode);

        $request   = Request::instance();
        $content   = $request->getContent();
        $params    = json_decode($content);
        //$mobidulId = Mobidul::GetId($mobidulCode);
        $length    = 6;

        // TODO: document PWGen parameters
        $pwgen    = new PWGen($length, false, true, false, true);
        $code     = $pwgen->generate();

        $counter   = 0;
        $maxTrys   = 1000;

        // TODO: look if there is a code for this mobidul/station combination

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
            'stationStatus' => $status
          )
        );


        return $code;
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

    $response = $this->JoinSocial($code);

    if ( $response['success'] ) {
      $mobidulCode = $response['code'];
      $stationCode = $response['stationCode'];
      $status = $response['status'];

      return Redirect::to('/#/' . $mobidulCode . '/' . $stationCode . '/socialConfirm/'. $status . '/' .$code);
    }
    else {
      App::abort(404);
    }
  }

  public function JoinSocial ($code)
  {
    \Log::info('JoinSocial : ' . $code);

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
      $status = DB::table('socialcodes')
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
        'status' => $status
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
