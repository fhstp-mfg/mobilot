<?php

use App\Models\Activity;

class ActivityController extends \BaseController {

  public function PushActivity ($mobidulCode)
  {
    // Access POST-Data:
    // First we fetch the Request instance
    $request = Request::instance();

    // Now we can get the content from it
    $content = $request->getContent();
    $activities = json_decode($content);

    foreach ($activities as $aIx => $activityData) {
      $activity = new Activity;
      $activity->code = $mobidulCode;
      $activity->type = $activityData->type;
      $activity->name = $activityData->name;
      $activity->payload = json_encode($activityData->payload);
      $activity->save();
    }

    $response = [
      'success' => true,
      'msg' => "If something went wrong, we don't know about it!"
    ];

    return $response;
  }
}
