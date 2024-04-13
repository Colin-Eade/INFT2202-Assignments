"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const passport_local_mongoose_1 = __importDefault(require("passport-local-mongoose"));
const UserSchema = new Schema({
    displayName: { type: String, required: true },
    emailAddress: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    birthday: { type: Date, required: true },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
}, {
    collection: "users"
});
UserSchema.plugin(passport_local_mongoose_1.default);
const Model = mongoose_1.default.model("User", UserSchema);
exports.default = Model;
//# sourceMappingURL=user.js.map