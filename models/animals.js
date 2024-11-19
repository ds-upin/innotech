const mongoose = require('mongoose');

const animalSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true,
    },
    species:{
        type:String,
        required: true,
    },
    age:{
        type: Number,
        required: true,
    },
    img:{
        type: String,
        required: true,
    },
    gender:{
        type:String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    adopted:{
        type:String,
    },
    owner:{
        type: String
    }
},
{
    timestamp:true
});

const animalModel = mongoose.model('animal',animalSchema);

module.exports = animalModel;
