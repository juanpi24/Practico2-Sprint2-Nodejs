//Conexión a la base de datos MongoDB
const mongoose= require('mongoose');
mongoose.connect('mongodb+srv://grupo-12:grupo-12@cluster0.blryo.mongodb.net/NodeMod3Cohorte5')
.then(()=> console.log('Conexión exitosa a MongoDB'))
.catch(error=>console.error('Error al conectar a MongoDB:', error));

//Crea Esquema y modelo de la BD Superhéroes
const superheroSchema= new mongoose.Schema({
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

//Insertar un Documento
async function insertSuperHero() {
      const hero= new SuperHero({
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
      await hero.save();
      console.log('Superhéroe Insertado:', hero);
  }
insertSuperHero();