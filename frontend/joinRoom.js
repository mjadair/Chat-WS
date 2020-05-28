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


  })
}