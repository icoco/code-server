import './styles.scss';
import React from 'react' 
 
export const Spinner =  (
  {display,brandText, loading, tips, children }:
  { display: boolean; 
    brandText:string,
    loading: boolean;
    tips: React.ReactNode;
    children: React.ReactNode;}
  )=> {
  const ref = React.useRef();

  const [isOpen, setIsOpen] = React.useState(false) 

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
  
  React.useEffect(() => {  
    const self = ref.current; 
    return () => {};
  }, []); 
  console.log('🔥 Spinner render')

  return (
  
  <div className='main-layout-box' style={{display: (display) ? "inline-flex" : "none"}} >  
          
      <div className='layout-content'>
          <div className='spinner-box'>
            <div style={{display: (display) ? "block" : "none"}}>
              <div className='spinner-loader' style={{display:  (loading) ? "block" : "none"}}>
                    {brandText}
                </div> 
              <div className='spinner-tip'>{tips}</div> 
              </div>
          </div>
      </div>     
      
      <div className='layout-footer'> 
          {children}
      </div>       
         
  </div>
    
  )
} 