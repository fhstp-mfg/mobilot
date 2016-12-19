<?php

use App\Models\Mobidul;
use App\Models\NavigationItem;
use App\Models\User;
use App\Models\Category;
use App\Models\Station;

class ConfigController extends BaseController
{

    public function getConfiguration ($mobName = '')
    {
        $contentDomain = '/';

        $mob = Mobidul::where('code', $mobName)->first();

        if ( isset($mob) )
        {
            /// default mobidul colors
            $mob->background = $mob->background ? $mob->background : '#3797c4';
            $mob->foreground = $mob->foreground ? $mob->foreground : '#fff';


            $responseArray = [
                                 'version'             => '1.1.1',
                                 'contentDomain'       => $contentDomain,
                                 'mobidulName'         => $mob->name,
                                 'mobidulCode'         => $mob->code,
                                 'mobidulDescription'  => $mob->description,
                                 'background'          => $mob->background,
                                 'foreground'          => $mob->foreground,
                                 'font'                => $mob->font,
                                 'editMode'            => $mob->editMode,
                                 'defaultCode'         => $mob->defaultCode,
                                 'defaultPage'         => $mob->defaultPage_stationCode,
                                 'startAbility'        => $mob->startAbility,
                                 'startItemId'         => $mob->startItemId,
                                 'mode'                => $mob->mode,
                                 'flags' =>
                                 [
                                     'codeInput'       => $mob->flagCodeSnippet,
                                     'scanCode'        => $mob->flagScanCode,
                                     'getByLocation'   => $mob->flagGetByLocation,
                                     'getByTime'       => $mob->flagGetByTime
                                 ],
                                 'routes' =>
                                 [
                                     [
                                         'queryString' => 'code',
                                         'action'      => 'getForCode',
                                         'parameter'   => '%VALUE%'
                                     ],
                                     [
                                         'queryString' => 'url',
                                         'action'      => 'switchcontent',
                                         'parameter'   => '%VALUE%'
                                     ],
                                     [
                                         'queryString' => 'page',
                                         'action'      => 'switchcontent',
                                         'parameter'   => '%VALUE%.html'
                                     ],
                                     [
                                         'queryString' => 'site',
                                         'action'      => 'getForCode',
                                         'parameter'   => '%VALUE%'
                                     ],
                                     [
                                         'queryString' => 'category',
                                         'action'      => 'getForCategory',
                                         'parameter'   => '%VALUE%'
                                     ],
                                 ],
                                 'mapPlugin' =>
                                 [
                                     'googleAPIKey'    => 'AIzaSyBXqsZpJDMZcjvhOIaRkh8H7bMyGsA3pKw',
                                     'maps' =>
                                     [
                                         [
                                             'name' => 'map_1',
                                             'directlyHandledOptions' =>
                                             [
                                                 'streetViewControl' => false,
                                                 'zoom' => 13
                                             ],
                                             'followUser' => true,
                                             'followUserOptions' =>
                                             [
                                                 'center' =>
                                                 [
                                                     'latitude'    => $mob->centerLat,
                                                     'longitude'   => $mob->centerLon
                                                 ],
                                                 'radius' => $mob->centerRadius
                                             ],
                                             'center' =>
                                             [
                                                'latitude'     => $mob->centerLat,
                                                'longitude'    => $mob->centerLon,
                                                'name'         => $mob->name
                                             ],
                                             'overlays' =>
                                             [
                                                'self'           => 'img/icon-map-marker-red.png',
                                                'standardDBIcon' => 'img/icon-map-marker-red.png',
                                                'circles'        => []
                                             ]
                                         ]
                                     ]
                                 ]
                             ];

            // alle NavigationItems holen
            $navItems = NavigationItem::where('mobidulId', $mob->id)
                                      ->orderBy('order')
                                      ->get();

            $navigation = [];
            $navigation['iconSet'] = 'path';


            $navItemsForResponse = [];

            foreach ( $navItems as $navItem )
            {
                $navItemResponse = [];
                $navItemResponse['id']   = $navItem->id;
                $navItemResponse['text'] = $navItem->text;
                $navItemResponse['icon'] = $navItem->icon;
                //  $navItemResponse['isDivider'] = $navItem->isDivider;


                /*if ( $navItem->isDivider == 0 )

                    $navItemResponse['isDivider'] = false;

                else
                    $navItemResponse['isDivider'] = true;
                */

                $navItemResponse['isDivider'] = ! ( $navItem->isDivider == 0 );


                // \Log::info($navItemResponse);

                if ( $navItem->categoryId != null )
                {
                    $navItemResponse['href'] = $navItem->categoryId;
                    $navItemResponse['func'] = 'getForCategory';
                    //categoryname
                    $category = Category::find($navItem->categoryId);
                    if($category)
                    {
                        $navItemResponse['name'] = $category->name;
                    }
                }
                else if ( $navItem->stationId != null )
                {
                    $navItemResponse['href'] = $navItem->stationId;
                    $navItemResponse['func'] = 'switchcontent';
                    //stationname
                    $station = Station::find($navItem->stationId);
                    if($station)
                    {
                        $navItemResponse['name'] = $station->name;
                    }
                }
                else if ( $navItem->hardcoded != null )
                {
                    $navItemResponse['href'] = $navItem->hardcoded;
                    $navItemResponse['func'] = 'switchcontent';
                }

                $navItemsForResponse[] = $navItemResponse;
            }

            $navigation['navigation'] = $navItemsForResponse;

            $responseArray['customNav'] = $navigation;


            $headers = array('Content-Type: application/json');


            return Response::json($responseArray); //, 'config.json', $headers);
        }
        else
            \Log::info("no mobidul for name $mobName");


        $file = public_path() . "/configs/$mobName.json";
    }


    public function UpdateNavigation ($mobName)
    {
        $request  = Request::instance();
        $content  = $request->getContent();
		$postData = json_decode($content);

        $mob = Mobidul::where('code', $mobName)->first();


        if ( ! $mob )
            return 'failed, no mobidul found';

        else
        {
            $oldNavItems = NavigationItem::where('mobidulId', $mob->id);

            if ( count($oldNavItems) > 0 )

                $oldNavItems->delete();


            $postDataLength = count($postData);
            // NavItemCount for orders in NavItems
            $navItemCount = 0;


            for ( $i = 0; $i < $postDataLength; $i++ )
            {
                if ( $postData[ $i ]->isDivider == 0 )
                {
                    if ( $postData[ $i ]->func == 'switchcontent' )
                    {
                        if ( is_string($postData[ $i ]->href) )
                        {
                             NavigationItem::create(
                                array(
                                    'mobidulId' => $mob->id,
                                    'isDivider' => $postData[ $i ]->isDivider,
                                    'hardcoded' => $postData[ $i ]->href,
                                    'order'     => $navItemCount,
                                    'icon'      => $postData[ $i ]->icon,
                                    'text'      => $postData[ $i ]->text
                                )
                            );
                        }
                        else
                        {
                            NavigationItem::create(
                                array(
                                    'mobidulId' => $mob->id,
                                    'isDivider' => $postData[ $i ]->isDivider,
                                    'stationId' => $postData[ $i ]->href,
                                    'order'     => $navItemCount,
                                    'icon'      => $postData[ $i ]->icon,
                                    'text'      => $postData[ $i ]->text
                                )
                            );
                        }
                    }
                    else if ( $postData[ $i ]->func == 'getForCategory' )
                    {
                        NavigationItem::create(
                            array(
                                'mobidulId'  => $mob->id,
                                'isDivider'  => $postData[ $i ]->isDivider,
                                'categoryId' => $postData[ $i ]->href,
                                'order'      => $navItemCount,
                                'icon'       => $postData[ $i ]->icon,
                                'text'       => $postData[ $i ]->text
                            )
                        );
                    }
                }
                else
                {
                    NavigationItem::create(
                        array(
                            'mobidulId' => $mob->id,
                            'isDivider' => $postData[ $i ]->isDivider,
                            'order'     => $navItemCount,
                            'icon'      => $postData[ $i ]->icon,
                            'text'      => $postData[ $i ]->text
                        )
                    );
                }

                $navItemCount++;
            }

            return 'success';
       }
    }


    public function updateStartPage ($mobidulCode)
    {
        $request  = Request::instance();
        $content  = $request->getContent();
		$postData = json_decode($content);


        $mobidul = Mobidul::findByCode($mobidulCode);

        if ( User::find( Auth::id() )->isAdminInMobidul( $mobidul->id ) )
        {
            $mobidul->startAbility = $postData->ability;
            $mobidul->startItemId  = $postData->itemId;
            $mobidul->save();

            return 'success';
        }
        else
            return 'not owner';

    }


    public function isMobidul ($mobName)
    {
        /*$mob = Mobidul::where('code', $mobName)->first();
        if (!$mob)
        {
            //App::abort(202, 'No entry found.');
            return Response::json(['MobidulAvailable' => false]);
        }
        else
        {
            return Response::json(['MobidulAvailable' => true]);
        }*/

        $mob = Mobidul::where('code', $mobName)->first();
        $isMobidulAvailable = isset($mob);


        return Response::json([ 'MobidulAvailable' => $isMobidulAvailable]);
    }

    // ...
}
