const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    usuario_id:{
        require:true,
        type: String
    },
    tweet_id: {
        required: true,
        type: String
    },
    fecha: {
        required: true,
        type: Date
    },
})

dataSchema.index({"usuario_id": 1, "tweet_id" : 1}, { unique: true })

module.exports = mongoose.model('Like', dataSchema)

