<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddLockAndPrivateToMobidulOptions extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('mobidulOptions', function($table)
		{
            $table->boolean('locked')->default(false);
            $table->boolean('private')->default(false);
            $table->integer('editMode')->unsigned()->default(0);
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('mobidulOptions', function($table)
		{
			$table->dropColumn('private');
			$table->dropColumn('editMode');
			$table->dropColumn('locked');
		});
	}

}
