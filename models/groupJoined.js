var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const GroupJoinedSchema = new Schema({
    username:  String,
    groupname:  String,
});
module.exports = GroupJoined = mongoose.model('GroupJoined', GroupJoinedSchema);