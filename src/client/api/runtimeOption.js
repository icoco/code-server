import { getFocusFilePatterns } from './apiClient.js'


export const RuntimeOption={

    _focusFilePatterns:['welcome.md'],
  
    appendFocusFilePatterns(vals){
      this._focusFilePatterns = this._focusFilePatterns.concat(vals);
    },
    getFocusFilePatterns(){
      return this._focusFilePatterns;
    },

    async setup (){
        const res  = await getFocusFilePatterns();
        const response = await res.json();       
       
        if (!response ) return;
        const list = response.data; 
        if (!list) return ;
        //console.log('🧐 RuntimeOption->setup: getFocusFilePatterns ',list);
        this.appendFocusFilePatterns(list);
    }
  
  }
  
export const isFocusFile=(fileName)=>{
  console.log('🧐 RuntimeOption->isFocusFile?',fileName);
  const list = RuntimeOption.getFocusFilePatterns();
   
  for (let index = 0; index < list.length; index++) {
    const item = list[index]; 
    if (fileName === item){
    //if (fileName.match(item)){ 
      return true;
    }
  }
  return false;
}