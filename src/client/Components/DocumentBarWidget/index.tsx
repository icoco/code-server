// Notice how you import it, changed since ver 3.
import { Collapse } from '@kunukn/react-collapse'
import React from 'react' 
import { getDocInfoById } from "../../api/apiClient.js" 
import './styles.scss';

import { DirectoryArrowSVG } from '../../Icons';

export const docHandler = {
  _lastId:null,
  _handler:null,
  getDocInfoById(docId=null){
    
    if (docId){
      if (docId == this._lastId){
        return this._handler;
      }
      this._handler = getDocInfoById(docId);
      this._lastId = docId;
    } 
    return this._handler;
  }
} 
 
export const DocumentBar =  ({documentId}:{documentId: string;})=> {
  const [isOpen, setIsOpen] = React.useState(false)
  const onToggle = () => setIsOpen((s) => !s)
 
   const response  = docHandler.getDocInfoById().read(); 
   let docPath = '';
   if (response && response.data){
      docPath = response.data.path;
   }
   
  return (
          
    <div className="documentBar ">
      <div className='name titleRow' onClick={onToggle}>
        <div
          className="arrow-wrapper"
          style={{
            transform: `rotate(${isOpen ? 90 : 0}deg)`,
          }}
        >
          <DirectoryArrowSVG />
        </div>
        <div> {documentId} </div>
      </div>
      <Collapse isOpen={isOpen} transition="height 300ms cubic-bezier(0.4, 0, 0.2, 1)"> 
        <div className='card'>
          <span className='title'>path:</span><p>{docPath} </p>
        </div> 
      </Collapse> 

    </div>
  )
}

 