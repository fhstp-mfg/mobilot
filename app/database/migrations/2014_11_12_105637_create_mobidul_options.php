<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;
use App\Models\MobidulOptions;
use App\Models\Mobidul;

class CreateMobidulOptions extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('mobidulOptions', function(Blueprint $table)
        {
			$table->integer('mobidulId')->unsigned()->unique();
            $table->foreign('mobidulId')->references('id')->on('mobidul');
            $table->boolean('showMenu')->default(true);
            $table->text('allowedStationTypes')->default('');       
            $table->integer('automaticPollingTime')->unsigned()->default(0); //in ms / 0 == no Polling
            $table->integer('editingDistance')->unsigned()->default(0); //0 == allow everywhere
            $table->timestamps();
		});
        
        $mobiduls = Mobidul::all();
        foreach ($mobiduls as $mobidul) {
            $m = new MobidulOptions;
            $m->mobidul()->associate($mobidul);
            $m->save();
        }
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('mobidulOptions');
	}

}
