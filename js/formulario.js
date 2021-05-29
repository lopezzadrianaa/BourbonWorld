
(function () {
    'use strict'
  
    var forms = document.querySelectorAll('.needs-validation')
    
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          event.preventDefault()
          event.stopPropagation()
          if(form.checkValidity()) {
            popup();
          }
          form.classList.add('was-validated')
        }, false)
      })
  })()

  function popup () {
    const popUp = document.querySelector('.popup-contenedor');
    const body = document.querySelector('body');
    popUp.classList.add('popup-visible');
    body.classList.add('hidden');
  }

