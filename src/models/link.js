const mongoose = require('mongoose')

const urlSchema = new mongoose.Schema ({
    link:{
        type: String,
        required:true,
    },
    host:{
        type: String,
        required:true
    },
    parsed:{
        type:Boolean,
        default:false
    }

})

const Link = mongoose.model('Link',urlSchema)
module.exports = Link