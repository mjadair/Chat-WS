const express = require('express')
const app = express()
const socketio = require('socket.io')

let namespaces = require('./data/namespaces')
// console.log(typeof namespaces[0].rooms[0])



app.use(express.static(__dirname + '/public'))
const expressServer = app.listen(9000)
const io = socketio(expressServer)



io.on('connection', (socket) => {
  let nsData = namespaces.map((namespace) => {
    return {
      img: namespace.img,
      endpoint: namespace.endpoint
    }
  })
  console.log(nsData)

  socket.emit('nsList', nsData)
})


// loop through each namespace and listen for a connection
namespaces.forEach((namespace) => {
  //console.log(namespace)

  io.of(namespace.endpoint).on('connection', (socket) => {
    console.log(`${socket.id} has jointed ${namespace.endpoint}`)
  })


})