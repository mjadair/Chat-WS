const socket = io('https://localhost:9000')


console.log(socket.io)

socket.on('connect', () => {
  console.log(socket.io)
})

//listen for nsList in our app.js - this is a list of all the namespaces

socket.on('nsList', (nsData) => {
  console.log('We have received the list of namespaces from the server')
  console.log(nsData)
  let nameSpacesDiv = document.querySelector('.namespaces')
  nameSpacesDiv.innerHTML = ''
  nsData.forEach((namespace) => {
    nameSpacesDiv.innerHTML += `<div class=namespace><img src="${namespace.img}"/> </div>`
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