import {parse, join} from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';




let productosJSON;
const url = 'api';


const jsonParseado = async()=>{
    try{
        const rutaProductos = join(url, 'v1', 'productos.json')
        const datosJSON = await readFile(rutaProductos, 'utf-8')
        productosJSON = JSON.parse(datosJSON)
    }catch(error){
        console.log("No se encuentra el json")
    }
}



jsonParseado();

const leerJson = async(respuesta)=>{
    
    try{
        
        
        respuesta.statuscode = 200
        respuesta.setHeader('Access-Control-Allow-Origin', '*')
        respuesta.setHeader('Content-Type', 'application/json')
        respuesta.end(JSON.stringify(productosJSON))
        
    }catch(error){
        respuesta.statuscode=404;
        respuesta.setHeader('Content-Type', 'text/plain')
        respuesta.end("No se encontro el recurso")
        console.error(error)
    }
}

const GestionarID = (peticion, respuesta)=>{
    const idProducto = parse(peticion.url).base
    
    const producto =productosJSON.productos.find((producto)=>{
        return Number(producto.id) === Number(idProducto)
    })

    if(producto){

        const traerproducto = JSON.stringify(producto)
        respuesta.statuscode=200
        respuesta.setHeader('Access-Control-Allow-Origin', '*')
        respuesta.setHeader('Content-Type', 'text/plain')
        respuesta.end(traerproducto)

    }else{
        respuesta.statuscode=404;
        respuesta.setHeader('Content-Type', 'text/plain')
        respuesta.end("no existe el producto en el json")
    }
}
 

const agregarDatos = (peticion, respuesta)=>{
    let datodelCuerpo = '';
    peticion.on('data', (data)=>{
        datodelCuerpo+= data
    })
    peticion.on('error', (error)=>{
        console.error(error)
        respuesta.statuscode = 404;
        respuesta.setHeader('Content-Type', 'text/plain')
        respuesta.end("no se pueden agregar datos")
    })
    peticion.on('end', async(data)=>{
        try{
            const ultimoProducto = productosJSON.productos[productosJSON.productos.length - 1]
            
            const ultimoid = ultimoProducto.id + 1;
            const rutaProductos = join(url, 'v1', 'productos.json')
            const datosnuevoproducto = JSON.parse(datodelCuerpo)
            const nuevoproducto = {
                id: ultimoid,
                nombre: datosnuevoproducto.nombre,
                marca: datosnuevoproducto.marca,
                categoria: datosnuevoproducto.categoria,
                stock: datosnuevoproducto.stock
            }
            productosJSON.productos.push(nuevoproducto)
            await writeFile(rutaProductos, JSON.stringify(productosJSON))
            respuesta.statuscode=201;
            respuesta.setHeader('Content-Type', 'text/plain')
            respuesta.end("Se agregaron los datos")
        }catch(error){
            console.error(error);
            respuesta.statuscode=500;
            respuesta.setHeader('Content-Type', 'text/plain')
            respuesta.end("no se pudieron agregar datos")
        }
    })
}
const borrarDatos = async(peticion, respuesta)=>{
    const id = parse(peticion.url).base;
    const rutaProductos = join(url, 'v1', 'productos.json')
    
    if(productosJSON.productos.find(producto => Number(producto.id) === Number(id))){
        productosJSON.productos = productosJSON.productos.filter((producto)=>{
        return Number(producto.id) !== Number(id)
    })
    try{
        const respuestaJSON = {
            "productos": productosJSON
        };
        await writeFile(rutaProductos, JSON.stringify(productosJSON));
        respuesta.statusCode=201
        respuesta.setHeader('Access-Control-Allow-Origin', '*')
        respuesta.setHeader('Content-Type', 'text/plain')
        respuesta.end("se elimino correctamente");
        
    }catch(error){

        console.error(error);
        respuesta.statusCode=500
        respuesta.setHeader('Content-Type', 'text/plain')
        respuesta.end("Error en el servidor");
    }
    }else{
        respuesta.statusCode=404
        respuesta.setHeader('Content-Type', 'text/plain')
        respuesta.end("No se puede eliminar el producto");
    }
     
}
const cambiardatos = (peticion, respuesta)=>{
   
    const id = parse(peticion.url).base;
    
    const rutaProductos = join(url, 'v1', 'productos.json')
    
    const producto = productosJSON.productos.find((producto)=>{
        return Number(id) === Number(producto.id)
    })
    

    if(producto){
        let datosDelCuerpo = '';
    peticion.on('data', (data)=>{
        datosDelCuerpo+= data
    })
    peticion.on('error', (error)=>{
        console.error(error)
        respuesta.statuscode = 404;
        respuesta.setHeader('Content-Type', 'text/plain')
        respuesta.end("no se cambiar los productos")
    })
    peticion.on('end', async(data)=>{
        try{
            const rutaProductos = join(url, 'v1', 'productos.json')
            
            const nuevoproducto = JSON.parse(datosDelCuerpo)
           
            const productosnuevos = productosJSON.productos.map((item)=>{
                console.log(item)
                if(Number(item.id) === Number(id)){
                      return{
                        id: Number(id),
                        nombre: nuevoproducto.nombre,
                        marca: nuevoproducto.marca,
                        categoria: nuevoproducto.categoria,
                        stock: nuevoproducto.stock
                      }
                }else{
                    return item ;
                }
            })
            
            productosJSON.productos = productosnuevos
            await writeFile(rutaProductos, JSON.stringify(productosJSON))
            respuesta.statuscode=201;
            respuesta.setHeader('Content-Type', 'text/plain')
            respuesta.setHeader('Access-Control-Allow-Origin', '*')
            respuesta.end("Se cambio el producto")
        }catch(error){
            console.error(error);
            respuesta.statuscode=500;
            respuesta.setHeader('Content-Type', 'text/plain')
            respuesta.end("no se pudo cambiar el producto")
        }
    })
    }
    
}

    
const gestionOpciones = (respuesta)=>{
    try{
        respuesta.statusCode = 204;
        respuesta.setHeader('Access-Control-Allow-Origin', '*')
        respuesta.setHeader('Access-Control-Allow-Headers', 'Content-Type')
        respuesta.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        respuesta.end()
    }catch(error){
        respuesta.statuscode=403;
        respuesta.setHeader('Content-Type', 'text/plain')
        respuesta.end("Error en el servidor")
    }
    
}


export {leerJson, GestionarID, agregarDatos, borrarDatos, cambiardatos, gestionOpciones};