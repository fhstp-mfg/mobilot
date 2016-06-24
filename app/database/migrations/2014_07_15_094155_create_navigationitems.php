<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNavigationitems extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('navigationitems', function(Blueprint $table)
        {
			$table->increments('id');
            $table->integer('mobidulId')->unsigned()->nullable();
            $table->string('text')->nullable();
            $table->string('icon');
            $table->string('stationCode')->nullable(); 
            $table->integer('categoryId')->nullable(); 
            $table->string('partialStationCode')->nullable(); 
            $table->timestamps();
			//
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		 Schema::drop('navigationitems');
	}

}
