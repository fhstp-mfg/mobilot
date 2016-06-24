<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use App\Models\MobidulOptions;
use App\Models\Mobidul;

class MergeMobidulOptionsToMobidul extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::table('mobidul', function($table)
		{
            $table->boolean('showMenu')->default(true);
            $table->text('allowedStationTypes')->nullable();       
            $table->integer('automaticPollingTime')->unsigned()->default(0); //in ms / 0 == no Polling
            $table->integer('editingDistance')->unsigned()->default(0); //0 == allow everywhere
		    $table->boolean('locked')->default(false);
            $table->boolean('private')->default(false);
            $table->integer('editMode')->unsigned()->default(0);
        });
        
        $mobidulOptions = MobidulOptions::all();
        
        foreach ($mobidulOptions as $mobidulOption) 
        {
            $m = $mobidulOption->mobidul;
            $m->showMenu = $mobidulOption->showMenu;
            if($m->allowedStationTypes != '' && !is_null($m->allowedStationTypes))
            {
                $m->allowedStationTypes = $mobidulOption->allowedStationTypes;
            }
            $m->automaticPollingTime = $mobidulOption->automaticPollingTime;
            $m->editingDistance = $mobidulOption->editingDistance;
            $m->locked = $mobidulOption->locked;
            $m->private = $mobidulOption->private;
            $m->editMode = $mobidulOption->editMode;
            $m->save();
        }
        
        Schema::drop('mobidulOptions'); 
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
        
		Schema::create('mobidulOptions', function(Blueprint $table)
        {
			$table->integer('mobidulId')->unsigned()->unique();
            $table->foreign('mobidulId')->references('id')->on('mobidul');
            $table->boolean('showMenu')->default(true);
            $table->text('allowedStationTypes')->default('');       
            $table->integer('automaticPollingTime')->unsigned()->default(0); //in ms / 0 == no Polling
            $table->integer('editingDistance')->unsigned()->default(0); //0 == allow everywhere
            $table->boolean('locked')->default(false);
            $table->boolean('private')->default(false);
            $table->integer('editMode')->unsigned()->default(0);
            $table->timestamps();
		});
        
        $mobiduls = Mobidul::all();
        foreach ($mobiduls as $mobidul) {
            $m = new MobidulOptions;
            $m->mobidul()->associate($mobidul);
            $m->showMenu = $mobidul->showMenu;
            if(!is_null($m->allowedStationTypes))
            {
                $m->allowedStationTypes = $mobidul->showMenu;
            }
            $m->automaticPollingTime = $mobidul->automaticPollingTime;
            $m->editingDistance = $mobidul->editingDistance;
            $m->locked = $mobidul->locked;
            $m->private = $mobidul->private;
            $m->editMode = $mobidul->editMode;
            $m->save();
        }
        
        Schema::table('mobidul', function($table)
		{
			$table->dropColumn('private');
			$table->dropColumn('editMode');
			$table->dropColumn('locked');
		});
	}

}
