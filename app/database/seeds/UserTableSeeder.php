<?php

class UserTableSeeder extends Seeder {

	/**
	 * Auto generated seed file
	 *
	 * @return void
	 */
	public function run()
	{
		\DB::table('user')->truncate();
        
		\DB::table('user')->insert(array (
			0 => 
			array (
				'userId' => 50,
				'name' => 'thomas',
				'password' => 'thomas',
				'email' => '',
				'created_at' => '2014-07-10 11:31:01',
				'updated_at' => '2014-07-10 11:31:01',
			),
			1 => 
			array (
				'userId' => 51,
				'name' => 'admin',
				'password' => 'a65d6d47d7d41c981f32db32d37b24206cc21ce12a49fc0d86ce6a23f6f26318',
				'email' => '',
				'created_at' => '2014-07-10 11:31:01',
				'updated_at' => '2014-07-10 11:31:01',
			),
			2 => 
			array (
				'userId' => 52,
				'name' => 'tom',
				'password' => 'e1608f75c5d7813f3d4031cb30bfb786507d98137538ff8e128a6ff74e84e643',
				'email' => '',
				'created_at' => '2014-07-10 11:31:01',
				'updated_at' => '2014-07-10 11:31:01',
			),
			3 => 
			array (
				'userId' => 53,
				'name' => 'user',
				'password' => '7f2f8f2a69e2d7d5619a0c35b7663e458a1b6b0d4502a19232679512f8e4a210',
				'email' => '',
				'created_at' => '2014-07-10 11:31:01',
				'updated_at' => '2014-07-10 11:31:01',
			),
		));
	}

}
