const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    usuario_id:{
        require:true,
        type: String
    },
    nombre: {
        required: true,
        type: String
    },
    fecha_nacimiento: {
        required: true,
        type: Date
    },
    descripcion: {
        required: false,
        type: String
    }
})

dataSchema.index( { "usuario_id": 1 }, { unique: true } )

module.exports = mongoose.model('Usuario', dataSchema)