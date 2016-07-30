<?php

use App\Models\Attachment;
use App\Models\Mobidul;
use App\Models\Station;

class AttachmentController extends \BaseController {

  public function saveTextFromComponent ($mobidulCode, $stationCode, $componentId) {

    $request = Request::instance();

    $content = json_decode($request->getContent());

    $stationId = Station::getId($stationCode);
    $mobidulId = Mobidul::getId($mobidulCode);

    if ( Auth::check() ){
      $userId = Auth::id();
    }else{
      $userId = User::where('username', Session::getId())->first()->id;
    }

    $attachment = new Attachment;
    $attachment->userId = $userId;
    $attachment->mobidulId = $mobidulId;
    $attachment->stationId = $stationId;
    $attachment->componentId = $componentId;
    $attachment->mediaType = 'text';
    $attachment->payload = json_encode($content->payload);
    $attachment->save();


    // TODO: Add error handling
    $response = [
      'success' => true,
      'msg' => 'TODO: Add error handling.'
    ];

    return $response;

    }

}