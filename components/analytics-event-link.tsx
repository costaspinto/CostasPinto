'use client';
import type { AnchorHTMLAttributes, MouseEvent } from 'react';
type Props=AnchorHTMLAttributes<HTMLAnchorElement>&{event:'project_click'|'resume_click'|'contact_click'};
export function AnalyticsEventLink({event,onClick,...props}:Props){
 const handle=(e:MouseEvent<HTMLAnchorElement>)=>{void fetch('/api/analytics',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({event,path:window.location.pathname,referrer:document.referrer}),keepalive:true}).catch(()=>{});onClick?.(e);};
 return <a {...props} onClick={handle}/>;
}
