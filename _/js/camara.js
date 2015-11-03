// JavaScript Document
//Declaro objeto global
var miapp = {
	miVideo:"",
	miFoto:"",
	dataURL:"",
	micanvas:"",
	micontexto:"",
	
	//La función iniciar() llama al método getUserMedia en cuanto el documento se ha cargado para tener acceso a la cámara web.
	//En caso de éxito se ejecuta la función exito()
	iniciar: function(){
		
		console.log(window.innerHeight);
		console.log(window.innerWidth);
		
		document.getElementById("media").width = window.innerWidth;
		document.getElementById("media").height = window.innerHeight;
		
		miapp.micanvas = document.getElementById('canvas');
		
		var boton=document.getElementById('grabar');
		boton.addEventListener('click', this.nuevoitem);
		
		//Aseguro la compatibilidad de la API en los distintos navegadores
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

		navigator.getUserMedia({video:true}, miapp.exito, miapp.mostraerror);
		
		
	},
	
	//Esta función se ejecuta si el usuario accede a que la app tenga acceso a la cámara web.
	//Esta función recibe el objeto LocalMediaStream y lo almacena en la variable stream
	exito: function(stream){
		
		//El vídeo de la cámara web se asigna al elemento <video>
		
		//En la variable miVideo se almacena una referencia al elemento con id media
		this.miVideo = document.getElementById('media');
		
		//Usando el método createObjectURL() se obtiene la URL que representa el stream
		//La URL se asigna al atributo src de elemento <video>
		this.miVideo.setAttribute('src', URL.createObjectURL(stream));
		
		//El vídeo se reproduce
		this.miVideo.play();
		
		//En la variable miFoto se almacena una referencia al elemento con id foto
		this.miFoto = document.getElementById('foto');
		//Se añade un detector para el evento onclick en el elemento <video>
		this.miFoto.addEventListener('click', miapp.instantanea.bind(this.miVideo));
			
	},
	
	mostraerror: function(e){
		console.log(e.code);	
	},
	
	//Esta función ejecuta el código para tomar una instatánea, cuando se hace click en el elemento con id foto
	//Se toma el fotograma de vídeo actual y se dibuja en el lienzo, tomando una instantánea
	instantanea: function(){
		
		//Se crea el contexto del lienzo
		miapp.micontexto = miapp.micanvas.getContext('2d');
		
		//Se llama al método de canvas drawImage() con una referencia al vídeo a los valores correspondientes al tamaño del elemento <canvas>
		miapp.micontexto.drawImage(this, 0, 0, 320, 240);
		
		miapp.dataURL = miapp.micanvas.toDataURL();
		
	
	},
	
	nuevoitem: function(){
		var titulo=document.getElementById('titulo').value;
		var descripcion=document.getElementById('descripcion').value;
	
		var currentDate = new Date();
		var time = currentDate.getTime();
		var key = "img_" + time;
		var img_id= key;
		var img_datos = {
		    titulo: titulo,
		    descripcion: descripcion,
		    imagen: miapp.dataURL
		
		};
	
		localStorage.setItem(img_id, JSON.stringify(img_datos));
		
		document.getElementById('titulo').value="";
		document.getElementById('descripcion').value="";
		//miapp.micanvas.width = miapp.micanvas.width;
		miapp.micontexto.clearRect(0,0,miapp.micanvas.width, miapp.micanvas.height);
		$('#myModal').modal('hide');
	}
};
//Registramos un detector para el evento onload al objeto Document, para que cuando se haya cargado la página ejecute iniciar()
addEventListener('load', function(){miapp.iniciar();});
