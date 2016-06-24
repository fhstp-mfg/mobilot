<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddStartpageAbility extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('mobidul', function($table) 
        {
            $table->string('startAbility');
            $table->string('startItemId');
        });
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('mobidul', function($table)
		{
			$table->dropColumn('startAbility');
			$table->dropColumn('startItemId');
		});
	}

}
