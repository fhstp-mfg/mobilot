<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateMobidulAddConfiguration extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('mobidul', function($table) {
			$table->integer('minAccuracy')->default(10000);
            $table->string('defaultCode')->nullable;
            $table->string('defaultPage_stationCode');
            $table->boolean('flagCodeSnippet')->default(false);
            $table->boolean('flagScanCode')->default(false);
            $table->boolean('flagGetByLocation')->default(false);
            $table->boolean('flagGetByTime')->default(false);
            $table->double('centerLat')->nullable;
            $table->double('centerLon')->nullable;
            $table->double('centerRadius')->nullable;
            
            
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('mobidul', function($table) {
			$table->dropColumn('minAccuracy');
            $table->dropColumn('defaultCode');
            $table->dropColumn('defaultPage_stationCode');
            $table->dropColumn('flagCodeSnippet');
            $table->dropColumn('flagScanCode');
            $table->dropColumn('flagGetByLocation');
            $table->dropColumn('flagGetByTime');
            $table->dropColumn('centerLat');
            $table->dropColumn('centerLon');
            $table->dropColumn('centerRadius');
		});
	}

}
