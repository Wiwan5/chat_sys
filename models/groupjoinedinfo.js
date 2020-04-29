var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const GroupJoinedInfoSchema = new Schema({
    username:  String,
    groupname:  String,
});
module.exports = GroupJoinedInfo = mongoose.model('GroupJoinedInfo', GroupJoinedInfoSchema);