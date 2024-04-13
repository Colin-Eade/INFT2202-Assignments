let LOCAL = false;
let HostName, URI;

if (LOCAL) {
    URI = "mongodb://localhost/contacts";
    HostName = "localhost"
} else {
    URI = "mongodb+srv://colineade:c3zsKqW6JzX00Mmm@cluster0.tq7rl0u.mongodb.net/contacts?retryWrites=true&w=majority&appName=Cluster0"
    HostName = "MongoDB Atlas"
}

export { URI, HostName }
export const SessionSecret = "INFT2202SessionSecret";
