<?php

class MobidulTableSeeder extends Seeder {

  /**
   * Auto generated seed file
   *
   * @return void
   */
  public function run()
  {
    \DB::table('mobidul')->truncate();

    \DB::table('mobidul')->insert([
      0 => [
        'mobidulId' => 15,
        'name' => 'guide',
        'code' => 'guide',
        'created_at' => '2014-07-10 11:31:01',
        'updated_at' => '2014-07-10 11:31:01',
                'minAccuracy'=> 100,
                'defaultPage_stationCode'=>'AllGeBra',
                'flagCodeSnippet'=>true,
                'flagScanCode'=>true,
                'flagGetByLocation'=>true,
                'flagGetByTime'=>false,
                'centerLat'=>48.18422587351,
                'centerLon'=>16.08575732002,
                'centerRadius'=>1000,
      ],
      1 => [
        'mobidulId' => 16,
        'name' => 'wald',
        'code' => 'wald',
        'created_at' => '2014-07-10 11:31:01',
        'updated_at' => '2014-07-10 11:31:01',
        'defaultPage_stationCode'=>'ahorn',
        'flagScanCode'=>true,
        'flagGetByLocation'=>true,
        'centerLat'=>48.234506906852,
        'centerLon'=>15.477418904399,
        'centerRadius'=>1000,
      ],
    ]);
  }
}
