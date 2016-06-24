<?php

namespace App\Models;

class Attachment extends \Eloquent {
    
    protected $table = 'attachment';
    protected $guarded = array('id');
    
    public function stations (){
        return $this->belongsToMany('\App\Models\Station', 'station2attachment', 'id', 'id');
    }
}