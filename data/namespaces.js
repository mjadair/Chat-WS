// Bring in the room class
const Namespace =  require('../classes/Namespace')
const Room =  require('../classes/Room')

// Set up the namespaces
let namespaces = []
let theSimpsons = new Namespace(0,'The Simpsons','https://i.imgur.com/3V9zzHN.jpg','/thesimpsons')
let starWars = new Namespace(1,'Star Wars','https://i.imgur.com/mNKzQMx.jpg','/starwars')
let harryPotter = new Namespace(2,'Harry Potter','https://i.imgur.com/7W82c76.jpg','/harrypotter')



// Make the main room and add it to rooms. it will ALWAYS be 0
theSimpsons.addRoom(new Room(0,'Favourite Characters','The Simpsons'))
theSimpsons.addRoom(new Room(1,'Best Episodes','The Simpsons'))
theSimpsons.addRoom(new Room(2,'Other','The Simpsons'))

starWars.addRoom(new Room(0,'Original Trilogy','Star Wars'))
starWars.addRoom(new Room(1,'Prequel Trilogy','Star Wars'))
starWars.addRoom(new Room(2,'Sequel Trilogy','Star Wars'))
starWars.addRoom(new Room(3,'TV Shows','Star Wars'))

harryPotter.addRoom(new Room(0,'Books','Harry Potter'))
harryPotter.addRoom(new Room(1,'Films','Harry Potter'))
harryPotter.addRoom(new Room(2,'Theatre','Harry Potter'))
harryPotter.addRoom(new Room(3,'Additional Stories','Harry Potter'))

namespaces.push(theSimpsons,starWars,harryPotter)


module.exports = namespaces