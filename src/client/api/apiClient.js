import { Request }  from "../utils/Request.js";
import { getData } from "../utils/RequestClient.js"
import { myLogger } from "../utils/Logger.js"

const getRequestDocId = function(){
  const args = Request.getParameters();
  myLogger.debug("reload Request.getParameters:",args);

  const docId = args['docId'];
  //default => homeSpace, fix set this value 
  return docId ? docId : 'homeSpace';
} 

export const  openDoc = async(docId)=>{  
  const ts = Date.now()
  window.location.href = `/open?docId=${docId}&ts=${ts}`;
   
}

export const  preloadDoc = async(docId)=>{  
  const ts = Date.now() 
  const api = `/api/fetch?docId=${docId}&ts=${ts}`;
  console.debug('🧐 preloadDoc',api)
  fetch(api); 
}

export const reloadDocThen = ()=>{ 
  
  const docId = getRequestDocId();
   
  const ts = Date.now()
  const api = `/api/refresh?docId=${docId}&ts=${ts}`
  return getData(api);
} 

export const getDocInfoById = (docId)=>{  
 // const docId = getRequestDocId();

  const ts = Date.now()
  const api = `/api/doc/info?docId=${docId}&ts=${ts}`
  return getData(api);
} 

/*
  folders=[{
    id: ?
    name: 
    data:
    items:[
        {
          id: ?
          name: 
          data:
        }
    ]
  }]
*/
export const getFolderList = async ()=>{  
   
   const ts = Date.now()
   const api = `/api/folders?&ts=${ts}`
   return await fetch(api);
    
} 
 
 
export const getFocusFilePatterns = async ()=>{  
   
  const ts = Date.now()
  const api = `/api/focusfiles?&ts=${ts}`
  return await fetch(api);
   
}  
