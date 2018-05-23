$(function(){
    $(document).ready(ocultar);
                
    $('a[name=btnLogin]').hover((function() {                        
       aparecer("a[name=btnLogin]");
    }));
          
    $('a[name=btnRegistro]').hover((function() {                         
        aparecer("a[name=btnRegistro]");
    }));                        
  
    $('form[name=formRegistro]').hover((function() {                           
        mostrarDeslizando("button[name=btnEnvio]");
    }));

    $("#geocomplete").geocomplete({
        map: "#mapa"
    });
});

/*$('button[name=btnRegistro]').click(aparecer);                         
$('button[name=btnDesvanecer]').click(desvanecer);                       
$('button[name=btnDeslizarMostrar]').click(mostrarDeslizando);                       
$('button[name=btnDeslizarOcultar]').click(ocultarDeslizando);*/

function mostrar(elemento){              
    $(elemento).show();                
}             

function ocultar(){             
    $("button[name=btnEnvio]").hide();
}                

function aparecer(elemento){                
   $(elemento).fadeToggle(1500);                 
}    

function mostrarDeslizando(elemento){
    $(elemento).slideDown(1000);
}   

function ocultarDeslizando(){                 
    $("p").slideUp(1000);              
}

function mapaGoogle() {                 
    var latitud = latitud();
    var longitud = longitud();
    alert("latitud "+latitud);
    alert("longitud "+longitud);
    var mapOptions = {
        center: new google.maps.LatLng(latitud, longitud),
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.HYBRID
    }
    var map = new google.maps.Map(document.getElementById("mapa"), mapOptions);
}

function latitud(){
    var lat = "";
    if (navigator.geolocation) {
        lat = navigator.geolocation.getCurrentPosition(devolverLatitud());
    }
    return lat;
}

function devolverLatitud(position){
    return position.coords.latitude;
}

function longitud(){
    var lon = "";
    if (navigator.geolocation) {
        lon = navigator.geolocation.getCurrentPosition(devolverLongitud());
    }
    return lon;
}

function devolverLongitud(position){
    return position.coords.longitude;
}

function crearNoticia(){
	var form = $("<form></form>");
	alert("hola");
	$('div[name=btnForm]').replaceWith(form);
}	