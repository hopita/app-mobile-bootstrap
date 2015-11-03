var miapp = {
	
	//La función iniciar() llama al método getUserMedia en cuanto el documento se ha cargado para tener acceso a la cámara web.
	//En caso de éxito se ejecuta la función exito()
	iniciar: function(){
		this.mostrar();
	},
	
	init_masonry: function(){
	    var $container = $('.content');
	
	    $container.imagesLoaded( function(){
	        $container.masonry({
	          itemSelector: '.thumb',
	          isAnimated: true
	        });
	    });
	},
	
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

    loadGallery: function(setIDs, setClickAttr){
        var current_image,
            selector,
            counter = 0;

        $('#show-next-image, #show-previous-image').click(function(){
            if($(this).attr('id') == 'show-previous-image'){
                current_image--;
            } else {
                current_image++;
            }

            selector = $('[data-image-id="' + current_image + '"]');
            updateGallery(selector);
        });

        function updateGallery(selector) {
            var $sel = selector;
            current_image = $sel.data('image-id');
            $('#image-gallery-caption').text($sel.data('caption'));
            $('#image-gallery-title').text($sel.data('title'));
            $('#image-gallery-image').attr('src', $sel.data('image'));
            miapp.disableButtons(counter, $sel.data('image-id'));
        }

        if(setIDs == true){
            $('[data-image-id]').each(function(){
                counter++;
                $(this).attr('data-image-id',counter);
            });
        }
        
        $(setClickAttr).on('click',function(){
            updateGallery($(this));
        });
    },
    
    mostrar: function(){
		var cajadatos = document.getElementById('cajadatos');
		
		var texto ="";
	
		cajadatos.innerHTML = "";
		
		for (var f = 0; f < localStorage.length; f++){
			var clave = localStorage.key(f);
			var valor = localStorage.getItem(clave);
			var datos = JSON.parse(valor);
			
			texto += '<div class="col-lg-3 col-md-4 col-xs-6 thumb"><a class="thumbnail" href="#" data-image-id="" data-toggle="modal" data-title="' +  datos.titulo + '" data-caption="' +  datos.descripcion + '" data-image="' + datos.imagen  + '" data-target="#image-gallery"><img class="img-responsive" src="' + datos.imagen  + '" alt="Short alt text"></a></div>';
	
		}
		
		cajadatos.innerHTML = texto;
		
		miapp.init_masonry();
		
		miapp.loadGallery(true, 'a.thumbnail');
	}
};
//Registramos un detector para el evento onload al objeto Document, para que cuando se haya cargado la página ejecute iniciar()
addEventListener('load', function(){miapp.iniciar();});



