//const mongoose = require('mongoose');
const animaldb = require('../models/animals');

async function handleGetAdopt(req, res){
    const id = req.params.id;
    let data = await animaldb.find({
        img:id,
    });
    if(data.length != 0){
        if(data["_id"]){
            data["_id"] = null;
            delete data["_id"];
        }
        return res.status(302).json({data});
    }
    else{
        return res.status(400).json({'error':'wrong image name'});
    }
}

module.exports = {handleGetAdopt};