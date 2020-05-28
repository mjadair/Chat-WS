function joinRoom(roomName) {

  nsSocket.emit('joinRoom', roomName, (newNumberOfMembers) => {

    document.querySelector('.curr-room-num-users').innerHTML = `${newNumberOfMembers} <span class='glyphicon glyphicon-user'></span>`
  })



  nsSocket.on('historyCatchUp', (history) => {

    const messages = document.querySelector('#messages')
    messages.innerHTML = ''

    history.forEach(message => {
      console.log('message: ', message)
      const newMessage = buildHTML(message)
      const currentMessage = messages.innerHTML
      messages.innerHTML = currentMessage + newMessage
    })
    //scrolls to the bottom of the div on page load.
    messages.scrollTo(0, messages.scrollHeight)

  })


  nsSocket.on('updateMembers', (numOfMembers) => {
    document.querySelector('.curr-room-num-users').innerHTML = `${numOfMembers} <span class='glyphicon glyphicon-user'></span>`
    document.querySelector('.curr-room-text').innerText = `${roomName}`
  })
}