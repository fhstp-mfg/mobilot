<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUser2mobidulTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('user2mobidul', function(Blueprint $table)
		{
            $table->integer('userId')->unsigned();
            $table->integer('mobidulId')->unsigned();
            $table->integer('rights')->default(0);
            $table->timestamps();
		});
        
        Schema::table('user2mobidul', function($table) 
        {
            $table->primary(array('userId','mobidulId'));
            $table->foreign('mobidulId')->references('id')->on('mobidul');
            $table->foreign('userId')->references('id')->on('user');
        });
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('user2mobidul');
	}

}
