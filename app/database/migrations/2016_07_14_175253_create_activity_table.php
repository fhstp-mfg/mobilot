<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateActivityTable extends Migration {

  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up ()
  {
    Schema::create('activity', function (Blueprint $table)
    {
      $table->increments('id');
      // Mobidul code
      $table->string('code');
      /// Activity
      $table->string('type', 64);
      $table->string('name', 64);
      // TEXT: 65,535 (2^16−1) bytes = 64 KiB
      $table->text('payload');
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down ()
  {
    Schema::drop('activity');
  }

}
