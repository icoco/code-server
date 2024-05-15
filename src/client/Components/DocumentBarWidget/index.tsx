// Notice how you import it, changed since ver 3.
import { Collapse } from '@kunukn/react-collapse'
import React from 'react' 
import { getDocInfoById } from "../../api/apiClient.js" 
import './styles.scss';
import { DirectoryArrowSVG } from '../../Icons';
import { IRowItem } from '../Base/RowItem.js';
// import { Tooltip } from 'react-tooltip'

import { Tooltip, OverlayTrigger } from '../../bootstrap';
 

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
 
export const DocumentBar =  (
  {documentId,rowData,onPickRow}:{documentId: string;rowData:IRowItem|null;onPickRow:(row:Object) => void;}
  )=> {
  const [isOpen, setIsOpen] = React.useState(false)
  const onToggle = () => setIsOpen((s) => !s)

  const [isChecked, setIsChecked] = React.useState(false);
   
  const handlePickRow = React.useCallback((e) => {
    onPickRow(rowData);
  }, [rowData, onPickRow]);

  let docPath = ''; 
  let titleContentClass = 'title-content-short';
  if ( rowData){
    docPath = rowData.title;
  }else{
    titleContentClass = 'title-content-full';
    const response  = docHandler.getDocInfoById().read(); 
    if (response && response.data){
        docPath = response.data.path;
    }
  }
  return (
          
    <div className="document-bar ">
     
      <div className='name title-row' onClick={onToggle}>
        <div
          className="arrow-wrapper"
          style={{
            transform: `rotate(${isOpen ? 90 : 0}deg)`,
          }}
        >
          <DirectoryArrowSVG />
        </div>
        {/* <div className='ititle-content'> {docPath} </div> */}
        <div className={ titleContentClass  }> {docPath} </div>
        {
          rowData?
          (
            
            // <div className='selecteBox' data-tooltip-id="my-tooltip" data-tooltip-content="Open folder" >
              
            //   <input className='rightButton' type="checkbox" name="" 
            //   id={documentId} checked={isChecked} onChange={handlePickRow}   /> 
             
            //   <Tooltip id="my-tooltip" ></Tooltip>
            // </div>
            <div className='selecteBox'   >
              
              <OverlayTrigger
                placement="left"
                overlay={
                  <Tooltip id="open-settings-tooltip">
                    Open folder
                  </Tooltip>
                }
              >
              <i
                onClick={handlePickRow}
                className="icon-button icon-button-dark"
                >
                <span className='rightButton emoj-buttion'>✓</span> 
              </i>
            </OverlayTrigger> 
            
          </div>
          ):null
        }

      </div>
      <Collapse isOpen={isOpen} transition="height 300ms cubic-bezier(0.4, 0, 0.2, 1)"> 
        <div className='card'>
          <span className='title'>path:</span><p>{docPath} </p>
        </div> 
      </Collapse> 

    </div>
  )
}

 