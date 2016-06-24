<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStationTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('station', function(Blueprint $table)
		{
            $table->increments('id'); 
			$table->string('code');
            $table->integer('mobidulId')->unsigned();
            $table->double('lat');
            $table->double('lon');
            $table->double('radius');
            $table->string('name');
            $table->boolean('enabled');
            $table->string('contentType');
            $table->text('content');
            $table->double('durationInMinutes')->nullable();
            $table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('station', function(Blueprint $table)
		{
			Schema::drop('station');
		});
	}

}
