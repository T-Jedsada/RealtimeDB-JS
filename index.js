const translate = require('translate-api');
const firebase = require("firebase");
const hapi = require('hapi');
const boom = require('boom')

const config = {
    apiKey: "AIzaSyBbILHVxVIcPg_B3pA-dLxo9GFVN2catj8",
    authDomain: "example-everything.firebaseapp.com",
    databaseURL: "https://example-everything.firebaseio.com",
    storageBucket: "gs://example-everything.appspot.com",
};





firebase.initializeApp(config);

const defaultDatabase = firebase.database();
const dbRef = defaultDatabase.ref('/chat')

const server = new hapi.Server();

server.connection({
    port: process.env.PORT || 3000
});

const io = require("socket.io")(server.listener)

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('send', function (data) {
        console.log(data)
        translateWord(data).then(function (text) {
            console.log(text)
            var obj = {
                someAttribute: true,
                name: text.text
            };
            dbRef.push(obj);
        }).catch(function (err) {

        });
    });
});

server.route({
    method: 'POST',
    path: '/api',
    handler: function (request, reply) {
        translateWord(request.payload.word).then(function (text) {
            console.log(text)
            var obj = {
                someAttribute: true,
                name: text.text
            };
            dbRef.push(obj);
            reply({
                message: "successfully"
            })
        }).catch(function (err) {
            reply(boom.notFound('error'))
        });
    }
});

server.start((err) => {
    if (err) throw err;
    console.log(`Server running at: ${server.info.uri}`);
});

function translateWord(word) {
    return translate.getText(word, {
        to: 'th'
    })
}