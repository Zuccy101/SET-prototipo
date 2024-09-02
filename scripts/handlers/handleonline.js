let maxPlayers = 2;
let currentPlayers = [];
let username = "MARIO"
let hostPeer;
let clientPeer;
let connection;

function initializeHost() {

  let http = new XMLHttpRequest();
  http.open("GET", "https://ids.pods.uvarc.io/alpha/upper/8", false);
  http.send();
  let data = JSON.parse(http.responseText);
  console.log(data.id);

  hostPeer = new Peer(data.id);

  let newPlayer = new PLAYER(hostPeer, currentPlayers.length + 1, username)
  currentPlayers.push(newPlayer)

  hostPeer.on('open', function (id) {
    initializeRoom();
    manageInteractions(25)
    
  });
}

function initializeRoom() {
  for (let i = 1; i < maxPlayers + 1; i++) {
    let plyrSpace = new UI(width / 2, (height - hSection * i) - hSection * 1.5, 4, 6, 0, 25, '_ WAITING TO JOIN _', 0);
    allUI.push(plyrSpace)
  }
  let copy = new UI(wSection * 2, height - hSection * 1, 4, 1, 1, 25, 'ROOM ID', 24);
  let start = new UI(width - wSection * 2, height - hSection * 1, 4, 6, 0, 25, 'START', 24);

  allUI.push(copy, start)
}

function initializeClient() {

  let http = new XMLHttpRequest();
  http.open("GET", "https://ids.pods.uvarc.io/alpha/upper/8", false);
  http.send();
  let data = JSON.parse(http.responseText);
  console.log(data.id);

  clientPeer = new Peer(data.id)

  let newPlayer = new PLAYER(clientPeer, currentPlayers.length + 1, username)
  currentPlayers.push(newPlayer)

}

function joinRoom(hostId) {

  initializeClient();

  connection = clientPeer.connect(hostId); // Connect to the host
  connection.on('open', function () {
     
    console.log('Connected to host');
    handleDataReceived();
    handleDataSent();
  });
}

function handleDataReceived() {

}

function handleDataSent() {
  
}

