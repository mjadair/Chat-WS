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


  let searchBox = document.querySelector('#search-box')
  searchBox.addEventListener('input', (e) => {
    let messages = Array.from(document.getElementsByClassName('message-text'))
    messages.forEach(message => {
      if (message.innerText.indexOf(e.target.value) === -1) {
        message.style.display = 'none'
      } else {
        message.style.display = 'block'
      }
    })
  })



}