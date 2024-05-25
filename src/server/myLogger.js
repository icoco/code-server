


const LogLevel ={
        info:'info',
        log: 'log',
        error: 'error',
        debug: 'debug',
        trace: 'trace'
    }

export const myLogger ={ 
    _levels : ['info','log','error'],  // all
    
    debugMode(){
      return false;
    }, 
    _outEnable(level){
        const list = this._levels;
        if ( list.includes('*') || list.includes('all')){
            return true;
        }
         
        return list.includes(level)
    },
    info(){ 
        if (!this._outEnable(LogLevel.info)) return ;
        const prefix =`✍️`
        console.log(...prefix, ...arguments );
    },
    log(){   
        if (!this._outEnable(LogLevel.log)) return ;
        const prefix = `✍️`
        console.log(...prefix, ...arguments );
    },
    debug(){ 
        if (!this._outEnable(LogLevel.debug)) return ;
        const prefix =`🐛`
        console.debug(...prefix, ...arguments );
    },
    trace(){
        if (!this._outEnable(LogLevel.trace)) return ;
        const prefix =`🔍`
        console.trace(...prefix, ...arguments );
    },
    error(){
        if (!this._outEnable(LogLevel.error)) return ;
        const prefix = `🔥` 
        console.error(...prefix, ...arguments );
    },
} 