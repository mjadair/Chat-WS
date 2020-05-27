const socket = io('http://localhost:9000')

//run the scripts when the DOM has loaded
document.addEventListener('DOMContentLoaded', () => {


  //when our front end client connects to the socket, console log what the socket is.
  socket.on('connect', () => {
    console.log(socket.io)
  })


  //our server emits ns.list in app.js - the socket listens for it here, and appends the content to the HTML
  socket.on('nsList', (nsData) => {
    console.log('We have received the list of namespaces from the server')
    console.log(nsData)
    let nameSpacesDiv = document.querySelector('.namespaces')
    nameSpacesDiv.innerHTML = ''
    nsData.forEach((namespace) => {
      nameSpacesDiv.innerHTML += `<div class=namespace ns=${namespace.endpoint}><img src="${namespace.img}"/> </div>`
    })

  
    Array.from(document.getElementsByClassName('namespace')).forEach((element) => {
      element.addEventListener('click', (e) => {
        const namespaceEndpoint = element.getAttribute('ns')
        console.log(namespaceEndpoint)
      })
    })

    const nsSocket = io('http://localhost:9000/thesimpsons')

    nsSocket.on('nsRoomLoad', (nsRooms) => {
      // console.log(nsRooms)
      let roomList = document.querySelector('.room-list')
      roomList.innerHTML = ''
      nsRooms.forEach((room) => {
        roomList.innerHTML += `<li class='room'><span class='glyphicon glyphicon-${room.privateRoom ? 'lock' : 'globe' }'></span>${room.roomTitle}</li>`
      })


      let roomNodes = document.getElementsByClassName('room')

      Array.from(roomNodes).forEach((element) => {
        element.addEventListener('click', (e) => {
          console.log(`Someone clicked on ${e.target.innerText}`)
        })
      })
    })




  })


  socket.on('messageFromServer', (dataFromServer) => {
    console.log(dataFromServer)
    socket.emit('dataToServer', { data: 'This is the data from our front-end' })
  })


  document.querySelector('.message-form').addEventListener('submit', (event) => {
    event.preventDefault()
    const newMessage = document.querySelector('#user-message'.value)
    socket.emit('newMessageToServer', { text: newMessage })
  })



  socket.on('messageToClients', (msg) => {
    console.log(msg)
    document.querySelector('#messages').innerHTML += `<li> ${msg.text}</li>`
  })


})