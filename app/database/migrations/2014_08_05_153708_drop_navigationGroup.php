<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DropNavigationGroup extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
        Schema::table('navigationitems', function($table) 
        {
            $table->dropForeign('navigationitems_navigationgroupid_foreign'); 
            $table->dropColumn('navigationgroupid'); 
            $table->boolean('isDivider')->default(false); 
        }); 
        
		Schema::drop('navigationgroup');
        
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
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
        
        Schema::table('navigationitems', function($table) 
        {
            $table->dropColumn('isDivider'); 
            
            $table->integer('navigationgroupId')->unsigned()->nullable();
        }); 
        
         Schema::table('navigationitems', function($table) 
        {
            $table->foreign('navigationgroupId')->references('id')->on('navigationgroup');
        });
	}

}
