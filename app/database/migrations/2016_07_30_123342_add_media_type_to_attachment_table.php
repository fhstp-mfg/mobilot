<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddMediaTypeToAttachmentTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
    Schema::table('attachment', function (Blueprint $table) {
      $table->string('mediaType')->nullable()->after('componentId');
    });
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::table('attachment', function (Blueprint $table) {
		  $table->dropColumn('mediaType');
    });
	}

}
