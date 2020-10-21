const http = require('http');
const process = require('process');
const fs = require('fs');
const express = require('express');


const port = '8888';

// Prometheus metrics example
const Prometheus = require('prom-client');
Prometheus.collectDefaultMetrics({ timeout: 5000 });

const http_requests_total = new Prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total requests per second for this application'
});

const latency = new Prometheus.Histogram({name:"test",help:"test"});

latency.observe(1);

// Simple web server
const server = express();
const expressWs = require('express-ws')(server);

server.use('/static', express.static('static'));

// Expose the prometheus metrics
server.get('/metrics', (req, res) => {
  console.log("Metrics have been scraped");
	res.set('Content-Type', Prometheus.register.contentType);
	res.end(Prometheus.register.metrics());
});

server.get('/', (req, res) => {
  http_requests_total.inc();
  res.writeHead(200, { 'Content-Type': 'text/plain' });

  res.write('Hello World from node.js. Hello kubernetes! ' + Math.random());
  res.write("\nHeaders:\n");
  res.write(JSON.stringify(req.headers, null, 2));
  res.write("\nCheck out /static/ with your browser to test WebSockets.\n");
  console.log("Hello, World from console, no json logging");
  console.log(JSON.stringify({
    msg: "Hello, World, this is a json encoded log message, written to stdout",
    address: req.connection.remoteAddress
  }));

  res.end('\n');
});

server.ws('/ws', function(ws, req) {
  ws.on('message', function(msg) {
    console.log("Got message:", msg);
  })
});

const wsPath = expressWs.getWss('/ws');
setInterval(function() {
  wsPath.clients.forEach(function (client) {
    client.send('ping at ' + (new Date().toISOString()));
  });
}, 5000);

server.listen(port);
console.log("Server started to listen on port", port);
