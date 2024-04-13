import mongoose  from "mongoose";
const Schema = mongoose.Schema;

const ChatMessageSchema = new Schema({
    username: { type: String, required: true },
    content: { type: String, required: true },
    likes: { type: Number, default: 0 },
    creationDate: { type: Date, default: Date.now },
    editDate: { type: Date }
}, {
    collection: "chatMessages"
});

const Model = mongoose.model("ChatMessage", ChatMessageSchema);
export default Model;