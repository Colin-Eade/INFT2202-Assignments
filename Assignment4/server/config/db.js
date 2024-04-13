"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionSecret = exports.HostName = exports.URI = void 0;
let LOCAL = false;
let HostName, URI;
if (LOCAL) {
    exports.URI = URI = "mongodb://localhost/contacts";
    exports.HostName = HostName = "localhost";
}
else {
    exports.URI = URI = "mongodb+srv://colineade:c3zsKqW6JzX00Mmm@cluster0.tq7rl0u.mongodb.net/contacts?retryWrites=true&w=majority&appName=Cluster0";
    exports.HostName = HostName = "MongoDB Atlas";
}
exports.SessionSecret = "INFT2202SessionSecret";
//# sourceMappingURL=db.js.map