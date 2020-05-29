// const socket = io('http://localhost:9000')
const username = prompt('What is your username?')
const profilepic = prompt('Paste a link to your photo')


//We connect to the socket initialised as io in app.js line 22. The second object is a 'handshake' given to us by socketio, we can pass it a query object which can store data. 
const socket = io('http://localhost:9000', {
  query: {
    username: username,
    profilepic: profilepic
  }
})
let nsSocket = ''

//run the scripts when the DOM has loaded



//when our front end client connects to the socket, console log what the socket is. Not necessary. 
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



  //add a click listener to all of our namespaces elements and call the joinNameSpace funtion that is in our joinNameSpace.js file. 
  Array.from(document.getElementsByClassName('namespace')).forEach((element) => {
    element.addEventListener('click', (e) => {
      const namespaceEndpoint = element.getAttribute('ns')
      console.log(namespaceEndpoint)
      joinNameSpace(namespaceEndpoint)
    })
  })


//hard-coded: immediately joins the first namespace. 
  joinNameSpace('/thesimpsons')

})

