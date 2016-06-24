<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddHashtoAttachmentaddMediaList extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
        Schema::table('attachment', function($table){
            $table->string('hash'); 
        });
        
		Schema::create('station2attachment', function($table) {
            $table->increments('id'); 
			$table->integer('station_id')->unsigned();
            $table->foreign('station_id')->references('id')->on('station');
            $table->integer('attachment_id')->unsigned(); 
            $table->foreign('attachment_id')->references('id')->on('attachment');
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
		//
        Schema::table('attachment', function($table){
            $table->dropColumn('hash'); 
        }); 
        
        Schema::drop('station2attachment'); 
	}

}
