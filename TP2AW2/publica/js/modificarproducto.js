const url = new URL(location.href);
const idProducto = url.searchParams.get('id');
const contenido = document.getElementById('contenido')
const botonEliminar = document.getElementById('eliminar-producto')
const traerProducto = async(idProducto)=>{
    try{
        const pedirJson = await fetch(`http://localhost:3000/productos/${idProducto}`)
        const producto = await pedirJson.json();
        cargarFormulario(producto)

    }catch(error){
        console.error(error);
    }
    
}
function cargarFormulario(producto){
    let html = '';
    html = `
        <form id="productForm" action="http://localhost:3000/productos/${idProducto}">
        <div class="form-group">
            <label for="id">ID:</label><br>
            <input type="text" id="id" name="id" class="form-control" value="${producto.id}">
        </div>

        <div class="form-group">
            <label for="nombre">Nombre:</label><br>
            <input type="text" id="nombre" name="nombre" class="form-control" value="${producto.nombre}">
        </div>

        <div class="form-group">
            <label for="categoria">Categoria:</label><br>
            <input type="text" id="categoria" name="categoria" class="form-control" value="${producto.categoria}">
         </div>

        <div class="form-group">
            <label for="marca">Marca:</label><br>
            <input type="text" id="marca" name="marca" class="form-control" value="${producto.marca}">
        </div>

        <div class="form-group">
            <label for="stock">Stock:</label><br>
            <input type="number" id="stock" name="stock" class="form-control" value="${producto.stock}">
        </div>

        <p>Seleccione una categoría para su producto y complete los detalles requeridos.</p>

        <div class="button-group">
            <button type="submit" class="btn btn-warning">Modificar Producto</button>
        </div>
    </form>
    `
    contenido.innerHTML= html;
    const formulario = document.getElementById('productForm')
    
    formulario.addEventListener('submit',async (e) =>{
        e.preventDefault()
        const datosFormulario = new FormData(formulario)
        const datosDelForm = Object.fromEntries(datosFormulario)
        const datos = JSON.stringify(datosDelForm)
        const peticion = await fetch(`http://localhost:3000/productos/${idProducto}`,
         {method: 'PUT',
          headers:{
            'Content-Type': 'application/json;charset=utf-8'
        }, body:datos})
    })
}

botonEliminar.addEventListener('click', (e)=>{
    e.preventDefault()
    eliminarProducto();
})

async function eliminarProducto(){
    const producto = fetch(`http://localhost:3000/productos/${idProducto}`, {
        method:'DELETE'
       
    })
    window.location.href='./'
}


traerProducto(idProducto)