<?php

namespace App\Models;

class NavigationItem extends \Eloquent 
{    
    protected $table   = 'navigationitems';
    protected $guarded = array('id');
    
    
    public function category()
    {
        return $this->hasOne('category', 'categoryId');
    }
    
    public function station()
    {
        return $this->hasOne('station', 'stationId');
    }
}