<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFeedbackTable extends Migration {

  /**
   * Run the migrations.
   *
   * @return void
   */
  public function up()
  {
    Schema::create('feedback', function(Blueprint $table)
    {
      $table->increments('id');
      $table->integer('user')->unsigned();
      $table->string('code');
      $table->text('feedback');
      $table->tinyInteger('status')->default(0);
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   *
   * @return void
   */
  public function down()
  {
    Schema::drop('feedback');
  }

}
