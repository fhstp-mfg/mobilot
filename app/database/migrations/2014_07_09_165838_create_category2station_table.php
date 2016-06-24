<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCategory2stationTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
        
		Schema::create('category2station', function(Blueprint $table) {
			$table->integer('categoryId')->unsigned();
            $table->integer('stationId')->unsigned();
            $table->timestamps();
		});
        
        Schema::table('category2station', function($table) 
        {
            $table->foreign('categoryId')->references('id')->on('category');
            $table->foreign('stationId')->references('id')->on('station');
        });
        
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
        
		Schema::table('category2station', function(Blueprint $table)
		{
			Schema::drop('category2station');
		});
        
	}

}
