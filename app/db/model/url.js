const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const urlSchema = new Schema({
    url : {type : String, unique : true, required : true},
    created_at: { type: Date, default: Date.now },
    updated_at : { type: Date, default: null }
});

const urlLogSchema = new Schema({
    url : {type : Schema.Types.ObjectId, req : 'url', required : true},
    created_at: { type: Date, default: Date.now }
});


const Url = mongoose.model('url', urlSchema);
const UrlLog = mongoose.model('urlLog', urlLogSchema);

module.exports = {
    Url,
    UrlLog
}