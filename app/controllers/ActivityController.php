<?php

use App\Models\Activity;
use App\Models\User;

class ActivityController extends \BaseController {

  public function PushActivity ($mobidulCode)
  {
    // Access POST-Data:
    // First we fetch the Request instance
    $request = Request::instance();

    // Now we can get the content from it
    $content = $request->getContent();
    $activities = json_decode($content);

    if ( Auth::check() ) {
      $userId = Auth::id();
    } else {
      $userId = User::where('username', Session::getId())->first()->id;
    }

    foreach ($activities as $aIx => $activityData) {
      $activity = new Activity;
      $activity->code = $mobidulCode;
      $activity->user = $userId;
      $activity->type = $activityData->type;
      $activity->name = $activityData->name;
      $activity->payload = json_encode($activityData->payload);
      $activity->save();
    }

    // TODO: Add error handling
    $response = [
      'success' => true,
      'msg' => 'TODO: Add error handling.'
    ];

    return $response;
  }
}
