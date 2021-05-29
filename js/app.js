
//Variables - Globales
let template = ``;
let articulosCarrito = [];
const btn = document.querySelectorAll('.comprar-btn');
const productosContainer = document.querySelector('#productos');
const contenedorCarrito = document.querySelector('#carrito-view');
const itemProducto = document.querySelectorAll('#item-producto');
const listaCarrito = document.querySelector('#lista-carrito');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const pagarBtn = document.querySelector('#pagar-btn');


class Productos {
    constructor (id, nombre, precio, imagen) {
        this.id = id
        this.nombre = nombre
        this.precio = precio
        this.imagen = imagen
    }
}


async function baseDeDatos () {
    let datos = await fetch('./productos.json').then(response => response.json()); 
    datos = datos.map(articulo => {
        return Object.assign(new Productos(), articulo);
    })
    imprimirCards(datos);
}

baseDeDatos();



//Imprimir cards en el html
function imprimirCards (BaseDeDatosProductos) {
for (let i = 0; i < BaseDeDatosProductos.length; i++) {
    template += `
    <div class="col-xs-12 col-md-6 col-xl-4 id="item-producto">
        <div class="item" id="item">
            <h2 class="item-title" id="nombre">${BaseDeDatosProductos[i].nombre}</h2> 
            <p class="pesos">$</p><p class="precio" id="precio">${BaseDeDatosProductos[i].precio}</p>
            <img id="img "src="./img/productos/${BaseDeDatosProductos[i].imagen}" alt="" class="item-img">
            <button id="comprar-btn" class="comprar-btn" data-id="${BaseDeDatosProductos[i].id}">AGREGAR<i class="fas fa-shopping-cart"></i></button>
        </div> 
    </div>`;
  } 

document.querySelector('#productos').innerHTML = template;
}



/** -- EVENTOS -- **/
cargarEventListeners(); 

function cargarEventListeners () {
    
    productos.addEventListener('click', agregarProducto);

    
    listaCarrito.addEventListener('click', eliminarProducto);

    
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito);


    pagarBtn.addEventListener ('click', generarLinkDePago);
    

    //Muestra los productos de LocalStorage
    document.addEventListener('DOMContentLoaded', ()=>{
        articulosCarrito = JSON.parse(localStorage.getItem('prdCarrito')) || [];
        carritoHTML();
    }); 
}



/** -- FUNCIONES -- **/

//Agregar productos
function agregarProducto (e) {
    if(e.target.classList.contains('comprar-btn')) {
        const productoSeleccionado = e.target.parentElement.parentElement
        leerDatosProductos(productoSeleccionado);
    } 
}


//Eliminar un producto del carrito 
function eliminarProducto (e) {
    if(e.target.classList.contains('borrarItemBtn')){
        const productoId = e.target.getAttribute('data-id')

        articulosCarrito = articulosCarrito.filter(producto => producto.id !== productoId);
        
        carritoHTML(); 
        
    }
}


//Vaciar Carrito
function vaciarCarrito () {
    articulosCarrito = []; 
    limpiarHTML(); 
    total(); 
    carritoHTML();
}


//Leer datos del HTML de cada producto
function leerDatosProductos (producto) {
    
    const item = {
        id: producto.querySelector('#comprar-btn').getAttribute('data-id'),
        nombre: producto.querySelector('#nombre').textContent,
        precio: producto.querySelector('#precio').textContent,
        totalPrecio: parseInt(producto.querySelector('#precio').textContent),
        imagen: producto.querySelector('img').src,
        cantidad: 1
    }

    //Revisar si un elemento ya existe en el carrito y actualizar cantidad y subtotal
    const existe = articulosCarrito.some (producto => producto.id === item.id);
    if (existe) {
        const productos = articulosCarrito.map(producto  => {
            if(producto.id === item.id){
                producto.cantidad++;
                producto.totalPrecio = item.totalPrecio += producto.totalPrecio; 
                return producto; 
            } else {
                return producto; 
            }
        });
        articulosCarrito = [...productos]
    } else {
        articulosCarrito = [...articulosCarrito, item];
    }

    carritoHTML();
}


// Imprimir carrito en el HTML
function carritoHTML (){

    limpiarHTML ();

    articulosCarrito.forEach( item => {
        const row = document.createElement('tr');
        row.classList.add('itemPrd')
        row.innerHTML = `
        <td class="col-xs-2"><img src="${item.imagen}" class="img-carrito" height="100px" alt=""></td>
        <td class="col-xs-2">${item.nombre}</td>
        <td class="col-xs-2 itemPrecio">$${item.precio}</td>
        <td class="col-xs-2 itemCantidad">${item.cantidad}</td>
        <td class="col-xs-2">$${item.totalPrecio}</td>
        <td class="col-xs-2"><button class="borrar-item"><i data-id= "${item.id}" class=" borrarItemBtn fas fa-trash-alt"></i></button></td>
    
    `;
        contenedorCarrito.appendChild(row);
    }) 

    sincronizarStorage();
    carroNumero ();
    total();
}


//Sincronizar con Storage
function sincronizarStorage () {
    localStorage.setItem('prdCarrito', JSON.stringify(articulosCarrito))
}


//Elimina los productos del tbody 
function limpiarHTML () {
    contenedorCarrito.innerHTML = '';
}


//Precio total
function total () {
    let total = 0;
    const carroTotal = document.querySelector('.precioView h2');
    const itemPrd = document.querySelectorAll('.itemPrd');
    itemPrd.forEach(prdItem => {
        const itemPrecio = prdItem.querySelector('.itemPrecio');
        const itemPrecioText = Number(itemPrecio.textContent.replace('$', ''));
        const itemCantidad = prdItem.querySelector('.itemCantidad');
        const itemCantidadValor = Number(itemCantidad.textContent);
        
        total = total + itemPrecioText * itemCantidadValor
    });

    carroTotal.innerHTML = total
}


//Cambiar número ícono carrito 
function carroNumero (){
    let carroNumeros = 0;
    let carritoItem = JSON.parse(localStorage.getItem('prdCarrito'));
    carritoItem.forEach(item => {
        carroNumeros = item.cantidad += carroNumeros;
    });
    document.querySelector('.carrito-icono span').textContent = carroNumeros;
}

carroNumero ();



//Pagar MercadoPago
async function generarLinkDePago() {
    const productsToMP = articulosCarrito.map((element) => {
      let nuevoElemento = {
        title: element.nombre,
        description: "",
        picture_url: element.imagen,
        category_id: element.id,
        quantity: Number(element.cantidad),
        currency_id: "ARS",
        unit_price: Number(element.precio),
      };
      return nuevoElemento;
    });
    console.log(productsToMP);
    const response = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          Authorization:
            "Bearer TEST-2830313071600296-052016-9f9bb53ca8d4eb34dffb5d33c081b4c5-168830195",
        },
        body: JSON.stringify({
          items: productsToMP,
        }),
      }
    );
    const data = await response.json();
    window.open(data.init_point, "_blank");
  }







