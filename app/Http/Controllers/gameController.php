<?php

namespace App\Http\Controllers;
use DB;
use Session;
use auth;
use Illuminate\Http\Request;
use App\partida;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Input;
use Carbon\Carbon;

class gameController extends Controller
{
    public function index()
    {
        $nombres = DB::select("SELECT id, name from users where id != ".Auth::user()->id."");
        return view('game.game',['nombres' => $nombres]);
    }

    public function crearPartida($id){

        DB::table('partidas')->insert(
            ['id_usu_2' => $id, 'id_usu_1' => Auth::user()->id, 'id_creador' => Auth::user()->id, 'winner' => '']
        );
        $partida = DB::select("SELECT id from partidas where id_creador = ".Auth::user()->id." and winner=''");

        $response = array(
            'status' => 'success',
            'msg' => 'usuario invitado',
            'values' => $partida,
        );

        return $response;
    }

    public function compInvi($id){
        $userid = Auth::user()->id;
        $numbers = DB::select("SELECT count(id) cantidad FROM partidas WHERE (id_usu_1 = ".Auth::user()->id." or id_usu_2 = ".Auth::user()->id.") and winner='' and id_creador!=".Auth::user()->id."");
        foreach ($numbers as $number) {
            if ($number->cantidad > 0) {
                $dbquery = DB::select("SELECT id, id_usu_1, id_usu_2 FROM partidas WHERE (id_usu_1 = ".Auth::user()->id." or id_usu_2 = ".Auth::user()->id.") and winner='' and id_creador!=".Auth::user()->id."");
                $response = array(
                    'status' => 'ok',
                    'userid' => $userid,
                    'data' => $dbquery,
                );

                return $response;
            }
        }
    }

    public function compCreada($id){
        $userid = Auth::user()->id;
        $numbers = DB::select("SELECT count(id) cantidad FROM partidas WHERE winner='' and id_creador=".Auth::user()->id."");
        foreach ($numbers as $number) {
            if ($number->cantidad > 0) {
                $dbquery = DB::select("SELECT id, id_usu_1, id_usu_2 FROM partidas WHERE winner='' and id_creador=".Auth::user()->id."");
                $response = array(
                    'status' => 'ok',
                    'userid' => $userid,
                    'data' => $dbquery,
                );

                return $response;
            }
            else{
                $response = array(
                    'status' => 'no',
                    'userid' => $userid,
                );
                return $response;

            }
        }

    }

    public function crearMov($pos, $idpartida){
        DB::table('movimientos')->insert(
            ['id_partida' => $idpartida, 'posicion' => $pos, 'id_usu' => Auth::user()->id]
        );

        $checkwin = DB::select("Select posicion from movimientos where id_partida = ".$idpartida." and id_usu = ".Auth::user()->id."");

        $response = array(
            'status' => 'success',
            'msg' => 'movimiento creado',
            'values' => $checkwin,
        );

        return $response;
    }

    public function victoria($idpartida){
        DB::update("UPDATE partidas SET winner = ".Auth::user()->id." WHERE partidas.id = ".$idpartida."");
        $response = array(
            'status' => 'success',
            'msg' => 'User '.Auth::user()->id.' win game '.$idpartida,
        );

        return $response;
    }

    public function derrota($idpartida){
        $comprueba=DB::select("Select count(id) cantidad from partidas where winner!=".Auth::user()->id." and winner!='' and id = ".$idpartida."");
        foreach ($comprueba as $number) {
            if ($number->cantidad > 0) {
                $response = array(
                    'status' => 'success',
                    'msg' => 'derrota',
                );
                return $response;
            }
        }

    }

    public function getMov($idpartida){
        $movimientos = DB::select("Select posicion, id_usu from movimientos where id_partida = ".$idpartida."");

        $response = array(
            'status' => 'success',
            'msg' => 'movimientos',
            'values' => $movimientos,
        );
        return $response;
    }

    public function compTurno($idpartida){
        $turno = DB::select("select count(id) cantidad from movimientos where id_partida = ".$idpartida."");
        foreach ($turno as $number) {
            if ($number->cantidad > 0) {
                $turnoquery = DB::select("select id_usu from movimientos where id_partida = ".$idpartida." ORDER BY id DESC LIMIT 1");
            }
            else{
                $turnoquery = DB::select("select id_creador from partidas where id = ".$idpartida."");
            }
        }
        $response = array(
            'status' => 'success',
            'msg' => 'turno',
            'values' => $turnoquery,
        );
        return $response;
    }

    public function primerMov($idpartida){
        $primer = DB::select("select count(id) cantidad from movimientos where id_partida = ".$idpartida."");
        foreach ($primer as $number) {
            if ($number->cantidad > 0) {
                $response = array(
                    'status' => 'success',
                    'msg' => 'now',
                );
                return $response;
            }
        }
    }
}
