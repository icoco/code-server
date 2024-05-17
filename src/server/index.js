#!/usr/bin/env node
import './setupEnv.js';
import http from 'http';
import express from 'express';
import ShareDB from 'sharedb';
import { WebSocketServer } from 'ws';
import WebSocketJSONStream from '@teamwork/websocket-json-stream';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
//import open from 'open'; // seem is hard to use 
import { openBrowser } from './utils.js';

import ngrok from 'ngrok';
import bodyParser from 'body-parser';
import { json1Presence } from '../ot.js';
import { computeInitialDocument } from './computeInitialDocument.js';
import { handleAIAssist } from './handleAIAssist.js';
import { isDirectory } from './isDirectory.js';

import { myLogger,FileSys } from './utils.js';
import { myShareDB } from './myShareDB.js';
import { getPortFromArgs, getWebsiteSpaceFromArgs, getDocumentSpaceFromArgs,prepareSpaceByAsset,getOptionFromArgs } from "./cmdArg.js"
import { createShareDbServerBindWss,setupApiService } from './apiService.js';
import { Constants } from './constants.js';


//------ slient 
const slientMode = getOptionFromArgs("--slient",null);

//------ Server port
const port = getPortFromArgs();
 
//------  Express website path   
const websitePath = getWebsiteSpaceFromArgs();
if (!FileSys.validateDir(websitePath)){
  FileSys.validateDir(websitePath,true)
  //#TODO
  prepareSpaceByAsset('dist',websitePath)
}  
//------  Document space path  
var docSpacePath = getDocumentSpaceFromArgs(); 
if (!FileSys.validateDir(docSpacePath)){
  FileSys.validateDir(docSpacePath,true)
  //#TODO
  prepareSpaceByAsset('space',docSpacePath)
} 
myLogger.debug(`document space path:${docSpacePath}`);
myShareDB.init(Constants.homeSpace,docSpacePath);


const app = express(); 
const server = http.createServer(app); 
myLogger.debug(`express website root:${websitePath}`);
app.use(express.static(websitePath)); 
 
createShareDbServerBindWss(server); 
setupApiService(app,myShareDB,server);

myShareDB.openDoc(docSpacePath);

// Handle AI Assist requests.
app.post(
  '/ai-assist',
  bodyParser.json(),
 // handleAIAssist(shareDBDoc),
);
 
const openBrowserIfNeeds=(url)=>{ 
  if (slientMode && slientMode.toString() === 'true') return;
  openBrowser(url);
}

server.listen(port, async () => {
  
  if (process.env.NGROK_TOKEN) {
    (async function () {
      await ngrok.authtoken(process.env.NGROK_TOKEN);
      const url = await ngrok.connect(port);
      console.log(`Editor is live at ${url}`);
      openBrowserIfNeeds(url);
    })();
  } else {
    console.log(
      `🚀 Code Editor is live at http://localhost:${port}`,
    );
    openBrowserIfNeeds(`http://localhost:${port}`);
  }
});
