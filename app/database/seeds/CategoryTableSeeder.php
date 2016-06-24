<?php

class CategoryTableSeeder extends Seeder {

	/**
	 * Auto generated seed file
	 *
	 * @return void
	 */
	public function run()
	{
		\DB::table('category')->truncate();
        
		\DB::table('category')->insert(array (
			0 => 
			array (
				'categoryId' => 50,
				'name' => '&Ouml;ffentlich',
				'mobidulId' => 15,
				'created_at' => '2014-07-10 11:31:01',
				'updated_at' => '2014-07-10 11:31:01',
			),
			1 => 
			array (
				'categoryId' => 51,
				'name' => 'Wirtschaft',
				'mobidulId' => 15,
				'created_at' => '2014-07-10 11:31:01',
				'updated_at' => '2014-07-10 11:31:01',
			),
			2 => 
			array (
				'categoryId' => 52,
				'name' => 'Tourismus',
				'mobidulId' => 15,
				'created_at' => '2014-07-10 11:31:01',
				'updated_at' => '2014-07-10 11:31:01',
			),
			3 => 
			array (
				'categoryId' => 53,
				'name' => 'Pflanze',
				'mobidulId' => 16,
				'created_at' => '2014-07-10 11:31:01',
				'updated_at' => '2014-07-10 11:31:01',
			),
			4 => 
			array (
				'categoryId' => 54,
				'name' => 'Tier',
				'mobidulId' => 16,
				'created_at' => '2014-07-10 11:31:01',
				'updated_at' => '2014-07-10 11:31:01',
			),
			5 => 
			array (
				'categoryId' => 55,
				'name' => 'Station',
				'mobidulId' => 16,
				'created_at' => '2014-07-10 11:31:01',
				'updated_at' => '2014-07-10 11:31:01',
			),
		));
	}

}
