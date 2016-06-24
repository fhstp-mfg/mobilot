<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateNavigationitemsAddCategory extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('navigationitems', function($table) {
			$table->integer('navItemInCategoryId')->unsigned()->nullable;
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('navigationitems', function($table) {
			$table->dropColumn('navItemInCategoryId');
		});
	}

}
