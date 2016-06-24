<?php

namespace App\Models;

use App\Models\User;


class RestoreToken extends \Eloquent
{
	protected $table = 'restore_tokens';

	protected $fillable = array('token');

	public $timestamps = false;



	public static function getByToken ($token)
	{
		$restoreToken = static::where('token', '=', $token)->first();

		return $restoreToken;
	}
}
