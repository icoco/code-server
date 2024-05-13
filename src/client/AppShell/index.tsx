import React,  { Suspense} from "react";
import App from '../App'; 
import { reloadDocThen }  from '../api/apiClient'

const fetchHandler = reloadDocThen()

function AppShell() {  
  const docStatus = fetchHandler.read();  
  return ( 
      <App /> 
      // <Suspense fallback={<p>loading...</p>}>
      //   <App />
      // </Suspense>    
  );
}

export default AppShell;
