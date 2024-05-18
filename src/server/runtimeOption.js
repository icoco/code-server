import { getOptionFromArgs } from './cmdArg.js'

export const RuntimeOption={

    _focusFilePatterns:['welcome.md'],
  
    appendFocusFilePatterns(vals){
      this._focusFilePatterns = this._focusFilePatterns.concat(vals);
      console.log('appendFocusFilePatterns',this._focusFilePatterns)
    },
    getFocusFilePatterns(){
      return this._focusFilePatterns;
    },

    async setup (){ 
        // --focus = "a,b,c" 
        const buf = getOptionFromArgs('--focus',null); 
        if (!buf) return ;
        const list = buf.split(",");
        this.appendFocusFilePatterns(list);
    }
  
  }
  
const isFocusFile=(path)=>{
  const fileName = path.basename(path);
  const list = RuntimeOption.getFocusFilePatterns();
  for (let index = 0; index < list.length; index++) {
    const item = list[index]; 
    if (fileName === item){
      return true;
    }
  }
  return false;
}