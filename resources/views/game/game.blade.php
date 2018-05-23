@extends('layouts.app')

@section('content')
    <script type="text/javascript" src="/js/game.js"></script>
    <?php header('Access-Control-Allow-Origin: *');?>
    <div class="container">
        {{ csrf_field() }}
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <div class="row">
            <div id="boxGame" class="col-md-12">
                <h4>Si te aburres puedes echar un 3 en raya...</h4>
                <div class="col-md-6">
                    <div id="optionName">
                        <select id="selectName" class="form-control" name="user">
                            @foreach($nombres as $nombre)
                                <option value="<?php echo $nombre->id?>"><?php echo $nombre->name?></option>
                            @endforeach
                        </select>
                    </div>
                </div>
                <div class="col-md-6">
                    <button class="btn btn-primary col-md-12" onclick="crearPartida()">Crear partida</button>
                </div>
            </div>
        </div>
    </div>

@endsection