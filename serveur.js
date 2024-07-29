const Path = require("path")
var express = require('express')
var cors = require('cors')
var bodyParser = require('body-parser')

var server = require('ws').Server



var app = express()

//Acceptation des appels externes
app.use(cors())
app.use(bodyParser.json())


//Points d'entrer
app.use('/api/session', require('./routes/session'))
app.use('/api/demande', require('./routes/demande'))
app.use('/api/posteDeTravail', require('./routes/posteDeTravail'))
app.use('/api/example', require('./routes/example'))



//Apple FrontEnd
app.use(express.static(Path.join(__dirname, 'app/build')))
app.get('*', (req, res) => {
    res.sendFile(Path.resolve(__dirname, 'app', 'build', 'index.html'))
})



//Lancement du serveur
app.listen(5000, () => {
    console.log('Le Serveur a été lancé sur le port 5000')
})


//webSocket 
const wss = new server({ port: 8080 })

wss.on('connection', (client) => {
    console.log('A Client is connected !')
    client.on('message', (msg) => {
        console.log(`Message:${msg}`);
        broadcast(msg)
    })
})
function broadcast(msg) {
    for (const client of wss.clients) {
        console.log(client.readyState)
        if (client.readyState) {
            client.send(msg)

        }

    }
}