const express = require('express')
const app = express()
const socketio = require('socket.io')

let namespaces = require('./data/namespaces')
console.log(namespaces[0])



app.use(express.static(__dirname + '/public'))
const expressServer = app.listen(9000)
const io = socketio(expressServer)



io.on('connection', (socket) => {
  let nsData = namespaces.map((ns) => {
    return {
      img: ns.img,
      endpoint: ns.endpoint
    }
  })
  socket.emit('nsList', nsData)
})


// loop through each namespace and listen for a connection
namespaces.forEach((namespace) => {
  io.of(namespace.endpoint).on('connection', (nsSocket) => {
    console.log(nsSocket.handshake)
    const username = nsSocket.handshake.query.username
    nsSocket.emit('nsRoomLoad', namespace.rooms)
    nsSocket.on('joinRoom', (roomToJoin, numberOfUsersCallback) => {
      console.log(nsSocket.rooms)
      const roomToLeave = Object.keys(nsSocket.rooms)[1]
      nsSocket.leave(roomToLeave)
      updateUsersInRoom(namespace, roomToLeave)
      nsSocket.join(roomToJoin)
      const nsRoom = namespace.rooms.find((room) => {
        return room.roomTitle === roomToJoin
      })
      nsSocket.emit('historyCatchUp', nsRoom.history)
      updateUsersInRoom(namespace, roomToJoin)
    })
    nsSocket.on('newMessageToServer', (msg) => {
      const fullMsg = {
        text: msg.text,
        time: Date.now(),
        username: username,
        avatar: 'https://via.placeholder.com/30'
      }

      const roomTitle = Object.keys(nsSocket.rooms)[1]
    
      const nsRoom = namespace.rooms.find((room) => {
        return room.roomTitle === roomTitle
      })

      nsRoom.addMessage(fullMsg)
      io.of(namespace.endpoint).to(roomTitle).emit('messageToClients', fullMsg)
    })
  })
})

function updateUsersInRoom(namespace, roomToJoin) {
  // Send back the number of users in this room to ALL sockets connected to this room
  io.of(namespace.endpoint).in(roomToJoin).clients((error, clients) => {
    // console.log(`There are ${clients.length} in this room`)
    io.of(namespace.endpoint).in(roomToJoin).emit('updateMembers', clients.length)
  })
}