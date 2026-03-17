import express from 'express';
import mongoose from 'mongoose';

//===================
//Conexión a MongoDB
//===================
async function connectDB(){
    try {
        await mongoose.connect("***");
        console.log("Conexión exítosa a MongoDB");
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
    }
}

//=================
//Modelo (Schema)
//=================
const superheroSchema= new mongoose.Schema({
    //id: { type: mongoose.SchemaTypes.ObjectId, required: true, index: true },
    nombreSuperHeroe:{type:String, required:true},
    nombreReal:{type:String, required:true},
    edad:{type:Number, min:0},
    planetaOrigen:{type:String, default:'Desconocido'},
    debilidad: String,
    poderes: [String],
    aliados: [String],
    enemigos: [String],
    createdAt: {type: Date, default: Date.now},
    creador: String,
},{collection: 'Grupo-12'});

const SuperHero= mongoose.model('SuperHero', superheroSchema);


//============================
//Funciones de acceso a datos
//============================

//Obtener todos
async function obtenerTodos() {
    return await SuperHero.find();
}

//Buscar por Planeta
async function buscarPorPlaneta(planetaOrigen) {
    return await SuperHero.find({planetaOrigen});
}
//Busar por Nombre
async function obtenerPorNombre(nombreSuperHeroe) {
    return await SuperHero.findOne({nombreSuperHeroe});
}

//Eliminar un Documento
async function eliminarSuperheroes(nombreSuperHeroe) {
    return await SuperHero.deleteOne({nombreSuperHeroe}); 
}

//Actualizar un Documento
 async function actualizarSuperheroes(nombreSuperHeroe) {
    return await SuperHero.updateOne(
        {nombreSuperHeroe},  
        {$set:{edad:30, planetaOrigen:"Luna"}}  //Actualiza los campos edad y planeta de origen
    );
 }

//Insertar un documento
async function insertarSuperheroes() {
     return await SuperHero.insertOne({
          nombreSuperHeroe:'Spiderman',
          nombreReal:'Peter Parker',
          edad:25,
          planetaOrigen:'Tierra',
          debilidad: 'Radioactiva',
          poderes: ['Trepar paredes', 'Sentido arácnido', 'Super feurza', 'Agilidad'],
          aliados: ['Iroman'],
          enemigos: ['Duende Verde'],
          creador: 'Juan Pablo Millicay'
      });
      //await hero.save();
  }


 

//NOTA: error con rutas porque tenian doble comillas, cambie a comilla simple y mismo nombre parametros en params definido en las rutas funciona correctamente las consultas
//===================
//App y Servidor
//===================
const app= express();
const PORT= 3000;
app.use(express.json());

//Ruta GET principal
app.get('/', (req, res)=>res.send('¡¡Curso de Nodejs 2026!!'));

//Ruta GET para buscar - http://localhost:3000/api/heroes - Obtener todos los superheroes
app.get('/api/heroes', async (req, res)=>{
    const heroes= await obtenerTodos();
    res.json(heroes);
});


// Ejemplo: GET http://localhost:3000/search?q=tutorial
// app.get('/search', (req, res) => {
//   const query = req.query.q;
//   res.send(`Resultados de búsqueda para: ${query}`);
// });

//Ruta GET para buscar - http://localhost:3000/api/heroes/buscar/Tierra - Buscar por planeta
app.get('/api/heroes/buscar/:planeta', async (req, res)=>{
    console.log("Parametro:", req.params.planeta);
    const heroes= await buscarPorPlaneta(req.params.planeta /*|| "Tierra"*/);
    console.log("Resultado:", heroes);

    if(heroes.length===0) {
        return res.status(404).json({mensaje: "Planeta del Superhéroe no encontrado"});
       }
    res.json(heroes);
});

//Ruta GET para buscar - http://localhost:3000/api/heroes/Hulk - Obtener un superhéroe por nombre
app.get('/api/heroes/:nombre', async (req, res)=>{
    console.log("Parametro:", req.params.nombre);
    const hero= await obtenerPorNombre(req.params.nombre);
    console.log("Resultado:", hero);
    if(!hero) {
        return res.status(404).json({mensaje: "Nombre del Superhéroe no encontrado"});
       }
    res.json(hero);
});

//Ruta DELETE para eliminar - http://localhost:3000/api/heroes/eliminar/Hulk - Eliminar un superhéroes por nombre
app.delete('/api/heroes/eliminar/:nombre', async (req, res)=>{
    console.log("Parametro:", req.params.nombre);
    const hero= await eliminarSuperheroes(req.params.nombre);
    console.log("Resultado:",hero);
    //deletedCount es una propiedad en MongoDB que indica la cantidad de documentos eliminados (0, 1 o más) tras una operación de borrado (deleteOne o deleteMany)
    if(hero.deletedCount===0) {
        return res.status(404).json({mensaje: "Superhéroe no encontrado"});
        }
        res.json({mensaje:"Superhéroe eliminado", resultado: hero});
    });

//Ruta PUT para actualizar - http://localhost:3000/api/heroes/actualizar/Hulk- Obtener un superhéroe por nombre
app.put('/api/heroes/actualizar/:nombre', async (req, res)=>{
    console.log("Parametro:", req.params.nombre);
    const hero= await actualizarSuperheroes(req.params.nombre);
    console.log("Resultado:",hero);

    //matchedCount es un campo en la respuesta de las operaciones de actualización (update, updateOne, updateMany) en MongoDB que indica el número de documentos que cumplen con el criterio de filtro (query) especificado.
    if(hero.matchedCount===0) {
        return res.status(404).json({mensaje: "Nombre del Superhéroe no encontrado"});
       }
    res.json({mensaje:'Superhéroe Actualizado:', resultado: hero});
   
});    

//Ruta POST para insertar -  http://localhost:3000/api/heroes/insertar - Insertar superheroe
app.post('/api/heroes/insertar', async (req, res)=>{
    const hero= await insertarSuperheroes();
    console.log("Resultado:", hero);
    res.json({mensaje:'Superhéroe Insertado:', resultado: hero});
});


//===================================================
//Levantar el servidor en el puerto 3000
//===================================================
connectDB().then(()=>{
app.listen(PORT,()=>{
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
});