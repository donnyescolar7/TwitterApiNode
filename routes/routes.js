const express = require('express');
const tweet = require('../models/tweet');
const usuario = require('../models/usuario');
const vinculo = require('../models/vinculo');

const router = express.Router()

//Post Method
router.post('/usuario/post', async (req, res) => {

    //Formato Fecha "YYYY-mm-dd"

    const data = new usuario({
        usuario_id: req.body.usuario_id,
        nombre: req.body.nombre,
        fecha_nacimiento: new Date(req.body.fecha_nacimiento),
        descripcion: req.body.descripcion,
    })

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

//Get all Method
router.get('/usuario/getAll', async (req, res) => {
    try{
        const data = await usuario.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get by ID Method
router.get('/getOne/:id', (req, res) => {
    res.send('Get by ID API')
})

//Update by ID Method
router.put('/usuario/update/:usuario_id', async(req, res) => {
    
    try {
        const result = await usuario.findOneAndUpdate(
            {
                "usuario_id": req.params.usuario_id
            },
            req.body
        )
        res.send(result)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Delete by ID Method
router.delete('/usuario/delete/:usuario_id', async (req, res) => {
    try {
        const usuario_id = req.params.usuario_id;
        await usuario.findOneAndDelete({"usuario_id": usuario_id})
        await vinculo.deleteMany({ $or: [ { seguido_id: usuario_id }, { seguidor_id: usuario_id } ] } )
        res.send(`${usuario_id} ha sido eliminado`)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})


/***************************TWEETS************************/

router.post('/tweet/post', async (req, res) => {
    
    const data = new tweet({
        usuario_id: req.body.usuario_id,
        texto: req.body.texto,
        fecha: new Date(),
    })

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

//Get all Method
router.get('/tweet/getAll', async (req, res) => {
    try{
        const data = await tweet.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get by user_id
router.get('/tweet/getAll/:user_id', async (req, res) => {
    try{
        const data = await tweet.find(
            {"usuario_id" : req.params.user_id}
        );
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Update by ID Method
router.put('/tweet/update/:id', async(req, res) => {
    
    try {
        const result = await tweet.findOneAndUpdate(
            {
                "_id": req.params.id
            },
            {
                "texto" : req.body.texto
            }
        )
        res.send(result)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//DELETE TWEEEETT
//Delete by ID Method
router.delete('/tweet/delete/:id', async (req, res) => {
    try {
        await usuario.findByIdAndDelete(req.params.id)
        res.send(`${id} ha sido eliminado`)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

/***************************VINCULO************************/

router.post('/vinculo/post', async (req, res) => {
    const data = new vinculo({
        seguidor_id: req.body.seguidor_id,
        seguido_id: req.body.seguido_id,
        fecha: new Date(),
    })

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

//Get all Method
router.get('/vinculo/getAll', async (req, res) => {
    try{
        const data = await vinculo.find();
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get seguidos de un usuario
router.get('/vinculo/seguidos/:usuario_id', async (req, res) => {
    try{
        const data = await vinculo.find(
            {
                "seguidor_id":req.params.usuario_id
            }
        );
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get seguidores de un usuario
router.get('/vinculo/seguidores/:usuario_id', async (req, res) => {
    try{
        const data = await vinculo.find(
            {
                "seguido_id":req.params.usuario_id
            }
        );
        res.json(data)
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

//Delete by ID of both users
router.delete('/vinculo/delete/', async (req, res) => {
    try {
        await usuario.findOneAndDelete({
            seguidor_id : req.body.seguidor_id,
            seguido_id: req.body.seguido_id,
        })
        res.send(`${req.body.seguidor_id} ha dejado de seguir a ${req.body.seguido_id}`)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

//Get all Method
router.get('/timeline/:usuario_id', async (req, res) => {
    try{
        let seguidos = await vinculo.find({seguidor_id: req.params.usuario_id});
        seguidos = seguidos.map(o => o.seguido_id)
        const timeline = await tweet.find({usuario_id: {$in: seguidos}}).sort({fecha: -1});
        res.json(timeline)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

module.exports = router;