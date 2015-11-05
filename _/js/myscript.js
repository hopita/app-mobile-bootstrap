var miapp = {
	
	//La función iniciar() llama al método mostrar() que listára las imágenes en pantalla
	iniciar: function(){
		
		this.mostrar();
	},
	
	//Esta función inicializa el plugin masonry, que se ha utilizado para obtener la disposición de la imágenes en pantalla tipo pinterest
	init_masonry: function(){
		//Almaceno la referncia al elemento con clase content 
	    var $container = $('.content');
	
		//Llamo al método imagesLoaded del plugin imagesloaded.js utilizado para detectar cuando las imágenes se han cargado e inicializo el plugin masonry
	    $container.imagesLoaded( function(){
	        $container.masonry({
	          itemSelector: '.thumb',
	          isAnimated: true
	        });
	    });
	},
	
	//Esta función se ejecuta para determinar si los botones de navegación se tienen que esconder cdo es la primera diapositiva o la última
	disableButtons: function(counter_max, counter_current){
        $('#show-previous-image, #show-next-image').show();
        if(counter_max == counter_current){
            $('#show-next-image').hide();
        } else if (counter_current == 1){
            $('#show-previous-image').hide();
        }
    },
	
	 /**
     *
     * @param setIDs        Sets IDs when DOM is loaded. If using a PHP counter, set to false.
     * @param setClickAttr  Sets the attribute for the click handler.
     */
	//Esta función gestiona la galería para su visualización en la ventana modal, se ejecuta una vez que se ha generado el listado de imágenes
    loadGallery: function(setIDs, setClickAttr){
        var current_image,
            selector,
            counter = 0;
		
		//Cuando se hace click en los botones de navegación se determina qué dispositiva se debe visualizar y se llama a la función updateGallery() a la que se le pasa el id de la dispositiva que se debe mostrar
        $('#show-next-image, #show-previous-image').click(function(){
            if($(this).attr('id') == 'show-previous-image'){
                current_image--;
            } else {
                current_image++;
            }

            selector = $('[data-image-id="' + current_image + '"]');
            updateGallery(selector);
        });
		
		/*
		 *Se muestra la imagen actual con el título y la descripción y se determina si se debe ocultar alguno de los botones de navegación
		 * A esta función se le llama cada vez que hacemos click en uno de los botones de navegación y cuando se hace click a una de las miniaturas del listado
		 */
        function updateGallery(selector) {
            var $sel = selector;
            current_image = $sel.data('image-id');
            $('#image-gallery-caption').text($sel.data('caption'));
            $('#image-gallery-title').text($sel.data('title'));
            $('#image-gallery-image').attr('src', $sel.data('image'));
            miapp.disableButtons(counter, $sel.data('image-id'));
        }
		
		/*Se asigna un id a cada diapositiva y se asigna a la variable counter el total de items,
		 * para posteriormente enviarlo como uno de los parámetro a la funcion disableButtons, para determinar si es la última diapositiva
		 */
        if(setIDs == true){
            $('[data-image-id]').each(function(){
                counter++;
                $(this).attr('data-image-id',counter);
            });
        }
        
        /*
         *La variable setClickAttr almacena la referencia a los enlaces del listado con clase .thumbnail 
         * Al hacer click en uno de ellos se muestra la galería en la ventana modal llamando al método updateGallery();
         */
        $(setClickAttr).on('click',function(){
            updateGallery($(this));
        });
    },
    
    //Esta función genera el html que pinta el listado de miniaturas en la pantalla.
    mostrar: function(){
		var cajadatos = document.getElementById('cajadatos');
		
		var texto ="";
	
		cajadatos.innerHTML = "";
		//En este bucle recupero los items y los almaceno en la variable texto
		for (var f = 0; f < localStorage.length; f++){
			var clave = localStorage.key(f);
			var valor = localStorage.getItem(clave);
			var datos = JSON.parse(valor);
			
			texto += '<div class="col-lg-3 col-md-4 col-xs-6 thumb"><a class="thumbnail" href="#" data-image-id="" data-toggle="modal" data-title="' +  datos.titulo + '" data-caption="' +  datos.descripcion + '" data-image="' + datos.imagen  + '" data-target="#image-gallery"><img class="img-responsive" src="' + datos.imagen  + '" alt="Short alt text"></a></div>';
	
		}
		//Pinto el listado en patalla
		cajadatos.innerHTML = texto;
		
		//Inicializo el plugin masonry
		miapp.init_masonry();
		
		//LLamo a la función loadGallery que genera el id de las imagenes y gestiona el carrusel que se mostrará en la ventana modal a hacer click en las miniaturas
		miapp.loadGallery(true, 'a.thumbnail');
	}
};
//Registramos un detector para el evento onload al objeto Document, para que cuando se haya cargado la página ejecute iniciar()
addEventListener('load', function(){miapp.iniciar();});



