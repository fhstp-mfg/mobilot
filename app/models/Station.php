<?php

namespace App\Models;


use Illuminate\Support\Facades\Log;

class Station extends \Eloquent
{
    protected $table = 'station';
    protected $guarded = array('id');


    public function categories ()
    {
        return $this->belongsToMany('\App\Models\Category', 'category2station', 'stationId', 'categoryId');
    }

    public function attachments ()
    {
        return $this->belongsToMany('\App\Models\Attachment', 'station2attachment', 'id', 'id');
    }

    public static function GetId ($stationCode)
    {
        $station = static::findByCode($stationCode);

        if ( $station )
            return $station->id;

        return null;
    }

    public static function GetCode ($stationId)
    {
        return static::findById($stationId)->code;
    }

    public static function findById ($stationId)
    {
        return station::where('id', $stationId)->first();
    }

    public static function findByCode ($stationCode)
    {
        return static::where('code', $stationCode)->first();
    }

    /**
     * Returns order for new Station (last order +1)
     * 
     * @param $mobidulId
     * @return int
     */
    public static function getCurrentOrder($mobidulId){
        $last = Station::where('mobidulId', $mobidulId)->orderBy('order', 'desc')->first();

        if($last){
            $order = $last->order + 1;
            return $order;
        }else{
            return 0;
        }
    }

    /**
     * Rearranges the station order in case one gets deleted
     *
     * @param $mobidulId
     * @param $removedOrder
     */
    public static function removeOrder($mobidulId, $removedOrder){

        $stations = Station::where(['mobidulId' => $mobidulId])->orderBy('order', 'desc')->get();

        foreach ($stations as $station){
            if($station->order > $removedOrder){
                $station->order -= 1;
                $station->save();
            }
        }

    }

    /**
     * ! Don't use this !
     * ! Risk of overwriting - use rearrangeOrder instead !
     * Changes Order of two Stations
     *
     * @param $id1
     * @param $id2
     */
    public static function changeOrder($id1, $id2){

        $station1 = static::findById($id1);
        $station2 = static::findById($id2);
        $temp = $station1->order;

        $station1->order = $station2->order;
        $station2->order = $temp;

        $station1->save();
        $station2->save();

    }

    /**
     * Compares two Stations by order
     *
     * @param $a
     * @param $b
     * @return int
     */
    private static function _compareStationOrder($a, $b){
        if($a['order'] == $b['order']){
            return 0;
        }else{
            return ($a['order'] <  $b['order']) ? -1 : 1;
        }

    }

    /**
     * Takes an array of stations (id and newOrder), sorts and saves them
     *
     * @param $stations
     * @return string
     */
    public static function rearrangeOrder($stations, $mobidulId){

        usort($stations, array('App\Models\Station', "_compareStationOrder"));

        //\Log::info($stations);

        $max = sizeof($stations);

        $db_max = static::where('mobidulid', '=', $mobidulId)->count();

        if($max != $db_max){
            return 'Invalid Count';
        }

        for($i = 0; $i < $max; $i++){
            if($stations[$i]['order'] != $i){
                return 'Invalid Order';
            }
        }

        for($i = 0; $i < $max; $i++){
            $station = static::findById($stations[$i]['id']);
            $station['order'] = $stations[$i]['order'];
            $station->save();
        }

        return 'success';

    }

}
