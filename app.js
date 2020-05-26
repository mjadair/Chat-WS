const express = require('express')
const app = express()
const socketio = require('socket.io')

let namespaces = require('./data/namespaces')
// console.log(typeof namespaces[0].rooms[0])



app.use(express.static(__dirname + '/public'))
const expressServer = app.listen(9000)
const io = socketio(expressServer)



io.on('connection', (socket) => {
  socket.emit('messageFromServer', { data: 'This is the socketio server' })
  socket.on('messageToServer', (dataFromClient) => {
    console.log(dataFromClient)
  })

  socket.on('newMessageToServer', (msg) => {
    io.of('/').emit('messageToClients', { text: msg.text })
  })




})


// loop through each namespace and listen for a connection
namespaces.forEach((namespace) => {

  console.log(namespace)


})