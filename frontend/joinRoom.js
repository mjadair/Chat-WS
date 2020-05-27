function joinRoom(roomName) {

  nsSocket.emit('joinRoom', roomName)

}