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
    console.log(`${nsSocket.id} has joined ${namespace.endpoint}`)
    nsSocket.emit('nsRoomLoad', namespaces[0].rooms)
  })


})