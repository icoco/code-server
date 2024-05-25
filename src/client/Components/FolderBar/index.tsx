// Notice how you import it, changed since ver 3.
import { Collapse } from '@kunukn/react-collapse'
import React, { Children } from 'react' 
import { getDocInfoById } from "../../api/apiClient.js" 
import './styles.scss';
import { DirectoryArrowSVG } from '../../Icons/index.js';
import { IRowItem } from '../Base/RowItem.js';
// import { Tooltip } from 'react-tooltip'

import { Tooltip, OverlayTrigger } from '../../bootstrap.js';
//import TableView from 'react-table-view'
import { JsonToTable } from "react-json-to-table";
import './json-table.scss';

const trimHolderInfo=(title)=>{ 
    title = title.replace('/Users/icoco','')
    title = title.replace('/WorkSpace/2024/prj/odoo/odoo-space-17','')
    title = title.replace('/WorkSpace/2024/prj/odoo/kit/git','/WorkSpace')
    return title;
}
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
export const FolderBar =  (
  {key,documentId,rowData,onPickRow,children}:
  {key:string, documentId: string;rowData:IRowItem|null;  onPickRow:(row:Object)=>void;  children: React.ReactNode;}
  )=> {
  const [isOpen, setIsOpen] = React.useState(false)
  const onToggle = () => setIsOpen((s) => !s)
  
  const [isChecked, setIsChecked] = React.useState(false);
   
  const handlePickRow = React.useCallback((e) => {
    onPickRow(rowData);
  }, [rowData, onPickRow]);

  //use check mount status to avoid repeat execute mount event logic 
  const mountedOnce = React.useRef<boolean>(false);

  const onMountedOnce = ()=>{
    if (mountedOnce.current) {
       return ;
    }
    mountedOnce.current = true; 
    setTimeout(()=>{
        setIsOpen(true); 
    },100) 
  }
  const myJson = {
    Analyst: { name: "Jack", email: "jack@xyz.com" },
    "Loaded by": "Jills", 
    "Jira Ticket": "Foo-1",
    "Confluence URL": "http://myserver/wxyz",
    "Study sponsors": [
      { name: "john", email: "john@@xyz.com" },
      { name: "jane", email: "jane@@xyz.com" }
    ]
  };
   
  let title = ''; 
  let docPath = '';
  let titleContentClass = 'title-content-short';
  if ( rowData){
    if (!rowData.data){
      //rowData.data = myJson;
    }
    

    title = rowData.name;
    
    docPath = rowData['path']; 
    if (rowData.items){   
      onMountedOnce();
    }
  }else{
    titleContentClass = 'title-content-full';
    const response  = docHandler.getDocInfoById().read(); 
    if (response && response.data){
      title = response.data.path;
      docPath =  response.data.path;
    }
  }
  //@step
  title = trimHolderInfo(title); 
  docPath = trimHolderInfo(docPath);

  //console.debug('repeat ~ render FolderBar ⚡️')
 
  return (
          
    <div key={documentId} className="folder-bar ">
     
      <div className='name title-row' onClick={onToggle}>
        <div
          className="arrow-wrapper"
          style={{
            transform: `rotate(${isOpen ? 90 : 0}deg)`,
          }}
        >
          <DirectoryArrowSVG />
        </div>
       
        <div className={titleContentClass}> {title} </div>
        {
          rowData && !rowData.items?
          (
            
            // <div className='selecteBox' data-tooltip-id="my-tooltip" data-tooltip-content="Open folder" >
              
            //   <input className='rightButton' type="checkbox" name="" 
            //   id={documentId} checked={isChecked} onChange={handlePickRow}   /> 
             
            //   <Tooltip id="my-tooltip" ></Tooltip>
            // </div>
           
            <div className='selecte-box'   >
              
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
      <Collapse isOpen={isOpen} transition=" height 300ms cubic-bezier(0.4, 0, 0.2, 1)"> 
        <div className='detail-card'>
          <div className='detail-card-content'>
            <p>
            path: {docPath}  
            </p> 
            {
              rowData && rowData.data?( 
                <div className="jtable">
                 <JsonToTable json={rowData.data} /> 
                 </div>
              ):null
            }
          </div> 
          {children}
        </div> 
      </Collapse> 

    </div>
  )
}

 