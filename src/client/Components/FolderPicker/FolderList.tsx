
import React from 'react' 
import { useEffect,useState, useRef } from 'react';
import { ViewportList } from 'react-viewport-list';

import './styles.scss'; 

import { getFolderList } from "../../api/apiClient.js"  

import { DocumentBar } from "../DocumentBarWidget";
import { IRowItem } from "../Base/RowItem" 

const FolderList = ({
  items,
  onPickRow,
  isDoc,
}: {
  items: IRowItem[];
  onPickRow:(row:Object) => void;
  isDoc: boolean;
}) => {
  const ref = useRef(null);
  const listRef = useRef(null); 
  const [dataSet, setDataSet] = useState<IRowItem[]>([]);

  const fetchFolders = async () => { 
    const res : Response = await getFolderList();
    const response = await res.json();
    setDataSet(response.data);
  }
 
    //invoke get folders api
  useEffect(() => {  
    console.log('🔥 useEffect->fetchFolders')  
    if (isDoc){
      setDataSet(items);
    }else{
      fetchFolders();  
    } 
    return () => {};
  }, []);
 

  // ui effect
  useEffect(
    () => () => {
 
      if (!listRef || !listRef.current){
        return ;
      }
      window.sessionStorage.setItem(
        'lastScrollPosition',
        JSON.stringify(
          listRef.current.getScrollPosition(),
        ),
      );
    },[]);

  
   const handlePickRow = React.useCallback((rowData) => { 
      onPickRow(rowData);
    
    },[onPickRow]); 

  return (
    <div className='folder-list-page'>
    <div className='files scroll-container' ref={ref}>
        <ViewportList
          ref={listRef}
          viewportRef={ref}
          items={dataSet}
        >
          {(item) => ( 
            // <div key={item.id} className="item">
            //   {item.title}🔥
            // </div>
             
              <DocumentBar documentId={item.id} rowData= {item} onPickRow={handlePickRow} >
                {/* <div >debug:{JSON.stringify(item.items)}</div>  */}
                { 
                  item.items ? (
                    <FolderList items={item.items} onPickRow={handlePickRow} isDoc={true}/>  
                  ):(<></>)
                }
               
              </DocumentBar> 
            
          )}
        </ViewportList>
      
    </div>     
    </div>
  );
};

export { FolderList };