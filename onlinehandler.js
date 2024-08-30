
let currentPlayers = [];
let username = "MARIO";
let hostPeer;

function initializeHost() {

  var http = new XMLHttpRequest();
  http.open("GET", "https://ids.pods.uvarc.io/alpha/upper/8", false);
  http.send();
  var data = JSON.parse(http.responseText);
  console.log(data.id);

  hostPeer = new Peer(data.id);

  let newPlayer = new PLAYER(hostPeer, 1, username)
  currentPlayers.push(newPlayer)

  hostPeer.on('open', function (id) {
    manageInteractions(25)
    
  });
}

function initializeRoom() {
  for (let i = 1; i < maxPlayers + 1; i++) {
    let plyrSpace = new UI(width / 2, (height - hSection * i) - hSection, 4, 6, 0, 25, '_ WAITING TO JOIN _', 0);
    allUI.push(plyrSpace)
  }
  let copy = new UI(width / 4, height - hSection * 1, 4, 1, 1, 25, 'COPY ID', 24);
  allUI.push(copy)
}

function initializeClient() {

}

function joinRoom(id) {

}

function handleDataReceived() {

}

function handleDataSent() {
  
}

