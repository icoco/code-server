import path from 'path';
/*
  files is a object not array
  files =
    { 
      x:{
        name:
        text:
      }
      ...
    }  
   

    onFileItem => boolean, if true then break loop
*/
export const loopFiles = (files,onFileItem) => {
    if (!files) return;
    for (const fileId of Object.keys(files)) {
      const file = files[fileId]; 
      const paths = file.name.split("/");
      const n = paths.length;
      
      if (file.text !== null) {
        
        const item = {
          name: paths[n - 1],
          file,
          fileId,
          paths, 
        }  
        console.debug('🧐 loopFiles, item?', item)
        if (onFileItem(item)){
          return true;
        } 
         
      }
    }
    
  };