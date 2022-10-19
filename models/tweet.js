const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    usuario_id:{
        require:true,
        type: String
    },
    texto: {
        required: true,
        type: String
    },
    fecha: {
        required: true,
        type: Date
    },
})

module.exports = mongoose.model('Tweet', dataSchema)