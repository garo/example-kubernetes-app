
const wsUrl = `ws${window.location.protocol === 'https:' ? 's' : ''}://${
  window.location.host
}/ws`;

console.log("Connecting to websocket url" + wsUrl);

const connection = new WebSocket(wsUrl);

connection.onopen = () => {
  console.log('connected');
};

connection.onclose = () => {
  console.error('disconnected');
};

connection.onerror = (error) => {
  console.error('failed to connect', error);
};

connection.onmessage = (event) => {
  console.log('received', event.data);
  let li = document.createElement('li');
  li.innerText = event.data;
  document.querySelector('#chat').append(li);
};

document.querySelector('form').addEventListener('submit', (event) => {
  event.preventDefault();
  let message = document.querySelector('#message').value;
  connection.send(message);
  document.querySelector('#message').value = '';
});
