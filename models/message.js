var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MessageSchema = new Schema({
    userName:  String,
    groupName:  String,
    timestamp: Date,
    text: String,
});
module.exports = Message = mongoose.model('Message', MessageSchema);