<?php

use App\Models\Station;
use App\Models\Category;
use App\Models\Category2Station;
use App\Models\Mobidul;
use App\Models\NavigationItem;
use App\Models\User;
use App\Models\User2Mobidul;
use App\Models\Attachment;


class WebServicesController extends BaseController
{

  public function isMobidulCodeProtected ($name)
  {
    // NOTE - this would be nicer if methods, directories, files, webservices and
    $protectedMobidulNames =
      array(
        "RequestValidCode",
        "GetForCode",         "GetForCategory",           "GetForLocation",
        "GetNearLocation",    "GetForTime",               "GetNearTime",
        "GetCategories",      "GetMobiduls",              "GetContent",
        "GetStation",         "GetCategoriesForStation",  "Play",
        "CanPlay",            "NewMobidul",               "UpdateMobidul",
        "PushActivity",       "CloneMobidul",             "exportImages",
        "AddCategories",      "UpdateCategories",         "RemoveCategories",
        "AddStation",         "RemoveCategory",           "SetStation",
        "RemoveStation",      "RemoveStationByCode",      "GetContentForCode",
        "UpdateNavigation",   "GetPlayCode",              "changePassword",
        "login",              "logout",                   "register",
        "index",              "index.html",               "index.php",
        "getConfig",          "isMobidul",                "image",
        "saveImage",          "GetOwnerOfMobidul",        "IsOwnerOfMobidul",
        "IsLoggedIn",         "existsMobidul",            "existsStation",
        "DeleteMobidul",      "delete",
        "GetOptions",         "SetOptions",
        "css",                "elements",                 "favicon",
        "img",                "imgs",                     "js",
        "src",                "style",                    "upload",
        "Codes",              "CloseCode",                "OpenCode",
        "DeleteCode",         "media",                    "includes"
      );

    return in_array($name, $protectedMobidulNames);
  }


  public function GenerateStationCode ($stationCode = null)
  {
    // \Log::info('GenerateStationCode');

    $maybeStationCode = $stationCode;
    $newStationCode   = $stationCode;
    $appendCounter    = 2;

    $exists = true;

    while ( $exists )
    {
      $exists = Station::findByCode($newStationCode);

      if ( $exists )
      {
        $newStationCode = $maybeStationCode . $appendCounter;
        $appendCounter++;
      }
      else
        break;
    }

    return $newStationCode;
  }


  public function GetForCode ($mobidulCode, $stationCode)
  {
    // \Log::info('GET_FOR_CODE');

    $result = DB::table('station')
                ->where('mobidulId', Mobidul::GetId($mobidulCode))
                ->where('code', $stationCode)
                ->first();

    $stationId = $result->id;

    $categories = $this->GetCategoriesForStation($mobidulCode, $stationId);
    // \Log::info($categories);

    // \Log::info($result);
    // \Log::info($result->locked);
    // \Log::info($result->enabled);


    $stationData =
    [
      'name'        => $result->name,
      'code'        => $result->code,
      'lat'         => $result->lat,
      'lon'         => $result->lon,
      'radius'      => $result->radius,
      'content'     => $result->content,
      'contentType' => $result->contentType,
      'locked'      => (int) $result->locked,
      'enabled'     => (int) $result->enabled,
      'categories'  => $categories
      // 'medialist'   => []
    ];

    // \Log::info($stationData);

    return json_encode($stationData);
  }


  public function IsLoggedIn()
  {
    // if ( Auth::check() )
    // {
    //   return "true";
    // }
    // else
    // {
    //   return "false";
    // }

    return Auth::check() ? 'true' : 'false';
  }


  public function GetForCategoryId ($mobidulCode, $categoryId)
  {
    $mobidulId  = Mobidul::GetId($mobidulCode);

    $stationIds = DB::table('category2station')
                    ->select('stationId')
                    ->where('categoryId', $categoryId)
                    ->get();

    $station = DB::table('station')
                  ->select(
                    'id', 'code', 'lat', 'lon',
                    'name', 'type', 'order', 'station.updated_at'
                  )
                  ->join('category2station', 'station.id', '=', 'category2station.stationId')
                  ->where('category2station.categoryId', $categoryId)
                  ->where('mobidulId', $mobidulId)
                  // ->orderBy('name')
                  ->orderBy('order')
                  ->get();


    return json_encode($station);
  }


  /*public function GetForLocation ($mobidulCode, $lat, $lon, $acc)
  {
    $mobidulId = Mobidul::GetId($mobidulCode);

    $result = DB::select("SELECT *, 3956 * 2 * ASIN(SQRT(POWER(SIN(($lat - abs(lat)) *pi()/180/2),2) + COS($lat * pi()/180)*COS(abs(lat)*pi()/180)*POWER(SIN(($lon - lon)*pi()/180 /2),2))) AS distance FROM station WHERE mobidulId = $mobidulId HAVING distance <= (($acc + radius)/1609.344) ORDER BY distance");

    return json_encode($result);
  }*/


  public function GetStations ($mobidulCode)
  {
    $mobidulId = Mobidul::GetId($mobidulCode);

    $result = DB::table('station')
                ->select(
                  'id', 'code', 'lat', 'lon',
                  'name', 'type', 'order', 'updated_at'
                )
                ->where('mobidulId', $mobidulId)
                ->where('enabled', '<>', 1)
                // ->orderBy('name')
                ->orderBy('order')
                ->get();

    // check if user has rights to edit
    foreach ( $result as $station )
    {
      $station->canEdit =
        is_bool( $this->CanEditStation( $station->id ) ) &&
        $this->CanEditStation( $station->id )            &&
        $this->IsAllowed( $mobidulCode );
    }

    return $result;
  }


  public function GetAllStations ($mobidulCode)
  {
    $mobidulId = Mobidul::GetId($mobidulCode);

    $result = DB::table('station')
                ->select(
                'id', 'code', 'lat', 'lon',
                'name', 'type', 'order', 'updated_at'
                )
                ->where('mobidulId', $mobidulId)
                // ->orderBy('name')
                ->orderBy('order')
                ->get();

    foreach ( $result as $station )
    {
      $station->canEdit =
        is_bool( $this->CanEditStation( $station->id ) ) &&
        $this->CanEditStation( $station->id )            &&
        $this->IsAllowed( $mobidulCode );
    }

    return $result;
  }


  public function GetOptions ($mobidulCode)
  {
    // \Log::info($mobidulCode);

    $result = Mobidul::where('code', $mobidulCode)->options()->first();

    return $result;
  }


  // TODO when creating a new mobidul, this webservice returns an 500 Internal Server Error
  public function SetOptions ($mobidulCode)
  {
    if ( $this->GetIsOwnerOfMobidul($mobidulCode) )
    {
      $request = Request::instance();
      $content = $request->getContent();
      // \Log::info($content);

      $mobidulOptionsJson = json_decode($content);


      $m = Mobidul::findByCode($mobidulCode);

      $m->showMenu             = $mobidulOptionsJson->showMenu;
      $m->allowedStationTypes  = $mobidulOptionsJson->allowedStationTypes;
      $m->automaticPollingTime = $mobidulOptionsJson->automaticPollingTime;
      $m->editingDistance      = $mobidulOptionsJson->editingDistance;
      $m->private              = $mobidulOptionsJson->private;
      $m->locked               = $mobidulOptionsJson->locked;
      $m->font                 = $mobidulOptionsJson->font;
      $m->editMode             = $mobidulOptionsJson->editMode;

      $m->save();


      /*
      DB::table('mobidulOptions')
        ->where('mobidulId', $mobidulId)
        ->update(array('showMenu' => $mobidulOptionsJson->showMenu,
                'allowedStationTypes' => $mobidulOptionsJson->allowedStationTypes,
                'automaticPollingTime' => $mobidulOptionsJson->automaticPollingTime,
                'editingDistance' => $mobidulOptionsJson->editingDistance,
                'private' => $mobidulOptionsJson->private,
                'locked' => $mobidulOptionsJson->locked
                ));
        Log::info("success");
      */

      return 'success';
    }
    else
      return 'not-allowed';
  }


  /*public function GetNearLocation ($mobidulCode, $lat, $lon, $dist)
  {
    $mobidulId = Mobidul::GetId($mobidulCode);

    $result = DB::select("SELECT *, 3956 * 2 * ASIN(SQRT(POWER(SIN(($lat - abs(lat)) *pi()/180/2),2) + COS($lat * pi()/180)*COS(abs(lat)*pi()/180)*POWER(SIN(($lon - lon)*pi()/180 /2),2))) AS distance FROM station WHERE mobidulId = $mobidulId HAVING distance <= $dist ORDER BY distance");

    return json_encode($result);
  }*/


  /*public function GetForTime($mobidulCode,$time)
  {
    $mobidulId = Mobidul::GetId($mobidulCode);
    $result = DB::table('station')
      ->where('mobidulId', $mobidulId)
      ->get();

    return json_encode($result);
  }


  public function GetNearTime($mobidulCode,$time,$timespan)
  {
    $mobidulId = Mobidul::GetId($mobidulCode);
    $result = DB::table('station')
      ->where('mobidulId', $mobidulId)
      ->get();

    return json_encode($result);
  }


  function getWeather ($data)
  {
    $url = 'http://weather.yahooapis.com/forecastjson?';

    foreach ($data as $key => $value)
    {
      $url .= "$key=$value&";
    }

    //remove last amp
    $url   = trim(substr($url, 0, -1));
    $result = file_get_contents($url);

    return $result;
  }*/


  public function GetCategories ($mobidulCode)
  {
    return DB::table('category')
              ->select('id', 'name')
              ->where( 'mobidulId', Mobidul::GetId($mobidulCode) )
              ->get();
  }


  public function GetMobiduls ()
  {
    return Mobidul::pub()->basicInformation()->get();
  }


  /**
   * Creates new Mobidul with request data, checks if code is protected or already used
   * If Mobidul is created, current user is assigned to it
   *
   * @return array('success' -> boolean, 'msg' -> string, ['code' -> string])
   */
  public function NewMobidul ()
  {
    \Log::info("New Mobidul begin!");

    $request = Request::instance();
    $content = $request->getContent();

    $json = json_decode($content);
    $code = $json->code;
    $name = $json->name;
    $mode = $json->mode;

    $description = isset($json->description)
                    ? $json->description
                    : 'Ein tolles Mobidul entsteht hier.';

    //check if mobidul code is a protected key word
    if ( $this->isMobidulCodeProtected($code) )
      return $response = [
        'success' => false,
        'msg'     => 'Dieses Mobidul Code ist geschützt und kann nicht verändert werden!'
      ];


    if ( ! Mobidul::HasMobidulId($code) )
    {
      \Log::info("Mobidul gets created!");

      $mobidul = Mobidul::create(
      [
        'name'    => $name,
        'code'    => $code,
        'description' => $description,
        'mode'    => $mode
      ]);

      $userId = Auth::id();
      //$category = Category::create(['name' => 'Allgemein', 'mobidulId' => $mobidul->id]);

      DB::table('user2mobidul')->insert(
      [
        'userId'  => $userId,
        'mobidulId' => $mobidul->id,
        'rights'  => 1
      ]);


      return $response = [
        'success' => true,
        'msg'   => 'Glückwunsch! Dein Mobidul wurde erfolgreich erstellt.',
        'code'  => $code
      ];
    }
    else
      return $response = [
        'success' => false,
        'msg'   => 'Dieses Mobidul Code ist schon vergeben! Bitte versuche einen anderen Code.'
      ];
  }


  public function DeleteMobidul ()
  {
    $request = Request::instance();
    $content = $request->getContent();

    $json = json_decode($content);
    $mobidulCode = $json->mobidulCode;


    if ( $this->GetIsOwnerOfMobidul($mobidulCode) )
    {
      try
      {
        DB::beginTransaction();
        $mobidulId = Mobidul::GetId($mobidulCode);

        DB::statement('SET FOREIGN_KEY_CHECKS = 0');

        DB::table('mobidul')->where('id', $mobidulId)->delete();
        DB::table('user2mobidul')->where('mobidulId', $mobidulId)->delete();

        $stations = Station::select('id')->where('mobidulId', $mobidulId)->get()->toArray();

        if ( count($stations) > 0 )
        {
          DB::table('station')->where('mobidulId', $mobidulId)->delete();
          DB::table('station2attachment')->whereIn('station_id', $stations)->delete();
          DB::table('category2station')->whereIn('stationId', $stations)->delete();
        }

        // TODO check if this is needed !
        DB::table('attachment')->where('mobidulId', $mobidulId)->delete();

        // $categories = DB::table('category')->select('id')->where('mobidulId',$mobidulId)->get();
        DB::table('category')->where('mobidulId', $mobidulId)->delete();
        // DB::table('category2station')->whereIn('idcategoryId',$categories)->delete();

        DB::table('codes')->where('mobidulId', $mobidulId)->delete();

        DB::table('navigationitems')->where('mobidulId', $mobidulId)->delete();
        // TODO check if this is needed ! (why 4 times)
        DB::table('attachment')->where('mobidulId', $mobidulId)->delete();
        DB::table('attachment')->where('mobidulId', $mobidulId)->delete();
        DB::table('attachment')->where('mobidulId', $mobidulId)->delete();
        DB::table('attachment')->where('mobidulId', $mobidulId)->delete();
        // TODO END
        DB::statement('SET FOREIGN_KEY_CHECKS = 1');
        DB::commit();


        return [
          'success' => true,
          'msg'   => 'Mobidul wurde erfolgreich gelöscht. Wir würden uns freuen dich wieder zu sehen!'
        ];
      }
      catch (\Laravel\Database\Exception $e)
      {
        DB::connection()->pdo->rollBack();
        DB::statement('SET FOREIGN_KEY_CHECKS = 1');

        $exMarker = uniqid();
        Log::info('Exeption uniqid : ' . $exMarker);
        Log::exception($e);


        return [
          'success' => false,
          'msg'   => 'Mobidul konnte nicht gelöscht werden. Bitte informieren Sie einen Administrator über den unbekannten Fehler (' . $exMarker . ').'
        ];
      }
    }
    else
    {
      return [
      'success' => false,
      'msg'   => 'Sie haben nicht die notwendigen Berechtigungen, um dieses Mobidul zu löschen.'
      ];
    }
  }


  public function stationExists ($mobidulCode, $stationCode)
  {
    $mobidulId = Mobidul::GetId($mobidulCode);

    $station = Station::where('mobidulId', $mobidulId)
                      ->where('code', $stationCode)
                      ->first();

    if ( $station )
      return array(
        'exists'      => true,
        'mobidulCode' => $mobidulCode,
        'stationCode' => $stationCode
      );
    else
      return array(
        'exists'      => false,
        'mobidulCode' => $mobidulCode,
        'stationCode' => $stationCode
      );
  }


  public function stationExistsById ($mobidulCode, $stationId)
  {
    $mobidulId = Mobidul::GetId($mobidulCode);

    $station = Station::where('mobidulId', $mobidulId)
                      ->where('id', $stationId)
                      ->first();

    if ( $station )
      return array(
        'exists'      => true,
        'mobidulCode' => $mobidulCode,
        'stationId'   => $stationId
      );
    else
      return array(
        'exists'      => false,
        'mobidulCode' => $mobidulCode,
        'stationId'   => $stationId
      );
  }


  /**
   *  Checks if mobidulCode is already used and whether it is protected
   *  The return format looks like this because this replaces frontend calls which where directed to 'mobidulExists', that didn't check for protected names
   *
   * @param $mobidulCode
   * @return array('exists' -> boolean, 'mobidulCode' -> string)
   */
  public function checkMobidulCode ($mobidulCode)
  {
    $name = $this->mobidulExists($mobidulCode);

    if ( $this->isMobidulCodeProtected($mobidulCode) || $name['exists'] )
      return array(
        'exists'      => true,
        'mobidulCode' => $mobidulCode
      );
    else
      return array(
        'exists'      => false,
        'mobidulCode' => $mobidulCode
      );
  }

  /**
   *  Checks if mobidulCode is already used
   *
   * @param $mobidulCode
   * @return array('exists' -> boolean, 'mobidulCode' -> string)
   */
  public function mobidulExists ($mobidulCode)
  {
    $mobidul = Mobidul::where('code', $mobidulCode)->first();

    if ( $mobidul )
      return array(
        'exists'      => true,
        'mobidulCode' => $mobidulCode
      );
    else
      return array(
        'exists'      => false,
        'mobidulCode' => $mobidulCode
      );
  }


  public function UpdateMobidul ($mobidulCode)
  {
    // \Log::info('UpdateMobidul : ' . $mobidulCode);

    $response = [
      'success' => false,
      'msg'   => 'Du hast nicht die notwendigen Berechtigungen dieses Mobidul zu aktualisieren!'
    ];

    if ( $this->GetIsOwnerOfMobidul($mobidulCode) )
    {
      // Access POST-Data:
      // First we fetch the Request instance
      $request = Request::instance();

      // Now we can get the content from it
      $content     = $request->getContent();
      $mobidulJson = json_decode($content);

      $mobidul = Mobidul::where('code', $mobidulCode)->first();

      if ( $mobidul != null )
      {
        $mobidul->name    = $mobidulJson->name;
        $mobidul->code    = $mobidulJson->code;
        $mobidul->description = $mobidulJson->description;

        $mobidul->save();


        $response = [
          'success' => true,
          'msg'   => 'Mobidul wurde aktualisiert.'
        ];
      }
      else
        $response = [
          'success' => false,
          'msg'   => 'Mobidul konnte nicht aktualisiert werden!'
        ];
    }

    return $response;
  }


  public function CloneMobidul ($mobidulCode)
  {
    $mobidul = Mobidul::findByCode($mobidulCode);

    return $mobidul->name;
  }


  public function GetOwnerOfMobidul ($mobidulCode)
  {
    $mobidulId = Mobidul::GetId($mobidulCode);

    $users = User2Mobidul::where('mobidulId', $mobidulId)
               ->where('rights', 1)
               ->get();

    if ( ! is_null($users->first()) &&
         ! is_null($users->first()->userId)
    ) {
      return $users->first()->userId;
    }
    else {
      return -1;
    }
  }


  public function IsOwnerOfMobidul ($mobidulCode)
  {
    // if ( $this->GetIsOwnerOfMobidul($mobidulCode) )
    // {
    //   return "true";
    // }
    // else
    // {
    //   return "false";
    // }

    return $this->GetIsOwnerOfMobidul($mobidulCode) ? 'true' : 'false';
  }


  /**
   * Returns if current user is owner of the passed mobidul
   * Admin is always 'true'
   *
   * @param $mobidulCode
   * @return bool
   */
  public function GetIsOwnerOfMobidul ($mobidulCode)
  {
    // \Log::info('********************');
    // \Log::info('Check is owner of mobidul');
    // \Log::info(Auth::check() && Auth::user()->username == 'admin');
    // \Log::info($this->GetOwnerOfMobidul($mobidulCode) == Auth::id());

    if ( Auth::check() && Auth::user()->username == 'admin' )
      return true;

    return $this->GetOwnerOfMobidul($mobidulCode) == Auth::id();
  }


  public function GetRoleForMobidul ($mobidulCode = null)
  {
    if ( ! is_null($mobidulCode) )
    {
      // \Log::info('Getting mobidulId for mobidulCode : ');
      // \Log::info($mobidulCode);

      $mobidulId = Mobidul::GetId($mobidulCode);
      // \Log::info($mobidulId);

      // \Log::info(' Is Allowed ');
      // \Log::info($this->IsAllowed($mobidulCode));
      // \Log::info(' Is Allowed ');
      // \Log::info(' Is Allowed ');

      if ( $this->GetIsOwnerOfMobidul($mobidulCode) ) {
          $role = 1;
      }
      else if ( $this->IsAllowed($mobidulCode) == true ||
                $this->IsAllowed($mobidulCode) === 'allowed' ) {
          $role = 2;
      }
      else {
          $role = 0;
      }


      return [
        'role' => $role
      ];
    }
    else {
        return 'error';
    }
  }


  public function GetMyMobiduls ()
  {
    if ( Auth::check() )
    {
      $userid = Auth::id();

      return DB::table('user2mobidul')
                ->where('userId', $userid)
                ->whereIn('rights', array(1, 2))
                ->leftJoin('mobidul', 'mobidul.Id', '=', 'user2mobidul.mobidulId')
                ->select('id', 'name', 'description', 'mobidul.code', 'background', 'foreground', 'rights')
                ->get();
    }

    return 'not-loggedin';
  }


  public function GetNewestMobiduls ()
  {
    return Mobidul::pub()->newestFirst()->basicInformation()->get();
  }


  public function MobidulNearMe($latitude, $longitude)
  {
    //SELECT mob.id, MIN( ( 6371 * acos( cos( radians($latitude) ) * cos( radians( st.lat ) ) * cos( radians( st.lon ) - radians($longitude) ) + sin( radians($latitude) ) * sin( radians( st.lat ) ) ) ) ) AS distance FROM mobidul as mob JOIN station as st ON st.mobidulId = mob.id GROUP BY mob.id ORDER BY distance

    $mobiduls = DB::select('SELECT mob.id, mob.code, mob.description, mob.name, mob.background, MIN( ( 6371 * acos( cos( radians(:lat) ) * cos( radians( st.lat ) ) * cos( radians( st.lon ) - radians(:lon) ) + sin( radians(:latx) ) * sin( radians( st.lat ) ) ) ) ) AS distance FROM mobidul as mob JOIN station as st ON st.mobidulId = mob.id GROUP BY mob.id ORDER BY distance', array('lat'=>$latitude, 'lon'=>$longitude, 'latx'=>$latitude)); //()->getPdo()->exec( $sql );

    return $mobiduls;
  }


  public function GetContent ($stationId)
  {
    $station = Station::find($stationId);

    if ( $station )
    {
      // medialist und imagelist holen
      // echo $role->pivot->created_at;
      $mediaList = [];


      // get this medialist, the dirty way !

      $pivotEntries = DB::table('station2attachment')
                        ->where('station_id', $stationId)
                        ->orderBy('created_at', 'asc')
                        ->get();

      foreach ( $pivotEntries as $pivotEntry )
      {
        $attachment = Attachment::find($pivotEntry->attachment_id);

        $mediaList[] = [
          "hash"      => $attachment->hash,
          "url"       => $attachment->url,
          "timestamp" => $attachment->created_at->format('d.m.Y H:i:s')
        ];

        \Log::info("got attachment " . $pivotEntry->attachment_id . " for station " . $pivotEntry->station_id . " " . $attachment->hash);
      }

      //arranging coords
      $coords = array('lat' => $station->lat, 'lon' => $station->lon);

      $stationContent = [
        'stationId'   => $stationId,
        'stationName' => $station->name,
        'content'     => $station->content,
        'order'       => $station->order,
        'mediaList'   => $mediaList,
        'coords'      => $coords
      ];

      $stationContent['canEdit'] = is_bool( $this->CanEditStation( $station->id ) ) &&
                                   $this->CanEditStation( $station->id );

      return $stationContent;
    }
    else
      return '';
  }


  public function GetContentForCode ($mobidulCode, $stationCode)
  {
    // \Log::info('GetContentForCode ');
    // \Log::info($mobidulCode . ' ' . $stationCode);

    // find stationid
    $mobidulId = Mobidul::GetId($mobidulCode);
    // \Log::info($mobidulId);

    $station = Station::where('mobidulId', $mobidulId)
                      ->where('code', $stationCode)
                      ->first();

    // \Log::info($station);

    if ( $station != null )
      return $this->GetContent( $station->id );
    else
      return '';
  }


  public function AddCategories ($mobidulCode)
  {
    // Access POST-Data:
    // First we fetch the Request instance
    $request = Request::instance();

    // Now we can get the content from it
    $content = $request->getContent();
    $categoryNamesJson = json_decode($content);

    if ( empty($categoryNamesJson) )
      return 'no-category';


    $mob = Mobidul::where('code', $mobidulCode)->first();
    if ( ! $this->GetIsOwnerOfMobidul($mobidulCode) )
      return 'not allowed';


    if ( isset($mob) )
    {
      foreach ( $categoryNamesJson as $element )
      {
        if ( $this->HasCategoryName($element->name, $mob->id) )
          return 'category-exists';
      }

      foreach ( $categoryNamesJson as $element )
      {
        $category = new Category(['name' => $element->name]);
        $mob->categories()->save($category);
      }

      return 'success';
    }

    return 'error';
  }


  public function UpdateCategories ($mobidulCode)
  {
    // Access POST-Data:
    // First we fetch the Request instance
    $request = Request::instance();

    // Now we can get the content from it
    $content = $request->getContent();
    $categoryNamesJson = json_decode($content);


    if ( empty($categoryNamesJson) )
      return 'Keine Kategorie angegeben';


    if ( ! $this->GetIsOwnerOfMobidul($mobidulCode) )
      return 'not allowed';



    $mob = Mobidul::where('code', $mobidulCode)->first();

    foreach ( $categoryNamesJson as $element )
    {
      $elementId = ( isset($element->id) && $element->id !== 'x' ) ? $element->id : null;

      if ( ! is_null($elementId) )
      {
        $cat = Category::where('id', $element->id)->first();

        if ( $cat != null )
        {
          $cat->name = $element->name;
          $cat->save();
        }
      }
      else
      {
        \Log::info('Keine "catid" für element "' . $element->name . '"');

        $category = new Category(['name' => $element->name]);

        // TODO - depending on the PHP version, if supported, use the following line instead of the previous one.
        //$category = new Category(['name' => $element->name]);
        $mob->categories()->save($category);
      }
    }

    return 'success';
  }


  // Removes (only) one category.
  public function RemoveCategory ($mobidulCode, $categoryId)
  {
    if ( ! $this->GetIsOwnerOfMobidul($mobidulCode) )
      return 'not-allowed';

    if ( ! empty($categoryId) )
    {
      $category = Category::where('id', $categoryId);

      if ( $category->count() == 0 )
        return 'not-existing';


      DB::beginTransaction();

      $navigationItem   = NavigationItem::where('categoryId',   $categoryId);
      $category2Station = Category2Station::where('categoryId', $categoryId);


      // delete NavigationItem
      if ( $navigationItem->count() > 0 )
        $navigationItem->delete();

      // delete Category2Station
      if ( $category2Station->count() > 0 )
        $category2Station->delete();

      // delete Category
      if ( $category->count() > 0 )
        $deletedCategory = $category->delete();


      DB::commit();

      return 'success';
    }
    else
      return 'empty';
  }


  /**
   * Creates Station, check if user is authorized, stationCode is available
   * Also creates entries in 'category2station' and 'station2attachment'
   *
   * @param $mobidulCode
   * @return string
   */
  public function AddStation ($mobidulCode)
  {
    // \Log::info('> ADD STATION');

    $mobidulId = Mobidul::GetId($mobidulCode);

    if ( ! $this->isAllowed($mobidulCode) )
      return 'not allowed';


    if ( Mobidul::find($mobidulId)->locked &&
         ! $this->GetIsOwnerOfMobidul($mobidulCode) )
      return 'mobidul locked';


    $request = Request::instance();
    $params  = $request->getContent();
    $params  = json_decode($params);

    $userId  = User::getCurrentUserId();


    if ( Station::findByCode($params->code) )
      return 'invalid station code';


    //get current order of station
    $order = Station::getCurrentOrder($mobidulId);

    //\Log::info('order: ' . $order);

    $hasWorked = DB::table('station')
                    ->insert([
                      'name'    => $params->name,
                      'mobidulId'   => $mobidulId,
                      'code'    => $params->code,
                      'lat'     => $params->lat,
                      'lon'     => $params->lon,
                      'radius'    => $params->radius,
                      'content'   => $params->content,
                      'contentType' => $params->contentType,
                      'creator'   => $userId,
                      'locked'    => $params->locked,
                      'enabled'   => $params->enabled,
                      'order'     => $order
                    ]);


    if ( $hasWorked )
    {
      $newStationId   = DB::getPdo()->lastInsertId();
      $newStationCode = Station::GetCode($newStationId);

      // \Log::info($params->categories);

      foreach ( $params->categories as $category )
      {
        if ( $category->selected )

          DB::table('category2station')
            ->insert([
              'categoryId' => $category->id,
              'stationId'  => $newStationId
            ]);
      }


      foreach ( $params->medialist as $mediaitem )
      {
        $attachment = Attachment::where('hash', $mediaitem->hash)->first();

        if ( $attachment == null )
        {
          //attachment zur späteren Verwendung anlegen
          $attachment = Attachment::create(
            array(
              'mobidulId' => $mobidulId,
              'hash'    => $mediaitem->hash
            )
          );
        }

        DB::table('station2attachment')
          ->insert([
            'attachment_id' => $attachment->id,
            'station_id'  => $newStationId
          ]);
      }

      return $newStationCode;
    }
    else
      return 'error';
  }


  public function SaveStation ($mobidulCode, $stationCode)
  {
    $mobidulId = Mobidul::GetId($mobidulCode);
    $stationId = Station::GetId($stationCode);


    if ( ! $this->isAllowed($mobidulCode) )

      return array(
        'saved' => false,
        'msg'   => 'not allowed'
      );


    if ( Mobidul::find($mobidulId)->locked &&
       ! $this->GetIsOwnerOfMobidul($mobidulCode) )

      return array(
        'saved' => false,
        'msg'   => 'mobidul locked'
      );


    $request   = Request::instance();
    $params  = $request->getContent();
    // $paramsArr = json_decode($params, true);
    $params  = json_decode($params);


    if ( ! $stationId ||
       ( $stationCode !== $params->code &&
         Station::findByCode($params->code) ) )

      return array(
        'saved' => false,
        'msg'   => 'invalid station code'
      );


    $canEdit = $this->CanEditStation($stationId);


    if ( is_bool($canEdit) && $canEdit )
    {
      if ( $this->GetIsOwnerOfMobidul($mobidulCode) )

        DB::table('station')
          ->where('id', $stationId)
          ->update([
            'code'    => $params->code,
            'lat'     => $params->lat,
            'lon'     => $params->lon,
            'name'    => $params->name,
            'contentType' => $params->contentType,
            'content'   => $params->content,
            'locked'    => $params->locked,
            'enabled'   => $params->enabled
          ]);

      else
        DB::table('station')
          ->where('id', $stationId)
          ->update([
            'code'    => $params->code,
            'lat'     => $params->lat,
            'lon'     => $params->lon,
            'name'    => $params->name,
            'contentType' => $params->contentType,
            'content'   => $params->content
          ]);



      DB::table('category2station')
          ->where('stationId', $stationId)
          ->delete();

      DB::table('station2attachment')
          ->where('station_id', $stationId)
          ->delete();


      foreach ( $params->categories as $category )
      {
        DB::table('category2station')
          ->insert([
            'categoryId' => $category->id,
            'stationId'  => $stationId
          ]);
      }


      foreach ( $params->medialist as $mediaitem )
      {
        $attachment = Attachment::where('hash', $mediaitem->hash)->first();

        if ( $attachment == null )
        {
          // attachment zur späteren Verwendung anlegen
          $attachment = Attachment::create(
            array(
              'mobidulId' => $mobidulId,
              'hash'    => $mediaitem->hash
            )
          );
        }

        DB::table('station2attachment')
          ->insert([
            'attachment_id' => $attachment->id,
            'station_id'  => $stationId
          ]);
      }


      return array(
        'saved' => true,
        'msg'   => 'success',
        'code'  => $params->code
      );
    }
    else
      return array(
        'saved' => $canEdit,
        'msg'   => 'unknown error'
      );
  }


  public function updateStationContent ($mobidulCode, $stationCode){

    $mobidulId = Mobidul::GetId($mobidulCode);
    $stationId = Station::GetId($stationCode);


    if ( ! $this->isAllowed($mobidulCode) ){
      return array(
          'saved' => false,
          'msg'   => 'not allowed'
      );
    }

    $request   = Request::instance();
    $params  = $request->getContent();
    $params  = json_decode($params);

    if ( ! $stationId ){
      return array(
          'saved' => false,
          'msg'   => 'invalid station code'
      );
    }

    $canEdit = $this->CanEditStation($stationId);

    if ( is_bool($canEdit) && $canEdit )
    {
      DB::table('station')
          ->where('id', $stationId)
          ->update([
              'content'   => $params->content,
          ]);

      return array(
          'saved' => true,
          'msg'   => 'success'
      );
    }
    else
      return array(
          'saved' => $canEdit,
          'msg'   => 'unknown error'
      );

  }


  /**
   * Deletes Station + category2station + navigationItems
   * Returns "success" if successful
   *
   * @param $mobidulCode
   * @param $stationId
   * @return bool|string
   */
  public function RemoveStation ($mobidulCode, $stationId)
  {
    $mobidulId = Mobidul::GetId($mobidulCode);

    if ( ! $this->isAllowed($mobidulCode) )
      return 'not allowed';


    if ( Mobidul::find($mobidulId)->locked &&
       ! $this->GetIsOwnerOfMobidul($mobidulCode) )

      return 'mobidul locked';



    $canEdit = $this->CanEditStation($stationId);

    if ( is_bool($canEdit) && $canEdit )
    {
      if ( ! empty($stationId) )
      {
        DB::beginTransaction();
        DB::statement('SET FOREIGN_KEY_CHECKS = 0');


        $category2Station = Category2Station::where('stationId', $stationId);
        $station          = Station::where('id', $stationId)->first();

        $stationOrder = $station->order;
        //\Log::info("stationOrder: " . $stationOrder);

        $deletedCategory2Station = true; // doesn't have to exist
        $deletedStation = false; // has to exist


        $navigationItems = NavigationItem::where('stationId', $stationId);
        if ( $navigationItems->count() > 0 )
          $navigationItems->delete();

        // delete Category2Station
        if ( $category2Station->count() > 0 )
          $deletedCategory2Station = $category2Station->delete();

        if ( $deletedCategory2Station )
          // delete Station
          if ( $station->count() > 0 )
            $deletedStation = $station->delete();


        if ( $deletedStation )
        {
          DB::statement('SET FOREIGN_KEY_CHECKS = 1');
          DB::commit();

          //Rearrange Order of Stations
          Station::removeOrder($mobidulId, $stationOrder);

          return 'success';
        }
        else
        {
          DB::rollback();
          DB::statement('SET FOREIGN_KEY_CHECKS = 1');

          return 'Konnte Station nicht löschen!';
        }
      }
      else
        return 'Keine Station angegeben!';
    }
    else
      return $canEdit;
  }


  /**
   * Calls "RemoveStation"
   *
   * @param $mobidulCode
   * @param $stationCode
   * @return string
   */
  public function RemoveStationByCode ($mobidulCode, $stationCode)
  {
    //\Log::info('REMOVE STATION BY CODE');
    //\Log::info($mobidulCode);
    //\Log::info($stationCode);

    $stationId = Station::GetId($stationCode);
    //\Log::info($stationId);

    return $this->RemoveStation($mobidulCode, $stationId);
  }


  public function SetStation ($mobidulCode)
  {
    $mobidulId = Mobidul::GetId($mobidulCode);

    if ( ! $this->isAllowed($mobidulCode) )
      return 'not allowed';


    if ( Mobidul::find($mobidulId)->locked &&
       ! $this->GetIsOwnerOfMobidul($mobidulCode) )

      return 'mobidul locked';


    $request = Request::instance();
    $params = $request->getContent();
    #$paramsArr = json_decode($params, true);
    $params = json_decode($params);
    $canEdit = $this->CanEditStation($params->id);

    if ( is_bool($canEdit) && $canEdit )
    {
      if ( $this->GetIsOwnerOfMobidul($mobidulCode) )

        DB::table('station')
            ->where('id', $params->id)
            ->update(['code'    => $params->code,
                'lat'     => $params->lat,
                'lon'     => $params->lon,
                'name'    => $params->name,
                'contentType' => $params->contentType,
                'content'   => $params->content,
                'locked'    => $params->locked,
                'enabled'   => $params->enabled]);
      else
        DB::table('station')
            ->where('id', $params->id)
            ->update(['code'    => $params->code,
                'lat'     => $params->lat,
                'lon'     => $params->lon,
                'name'    => $params->name,
                'contentType' => $params->contentType,
                'content'   => $params->content]);


      DB::table('category2station')
          ->where('stationId', $params->id)
          ->delete();

      DB::table('station2attachment')
          ->where('station_id', $params->id)
          ->delete();


      foreach ( $params->categories as $categorieId )
      {
        DB::table('category2station')
          ->insert([
            'categoryId' => $categorieId,
            'stationId'  => $params->id
          ]);
      }

      foreach ( $params->medialist as $mediaitem )
      {
        $attachment = Attachment::where('hash', $mediaitem->hash)->first();

        if ( $attachment == null )
        {
          //attachment zur späteren Verwendung anlegen
          $attachment = Attachment::create(
            array(
              'mobidulId' => $mobidulId,
              'hash'    => $mediaitem->hash
            )
          );
        }

        DB::table('station2attachment')
          ->insert(['attachment_id' => $attachment->id,
                'station_id'  => $params->id]);
      }

      return 'success';
    }
    else
      return $canEdit;
  }


  public function GetStation ($mobidulCode, $id)
  {
    $mediaList = [];

    // get this medialist, the dirty way !

    $pivotEntries = DB::table('station2attachment')
                      ->where('station_id', $id )
                      ->orderBy('created_at')
                      ->get();

    foreach ( $pivotEntries as $pivotEntry )
    {
      $attachment = Attachment::find( $pivotEntry->attachment_id );

      $mediaList[] = [
        "hash"      => $attachment->hash,
        "url"       => $attachment->url,
        "timestamp" => $attachment->created_at->format('d.m.Y H:i:s')
      ];
    }


    $result = DB::table('station')
                ->where('id', $id )
                ->orderBy('order')
                ->first();

    $result->mediaList = $mediaList;

    $result->canEdit = is_bool( $this->CanEditStation( $station->id ) ) &&
                       $this->CanEditStation( $station->id )            &&
                       $this->IsAllowed( $mobidulCode );

    return json_encode($result);
  }


  public function GetCategoriesForStation ($mobidulCode, $stationId)
  {
    return DB::table('category2station')
             ->select('categoryId')
             ->where('stationId', $stationId)
             ->get();
  }


  /**
   * Takes a station array (each object needs at least an id and order) and rearranges their order
   * Only possible if current user is authorized to change Mobidul
   *
   * @param $mobidulCode
   * @return string
   * @internal param $stations
   */
  public function ChangeOrder ($mobidulCode)
  {
    $mobidulId = Mobidul::GetId($mobidulCode);
    $stations = Input::get('stations');

    if ( ! $stations )
      return 'No Stations passed!';


    if ( ! $this->isAllowed($mobidulCode) )
      return 'You are not allowed to edit this Mobidul';


    if ( Mobidul::find($mobidulId)->locked &&
         ! $this->GetIsOwnerOfMobidul($mobidulCode) )
      return 'This Mobidul is locked!';


    $response = Station::rearrangeOrder($stations, $mobidulId);

    return $response;
  }


  /// Helper functions

  public function HasCategoryName ($categoryName, $mobidulId)
  {
    return DB::table('category')
             ->select('name')
             ->where('name', $categoryName)
             ->where('mobidulId', $mobidulId)
             ->first();
  }


  public function IsAllowed ($mobidulCode)
  {
    if ( $this->GetIsOwnerOfMobidul($mobidulCode) )
      return true;
    else
      return $this->CanIPlay($mobidulCode) === 'allowed';
  }


  /**
   * Checks edit mode from mobidul, if allowed returns true, else a string explaning why not
   *
   * @param $stationId
   * @return bool|string
   */
  public function CanEditStation ($stationId)
  {
    $station = DB::table('station')
                  ->where('id', $stationId)->first();

    $mobidul     = Mobidul::find($station->mobidulId);
    $editMode    = $mobidul->editMode;
    $mobidulCode = $mobidul->code;
    $mobidulId   = $mobidul->id;
    $user        = User::getCurrentUser();
    $userId      = $user->id;

    if ( $this->GetIsOwnerOfMobidul($mobidulCode) )
      return true;

    if ( $station->locked )
      return 'not owner';

    if ( $editMode == 0 )
      // everybody can edit everything, unless locked by mobidul owner
      return true;

    if ( $editMode == 1 )
    {
      // only the creater of a station is allowed to edit it, unless locked by mobidul owner
      if ( $station->creator == $userId )
        return true;
      else
        return 'not owner';
    }

    if ( $editMode == 2 )
    {
      // only user with the same play code can edit their stations, unless locked by mobidul owner
      $creator = User::find($station->creator);

      if ( $creator )
      {
        $user2Mobidul = $creator->user2Mobidul()->where('mobidulId', $mobidulId)->first();

        if ( $user2Mobidul )
        {
          $user2Mobidul2 = $user->user2Mobidul()->where('mobidulId', $mobidulId)->first();

          if ( $user2Mobidul2 )
          {
            if ( $user2Mobidul->code == $user2Mobidul2->code )
              return true;
            else
              return 'not group';
          }
          else {
            return 'no rights';
          }
        }
        else {
          return 'missing code';
        }

      }
      else {
        // no creator, don't allow editing
        return 'no creator';
      }
    }

    return 'wrong options';
  }


  public function canIPlay ($mobidulCode)
  {
    $mobidulId    = Mobidul::GetId($mobidulCode);
    $user         = User::getCurrentUser();
    $user2Mobidul = $user->user2Mobidul()->where('mobidulId', $mobidulId)->first();

    if ( $user2Mobidul )
    {
      $rights = $user2Mobidul->rights;

      if ( $rights == 2 )
        return 'allowed';
    }

    return 'not-allowed';
  }


  // ...

}
