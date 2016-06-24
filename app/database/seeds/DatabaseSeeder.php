<?php

class DatabaseSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		Eloquent::unguard();

//		$this->call('UserTableSeeder');
//		$this->call('MobidulTableSeeder');
//		$this->call('AttachmentTableSeeder');
//		$this->call('CategoryTableSeeder');
//		$this->call('User2mobidulTableSeeder');
//		$this->call('StationTableSeeder');
        $this->call('CompleteSeeder'); 
	}

}
