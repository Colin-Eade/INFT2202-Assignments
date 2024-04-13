import mongoose  from "mongoose";
const Schema = mongoose.Schema;
import passportLocalMongoose from "passport-local-mongoose";

const UserSchema : any = new Schema(
    {
        displayName: { type: String, required: true },
        emailAddress: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        birthday: { type: Date, required: true },
        type: { type: String, default: 'user'},
        created: { type: Date, default: Date.now },
        updated: { type: Date, default: Date.now }
    },
    {
        collection: "users"
    }
);

UserSchema.plugin(passportLocalMongoose);
const Model = mongoose.model("User", UserSchema);

declare global {

    export type UserDocument = mongoose.Document & {
        username: String,
        emailAddress: String,
        displayName: String
    }
}

export default Model;