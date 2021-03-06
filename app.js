// require the express web serve framework
const express = require('express')

//intialise up an app variable that uses the express server
const app = express()

//require socketio - this is the node module for the server-side. We require a different version for client-side
const socketio = require('socket.io')

//take the namespaces from our data files
let namespaces = require('./data/namespaces')


//set up middleware with app.use and serve static html files from our front-end folder with .static() - this makes the contents of our 'frontent' folder available publically.
app.use(express.static(__dirname + '/frontend'))

//tell our express server to listen on port 9000
const expressServer = app.listen(9000, () => console.log('Express server is listening on Port 9000'))


//initialise socketio with our server. io becomes the server object.
const io = socketio(expressServer)


//When the websocket connects to the server, map over the namespace data and emit it. This makes it available for our front-end client. 'Connection is a defined event by the socketio API'
io.on('connection', (socket) => {
  let nsData = namespaces.map((namespace) => {
    return {
      img: namespace.img,
      endpoint: namespace.endpoint
    }
  })
  socket.emit('nsList', nsData)
})


// loop through each namespace and listen to each endpoint for a connection from the client
namespaces.forEach((namespace) => {
  //take the particular namespace and add a listener for connection
  io.of(namespace.endpoint).on('connection', (nsSocket) => {
    // console.log(`${nsSocket.id} has joined ${namespace.endpoint}`)

    //here we take the username and picture passed from the handshake upon the front-end connection to the socket. (Line 7, scripts.js)
    const username = nsSocket.handshake.query.username
    const profilepic = nsSocket.handshake.query.profilepic

    //we emit the array of rooms associated with that namespace. This is picked up by line 23 in our joinNameSpace.js file
    nsSocket.emit('nsRoomLoad', namespace.rooms)

    //we are still connected to the namespace - here we're listening for the user to join a room within that namespace
    //roomToJoin is the name of the room the user has clicked on
    //numOfUsersCallback is the function that returns a DOM element with the number of users passed from joinRoom.js
    nsSocket.on('joinRoom', (roomToJoin, numberOfUsersCallback) => {



      //we fetch the rooms property of this socket. socket.rooms is a socketio property.
      //  Every socket automatically joins its own room. 
      //It looks like if you join a room it gets added to the front of the array (index 0) - so the room to leave will be at the index of [1].
      const roomToLeave = Object.keys(nsSocket.rooms)[1]
      nsSocket.leave(roomToLeave)

      //we pass the namespace and the room to leave to the update users in room method
      updateUsersInRoom(namespace, roomToLeave)

      //we then join the new room
      nsSocket.join(roomToJoin)

      io.of(namespace.endpoint).in(roomToJoin).clients((error, clients) => {
        console.log('clients: ', clients)
        numberOfUsersCallback(clients.length)
      })

      const nameSpaceRoom = namespace.rooms.find((room) => {
        return room.roomTitle === roomToJoin
      })

      //emit historyCatchUp, pushing the rooms 
      nsSocket.emit('historyCatchUp', nameSpaceRoom.history)
      updateUsersInRoom(namespace, roomToJoin)

    })



    //here we are listening for new messages to be posted within that namespace
    nsSocket.on('newMessageToServer', (message) => {
      const fullMessage = {
        text: message.text,
        time: (new Date).toLocaleString(),
        username: username,
        avatar: profilepic ? profilepic : 'https://thumbs.dreamstime.com/b/default-placeholder-profile-icon-avatar-gray-woman-90197973.jpg'
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


//get the clients in the room, emit the new number of clients when room membership changes
function updateUsersInRoom(namespace, roomToJoin) {
  io.of(namespace.endpoint).in(roomToJoin).clients((error, clients) => {
    io.of(namespace.endpoint).in(roomToJoin).emit('updateMembers', clients.length)
  })
}