const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

function handleImage(req,res){
    let name = req.query.name;
    if(!name){
        res.status(400).json({"msg": "invalid image name"});
    }
    const imagePath = path.join(__dirname, '../Images', name);
    fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({'msg':'Image not found'});
        }
        res.status(200).sendFile(imagePath);
    });
}
module.exports = {handleImage};