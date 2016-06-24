<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class UpdateNavigationitems extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		//
         Schema::table('navigationitems', function($table) 
        {
            $table->dropColumn('serializedNavigation'); 
            $table->dropColumn('navItemInCategoryId'); 
        
            $table->integer('navigationgroupId')->unsigned()->nullable();
            $table->integer('categoryId')->unsigned()->nullable(); 
            $table->integer('stationId')->unsigned()->nullable(); 
            $table->text('hardcoded')->nullable(); 
            $table->integer('order')->nullable(); 
            $table->text('icon')->nullable(); 
            $table->string('text')->nullable();
        }); 
        
         Schema::table('navigationitems', function($table) 
        {
            $table->foreign('navigationgroupId')->references('id')->on('navigationgroup');
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
         Schema::table('navigationitems', function($table) 
        {
            $table->integer('navItemInCategoryId')->unsigned()->nullable;
            $table->longText('serializedNavigation'); 
            $table->dropColumn('navigationgroupid'); 
            $table->dropColumn('categoryid');
            $table->dropColumn('stationid'); 
            $table->dropColumn('hardcoded'); 
            $table->dropColumn('order'); 
            $table->dropColumn('icon'); 
            $table->dropColumn('text'); 
        }); 
        
	}

}
