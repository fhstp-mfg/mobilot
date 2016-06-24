<?php

namespace App\Models;

class MobidulOptions extends \Eloquent {
    
    protected $table = 'mobidulOptions';
    protected $primaryKey = "mobidulid";
    protected $fillable = array('showMenu', 
                                'allowedStationTypes', 
                                'automaticPollingTime',
                                'editingDistance',
                                'private',
                                'locked');
    public function mobidul()
    {
        return $this->belongsTo('\App\Models\Mobidul', 'mobidulId','id');
    }
}