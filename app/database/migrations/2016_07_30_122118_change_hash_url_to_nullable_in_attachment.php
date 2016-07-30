<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class ChangeHashUrlToNullableInAttachment extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		DB::statement("ALTER TABLE `attachment` MODIFY `url` VARCHAR(255) NULL");
    DB::statement("ALTER TABLE `attachment` MODIFY `hash` VARCHAR(255) NULL");

  }

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
    DB::statement("ALTER TABLE `attachment MODIFY `url VARCHAR(255) NOT NULL");
    DB::statement("ALTER TABLE `attachment` MODIFY `hash` VARCHAR(255) NOT NULL");

	}

}
