function joinRoom(roomName) {

  //here we use the nsSocket that was defined in joinNameSpace.js

  //when we join the room we emit the below which is picked up by the server in app.js
  nsSocket.emit('joinRoom', roomName, (newNumberOfMembers) => {
    document.querySelector('.curr-room-num-users').innerHTML = `${newNumberOfMembers} <span class='glyphicon glyphicon-user'></span>`
  })


  //when we receive historyCatchup from the server, we loop over the messages history and build the messages using our template
  nsSocket.on('historyCatchUp', (history) => {

    const messages = document.querySelector('#messages')
    messages.innerHTML = ''
    history.forEach(message => {
      console.log('message: ', message)
      const newMessage = buildHTML(message)
      messages.innerHTML += newMessage
    })
    //scrolls to the bottom of the div on page load.
    messages.scrollTo(0, messages.scrollHeight)

  })


  nsSocket.on('updateMembers', (numOfMembers) => {
    document.querySelector('.curr-room-num-users').innerHTML = `${numOfMembers} <span class='glyphicon glyphicon-user'></span>`
    document.querySelector('.curr-room-text').innerText = `${roomName}`
  })




  // low-effort search functionality from udemy tutorial
  let searchBox = document.querySelector('#search-box')
  searchBox.addEventListener('input', (e) => {
    let messages = Array.from(document.getElementsByClassName('message-text'))
    messages.forEach(message => {
      if (message.innerText.indexOf(e.target.value.toLowerCase()) === -1) {
        message.style.display = 'none'
      } else {
        message.style.display = 'block'
      }
    })
  })



}