<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddUserToActivityTable extends Migration {

  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up ()
  {
    Schema::table('activity', function (Blueprint $table)
    {
      $table->integer('user')->after('code');
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down ()
  {
    Schema::table('activity', function (Blueprint $table)
    {
      $table->dropColumn('user');
    });
  }

}
