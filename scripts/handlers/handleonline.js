let maxPlayers = 2;
let currentPlayers = [];
let username = "MARIO"
let hostPeer;
let peer;
let connection;
let currGamemode;

function initializeHost() {

  let http = new XMLHttpRequest();
  http.open("GET", "https://ids.pods.uvarc.io/alpha/upper/8", false);
  http.send();
  let data = JSON.parse(http.responseText);
  console.log(data.id);

  hostPeer = new Peer(data.id);

  //let newPlayer = new PLAYER(hostPeer, currentPlayers.length + 1, username)
  //currentPlayers.push(newPlayer)

  hostPeer.on('open', function (id) {

    currentPlayers.push(new PLAYER(hostPeer, 0, username))

    initializeRoom();
    manageInteractions(25)
    
  });
}

function initializeRoom() {

  let hostSpace = new UI(width / 2, (height - hSection * 1) - hSection * 1.5, 4, 1, 0, 25, '- ' + currentPlayers[0].name + ' -', 0)

  currGamemode = gmStr[gmset];

  for (let i = 1; i < maxPlayers; i++) {
    let plyrSpace = new UI(width / 2, (height - hSection * (i + 1)) - hSection * 1.5, 4, 6, 0, 25, '- WAITING TO JOIN -', 0);
    plyrSpace.used = false;
    plyrSpace.UIID = UIID;
    UIID ++;

    allUI.push(plyrSpace)
  }
  let copy = new UI(wSection * 2, height - hSection * 1, 4, 1, 1, 25, 'ROOM ID', 24);
  copy.UIID = UIID;
  UIID ++;

  let start = new UI(width - wSection * 2, height - hSection * 1, 4, 6, 0, 25, 'START', 50);
  start.UIID = UIID;
  UIID ++;

  allUI.push(copy, start, hostSpace)
}

function initializeClient() {

  let http = new XMLHttpRequest();
  http.open("GET", "https://ids.pods.uvarc.io/alpha/upper/8", false);
  http.send();
  let data = JSON.parse(http.responseText);
  console.log(data.id);

  peer = new Peer(data.id)

  //let newPlayer = new PLAYER(clientPeer, currentPlayers.length + 1, username)
  //currentPlayers.push(newPlayer)

}

function joinRoom(hostId) {

  initializeClient();

  connection = peer.connect(hostId); // Connect to the host
  connection.on('open', function () {
    
    sendData("playerJoinClient");

    console.log('Connected to host');
    connection.on('data', function (data) {
      handleDataReceived(data);
    });
  });
}

function handleDataReceived(dataPackage) {

  let data = PACKAGE.deserialize(dataPackage)
  console.log(data)

  switch(data.type) {

    case "stateChangeHost":

      sceneID = data.getComponent("scene");
      break;

    case "enterLobbyHost":

      currGamemode = data.getComponent("gamemode")
      maxPlayers = data.getComponent("maxp")
      currentPlayers = data.getComponent("currp")
    
      initializeRoom()
      break;

    case "playerJoinClient":

      currentPlayers.push(data.getComponent("newp"))
      let spaceToUpdate = allUI.find(findByUsed);
      spaceToUpdate.string = data.getComponent("newp")
      break;

    
  }

}

function sendData(type, value = 0) {

  let dataPackage;
  dataPackage = new PACKAGE(type);

  switch(type) {
    case "stateChangeHost":

      dataPackage.addComponent("scene", value);

      break;
    
    case "enterLobbyHost":

      dataPackage.addComponent("gamemode", currGamemode);
      dataPackage.addComponent("maxp", maxPlayers);
      dataPackage.addComponent("currp", currentPlayers);

      break;

    case "playerJoinClient":

      dataPackage.addComponent("newp", username);

      break;
  }

  connection.send({ dataPackage: dataPackage });

}

