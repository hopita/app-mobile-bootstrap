var miapp = {
	miImagen:"",
	
	
	iniciar: function(){

		var archivoimagen = document.getElementById('archivoimagen');
		archivoimagen.addEventListener('change', this.procesarfile);
		
		var boton=document.getElementById('grabar');
		boton.addEventListener('click', this.nuevoitem);
		
		var botoneditar=document.getElementById('grabareditar');
		botoneditar.addEventListener('click', this.editaritem);
		
		addEventListener("storage", this.mostrar);
		this.mostrar();
	},

	procesarfile: function(e){
		var archivos = e.target.files;
		archivo = archivos[0];
		var lector = new FileReader();
		lector.addEventListener('load', function(e){miapp.miImagen=e.target.result;});		
		lector.readAsDataURL(archivo);
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
		    imagen: miapp.miImagen
		
		};
	
		localStorage.setItem(img_id, JSON.stringify(img_datos));
		
		document.getElementById('titulo').value="";
		document.getElementById('descripcion').value="";
		document.getElementById('archivoimagen').value="";
		$('#myModal').modal('hide');
		 miapp.mostrar();
	},

   editaritem: function(){
	
		var id = document.getElementById('idrecord').value;
		var titulo = document.getElementById('tituloeditar').value;
		var descripcion = document.getElementById('descripcioneditar').value;
		var imagensrc = document.getElementById('imageneditar').src;
		
		var img_id = id;
		var img_datos = {
		    titulo: titulo,
		    descripcion: descripcion,
		    imagen: imagensrc
		
		};
	
		localStorage.setItem(img_id, JSON.stringify(img_datos));
		$('#myModal2').modal('hide');
		miapp.mostrar();
	},

  	editar: function(clave){
	
		var id=document.getElementById('idrecord');
		var titulo=document.getElementById('tituloeditar');
		var descripcion=document.getElementById('descripcioneditar');
		var cajaimagen = document.getElementById('cajaimagen');
		
		var valor = localStorage.getItem(clave);
		var datos = JSON.parse(valor);
		
		id.value = clave;
		titulo.value = datos.titulo;
		descripcion.value = datos.descripcion;
		cajaimagen.innerHTML = '<img id="imageneditar" src="' + datos.imagen + '" >';
	},

   mostrar: function(){
		var cajadatos = document.getElementById('cajadatos');
	
		cajadatos.innerHTML = "";
		var texto='<ul class="list-group">';
		for (var f = 0; f < localStorage.length; f++){
			var clave = localStorage.key(f);
			var valor = localStorage.getItem(clave);
			var datos = JSON.parse(valor);
			
			texto += '<li class="list-group-item"><div class="col-sm-2"><img class="img-responsive" src="' + datos.imagen  + '" ></div><div class="col-sm-10"><h2 class="h4">' +  datos.titulo + '</h2>' + datos.descripcion + '</div><div class="botones col-sm-10"><button type="button" onclick="miapp.editar(\'' + clave + '\')" data-toggle="modal" data-target="#myModal2"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></button><button type="button" onclick="miapp.eliminar(\'' + clave + '\')"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button></div></li>';
	
		}
		texto += '</ul><div><input type="button" onclick="miapp.eliminarTodos()" value="Eliminar todo"></div>';
		cajadatos.innerHTML = texto;
	},

   eliminar: function(clave){
	
		if (confirm('¿Está seguro?')){
			console.log(clave);
			localStorage.removeItem(clave);
		}
		miapp.mostrar();
	},

   eliminarTodos: function(){
		if (confirm('¿Está seguro?')){
			localStorage.clear();
			mostrar();
		}
	}
};
//Registramos un detector para el evento onload al objeto Document, para que cuando se haya cargado la página ejecute iniciar()
addEventListener('load', function(){miapp.iniciar();});