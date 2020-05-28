function joinNameSpace(endpoint) {


  if (nsSocket) {
    nsSocket.close()

    //remove the event listener to stop it posting the same message multiple times when a user moves namespace

    document.querySelector('#user-input').removeEventListener('submit', formSubmission)
  }


  nsSocket = io(`http://localhost:9000${endpoint}`)

  nsSocket.on('nsRoomLoad', (nsRooms) => {
    // console.log(nsRooms)
    let roomList = document.querySelector('.room-list')
    roomList.innerHTML = ''
    nsRooms.forEach((room) => {
      roomList.innerHTML += `<li class='room'><span class='glyphicon glyphicon-${room.privateRoom ? 'lock' : 'globe'}'></span>${room.roomTitle}</li>`
    })


    let roomNodes = document.getElementsByClassName('room')

    Array.from(roomNodes).forEach((element) => {
      element.addEventListener('click', (e) => {
        console.log(`Someone clicked on ${e.target.innerText}`)

        joinRoom(e.target.innerText)
      })
    })

    const topRoom = document.querySelector('.room')
    const topRoomName = topRoom.innerText

    console.log(topRoomName)

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




