<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateUsersTableForAccountActivation extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('user', function ($table)
		{
			$table->timestamp('activated_at')
				  ->nullable()
				  ->default(null)
				  ->after('created_at');

			$table->string('activation_code', 32)
				  ->nullable()
				  ->default(null)
				  ->after('updated_at');
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('user', function($table)
		{
		    $table->dropColumn(array('activated_at', 'activation_code'));
		});
	}

}
