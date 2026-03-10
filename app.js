//Conexión a la base de datos MongoDB
const mongoose= require('mongoose');
mongoose.connect('mongodb+srv://grupo-12:grupo-12@cluster0.blryo.mongodb.net/NodeMod3Cohorte5')
.then(()=> console.log('Conexión exitosa a MongoDB'))
.catch(error=>console.error('Error al conectar a MongoDB:', error));

