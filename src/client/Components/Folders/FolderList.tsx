import React from 'react' 
import { useEffect,useState, useRef } from 'react';
import { ViewportList } from 'react-viewport-list';

import './styles.scss'; 

import { getDocList } from "../../api/apiClient.js" 


import { DocumentBar,docHandler } from "../DocumentBarWidget";
import { IRowItem } from "../Base/RowItem"
 


const transformData = function(response){
  const result = [];
  const data = response.data;
  for (let i = 0; i < data.length; i++) {
    let item = {
      id: data[i].id,
      title: data[i].path
    }
    result.push(item);
  }
  return result;
}


const FolderList = ({
  items,
  onPickRow,
}: {
  items: { id: string; title: string }[];
  onPickRow:(row:Object) => void;
}) => {
  const ref = useRef(null);
  const listRef = useRef(null);
  
  const [dataSet, setDataSet] = useState<IRowItem[]>([]);

  const fetchFolders = async () => { 
    const res : Response = await getDocList();
    const response = await res.json();
    const list = transformData(response)
    setDataSet(list);
  }
  //invoke api
  useEffect(() => {  
    fetchFolders(); 
    return () => {};
  }, [items]);

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
    },
    [],
  );

  
   const handlePickRow = React.useCallback((rowData) => {
  
    onPickRow(rowData);
    
  }, [onPickRow]);
 
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
             
              <DocumentBar documentId={item.id} rowData= {item} onPickRow={handlePickRow} /> 
            
          )}
        </ViewportList>
      
    </div>     
    </div>
  );
};

export { FolderList };