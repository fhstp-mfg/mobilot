<?php

namespace App\Models;


class User2Mobidul extends \Eloquent {

    protected $table      = 'user2mobidul';

    protected $guarded    = array();

    protected $primaryKey = array('mobidulId', 'userId');



    public function user ()
    {
        return $this->belongsTo('\App\Models\User', 'userId', 'id');
    }
}
