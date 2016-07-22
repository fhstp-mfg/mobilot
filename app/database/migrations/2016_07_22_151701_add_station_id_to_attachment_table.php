<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddStationIdToAttachmentTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
    Schema::table('attachment', function (Blueprint $table)
    {
      $table->integer('stationId')->nullable()->after('mobidulId');
    });
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
    Schema::table('attachment', function(Blueprint $table)
    {
      $table->dropColumn('stationId');
    });
	}

}
