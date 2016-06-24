<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCategoryTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('category', function(Blueprint $table)
        {            
            $table->increments('id');
            $table->string('name');
            $table->integer('mobidulId')->unsigned();
            $table->timestamps(); 
		});
        
        Schema::table('category', function($table) 
        {
            $table->foreign('mobidulId')->references('id')->on('mobidul');
        });
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('category');
	}

}
