import express from 'express';
import ShareDB from 'sharedb';
import bodyParser from 'body-parser'; 
import { WebSocketServer } from 'ws';
import WebSocketJSONStream from '@teamwork/websocket-json-stream';

import { myLogger } from './myLogger.js';
import { myShareDB } from './myShareDB.js';
import { RuntimeOption } from './runtimeOption.js'
import morgan  from "morgan"
import  finalhandler  from "finalhandler"


function echoError(res,data,errCode){
    if (errCode){
      return res.status(errCode).send(data); 
    }
    return res.status(500).send(data);
  }
  
function echoSuccess(res,data){ 
    res.header('Content-Type', 'application/json;charset=utf-8') 
    return res.status(200).send(data);
}
 

export const setupApiService = function(app,myShareDB,httpServer){ 

    app.disable('etag');
    
    app.use(express.json());

    // app.use(express.json({limit: '999mb'}));
    // app.use(express.urlencoded({limit: '999mb', extended: true, parameterLimit: 50000}));
    if (myLogger.debugMode()){
        app.use(morgan('combined' ))

    }
    /*
        open doc folder then trigger render on web page
        eg: http://localhost:3030/open?dir=/workspace/code/src&file=welcome.md
    */
    app.get('/open', (req, res) => {  
        
        let   dir  = req.query['dir'];
        let  docId  = req.query['docId']; 
        if (!dir && !docId){
            return  echoError(res,{'error':`invlidate input:${JSON.stringify(req.query)}`}) ;
        } 
        let file = req.query['file']; 
        try{

            if (!dir){
              dir =  myShareDB.getDocPathById(docId); 
            }
            const doc = myShareDB.fetchDoc(dir,true); 
            docId = doc.id;
            const ts = Date.now()
            let url = `/?docId=${docId}&ts=${ts}`
            if (file){
                url = url + `&file=${file}`
            }
            res.redirect (url)
            return ;            
        
        }catch(ex){
            myLogger.debug("Failed fetchDoc", ex);
            return echoError(res,{'error':ex.toString()}) ; 
        } 
    }); 
    /*
        http://localhost:3030/api/fetch/?dir=/workspace/code/src
        http://localhost:3030/api/fetch/?docId=HomeSpace
    */ 
    app.get('/api/fetch', (req, res) => {  
       
        let   dir  = req.query['dir'];
        let  docId  = req.query['docId']; 
        if (!dir && !docId){
            return  echoError(res,{'error':`invlidate input:${JSON.stringify(req.query)}`}) ;
        } 
         
        try{
            if (!dir){
                dir =  myShareDB.getDocPathById(docId); 
            }
            const doc = myShareDB.fetchDoc(dir); 
            
            myLogger.debug(`ShareDB.fetchDoc:${doc}`);
            myLogger.debug(`ShareDB:${myShareDB}`);
        
            return echoSuccess(res,{success: true, doc:doc });
        
        }catch(ex){
            myLogger.debug("Failed fetchDoc", ex);
            return echoError(res,{'error':ex.toString()}) ;   
            
        }
    
    });
 

    app.get('/api/doc/list', (req, res) => { 
        const list =[];
        const docPathSet =  myShareDB.getDocPathSet();
       
        for (const [key, value] of Object.entries(docPathSet)) {
            list.push({id:key,path:value}); 

            if (false){
                for (let index = 1; index < 20; index++) {  
                    list.push({id:key + (""+index) ,path:value});
                }    
            } 
        } 
        echoSuccess(res,{success: true,data:list });
    });

    app.get('/api/doc/info', (req, res) => { 
        const  docId  = req.query['docId'];
        const path =  myShareDB.getDocPathById(docId); 
        const info ={
            docId:docId,
            path:path
        }
        echoSuccess(res,{success: true,data:info });
    });
    
    function fillDocId(list,put2Cache=false){
        if (!list) return ;
        for (let index = 0; index < list.length; index++) {
            const item = list[index];
            const key = myShareDB.toDocKey(item.path);
            item["id"] = key;  
            if (put2Cache){
                myShareDB.cacheDocPath(key,item.path);
            }
        }
    }
    /*
    @purpose: set the folders that contains all avaiable documents(directory path)
    @url:    http://localhost:3030/api/folders
    */ 
   const postFoldersApi = '/api/folders';
    app.post(postFoldersApi, (req, res) => { 
         
        const ts = Date.now();
        let params = {
            folders:[
               {
                parent_id: "xxx", // option 
                name:"group-name" + ts,
                path: "group-path" + ts,
                data: {},
                items:[ {
                    name:"item-name" + ts,
                    path: 'item-path' + ts,
                    data:{}
                }]
               }
            ] 
        }
        params = req.body;
        if (!params){
            return  echoError(res,{'error':"invlidate input"}) ;
        } 
        try{
            let folders = params.folders;
            // pack the id
            fillDocId(folders,true);
            for (let index = 0; index < folders.length; index++) {
                const folder = folders[index];
                if (folder.items){
                    fillDocId(folder.items,true);
                } 
            }
            var result = myShareDB.syncFolders(folders);
             
            return echoSuccess(res,{success: true,data :result }); 
        
        }catch(ex){
            myLogger.debug("Failed setup folders", ex);
            return echoError(res,{'error':ex.toString()}) ;  
        }
    
    });
/*
  folders=[{
    id: ?
    name: 
    data:
    path: 
    items:[
        {
          id: ?
          name: 
          data:
          path: 
        }
    ]
  }]
*/  
    const getFoldesApi = '/api/folders'
    app.get(getFoldesApi, (req, res) => {  
        
        try{ 
            const folders = myShareDB.getFolders();  
            const vals = Object.values(folders)
            return echoSuccess(res,{success: true, data:vals });
        
        }catch(ex){
            myLogger.debug("Failed get folders", ex);
            return echoError(res,{'error':ex.toString()}) ;   
            
        }
    
    });
    
    // echo for check api lives 
    app.get('/api/focusfiles', (req, res) => { 
        const focusfiles = RuntimeOption.getFocusFilePatterns();
        echoSuccess(res,{success: true,data:focusfiles });
    });

    // echo for check api lives 
    app.get('/api/info', (req, res) => { 
        const info = myShareDB.toString();
        echoSuccess(res,{success: true,data:info });
    });
     

    // refresh doc list, but restart wss server now ~~ #TODO
    const apiRrefsh ='/api/refresh';
    app.get(apiRrefsh, (req, res) => { 
     
        if (1>0){  
            reCreateShareDbServer(httpServer)
            return echoSuccess(res,{success: true });
        }
        const { docId} = req.query;
        const success = myShareDB.refreshDoc(docId);
        myLogger.debug('return sucess');
        return echoSuccess(res,{success: success });
    }); 
    
}

const reCreateShareDbServer = function(httpServer){
    //keep exist doc path
    let docPathSet = {
        ...myShareDB.getDocPathSet()
    };
    myShareDB.freeWss();
    createShareDbServerBindWss(httpServer);
    // re-open 
    for (const [key, value] of Object.entries(docPathSet)) {
        myLogger.debug(`reCreateShareDbServer->loop docPathSet, by key:${key},value:${value}`);
        myShareDB._cleanDocFromSet(value);
        myShareDB.fetchDoc(value);
    } 
}

export const createShareDbServerBindWss = function(server){
    // Use ShareDB over WebSocket
    const shareDBBackend = new ShareDB({
        // Enable presence
        // See https://github.com/share/sharedb/blob/master/examples/rich-text-presence/server.js#L9
        presence: true,
        doNotForwardSendPresenceErrorsToClient: true,
    });

    const wss = new WebSocketServer({ server });
    wss.on('connection', (ws) => {
        const clientStream = new WebSocketJSONStream(ws);
        shareDBBackend.listen(clientStream);

        // Prevent server crashes on errors.
        clientStream.on('error', (error) => {
            myLogger.debug('clientStream error: ' + error.message);
        });

        // Handle errors
        ws.on('error', (error) => {
            myLogger.debug('ws error: ' + error.message);
        });

        // Handle disconnections
        ws.on('close', (code) => {
            clientStream.end();
        });
    });
    myShareDB.bindWss(shareDBBackend,wss);
    return  myShareDB;
}