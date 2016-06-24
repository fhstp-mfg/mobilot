<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAttachmentTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('attachment', function(Blueprint $table)
        {
			$table->increments('id');
            $table->integer('userId')->unsigned()->nullable();
            $table->integer('mobidulId')->unsigned();
			$table->string('url');
            $table->timestamps(); 
		});
        
        Schema::table('attachment', function($table) 
        {
            $table->foreign('userId')->references('id')->on('user');
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
		Schema::drop('attachment');
	}

}
