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


const expressServer = app.listen(9000, () => console.log('Express server is listening on Port 9000'))
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