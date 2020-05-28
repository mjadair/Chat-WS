// require the express web serve framework
const express = require('express')

//intialise up an app variable that uses the express server
const app = express()

//require socketio
const socketio = require('socket.io')

//take the namespaces from our data files
let namespaces = require('./data/namespaces')


//set up middleware with app.use and serve static html files from our front-end folder with .static()
app.use(express.static(__dirname + '/frontend'))

//tell our express server to listen on port 9000
const expressServer = app.listen(9000, () => console.log('Express server is listening on Port 9000'))


//initialise socketio with our server 
const io = socketio(expressServer)


//When the websocket connects to the server, map over the namespace data and emit it. This makes it available for our front-end client. 
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


// loop through each namespace and listen to each endpoint for a connection from the client
namespaces.forEach((namespace) => {
  io.of(namespace.endpoint).on('connection', (nsSocket) => {
    // console.log(`${nsSocket.id} has joined ${namespace.endpoint}`)
    
    const username = nsSocket.handshake.query.username
    const profilepic = nsSocket.handshake.query.profilepic
    
    
    nsSocket.emit('nsRoomLoad', namespace.rooms)

    nsSocket.on('joinRoom', (roomToJoin, numberOfUsersCallback) => {
      
      const roomToLeave = Object.keys(nsSocket.rooms)[1]
      nsSocket.leave(roomToLeave)
      updateUsersInRoom(namespace, roomToLeave)
      nsSocket.join(roomToJoin)




      io.of(namespace.endpoint).in(roomToJoin).clients((error, clients) => {
        console.log('clients: ', clients)
        numberOfUsersCallback(clients.length)
      })

      const nameSpaceRoom = namespace.rooms.find((room) => {
        return room.roomTitle === roomToJoin
      })
      nsSocket.emit('historyCatchUp', nameSpaceRoom.history)
      updateUsersInRoom(namespace, roomToJoin)
      
    })

    nsSocket.on('newMessageToServer', (message) => {
      const fullMessage = {
        text: message.text,
        time: (new Date).toLocaleString(),
        username: username,
        avatar: profilepic ? profilepic :  'https://thumbs.dreamstime.com/b/default-placeholder-profile-icon-avatar-gray-woman-90197973.jpg'
      }
      console.log(message)
      console.log(nsSocket.rooms)

      const roomTitle = Object.keys(nsSocket.rooms)[1]

      const nameSpaceRoom = namespace.rooms.find((room) => {
        return room.roomTitle === roomTitle
      })

      console.log('Room object that matches this namespace room:', nameSpaceRoom)
      nameSpaceRoom.addMessage(fullMessage)

      io.of(namespace.endpoint).to(roomTitle).emit('messageToClients', fullMessage)


    })


  })


})


function updateUsersInRoom(namespace, roomToJoin){
  io.of(namespace.endpoint).in(roomToJoin).clients((error, clients) => {
    // console.log(`There are ${clients.length} in this room`)
    io.of(namespace.endpoint).in(roomToJoin).emit('updateMembers', clients.length)
  })
}