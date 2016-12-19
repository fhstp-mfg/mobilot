<?php

class User2mobidulTableSeeder extends Seeder {

  /**
   * Auto generated seed file
   *
   * @return void
   */
  public function run()
  {
    \DB::table('user2mobidul')->truncate();

    \DB::table('user2mobidul')->insert(array (
      0 =>
      array (
        'userId' => 50,
        'mobidulId' => 15,
        'rights' => 0,
        'created_at' => '2014-07-10 11:31:02',
        'updated_at' => '2014-07-10 11:31:02',
      ),
      1 =>
      array (
        'userId' => 50,
        'mobidulId' => 16,
        'rights' => 0,
        'created_at' => '2014-07-10 11:31:02',
        'updated_at' => '2014-07-10 11:31:02',
      ),
      2 =>
      array (
        'userId' => 51,
        'mobidulId' => 15,
        'rights' => 0,
        'created_at' => '2014-07-10 11:31:02',
        'updated_at' => '2014-07-10 11:31:02',
      ),
      3 =>
      array (
        'userId' => 51,
        'mobidulId' => 16,
        'rights' => 0,
        'created_at' => '2014-07-10 11:31:02',
        'updated_at' => '2014-07-10 11:31:02',
      ),
      4 =>
      array (
        'userId' => 52,
        'mobidulId' => 15,
        'rights' => 0,
        'created_at' => '2014-07-10 11:31:02',
        'updated_at' => '2014-07-10 11:31:02',
      ),
      5 =>
      array (
        'userId' => 52,
        'mobidulId' => 16,
        'rights' => 0,
        'created_at' => '2014-07-10 11:31:02',
        'updated_at' => '2014-07-10 11:31:02',
      ),
      6 =>
      array (
        'userId' => 53,
        'mobidulId' => 15,
        'rights' => 0,
        'created_at' => '2014-07-10 11:31:02',
        'updated_at' => '2014-07-10 11:31:02',
      ),
      7 =>
      array (
        'userId' => 53,
        'mobidulId' => 16,
        'rights' => 0,
        'created_at' => '2014-07-10 11:31:02',
        'updated_at' => '2014-07-10 11:31:02',
      ),
    ));
  }

}
