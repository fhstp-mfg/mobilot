<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddIsAdminToUser extends Migration {

  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::table('user', function(Blueprint $table)
    {
      $table->boolean('admin')->default(false)->after('guest');
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::table('user', function(Blueprint $table)
    {
      $table->dropColumn('admin');
    });
  }

}
