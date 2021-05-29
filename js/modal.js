
$(document).ready(function () {

    $('.btn-carrito').on('click', function (){
        $('.modal-container').addClass('modal-visible');
        $('body').addClass('hidden');
    });

    $('.btn-cerrar').on('click', function (){
        $('.modal-container').removeClass('modal-visible');
        $('body').removeClass('hidden');
    });

});


