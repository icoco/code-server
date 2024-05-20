// Displays the Vite devserver iframe.
// TODO test this out, think this through.
// Purpose: support folks using VZCode as the editor
// for their Vite-based projects.
import React, { Children } from 'react' 
import { VZCodeContext } from './VZCodeContext';
import {Spinner} from "./Components/Spinner"
import { AppConfig } from "./api/runtimeOption.js"

const enableIframe = false;

const asDom = function(a):HTMLElement{
  return a;
}
export const VZRight = () => {
  const display = React.useRef<boolean>(true); 
  
  //---- 
  const { 
    activeFileId, 
  } = React.useContext(VZCodeContext);
  React.useEffect(() => {
    display.current = !activeFileId;
    console.debug('🧐 useEffect->activeFileId?', activeFileId)
    forceAdjustLayout();
  });
  //---- appManager status effect
  const [isLoading, setIsLoading] = React.useState(false);
  const tips = React.useRef<string>( AppConfig.appName);

  const renderAppStatus =()=>{
    const appManager = globalThis.appManager;
    console.debug('effect check status, this?,appManager? ', this,appManager,)
    if (!appManager) return;
    
    const status = appManager.getStatus();
    let busy = status ? status.busy : false;
    setIsLoading(busy);

    let statusTips = status.text; 
    tips.current = statusTips
     
    forceAdjustLayout();
  }
  React.useEffect(() => {
    renderAppStatus(); 
   
  }, []);
  
  const appManager = globalThis.appManager;
  appManager.registerListener("on_status_updated",(x)=>{
    renderAppStatus();
  });
 
  const forceAdjustLayout=()=>{
    const elements = document.getElementsByClassName('middle');
    console.debug('getElementsByClassName  middle ?', elements)
    if (!elements || elements.length<1){
      return ;
    }
    const middle = asDom(elements[0]);
    if (!display.current){
      middle.style.width= "100%";
    }else{
      middle.style.width= "0";
    }
  }
  
  const onClickHome=()=>{
      const location = window.location ; 
      let baseUrl = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + '/';

      window.location.href = baseUrl;
  }
  return (
    <div className="right" >
      {enableIframe ? (
        <iframe src="http://localhost:5173/"></iframe>
      ) : null}
      <Spinner display={display.current} loading={isLoading} brandText=""  tips={tips.current}>
        <div className='layout-bottom' style={{height:'100px', cursor:'pointer'}} title="Back to home" onClick={onClickHome}>
          {AppConfig.appName} 
        </div>
      </Spinner>
    </div>
  );
};
