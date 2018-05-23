<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableGame extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('partidas', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('id_creador')->unsigned();
            $table->foreign('id_creador')->references('id')
                ->on('users')->onDelete('cascade');
            $table->integer('id_usu_1')->unsigned();
            $table->foreign('id_usu_1')->references('id')
                ->on('users')->onDelete('cascade');
            $table->integer('id_usu_2')->unsigned();
            $table->foreign('id_usu_2')->references('id')
                ->on('users')->onDelete('cascade');
            $table->string('winner')->nullable();
        });

        Schema::create('movimientos', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('id_partida')->unsigned();
            $table->foreign('id_partida')->references('id')
                ->on('partidas')->onDelete('cascade');
            $table->string('posicion');
            $table->integer('id_usu')->unsigned();
            $table->foreign('id_usu')->references('id')
                ->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('sala');
    }
}
