//the function called by clicking on a namespace from our front-end scrips.js file


function joinNameSpace(endpoint) {


  //if we are already connected to a namespace, close the connection
  if (nsSocket) {
    nsSocket.close()

    //remove the event listener to stop it posting the same message multiple times when a user moves namespace
    document.querySelector('#user-input').removeEventListener('submit', formSubmission)
  }



  //we join the namespace based on the endpoint the user selected on click (line 42 in scripts.js)
  nsSocket = io(`http://localhost:9000${endpoint}`)



  //when our server hears us join a name space it emits nsRoomLoad, which passes the namespaces rooms array of objects to us
  nsSocket.on('nsRoomLoad', (nsRooms) => {


    //selects the DOM and adds the room names
    let roomList = document.querySelector('.room-list')
    roomList.innerHTML = ''
    nsRooms.forEach((room) => {
      roomList.innerHTML += `<li class='room'><span class='glyphicon glyphicon-${room.privateRoom ? 'lock' : 'globe'}'></span>${room.roomTitle}</li>`
    })


    //selects our newly added rooms
    let roomNodes = document.getElementsByClassName('room')


    //adds event listeners to each of our room titles and runs the joinRoom function (joinRoom.js) on click
    Array.from(roomNodes).forEach((element) => {
      element.addEventListener('click', (e) => {
        joinRoom(e.target.innerText)
      })
    })


    //joins the first room in the rooms list upon the socket hearing 'nsRoomLoad'
    const topRoom = document.querySelector('.room')
    const topRoomName = topRoom.innerText
    joinRoom(topRoomName)


  })




  nsSocket.on('messageToClients', (msg) => {
    console.log(msg)
    const newMessage = buildHTML(msg)
    document.querySelector('#messages').innerHTML += newMessage
    document.querySelector('#user-message').value = ''
  })



  document.querySelector('.message-form').addEventListener('submit', formSubmission)

}



function formSubmission(event) {
  event.preventDefault()
  console.log(event)
  const newMessage = event.target[0].value
  nsSocket.emit('newMessageToServer', { text: newMessage })






}




function buildHTML(message) {
  const newHTML = ` 
    <li>
    <div class="user-image">
      <img src="${message.avatar}" />
    </div>
    <div class="user-message">
  <div class="user-name-time">${message.username}<span class='message-time'>${message.time}</span></div>
      <div class="message-text">${message.text}</div>
    </div>
  </li>`

  return newHTML
}




