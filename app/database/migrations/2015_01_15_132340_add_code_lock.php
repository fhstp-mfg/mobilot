<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddCodeLock extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('codes', function($table) 
        {
            $table->dropColumn('expirationDate');
            $table->string('name');
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
		Schema::table('codes', function($table)
		{
			$table->dropColumn('locked');
			$table->dropColumn('name');
			$table->dateTime('expirationDate');
		});
	}

}
