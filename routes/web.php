<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::get('/', 'HomeController@welcome')->name('root');

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');

Route::get('game/comprobarInvitacion/{id}', 'gameController@compInvi');

Route::get('game/comprobarCreada/{id}', 'gameController@compCreada');

Route::get('game/cogerMovimientos/{idpartida}', 'gameController@getMov');

Route::get('game/comprobarTurno/{idpartida}', 'gameController@compTurno');

Route::get('game/primerMov/{idpartida}', 'gameController@primerMov');

Route::get('game/crearMovimiento/{pos}/{idpartida}', 'gameController@crearMov');

Route::get('game/victoria/{idpartida}', 'gameController@victoria');

Route::get('game/derrota/{idpartida}', 'gameController@derrota');

Route::get('game/crearPartida/{id}', 'gameController@crearPartida');

Route::get('game', 'gameController@index')->name('xat');
