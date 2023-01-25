#!/usr/bin/env node
import http from 'http';
import express from 'express';
import ShareDB from 'sharedb';
import json1 from 'ot-json1';
import { WebSocketServer } from 'ws';
import WebSocketJSONStream from '@teamwork/websocket-json-stream';

console.log('Welcome to VZCode!');

ShareDB.types.register(json1.type);

const app = express();
const port = 3030;

const shareDBBackend = new ShareDB();
const shareDBConnection = shareDBBackend.connect();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  shareDBBackend.listen(new WebSocketJSONStream(ws));
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Create initial document
// TODO
//  * figure out how to list files on disk with NodeJS
//  * use that list to populate the files in our document.
const shareDBDoc = shareDBConnection.get('documents', '1');
shareDBDoc.create(
  {
    2432: { text: 'const foo = "bar";', name: 'index.js' },
  },
  json1.type.uri
);

server.listen(port, () => {
  console.log(`Editor is live at http://localhost:${port}`);
});
