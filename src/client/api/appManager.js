import React from "react";
import { VZCodeContext } from '../VZCodeContext';

const AppManager ={

    _status:{},

    getStatus(){
        return this._status;
    },

    setStatus(busy,text=""){ 
        console.debug('AppManager->setStatus',busy,text);
        const status = {
            busy:busy,
            text:text
        } 
        this._status = status;
    },
   
    onError(ex,sender){ 
        handlerError(sender,ex,this)
    },
    
    _listeners:{},
    
    registerListener(key,callback){
        this._listeners[key] = callback;
    },
    
    removeListener(key){
        delete this._listeners[key]
    },

    trigerEvent(key,data){
        for (const key in this._listeners) {
            const callback = this._listeners[key]
            callback.apply(null,{key:key,data:data});
        }
    }
}

const handlerError =(sender,ex,owner)=>{

    if ('debounceUpdateContent' == sender){
        owner.setStatus(false,"❌ load data failure...  please check environment."); 
        owner.trigerEvent('debounceUpdateContent',{event:'error',error:ex})
    }
    console.debug('No handle exception:',sender,ex)
}

export const registerAppManager =()=>{
    getAppManager();
}

export const getAppManager =()=>{
    if (globalThis.appManager){
        return globalThis.appManager;
    }
    globalThis.appManager = AppManager;
    return globalThis.appManager;
}