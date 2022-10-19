const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    seguido_id:{
        require:true,
        type: String
    },
    seguidor_id: {
        required: true,
        type: String
    },
    fecha: {
        required: true,
        type: Date
    },
})

dataSchema.index({"seguido_id": 1, "seguidor_id" : 1}, { unique: true })

module.exports = mongoose.model('Vinculo', dataSchema)

