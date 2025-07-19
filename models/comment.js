const {Schema, model} = require("mongoose");
const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    commentedBy:{
        type:Schema.Types.ObjectId,
        ref:'user',
    },
    postedOn:{
        type: Schema.Types.ObjectId,
        ref:'blog',
    },

},{timestamps: true});

const Comment = model("comment", commentSchema);
module.exports = Comment;