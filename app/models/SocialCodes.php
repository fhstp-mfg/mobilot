<?php

namespace App\Models;

class SocialCodes extends \Eloquent {

    protected $table = 'socialcodes';
	  protected $guarded = array();
    protected $primaryKey = 'code';
}
