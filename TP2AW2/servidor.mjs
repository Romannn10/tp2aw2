import http, { createServer } from 'node:http';
import path from 'node:path';
import fs from 'node:fs/promises';
import { leerJson, GestionarID, agregarDatos, borrarDatos, cambiardatos, gestionOpciones } from './funcionalidades.mjs';
import { url } from 'node:inspector';

const Puerto = 3000;
 

const servidor = createServer((peticion, respuesta)=>{
    const metodo = peticion.method;
    const ruta = peticion.url;

    if(metodo === 'GET'){
        if (ruta === '/productos'){
            leerJson(respuesta);
        }else if(ruta.match('/productos')){
            GestionarID(peticion, respuesta)
        }


    }else if(metodo === 'POST'){
        if(ruta === '/productos'){
           agregarDatos(peticion, respuesta);

        }else{
            respuesta.statusCode=404;
            respuesta.setHeader('Content-Type', 'text/plain')
            respuesta.end("No se encontro la ruta")
        }

    }else if(metodo === 'DELETE'){
        if(ruta.match('/productos')){
            borrarDatos(peticion, respuesta);
        }else{
            respuesta.statusCode=404;
            respuesta.setHeader('Content-Type', 'text/plain')
            respuesta.end("ruta no encontrada")
        }

    }else if (metodo === 'PUT'){
        if(ruta.match('/productos')){
            cambiardatos(peticion, respuesta);
        }else{
            respuesta.statusCode=404;
            respuesta.setHeader('Content-Type', 'text/plain')
            respuesta.end("ruta no encontrada")
        }
    }else if(metodo === 'OPTIONS'){
        if(ruta.match('/productos')){
            gestionOpciones(respuesta);
        }else{
            respuesta.statusCode=404;
            respuesta.setHeader('Content-Type', 'text/plain')
            respuesta.end("ruta no encontrada")
        }

    }else{
        respuesta.end('Error, elegir otro metodo')
        respuesta.statusCode=404;
        respuesta.setHeader('Content-Type', 'text/plain')
    }


})

servidor.listen(Puerto)
