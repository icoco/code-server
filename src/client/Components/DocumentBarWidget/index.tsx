// Notice how you import it, changed since ver 3.
import { Collapse } from '@kunukn/react-collapse'
import React from 'react'
 
import { getDocInfoById } from "../../api/apiClient.js"
 
import './styles.scss';

const handler = getDocInfoById();

export default  ({documentId}:{documentId: string;})=> {
  const [isOpen, setIsOpen] = React.useState(false)
  const onToggle = () => setIsOpen((s) => !s)
   
  console.log('DocumentBar-> getDocInfoById');


  // startTransition(() => {
  //   const fetchHandler = getDocInfoById(documentId);
  //   console.log('DocumentBar-> fetchHandler');
  
  //   const info = fetchHandler.read();
  //   const buf =JSON.stringify(info)
  //   setDocInfo(buf);
  // })
   const response  = handler.read(); 
   let docPath = '';
   if (response && response.data){
      docPath = response.data.path;
   }
   
  return (
          
    <div className="documentBar">
     
        <div className='title' onClick={onToggle}> {documentId} </div>
        <Collapse
          isOpen={isOpen}
          transition="height 300ms cubic-bezier(0.4, 0, 0.2, 1)"
        >
          
            <div className='card'>
              <span className='title'>path:</span><p>{docPath} </p>
            </div>
         
        </Collapse>
      
    </div>
  )
}

 