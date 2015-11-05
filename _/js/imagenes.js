var miapp = {
	/*Variable para almacenar los datos de la imagen*/
	miImagen:"",
	/* Variable para almacenar la referencia al elemento type file de formulario*/
	miarchivo:"",
	/* Variable para almacenar el id del item a crear o modificar*/
	miid:"",
	/* Variable para almacenar la referencia al elemento titulo del formulario de altas y de modificaciones*/
	mititulo:"",
	/* Variable para almacenar la referencia al elemento descripción del formulario de altas y de modificaciones*/
	midescripcion:"",
	/* Variable para almacenar el objeto con los datos del item a almacenar o modificar*/
	miimg_datos:"",
	
	iniciar: function(){
		
		/* Almaceno la referencia al elemento type file de formulario y le registro un detector para el evento 'onchange'*/
		miapp.miarchivo = document.getElementById('archivoimagen');
		miapp.miarchivo.addEventListener('change', this.procesarfile);
		
		/* Almaceno la referencia al elemento type button con id grabar de formulario y le registro un detector para el evento 'onclick'*/
		var boton=document.getElementById('grabar');
		boton.addEventListener('click', this.nuevoitem);
		
		/* Almaceno la referencia al elemento type button con id grabareditar de formularioeditar y le registro un detector para el evento 'onclick'*/
		var botoneditar=document.getElementById('grabareditar');
		botoneditar.addEventListener('click', this.modificaritem);
		
		/* Almaceno la referencia al elemento type button con id alta y le registro un detector para el evento 'onclick'*/
		var alta=document.getElementById('alta');
		alta.addEventListener('click', this.eliminaralerta);
		
		/* Ejecuto la función mostrar()*/
		this.mostrar();
	},
	
	/* Función que elimina el elemento con id alerta si este elemento existiese */
	eliminaralerta: function(){
		
		var alerta =document.getElementById('alerta'); 
		
		if (alerta != null){
			
			alerta.parentNode.removeChild(alerta);
		}
	},
	
	/* Esta función se ejecuta cuando seleccionamos un archivo desde nuestro ordenador */
	procesarfile: function(e){
		
		/*Se elimina el mensaje de alerta si existiese*/
		miapp.eliminaralerta();
		 /*
		  * La propiedad files enviada por el evento onchange de archivoimagen es una matriz, que contiene todos los archivos seleccionados.
		  * La almacenamos en el array archivos.
		  */
		var archivos = e.target.files;
		/*
		 * Como el atributo multiple no está presente en este elemento, el único elemento disponible será el primero 
		 * y lo almacenamos en la variable archivo
		 */
		var archivo = archivos[0];
		//Creamos el objeto lector, lo necesitamos para leer el archivo
		var lector = new FileReader();
		/*
		 * Registramos un detector para el evento onload con el objetivo de detectar cuando se carga el archivo.
		 * Guardamos en la variable miapp.miImagen el contenido del  archivo, que tomamos de la propiedad result del objeto lector
		 */
		lector.addEventListener('load', function(e){miapp.miImagen=e.target.result;});	
		/*
		 * El método readAsDataURL() genera una cadena del tipo dat:url codificada en base64 que representa los datos de archivo.
		 * Cuando este método finaliza la lectura del archivo, el evento load se dispara. 
		 * Le pasamos como parámetro archivo, que es un objeto File	
		 */
		lector.readAsDataURL(archivo);
	},
	
	// Esta función ejecuta el código para hacer altas de nuevas imágenes
	nuevoitem: function(){
		
		/*
		 * Se comprueba si se ha seleccionado un archivo, es el único dato obligatorio, 
		 * si no se ha seleccionado creo un elmento con id cuyo padre es el elemento con id cajaformulario
		 */
		if (miapp.miarchivo.value == ""){
			var cajaformulario = document.getElementById('cajaformulario');
			var alerta = document.createElement('div');
			alerta.setAttribute('id', "alerta");
			alerta.innerHTML = "El campo imagen es obligatorio";
			cajaformulario.appendChild(alerta);
			alerta.className = "alert-danger";
		} else {
			//Si se ha seleccionado un fichero sigo con la grabación
			//Almaceno en variables el contenido del título y la descripción
			var titulo=document.getElementById('titulo');
			var descripcion=document.getElementById('descripcion');
			
			/*
			 * El método getTime() me devuelde el número de mm desde 1970/01/01
			 * Lo voy a utilizar, junto con el string "img_" para generar una clave para el elmento que voy a almacenar
			 */ 
			var currentDate = new Date();
			var time = currentDate.getTime();
			var key = "img_" + time;
			var id= key;
			//Almaceno en  un objeto todos los datos del item a grabar
			miapp.miimg_datos = {
			    titulo: titulo.value,
			    descripcion: descripcion.value,
			    imagen: miapp.miImagen
			
			};
			
			/*
			 * Con el método JSON.stringify() convierto el objeto javascript a una cadena JSON
			 * Y llamo al método set.Item() para crear un item
			 */
			localStorage.setItem(id, JSON.stringify(miapp.miimg_datos));
			
			//Vacío todos los campos del formuario
			titulo.value="";
			descripcion.value="";
			miapp.miarchivo.value="";
			
			//Cierro la ventana modal donde se encuentra el formulario
			$('#altaModal').modal('hide');
			
			//Ejecuto mostrar() para actualizar el listado y que se muestre el nuevo item
			miapp.mostrar();
		}
	},

	//Esta función se ejecuta al hacer click en el botón Modificar de formularioeditar
   modificaritem: function(){
		//Almaceno en variables el contenido de los campos id, título, descripción y datos de la imagen del item a modificar del formulario formularioeditar
		var id = document.getElementById('idrecord').value;		
		var titulo = document.getElementById('tituloeditar').value;
		var descripcion = document.getElementById('descripcioneditar').value;
		var imagensrc = document.getElementById('imageneditar').src;
		
		//Almaceno en  un objeto todos los datos del item a modificar
		miapp.miimg_datos = {
		    titulo: titulo,
		    descripcion: descripcion,
		    imagen: imagensrc
		
		};
		
		/*
		* Con el método JSON.stringify() convierto el objeto javascript a una cadena JSON
		* Y llamo al método set.Item() para actualizar el item
		*/
		localStorage.setItem(id, JSON.stringify(miapp.miimg_datos));
		
		//Cierro la ventana modal donde se encuentra el formulario de modificación
		$('#modificacionModal').modal('hide');
		
		//Ejecuto mostrar() para actualizar el listado.
		miapp.mostrar();
	},
	
	/*
	 * Esta función se ejecuta al hacer click sobre el botón editar del listado.
	 * Muestra en el formuario los datos el item a modificar
	 */	
  	dameitem: function(clave){
		
		//Almaceno las referencias a los diferentes campos de formularioeditar
		var id=document.getElementById('idrecord');
		var titulo=document.getElementById('tituloeditar');
		var descripcion=document.getElementById('descripcioneditar');
		var cajaimagen = document.getElementById('cajaimagen');
		
		/*
		 * Llamo al método get.Item() para obtener el valor del item a modificar
		* Con el método JSON.parse() analizo el string devuelto como JSON y lo almaceno en un objeto
		*/
		var valor = localStorage.getItem(clave);
		var datos = JSON.parse(valor);
		
		//Asigno estos datos a los campos del formulario para mostrarlos
		id.value = clave;
		titulo.value = datos.titulo;
		descripcion.value = datos.descripcion;
		cajaimagen.innerHTML = '<img id="imageneditar" src="' + datos.imagen + '" >';
	},

   /*
    * Esta función se ejecuta al cargar la página y cada vez que se modifica un item o se da un alta de un nuevo item.
    * Se encarga de recuperar los items y pintarlos en pantalla
    */
   mostrar: function(){
   		//Almaceno la referencia al elemento donde se va mostrar el listado y lo limpio
		var cajadatos = document.getElementById('cajadatos');
		cajadatos.innerHTML = "";
		
		 //En esta variable creo el html del listado, no lo hago directamente sobre cajadatos porque no genera bien el <ul>
		var texto='<ul class="list-group">';
		//En este bucle recupero los items y los almaceno en la variable texto
		for (var f = 0; f < localStorage.length; f++){
			var clave = localStorage.key(f);
			var valor = localStorage.getItem(clave);
			var datos = JSON.parse(valor);
			
			texto += '<li class="list-group-item"><div class="col-sm-2"><img class="img-responsive" src="' + datos.imagen  + '" ></div><div class="col-sm-10"><h2 class="h4">' +  datos.titulo + '</h2>' + datos.descripcion + '</div><div class="botones col-sm-10"><button type="button" onclick="miapp.dameitem(\'' + clave + '\')" data-toggle="modal" data-target="#modificacionModal"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></button><button type="button" onclick="miapp.eliminar(\'' + clave + '\')"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button></div></li>';
	
		}
		texto += '</ul><div><input type="button" onclick="miapp.eliminarTodos()" value="Eliminar todo"></div>';
		//Pinto el listado en patalla
		cajadatos.innerHTML = texto;
	},
	
	//Esta función se ejecuta al hacer click en el botón eliminar de cada item, elimina el item selecionado
   eliminar: function(clave){
	
		if (confirm('¿Va a eliminar un item, está seguro?')){
			localStorage.removeItem(clave);
		}
		miapp.mostrar();
	},
	//Esta función se ejecuta al hacer click en el botom 'Eliminar todos'
   eliminarTodos: function(){
		if (confirm('¿Va a eliminar todos los items,Está seguro?')){
			localStorage.clear();
			mostrar();
		}
	}
};
//Registramos un detector para el evento onload al objeto Document, para que cuando se haya cargado la página ejecute iniciar()
addEventListener('load', function(){miapp.iniciar();});