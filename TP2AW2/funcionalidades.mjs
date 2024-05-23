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
            const rutaProductos = join(url, 'v1', 'productos.json')
            const nuevoproducto = JSON.parse(datodelCuerpo)
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
    const nuevosProductos = productosJSON.productos.filter((producto)=>{
        return Number(producto.id) !== Number(id)
    })
    try{
        const rutaProductos = join(url, 'v1', 'productos.json')
        const productoArray = JSON.stringify(nuevosProductos)
        const respuestaJSON = {
            "productos": productoArray
        }
        
        console.log(JSON.stringify(respuestaJSON))
        await writeFile(rutaProductos, JSON.stringify(respuestaJSON));
        respuesta.statusCode=201
        respuesta.setHeader('Content-Type', 'text/plain')
        respuesta.end("se elimino correctamente");

    }catch(error){
        console.error(error);
        respuesta.statusCode=500
        respuesta.setHeader('Content-Type', 'text/plain')
        respuesta.end("Error en el servidor");
    }
}

export {leerJson, GestionarID, agregarDatos, borrarDatos};