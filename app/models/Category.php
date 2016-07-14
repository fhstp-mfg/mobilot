<?php

namespace App\Models;

class Category extends \Eloquent {

  protected $table = 'category';
  protected $guarded = array('id');

  public function stations ()
  {
    return $this->belongsToMany(
      '\App\Models\Station',
      'category2station',
      'categoryId', 'stationId'
    );
  }
}
