<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddStationLockAndStationCreator extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('station', function($table)
		{
            $table->string('creator');
            $table->boolean('locked')->default(false);
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('station', function($table)
		{
			$table->dropColumn('creator');
			$table->dropColumn('locked');
		});
	}

}
