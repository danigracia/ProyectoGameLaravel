var esperando;
var compruebaInvi;
var iduser;
var idpartida;
var compruebaLose;
var turno;

comprobarInvitaciones();
compruebaPartidasCreadas();

function resetGame() {
    window.location.reload();
}

/**
 * @description Esta funcion se encarga de comprobar si en usuario en concreto tiene alguna partida creada, si es asi la carga.
 * @author Dani
 **/
function dataDivUsers(data){
    var usu1 = $('<h4 id="usu_1"></h4>');
    var usu2 = $('<h4 id="usu_2"></h4>');
    if(data["userid"] == data["data"][0]["id_usu_2"]){
        usu1.text("Tu: " + data["data"][0]['id_usu_2']);
        usu2.text("Oponente: " + data["data"][0]['id_usu_1']);
    }
    else {
        usu1.text("Tu: " + data["data"][0]['id_usu_1']);
        usu2.text("Oponente: " + data["data"][0]['id_usu_2']);
    }
    $('#boxGame').empty().append(
        $('<div class="col-md-4"></div>').append(
            $('<h4 id="numPartida"></h4>').text('#numerodepartida' + data["data"][0]['id']).append(
                usu1).append(
                usu2)));
}

function dataDivPanelGame() {
    $('#boxGame').append(
        $('<div class="col-md-3"></div>').append(
            $('<table border="1"></table>').append(
                $('<tr></tr>').append(
                    $('<th id="pos1" style="width: 50px;height: 50px; text-align: center;"></th>').text("uno"),
                    $('<th id="pos2" style="width: 50px;height: 50px;text-align: center;"></th>').text("dos"),
                    $('<th id="pos3" style="width: 50px;height: 50px;text-align: center;"></th>').text("tres")),
                $('<tr></tr>').append(
                    $('<th id="pos4" style="width: 50px;height: 50px; text-align: center;"></th>').text("cuatro"),
                    $('<th id="pos5" style="width: 50px;height: 50px; text-align: center;"></th>').text("cinco"),
                    $('<th id="pos6" style="width: 50px;height: 50px; text-align: center;"></th>').text("seis")),
                $('<tr></tr>').append(
                    $('<th id="pos7" style="width: 50px;height: 50px; text-align: center;"></th>').text("siete"),
                    $('<th id="pos8" style="width: 50px;height: 50px; text-align: center;"></th>').text("ocho"),
                    $('<th id="pos9" style="width: 50px;height: 50px; text-align: center;"></th>').text("nueve"))
            )));
}

function dataDivSelectGame(){
    $('#boxGame').append(
        $('<div id="movAction" class="col-md-2"></div>').append(
            $('<select id="selectPos" class="form-control" name="posicion">').append(
                $('<option value="pos1">uno</option>'),
                $('<option value="pos2">dos</option>'),
                $('<option value="pos3">tres</option>'),
                $('<option value="pos4">cuatro</option>'),
                $('<option value="pos5">cinco</option>'),
                $('<option value="pos6">seis</option>'),
                $('<option value="pos7">siete</option>'),
                $('<option value="pos8">ocho</option>'),
                $('<option value="pos9">nueve</option>')),
            $('<button id="haceMov" onclick="ponerNumero()" class="btn btn-primary col-md-12">Hacer movimiento</button>')
        ));
}

function compruebaPartidasCreadas(){
    $.ajax({
        url: "game/comprobarCreada/" + "1",
        type: "get",
        dataType: "json",
        success: function (data) {
            if(data['status']=="ok"){
                iduser = data["userid"];
                idpartida = data["data"][0]['id'];
                clearInterval(compruebaInvi);
                lose();
                dataDivUsers(data);
                dataDivPanelGame();
                dataDivSelectGame();
                setTimeout(function(){
                    movimientos();
                },1000);
            }

        }
    });

}

/**
 * @description Esta funcion se encarga de actualizar el tablero 3x3 con los ID de los usuarios jugadores cada vez que realiza un movimiento un jugador y elimina las posiciones de la lista.
 * @author Dani
 **/

function movimientos() {
    $.ajax({
        url: "game/cogerMovimientos/" + idpartida,
        type: "get",
        dataType: "json",
        success: function (data) {
            for(var key in data["values"]){
                $('#'+data["values"][key]["posicion"]).text(data["values"][key]["id_usu"]);
                $('#selectPos [value='+data["values"][key]["posicion"]+']').remove();

            }
        }
    });
}

/**
 * @description Esta funcion comprueba si el usuario ha sido invitado a alguna partida, en caso de ser invitado muestra el panel de juego, si ya tiene una partida en proceso al acceder a la pagina tambien la carga con los datos correspondientes.
 * @author Dani
 **/

function comprobarInvitaciones(){
    compruebaInvi = setInterval(function() {
        $.ajax({
            url: "game/comprobarInvitacion/" + "1",
            type: "get",
            dataType: "json",
            success: function (data) {
                if(data['status']=="ok"){
                    iduser = data["userid"];
                    idpartida = data["data"][0]['id'];
                    clearInterval(compruebaInvi);
                    lose();
                    dataDivUsers(data);
                    dataDivPanelGame();
                    dataDivSelectGame();
                    setTimeout(function(){
                        movimientos();
                    },1000);
                }
            }
        });
    },700);

}

/**
 * @description Esta funcion se encarga de crear la partida, enviandole por ajax al servidor la id del usuario al que invita a jugar y deja el juego en espera hasta que el usuario invitado haga el primer movimiento.
 * @author Dani
 **/

function crearPartida(){
    var user = $('#selectName').val();
    $.ajax({
        url: "game/crearPartida/"+user,
        type: "GET",
        dataType: "json",
        success: function (data) {
            idpartida = data['values'][0]['id'];
        }
    });
    $('#boxGame').empty();
    setTimeout(function () {
        esperandoPrimerMov();
        comprobarTurno();
    },200);
}

/**
 * @description Esta funcion es llamada cuando el usuario crea la partida. Esta constantemente comprobando si se ha realizado el movimiento, cuando se realiza se corta la llamada y carga el panel de juego con los datos.
 * @author Dani
 **/

function esperandoPrimerMov() {
    var primer = setInterval(function () {
        $.ajax({
            url: "game/primerMov/"+idpartida,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data["msg"]=="now"){
                    compruebaPartidasCreadas();
                    clearInterval(primer);
                }

            }
        });
    },200);
}

/**
 * @description Esta funcion sirve para hacer una animacion visual y que el usuario vea que no se ha quedado colgado el proceso de espera.
 * @author Dani
 **/

function esperandoOponente() {
    esperando = setInterval(function(){
        var value = $('#Esperando').text();
        if(value == "Esperando al oponente"){
            $('#Esperando').text("Esperando al oponente.");
        }
        else if(value == "Esperando al oponente."){
            $('#Esperando').text("Esperando al oponente..");
        }
        else if(value == "Esperando al oponente.."){
            $('#Esperando').text("Esperando al oponente...");
        }
        else if(value == "Esperando al oponente..."){
            $('#Esperando').text("Esperando al oponente");
        }
    },300);
}

/**
 * @description Esta funcion comprueba el turno, para saber a quien le toca mover.
 * @author Dani
 **/

function comprobarTurno(){
    turno = setInterval(function () {
        $.ajax({
            url: "game/comprobarTurno/"+idpartida,
            type: "GET",
            dataType: "json",
            success: function (data) {
                var max = data['values'].length;
                if(data['values'][max-1]['id_usu']==iduser){
                    if($('#boxEsperando').length==0){
                        $('#movAction').hide();
                        $('#boxGame').append(
                            $('<div id="boxEsperando" class="col-md-4"></div>').append($('<h3 id="Esperando">Esperando al oponente</h3>')));
                        esperandoOponente();
                    }
                }
                else{
                    $('#movAction').show();
                    $('#boxEsperando').remove();
                    clearInterval(turno);
                }
                movimientos();
            }
        });
    },150);
}

/**
 * @description Esta funcion sirve para pintar los movimientos de cada usuario jugador.
 * @author Dani
 **/

function ponerNumero() {
    var posicion = $('#selectPos').val();
    $('#'+posicion).text(iduser);
    $('#selectPos [value='+posicion+']').remove();
    $.ajax({
        url: "game/crearMovimiento/"+posicion+"/"+idpartida,
        type: "GET",
        dataType: "json",
        success: function (data) {
            comprobarWin(data);
        }
    });
    comprobarTurno();
}


function addButtonReset() {
    clearInterval(esperando);
    $('#boxEsperando').remove();
    $('#boxGame').append(
        $('<button onclick="resetGame()" class="btn btn-primary col-md-4">Reiniciar Juego</button>')
    )
}

/**
 * @description Esta funcion es llamada cuando el usuario gana la partida.
 * @author Dani
 **/

function win() {
    clearInterval(esperando);
    clearInterval(compruebaLose);
    clearInterval(turno);
    $('#boxEsperando').remove();
    $.ajax({
        url: "game/victoria/"+idpartida,
        type: "GET",
        dataType: "json",
        success: function (data) {
            $('#boxGame').empty().append($('<h2>WIN!!!!</h2>'));
            addButtonReset();
        }
    });

}

/**
 * @description Esta funcion es llamada cada vez que un usuario realiza un movimiento y comprueba si ha ganado la partida o no con ese ultimo movimiento.
 * @author Dani
 * @param {json} data - Datos recibidos por ajax.
 **/

function comprobarWin(data) {
    var arrayPos = new Array();
    for(var key in data["values"]){
        arrayPos.push(data["values"][key]["posicion"]);
    }
    if((arrayPos.indexOf("pos1")>=0 && arrayPos.indexOf("pos2")>=0 && arrayPos.indexOf("pos3")>=0) ||
        (arrayPos.indexOf("pos4")>=0 && arrayPos.indexOf("pos5")>=0 && arrayPos.indexOf("pos6")>=0) ||
        (arrayPos.indexOf("pos7")>=0 && arrayPos.indexOf("pos8")>=0 && arrayPos.indexOf("pos9")>=0) ||
        (arrayPos.indexOf("pos1")>=0 && arrayPos.indexOf("pos4")>=0 && arrayPos.indexOf("pos7")>=0) ||
        (arrayPos.indexOf("pos2")>=0 && arrayPos.indexOf("pos5")>=0 && arrayPos.indexOf("pos8")>=0) ||
        (arrayPos.indexOf("pos3")>=0 && arrayPos.indexOf("pos6")>=0 && arrayPos.indexOf("pos9")>=0) ||
        (arrayPos.indexOf("pos1")>=0 && arrayPos.indexOf("pos5")>=0 && arrayPos.indexOf("pos9")>=0) ||
        (arrayPos.indexOf("pos3")>=0 && arrayPos.indexOf("pos5")>=0 && arrayPos.indexOf("pos7")>=0)){
        win();
        clearInterval(esperando);
        $('#boxEsperando').remove();
    }
}

/**
 * @description Esta funcion es llamada cuando carga el panel de juego, para ir comprobando si el usuario a perdido, en caso de que pierda elimina el panel de juego y le dice al usuario que ha perdido.
 * @author Dani
 **/

function  lose() {
    compruebaLose = setInterval(function () {
        $.ajax({
            url: "game/derrota/"+idpartida,
            type: "GET",
            dataType: "json",
            success: function (data) {
                if(data['msg']=="derrota"){
                    $('#boxGame').empty().append($('<h2>LOSE!!!!</h2>'));
                    addButtonReset();
                    clearInterval(compruebaLose);
                }
            }
        });
    },1500);
}
