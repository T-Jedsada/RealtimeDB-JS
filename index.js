const translate = require('translate-api');
const firebase = require("firebase");
const hapi = require('hapi');
const boom = require('boom')

var config = {
    apiKey: "AIzaSyBbILHVxVIcPg_B3pA-dLxo9GFVN2catj8",
    authDomain: "example-everything.firebaseapp.com",
    databaseURL: "https://example-everything.firebaseio.com",
    storageBucket: "gs://example-everything.appspot.com",
};

firebase.initializeApp(config);

var defaultDatabase = firebase.database();
var dbRef = defaultDatabase.ref('/chat')

const server = new hapi.Server();

server.connection({
    port: process.env.PORT || 3000
});

server.route({
    method: 'POST',
    path: '/api',
    handler: function (request, reply) {
        translate.getText(request.payload.word, {
            to: 'th'
        }).then(function (text) {
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