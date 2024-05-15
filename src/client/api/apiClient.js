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

export const getDocList = async ()=>{  
   
   const ts = Date.now()
   const api = `/api/doc/list?&ts=${ts}`
   return await fetch(api);
    
 } 
 
 
 
