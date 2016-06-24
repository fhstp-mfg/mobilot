<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNavigationGroup extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('navigationgroup', function(Blueprint $table)
        {
			$table->increments('id');
            $table->integer('order');
            $table->string('name'); 
            $table->integer('mobidulId')->unsigned();
            $table->timestamps();
		});
        
         Schema::table('navigationgroup', function($table) 
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
		Schema::drop('navigationgroup');
	}

}
