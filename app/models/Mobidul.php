<?php

namespace App\Models;

use App\Models\MobidulOptions;


class Mobidul extends \Eloquent
{
  protected $table      = 'mobidul';
  protected $guarded    = array('id');
  protected $primaryKey = 'id';


  public function categories ()
  {
    return $this->hasMany('\App\Models\Category', 'mobidulId', 'id');
  }


  public function mobidulOptions ()
  {
    return $this->hasOne('\App\Models\MobidulOptions', 'mobidulId', 'id');
  }


  public function scopePub ($query)
  {
    return $query->where('private', false);
  }


  public function scopeNewestFirst ($query)
  {
    return $query->orderBy('created_at', 'desc');
  }


  public function scopeBasicInformation ($query)
  {
    return $query->select(
      'id',
      'name',
      'description',
      'code',
      'background'
    );
  }


  public function scopeOptions ($query)
  {
    return $query->select(
      'id',
      'name',
      'code',
      'showMenu',
      'allowedStationTypes',
      'automaticPollingTime',
      'editingDistance',
      'locked',
      'private',
      'editMode',
      'background',
      'font'
    );
  }


  public static function GetId ($mobidulCode)
  {
    return static::findByCode($mobidulCode)->id;
  }


  public static function findByCode ($mobidulCode)
  {
    return static::where('code', $mobidulCode)->first();
  }


  public static function HasMobidulId ($mobidulCode)
  {
    return ! is_null(static::findByCode($mobidulCode));
  }


  public static function HasMobidulName ($mobidulName)
  {
    return ! is_null( static::select('name')
                            ->where('name', $mobidulName)
                            ->first() );
  }
}
