

const formulario = document.getElementById('contenido')



const productosJson = async()=>{
    const datos = await fetch('http://localhost:3000/productos');
    const productos = await datos.json();
    let html = '';
    productos.productos.forEach((producto)=>{
        html+= `
            <article>
                <h2>${producto.nombre}</h2>
                <br>
                <a href="modificarProducto.html?id=${producto.id}">Administrar</a>
                <br>
                <p>${producto.marca}</p>
                <br>
                <p>${producto.categoria}</p>
                <br>
                <p>${producto.stock}</p>
            </article>
        `
        console.log(producto)
    })
    formulario.innerHTML = html;
    
   
}
productosJson()

