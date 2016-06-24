<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class DropColumnsForSerializedNavigation extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		//
        Schema::table('navigationitems', function($table) {
            $table->dropColumn('text'); 
            $table->dropColumn('icon'); 
            $table->dropColumn('stationCode'); 
            $table->dropColumn('categoryId'); 
            $table->dropColumn('partialStationCode'); 
            
            $table->longText('serializedNavigation'); 
		});
        
        
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
        Schema::table('navigationitems', function($table) {
            $table->string('text')->nullable();
            $table->string('icon');
            $table->string('stationCode')->nullable(); 
            $table->integer('categoryId')->nullable(); 
            $table->string('partialStationCode')->nullable();
            
            $table->dropColumn('serializedNavigation');
            
        });
		
	}

}
