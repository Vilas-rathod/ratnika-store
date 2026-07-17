import{a as b,R as L,j as at}from"./vendor-state-D1igwH1h.js";function pi(t){var e,n,s="";if(typeof t=="string"||typeof t=="number")s+=t;else if(typeof t=="object")if(Array.isArray(t)){var i=t.length;for(e=0;e<i;e++)t[e]&&(n=pi(t[e]))&&(s&&(s+=" "),s+=n)}else for(n in t)t[n]&&(s&&(s+=" "),s+=n);return s}function xt(){for(var t,e,n=0,s="",i=arguments.length;n<i;n++)(t=arguments[n])&&(e=pi(t))&&(s&&(s+=" "),s+=e);return s}var Ht=t=>typeof t=="number"&&!isNaN(t),wt=t=>typeof t=="string",lt=t=>typeof t=="function",lr=t=>wt(t)||Ht(t),He=t=>wt(t)||lt(t)?t:null,cr=(t,e)=>t===!1||Ht(t)&&t>0?t:e,We=t=>b.isValidElement(t)||wt(t)||lt(t)||Ht(t);function ur(t,e,n=300){let{scrollHeight:s,style:i}=t;requestAnimationFrame(()=>{i.minHeight="initial",i.height=s+"px",i.transition=`all ${n}ms`,requestAnimationFrame(()=>{i.height="0",i.padding="0",i.margin="0",setTimeout(e,n)})})}function fr({enter:t,exit:e,appendPosition:n=!1,collapse:s=!0,collapseDuration:i=300}){return function({children:r,position:o,preventExitTransition:a,done:l,nodeRef:c,isIn:u,playToast:f}){let h=n?`${t}--${o}`:t,d=n?`${e}--${o}`:e,p=b.useRef(0);return b.useLayoutEffect(()=>{let y=c.current,m=h.split(" "),g=v=>{v.target===c.current&&(f(),y.removeEventListener("animationend",g),y.removeEventListener("animationcancel",g),p.current===0&&v.type!=="animationcancel"&&y.classList.remove(...m))};y.classList.add(...m),y.addEventListener("animationend",g),y.addEventListener("animationcancel",g)},[]),b.useEffect(()=>{let y=c.current,m=()=>{y.removeEventListener("animationend",m),s?ur(y,l,i):l()};u||(a?m():(p.current=1,y.className+=` ${d}`,y.addEventListener("animationend",m)))},[u]),L.createElement(L.Fragment,null,r)}}function Yn(t,e){return{content:mi(t.content,t.props),containerId:t.props.containerId,id:t.props.toastId,theme:t.props.theme,type:t.props.type,data:t.props.data||{},isLoading:t.props.isLoading,icon:t.props.icon,reason:t.removalReason,status:e}}function mi(t,e,n=!1){return b.isValidElement(t)&&!wt(t.type)?b.cloneElement(t,{closeToast:e.closeToast,toastProps:e,data:e.data,isPaused:n}):lt(t)?t({closeToast:e.closeToast,toastProps:e,data:e.data,isPaused:n}):t}function hr({closeToast:t,theme:e,ariaLabel:n="close"}){return L.createElement("button",{className:`Toastify__close-button Toastify__close-button--${e}`,type:"button",onClick:s=>{s.stopPropagation(),t(!0)},"aria-label":n},L.createElement("svg",{"aria-hidden":"true",viewBox:"0 0 14 16"},L.createElement("path",{fillRule:"evenodd",d:"M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z"})))}function dr({delay:t,isRunning:e,closeToast:n,type:s="default",hide:i,className:r,controlledProgress:o,progress:a,rtl:l,isIn:c,theme:u}){let f=i||o&&a===0,h={animationDuration:`${t}ms`,animationPlayState:e?"running":"paused"};o&&(h.transform=`scaleX(${a})`);let d=xt("Toastify__progress-bar",o?"Toastify__progress-bar--controlled":"Toastify__progress-bar--animated",`Toastify__progress-bar-theme--${u}`,`Toastify__progress-bar--${s}`,{"Toastify__progress-bar--rtl":l}),p=lt(r)?r({rtl:l,type:s,defaultClassName:d}):xt(d,r),y={[o&&a>=1?"onTransitionEnd":"onAnimationEnd"]:o&&a<1?null:()=>{c&&n()}};return L.createElement("div",{className:"Toastify__progress-bar--wrp","data-hidden":f},L.createElement("div",{className:`Toastify__progress-bar--bg Toastify__progress-bar-theme--${u} Toastify__progress-bar--${s}`}),L.createElement("div",{role:"progressbar","aria-hidden":f?"true":"false","aria-label":"notification timer","aria-valuenow":o?Math.round(a*100):void 0,"aria-valuemin":0,"aria-valuemax":100,className:p,style:h,...y}))}var pr=1,yi=()=>`${pr++}`;function mr(t,e,n){let s=1,i=0,r=[],o=[],a=e,l=new Map,c=new Set,u=v=>(c.add(v),()=>c.delete(v)),f=()=>{o=Array.from(l.values()),c.forEach(v=>v())},h=({containerId:v,toastId:x,updateId:T})=>{let _=v?v!==t:t!==1,C=l.has(x)&&T==null;return _||C},d=(v,x)=>{l.forEach(T=>{var _;(x==null||x===T.props.toastId)&&((_=T.toggle)==null||_.call(T,v))})},p=v=>{var x,T;v.isActive&&((T=(x=v.props)==null?void 0:x.onClose)==null||T.call(x,v.removalReason),v.isActive=!1,n(Yn(v,"removed")))},y=v=>{if(v==null)l.forEach(p);else{let x=l.get(v);x&&p(x)}f()},m=()=>{i-=r.length,r=[]},g=v=>{var x,T;let{toastId:_,updateId:C}=v.props,k=C==null;v.staleId&&l.delete(v.staleId),v.isActive=!0,l.set(_,v),f(),n(Yn(v,k?"added":"updated")),k&&((T=(x=v.props).onOpen)==null||T.call(x))};return{id:t,props:a,observe:u,toggle:d,removeToast:y,toasts:l,clearQueue:m,buildToast:(v,x)=>{if(h(x))return;let{toastId:T,updateId:_,data:C,staleId:k,delay:w}=x,A=_==null;A&&i++;let P={...a,style:a.toastStyle,key:s++,...Object.fromEntries(Object.entries(x).filter(([I,j])=>j!=null)),toastId:T,updateId:_,data:C,isIn:!1,className:He(x.className||a.toastClassName),progressClassName:He(x.progressClassName||a.progressClassName),autoClose:x.isLoading?!1:cr(x.autoClose,a.autoClose),closeToast(I){let j=l.get(T);j&&(j.removalReason=I,y(T))},deleteToast(){if(l.get(T)!=null){if(l.delete(T),i--,i<0&&(i=0),r.length>0){g(r.shift());return}f()}}};P.closeButton=a.closeButton,x.closeButton===!1||We(x.closeButton)?P.closeButton=x.closeButton:x.closeButton===!0&&(P.closeButton=We(a.closeButton)?a.closeButton:!0);let E={content:v,props:P,staleId:k};a.limit&&a.limit>0&&i>a.limit&&A?r.push(E):Ht(w)?setTimeout(()=>{g(E)},w):g(E)},setProps(v){a=v},setToggle:(v,x)=>{let T=l.get(v);T&&(T.toggle=x)},isToastActive:v=>{var x;return(x=l.get(v))==null?void 0:x.isActive},getSnapshot:()=>o}}var U=new Map,Ft=[],Ke=new Set,yr=t=>Ke.forEach(e=>e(t)),gi=()=>U.size>0;function gr(){Ft.forEach(t=>xi(t.content,t.options)),Ft=[]}var vr=(t,{containerId:e})=>{var n;return(n=U.get(e||1))==null?void 0:n.toasts.get(t)};function vi(t,e){var n;if(e)return!!((n=U.get(e))!=null&&n.isToastActive(t));let s=!1;return U.forEach(i=>{i.isToastActive(t)&&(s=!0)}),s}function xr(t){if(!gi()){Ft=Ft.filter(e=>t!=null&&e.options.toastId!==t);return}if(t==null||lr(t))U.forEach(e=>{e.removeToast(t)});else if(t&&("containerId"in t||"id"in t)){let e=U.get(t.containerId);e?e.removeToast(t.id):U.forEach(n=>{n.removeToast(t.id)})}}var Tr=(t={})=>{U.forEach(e=>{e.props.limit&&(!t.containerId||e.id===t.containerId)&&e.clearQueue()})};function xi(t,e){We(t)&&(gi()||Ft.push({content:t,options:e}),U.forEach(n=>{n.buildToast(t,e)}))}function br(t){var e;(e=U.get(t.containerId||1))==null||e.setToggle(t.id,t.fn)}function Ti(t,e){U.forEach(n=>{(e==null||!(e!=null&&e.containerId)||(e==null?void 0:e.containerId)===n.id)&&n.toggle(t,e==null?void 0:e.id)})}function wr(t){let e=t.containerId||1;return{subscribe(n){let s=mr(e,t,yr);U.set(e,s);let i=s.observe(n);return gr(),()=>{i(),U.delete(e)}},setProps(n){var s;(s=U.get(e))==null||s.setProps(n)},getSnapshot(){var n;return(n=U.get(e))==null?void 0:n.getSnapshot()}}}function kr(t){return Ke.add(t),()=>{Ke.delete(t)}}function _r(t){return t&&(wt(t.toastId)||Ht(t.toastId))?t.toastId:yi()}function Wt(t,e){return xi(t,e),e.toastId}function Te(t,e){return{...e,type:e&&e.type||t,toastId:_r(e)}}function be(t){return(e,n)=>Wt(e,Te(t,n))}function V(t,e){return Wt(t,Te("default",e))}V.loading=(t,e)=>Wt(t,Te("default",{isLoading:!0,autoClose:!1,closeOnClick:!1,closeButton:!1,draggable:!1,...e}));function Sr(t,{pending:e,error:n,success:s},i){let r;e&&(r=wt(e)?V.loading(e,i):V.loading(e.render,{...i,...e}));let o={isLoading:null,autoClose:null,closeOnClick:null,closeButton:null,draggable:null},a=(c,u,f)=>{if(u==null){V.dismiss(r);return}let h={type:c,...o,...i,data:f},d=wt(u)?{render:u}:u;return r?V.update(r,{...h,...d}):V(d.render,{...h,...d}),f},l=lt(t)?t():t;return l.then(c=>a("success",s,c)).catch(c=>a("error",n,c)),l}V.promise=Sr;V.success=be("success");V.info=be("info");V.error=be("error");V.warning=be("warning");V.warn=V.warning;V.dark=(t,e)=>Wt(t,Te("default",{theme:"dark",...e}));function Mr(t){xr(t)}V.dismiss=Mr;V.clearWaitingQueue=Tr;V.isActive=vi;V.update=(t,e={})=>{let n=vr(t,e);if(n){let{props:s,content:i}=n,r={delay:100,...s,...e,toastId:e.toastId||t,updateId:yi()};r.toastId!==t&&(r.staleId=t);let o=r.render||i;delete r.render,Wt(o,r)}};V.done=t=>{V.update(t,{progress:1})};V.onChange=kr;V.play=t=>Ti(!0,t);V.pause=t=>Ti(!1,t);function Pr(t){var e;let{subscribe:n,getSnapshot:s,setProps:i}=b.useRef(wr(t)).current;i(t);let r=(e=b.useSyncExternalStore(n,s,s))==null?void 0:e.slice();function o(a){if(!r)return[];let l=new Map;return t.newestOnTop&&r.reverse(),r.forEach(c=>{let{position:u}=c.props;l.has(u)||l.set(u,[]),l.get(u).push(c)}),Array.from(l,c=>a(c[0],c[1]))}return{getToastToRender:o,isToastActive:vi,count:r==null?void 0:r.length}}function Ar(t){let[e,n]=b.useState(!1),[s,i]=b.useState(!1),r=b.useRef(null),o=b.useRef({start:0,delta:0,removalDistance:0,canCloseOnClick:!0,canDrag:!1,didMove:!1}).current,{autoClose:a,pauseOnHover:l,closeToast:c,onClick:u,closeOnClick:f}=t;br({id:t.toastId,containerId:t.containerId,fn:n}),b.useEffect(()=>{if(t.pauseOnFocusLoss)return h(),()=>{d()}},[t.pauseOnFocusLoss]);function h(){document.hasFocus()||g(),window.addEventListener("focus",m),window.addEventListener("blur",g)}function d(){window.removeEventListener("focus",m),window.removeEventListener("blur",g)}function p(k){if(t.draggable===!0||t.draggable===k.pointerType){v();let w=r.current;o.canCloseOnClick=!0,o.canDrag=!0,w.style.transition="none",t.draggableDirection==="x"?(o.start=k.clientX,o.removalDistance=w.offsetWidth*(t.draggablePercent/100)):(o.start=k.clientY,o.removalDistance=w.offsetHeight*(t.draggablePercent===80?t.draggablePercent*1.5:t.draggablePercent)/100)}}function y(k){let{top:w,bottom:A,left:P,right:E}=r.current.getBoundingClientRect();k.pointerType==="mouse"&&t.pauseOnHover&&k.clientX>=P&&k.clientX<=E&&k.clientY>=w&&k.clientY<=A?g():m()}function m(){n(!0)}function g(){n(!1)}function v(){o.didMove=!1,document.addEventListener("pointermove",T),document.addEventListener("pointerup",_)}function x(){document.removeEventListener("pointermove",T),document.removeEventListener("pointerup",_)}function T(k){let w=r.current;if(o.canDrag&&w){o.didMove=!0,e&&g(),t.draggableDirection==="x"?o.delta=k.clientX-o.start:o.delta=k.clientY-o.start,o.start!==k.clientX&&(o.canCloseOnClick=!1);let A=t.draggableDirection==="x"?`${o.delta}px, var(--y)`:`0, calc(${o.delta}px + var(--y))`;w.style.transform=`translate3d(${A},0)`,w.style.opacity=`${1-Math.abs(o.delta/o.removalDistance)}`}}function _(){x();let k=r.current;if(o.canDrag&&o.didMove&&k){if(o.canDrag=!1,Math.abs(o.delta)>o.removalDistance){i(!0),t.closeToast(!0),t.collapseAll();return}k.style.transition="transform 0.2s, opacity 0.2s",k.style.removeProperty("transform"),k.style.removeProperty("opacity")}}let C={onPointerDown:p,onPointerUp:y};return a&&l&&(C.onMouseEnter=g,t.stacked||(C.onMouseLeave=m)),f&&(C.onClick=k=>{u&&u(k),o.canCloseOnClick&&c(!0)}),{playToast:m,pauseToast:g,isRunning:e,preventExitTransition:s,toastRef:r,eventHandlers:C}}var bi=typeof window<"u"?b.useLayoutEffect:b.useEffect,we=({theme:t,type:e,isLoading:n,...s})=>L.createElement("svg",{viewBox:"0 0 24 24",width:"100%",height:"100%",fill:t==="colored"?"currentColor":`var(--toastify-icon-color-${e})`,...s});function Cr(t){return L.createElement(we,{...t},L.createElement("path",{d:"M23.32 17.191L15.438 2.184C14.728.833 13.416 0 11.996 0c-1.42 0-2.733.833-3.443 2.184L.533 17.448a4.744 4.744 0 000 4.368C1.243 23.167 2.555 24 3.975 24h16.05C22.22 24 24 22.044 24 19.632c0-.904-.251-1.746-.68-2.44zm-9.622 1.46c0 1.033-.724 1.823-1.698 1.823s-1.698-.79-1.698-1.822v-.043c0-1.028.724-1.822 1.698-1.822s1.698.79 1.698 1.822v.043zm.039-12.285l-.84 8.06c-.057.581-.408.943-.897.943-.49 0-.84-.367-.896-.942l-.84-8.065c-.057-.624.25-1.095.779-1.095h1.91c.528.005.84.476.784 1.1z"}))}function Er(t){return L.createElement(we,{...t},L.createElement("path",{d:"M12 0a12 12 0 1012 12A12.013 12.013 0 0012 0zm.25 5a1.5 1.5 0 11-1.5 1.5 1.5 1.5 0 011.5-1.5zm2.25 13.5h-4a1 1 0 010-2h.75a.25.25 0 00.25-.25v-4.5a.25.25 0 00-.25-.25h-.75a1 1 0 010-2h1a2 2 0 012 2v4.75a.25.25 0 00.25.25h.75a1 1 0 110 2z"}))}function Vr(t){return L.createElement(we,{...t},L.createElement("path",{d:"M12 0a12 12 0 1012 12A12.014 12.014 0 0012 0zm6.927 8.2l-6.845 9.289a1.011 1.011 0 01-1.43.188l-4.888-3.908a1 1 0 111.25-1.562l4.076 3.261 6.227-8.451a1 1 0 111.61 1.183z"}))}function Dr(t){return L.createElement(we,{...t},L.createElement("path",{d:"M11.983 0a12.206 12.206 0 00-8.51 3.653A11.8 11.8 0 000 12.207 11.779 11.779 0 0011.8 24h.214A12.111 12.111 0 0024 11.791 11.766 11.766 0 0011.983 0zM10.5 16.542a1.476 1.476 0 011.449-1.53h.027a1.527 1.527 0 011.523 1.47 1.475 1.475 0 01-1.449 1.53h-.027a1.529 1.529 0 01-1.523-1.47zM11 12.5v-6a1 1 0 012 0v6a1 1 0 11-2 0z"}))}function Rr(){return L.createElement("div",{className:"Toastify__spinner"})}var Ge={info:Er,warning:Cr,success:Vr,error:Dr,spinner:Rr},Lr=t=>t in Ge;function Ir({theme:t,type:e,isLoading:n,icon:s}){let i=null,r={theme:t,type:e};return s===!1||(lt(s)?i=s({...r,isLoading:n}):b.isValidElement(s)?i=b.cloneElement(s,r):n?i=Ge.spinner():Lr(e)&&(i=Ge[e](r))),i}var Br=t=>{let{isRunning:e,preventExitTransition:n,toastRef:s,eventHandlers:i,playToast:r}=Ar(t),{closeButton:o,children:a,autoClose:l,onClick:c,type:u,hideProgressBar:f,closeToast:h,transition:d,position:p,className:y,style:m,progressClassName:g,updateId:v,role:x,progress:T,rtl:_,toastId:C,deleteToast:k,isIn:w,isLoading:A,closeOnClick:P,theme:E,ariaLabel:I}=t,j=xt("Toastify__toast",`Toastify__toast-theme--${E}`,`Toastify__toast--${u}`,{"Toastify__toast--rtl":_},{"Toastify__toast--close-on-click":P}),q=lt(y)?y({rtl:_,position:p,type:u,defaultClassName:j}):xt(j,y),X=Ir(t),K=!!T||!l,Yt={closeToast:h,type:u,theme:E},B=null;return o===!1||(lt(o)?B=o(Yt):b.isValidElement(o)?B=b.cloneElement(o,Yt):B=hr(Yt)),L.createElement(d,{isIn:w,done:k,position:p,preventExitTransition:n,nodeRef:s,playToast:r},L.createElement("div",{id:C,tabIndex:0,onClick:c,"data-in":w,className:q,...i,style:m,ref:s,...w&&{role:x,"aria-label":I}},X!=null&&L.createElement("div",{className:xt("Toastify__toast-icon",{"Toastify--animate-icon Toastify__zoom-enter":!A})},X),mi(a,t,!e),B,!t.customProgressBar&&L.createElement(dr,{...v&&!K?{key:`p-${v}`}:{},rtl:_,theme:E,delay:l,isRunning:e,isIn:w,closeToast:h,hide:f,type:u,className:g,controlledProgress:K,progress:T||0})))},Or=(t,e=!1)=>({enter:`Toastify--animate Toastify__${t}-enter`,exit:`Toastify--animate Toastify__${t}-exit`,appendPosition:e}),Nr=fr(Or("bounce",!0)),Fr={position:"top-right",transition:Nr,autoClose:5e3,closeButton:!0,pauseOnHover:!0,pauseOnFocusLoss:!0,draggable:"touch",draggablePercent:80,draggableDirection:"x",role:"alert",theme:"light","aria-label":"Notifications Alt+T",hotKeys:t=>t.altKey&&t.code==="KeyT"};function jr(t){let e={...Fr,...t},n=t.stacked,[s,i]=b.useState(!0),r=b.useRef(null),{getToastToRender:o,isToastActive:a,count:l}=Pr(e),{className:c,style:u,rtl:f,containerId:h,hotKeys:d}=e;function p(m){let g=xt("Toastify__toast-container",`Toastify__toast-container--${m}`,{"Toastify__toast-container--rtl":f});return lt(c)?c({position:m,rtl:f,defaultClassName:g}):xt(g,He(c))}function y(){n&&(i(!0),V.play())}return bi(()=>{var m;if(n){let g=r.current.querySelectorAll('[data-in="true"]'),v=12,x=(m=e.position)==null?void 0:m.includes("top"),T=0,_=0;Array.from(g).reverse().forEach((C,k)=>{let w=C;w.classList.add("Toastify__toast--stacked"),k>0&&(w.dataset.collapsed=`${s}`),w.dataset.pos||(w.dataset.pos=x?"top":"bot");let A=T*(s?.2:1)+(s?0:v*k),P=Math.max(.5,1-(s?_:0));w.style.setProperty("--y",`${x?A:A*-1}px`),w.style.setProperty("--g",`${v}`),w.style.setProperty("--s",`${P}`),T+=w.offsetHeight,_+=.025})}},[s,l,n]),b.useEffect(()=>{function m(g){var v;let x=r.current;d(g)&&((v=x==null?void 0:x.querySelector('[tabIndex="0"]'))==null||v.focus(),i(!1),V.pause()),g.key==="Escape"&&(document.activeElement===x||x!=null&&x.contains(document.activeElement))&&(i(!0),V.play())}return document.addEventListener("keydown",m),()=>{document.removeEventListener("keydown",m)}},[d]),L.createElement("section",{ref:r,className:"Toastify",id:h,onMouseEnter:()=>{n&&(i(!1),V.pause())},onMouseLeave:y,"aria-live":"polite","aria-atomic":"false","aria-relevant":"additions text","aria-label":e["aria-label"]},o((m,g)=>{let v=g.length?{...u}:{...u,pointerEvents:"none"};return L.createElement("div",{tabIndex:-1,className:p(m),"data-stacked":n,style:v,key:`c-${m}`},g.map(({content:x,props:T})=>L.createElement(Br,{...T,stacked:n,collapseAll:y,isIn:a(T.toastId,T.containerId),key:`t-${T.key}`},x)))}))}var $r=`:root {
  --toastify-color-light: #fff;
  --toastify-color-dark: #121212;
  --toastify-color-info: #3498db;
  --toastify-color-success: #07bc0c;
  --toastify-color-warning: #f1c40f;
  --toastify-color-error: hsl(6, 78%, 57%);
  --toastify-color-transparent: rgba(255, 255, 255, 0.7);

  --toastify-icon-color-info: var(--toastify-color-info);
  --toastify-icon-color-success: var(--toastify-color-success);
  --toastify-icon-color-warning: var(--toastify-color-warning);
  --toastify-icon-color-error: var(--toastify-color-error);

  --toastify-container-width: fit-content;
  --toastify-toast-width: 320px;
  --toastify-toast-offset: 16px;
  --toastify-toast-top: max(var(--toastify-toast-offset), env(safe-area-inset-top));
  --toastify-toast-right: max(var(--toastify-toast-offset), env(safe-area-inset-right));
  --toastify-toast-left: max(var(--toastify-toast-offset), env(safe-area-inset-left));
  --toastify-toast-bottom: max(var(--toastify-toast-offset), env(safe-area-inset-bottom));
  --toastify-toast-background: #fff;
  --toastify-toast-padding: 14px;
  --toastify-toast-min-height: 64px;
  --toastify-toast-max-height: 800px;
  --toastify-toast-bd-radius: 6px;
  --toastify-toast-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  --toastify-font-family: sans-serif;
  --toastify-z-index: 9999;
  --toastify-text-color-light: #757575;
  --toastify-text-color-dark: #fff;

  /* Used only for colored theme */
  --toastify-text-color-info: #fff;
  --toastify-text-color-success: #fff;
  --toastify-text-color-warning: #fff;
  --toastify-text-color-error: #fff;

  --toastify-spinner-color: #616161;
  --toastify-spinner-color-empty-area: #e0e0e0;
  --toastify-color-progress-light: linear-gradient(to right, #4cd964, #5ac8fa, #007aff, #34aadc, #5856d6, #ff2d55);
  --toastify-color-progress-dark: #bb86fc;
  --toastify-color-progress-info: var(--toastify-color-info);
  --toastify-color-progress-success: var(--toastify-color-success);
  --toastify-color-progress-warning: var(--toastify-color-warning);
  --toastify-color-progress-error: var(--toastify-color-error);
  /* used to control the opacity of the progress trail */
  --toastify-color-progress-bgo: 0.2;
}

.Toastify__toast-container {
  z-index: var(--toastify-z-index);
  -webkit-transform: translate3d(0, 0, var(--toastify-z-index));
  position: fixed;
  width: var(--toastify-container-width);
  box-sizing: border-box;
  color: #fff;
  display: flex;
  flex-direction: column;
}

.Toastify__toast-container--top-left {
  top: var(--toastify-toast-top);
  left: var(--toastify-toast-left);
}
.Toastify__toast-container--top-center {
  top: var(--toastify-toast-top);
  left: 50%;
  transform: translateX(-50%);
  align-items: center;
}
.Toastify__toast-container--top-right {
  top: var(--toastify-toast-top);
  right: var(--toastify-toast-right);
  align-items: end;
}
.Toastify__toast-container--bottom-left {
  bottom: var(--toastify-toast-bottom);
  left: var(--toastify-toast-left);
}
.Toastify__toast-container--bottom-center {
  bottom: var(--toastify-toast-bottom);
  left: 50%;
  transform: translateX(-50%);
  align-items: center;
}
.Toastify__toast-container--bottom-right {
  bottom: var(--toastify-toast-bottom);
  right: var(--toastify-toast-right);
  align-items: end;
}

.Toastify__toast {
  --y: 0px;
  position: relative;
  touch-action: none;
  width: var(--toastify-toast-width);
  min-height: var(--toastify-toast-min-height);
  box-sizing: border-box;
  margin-bottom: 1rem;
  padding: var(--toastify-toast-padding);
  border-radius: var(--toastify-toast-bd-radius);
  box-shadow: var(--toastify-toast-shadow);
  max-height: var(--toastify-toast-max-height);
  font-family: var(--toastify-font-family);
  /* webkit only issue #791 */
  z-index: 0;
  /* inner swag */
  display: flex;
  flex: 1 auto;
  align-items: center;
  word-break: break-word;
}

@media only screen and (max-width: 480px) {
  .Toastify__toast-container {
    width: 100vw;
    left: env(safe-area-inset-left);
    margin: 0;
  }
  .Toastify__toast-container--top-left,
  .Toastify__toast-container--top-center,
  .Toastify__toast-container--top-right {
    top: env(safe-area-inset-top);
    transform: translateX(0);
  }
  .Toastify__toast-container--bottom-left,
  .Toastify__toast-container--bottom-center,
  .Toastify__toast-container--bottom-right {
    bottom: env(safe-area-inset-bottom);
    transform: translateX(0);
  }
  .Toastify__toast-container--rtl {
    right: env(safe-area-inset-right);
    left: initial;
  }
  .Toastify__toast {
    --toastify-toast-width: 100%;
    margin-bottom: 0;
    border-radius: 0;
  }
}

.Toastify__toast-container[data-stacked='true'] {
  width: var(--toastify-toast-width);
}

@media only screen and (max-width: 480px) {
  .Toastify__toast-container[data-stacked='true'] {
    width: 100vw;
  }
}

.Toastify__toast--stacked {
  position: absolute;
  width: 100%;
  transform: translate3d(0, var(--y), 0) scale(var(--s));
  transition: transform 0.3s;
}

.Toastify__toast--stacked[data-collapsed] .Toastify__toast-body,
.Toastify__toast--stacked[data-collapsed] .Toastify__close-button {
  transition: opacity 0.1s;
}

.Toastify__toast--stacked[data-collapsed='false'] {
  overflow: visible;
}

.Toastify__toast--stacked[data-collapsed='true']:not(:last-child) > * {
  opacity: 0;
}

.Toastify__toast--stacked:after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: calc(var(--g) * 1px);
  bottom: 100%;
}

.Toastify__toast--stacked[data-pos='top'] {
  top: 0;
}

.Toastify__toast--stacked[data-pos='bot'] {
  bottom: 0;
}

.Toastify__toast--stacked[data-pos='bot'].Toastify__toast--stacked:before {
  transform-origin: top;
}

.Toastify__toast--stacked[data-pos='top'].Toastify__toast--stacked:before {
  transform-origin: bottom;
}

.Toastify__toast--stacked:before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  transform: scaleY(3);
  z-index: -1;
}

.Toastify__toast--rtl {
  direction: rtl;
}

.Toastify__toast--close-on-click {
  cursor: pointer;
}

.Toastify__toast-icon {
  margin-inline-end: 10px;
  width: 22px;
  flex-shrink: 0;
  display: flex;
}

.Toastify--animate {
  animation-fill-mode: both;
  animation-duration: 0.5s;
}

.Toastify--animate-icon {
  animation-fill-mode: both;
  animation-duration: 0.3s;
}

.Toastify__toast-theme--dark {
  background: var(--toastify-color-dark);
  color: var(--toastify-text-color-dark);
}

.Toastify__toast-theme--light {
  background: var(--toastify-color-light);
  color: var(--toastify-text-color-light);
}

.Toastify__toast-theme--colored.Toastify__toast--default {
  background: var(--toastify-color-light);
  color: var(--toastify-text-color-light);
}

.Toastify__toast-theme--colored.Toastify__toast--info {
  color: var(--toastify-text-color-info);
  background: var(--toastify-color-info);
}

.Toastify__toast-theme--colored.Toastify__toast--success {
  color: var(--toastify-text-color-success);
  background: var(--toastify-color-success);
}

.Toastify__toast-theme--colored.Toastify__toast--warning {
  color: var(--toastify-text-color-warning);
  background: var(--toastify-color-warning);
}

.Toastify__toast-theme--colored.Toastify__toast--error {
  color: var(--toastify-text-color-error);
  background: var(--toastify-color-error);
}

.Toastify__progress-bar-theme--light {
  background: var(--toastify-color-progress-light);
}

.Toastify__progress-bar-theme--dark {
  background: var(--toastify-color-progress-dark);
}

.Toastify__progress-bar--info {
  background: var(--toastify-color-progress-info);
}

.Toastify__progress-bar--success {
  background: var(--toastify-color-progress-success);
}

.Toastify__progress-bar--warning {
  background: var(--toastify-color-progress-warning);
}

.Toastify__progress-bar--error {
  background: var(--toastify-color-progress-error);
}

.Toastify__progress-bar-theme--colored.Toastify__progress-bar--info,
.Toastify__progress-bar-theme--colored.Toastify__progress-bar--success,
.Toastify__progress-bar-theme--colored.Toastify__progress-bar--warning,
.Toastify__progress-bar-theme--colored.Toastify__progress-bar--error {
  background: var(--toastify-color-transparent);
}

.Toastify__close-button {
  color: #fff;
  position: absolute;
  top: 6px;
  right: 6px;
  background: transparent;
  outline: none;
  border: none;
  padding: 0;
  cursor: pointer;
  opacity: 0.7;
  transition: 0.3s ease;
  z-index: 1;
}

.Toastify__toast--rtl .Toastify__close-button {
  left: 6px;
  right: unset;
}

.Toastify__close-button--light {
  color: #000;
  opacity: 0.3;
}

.Toastify__close-button > svg {
  fill: currentColor;
  height: 16px;
  width: 14px;
}

.Toastify__close-button:hover,
.Toastify__close-button:focus {
  opacity: 1;
}

@keyframes Toastify__trackProgress {
  0% {
    transform: scaleX(1);
  }
  100% {
    transform: scaleX(0);
  }
}

.Toastify__progress-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  opacity: 0.7;
  transform-origin: left;
}

.Toastify__progress-bar--animated {
  animation: Toastify__trackProgress linear 1 forwards;
}

.Toastify__progress-bar--controlled {
  transition: transform 0.2s;
}

.Toastify__progress-bar--rtl {
  right: 0;
  left: initial;
  transform-origin: right;
  border-bottom-left-radius: initial;
}

.Toastify__progress-bar--wrp {
  position: absolute;
  overflow: hidden;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 5px;
  border-bottom-left-radius: var(--toastify-toast-bd-radius);
  border-bottom-right-radius: var(--toastify-toast-bd-radius);
}

.Toastify__progress-bar--wrp[data-hidden='true'] {
  opacity: 0;
}

.Toastify__progress-bar--bg {
  opacity: var(--toastify-color-progress-bgo);
  width: 100%;
  height: 100%;
}

.Toastify__spinner {
  width: 20px;
  height: 20px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: var(--toastify-spinner-color-empty-area);
  border-right-color: var(--toastify-spinner-color);
  animation: Toastify__spin 0.65s linear infinite;
}

@keyframes Toastify__bounceInRight {
  from,
  60%,
  75%,
  90%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  from {
    opacity: 0;
    transform: translate3d(3000px, 0, 0);
  }
  60% {
    opacity: 1;
    transform: translate3d(-25px, 0, 0);
  }
  75% {
    transform: translate3d(10px, 0, 0);
  }
  90% {
    transform: translate3d(-5px, 0, 0);
  }
  to {
    transform: none;
  }
}

@keyframes Toastify__bounceOutRight {
  20% {
    opacity: 1;
    transform: translate3d(-20px, var(--y), 0);
  }
  to {
    opacity: 0;
    transform: translate3d(2000px, var(--y), 0);
  }
}

@keyframes Toastify__bounceInLeft {
  from,
  60%,
  75%,
  90%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  0% {
    opacity: 0;
    transform: translate3d(-3000px, 0, 0);
  }
  60% {
    opacity: 1;
    transform: translate3d(25px, 0, 0);
  }
  75% {
    transform: translate3d(-10px, 0, 0);
  }
  90% {
    transform: translate3d(5px, 0, 0);
  }
  to {
    transform: none;
  }
}

@keyframes Toastify__bounceOutLeft {
  20% {
    opacity: 1;
    transform: translate3d(20px, var(--y), 0);
  }
  to {
    opacity: 0;
    transform: translate3d(-2000px, var(--y), 0);
  }
}

@keyframes Toastify__bounceInUp {
  from,
  60%,
  75%,
  90%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  from {
    opacity: 0;
    transform: translate3d(0, 3000px, 0);
  }
  60% {
    opacity: 1;
    transform: translate3d(0, -20px, 0);
  }
  75% {
    transform: translate3d(0, 10px, 0);
  }
  90% {
    transform: translate3d(0, -5px, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}

@keyframes Toastify__bounceOutUp {
  20% {
    transform: translate3d(0, calc(var(--y) - 10px), 0);
  }
  40%,
  45% {
    opacity: 1;
    transform: translate3d(0, calc(var(--y) + 20px), 0);
  }
  to {
    opacity: 0;
    transform: translate3d(0, -2000px, 0);
  }
}

@keyframes Toastify__bounceInDown {
  from,
  60%,
  75%,
  90%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }
  0% {
    opacity: 0;
    transform: translate3d(0, -3000px, 0);
  }
  60% {
    opacity: 1;
    transform: translate3d(0, 25px, 0);
  }
  75% {
    transform: translate3d(0, -10px, 0);
  }
  90% {
    transform: translate3d(0, 5px, 0);
  }
  to {
    transform: none;
  }
}

@keyframes Toastify__bounceOutDown {
  20% {
    transform: translate3d(0, calc(var(--y) - 10px), 0);
  }
  40%,
  45% {
    opacity: 1;
    transform: translate3d(0, calc(var(--y) + 20px), 0);
  }
  to {
    opacity: 0;
    transform: translate3d(0, 2000px, 0);
  }
}

.Toastify__bounce-enter--top-left,
.Toastify__bounce-enter--bottom-left {
  animation-name: Toastify__bounceInLeft;
}

.Toastify__bounce-enter--top-right,
.Toastify__bounce-enter--bottom-right {
  animation-name: Toastify__bounceInRight;
}

.Toastify__bounce-enter--top-center {
  animation-name: Toastify__bounceInDown;
}

.Toastify__bounce-enter--bottom-center {
  animation-name: Toastify__bounceInUp;
}

.Toastify__bounce-exit--top-left,
.Toastify__bounce-exit--bottom-left {
  animation-name: Toastify__bounceOutLeft;
}

.Toastify__bounce-exit--top-right,
.Toastify__bounce-exit--bottom-right {
  animation-name: Toastify__bounceOutRight;
}

.Toastify__bounce-exit--top-center {
  animation-name: Toastify__bounceOutUp;
}

.Toastify__bounce-exit--bottom-center {
  animation-name: Toastify__bounceOutDown;
}

@keyframes Toastify__zoomIn {
  from {
    opacity: 0;
    transform: scale3d(0.3, 0.3, 0.3);
  }
  50% {
    opacity: 1;
  }
}

@keyframes Toastify__zoomOut {
  from {
    opacity: 1;
  }
  50% {
    opacity: 0;
    transform: translate3d(0, var(--y), 0) scale3d(0.3, 0.3, 0.3);
  }
  to {
    opacity: 0;
  }
}

.Toastify__zoom-enter {
  animation-name: Toastify__zoomIn;
}

.Toastify__zoom-exit {
  animation-name: Toastify__zoomOut;
}

@keyframes Toastify__flipIn {
  from {
    transform: perspective(400px) rotate3d(1, 0, 0, 90deg);
    animation-timing-function: ease-in;
    opacity: 0;
  }
  40% {
    transform: perspective(400px) rotate3d(1, 0, 0, -20deg);
    animation-timing-function: ease-in;
  }
  60% {
    transform: perspective(400px) rotate3d(1, 0, 0, 10deg);
    opacity: 1;
  }
  80% {
    transform: perspective(400px) rotate3d(1, 0, 0, -5deg);
  }
  to {
    transform: perspective(400px);
  }
}

@keyframes Toastify__flipOut {
  from {
    transform: translate3d(0, var(--y), 0) perspective(400px);
  }
  30% {
    transform: translate3d(0, var(--y), 0) perspective(400px) rotate3d(1, 0, 0, -20deg);
    opacity: 1;
  }
  to {
    transform: translate3d(0, var(--y), 0) perspective(400px) rotate3d(1, 0, 0, 90deg);
    opacity: 0;
  }
}

.Toastify__flip-enter {
  animation-name: Toastify__flipIn;
}

.Toastify__flip-exit {
  animation-name: Toastify__flipOut;
}

@keyframes Toastify__slideInRight {
  from {
    transform: translate3d(110%, 0, 0);
    visibility: visible;
  }
  to {
    transform: translate3d(0, var(--y), 0);
  }
}

@keyframes Toastify__slideInLeft {
  from {
    transform: translate3d(-110%, 0, 0);
    visibility: visible;
  }
  to {
    transform: translate3d(0, var(--y), 0);
  }
}

@keyframes Toastify__slideInUp {
  from {
    transform: translate3d(0, 110%, 0);
    visibility: visible;
  }
  to {
    transform: translate3d(0, var(--y), 0);
  }
}

@keyframes Toastify__slideInDown {
  from {
    transform: translate3d(0, -110%, 0);
    visibility: visible;
  }
  to {
    transform: translate3d(0, var(--y), 0);
  }
}

@keyframes Toastify__slideOutRight {
  from {
    transform: translate3d(0, var(--y), 0);
  }
  to {
    visibility: hidden;
    transform: translate3d(110%, var(--y), 0);
  }
}

@keyframes Toastify__slideOutLeft {
  from {
    transform: translate3d(0, var(--y), 0);
  }
  to {
    visibility: hidden;
    transform: translate3d(-110%, var(--y), 0);
  }
}

@keyframes Toastify__slideOutDown {
  from {
    transform: translate3d(0, var(--y), 0);
  }
  to {
    visibility: hidden;
    transform: translate3d(0, 500px, 0);
  }
}

@keyframes Toastify__slideOutUp {
  from {
    transform: translate3d(0, var(--y), 0);
  }
  to {
    visibility: hidden;
    transform: translate3d(0, -500px, 0);
  }
}

.Toastify__slide-enter--top-left,
.Toastify__slide-enter--bottom-left {
  animation-name: Toastify__slideInLeft;
}

.Toastify__slide-enter--top-right,
.Toastify__slide-enter--bottom-right {
  animation-name: Toastify__slideInRight;
}

.Toastify__slide-enter--top-center {
  animation-name: Toastify__slideInDown;
}

.Toastify__slide-enter--bottom-center {
  animation-name: Toastify__slideInUp;
}

.Toastify__slide-exit--top-left,
.Toastify__slide-exit--bottom-left {
  animation-name: Toastify__slideOutLeft;
  animation-timing-function: ease-in;
  animation-duration: 0.3s;
}

.Toastify__slide-exit--top-right,
.Toastify__slide-exit--bottom-right {
  animation-name: Toastify__slideOutRight;
  animation-timing-function: ease-in;
  animation-duration: 0.3s;
}

.Toastify__slide-exit--top-center {
  animation-name: Toastify__slideOutUp;
  animation-timing-function: ease-in;
  animation-duration: 0.3s;
}

.Toastify__slide-exit--bottom-center {
  animation-name: Toastify__slideOutDown;
  animation-timing-function: ease-in;
  animation-duration: 0.3s;
}

@keyframes Toastify__spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
`,Zn=new Map,zr=(t,e)=>{bi(()=>{if(typeof document>"u")return;let n=document,s=Zn.get(n);if(s){e&&s.setAttribute("nonce",e);return}let i=n.createElement("style");i.textContent=t,e&&i.setAttribute("nonce",e),n.head.appendChild(i),Zn.set(n,i)},[e])};function nd(t){return zr($r,t.nonce),L.createElement(jr,{...t})}/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ur=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),wi=(...t)=>t.filter((e,n,s)=>!!e&&e.trim()!==""&&s.indexOf(e)===n).join(" ").trim();/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var Hr={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wr=b.forwardRef(({color:t="currentColor",size:e=24,strokeWidth:n=2,absoluteStrokeWidth:s,className:i="",children:r,iconNode:o,...a},l)=>b.createElement("svg",{ref:l,...Hr,width:e,height:e,stroke:t,strokeWidth:s?Number(n)*24/Number(e):n,className:wi("lucide",i),...a},[...o.map(([c,u])=>b.createElement(c,u)),...Array.isArray(r)?r:[r]]));/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S=(t,e)=>{const n=b.forwardRef(({className:s,...i},r)=>b.createElement(Wr,{ref:r,iconNode:e,className:wi(`lucide-${Ur(t)}`,s),...i}));return n.displayName=`${t}`,n};/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Kr=[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]],sd=S("ArrowLeft",Kr);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gr=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]],id=S("ArrowRight",Gr);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qr=[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],od=S("BadgeCheck",qr);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xr=[["path",{d:"M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",key:"3c2336"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"M9 9h.01",key:"1q5me6"}],["path",{d:"M15 15h.01",key:"lqbp3k"}]],rd=S("BadgePercent",Xr);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Yr=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m4.9 4.9 14.2 14.2",key:"1m5liu"}]],ad=S("Ban",Yr);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zr=[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]],ld=S("Check",Zr);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qr=[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]],cd=S("ChevronDown",Qr);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jr=[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]],ud=S("ChevronLeft",Jr);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ta=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],fd=S("ChevronRight",ta);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ea=[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]],hd=S("ChevronUp",ea);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const na=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],dd=S("CircleCheck",na);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sa=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],pd=S("Circle",sa);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ia=[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]],md=S("Download",ia);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oa=[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]],yd=S("EyeOff",oa);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ra=[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],gd=S("Eye",ra);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const aa=[["path",{d:"M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z",key:"1jg4f8"}]],vd=S("Facebook",aa);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const la=[["path",{d:"M6 3h12l4 6-10 13L2 9Z",key:"1pcd5k"}],["path",{d:"M11 3 8 9l4 13 4-13-3-6",key:"1fcu3u"}],["path",{d:"M2 9h20",key:"16fsjt"}]],xd=S("Gem",la);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ca=[["path",{d:"M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3",key:"1xhozi"}]],Td=S("Headphones",ca);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ua=[["path",{d:"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",key:"c3ymky"}]],bd=S("Heart",ua);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fa=[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"1d0kgt"}]],wd=S("House",fa);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ha=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]],kd=S("Image",ha);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const da=[["path",{d:"M6 3h12",key:"ggurg9"}],["path",{d:"M6 8h12",key:"6g4wlu"}],["path",{d:"m6 13 8.5 8",key:"u1kupk"}],["path",{d:"M6 13h3",key:"wdp6ag"}],["path",{d:"M9 13c6.667 0 6.667-10 0-10",key:"1nkvk2"}]],_d=S("IndianRupee",da);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pa=[["rect",{width:"20",height:"20",x:"2",y:"2",rx:"5",ry:"5",key:"2e1cvw"}],["path",{d:"M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z",key:"9exkf1"}],["line",{x1:"17.5",x2:"17.51",y1:"6.5",y2:"6.5",key:"r4j83e"}]],Sd=S("Instagram",pa);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ma=[["path",{d:"M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z",key:"1s6t7t"}],["circle",{cx:"16.5",cy:"7.5",r:".5",fill:"currentColor",key:"w0ekpg"}]],Md=S("KeyRound",ma);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ya=[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]],Pd=S("LayoutDashboard",ya);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ga=[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]],Ad=S("LoaderCircle",ga);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const va=[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]],Cd=S("LogOut",va);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xa=[["path",{d:"M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8",key:"12jkf8"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}],["path",{d:"m16 19 2 2 4-4",key:"1b14m6"}]],Ed=S("MailCheck",xa);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ta=[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]],Vd=S("Mail",Ta);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ba=[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]],Dd=S("MapPin",ba);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wa=[["line",{x1:"4",x2:"20",y1:"12",y2:"12",key:"1e0a9i"}],["line",{x1:"4",x2:"20",y1:"6",y2:"6",key:"1owob3"}],["line",{x1:"4",x2:"20",y1:"18",y2:"18",key:"yk5zj1"}]],Rd=S("Menu",wa);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ka=[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}],["path",{d:"M12 7v6",key:"lw1j43"}],["path",{d:"M9 10h6",key:"9gxzsh"}]],Ld=S("MessageSquarePlus",ka);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _a=[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}],["path",{d:"M13 8H7",key:"14i4kc"}],["path",{d:"M17 12H7",key:"16if0g"}]],Id=S("MessageSquareText",_a);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Sa=[["path",{d:"M5 12h14",key:"1ays0h"}]],Bd=S("Minus",Sa);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ma=[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]],Od=S("Moon",Ma);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pa=[["path",{d:"M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14",key:"e7tb2h"}],["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}],["polyline",{points:"3.29 7 12 12 20.71 7",key:"ousv84"}],["line",{x1:"12",x2:"12",y1:"22",y2:"12",key:"a4e8g8"}],["circle",{cx:"18.5",cy:"15.5",r:"2.5",key:"b5zd12"}],["path",{d:"M20.27 17.27 22 19",key:"1l4muz"}]],Nd=S("PackageSearch",Pa);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Aa=[["path",{d:"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",key:"1a0edw"}],["path",{d:"M12 22V12",key:"d0xqtd"}],["polyline",{points:"3.29 7 12 12 20.71 7",key:"ousv84"}],["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}]],Fd=S("Package",Aa);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ca=[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}],["path",{d:"m15 5 4 4",key:"1mk7zo"}]],jd=S("Pencil",Ca);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ea=[["path",{d:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",key:"foiqr5"}]],$d=S("Phone",Ea);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Va=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]],zd=S("Plus",Va);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Da=[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]],Ud=S("RefreshCw",Da);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ra=[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]],Hd=S("RotateCcw",Ra);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const La=[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]],Wd=S("Search",La);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ia=[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],Kd=S("Settings",Ia);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ba=[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],Gd=S("ShieldCheck",Ba);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Oa=[["path",{d:"M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z",key:"hou9p0"}],["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M16 10a4 4 0 0 1-8 0",key:"1ltviw"}]],qd=S("ShoppingBag",Oa);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Na=[["circle",{cx:"8",cy:"21",r:"1",key:"jimo8o"}],["circle",{cx:"19",cy:"21",r:"1",key:"13723u"}],["path",{d:"M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12",key:"9zh506"}]],Xd=S("ShoppingCart",Na);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Fa=[["line",{x1:"21",x2:"14",y1:"4",y2:"4",key:"obuewd"}],["line",{x1:"10",x2:"3",y1:"4",y2:"4",key:"1q6298"}],["line",{x1:"21",x2:"12",y1:"12",y2:"12",key:"1iu8h1"}],["line",{x1:"8",x2:"3",y1:"12",y2:"12",key:"ntss68"}],["line",{x1:"21",x2:"16",y1:"20",y2:"20",key:"14d8ph"}],["line",{x1:"12",x2:"3",y1:"20",y2:"20",key:"m0wm8r"}],["line",{x1:"14",x2:"14",y1:"2",y2:"6",key:"14e1ph"}],["line",{x1:"8",x2:"8",y1:"10",y2:"14",key:"1i6ji0"}],["line",{x1:"16",x2:"16",y1:"18",y2:"22",key:"1lctlv"}]],Yd=S("SlidersHorizontal",Fa);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ja=[["path",{d:"M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",key:"4pj2yx"}],["path",{d:"M20 3v4",key:"1olli1"}],["path",{d:"M22 5h-4",key:"1gvqau"}],["path",{d:"M4 17v2",key:"vumght"}],["path",{d:"M5 18H3",key:"zchphs"}]],Zd=S("Sparkles",ja);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $a=[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]],Qd=S("Star",$a);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const za=[["path",{d:"m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7",key:"ztvudi"}],["path",{d:"M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8",key:"1b2hhj"}],["path",{d:"M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4",key:"2ebpfo"}],["path",{d:"M2 7h20",key:"1fcdvo"}],["path",{d:"M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7",key:"6c3vgh"}]],Jd=S("Store",za);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ua=[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]],tp=S("Sun",Ua);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ha=[["path",{d:"M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",key:"vktsd0"}],["circle",{cx:"7.5",cy:"7.5",r:".5",fill:"currentColor",key:"kqv944"}]],ep=S("Tag",Ha);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wa=[["path",{d:"m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19",key:"1cbfv1"}],["path",{d:"M9.586 5.586A2 2 0 0 0 8.172 5H3a1 1 0 0 0-1 1v5.172a2 2 0 0 0 .586 1.414L8.29 18.29a2.426 2.426 0 0 0 3.42 0l3.58-3.58a2.426 2.426 0 0 0 0-3.42z",key:"135mg7"}],["circle",{cx:"6.5",cy:"9.5",r:".5",fill:"currentColor",key:"5pm5xn"}]],np=S("Tags",Wa);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ka=[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]],sp=S("Trash2",Ka);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ga=[["polyline",{points:"22 7 13.5 15.5 8.5 10.5 2 17",key:"126l90"}],["polyline",{points:"16 7 22 7 22 13",key:"kwv8wd"}]],ip=S("TrendingUp",Ga);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qa=[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]],op=S("TriangleAlert",qa);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xa=[["path",{d:"M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2",key:"wrbu53"}],["path",{d:"M15 18H9",key:"1lyqi6"}],["path",{d:"M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14",key:"lysw3i"}],["circle",{cx:"17",cy:"18",r:"2",key:"332jqn"}],["circle",{cx:"7",cy:"18",r:"2",key:"19iecd"}]],rp=S("Truck",Xa);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ya=[["path",{d:"M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",key:"pff0z6"}]],ap=S("Twitter",Ya);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Za=[["circle",{cx:"18",cy:"15",r:"3",key:"gjjjvw"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M10 15H6a4 4 0 0 0-4 4v2",key:"1nfge6"}],["path",{d:"m21.7 16.4-.9-.3",key:"12j9ji"}],["path",{d:"m15.2 13.9-.9-.3",key:"1fdjdi"}],["path",{d:"m16.6 18.7.3-.9",key:"heedtr"}],["path",{d:"m19.1 12.2.3-.9",key:"1af3ki"}],["path",{d:"m19.6 18.7-.4-1",key:"1x9vze"}],["path",{d:"m16.8 12.3-.4-1",key:"vqeiwj"}],["path",{d:"m14.3 16.6 1-.4",key:"1qlj63"}],["path",{d:"m20.7 13.8 1-.4",key:"1v5t8k"}]],lp=S("UserCog",Za);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qa=[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]],cp=S("User",Qa);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ja=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]],up=S("Users",Ja);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tl=[["path",{d:"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",key:"18etb6"}],["path",{d:"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",key:"xoc0q4"}]],fp=S("Wallet",tl);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const el=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],hp=S("X",el);/**
 * @license lucide-react v0.474.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nl=[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]],dp=S("Zap",nl),Tn=b.createContext({});function bn(t){const e=b.useRef(null);return e.current===null&&(e.current=t()),e.current}const sl=typeof window<"u",wn=sl?b.useLayoutEffect:b.useEffect,ke=b.createContext(null);function kn(t,e){t.indexOf(e)===-1&&t.push(e)}function ue(t,e){const n=t.indexOf(e);n>-1&&t.splice(n,1)}const ot=(t,e,n)=>n>e?e:n<t?t:n;let _n=()=>{};const ft={},ki=t=>/^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(t),_i=t=>typeof t=="object"&&t!==null,Si=t=>/^0[^.\s]+$/u.test(t);function Mi(t){let e;return()=>(e===void 0&&(e=t()),e)}const Q=t=>t,Kt=(...t)=>t.reduce((e,n)=>s=>n(e(s))),jt=(t,e,n)=>{const s=e-t;return s?(n-t)/s:1};class Sn{constructor(){this.subscriptions=[]}add(e){return kn(this.subscriptions,e),()=>ue(this.subscriptions,e)}notify(e,n,s){const i=this.subscriptions.length;if(i)if(i===1)this.subscriptions[0](e,n,s);else for(let r=0;r<i;r++){const o=this.subscriptions[r];o&&o(e,n,s)}}getSize(){return this.subscriptions.length}clear(){this.subscriptions.length=0}}const G=t=>t*1e3,Z=t=>t/1e3,Pi=(t,e)=>e?t*(1e3/e):0,Ai=(t,e,n)=>(((1-3*n+3*e)*t+(3*n-6*e))*t+3*e)*t,il=1e-7,ol=12;function rl(t,e,n,s,i){let r,o,a=0;do o=e+(n-e)/2,r=Ai(o,s,i)-t,r>0?n=o:e=o;while(Math.abs(r)>il&&++a<ol);return o}function Gt(t,e,n,s){if(t===e&&n===s)return Q;const i=r=>rl(r,0,1,t,n);return r=>r===0||r===1?r:Ai(i(r),e,s)}const Ci=t=>e=>e<=.5?t(2*e)/2:(2-t(2*(1-e)))/2,Ei=t=>e=>1-t(1-e),Vi=Gt(.33,1.53,.69,.99),Mn=Ei(Vi),Di=Ci(Mn),Ri=t=>t>=1?1:(t*=2)<1?.5*Mn(t):.5*(2-Math.pow(2,-10*(t-1))),Pn=t=>1-Math.sin(Math.acos(t)),Li=Ei(Pn),Ii=Ci(Pn),al=Gt(.42,0,1,1),ll=Gt(0,0,.58,1),Bi=Gt(.42,0,.58,1),cl=t=>Array.isArray(t)&&typeof t[0]!="number",Oi=t=>Array.isArray(t)&&typeof t[0]=="number",ul={linear:Q,easeIn:al,easeInOut:Bi,easeOut:ll,circIn:Pn,circInOut:Ii,circOut:Li,backIn:Mn,backInOut:Di,backOut:Vi,anticipate:Ri},fl=t=>typeof t=="string",Qn=t=>{if(Oi(t)){_n(t.length===4);const[e,n,s,i]=t;return Gt(e,n,s,i)}else if(fl(t))return ul[t];return t},Zt=["setup","read","resolveKeyframes","preUpdate","update","preRender","render","postRender"];function hl(t){let e=new Set,n=new Set,s=!1,i=!1;const r=new WeakSet;let o={delta:0,timestamp:0,isProcessing:!1};function a(c){r.has(c)&&(l.schedule(c),t()),c(o)}const l={schedule:(c,u=!1,f=!1)=>{const d=f&&s?e:n;return u&&r.add(c),d.add(c),c},cancel:c=>{n.delete(c),r.delete(c)},process:c=>{if(o=c,s){i=!0;return}s=!0;const u=e;e=n,n=u,e.forEach(a),e.clear(),s=!1,i&&(i=!1,l.process(c))}};return l}const dl=40;function Ni(t,e){let n=!1,s=!0;const i={delta:0,timestamp:0,isProcessing:!1},r=()=>n=!0,o=Zt.reduce((x,T)=>(x[T]=hl(r),x),{}),{setup:a,read:l,resolveKeyframes:c,preUpdate:u,update:f,preRender:h,render:d,postRender:p}=o,y=()=>{const x=ft.useManualTiming,T=x?i.timestamp:performance.now();n=!1,x||(i.delta=s?1e3/60:Math.max(Math.min(T-i.timestamp,dl),1)),i.timestamp=T,i.isProcessing=!0,a.process(i),l.process(i),c.process(i),u.process(i),f.process(i),h.process(i),d.process(i),p.process(i),i.isProcessing=!1,n&&e&&(s=!1,t(y))},m=()=>{n=!0,s=!0,i.isProcessing||t(y)};return{schedule:Zt.reduce((x,T)=>{const _=o[T];return x[T]=(C,k=!1,w=!1)=>(n||m(),_.schedule(C,k,w)),x},{}),cancel:x=>{for(let T=0;T<Zt.length;T++)o[Zt[T]].cancel(x)},state:i,steps:o}}const{schedule:R,cancel:ht,state:$,steps:Ae}=Ni(typeof requestAnimationFrame<"u"?requestAnimationFrame:Q,!0);let ne;function pl(){ne=void 0}const H={now:()=>(ne===void 0&&H.set($.isProcessing||ft.useManualTiming?$.timestamp:performance.now()),ne),set:t=>{ne=t,queueMicrotask(pl)}},Fi=t=>e=>typeof e=="string"&&e.startsWith(t),ji=Fi("--"),ml=Fi("var(--"),An=t=>ml(t)?yl.test(t.split("/*")[0].trim()):!1,yl=/var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;function Jn(t){return typeof t!="string"?!1:t.split("/*")[0].includes("var(--")}const Et={test:t=>typeof t=="number",parse:parseFloat,transform:t=>t},$t={...Et,transform:t=>ot(0,1,t)},Qt={...Et,default:1},It=t=>Math.round(t*1e5)/1e5,Cn=/-?(?:\d+(?:\.\d+)?|\.\d+)/gu;function gl(t){return t==null}const vl=/^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu,En=(t,e)=>n=>!!(typeof n=="string"&&vl.test(n)&&n.startsWith(t)||e&&!gl(n)&&Object.prototype.hasOwnProperty.call(n,e)),$i=(t,e,n)=>s=>{if(typeof s!="string")return s;const[i,r,o,a]=s.match(Cn);return{[t]:parseFloat(i),[e]:parseFloat(r),[n]:parseFloat(o),alpha:a!==void 0?parseFloat(a):1}},xl=t=>ot(0,255,t),Ce={...Et,transform:t=>Math.round(xl(t))},gt={test:En("rgb","red"),parse:$i("red","green","blue"),transform:({red:t,green:e,blue:n,alpha:s=1})=>"rgba("+Ce.transform(t)+", "+Ce.transform(e)+", "+Ce.transform(n)+", "+It($t.transform(s))+")"};function Tl(t){let e="",n="",s="",i="";return t.length>5?(e=t.substring(1,3),n=t.substring(3,5),s=t.substring(5,7),i=t.substring(7,9)):(e=t.substring(1,2),n=t.substring(2,3),s=t.substring(3,4),i=t.substring(4,5),e+=e,n+=n,s+=s,i+=i),{red:parseInt(e,16),green:parseInt(n,16),blue:parseInt(s,16),alpha:i?parseInt(i,16)/255:1}}const qe={test:En("#"),parse:Tl,transform:gt.transform},qt=t=>({test:e=>typeof e=="string"&&e.endsWith(t)&&e.split(" ").length===1,parse:parseFloat,transform:e=>`${e}${t}`}),rt=qt("deg"),it=qt("%"),M=qt("px"),bl=qt("vh"),wl=qt("vw"),ts={...it,parse:t=>it.parse(t)/100,transform:t=>it.transform(t*100)},St={test:En("hsl","hue"),parse:$i("hue","saturation","lightness"),transform:({hue:t,saturation:e,lightness:n,alpha:s=1})=>"hsla("+Math.round(t)+", "+it.transform(It(e))+", "+it.transform(It(n))+", "+It($t.transform(s))+")"},N={test:t=>gt.test(t)||qe.test(t)||St.test(t),parse:t=>gt.test(t)?gt.parse(t):St.test(t)?St.parse(t):qe.parse(t),transform:t=>typeof t=="string"?t:t.hasOwnProperty("red")?gt.transform(t):St.transform(t),getAnimatableNone:t=>{const e=N.parse(t);return e.alpha=0,N.transform(e)}},kl=/(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;function _l(t){var e,n;return isNaN(t)&&typeof t=="string"&&(((e=t.match(Cn))==null?void 0:e.length)||0)+(((n=t.match(kl))==null?void 0:n.length)||0)>0}const zi="number",Ui="color",Sl="var",Ml="var(",es="${}",Pl=/var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;function At(t){const e=t.toString(),n=[],s={color:[],number:[],var:[]},i=[];let r=0;const a=e.replace(Pl,l=>(N.test(l)?(s.color.push(r),i.push(Ui),n.push(N.parse(l))):l.startsWith(Ml)?(s.var.push(r),i.push(Sl),n.push(l)):(s.number.push(r),i.push(zi),n.push(parseFloat(l))),++r,es)).split(es);return{values:n,split:a,indexes:s,types:i}}function Al(t){return At(t).values}function Hi({split:t,types:e}){const n=t.length;return s=>{let i="";for(let r=0;r<n;r++)if(i+=t[r],s[r]!==void 0){const o=e[r];o===zi?i+=It(s[r]):o===Ui?i+=N.transform(s[r]):i+=s[r]}return i}}function Cl(t){return Hi(At(t))}const El=t=>typeof t=="number"?0:N.test(t)?N.getAnimatableNone(t):t,Vl=(t,e)=>typeof t=="number"?e!=null&&e.trim().endsWith("/")?t:0:El(t);function Dl(t){const e=At(t);return Hi(e)(e.values.map((s,i)=>Vl(s,e.split[i])))}const et={test:_l,parse:Al,createTransformer:Cl,getAnimatableNone:Dl};function Ee(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*(2/3-n)*6:t}function Rl({hue:t,saturation:e,lightness:n,alpha:s}){t/=360,e/=100,n/=100;let i=0,r=0,o=0;if(!e)i=r=o=n;else{const a=n<.5?n*(1+e):n+e-n*e,l=2*n-a;i=Ee(l,a,t+1/3),r=Ee(l,a,t),o=Ee(l,a,t-1/3)}return{red:Math.round(i*255),green:Math.round(r*255),blue:Math.round(o*255),alpha:s}}function fe(t,e){return n=>n>0?e:t}const D=(t,e,n)=>t+(e-t)*n,Ve=(t,e,n)=>{const s=t*t,i=n*(e*e-s)+s;return i<0?0:Math.sqrt(i)},Ll=[qe,gt,St],Il=t=>Ll.find(e=>e.test(t));function ns(t){const e=Il(t);if(!e)return!1;let n=e.parse(t);return e===St&&(n=Rl(n)),n}const ss=(t,e)=>{const n=ns(t),s=ns(e);if(!n||!s)return fe(t,e);const i={...n};return r=>(i.red=Ve(n.red,s.red,r),i.green=Ve(n.green,s.green,r),i.blue=Ve(n.blue,s.blue,r),i.alpha=D(n.alpha,s.alpha,r),gt.transform(i))},Xe=new Set(["none","hidden"]);function Bl(t,e){return Xe.has(t)?n=>n<=0?t:e:n=>n>=1?e:t}function Ol(t,e){return n=>D(t,e,n)}function Vn(t){return typeof t=="number"?Ol:typeof t=="string"?An(t)?fe:N.test(t)?ss:jl:Array.isArray(t)?Wi:typeof t=="object"?N.test(t)?ss:Nl:fe}function Wi(t,e){const n=[...t],s=n.length,i=t.map((r,o)=>Vn(r)(r,e[o]));return r=>{for(let o=0;o<s;o++)n[o]=i[o](r);return n}}function Nl(t,e){const n={...t,...e},s={};for(const i in n)t[i]!==void 0&&e[i]!==void 0&&(s[i]=Vn(t[i])(t[i],e[i]));return i=>{for(const r in s)n[r]=s[r](i);return n}}function Fl(t,e){const n=[],s={color:0,var:0,number:0};for(let i=0;i<e.values.length;i++){const r=e.types[i],o=t.indexes[r][s[r]],a=t.values[o]??0;n[i]=a,s[r]++}return n}const jl=(t,e)=>{const n=et.createTransformer(e),s=At(t),i=At(e);return s.indexes.var.length===i.indexes.var.length&&s.indexes.color.length===i.indexes.color.length&&s.indexes.number.length>=i.indexes.number.length?Xe.has(t)&&!i.values.length||Xe.has(e)&&!s.values.length?Bl(t,e):Kt(Wi(Fl(s,i),i.values),n):fe(t,e)};function Ki(t,e,n){return typeof t=="number"&&typeof e=="number"&&typeof n=="number"?D(t,e,n):Vn(t)(t,e)}const $l=t=>{const e=({timestamp:n})=>t(n);return{start:(n=!0)=>R.update(e,n),stop:()=>ht(e),now:()=>$.isProcessing?$.timestamp:H.now()}},Gi=(t,e,n=10)=>{let s="";const i=Math.max(Math.round(e/n),2);for(let r=0;r<i;r++)s+=Math.round(t(r/(i-1))*1e4)/1e4+", ";return`linear(${s.substring(0,s.length-2)})`},he=2e4;function Dn(t){let e=0;const n=50;let s=t.next(e);for(;!s.done&&e<he;)e+=n,s=t.next(e);return e>=he?1/0:e}function zl(t,e=100,n){const s=n({...t,keyframes:[0,e]}),i=Math.min(Dn(s),he);return{type:"keyframes",ease:r=>s.next(i*r).value/e,duration:Z(i)}}const O={stiffness:100,damping:10,mass:1,velocity:0,duration:800,bounce:.3,visualDuration:.3,restSpeed:{granular:.01,default:2},restDelta:{granular:.005,default:.5},minDuration:.01,maxDuration:10,minDamping:.05,maxDamping:1};function Ye(t,e){return t*Math.sqrt(1-e*e)}const Ul=12;function Hl(t,e,n){let s=n;for(let i=1;i<Ul;i++)s=s-t(s)/e(s);return s}const De=.001;function Wl({duration:t=O.duration,bounce:e=O.bounce,velocity:n=O.velocity,mass:s=O.mass}){let i,r,o=1-e;o=ot(O.minDamping,O.maxDamping,o),t=ot(O.minDuration,O.maxDuration,Z(t)),o<1?(i=c=>{const u=c*o,f=u*t,h=u-n,d=Ye(c,o),p=Math.exp(-f);return De-h/d*p},r=c=>{const f=c*o*t,h=f*n+n,d=Math.pow(o,2)*Math.pow(c,2)*t,p=Math.exp(-f),y=Ye(Math.pow(c,2),o);return(-i(c)+De>0?-1:1)*((h-d)*p)/y}):(i=c=>{const u=Math.exp(-c*t),f=(c-n)*t+1;return-De+u*f},r=c=>{const u=Math.exp(-c*t),f=(n-c)*(t*t);return u*f});const a=5/t,l=Hl(i,r,a);if(t=G(t),isNaN(l))return{stiffness:O.stiffness,damping:O.damping,duration:t};{const c=Math.pow(l,2)*s;return{stiffness:c,damping:o*2*Math.sqrt(s*c),duration:t}}}const Kl=["duration","bounce"],Gl=["stiffness","damping","mass"];function is(t,e){return e.some(n=>t[n]!==void 0)}function ql(t){let e={velocity:O.velocity,stiffness:O.stiffness,damping:O.damping,mass:O.mass,isResolvedFromDuration:!1,...t};if(!is(t,Gl)&&is(t,Kl))if(e.velocity=0,t.visualDuration){const n=t.visualDuration,s=2*Math.PI/(n*1.2),i=s*s,r=2*ot(.05,1,1-(t.bounce||0))*Math.sqrt(i);e={...e,mass:O.mass,stiffness:i,damping:r}}else{const n=Wl({...t,velocity:0});e={...e,...n,mass:O.mass},e.isResolvedFromDuration=!0}return e}function de(t=O.visualDuration,e=O.bounce){const n=typeof t!="object"?{visualDuration:t,keyframes:[0,1],bounce:e}:t;let{restSpeed:s,restDelta:i}=n;const r=n.keyframes[0],o=n.keyframes[n.keyframes.length-1],a={done:!1,value:r},{stiffness:l,damping:c,mass:u,duration:f,velocity:h,isResolvedFromDuration:d}=ql({...n,velocity:-Z(n.velocity||0)}),p=h||0,y=c/(2*Math.sqrt(l*u)),m=o-r,g=Z(Math.sqrt(l/u)),v=Math.abs(m)<5;s||(s=v?O.restSpeed.granular:O.restSpeed.default),i||(i=v?O.restDelta.granular:O.restDelta.default);let x,T,_,C,k,w;if(y<1)_=Ye(g,y),C=(p+y*g*m)/_,x=P=>{const E=Math.exp(-y*g*P);return o-E*(C*Math.sin(_*P)+m*Math.cos(_*P))},k=y*g*C+m*_,w=y*g*m-C*_,T=P=>Math.exp(-y*g*P)*(k*Math.sin(_*P)+w*Math.cos(_*P));else if(y===1){x=E=>o-Math.exp(-g*E)*(m+(p+g*m)*E);const P=p+g*m;T=E=>Math.exp(-g*E)*(g*P*E-p)}else{const P=g*Math.sqrt(y*y-1);x=q=>{const X=Math.exp(-y*g*q),K=Math.min(P*q,300);return o-X*((p+y*g*m)*Math.sinh(K)+P*m*Math.cosh(K))/P};const E=(p+y*g*m)/P,I=y*g*E-m*P,j=y*g*m-E*P;T=q=>{const X=Math.exp(-y*g*q),K=Math.min(P*q,300);return X*(I*Math.sinh(K)+j*Math.cosh(K))}}const A={calculatedDuration:d&&f||null,velocity:P=>G(T(P)),next:P=>{if(!d&&y<1){const I=Math.exp(-y*g*P),j=Math.sin(_*P),q=Math.cos(_*P),X=o-I*(C*j+m*q),K=G(I*(k*j+w*q));return a.done=Math.abs(K)<=s&&Math.abs(o-X)<=i,a.value=a.done?o:X,a}const E=x(P);if(d)a.done=P>=f;else{const I=G(T(P));a.done=Math.abs(I)<=s&&Math.abs(o-E)<=i}return a.value=a.done?o:E,a},toString:()=>{const P=Math.min(Dn(A),he),E=Gi(I=>A.next(P*I).value,P,30);return P+"ms "+E},toTransition:()=>{}};return A}de.applyToOptions=t=>{const e=zl(t,100,de);return t.ease=e.ease,t.duration=G(e.duration),t.type="keyframes",t};const Xl=5;function qi(t,e,n){const s=Math.max(e-Xl,0);return Pi(n-t(s),e-s)}function Ze({keyframes:t,velocity:e=0,power:n=.8,timeConstant:s=325,bounceDamping:i=10,bounceStiffness:r=500,modifyTarget:o,min:a,max:l,restDelta:c=.5,restSpeed:u}){const f=t[0],h={done:!1,value:f},d=w=>a!==void 0&&w<a||l!==void 0&&w>l,p=w=>a===void 0?l:l===void 0||Math.abs(a-w)<Math.abs(l-w)?a:l;let y=n*e;const m=f+y,g=o===void 0?m:o(m);g!==m&&(y=g-f);const v=w=>-y*Math.exp(-w/s),x=w=>g+v(w),T=w=>{const A=v(w),P=x(w);h.done=Math.abs(A)<=c,h.value=h.done?g:P};let _,C;const k=w=>{d(h.value)&&(_=w,C=de({keyframes:[h.value,p(h.value)],velocity:qi(x,w,h.value),damping:i,stiffness:r,restDelta:c,restSpeed:u}))};return k(0),{calculatedDuration:null,next:w=>{let A=!1;return!C&&_===void 0&&(A=!0,T(w),k(w)),_!==void 0&&w>=_?C.next(w-_):(!A&&T(w),h)}}}function Yl(t,e,n){const s=[],i=n||ft.mix||Ki,r=t.length-1;for(let o=0;o<r;o++){let a=i(t[o],t[o+1]);if(e){const l=Array.isArray(e)?e[o]||Q:e;a=Kt(l,a)}s.push(a)}return s}function Zl(t,e,{clamp:n=!0,ease:s,mixer:i}={}){const r=t.length;if(_n(r===e.length),r===1)return()=>e[0];if(r===2&&e[0]===e[1])return()=>e[1];const o=t[0]===t[1];t[0]>t[r-1]&&(t=[...t].reverse(),e=[...e].reverse());const a=Yl(e,s,i),l=a.length,c=u=>{if(o&&u<t[0])return e[0];let f=0;if(l>1)for(;f<t.length-2&&!(u<t[f+1]);f++);const h=jt(t[f],t[f+1],u);return a[f](h)};return n?u=>c(ot(t[0],t[r-1],u)):c}function Ql(t,e){const n=t[t.length-1];for(let s=1;s<=e;s++){const i=jt(0,e,s);t.push(D(n,1,i))}}function Jl(t){const e=[0];return Ql(e,t.length-1),e}function tc(t,e){return t.map(n=>n*e)}function ec(t,e){return t.map(()=>e||Bi).splice(0,t.length-1)}function Bt({duration:t=300,keyframes:e,times:n,ease:s="easeInOut"}){const i=cl(s)?s.map(Qn):Qn(s),r={done:!1,value:e[0]},o=tc(n&&n.length===e.length?n:Jl(e),t),a=Zl(o,e,{ease:Array.isArray(i)?i:ec(e,i)});return{calculatedDuration:t,next:l=>(r.value=a(l),r.done=l>=t,r)}}const nc=t=>t!==null;function _e(t,{repeat:e,repeatType:n="loop"},s,i=1){const r=t.filter(nc),a=i<0||e&&n!=="loop"&&e%2===1?0:r.length-1;return!a||s===void 0?r[a]:s}const sc={decay:Ze,inertia:Ze,tween:Bt,keyframes:Bt,spring:de};function Xi(t){typeof t.type=="string"&&(t.type=sc[t.type])}class Rn{constructor(){this.updateFinished()}get finished(){return this._finished}updateFinished(){this._finished=new Promise(e=>{this.resolve=e})}notifyFinished(){this.resolve()}then(e,n){return this.finished.then(e,n)}}const ic=t=>t/100;class pe extends Rn{constructor(e){super(),this.state="idle",this.startTime=null,this.isStopped=!1,this.currentTime=0,this.holdTime=null,this.playbackSpeed=1,this.delayState={done:!1,value:void 0},this.stop=()=>{var s,i;const{motionValue:n}=this.options;n&&n.updatedAt!==H.now()&&this.tick(H.now()),this.isStopped=!0,this.state!=="idle"&&(this.teardown(),(i=(s=this.options).onStop)==null||i.call(s))},this.options=e,this.initAnimation(),this.play(),e.autoplay===!1&&this.pause()}initAnimation(){const{options:e}=this;Xi(e);const{type:n=Bt,repeat:s=0,repeatDelay:i=0,repeatType:r,velocity:o=0}=e;let{keyframes:a}=e;const l=n||Bt;l!==Bt&&typeof a[0]!="number"&&(this.mixKeyframes=Kt(ic,Ki(a[0],a[1])),a=[0,100]);const c=l({...e,keyframes:a});r==="mirror"&&(this.mirroredGenerator=l({...e,keyframes:[...a].reverse(),velocity:-o})),c.calculatedDuration===null&&(c.calculatedDuration=Dn(c));const{calculatedDuration:u}=c;this.calculatedDuration=u,this.resolvedDuration=u+i,this.totalDuration=this.resolvedDuration*(s+1)-i,this.generator=c}updateTime(e){const n=Math.round(e-this.startTime)*this.playbackSpeed;this.holdTime!==null?this.currentTime=this.holdTime:this.currentTime=n}tick(e,n=!1){const{generator:s,totalDuration:i,mixKeyframes:r,mirroredGenerator:o,resolvedDuration:a,calculatedDuration:l}=this;if(this.startTime===null)return s.next(0);const{delay:c=0,keyframes:u,repeat:f,repeatType:h,repeatDelay:d,type:p,onUpdate:y,finalKeyframe:m}=this.options;this.speed>0?this.startTime=Math.min(this.startTime,e):this.speed<0&&(this.startTime=Math.min(e-i/this.speed,this.startTime)),n?this.currentTime=e:this.updateTime(e);const g=this.currentTime-c*(this.playbackSpeed>=0?1:-1),v=this.playbackSpeed>=0?g<0:g>i;this.currentTime=Math.max(g,0),this.state==="finished"&&this.holdTime===null&&(this.currentTime=i);let x=this.currentTime,T=s;if(f){const w=Math.min(this.currentTime,i)/a;let A=Math.floor(w),P=w%1;!P&&w>=1&&(P=1),P===1&&A--,A=Math.min(A,f+1),!!(A%2)&&(h==="reverse"?(P=1-P,d&&(P-=d/a)):h==="mirror"&&(T=o)),x=ot(0,1,P)*a}let _;v?(this.delayState.value=u[0],_=this.delayState):_=T.next(x),r&&!v&&(_.value=r(_.value));let{done:C}=_;!v&&l!==null&&(C=this.playbackSpeed>=0?this.currentTime>=i:this.currentTime<=0);const k=this.holdTime===null&&(this.state==="finished"||this.state==="running"&&C);return k&&p!==Ze&&(_.value=_e(u,this.options,m,this.speed)),y&&y(_.value),k&&this.finish(),_}then(e,n){return this.finished.then(e,n)}get duration(){return Z(this.calculatedDuration)}get iterationDuration(){const{delay:e=0}=this.options||{};return this.duration+Z(e)}get time(){return Z(this.currentTime)}set time(e){e=G(e),this.currentTime=e,this.startTime===null||this.holdTime!==null||this.playbackSpeed===0?this.holdTime=e:this.driver&&(this.startTime=this.driver.now()-e/this.playbackSpeed),this.driver?this.driver.start(!1):(this.startTime=0,this.state="paused",this.holdTime=e,this.tick(e))}getGeneratorVelocity(){const e=this.currentTime;if(e<=0)return this.options.velocity||0;if(this.generator.velocity)return this.generator.velocity(e);const n=this.generator.next(e).value;return qi(s=>this.generator.next(s).value,e,n)}get speed(){return this.playbackSpeed}set speed(e){const n=this.playbackSpeed!==e;n&&this.driver&&this.updateTime(H.now()),this.playbackSpeed=e,n&&this.driver&&(this.time=Z(this.currentTime))}play(){var i,r;if(this.isStopped)return;const{driver:e=$l,startTime:n}=this.options;this.driver||(this.driver=e(o=>this.tick(o))),(r=(i=this.options).onPlay)==null||r.call(i);const s=this.driver.now();this.state==="finished"?(this.updateFinished(),this.startTime=s):this.holdTime!==null?this.startTime=s-this.holdTime:this.startTime||(this.startTime=n??s),this.state==="finished"&&this.speed<0&&(this.startTime+=this.calculatedDuration),this.holdTime=null,this.state="running",this.driver.start()}pause(){this.state="paused",this.updateTime(H.now()),this.holdTime=this.currentTime}complete(){this.state!=="running"&&this.play(),this.state="finished",this.holdTime=null}finish(){var e,n;this.notifyFinished(),this.teardown(),this.state="finished",(n=(e=this.options).onComplete)==null||n.call(e)}cancel(){var e,n;this.holdTime=null,this.startTime=0,this.tick(0),this.teardown(),(n=(e=this.options).onCancel)==null||n.call(e)}teardown(){this.state="idle",this.stopDriver(),this.startTime=this.holdTime=null}stopDriver(){this.driver&&(this.driver.stop(),this.driver=void 0)}sample(e){return this.startTime=0,this.tick(e,!0)}attachTimeline(e){var n;return this.options.allowFlatten&&(this.options.type="keyframes",this.options.ease="linear",this.initAnimation()),(n=this.driver)==null||n.stop(),e.observe(this)}}function oc(t){for(let e=1;e<t.length;e++)t[e]??(t[e]=t[e-1])}const vt=t=>t*180/Math.PI,Qe=t=>{const e=vt(Math.atan2(t[1],t[0]));return Je(e)},rc={x:4,y:5,translateX:4,translateY:5,scaleX:0,scaleY:3,scale:t=>(Math.abs(t[0])+Math.abs(t[3]))/2,rotate:Qe,rotateZ:Qe,skewX:t=>vt(Math.atan(t[1])),skewY:t=>vt(Math.atan(t[2])),skew:t=>(Math.abs(t[1])+Math.abs(t[2]))/2},Je=t=>(t=t%360,t<0&&(t+=360),t),os=Qe,rs=t=>Math.sqrt(t[0]*t[0]+t[1]*t[1]),as=t=>Math.sqrt(t[4]*t[4]+t[5]*t[5]),ac={x:12,y:13,z:14,translateX:12,translateY:13,translateZ:14,scaleX:rs,scaleY:as,scale:t=>(rs(t)+as(t))/2,rotateX:t=>Je(vt(Math.atan2(t[6],t[5]))),rotateY:t=>Je(vt(Math.atan2(-t[2],t[0]))),rotateZ:os,rotate:os,skewX:t=>vt(Math.atan(t[4])),skewY:t=>vt(Math.atan(t[1])),skew:t=>(Math.abs(t[1])+Math.abs(t[4]))/2};function tn(t){return t.includes("scale")?1:0}function en(t,e){if(!t||t==="none")return tn(e);const n=t.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);let s,i;if(n)s=ac,i=n;else{const a=t.match(/^matrix\(([-\d.e\s,]+)\)$/u);s=rc,i=a}if(!i)return tn(e);const r=s[e],o=i[1].split(",").map(cc);return typeof r=="function"?r(o):o[r]}const lc=(t,e)=>{const{transform:n="none"}=getComputedStyle(t);return en(n,e)};function cc(t){return parseFloat(t.trim())}const Vt=["transformPerspective","x","y","z","translateX","translateY","translateZ","scale","scaleX","scaleY","rotate","rotateX","rotateY","rotateZ","skew","skewX","skewY"],Dt=new Set([...Vt,"pathRotation"]),ls=t=>t===Et||t===M,uc=new Set(["x","y","z"]),fc=Vt.filter(t=>!uc.has(t));function hc(t){const e=[];return fc.forEach(n=>{const s=t.getValue(n);s!==void 0&&(e.push([n,s.get()]),s.set(n.startsWith("scale")?1:0))}),e}const ut={width:({x:t},{paddingLeft:e="0",paddingRight:n="0",boxSizing:s})=>{const i=t.max-t.min;return s==="border-box"?i:i-parseFloat(e)-parseFloat(n)},height:({y:t},{paddingTop:e="0",paddingBottom:n="0",boxSizing:s})=>{const i=t.max-t.min;return s==="border-box"?i:i-parseFloat(e)-parseFloat(n)},top:(t,{top:e})=>parseFloat(e),left:(t,{left:e})=>parseFloat(e),bottom:({y:t},{top:e})=>parseFloat(e)+(t.max-t.min),right:({x:t},{left:e})=>parseFloat(e)+(t.max-t.min),x:(t,{transform:e})=>en(e,"x"),y:(t,{transform:e})=>en(e,"y")};ut.translateX=ut.x;ut.translateY=ut.y;const Tt=new Set;let nn=!1,sn=!1,on=!1;function Yi(){if(sn){const t=Array.from(Tt).filter(s=>s.needsMeasurement),e=new Set(t.map(s=>s.element)),n=new Map;e.forEach(s=>{const i=hc(s);i.length&&(n.set(s,i),s.render())}),t.forEach(s=>s.measureInitialState()),e.forEach(s=>{s.render();const i=n.get(s);i&&i.forEach(([r,o])=>{var a;(a=s.getValue(r))==null||a.set(o)})}),t.forEach(s=>s.measureEndState()),t.forEach(s=>{s.suspendedScrollY!==void 0&&window.scrollTo(0,s.suspendedScrollY)})}sn=!1,nn=!1,Tt.forEach(t=>t.complete(on)),Tt.clear()}function Zi(){Tt.forEach(t=>{t.readKeyframes(),t.needsMeasurement&&(sn=!0)})}function dc(){on=!0,Zi(),Yi(),on=!1}class Ln{constructor(e,n,s,i,r,o=!1){this.state="pending",this.isAsync=!1,this.needsMeasurement=!1,this.unresolvedKeyframes=[...e],this.onComplete=n,this.name=s,this.motionValue=i,this.element=r,this.isAsync=o}scheduleResolve(){this.state="scheduled",this.isAsync?(Tt.add(this),nn||(nn=!0,R.read(Zi),R.resolveKeyframes(Yi))):(this.readKeyframes(),this.complete())}readKeyframes(){const{unresolvedKeyframes:e,name:n,element:s,motionValue:i}=this;if(e[0]===null){const r=i==null?void 0:i.get(),o=e[e.length-1];if(r!==void 0)e[0]=r;else if(s&&n){const a=s.readValue(n,o);a!=null&&(e[0]=a)}e[0]===void 0&&(e[0]=o),i&&r===void 0&&i.set(e[0])}oc(e)}setFinalKeyframe(){}measureInitialState(){}renderEndStyles(){}measureEndState(){}complete(e=!1){this.state="complete",this.onComplete(this.unresolvedKeyframes,this.finalKeyframe,e),Tt.delete(this)}cancel(){this.state==="scheduled"&&(Tt.delete(this),this.state="pending")}resume(){this.state==="pending"&&this.scheduleResolve()}}const pc=t=>t.startsWith("--");function Qi(t,e,n){pc(e)?t.style.setProperty(e,n):t.style[e]=n}const mc={};function Ji(t,e){const n=Mi(t);return()=>mc[e]??n()}const yc=Ji(()=>window.ScrollTimeline!==void 0,"scrollTimeline"),to=Ji(()=>{try{document.createElement("div").animate({opacity:0},{easing:"linear(0, 1)"})}catch{return!1}return!0},"linearEasing"),Lt=([t,e,n,s])=>`cubic-bezier(${t}, ${e}, ${n}, ${s})`,cs={linear:"linear",ease:"ease",easeIn:"ease-in",easeOut:"ease-out",easeInOut:"ease-in-out",circIn:Lt([0,.65,.55,1]),circOut:Lt([.55,0,1,.45]),backIn:Lt([.31,.01,.66,-.59]),backOut:Lt([.33,1.53,.69,.99])};function eo(t,e){if(t)return typeof t=="function"?to()?Gi(t,e):"ease-out":Oi(t)?Lt(t):Array.isArray(t)?t.map(n=>eo(n,e)||cs.easeOut):cs[t]}function gc(t,e,n,{delay:s=0,duration:i=300,repeat:r=0,repeatType:o="loop",ease:a="easeOut",times:l}={},c=void 0){const u={[e]:n};l&&(u.offset=l);const f=eo(a,i);Array.isArray(f)&&(u.easing=f);const h={delay:s,duration:i,easing:Array.isArray(f)?"linear":f,fill:"both",iterations:r+1,direction:o==="reverse"?"alternate":"normal"};return c&&(h.pseudoElement=c),t.animate(u,h)}function no(t){return typeof t=="function"&&"applyToOptions"in t}function vc({type:t,...e}){return no(t)&&to()?t.applyToOptions(e):(e.duration??(e.duration=300),e.ease??(e.ease="easeOut"),e)}class so extends Rn{constructor(e){if(super(),this.finishedTime=null,this.isStopped=!1,this.manualStartTime=null,!e)return;const{element:n,name:s,keyframes:i,pseudoElement:r,allowFlatten:o=!1,finalKeyframe:a,onComplete:l}=e;this.isPseudoElement=!!r,this.allowFlatten=o,this.options=e,_n(typeof e.type!="string");const c=vc(e);this.animation=gc(n,s,i,c,r),c.autoplay===!1&&this.animation.pause(),this.animation.onfinish=()=>{if(this.finishedTime=this.time,!r){const u=_e(i,this.options,a,this.speed);this.updateMotionValue&&this.updateMotionValue(u),Qi(n,s,u),this.animation.cancel()}l==null||l(),this.notifyFinished()}}play(){this.isStopped||(this.manualStartTime=null,this.animation.play(),this.state==="finished"&&this.updateFinished())}pause(){this.animation.pause()}complete(){var e,n;(n=(e=this.animation).finish)==null||n.call(e)}cancel(){try{this.animation.cancel()}catch{}}stop(){if(this.isStopped)return;this.isStopped=!0;const{state:e}=this;e==="idle"||e==="finished"||(this.updateMotionValue?this.updateMotionValue():this.commitStyles(),this.isPseudoElement||this.cancel())}commitStyles(){var n,s,i;const e=(n=this.options)==null?void 0:n.element;!this.isPseudoElement&&(e!=null&&e.isConnected)&&((i=(s=this.animation).commitStyles)==null||i.call(s))}get duration(){var n,s;const e=((s=(n=this.animation.effect)==null?void 0:n.getComputedTiming)==null?void 0:s.call(n).duration)||0;return Z(Number(e))}get iterationDuration(){const{delay:e=0}=this.options||{};return this.duration+Z(e)}get time(){return Z(Number(this.animation.currentTime)||0)}set time(e){const n=this.finishedTime!==null;this.manualStartTime=null,this.finishedTime=null,this.animation.currentTime=G(e),n&&this.animation.pause()}get speed(){return this.animation.playbackRate}set speed(e){e<0&&(this.finishedTime=null),this.animation.playbackRate=e}get state(){return this.finishedTime!==null?"finished":this.animation.playState}get startTime(){return this.manualStartTime??Number(this.animation.startTime)}set startTime(e){this.manualStartTime=this.animation.startTime=e}attachTimeline({timeline:e,rangeStart:n,rangeEnd:s,observe:i}){var r;return this.allowFlatten&&((r=this.animation.effect)==null||r.updateTiming({easing:"linear"})),this.animation.onfinish=null,e&&yc()?(this.animation.timeline=e,n&&(this.animation.rangeStart=n),s&&(this.animation.rangeEnd=s),Q):i(this)}}const io={anticipate:Ri,backInOut:Di,circInOut:Ii};function xc(t){return t in io}function Tc(t){typeof t.ease=="string"&&xc(t.ease)&&(t.ease=io[t.ease])}const Re=10;class bc extends so{constructor(e){Tc(e),Xi(e),super(e),e.startTime!==void 0&&e.autoplay!==!1&&(this.startTime=e.startTime),this.options=e}updateMotionValue(e){const{motionValue:n,onUpdate:s,onComplete:i,element:r,...o}=this.options;if(!n)return;if(e!==void 0){n.set(e);return}const a=new pe({...o,autoplay:!1}),l=Math.max(Re,H.now()-this.startTime),c=ot(0,Re,l-Re),u=a.sample(l).value,{name:f}=this.options;r&&f&&Qi(r,f,u),n.setWithVelocity(a.sample(Math.max(0,l-c)).value,u,c),a.stop()}}const us=(t,e)=>e==="zIndex"?!1:!!(typeof t=="number"||Array.isArray(t)||typeof t=="string"&&(et.test(t)||t==="0")&&!t.startsWith("url("));function wc(t){const e=t[0];if(t.length===1)return!0;for(let n=0;n<t.length;n++)if(t[n]!==e)return!0}function kc(t,e,n,s){const i=t[0];if(i===null)return!1;if(e==="display"||e==="visibility")return!0;const r=t[t.length-1],o=us(i,e),a=us(r,e);return!o||!a?!1:wc(t)||(n==="spring"||no(n))&&s}function rn(t){t.duration=0,t.type="keyframes"}const oo=new Set(["opacity","clipPath","filter","transform"]),_c=/^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/;function Sc(t){for(let e=0;e<t.length;e++)if(typeof t[e]=="string"&&_c.test(t[e]))return!0;return!1}const Mc=new Set(["color","backgroundColor","outlineColor","fill","stroke","borderColor","borderTopColor","borderRightColor","borderBottomColor","borderLeftColor"]),Pc=Mi(()=>Object.hasOwnProperty.call(Element.prototype,"animate"));function Ac(t){var f;const{motionValue:e,name:n,repeatDelay:s,repeatType:i,damping:r,type:o,keyframes:a}=t;if(!(((f=e==null?void 0:e.owner)==null?void 0:f.current)instanceof HTMLElement))return!1;const{onUpdate:c,transformTemplate:u}=e.owner.getProps();return Pc()&&n&&(oo.has(n)||Mc.has(n)&&Sc(a))&&(n!=="transform"||!u)&&!c&&!s&&i!=="mirror"&&r!==0&&o!=="inertia"}const Cc=40;class Ec extends Rn{constructor({autoplay:e=!0,delay:n=0,type:s="keyframes",repeat:i=0,repeatDelay:r=0,repeatType:o="loop",keyframes:a,name:l,motionValue:c,element:u,...f}){var p;super(),this.stop=()=>{var y,m;this._animation&&(this._animation.stop(),(y=this.stopTimeline)==null||y.call(this)),(m=this.keyframeResolver)==null||m.cancel()},this.createdAt=H.now();const h={autoplay:e,delay:n,type:s,repeat:i,repeatDelay:r,repeatType:o,name:l,motionValue:c,element:u,...f},d=(u==null?void 0:u.KeyframeResolver)||Ln;this.keyframeResolver=new d(a,(y,m,g)=>this.onKeyframesResolved(y,m,h,!g),l,c,u),(p=this.keyframeResolver)==null||p.scheduleResolve()}onKeyframesResolved(e,n,s,i){var g,v;this.keyframeResolver=void 0;const{name:r,type:o,velocity:a,delay:l,isHandoff:c,onUpdate:u}=s;this.resolvedAt=H.now();let f=!0;kc(e,r,o,a)||(f=!1,(ft.instantAnimations||!l)&&(u==null||u(_e(e,s,n))),e[0]=e[e.length-1],rn(s),s.repeat=0);const d={startTime:i?this.resolvedAt?this.resolvedAt-this.createdAt>Cc?this.resolvedAt:this.createdAt:this.createdAt:void 0,finalKeyframe:n,...s,keyframes:e},p=f&&!c&&Ac(d),y=(v=(g=d.motionValue)==null?void 0:g.owner)==null?void 0:v.current;let m;if(p)try{m=new bc({...d,element:y})}catch{m=new pe(d)}else m=new pe(d);m.finished.then(()=>{this.notifyFinished()}).catch(Q),this.pendingTimeline&&(this.stopTimeline=m.attachTimeline(this.pendingTimeline),this.pendingTimeline=void 0),this._animation=m}get finished(){return this._animation?this.animation.finished:this._finished}then(e,n){return this.finished.finally(e).then(()=>{})}get animation(){var e;return this._animation||((e=this.keyframeResolver)==null||e.resume(),dc()),this._animation}get duration(){return this.animation.duration}get iterationDuration(){return this.animation.iterationDuration}get time(){return this.animation.time}set time(e){this.animation.time=e}get speed(){return this.animation.speed}get state(){return this.animation.state}set speed(e){this.animation.speed=e}get startTime(){return this.animation.startTime}attachTimeline(e){return this._animation?this.stopTimeline=this.animation.attachTimeline(e):this.pendingTimeline=e,()=>this.stop()}play(){this.animation.play()}pause(){this.animation.pause()}complete(){this.animation.complete()}cancel(){var e;this._animation&&this.animation.cancel(),(e=this.keyframeResolver)==null||e.cancel()}}function ro(t,e,n,s=0,i=1){const r=Array.from(t).sort((c,u)=>c.sortNodePosition(u)).indexOf(e),o=t.size,a=(o-1)*s;return typeof n=="function"?n(r,o):i===1?r*s:a-r*s}const fs=30,Vc=t=>!isNaN(parseFloat(t));class Dc{constructor(e,n={}){this.canTrackVelocity=null,this.events={},this.updateAndNotify=s=>{var r;const i=H.now();if(this.updatedAt!==i&&this.setPrevFrameValue(),this.prev=this.current,this.setCurrent(s),this.current!==this.prev&&((r=this.events.change)==null||r.notify(this.current),this.dependents))for(const o of this.dependents)o.dirty()},this.hasAnimated=!1,this.setCurrent(e),this.owner=n.owner}setCurrent(e){this.current=e,this.updatedAt=H.now(),this.canTrackVelocity===null&&e!==void 0&&(this.canTrackVelocity=Vc(this.current))}setPrevFrameValue(e=this.current){this.prevFrameValue=e,this.prevUpdatedAt=this.updatedAt}onChange(e){return this.on("change",e)}on(e,n){this.events[e]||(this.events[e]=new Sn);const s=this.events[e].add(n);return e==="change"?()=>{s(),R.read(()=>{this.events.change.getSize()||this.stop()})}:s}clearListeners(){for(const e in this.events)this.events[e].clear()}attach(e,n){this.passiveEffect=e,this.stopPassiveEffect=n}set(e){this.passiveEffect?this.passiveEffect(e,this.updateAndNotify):this.updateAndNotify(e)}setWithVelocity(e,n,s){this.set(n),this.prev=void 0,this.prevFrameValue=e,this.prevUpdatedAt=this.updatedAt-s}jump(e,n=!0){this.updateAndNotify(e),this.prev=e,this.prevUpdatedAt=this.prevFrameValue=void 0,n&&this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}dirty(){var e;(e=this.events.change)==null||e.notify(this.current)}addDependent(e){this.dependents||(this.dependents=new Set),this.dependents.add(e)}removeDependent(e){this.dependents&&this.dependents.delete(e)}get(){return this.current}getPrevious(){return this.prev}getVelocity(){const e=H.now();if(!this.canTrackVelocity||this.prevFrameValue===void 0||e-this.updatedAt>fs)return 0;const n=Math.min(this.updatedAt-this.prevUpdatedAt,fs);return Pi(parseFloat(this.current)-parseFloat(this.prevFrameValue),n)}start(e){return this.stop(),new Promise(n=>{this.hasAnimated=!0,this.animation=e(n),this.events.animationStart&&this.events.animationStart.notify()}).then(()=>{this.events.animationComplete&&this.events.animationComplete.notify(),this.clearAnimation()})}stop(){this.animation&&(this.animation.stop(),this.events.animationCancel&&this.events.animationCancel.notify()),this.clearAnimation()}isAnimating(){return!!this.animation}clearAnimation(){delete this.animation}destroy(){var e,n;(e=this.dependents)==null||e.clear(),(n=this.events.destroy)==null||n.notify(),this.clearListeners(),this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}}function Ct(t,e){return new Dc(t,e)}function ao(t,e){if(t!=null&&t.inherit&&e){const{inherit:n,...s}=t;return{...e,...s}}return t}function In(t,e){const n=(t==null?void 0:t[e])??(t==null?void 0:t.default)??t;return n!==t?ao(n,t):n}const Rc={type:"spring",stiffness:500,damping:25,restSpeed:10},Lc=t=>({type:"spring",stiffness:550,damping:t===0?2*Math.sqrt(550):30,restSpeed:10}),Ic={type:"keyframes",duration:.8},Bc={type:"keyframes",ease:[.25,.1,.35,1],duration:.3},Oc=(t,{keyframes:e})=>e.length>2?Ic:Dt.has(t)?t.startsWith("scale")?Lc(e[1]):Rc:Bc,Nc=new Set(["when","delay","delayChildren","staggerChildren","staggerDirection","repeat","repeatType","repeatDelay","from","elapsed"]);function Fc(t){for(const e in t)if(!Nc.has(e))return!0;return!1}const Bn=(t,e,n,s={},i,r)=>o=>{const a=In(s,t)||{},l=a.delay||s.delay||0;let{elapsed:c=0}=s;c=c-G(l);const u={keyframes:Array.isArray(n)?n:[null,n],ease:"easeOut",velocity:e.getVelocity(),...a,delay:-c,onUpdate:h=>{e.set(h),a.onUpdate&&a.onUpdate(h)},onComplete:()=>{o(),a.onComplete&&a.onComplete()},name:t,motionValue:e,element:r?void 0:i};Fc(a)||Object.assign(u,Oc(t,u)),u.duration&&(u.duration=G(u.duration)),u.repeatDelay&&(u.repeatDelay=G(u.repeatDelay)),u.from!==void 0&&(u.keyframes[0]=u.from);let f=!1;if((u.type===!1||u.duration===0&&!u.repeatDelay)&&(rn(u),u.delay===0&&(f=!0)),(ft.instantAnimations||ft.skipAnimations||i!=null&&i.shouldSkipAnimations||a.skipAnimations)&&(f=!0,rn(u),u.delay=0),u.allowFlatten=!a.type&&!a.ease,f&&!r&&e.get()!==void 0){const h=_e(u.keyframes,a);if(h!==void 0){R.update(()=>{u.onUpdate(h),u.onComplete()});return}}return a.isSync?new pe(u):new Ec(u)},jc=/^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;function $c(t){const e=jc.exec(t);if(!e)return[,];const[,n,s,i]=e;return[`--${n??s}`,i]}function lo(t,e,n=1){const[s,i]=$c(t);if(!s)return;const r=window.getComputedStyle(e).getPropertyValue(s);if(r){const o=r.trim();return ki(o)?parseFloat(o):o}return An(i)?lo(i,e,n+1):i}function hs(t){const e=[{},{}];return t==null||t.values.forEach((n,s)=>{e[0][s]=n.get(),e[1][s]=n.getVelocity()}),e}function On(t,e,n,s){if(typeof e=="function"){const[i,r]=hs(s);e=e(n!==void 0?n:t.custom,i,r)}if(typeof e=="string"&&(e=t.variants&&t.variants[e]),typeof e=="function"){const[i,r]=hs(s);e=e(n!==void 0?n:t.custom,i,r)}return e}function bt(t,e,n){const s=t.getProps();return On(s,e,n!==void 0?n:s.custom,t)}const co=new Set(["width","height","top","left","right","bottom",...Vt]),an=t=>Array.isArray(t);function zc(t,e,n){t.hasValue(e)?t.getValue(e).set(n):t.addValue(e,Ct(n))}function Uc(t){return an(t)?t[t.length-1]||0:t}function Hc(t,e){const n=bt(t,e);let{transitionEnd:s={},transition:i={},...r}=n||{};r={...r,...s};for(const o in r){const a=Uc(r[o]);zc(t,o,a)}}const z=t=>!!(t&&t.getVelocity);function Wc(t){return!!(z(t)&&t.add)}function ln(t,e){const n=t.getValue("willChange");if(Wc(n))return n.add(e);if(!n&&ft.WillChange){const s=new ft.WillChange("auto");t.addValue("willChange",s),s.add(e)}}function Nn(t){return t.replace(/([A-Z])/g,e=>`-${e.toLowerCase()}`)}const Kc="framerAppearId",uo="data-"+Nn(Kc);function fo(t){return t.props[uo]}function Gc({protectedKeys:t,needsAnimating:e},n){const s=t.hasOwnProperty(n)&&e[n]!==!0;return e[n]=!1,s}function ho(t,e,{delay:n=0,transitionOverride:s,type:i}={}){let{transition:r,transitionEnd:o,...a}=e;const l=t.getDefaultTransition();r=r?ao(r,l):l;const c=r==null?void 0:r.reduceMotion,u=r==null?void 0:r.skipAnimations;s&&(r=s);const f=[],h=i&&t.animationState&&t.animationState.getState()[i],d=r==null?void 0:r.path;d&&d.animateVisualElement(t,a,r,n,f);for(const p in a){const y=t.getValue(p,t.latestValues[p]??null),m=a[p];if(m===void 0||h&&Gc(h,p))continue;const g={delay:n,...In(r||{},p)};u&&(g.skipAnimations=!0);const v=y.get();if(v!==void 0&&!y.isAnimating()&&!Array.isArray(m)&&m===v&&!g.velocity){R.update(()=>y.set(m));continue}let x=!1;if(window.MotionHandoffAnimation){const C=fo(t);if(C){const k=window.MotionHandoffAnimation(C,p,R);k!==null&&(g.startTime=k,x=!0)}}ln(t,p);const T=c??t.shouldReduceMotion;y.start(Bn(p,y,m,T&&co.has(p)?{type:!1}:g,t,x));const _=y.animation;_&&f.push(_)}if(o){const p=()=>R.update(()=>{o&&Hc(t,o)});f.length?Promise.all(f).then(p):p()}return f}function cn(t,e,n={}){var l;const s=bt(t,e,n.type==="exit"?(l=t.presenceContext)==null?void 0:l.custom:void 0);let{transition:i=t.getDefaultTransition()||{}}=s||{};n.transitionOverride&&(i=n.transitionOverride);const r=s?()=>Promise.all(ho(t,s,n)):()=>Promise.resolve(),o=t.variantChildren&&t.variantChildren.size?(c=0)=>{const{delayChildren:u=0,staggerChildren:f,staggerDirection:h}=i;return qc(t,e,c,u,f,h,n)}:()=>Promise.resolve(),{when:a}=i;if(a){const[c,u]=a==="beforeChildren"?[r,o]:[o,r];return c().then(()=>u())}else return Promise.all([r(),o(n.delay)])}function qc(t,e,n=0,s=0,i=0,r=1,o){const a=[];for(const l of t.variantChildren)l.notify("AnimationStart",e),a.push(cn(l,e,{...o,delay:n+(typeof s=="function"?0:s)+ro(t.variantChildren,l,s,i,r)}).then(()=>l.notify("AnimationComplete",e)));return Promise.all(a)}function Xc(t,e,n={}){t.notify("AnimationStart",e);let s;if(Array.isArray(e)){const i=e.map(r=>cn(t,r,n));s=Promise.all(i)}else if(typeof e=="string")s=cn(t,e,n);else{const i=typeof e=="function"?bt(t,e,n.custom):e;s=Promise.all(ho(t,i,n))}return s.then(()=>{t.notify("AnimationComplete",e)})}const Yc={test:t=>t==="auto",parse:t=>t},po=t=>e=>e.test(t),mo=[Et,M,it,rt,wl,bl,Yc],ds=t=>mo.find(po(t));function Zc(t){return typeof t=="number"?t===0:t!==null?t==="none"||t==="0"||Si(t):!0}const Qc=new Set(["brightness","contrast","saturate","opacity"]);function Jc(t){const[e,n]=t.slice(0,-1).split("(");if(e==="drop-shadow")return t;const[s]=n.match(Cn)||[];if(!s)return t;const i=n.replace(s,"");let r=Qc.has(e)?1:0;return s!==n&&(r*=100),e+"("+r+i+")"}const tu=/\b([a-z-]*)\(.*?\)/gu,un={...et,getAnimatableNone:t=>{const e=t.match(tu);return e?e.map(Jc).join(" "):t}},fn={...et,getAnimatableNone:t=>{const e=et.parse(t);return et.createTransformer(t)(e.map(s=>typeof s=="number"?0:typeof s=="object"?{...s,alpha:1}:s))}},ps={...Et,transform:Math.round},eu={rotate:rt,pathRotation:rt,rotateX:rt,rotateY:rt,rotateZ:rt,scale:Qt,scaleX:Qt,scaleY:Qt,scaleZ:Qt,skew:rt,skewX:rt,skewY:rt,distance:M,translateX:M,translateY:M,translateZ:M,x:M,y:M,z:M,perspective:M,transformPerspective:M,opacity:$t,originX:ts,originY:ts,originZ:M},me={borderWidth:M,borderTopWidth:M,borderRightWidth:M,borderBottomWidth:M,borderLeftWidth:M,borderRadius:M,borderTopLeftRadius:M,borderTopRightRadius:M,borderBottomRightRadius:M,borderBottomLeftRadius:M,width:M,maxWidth:M,height:M,maxHeight:M,top:M,right:M,bottom:M,left:M,inset:M,insetBlock:M,insetBlockStart:M,insetBlockEnd:M,insetInline:M,insetInlineStart:M,insetInlineEnd:M,padding:M,paddingTop:M,paddingRight:M,paddingBottom:M,paddingLeft:M,paddingBlock:M,paddingBlockStart:M,paddingBlockEnd:M,paddingInline:M,paddingInlineStart:M,paddingInlineEnd:M,margin:M,marginTop:M,marginRight:M,marginBottom:M,marginLeft:M,marginBlock:M,marginBlockStart:M,marginBlockEnd:M,marginInline:M,marginInlineStart:M,marginInlineEnd:M,fontSize:M,backgroundPositionX:M,backgroundPositionY:M,...eu,zIndex:ps,fillOpacity:$t,strokeOpacity:$t,numOctaves:ps},nu={...me,color:N,backgroundColor:N,outlineColor:N,fill:N,stroke:N,borderColor:N,borderTopColor:N,borderRightColor:N,borderBottomColor:N,borderLeftColor:N,filter:un,WebkitFilter:un,mask:fn,WebkitMask:fn},yo=t=>nu[t],su=new Set([un,fn]);function go(t,e){let n=yo(t);return su.has(n)||(n=et),n.getAnimatableNone?n.getAnimatableNone(e):void 0}const iu=new Set(["auto","none","0"]);function ou(t,e,n){let s=0,i;for(;s<t.length&&!i;){const r=t[s];typeof r=="string"&&!iu.has(r)&&At(r).values.length&&(i=t[s]),s++}if(i&&n)for(const r of e)t[r]=go(n,i)}class ru extends Ln{constructor(e,n,s,i,r){super(e,n,s,i,r,!0)}readKeyframes(){const{unresolvedKeyframes:e,element:n,name:s}=this;if(!n||!n.current)return;super.readKeyframes();for(let u=0;u<e.length;u++){let f=e[u];if(typeof f=="string"&&(f=f.trim(),An(f))){const h=lo(f,n.current);h!==void 0&&(e[u]=h),u===e.length-1&&(this.finalKeyframe=f)}}if(this.resolveNoneKeyframes(),!co.has(s)||e.length!==2)return;const[i,r]=e,o=ds(i),a=ds(r),l=Jn(i),c=Jn(r);if(l!==c&&ut[s]){this.needsMeasurement=!0;return}if(o!==a)if(ls(o)&&ls(a))for(let u=0;u<e.length;u++){const f=e[u];typeof f=="string"&&(e[u]=parseFloat(f))}else ut[s]&&(this.needsMeasurement=!0)}resolveNoneKeyframes(){const{unresolvedKeyframes:e,name:n}=this,s=[];for(let i=0;i<e.length;i++)(e[i]===null||Zc(e[i]))&&s.push(i);s.length&&ou(e,s,n)}measureInitialState(){const{element:e,unresolvedKeyframes:n,name:s}=this;if(!e||!e.current)return;s==="height"&&(this.suspendedScrollY=window.pageYOffset),this.measuredOrigin=ut[s](e.measureViewportBox(),window.getComputedStyle(e.current)),n[0]=this.measuredOrigin;const i=n[n.length-1];i!==void 0&&e.getValue(s,i).jump(i,!1)}measureEndState(){var a;const{element:e,name:n,unresolvedKeyframes:s}=this;if(!e||!e.current)return;const i=e.getValue(n);i&&i.jump(this.measuredOrigin,!1);const r=s.length-1,o=s[r];s[r]=ut[n](e.measureViewportBox(),window.getComputedStyle(e.current)),o!==null&&this.finalKeyframe===void 0&&(this.finalKeyframe=o),(a=this.removedTransforms)!=null&&a.length&&this.removedTransforms.forEach(([l,c])=>{e.getValue(l).set(c)}),this.resolveNoneKeyframes()}}const Fn=["borderTopLeftRadius","borderTopRightRadius","borderBottomRightRadius","borderBottomLeftRadius"];function vo(t,e,n){if(t==null)return[];if(t instanceof EventTarget)return[t];if(typeof t=="string"){let s=document;const i=(n==null?void 0:n[t])??s.querySelectorAll(t);return i?Array.from(i):[]}return Array.from(t).filter(s=>s!=null)}const hn=(t,e)=>e&&typeof t=="number"?e.transform(t):t;function se(t){return _i(t)&&"offsetHeight"in t&&!("ownerSVGElement"in t)}const{schedule:jn}=Ni(queueMicrotask,!1),tt={x:!1,y:!1};function xo(){return tt.x||tt.y}function au(t){return t==="x"||t==="y"?tt[t]?null:(tt[t]=!0,()=>{tt[t]=!1}):tt.x||tt.y?null:(tt.x=tt.y=!0,()=>{tt.x=tt.y=!1})}function To(t,e){const n=vo(t),s=new AbortController,i={passive:!0,...e,signal:s.signal};return[n,i,()=>s.abort()]}function lu(t){return!(t.pointerType==="touch"||xo())}function cu(t,e,n={}){const[s,i,r]=To(t,n);return s.forEach(o=>{let a=!1,l=!1,c;const u=()=>{o.removeEventListener("pointerleave",p)},f=m=>{c&&(c(m),c=void 0),u()},h=m=>{a=!1,window.removeEventListener("pointerup",h),window.removeEventListener("pointercancel",h),l&&(l=!1,f(m))},d=()=>{a=!0,window.addEventListener("pointerup",h,i),window.addEventListener("pointercancel",h,i)},p=m=>{if(m.pointerType!=="touch"){if(a){l=!0;return}f(m)}},y=m=>{if(!lu(m))return;l=!1;const g=e(o,m);typeof g=="function"&&(c=g,o.addEventListener("pointerleave",p,i))};o.addEventListener("pointerenter",y,i),o.addEventListener("pointerdown",d,i)}),r}const bo=(t,e)=>e?t===e?!0:bo(t,e.parentElement):!1,$n=t=>t.pointerType==="mouse"?typeof t.button!="number"||t.button<=0:t.isPrimary!==!1,uu=new Set(["BUTTON","INPUT","SELECT","TEXTAREA","A"]);function fu(t){return uu.has(t.tagName)||t.isContentEditable===!0}const hu=new Set(["INPUT","SELECT","TEXTAREA"]);function du(t){return hu.has(t.tagName)||t.isContentEditable===!0}const ie=new WeakSet;function ms(t){return e=>{e.key==="Enter"&&t(e)}}function Le(t,e){t.dispatchEvent(new PointerEvent("pointer"+e,{isPrimary:!0,bubbles:!0}))}const pu=(t,e)=>{const n=t.currentTarget;if(!n)return;const s=ms(()=>{if(ie.has(n))return;Le(n,"down");const i=ms(()=>{Le(n,"up")}),r=()=>Le(n,"cancel");n.addEventListener("keyup",i,e),n.addEventListener("blur",r,e)});n.addEventListener("keydown",s,e),n.addEventListener("blur",()=>n.removeEventListener("keydown",s),e)};function ys(t){return $n(t)&&!xo()}const gs=new WeakSet;function mu(t,e,n={}){const[s,i,r]=To(t,n),o=a=>{const l=a.currentTarget;if(!ys(a)||gs.has(a))return;ie.add(l),n.stopPropagation&&gs.add(a);const c=e(l,a),u={...i,capture:!0},f=(p,y)=>{window.removeEventListener("pointerup",h,u),window.removeEventListener("pointercancel",d,u),ie.has(l)&&ie.delete(l),ys(p)&&typeof c=="function"&&c(p,{success:y})},h=p=>{f(p,l===window||l===document||n.useGlobalTarget||bo(l,p.target))},d=p=>{f(p,!1)};window.addEventListener("pointerup",h,u),window.addEventListener("pointercancel",d,u)};return s.forEach(a=>{(n.useGlobalTarget?window:a).addEventListener("pointerdown",o,i),se(a)&&(a.addEventListener("focus",c=>pu(c,i)),!fu(a)&&!a.hasAttribute("tabindex")&&(a.tabIndex=0))}),r}function zn(t){return _i(t)&&"ownerSVGElement"in t}const oe=new WeakMap;let ct;const wo=(t,e,n)=>(s,i)=>i&&i[0]?i[0][t+"Size"]:zn(s)&&"getBBox"in s?s.getBBox()[e]:s[n],yu=wo("inline","width","offsetWidth"),gu=wo("block","height","offsetHeight");function vu({target:t,borderBoxSize:e}){var n;(n=oe.get(t))==null||n.forEach(s=>{s(t,{get width(){return yu(t,e)},get height(){return gu(t,e)}})})}function xu(t){t.forEach(vu)}function Tu(){typeof ResizeObserver>"u"||(ct=new ResizeObserver(xu))}function bu(t,e){ct||Tu();const n=vo(t);return n.forEach(s=>{let i=oe.get(s);i||(i=new Set,oe.set(s,i)),i.add(e),ct==null||ct.observe(s)}),()=>{n.forEach(s=>{const i=oe.get(s);i==null||i.delete(e),i!=null&&i.size||ct==null||ct.unobserve(s)})}}const re=new Set;let Mt;function wu(){Mt=()=>{const t={get width(){return window.innerWidth},get height(){return window.innerHeight}};re.forEach(e=>e(t))},window.addEventListener("resize",Mt)}function ku(t){return re.add(t),Mt||wu(),()=>{re.delete(t),!re.size&&typeof Mt=="function"&&(window.removeEventListener("resize",Mt),Mt=void 0)}}function vs(t,e){return typeof t=="function"?ku(t):bu(t,e)}function _u(t){return zn(t)&&t.tagName==="svg"}const Su=[...mo,N,et],Mu=t=>Su.find(po(t)),xs=()=>({translate:0,scale:1,origin:0,originPoint:0}),Pt=()=>({x:xs(),y:xs()}),Ts=()=>({min:0,max:0}),F=()=>({x:Ts(),y:Ts()}),Pu=new WeakMap;function Se(t){return t!==null&&typeof t=="object"&&typeof t.start=="function"}function zt(t){return typeof t=="string"||Array.isArray(t)}const Un=["animate","whileInView","whileFocus","whileHover","whileTap","whileDrag","exit"],Hn=["initial",...Un];function Me(t){return Se(t.animate)||Hn.some(e=>zt(t[e]))}function ko(t){return!!(Me(t)||t.variants)}function Au(t,e,n){for(const s in e){const i=e[s],r=n[s];if(z(i))t.addValue(s,i);else if(z(r))t.addValue(s,Ct(i,{owner:t}));else if(r!==i)if(t.hasValue(s)){const o=t.getValue(s);o.liveStyle===!0?o.jump(i):o.hasAnimated||o.set(i)}else{const o=t.getStaticValue(s);t.addValue(s,Ct(o!==void 0?o:i,{owner:t}))}}for(const s in n)e[s]===void 0&&t.removeValue(s);return e}const dn={current:null},_o={current:!1},Cu=typeof window<"u";function Eu(){if(_o.current=!0,!!Cu)if(window.matchMedia){const t=window.matchMedia("(prefers-reduced-motion)"),e=()=>dn.current=t.matches;t.addEventListener("change",e),e()}else dn.current=!1}const bs=["AnimationStart","AnimationComplete","Update","BeforeLayoutMeasure","LayoutMeasure","LayoutAnimationStart","LayoutAnimationComplete"];let ye={};function So(t){ye=t}function Vu(){return ye}class Du{scrapeMotionValuesFromProps(e,n,s){return{}}constructor({parent:e,props:n,presenceContext:s,reducedMotionConfig:i,skipAnimations:r,blockInitialAnimation:o,visualState:a},l={}){this.current=null,this.children=new Set,this.isVariantNode=!1,this.isControllingVariants=!1,this.shouldReduceMotion=null,this.shouldSkipAnimations=!1,this.values=new Map,this.KeyframeResolver=Ln,this.features={},this.valueSubscriptions=new Map,this.prevMotionValues={},this.hasBeenMounted=!1,this.events={},this.propEventSubscriptions={},this.notifyUpdate=()=>this.notify("Update",this.latestValues),this.render=()=>{this.current&&(this.triggerBuild(),this.renderInstance(this.current,this.renderState,this.props.style,this.projection))},this.renderScheduledAt=0,this.scheduleRender=()=>{const d=H.now();this.renderScheduledAt<d&&(this.renderScheduledAt=d,R.render(this.render,!1,!0))};const{latestValues:c,renderState:u}=a;this.latestValues=c,this.baseTarget={...c},this.initialValues=n.initial?{...c}:{},this.renderState=u,this.parent=e,this.props=n,this.presenceContext=s,this.depth=e?e.depth+1:0,this.reducedMotionConfig=i,this.skipAnimationsConfig=r,this.options=l,this.blockInitialAnimation=!!o,this.isControllingVariants=Me(n),this.isVariantNode=ko(n),this.isVariantNode&&(this.variantChildren=new Set),this.manuallyAnimateOnMount=!!(e&&e.current);const{willChange:f,...h}=this.scrapeMotionValuesFromProps(n,{},this);for(const d in h){const p=h[d];c[d]!==void 0&&z(p)&&p.set(c[d])}}mount(e){var n,s;if(this.hasBeenMounted)for(const i in this.initialValues)(n=this.values.get(i))==null||n.jump(this.initialValues[i]),this.latestValues[i]=this.initialValues[i];this.current=e,Pu.set(e,this),this.projection&&!this.projection.instance&&this.projection.mount(e),this.parent&&this.isVariantNode&&!this.isControllingVariants&&(this.removeFromVariantTree=this.parent.addVariantChild(this)),this.values.forEach((i,r)=>this.bindToMotionValue(r,i)),this.reducedMotionConfig==="never"?this.shouldReduceMotion=!1:this.reducedMotionConfig==="always"?this.shouldReduceMotion=!0:(_o.current||Eu(),this.shouldReduceMotion=dn.current),this.shouldSkipAnimations=this.skipAnimationsConfig??!1,(s=this.parent)==null||s.addChild(this),this.update(this.props,this.presenceContext),this.hasBeenMounted=!0}unmount(){var e;this.projection&&this.projection.unmount(),ht(this.notifyUpdate),ht(this.render),this.valueSubscriptions.forEach(n=>n()),this.valueSubscriptions.clear(),this.removeFromVariantTree&&this.removeFromVariantTree(),(e=this.parent)==null||e.removeChild(this);for(const n in this.events)this.events[n].clear();for(const n in this.features){const s=this.features[n];s&&(s.unmount(),s.isMounted=!1)}this.current=null}addChild(e){this.children.add(e),this.enteringChildren??(this.enteringChildren=new Set),this.enteringChildren.add(e)}removeChild(e){this.children.delete(e),this.enteringChildren&&this.enteringChildren.delete(e)}bindToMotionValue(e,n){if(this.valueSubscriptions.has(e)&&this.valueSubscriptions.get(e)(),n.accelerate&&oo.has(e)&&this.current instanceof HTMLElement){const{factory:o,keyframes:a,times:l,ease:c,duration:u}=n.accelerate,f=new so({element:this.current,name:e,keyframes:a,times:l,ease:c,duration:G(u)}),h=o(f);this.valueSubscriptions.set(e,()=>{h(),f.cancel()});return}const s=Dt.has(e);s&&this.onBindTransform&&this.onBindTransform();const i=n.on("change",o=>{this.latestValues[e]=o,this.props.onUpdate&&R.preRender(this.notifyUpdate),s&&this.projection&&(this.projection.isTransformDirty=!0),this.scheduleRender()});let r;typeof window<"u"&&window.MotionCheckAppearSync&&(r=window.MotionCheckAppearSync(this,e,n)),this.valueSubscriptions.set(e,()=>{i(),r&&r()})}sortNodePosition(e){return!this.current||!this.sortInstanceNodePosition||this.type!==e.type?0:this.sortInstanceNodePosition(this.current,e.current)}updateFeatures(){let e="animation";for(e in ye){const n=ye[e];if(!n)continue;const{isEnabled:s,Feature:i}=n;if(!this.features[e]&&i&&s(this.props)&&(this.features[e]=new i(this)),this.features[e]){const r=this.features[e];r.isMounted?r.update():(r.mount(),r.isMounted=!0)}}}triggerBuild(){this.build(this.renderState,this.latestValues,this.props)}measureViewportBox(){return this.current?this.measureInstanceViewportBox(this.current,this.props):F()}getStaticValue(e){return this.latestValues[e]}setStaticValue(e,n){this.latestValues[e]=n}update(e,n){(e.transformTemplate||this.props.transformTemplate)&&this.scheduleRender(),this.prevProps=this.props,this.props=e,this.prevPresenceContext=this.presenceContext,this.presenceContext=n;for(let s=0;s<bs.length;s++){const i=bs[s];this.propEventSubscriptions[i]&&(this.propEventSubscriptions[i](),delete this.propEventSubscriptions[i]);const r="on"+i,o=e[r];o&&(this.propEventSubscriptions[i]=this.on(i,o))}this.prevMotionValues=Au(this,this.scrapeMotionValuesFromProps(e,this.prevProps||{},this),this.prevMotionValues),this.handleChildMotionValue&&this.handleChildMotionValue()}getProps(){return this.props}getVariant(e){return this.props.variants?this.props.variants[e]:void 0}getDefaultTransition(){return this.props.transition}getTransformPagePoint(){return this.props.transformPagePoint}getClosestVariantNode(){return this.isVariantNode?this:this.parent?this.parent.getClosestVariantNode():void 0}addVariantChild(e){const n=this.getClosestVariantNode();if(n)return n.variantChildren&&n.variantChildren.add(e),()=>n.variantChildren.delete(e)}addValue(e,n){const s=this.values.get(e);n!==s&&(s&&this.removeValue(e),this.bindToMotionValue(e,n),this.values.set(e,n),this.latestValues[e]=n.get())}removeValue(e){this.values.delete(e);const n=this.valueSubscriptions.get(e);n&&(n(),this.valueSubscriptions.delete(e)),delete this.latestValues[e],this.removeValueFromRenderState(e,this.renderState)}hasValue(e){return this.values.has(e)}getValue(e,n){if(this.props.values&&this.props.values[e])return this.props.values[e];let s=this.values.get(e);return s===void 0&&n!==void 0&&(s=Ct(n===null?void 0:n,{owner:this}),this.addValue(e,s)),s}readValue(e,n){let s=this.latestValues[e]!==void 0||!this.current?this.latestValues[e]:this.getBaseTargetFromProps(this.props,e)??this.readValueFromInstance(this.current,e,this.options);return s!=null&&(typeof s=="string"&&(ki(s)||Si(s))?s=parseFloat(s):!Mu(s)&&et.test(n)&&(s=go(e,n)),this.setBaseTarget(e,z(s)?s.get():s)),z(s)?s.get():s}setBaseTarget(e,n){this.baseTarget[e]=n}getBaseTarget(e){var r;const{initial:n}=this.props;let s;if(typeof n=="string"||typeof n=="object"){const o=On(this.props,n,(r=this.presenceContext)==null?void 0:r.custom);o&&(s=o[e])}if(n&&s!==void 0)return s;const i=this.getBaseTargetFromProps(this.props,e);return i!==void 0&&!z(i)?i:this.initialValues[e]!==void 0&&s===void 0?void 0:this.baseTarget[e]}on(e,n){return this.events[e]||(this.events[e]=new Sn),this.events[e].add(n)}notify(e,...n){this.events[e]&&this.events[e].notify(...n)}scheduleRenderMicrotask(){jn.render(this.render)}}class Mo extends Du{constructor(){super(...arguments),this.KeyframeResolver=ru}sortInstanceNodePosition(e,n){return e.compareDocumentPosition(n)&2?1:-1}getBaseTargetFromProps(e,n){const s=e.style;return s?s[n]:void 0}removeValueFromRenderState(e,{vars:n,style:s}){delete n[e],delete s[e]}handleChildMotionValue(){this.childSubscription&&(this.childSubscription(),delete this.childSubscription);const{children:e}=this.props;z(e)&&(this.childSubscription=e.on("change",n=>{this.current&&(this.current.textContent=`${n}`)}))}}class dt{constructor(e){this.isMounted=!1,this.node=e}update(){}}function Po({top:t,left:e,right:n,bottom:s}){return{x:{min:e,max:n},y:{min:t,max:s}}}function Ru({x:t,y:e}){return{top:e.min,right:t.max,bottom:e.max,left:t.min}}function Lu(t,e){if(!e)return t;const n=e({x:t.left,y:t.top}),s=e({x:t.right,y:t.bottom});return{top:n.y,left:n.x,bottom:s.y,right:s.x}}function Ie(t){return t===void 0||t===1}function pn({scale:t,scaleX:e,scaleY:n}){return!Ie(t)||!Ie(e)||!Ie(n)}function yt(t){return pn(t)||Ao(t)||t.z||t.rotate||t.rotateX||t.rotateY||t.skewX||t.skewY}function Ao(t){return ws(t.x)||ws(t.y)}function ws(t){return t&&t!=="0%"}function ge(t,e,n){const s=t-n,i=e*s;return n+i}function ks(t,e,n,s,i){return i!==void 0&&(t=ge(t,i,s)),ge(t,n,s)+e}function mn(t,e=0,n=1,s,i){t.min=ks(t.min,e,n,s,i),t.max=ks(t.max,e,n,s,i)}function Co(t,{x:e,y:n}){mn(t.x,e.translate,e.scale,e.originPoint),mn(t.y,n.translate,n.scale,n.originPoint)}const _s=.999999999999,Ss=1.0000000000001;function Iu(t,e,n,s=!1){var a;const i=n.length;if(!i)return;e.x=e.y=1;let r,o;for(let l=0;l<i;l++){r=n[l],o=r.projectionDelta;const{visualElement:c}=r.options;c&&c.props.style&&c.props.style.display==="contents"||(s&&r.options.layoutScroll&&r.scroll&&r!==r.root&&(st(t.x,-r.scroll.offset.x),st(t.y,-r.scroll.offset.y)),o&&(e.x*=o.x.scale,e.y*=o.y.scale,Co(t,o)),s&&yt(r.latestValues)&&ae(t,r.latestValues,(a=r.layout)==null?void 0:a.layoutBox))}e.x<Ss&&e.x>_s&&(e.x=1),e.y<Ss&&e.y>_s&&(e.y=1)}function st(t,e){t.min+=e,t.max+=e}function Ms(t,e,n,s,i=.5){const r=D(t.min,t.max,i);mn(t,e,n,r,s)}function Ps(t,e){return typeof t=="string"?parseFloat(t)/100*(e.max-e.min):t}function ae(t,e,n){const s=n??t;Ms(t.x,Ps(e.x,s.x),e.scaleX,e.scale,e.originX),Ms(t.y,Ps(e.y,s.y),e.scaleY,e.scale,e.originY)}function Eo(t,e){return Po(Lu(t.getBoundingClientRect(),e))}function Bu(t,e,n){const s=Eo(t,n),{scroll:i}=e;return i&&(st(s.x,i.offset.x),st(s.y,i.offset.y)),s}const Ou={x:"translateX",y:"translateY",z:"translateZ",transformPerspective:"perspective"},Nu=Vt.length;function Fu(t,e,n){let s="",i=!0;for(let o=0;o<Nu;o++){const a=Vt[o],l=t[a];if(l===void 0)continue;let c=!0;if(typeof l=="number")c=l===(a.startsWith("scale")?1:0);else{const u=parseFloat(l);c=a.startsWith("scale")?u===1:u===0}if(!c||n){const u=hn(l,me[a]);if(!c){i=!1;const f=Ou[a]||a;s+=`${f}(${u}) `}n&&(e[a]=u)}}const r=t.pathRotation;return r&&(i=!1,s+=`rotate(${hn(r,me.pathRotation)}) `),s=s.trim(),n?s=n(e,i?"":s):i&&(s="none"),s}function Wn(t,e,n){const{style:s,vars:i,transformOrigin:r}=t;let o=!1,a=!1;for(const l in e){const c=e[l];if(Dt.has(l)){o=!0;continue}else if(ji(l)){i[l]=c;continue}else{const u=hn(c,me[l]);l.startsWith("origin")?(a=!0,r[l]=u):s[l]=u}}if(e.transform||(o||n?s.transform=Fu(e,t.transform,n):s.transform&&(s.transform="none")),a){const{originX:l="50%",originY:c="50%",originZ:u=0}=r;s.transformOrigin=`${l} ${c} ${u}`}}function Vo(t,{style:e,vars:n},s,i){const r=t.style;let o;for(o in e)r[o]=e[o];i==null||i.applyProjectionStyles(r,s);for(o in n)r.setProperty(o,n[o])}function As(t,e){return e.max===e.min?0:t/(e.max-e.min)*100}const Rt={correct:(t,e)=>{if(!e.target)return t;if(typeof t=="string")if(M.test(t))t=parseFloat(t);else return t;const n=As(t,e.target.x),s=As(t,e.target.y);return`${n}% ${s}%`}},ju={correct:(t,{treeScale:e,projectionDelta:n})=>{const s=t,i=et.parse(t);if(i.length>5)return s;const r=et.createTransformer(t),o=typeof i[0]!="number"?1:0,a=n.x.scale*e.x,l=n.y.scale*e.y;i[0+o]/=a,i[1+o]/=l;const c=D(a,l,.5);return typeof i[2+o]=="number"&&(i[2+o]/=c),typeof i[3+o]=="number"&&(i[3+o]/=c),r(i)}},yn={borderRadius:{...Rt,applyTo:[...Fn]},borderTopLeftRadius:Rt,borderTopRightRadius:Rt,borderBottomLeftRadius:Rt,borderBottomRightRadius:Rt,boxShadow:ju};function Do(t,{layout:e,layoutId:n}){return Dt.has(t)||t.startsWith("origin")||(e||n!==void 0)&&(!!yn[t]||t==="opacity")}function Kn(t,e,n){var o;const s=t.style,i=e==null?void 0:e.style,r={};if(!s)return r;for(const a in s)(z(s[a])||i&&z(i[a])||Do(a,t)||((o=n==null?void 0:n.getValue(a))==null?void 0:o.liveStyle)!==void 0)&&(r[a]=s[a]);return r}function $u(t){return window.getComputedStyle(t)}class zu extends Mo{constructor(){super(...arguments),this.type="html",this.renderInstance=Vo}readValueFromInstance(e,n){var s;if(Dt.has(n))return(s=this.projection)!=null&&s.isProjecting?tn(n):lc(e,n);{const i=$u(e),r=(ji(n)?i.getPropertyValue(n):i[n])||0;return typeof r=="string"?r.trim():r}}measureInstanceViewportBox(e,{transformPagePoint:n}){return Eo(e,n)}build(e,n,s){Wn(e,n,s.transformTemplate)}scrapeMotionValuesFromProps(e,n,s){return Kn(e,n,s)}}const Uu={offset:"stroke-dashoffset",array:"stroke-dasharray"},Hu={offset:"strokeDashoffset",array:"strokeDasharray"};function Wu(t,e,n=1,s=0,i=!0){t.pathLength=1;const r=i?Uu:Hu;t[r.offset]=`${-s}`,t[r.array]=`${e} ${n}`}const Ku=["offsetDistance","offsetPath","offsetRotate","offsetAnchor"];function Ro(t,{attrX:e,attrY:n,attrScale:s,pathLength:i,pathSpacing:r=1,pathOffset:o=0,...a},l,c,u){if(Wn(t,a,c),l){t.style.viewBox&&(t.attrs.viewBox=t.style.viewBox);return}t.attrs=t.style,t.style={};const{attrs:f,style:h}=t;f.transform&&(h.transform=f.transform,delete f.transform),(h.transform||f.transformOrigin)&&(h.transformOrigin=f.transformOrigin??"50% 50%",delete f.transformOrigin),h.transform&&(h.transformBox=(u==null?void 0:u.transformBox)??"fill-box",delete f.transformBox);for(const d of Ku)f[d]!==void 0&&(h[d]=f[d],delete f[d]);e!==void 0&&(f.x=e),n!==void 0&&(f.y=n),s!==void 0&&(f.scale=s),i!==void 0&&Wu(f,i,r,o,!1)}const Lo=new Set(["baseFrequency","diffuseConstant","kernelMatrix","kernelUnitLength","keySplines","keyTimes","limitingConeAngle","markerHeight","markerWidth","numOctaves","targetX","targetY","surfaceScale","specularConstant","specularExponent","stdDeviation","tableValues","viewBox","gradientTransform","pathLength","startOffset","textLength","lengthAdjust"]),Io=t=>typeof t=="string"&&t.toLowerCase()==="svg";function Gu(t,e,n,s){Vo(t,e,void 0,s);for(const i in e.attrs)t.setAttribute(Lo.has(i)?i:Nn(i),e.attrs[i])}function Bo(t,e,n){const s=Kn(t,e,n);for(const i in t)if(z(t[i])||z(e[i])){const r=Vt.indexOf(i)!==-1?"attr"+i.charAt(0).toUpperCase()+i.substring(1):i;s[r]=t[i]}return s}class qu extends Mo{constructor(){super(...arguments),this.type="svg",this.isSVGTag=!1,this.measureInstanceViewportBox=F}getBaseTargetFromProps(e,n){return e[n]}readValueFromInstance(e,n){if(Dt.has(n)){const s=yo(n);return s&&s.default||0}return n=Lo.has(n)?n:Nn(n),e.getAttribute(n)}scrapeMotionValuesFromProps(e,n,s){return Bo(e,n,s)}build(e,n,s){Ro(e,n,this.isSVGTag,s.transformTemplate,s.style)}renderInstance(e,n,s,i){Gu(e,n,s,i)}mount(e){this.isSVGTag=Io(e.tagName),super.mount(e)}}const Xu=Hn.length;function Oo(t){if(!t)return;if(!t.isControllingVariants){const n=t.parent?Oo(t.parent)||{}:{};return t.props.initial!==void 0&&(n.initial=t.props.initial),n}const e={};for(let n=0;n<Xu;n++){const s=Hn[n],i=t.props[s];(zt(i)||i===!1)&&(e[s]=i)}return e}function No(t,e){if(!Array.isArray(e))return!1;const n=e.length;if(n!==t.length)return!1;for(let s=0;s<n;s++)if(e[s]!==t[s])return!1;return!0}const Yu=[...Un].reverse(),Zu=Un.length;function Qu(t){return e=>Promise.all(e.map(({animation:n,options:s})=>Xc(t,n,s)))}function Ju(t){let e=Qu(t),n=Cs(),s=!0,i=!1;const r=c=>(u,f)=>{var d;const h=bt(t,f,c==="exit"?(d=t.presenceContext)==null?void 0:d.custom:void 0);if(h){const{transition:p,transitionEnd:y,...m}=h;u={...u,...m,...y}}return u};function o(c){e=c(t)}function a(c){const{props:u}=t,f=Oo(t.parent)||{},h=[],d=new Set;let p={},y=1/0;for(let g=0;g<Zu;g++){const v=Yu[g],x=n[v],T=u[v]!==void 0?u[v]:f[v],_=zt(T),C=v===c?x.isActive:null;C===!1&&(y=g);let k=T===f[v]&&T!==u[v]&&_;if(k&&(s||i)&&t.manuallyAnimateOnMount&&(k=!1),x.protectedKeys={...p},!x.isActive&&C===null||!T&&!x.prevProp||Se(T)||typeof T=="boolean")continue;if(v==="exit"&&x.isActive&&C!==!0){x.prevResolvedValues&&(p={...p,...x.prevResolvedValues});continue}const w=tf(x.prevProp,T);let A=w||v===c&&x.isActive&&!k&&_||g>y&&_,P=!1;const E=Array.isArray(T)?T:[T];let I=E.reduce(r(v),{});C===!1&&(I={});const{prevResolvedValues:j={}}=x,q={...j,...I},X=B=>{A=!0,d.has(B)&&(P=!0,d.delete(B)),x.needsAnimating[B]=!0;const Y=t.getValue(B);Y&&(Y.liveStyle=!1)};for(const B in q){const Y=I[B],pt=j[B];if(p.hasOwnProperty(B))continue;let kt=!1;an(Y)&&an(pt)?kt=!No(Y,pt)||w:kt=Y!==pt,kt?Y!=null?X(B):d.add(B):Y!==void 0&&d.has(B)?X(B):x.protectedKeys[B]=!0}x.prevProp=T,x.prevResolvedValues=I,x.isActive&&(p={...p,...I}),(s||i)&&t.blockInitialAnimation&&(A=!1);const K=k&&w;A&&(!K||P)&&h.push(...E.map(B=>{const Y={type:v};if(typeof B=="string"&&(s||i)&&!K&&t.manuallyAnimateOnMount&&t.parent){const{parent:pt}=t,kt=bt(pt,B);if(pt.enteringChildren&&kt){const{delayChildren:ar}=kt.transition||{};Y.delay=ro(pt.enteringChildren,t,ar)}}return{animation:B,options:Y}}))}if(d.size){const g={};if(typeof u.initial!="boolean"){const v=bt(t,Array.isArray(u.initial)?u.initial[0]:u.initial);v&&v.transition&&(g.transition=v.transition)}d.forEach(v=>{const x=t.getBaseTarget(v),T=t.getValue(v);T&&(T.liveStyle=!0),g[v]=x??null}),h.push({animation:g})}let m=!!h.length;return s&&(u.initial===!1||u.initial===u.animate)&&!t.manuallyAnimateOnMount&&(m=!1),s=!1,i=!1,m?e(h):Promise.resolve()}function l(c,u){var h;if(n[c].isActive===u)return Promise.resolve();(h=t.variantChildren)==null||h.forEach(d=>{var p;return(p=d.animationState)==null?void 0:p.setActive(c,u)}),n[c].isActive=u;const f=a(c);for(const d in n)n[d].protectedKeys={};return f}return{animateChanges:a,setActive:l,setAnimateFunction:o,getState:()=>n,reset:()=>{n=Cs(),i=!0}}}function tf(t,e){return typeof e=="string"?e!==t:Array.isArray(e)?!No(e,t):!1}function mt(t=!1){return{isActive:t,protectedKeys:{},needsAnimating:{},prevResolvedValues:{}}}function Cs(){return{animate:mt(!0),whileInView:mt(),whileHover:mt(),whileTap:mt(),whileDrag:mt(),whileFocus:mt(),exit:mt()}}function gn(t,e){t.min=e.min,t.max=e.max}function J(t,e){gn(t.x,e.x),gn(t.y,e.y)}function Es(t,e){t.translate=e.translate,t.scale=e.scale,t.originPoint=e.originPoint,t.origin=e.origin}const Fo=1e-4,ef=1-Fo,nf=1+Fo,jo=.01,sf=0-jo,of=0+jo;function W(t){return t.max-t.min}function rf(t,e,n){return Math.abs(t-e)<=n}function Vs(t,e,n,s=.5){t.origin=s,t.originPoint=D(e.min,e.max,t.origin),t.scale=W(n)/W(e),t.translate=D(n.min,n.max,t.origin)-t.originPoint,(t.scale>=ef&&t.scale<=nf||isNaN(t.scale))&&(t.scale=1),(t.translate>=sf&&t.translate<=of||isNaN(t.translate))&&(t.translate=0)}function Ot(t,e,n,s){Vs(t.x,e.x,n.x,s?s.originX:void 0),Vs(t.y,e.y,n.y,s?s.originY:void 0)}function Ds(t,e,n,s=0){const i=s?D(n.min,n.max,s):n.min;t.min=i+e.min,t.max=t.min+W(e)}function af(t,e,n,s){Ds(t.x,e.x,n.x,s==null?void 0:s.x),Ds(t.y,e.y,n.y,s==null?void 0:s.y)}function Rs(t,e,n,s=0){const i=s?D(n.min,n.max,s):n.min;t.min=e.min-i,t.max=t.min+W(e)}function ve(t,e,n,s){Rs(t.x,e.x,n.x,s==null?void 0:s.x),Rs(t.y,e.y,n.y,s==null?void 0:s.y)}function Ls(t,e,n,s,i){return t-=e,t=ge(t,1/n,s),i!==void 0&&(t=ge(t,1/i,s)),t}function lf(t,e=0,n=1,s=.5,i,r=t,o=t){if(it.test(e)&&(e=parseFloat(e),e=D(o.min,o.max,e/100)-o.min),typeof e!="number")return;let a=D(r.min,r.max,s);t===r&&(a-=e),t.min=Ls(t.min,e,n,a,i),t.max=Ls(t.max,e,n,a,i)}function Is(t,e,[n,s,i],r,o){lf(t,e[n],e[s],e[i],e.scale,r,o)}const cf=["x","scaleX","originX"],uf=["y","scaleY","originY"];function Bs(t,e,n,s){Is(t.x,e,cf,n?n.x:void 0,s?s.x:void 0),Is(t.y,e,uf,n?n.y:void 0,s?s.y:void 0)}function Os(t){return t.translate===0&&t.scale===1}function $o(t){return Os(t.x)&&Os(t.y)}function Ns(t,e){return t.min===e.min&&t.max===e.max}function ff(t,e){return Ns(t.x,e.x)&&Ns(t.y,e.y)}function Fs(t,e){return Math.round(t.min)===Math.round(e.min)&&Math.round(t.max)===Math.round(e.max)}function zo(t,e){return Fs(t.x,e.x)&&Fs(t.y,e.y)}function js(t){return W(t.x)/W(t.y)}function $s(t,e){return t.translate===e.translate&&t.scale===e.scale&&t.originPoint===e.originPoint}function nt(t){return[t("x"),t("y")]}function hf(t,e,n){let s="";const i=t.x.translate/e.x,r=t.y.translate/e.y,o=(n==null?void 0:n.z)||0;if((i||r||o)&&(s=`translate3d(${i}px, ${r}px, ${o}px) `),(e.x!==1||e.y!==1)&&(s+=`scale(${1/e.x}, ${1/e.y}) `),n){const{transformPerspective:c,rotate:u,pathRotation:f,rotateX:h,rotateY:d,skewX:p,skewY:y}=n;c&&(s=`perspective(${c}px) ${s}`),u&&(s+=`rotate(${u}deg) `),f&&(s+=`rotate(${f}deg) `),h&&(s+=`rotateX(${h}deg) `),d&&(s+=`rotateY(${d}deg) `),p&&(s+=`skewX(${p}deg) `),y&&(s+=`skewY(${y}deg) `)}const a=t.x.scale*e.x,l=t.y.scale*e.y;return(a!==1||l!==1)&&(s+=`scale(${a}, ${l})`),s||"none"}const df=Fn.length,zs=t=>typeof t=="string"?parseFloat(t):t,Us=t=>typeof t=="number"||M.test(t);function pf(t,e,n,s,i,r){i?(t.opacity=D(0,n.opacity??1,mf(s)),t.opacityExit=D(e.opacity??1,0,yf(s))):r&&(t.opacity=D(e.opacity??1,n.opacity??1,s));for(let o=0;o<df;o++){const a=Fn[o];let l=Hs(e,a),c=Hs(n,a);if(l===void 0&&c===void 0)continue;l||(l=0),c||(c=0),l===0||c===0||Us(l)===Us(c)?(t[a]=Math.max(D(zs(l),zs(c),s),0),(it.test(c)||it.test(l))&&(t[a]+="%")):t[a]=c}(e.rotate||n.rotate)&&(t.rotate=D(e.rotate||0,n.rotate||0,s))}function Hs(t,e){return t[e]!==void 0?t[e]:t.borderRadius}const mf=Uo(0,.5,Li),yf=Uo(.5,.95,Q);function Uo(t,e,n){return s=>s<t?0:s>e?1:n(jt(t,e,s))}function gf(t,e,n){const s=z(t)?t:Ct(t);return s.start(Bn("",s,e,n)),s.animation}function Ut(t,e,n,s={passive:!0}){return t.addEventListener(e,n,s),()=>t.removeEventListener(e,n,s)}const vf=(t,e)=>t.depth-e.depth;class xf{constructor(){this.children=[],this.isDirty=!1}add(e){kn(this.children,e),this.isDirty=!0}remove(e){ue(this.children,e),this.isDirty=!0}forEach(e){this.isDirty&&this.children.sort(vf),this.isDirty=!1,this.children.forEach(e)}}function Tf(t,e){const n=H.now(),s=({timestamp:i})=>{const r=i-n;r>=e&&(ht(s),t(r-e))};return R.setup(s,!0),()=>ht(s)}function le(t){return z(t)?t.get():t}class bf{constructor(){this.members=[]}add(e){kn(this.members,e);for(let n=this.members.length-1;n>=0;n--){const s=this.members[n];if(s===e||s===this.lead||s===this.prevLead)continue;const i=s.instance;(!i||i.isConnected===!1)&&!s.snapshot&&(ue(this.members,s),s.unmount())}e.scheduleRender()}remove(e){if(ue(this.members,e),e===this.prevLead&&(this.prevLead=void 0),e===this.lead){const n=this.members[this.members.length-1];n&&this.promote(n)}}relegate(e){var n;for(let s=this.members.indexOf(e)-1;s>=0;s--){const i=this.members[s];if(i.isPresent!==!1&&((n=i.instance)==null?void 0:n.isConnected)!==!1)return this.promote(i),!0}return!1}promote(e,n){var i;const s=this.lead;if(e!==s&&(this.prevLead=s,this.lead=e,e.show(),s)){s.updateSnapshot(),e.scheduleRender();const{layoutDependency:r}=s.options,{layoutDependency:o}=e.options;(r===void 0||r!==o)&&(e.resumeFrom=s,n&&(s.preserveOpacity=!0),s.snapshot&&(e.snapshot=s.snapshot,e.snapshot.latestValues=s.animationValues||s.latestValues),(i=e.root)!=null&&i.isUpdating&&(e.isLayoutDirty=!0)),e.options.crossfade===!1&&s.hide()}}exitAnimationComplete(){this.members.forEach(e=>{var n,s,i,r,o;(s=(n=e.options).onExitComplete)==null||s.call(n),(o=(i=e.resumingFrom)==null?void 0:(r=i.options).onExitComplete)==null||o.call(r)})}scheduleRender(){this.members.forEach(e=>e.instance&&e.scheduleRender(!1))}removeLeadSnapshot(){var e;(e=this.lead)!=null&&e.snapshot&&(this.lead.snapshot=void 0)}}const ce={hasAnimatedSinceResize:!0,hasEverUpdated:!1},Be=["","X","Y","Z"],wf=1e3;let kf=0;function Oe(t,e,n,s){const{latestValues:i}=e;i[t]&&(n[t]=i[t],e.setStaticValue(t,0),s&&(s[t]=0))}function Ho(t){if(t.hasCheckedOptimisedAppear=!0,t.root===t)return;const{visualElement:e}=t.options;if(!e)return;const n=fo(e);if(window.MotionHasOptimisedAnimation(n,"transform")){const{layout:i,layoutId:r}=t.options;window.MotionCancelOptimisedAnimation(n,"transform",R,!(i||r))}const{parent:s}=t;s&&!s.hasCheckedOptimisedAppear&&Ho(s)}function Wo({attachResizeListener:t,defaultParent:e,measureScroll:n,checkIsScrollRoot:s,resetTransform:i}){return class{constructor(o={},a=e==null?void 0:e()){this.id=kf++,this.animationId=0,this.animationCommitId=0,this.children=new Set,this.options={},this.isTreeAnimating=!1,this.isAnimationBlocked=!1,this.isLayoutDirty=!1,this.isProjectionDirty=!1,this.isSharedProjectionDirty=!1,this.isTransformDirty=!1,this.updateManuallyBlocked=!1,this.updateBlockedByResize=!1,this.isUpdating=!1,this.isSVG=!1,this.needsReset=!1,this.shouldResetTransform=!1,this.hasCheckedOptimisedAppear=!1,this.treeScale={x:1,y:1},this.eventHandlers=new Map,this.hasTreeAnimated=!1,this.layoutVersion=0,this.updateScheduled=!1,this.scheduleUpdate=()=>this.update(),this.projectionUpdateScheduled=!1,this.checkUpdateFailed=()=>{this.isUpdating&&(this.isUpdating=!1,this.clearAllSnapshots())},this.updateProjection=()=>{this.projectionUpdateScheduled=!1,this.nodes.forEach(Mf),this.nodes.forEach(Df),this.nodes.forEach(Rf),this.nodes.forEach(Pf)},this.resolvedRelativeTargetAt=0,this.linkedParentVersion=0,this.hasProjected=!1,this.isVisible=!0,this.animationProgress=0,this.sharedNodes=new Map,this.latestValues=o,this.root=a?a.root||a:this,this.path=a?[...a.path,a]:[],this.parent=a,this.depth=a?a.depth+1:0;for(let l=0;l<this.path.length;l++)this.path[l].shouldResetTransform=!0;this.root===this&&(this.nodes=new xf)}addEventListener(o,a){return this.eventHandlers.has(o)||this.eventHandlers.set(o,new Sn),this.eventHandlers.get(o).add(a)}notifyListeners(o,...a){const l=this.eventHandlers.get(o);l&&l.notify(...a)}hasListeners(o){return this.eventHandlers.has(o)}mount(o){if(this.instance)return;this.isSVG=zn(o)&&!_u(o),this.instance=o;const{layoutId:a,layout:l,visualElement:c}=this.options;if(c&&!c.current&&c.mount(o),this.root.nodes.add(this),this.parent&&this.parent.children.add(this),this.root.hasTreeAnimated&&(l||a)&&(this.isLayoutDirty=!0),t){let u,f=0;const h=()=>this.root.updateBlockedByResize=!1;R.read(()=>{f=window.innerWidth}),t(o,()=>{const d=window.innerWidth;d!==f&&(f=d,this.root.updateBlockedByResize=!0,u&&u(),u=Tf(h,250),ce.hasAnimatedSinceResize&&(ce.hasAnimatedSinceResize=!1,this.nodes.forEach(Gs)))})}a&&this.root.registerSharedNode(a,this),this.options.animate!==!1&&c&&(a||l)&&this.addEventListener("didUpdate",({delta:u,hasLayoutChanged:f,hasRelativeLayoutChanged:h,layout:d})=>{if(this.isTreeAnimationBlocked()){this.target=void 0,this.relativeTarget=void 0;return}const p=this.options.transition||c.getDefaultTransition()||Nf,{onLayoutAnimationStart:y,onLayoutAnimationComplete:m}=c.getProps(),g=!this.targetLayout||!zo(this.targetLayout,d),v=!f&&h;if(this.options.layoutRoot||this.resumeFrom||v||f&&(g||!this.currentAnimation)){this.resumeFrom&&(this.resumingFrom=this.resumeFrom,this.resumingFrom.resumingFrom=void 0);const x={...In(p,"layout"),onPlay:y,onComplete:m};(c.shouldReduceMotion||this.options.layoutRoot)&&(x.delay=0,x.type=!1),this.startAnimation(x),this.setAnimationOrigin(u,v,x.path)}else f||Gs(this),this.isLead()&&this.options.onExitComplete&&this.options.onExitComplete();this.targetLayout=d})}unmount(){this.options.layoutId&&this.willUpdate(),this.root.nodes.remove(this);const o=this.getStack();o&&o.remove(this),this.parent&&this.parent.children.delete(this),this.instance=void 0,this.eventHandlers.clear(),ht(this.updateProjection)}blockUpdate(){this.updateManuallyBlocked=!0}unblockUpdate(){this.updateManuallyBlocked=!1}isUpdateBlocked(){return this.updateManuallyBlocked||this.updateBlockedByResize}isTreeAnimationBlocked(){return this.isAnimationBlocked||this.parent&&this.parent.isTreeAnimationBlocked()||!1}startUpdate(){this.isUpdateBlocked()||(this.isUpdating=!0,this.nodes&&this.nodes.forEach(Lf),this.animationId++)}getTransformTemplate(){const{visualElement:o}=this.options;return o&&o.getProps().transformTemplate}willUpdate(o=!0){if(this.root.hasTreeAnimated=!0,this.root.isUpdateBlocked()){this.options.onExitComplete&&this.options.onExitComplete();return}if(window.MotionCancelOptimisedAnimation&&!this.hasCheckedOptimisedAppear&&Ho(this),!this.root.isUpdating&&this.root.startUpdate(),this.isLayoutDirty)return;this.isLayoutDirty=!0;for(let u=0;u<this.path.length;u++){const f=this.path[u];f.shouldResetTransform=!0,(typeof f.latestValues.x=="string"||typeof f.latestValues.y=="string")&&(f.isLayoutDirty=!0),f.updateScroll("snapshot"),f.options.layoutRoot&&f.willUpdate(!1)}const{layoutId:a,layout:l}=this.options;if(a===void 0&&!l)return;const c=this.getTransformTemplate();this.prevTransformTemplateValue=c?c(this.latestValues,""):void 0,this.updateSnapshot(),o&&this.notifyListeners("willUpdate")}update(){if(this.updateScheduled=!1,this.isUpdateBlocked()){const l=this.updateBlockedByResize;this.unblockUpdate(),this.updateBlockedByResize=!1,this.clearAllSnapshots(),l&&this.nodes.forEach(Cf),this.nodes.forEach(Ws);return}if(this.animationId<=this.animationCommitId){this.nodes.forEach(Ks);return}this.animationCommitId=this.animationId,this.isUpdating?(this.isUpdating=!1,this.nodes.forEach(Ef),this.nodes.forEach(Vf),this.nodes.forEach(_f),this.nodes.forEach(Sf)):this.nodes.forEach(Ks),this.clearAllSnapshots();const a=H.now();$.delta=ot(0,1e3/60,a-$.timestamp),$.timestamp=a,$.isProcessing=!0,Ae.update.process($),Ae.preRender.process($),Ae.render.process($),$.isProcessing=!1}didUpdate(){this.updateScheduled||(this.updateScheduled=!0,jn.read(this.scheduleUpdate))}clearAllSnapshots(){this.nodes.forEach(Af),this.sharedNodes.forEach(If)}scheduleUpdateProjection(){this.projectionUpdateScheduled||(this.projectionUpdateScheduled=!0,R.preRender(this.updateProjection,!1,!0))}scheduleCheckAfterUnmount(){R.postRender(()=>{this.isLayoutDirty?this.root.didUpdate():this.root.checkUpdateFailed()})}updateSnapshot(){this.snapshot||!this.instance||(this.snapshot=this.measure(),this.snapshot&&!W(this.snapshot.measuredBox.x)&&!W(this.snapshot.measuredBox.y)&&(this.snapshot=void 0))}updateLayout(){if(!this.instance||(this.updateScroll(),!(this.options.alwaysMeasureLayout&&this.isLead())&&!this.isLayoutDirty))return;if(this.resumeFrom&&!this.resumeFrom.instance)for(let l=0;l<this.path.length;l++)this.path[l].updateScroll();const o=this.layout;this.layout=this.measure(!1),this.layoutVersion++,this.layoutCorrected||(this.layoutCorrected=F()),this.isLayoutDirty=!1,this.projectionDelta=void 0,this.notifyListeners("measure",this.layout.layoutBox);const{visualElement:a}=this.options;a&&a.notify("LayoutMeasure",this.layout.layoutBox,o?o.layoutBox:void 0)}updateScroll(o="measure"){let a=!!(this.options.layoutScroll&&this.instance);if(this.scroll&&this.scroll.animationId===this.root.animationId&&this.scroll.phase===o&&(a=!1),a&&this.instance){const l=s(this.instance);this.scroll={animationId:this.root.animationId,phase:o,isRoot:l,offset:n(this.instance),wasRoot:this.scroll?this.scroll.isRoot:l}}}resetTransform(){if(!i)return;const o=this.isLayoutDirty||this.shouldResetTransform||this.options.alwaysMeasureLayout,a=this.projectionDelta&&!$o(this.projectionDelta),l=this.getTransformTemplate(),c=l?l(this.latestValues,""):void 0,u=c!==this.prevTransformTemplateValue;o&&this.instance&&(a||yt(this.latestValues)||u)&&(i(this.instance,c),this.shouldResetTransform=!1,this.scheduleRender())}measure(o=!0){const a=this.measurePageBox();let l=this.removeElementScroll(a);return o&&(l=this.removeTransform(l)),Ff(l),{animationId:this.root.animationId,measuredBox:a,layoutBox:l,latestValues:{},source:this.id}}measurePageBox(){var c;const{visualElement:o}=this.options;if(!o)return F();const a=o.measureViewportBox();if(!(((c=this.scroll)==null?void 0:c.wasRoot)||this.path.some(jf))){const{scroll:u}=this.root;u&&(st(a.x,u.offset.x),st(a.y,u.offset.y))}return a}removeElementScroll(o){var l;const a=F();if(J(a,o),(l=this.scroll)!=null&&l.wasRoot)return a;for(let c=0;c<this.path.length;c++){const u=this.path[c],{scroll:f,options:h}=u;u!==this.root&&f&&h.layoutScroll&&(f.wasRoot&&J(a,o),st(a.x,f.offset.x),st(a.y,f.offset.y))}return a}applyTransform(o,a=!1,l){var u,f;const c=l||F();J(c,o);for(let h=0;h<this.path.length;h++){const d=this.path[h];!a&&d.options.layoutScroll&&d.scroll&&d!==d.root&&(st(c.x,-d.scroll.offset.x),st(c.y,-d.scroll.offset.y)),yt(d.latestValues)&&ae(c,d.latestValues,(u=d.layout)==null?void 0:u.layoutBox)}return yt(this.latestValues)&&ae(c,this.latestValues,(f=this.layout)==null?void 0:f.layoutBox),c}removeTransform(o){var l;const a=F();J(a,o);for(let c=0;c<this.path.length;c++){const u=this.path[c];if(!yt(u.latestValues))continue;let f;u.instance&&(pn(u.latestValues)&&u.updateSnapshot(),f=F(),J(f,u.measurePageBox())),Bs(a,u.latestValues,(l=u.snapshot)==null?void 0:l.layoutBox,f)}return yt(this.latestValues)&&Bs(a,this.latestValues),a}setTargetDelta(o){this.targetDelta=o,this.root.scheduleUpdateProjection(),this.isProjectionDirty=!0}setOptions(o){this.options={...this.options,...o,crossfade:o.crossfade!==void 0?o.crossfade:!0}}clearMeasurements(){this.scroll=void 0,this.layout=void 0,this.snapshot=void 0,this.prevTransformTemplateValue=void 0,this.targetDelta=void 0,this.target=void 0,this.isLayoutDirty=!1}forceRelativeParentToResolveTarget(){this.relativeParent&&this.relativeParent.resolvedRelativeTargetAt!==$.timestamp&&this.relativeParent.resolveTargetDelta(!0)}resolveTargetDelta(o=!1){var d;const a=this.getLead();this.isProjectionDirty||(this.isProjectionDirty=a.isProjectionDirty),this.isTransformDirty||(this.isTransformDirty=a.isTransformDirty),this.isSharedProjectionDirty||(this.isSharedProjectionDirty=a.isSharedProjectionDirty);const l=!!this.resumingFrom||this!==a;if(!(o||l&&this.isSharedProjectionDirty||this.isProjectionDirty||(d=this.parent)!=null&&d.isProjectionDirty||this.attemptToResolveRelativeTarget||this.root.updateBlockedByResize))return;const{layout:u,layoutId:f}=this.options;if(!this.layout||!(u||f))return;this.resolvedRelativeTargetAt=$.timestamp;const h=this.getClosestProjectingParent();h&&this.linkedParentVersion!==h.layoutVersion&&!h.options.layoutRoot&&this.removeRelativeTarget(),!this.targetDelta&&!this.relativeTarget&&(this.options.layoutAnchor!==!1&&h&&h.layout?this.createRelativeTarget(h,this.layout.layoutBox,h.layout.layoutBox):this.removeRelativeTarget()),!(!this.relativeTarget&&!this.targetDelta)&&(this.target||(this.target=F(),this.targetWithTransforms=F()),this.relativeTarget&&this.relativeTargetOrigin&&this.relativeParent&&this.relativeParent.target?(this.forceRelativeParentToResolveTarget(),af(this.target,this.relativeTarget,this.relativeParent.target,this.options.layoutAnchor||void 0)):this.targetDelta?(this.resumingFrom?this.applyTransform(this.layout.layoutBox,!1,this.target):J(this.target,this.layout.layoutBox),Co(this.target,this.targetDelta)):J(this.target,this.layout.layoutBox),this.attemptToResolveRelativeTarget&&(this.attemptToResolveRelativeTarget=!1,this.options.layoutAnchor!==!1&&h&&!!h.resumingFrom==!!this.resumingFrom&&!h.options.layoutScroll&&h.target&&this.animationProgress!==1?this.createRelativeTarget(h,this.target,h.target):this.relativeParent=this.relativeTarget=void 0))}getClosestProjectingParent(){if(!(!this.parent||pn(this.parent.latestValues)||Ao(this.parent.latestValues)))return this.parent.isProjecting()?this.parent:this.parent.getClosestProjectingParent()}isProjecting(){return!!((this.relativeTarget||this.targetDelta||this.options.layoutRoot)&&this.layout)}createRelativeTarget(o,a,l){this.relativeParent=o,this.linkedParentVersion=o.layoutVersion,this.forceRelativeParentToResolveTarget(),this.relativeTarget=F(),this.relativeTargetOrigin=F(),ve(this.relativeTargetOrigin,a,l,this.options.layoutAnchor||void 0),J(this.relativeTarget,this.relativeTargetOrigin)}removeRelativeTarget(){this.relativeParent=this.relativeTarget=void 0}calcProjection(){var p;const o=this.getLead(),a=!!this.resumingFrom||this!==o;let l=!0;if((this.isProjectionDirty||(p=this.parent)!=null&&p.isProjectionDirty)&&(l=!1),a&&(this.isSharedProjectionDirty||this.isTransformDirty)&&(l=!1),this.resolvedRelativeTargetAt===$.timestamp&&(l=!1),l)return;const{layout:c,layoutId:u}=this.options;if(this.isTreeAnimating=!!(this.parent&&this.parent.isTreeAnimating||this.currentAnimation||this.pendingAnimation),this.isTreeAnimating||(this.targetDelta=this.relativeTarget=void 0),!this.layout||!(c||u))return;J(this.layoutCorrected,this.layout.layoutBox);const f=this.treeScale.x,h=this.treeScale.y;Iu(this.layoutCorrected,this.treeScale,this.path,a),o.layout&&!o.target&&(this.treeScale.x!==1||this.treeScale.y!==1)&&(o.target=o.layout.layoutBox,o.targetWithTransforms=F());const{target:d}=o;if(!d){this.prevProjectionDelta&&(this.createProjectionDeltas(),this.scheduleRender());return}!this.projectionDelta||!this.prevProjectionDelta?this.createProjectionDeltas():(Es(this.prevProjectionDelta.x,this.projectionDelta.x),Es(this.prevProjectionDelta.y,this.projectionDelta.y)),Ot(this.projectionDelta,this.layoutCorrected,d,this.latestValues),(this.treeScale.x!==f||this.treeScale.y!==h||!$s(this.projectionDelta.x,this.prevProjectionDelta.x)||!$s(this.projectionDelta.y,this.prevProjectionDelta.y))&&(this.hasProjected=!0,this.scheduleRender(),this.notifyListeners("projectionUpdate",d))}hide(){this.isVisible=!1}show(){this.isVisible=!0}scheduleRender(o=!0){var a;if((a=this.options.visualElement)==null||a.scheduleRender(),o){const l=this.getStack();l&&l.scheduleRender()}this.resumingFrom&&!this.resumingFrom.instance&&(this.resumingFrom=void 0)}createProjectionDeltas(){this.prevProjectionDelta=Pt(),this.projectionDelta=Pt(),this.projectionDeltaWithTransform=Pt()}setAnimationOrigin(o,a=!1,l){const c=this.snapshot,u=c?c.latestValues:{},f={...this.latestValues},h=Pt();(!this.relativeParent||!this.relativeParent.options.layoutRoot)&&(this.relativeTarget=this.relativeTargetOrigin=void 0),this.attemptToResolveRelativeTarget=!a;const d=F(),p=c?c.source:void 0,y=this.layout?this.layout.source:void 0,m=p!==y,g=this.getStack(),v=!g||g.members.length<=1,x=!!(m&&!v&&this.options.crossfade===!0&&!this.path.some(Of));this.animationProgress=0;let T;const _=l==null?void 0:l.interpolateProjection(o);this.mixTargetDelta=C=>{const k=C/1e3,w=_==null?void 0:_(k);w?(h.x.translate=w.x,h.x.scale=D(o.x.scale,1,k),h.x.origin=o.x.origin,h.x.originPoint=o.x.originPoint,h.y.translate=w.y,h.y.scale=D(o.y.scale,1,k),h.y.origin=o.y.origin,h.y.originPoint=o.y.originPoint):(qs(h.x,o.x,k),qs(h.y,o.y,k)),this.setTargetDelta(h),this.relativeTarget&&this.relativeTargetOrigin&&this.layout&&this.relativeParent&&this.relativeParent.layout&&(ve(d,this.layout.layoutBox,this.relativeParent.layout.layoutBox,this.options.layoutAnchor||void 0),Bf(this.relativeTarget,this.relativeTargetOrigin,d,k),T&&ff(this.relativeTarget,T)&&(this.isProjectionDirty=!1),T||(T=F()),J(T,this.relativeTarget)),m&&(this.animationValues=f,pf(f,u,this.latestValues,k,x,v)),w&&w.rotate!==void 0&&(this.animationValues||(this.animationValues=f),this.animationValues.pathRotation=w.rotate),this.root.scheduleUpdateProjection(),this.scheduleRender(),this.animationProgress=k},this.mixTargetDelta(this.options.layoutRoot?1e3:0)}startAnimation(o){var a,l,c;this.notifyListeners("animationStart"),(a=this.currentAnimation)==null||a.stop(),(c=(l=this.resumingFrom)==null?void 0:l.currentAnimation)==null||c.stop(),this.pendingAnimation&&(ht(this.pendingAnimation),this.pendingAnimation=void 0),this.pendingAnimation=R.update(()=>{ce.hasAnimatedSinceResize=!0,this.motionValue||(this.motionValue=Ct(0)),this.motionValue.jump(0,!1),this.currentAnimation=gf(this.motionValue,[0,1e3],{...o,velocity:0,isSync:!0,onUpdate:u=>{this.mixTargetDelta(u),o.onUpdate&&o.onUpdate(u)},onComplete:()=>{o.onComplete&&o.onComplete(),this.completeAnimation()}}),this.resumingFrom&&(this.resumingFrom.currentAnimation=this.currentAnimation),this.pendingAnimation=void 0})}completeAnimation(){this.resumingFrom&&(this.resumingFrom.currentAnimation=void 0,this.resumingFrom.preserveOpacity=void 0);const o=this.getStack();o&&o.exitAnimationComplete(),this.resumingFrom=this.currentAnimation=this.animationValues=void 0,this.notifyListeners("animationComplete")}finishAnimation(){this.currentAnimation&&(this.mixTargetDelta&&this.mixTargetDelta(wf),this.currentAnimation.stop()),this.completeAnimation()}applyTransformsToTarget(){const o=this.getLead();let{targetWithTransforms:a,target:l,layout:c,latestValues:u}=o;if(!(!a||!l||!c)){if(this!==o&&this.layout&&c&&Ko(this.options.animationType,this.layout.layoutBox,c.layoutBox)){l=this.target||F();const f=W(this.layout.layoutBox.x);l.x.min=o.target.x.min,l.x.max=l.x.min+f;const h=W(this.layout.layoutBox.y);l.y.min=o.target.y.min,l.y.max=l.y.min+h}J(a,l),ae(a,u),Ot(this.projectionDeltaWithTransform,this.layoutCorrected,a,u)}}registerSharedNode(o,a){this.sharedNodes.has(o)||this.sharedNodes.set(o,new bf),this.sharedNodes.get(o).add(a);const c=a.options.initialPromotionConfig;a.promote({transition:c?c.transition:void 0,preserveFollowOpacity:c&&c.shouldPreserveFollowOpacity?c.shouldPreserveFollowOpacity(a):void 0})}isLead(){const o=this.getStack();return o?o.lead===this:!0}getLead(){var a;const{layoutId:o}=this.options;return o?((a=this.getStack())==null?void 0:a.lead)||this:this}getPrevLead(){var a;const{layoutId:o}=this.options;return o?(a=this.getStack())==null?void 0:a.prevLead:void 0}getStack(){const{layoutId:o}=this.options;if(o)return this.root.sharedNodes.get(o)}promote({needsReset:o,transition:a,preserveFollowOpacity:l}={}){const c=this.getStack();c&&c.promote(this,l),o&&(this.projectionDelta=void 0,this.needsReset=!0),a&&this.setOptions({transition:a})}relegate(){const o=this.getStack();return o?o.relegate(this):!1}resetSkewAndRotation(){const{visualElement:o}=this.options;if(!o)return;let a=!1;const{latestValues:l}=o;if((l.z||l.rotate||l.rotateX||l.rotateY||l.rotateZ||l.skewX||l.skewY)&&(a=!0),!a)return;const c={};l.z&&Oe("z",o,c,this.animationValues);for(let u=0;u<Be.length;u++)Oe(`rotate${Be[u]}`,o,c,this.animationValues),Oe(`skew${Be[u]}`,o,c,this.animationValues);o.render();for(const u in c)o.setStaticValue(u,c[u]),this.animationValues&&(this.animationValues[u]=c[u]);o.scheduleRender()}applyProjectionStyles(o,a){if(!this.instance||this.isSVG)return;if(!this.isVisible){o.visibility="hidden";return}const l=this.getTransformTemplate();if(this.needsReset){this.needsReset=!1,o.visibility="",o.opacity="",o.pointerEvents=le(a==null?void 0:a.pointerEvents)||"",o.transform=l?l(this.latestValues,""):"none";return}const c=this.getLead();if(!this.projectionDelta||!this.layout||!c.target){this.options.layoutId&&(o.opacity=this.latestValues.opacity!==void 0?this.latestValues.opacity:1,o.pointerEvents=le(a==null?void 0:a.pointerEvents)||""),this.hasProjected&&!yt(this.latestValues)&&(o.transform=l?l({},""):"none",this.hasProjected=!1);return}o.visibility="";const u=c.animationValues||c.latestValues;this.applyTransformsToTarget();let f=hf(this.projectionDeltaWithTransform,this.treeScale,u);l&&(f=l(u,f)),o.transform=f;const{x:h,y:d}=this.projectionDelta;o.transformOrigin=`${h.origin*100}% ${d.origin*100}% 0`,c.animationValues?o.opacity=c===this?u.opacity??this.latestValues.opacity??1:this.preserveOpacity?this.latestValues.opacity:u.opacityExit:o.opacity=c===this?u.opacity!==void 0?u.opacity:"":u.opacityExit!==void 0?u.opacityExit:0;for(const p in yn){if(u[p]===void 0)continue;const{correct:y,applyTo:m,isCSSVariable:g}=yn[p],v=f==="none"?u[p]:y(u[p],c);if(m){const x=m.length;for(let T=0;T<x;T++)o[m[T]]=v}else g?this.options.visualElement.renderState.vars[p]=v:o[p]=v}this.options.layoutId&&(o.pointerEvents=c===this?le(a==null?void 0:a.pointerEvents)||"":"none")}clearSnapshot(){this.resumeFrom=this.snapshot=void 0}resetTree(){this.root.nodes.forEach(o=>{var a;return(a=o.currentAnimation)==null?void 0:a.stop()}),this.root.nodes.forEach(Ws),this.root.sharedNodes.clear()}}}function _f(t){t.updateLayout()}function Sf(t){var n;const e=((n=t.resumeFrom)==null?void 0:n.snapshot)||t.snapshot;if(t.isLead()&&t.layout&&e&&t.hasListeners("didUpdate")){const{layoutBox:s,measuredBox:i}=t.layout,{animationType:r}=t.options,o=e.source!==t.layout.source;if(r==="size")nt(f=>{const h=o?e.measuredBox[f]:e.layoutBox[f],d=W(h);h.min=s[f].min,h.max=h.min+d});else if(r==="x"||r==="y"){const f=r==="x"?"y":"x";gn(o?e.measuredBox[f]:e.layoutBox[f],s[f])}else Ko(r,e.layoutBox,s)&&nt(f=>{const h=o?e.measuredBox[f]:e.layoutBox[f],d=W(s[f]);h.max=h.min+d,t.relativeTarget&&!t.currentAnimation&&(t.isProjectionDirty=!0,t.relativeTarget[f].max=t.relativeTarget[f].min+d)});const a=Pt();Ot(a,s,e.layoutBox);const l=Pt();o?Ot(l,t.applyTransform(i,!0),e.measuredBox):Ot(l,s,e.layoutBox);const c=!$o(a);let u=!1;if(!t.resumeFrom){const f=t.getClosestProjectingParent();if(f&&!f.resumeFrom){const{snapshot:h,layout:d}=f;if(h&&d){const p=t.options.layoutAnchor||void 0,y=F();ve(y,e.layoutBox,h.layoutBox,p);const m=F();ve(m,s,d.layoutBox,p),zo(y,m)||(u=!0),f.options.layoutRoot&&(t.relativeTarget=m,t.relativeTargetOrigin=y,t.relativeParent=f)}}}t.notifyListeners("didUpdate",{layout:s,snapshot:e,delta:l,layoutDelta:a,hasLayoutChanged:c,hasRelativeLayoutChanged:u})}else if(t.isLead()){const{onExitComplete:s}=t.options;s&&s()}t.options.transition=void 0}function Mf(t){t.parent&&(t.isProjecting()||(t.isProjectionDirty=t.parent.isProjectionDirty),t.isSharedProjectionDirty||(t.isSharedProjectionDirty=!!(t.isProjectionDirty||t.parent.isProjectionDirty||t.parent.isSharedProjectionDirty)),t.isTransformDirty||(t.isTransformDirty=t.parent.isTransformDirty))}function Pf(t){t.isProjectionDirty=t.isSharedProjectionDirty=t.isTransformDirty=!1}function Af(t){t.clearSnapshot()}function Ws(t){t.clearMeasurements()}function Cf(t){t.isLayoutDirty=!0,t.updateLayout()}function Ks(t){t.isLayoutDirty=!1}function Ef(t){t.isAnimationBlocked&&t.layout&&!t.isLayoutDirty&&(t.snapshot=t.layout,t.isLayoutDirty=!0)}function Vf(t){const{visualElement:e}=t.options;e&&e.getProps().onBeforeLayoutMeasure&&e.notify("BeforeLayoutMeasure"),t.resetTransform()}function Gs(t){t.finishAnimation(),t.targetDelta=t.relativeTarget=t.target=void 0,t.isProjectionDirty=!0}function Df(t){t.resolveTargetDelta()}function Rf(t){t.calcProjection()}function Lf(t){t.resetSkewAndRotation()}function If(t){t.removeLeadSnapshot()}function qs(t,e,n){t.translate=D(e.translate,0,n),t.scale=D(e.scale,1,n),t.origin=e.origin,t.originPoint=e.originPoint}function Xs(t,e,n,s){t.min=D(e.min,n.min,s),t.max=D(e.max,n.max,s)}function Bf(t,e,n,s){Xs(t.x,e.x,n.x,s),Xs(t.y,e.y,n.y,s)}function Of(t){return t.animationValues&&t.animationValues.opacityExit!==void 0}const Nf={duration:.45,ease:[.4,0,.1,1]},Ys=t=>typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().includes(t),Zs=Ys("applewebkit/")&&!Ys("chrome/")?Math.round:Q;function Qs(t){t.min=Zs(t.min),t.max=Zs(t.max)}function Ff(t){Qs(t.x),Qs(t.y)}function Ko(t,e,n){return t==="position"||t==="preserve-aspect"&&!rf(js(e),js(n),.2)}function jf(t){var e;return t!==t.root&&((e=t.scroll)==null?void 0:e.wasRoot)}const $f=Wo({attachResizeListener:(t,e)=>Ut(t,"resize",e),measureScroll:()=>{var t,e;return{x:document.documentElement.scrollLeft||((t=document.body)==null?void 0:t.scrollLeft)||0,y:document.documentElement.scrollTop||((e=document.body)==null?void 0:e.scrollTop)||0}},checkIsScrollRoot:()=>!0}),Ne={current:void 0},Go=Wo({measureScroll:t=>({x:t.scrollLeft,y:t.scrollTop}),defaultParent:()=>{if(!Ne.current){const t=new $f({});t.mount(window),t.setOptions({layoutScroll:!0}),Ne.current=t}return Ne.current},resetTransform:(t,e)=>{t.style.transform=e!==void 0?e:"none"},checkIsScrollRoot:t=>window.getComputedStyle(t).position==="fixed"}),Gn=b.createContext({transformPagePoint:t=>t,isStatic:!1,reducedMotion:"never"});function Js(t,e){if(typeof t=="function")return t(e);t!=null&&(t.current=e)}function zf(...t){return e=>{let n=!1;const s=t.map(i=>{const r=Js(i,e);return!n&&typeof r=="function"&&(n=!0),r});if(n)return()=>{for(let i=0;i<s.length;i++){const r=s[i];typeof r=="function"?r():Js(t[i],null)}}}}function Uf(...t){return b.useCallback(zf(...t),t)}class Hf extends b.Component{getSnapshotBeforeUpdate(e){const n=this.props.childRef.current;if(se(n)&&e.isPresent&&!this.props.isPresent&&this.props.pop!==!1){const s=n.offsetParent,i=se(s)&&s.offsetWidth||0,r=se(s)&&s.offsetHeight||0,o=getComputedStyle(n),a=this.props.sizeRef.current;a.height=parseFloat(o.height),a.width=parseFloat(o.width),a.top=n.offsetTop,a.left=n.offsetLeft,a.right=i-a.width-a.left,a.bottom=r-a.height-a.top,a.direction=o.direction}return null}componentDidUpdate(){}render(){return this.props.children}}function Wf({children:t,isPresent:e,anchorX:n,anchorY:s,root:i,pop:r}){var h;const o=b.useId(),a=b.useRef(null),l=b.useRef({width:0,height:0,top:0,left:0,right:0,bottom:0,direction:"ltr"}),{nonce:c}=b.useContext(Gn),u=((h=t.props)==null?void 0:h.ref)??(t==null?void 0:t.ref),f=Uf(a,u);return b.useInsertionEffect(()=>{const{width:d,height:p,top:y,left:m,right:g,bottom:v,direction:x}=l.current;if(e||r===!1||!a.current||!d||!p)return;const T=x==="rtl",_=n==="left"?T?`right: ${g}`:`left: ${m}`:T?`left: ${m}`:`right: ${g}`,C=s==="bottom"?`bottom: ${v}`:`top: ${y}`;a.current.dataset.motionPopId=o;const k=document.createElement("style");c&&(k.nonce=c);const w=i??document.head;return w.appendChild(k),k.sheet&&k.sheet.insertRule(`
          [data-motion-pop-id="${o}"] {
            position: absolute !important;
            width: ${d}px !important;
            height: ${p}px !important;
            ${_}px !important;
            ${C}px !important;
          }
        `),()=>{var A;(A=a.current)==null||A.removeAttribute("data-motion-pop-id"),w.contains(k)&&w.removeChild(k)}},[e]),at.jsx(Hf,{isPresent:e,childRef:a,sizeRef:l,pop:r,children:r===!1?t:b.cloneElement(t,{ref:f})})}const Kf=({children:t,initial:e,isPresent:n,onExitComplete:s,custom:i,presenceAffectsLayout:r,mode:o,anchorX:a,anchorY:l,root:c})=>{const u=bn(Gf),f=b.useId(),h=b.useRef(n),d=b.useRef(s);wn(()=>{h.current=n,d.current=s});let p=!0,y=b.useMemo(()=>(p=!1,{id:f,initial:e,isPresent:n,custom:i,onExitComplete:m=>{u.set(m,!0);for(const g of u.values())if(!g)return;s&&s()},register:m=>(u.set(m,!1),()=>{var g;u.delete(m),!h.current&&!u.size&&((g=d.current)==null||g.call(d))})}),[n,u,s]);return r&&p&&(y={...y}),b.useMemo(()=>{u.forEach((m,g)=>u.set(g,!1))},[n]),b.useEffect(()=>{!n&&!u.size&&s&&s()},[n]),t=at.jsx(Wf,{pop:o==="popLayout",isPresent:n,anchorX:a,anchorY:l,root:c,children:t}),at.jsx(ke.Provider,{value:y,children:t})};function Gf(){return new Map}function qo(t=!0){const e=b.useContext(ke);if(e===null)return[!0,null];const{isPresent:n,onExitComplete:s,register:i}=e,r=b.useId();b.useEffect(()=>{if(t)return i(r)},[t]);const o=b.useCallback(()=>t&&s&&s(r),[r,s,t]);return!n&&s?[!1,o]:[!0]}const Jt=t=>t.key||"";function ti(t){const e=[];return b.Children.forEach(t,n=>{b.isValidElement(n)&&e.push(n)}),e}const mp=({children:t,custom:e,initial:n=!0,onExitComplete:s,presenceAffectsLayout:i=!0,mode:r="sync",propagate:o=!1,anchorX:a="left",anchorY:l="top",root:c})=>{const[u,f]=qo(o),h=b.useMemo(()=>ti(t),[t]),d=o&&!u?[]:h.map(Jt),p=b.useRef(!0),y=b.useRef(h),m=bn(()=>new Map),g=b.useRef(new Set),[v,x]=b.useState(h),[T,_]=b.useState(h);wn(()=>{p.current=!1,y.current=h;for(let w=0;w<T.length;w++){const A=Jt(T[w]);d.includes(A)?(m.delete(A),g.current.delete(A)):m.get(A)!==!0&&m.set(A,!1)}},[T,d.length,d.join("-")]);const C=[];if(h!==v){let w=[...h];for(let A=0;A<T.length;A++){const P=T[A],E=Jt(P);d.includes(E)||(w.splice(A,0,P),C.push(P))}return r==="wait"&&C.length&&(w=C),_(ti(w)),x(h),null}const{forceRender:k}=b.useContext(Tn);return at.jsx(at.Fragment,{children:T.map(w=>{const A=Jt(w),P=o&&!u?!1:h===T||d.includes(A),E=()=>{if(g.current.has(A))return;if(m.has(A))g.current.add(A),m.set(A,!0);else return;let I=!0;m.forEach(j=>{j||(I=!1)}),I&&(k==null||k(),_(y.current),o&&(f==null||f()),s&&s())};return at.jsx(Kf,{isPresent:P,initial:!p.current||n?void 0:!1,custom:e,presenceAffectsLayout:i,mode:r,root:c,onExitComplete:P?void 0:E,anchorX:a,anchorY:l,children:w},A)})})},Xo=b.createContext({strict:!1}),ei={animation:["animate","variants","whileHover","whileTap","exit","whileInView","whileFocus","whileDrag"],exit:["exit"],drag:["drag","dragControls"],focus:["whileFocus"],hover:["whileHover","onHoverStart","onHoverEnd"],tap:["whileTap","onTap","onTapStart","onTapCancel"],pan:["onPan","onPanStart","onPanSessionStart","onPanEnd"],inView:["whileInView","onViewportEnter","onViewportLeave"],layout:["layout","layoutId"]};let ni=!1;function qf(){if(ni)return;const t={};for(const e in ei)t[e]={isEnabled:n=>ei[e].some(s=>!!n[s])};So(t),ni=!0}function Yo(){return qf(),Vu()}function Xf(t){const e=Yo();for(const n in t)e[n]={...e[n],...t[n]};So(e)}const Yf=new Set(["animate","exit","variants","initial","style","values","variants","transition","transformTemplate","custom","inherit","onBeforeLayoutMeasure","onAnimationStart","onAnimationComplete","onUpdate","onDragStart","onDrag","onDragEnd","onMeasureDragConstraints","onDirectionLock","onDragTransitionEnd","_dragX","_dragY","onHoverStart","onHoverEnd","onViewportEnter","onViewportLeave","globalTapTarget","propagate","ignoreStrict","viewport"]);function xe(t){return t.startsWith("while")||t.startsWith("drag")&&t!=="draggable"||t.startsWith("layout")||t.startsWith("onTap")||t.startsWith("onPan")||t.startsWith("onLayout")||Yf.has(t)}let Zo=t=>!xe(t);function Zf(t){typeof t=="function"&&(Zo=e=>e.startsWith("on")?!xe(e):t(e))}try{Zf(require("@emotion/is-prop-valid").default)}catch{}function Qf(t,e,n){const s={};for(const i in t)i==="values"&&typeof t.values=="object"||z(t[i])||(Zo(i)||n===!0&&xe(i)||!e&&!xe(i)||t.draggable&&i.startsWith("onDrag"))&&(s[i]=t[i]);return s}const Pe=b.createContext({});function Jf(t,e){if(Me(t)){const{initial:n,animate:s}=t;return{initial:n===!1||zt(n)?n:void 0,animate:zt(s)?s:void 0}}return t.inherit!==!1?e:{}}function th(t){const{initial:e,animate:n}=Jf(t,b.useContext(Pe));return b.useMemo(()=>({initial:e,animate:n}),[si(e),si(n)])}function si(t){return Array.isArray(t)?t.join(" "):t}const qn=()=>({style:{},transform:{},transformOrigin:{},vars:{}});function Qo(t,e,n){for(const s in e)!z(e[s])&&!Do(s,n)&&(t[s]=e[s])}function eh({transformTemplate:t},e){return b.useMemo(()=>{const n=qn();return Wn(n,e,t),Object.assign({},n.vars,n.style)},[e])}function nh(t,e){const n=t.style||{},s={};return Qo(s,n,t),Object.assign(s,eh(t,e)),s}function sh(t,e){const n={},s=nh(t,e);return t.drag&&t.dragListener!==!1&&(n.draggable=!1,s.userSelect=s.WebkitUserSelect=s.WebkitTouchCallout="none",s.touchAction=t.drag===!0?"none":`pan-${t.drag==="x"?"y":"x"}`),t.tabIndex===void 0&&(t.onTap||t.onTapStart||t.whileTap)&&(n.tabIndex=0),n.style=s,n}const Jo=()=>({...qn(),attrs:{}});function ih(t,e,n,s){const i=b.useMemo(()=>{const r=Jo();return Ro(r,e,Io(s),t.transformTemplate,t.style),{...r.attrs,style:{...r.style}}},[e]);if(t.style){const r={};Qo(r,t.style,t),i.style={...r,...i.style}}return i}const oh=["animate","circle","defs","desc","ellipse","g","image","line","filter","marker","mask","metadata","path","pattern","polygon","polyline","rect","stop","switch","symbol","svg","text","tspan","use","view"];function Xn(t){return typeof t!="string"||t.includes("-")?!1:!!(oh.indexOf(t)>-1||/[A-Z]/u.test(t))}function rh(t,e,n,{latestValues:s},i,r=!1,o){const l=(o??Xn(t)?ih:sh)(e,s,i,t),c=Qf(e,typeof t=="string",r),u=t!==b.Fragment?{...c,...l,ref:n}:{},{children:f}=e,h=b.useMemo(()=>z(f)?f.get():f,[f]);return b.createElement(t,{...u,children:h})}function ah({scrapeMotionValuesFromProps:t,createRenderState:e},n,s,i){return{latestValues:lh(n,s,i,t),renderState:e()}}function lh(t,e,n,s){const i={},r=s(t,{});for(const h in r)i[h]=le(r[h]);let{initial:o,animate:a}=t;const l=Me(t),c=ko(t);e&&c&&!l&&t.inherit!==!1&&(o===void 0&&(o=e.initial),a===void 0&&(a=e.animate));let u=n?n.initial===!1:!1;u=u||o===!1;const f=u?a:o;if(f&&typeof f!="boolean"&&!Se(f)){const h=Array.isArray(f)?f:[f];for(let d=0;d<h.length;d++){const p=On(t,h[d]);if(p){const{transitionEnd:y,transition:m,...g}=p;for(const v in g){let x=g[v];if(Array.isArray(x)){const T=u?x.length-1:0;x=x[T]}x!==null&&(i[v]=x)}for(const v in y)i[v]=y[v]}}}return i}const tr=t=>(e,n)=>{const s=b.useContext(Pe),i=b.useContext(ke),r=()=>ah(t,e,s,i);return n?r():bn(r)},ch=tr({scrapeMotionValuesFromProps:Kn,createRenderState:qn}),uh=tr({scrapeMotionValuesFromProps:Bo,createRenderState:Jo}),fh=Symbol.for("motionComponentSymbol");function hh(t,e,n){const s=b.useRef(n);b.useInsertionEffect(()=>{s.current=n});const i=b.useRef(null);return b.useCallback(r=>{var a;r&&((a=t.onMount)==null||a.call(t,r)),e&&(r?e.mount(r):e.unmount());const o=s.current;if(typeof o=="function")if(r){const l=o(r);typeof l=="function"&&(i.current=l)}else i.current?(i.current(),i.current=null):o(r);else o&&(o.current=r)},[e])}const er=b.createContext({});function _t(t){return t&&typeof t=="object"&&Object.prototype.hasOwnProperty.call(t,"current")}function dh(t,e,n,s,i,r){var x,T;const{visualElement:o}=b.useContext(Pe),a=b.useContext(Xo),l=b.useContext(ke),c=b.useContext(Gn),u=c.reducedMotion,f=c.skipAnimations,h=b.useRef(null),d=b.useRef(!1);s=s||a.renderer,!h.current&&s&&(h.current=s(t,{visualState:e,parent:o,props:n,presenceContext:l,blockInitialAnimation:l?l.initial===!1:!1,reducedMotionConfig:u,skipAnimations:f,isSVG:r}),d.current&&h.current&&(h.current.manuallyAnimateOnMount=!0));const p=h.current,y=b.useContext(er);p&&!p.projection&&i&&(p.type==="html"||p.type==="svg")&&ph(h.current,n,i,y);const m=b.useRef(!1);b.useInsertionEffect(()=>{p&&m.current&&p.update(n,l)});const g=n[uo],v=b.useRef(!!g&&typeof window<"u"&&!((x=window.MotionHandoffIsComplete)!=null&&x.call(window,g))&&((T=window.MotionHasOptimisedAnimation)==null?void 0:T.call(window,g)));return wn(()=>{d.current=!0,p&&(m.current=!0,window.MotionIsMounted=!0,p.updateFeatures(),p.scheduleRenderMicrotask(),v.current&&p.animationState&&p.animationState.animateChanges())}),b.useEffect(()=>{p&&(!v.current&&p.animationState&&p.animationState.animateChanges(),v.current&&(queueMicrotask(()=>{var _;(_=window.MotionHandoffMarkAsComplete)==null||_.call(window,g)}),v.current=!1),p.enteringChildren=void 0)}),p}function ph(t,e,n,s){const{layoutId:i,layout:r,drag:o,dragConstraints:a,layoutScroll:l,layoutRoot:c,layoutAnchor:u,layoutCrossfade:f}=e;t.projection=new n(t.latestValues,e["data-framer-portal-id"]?void 0:nr(t.parent)),t.projection.setOptions({layoutId:i,layout:r,alwaysMeasureLayout:!!o||a&&_t(a),visualElement:t,animationType:typeof r=="string"?r:"both",initialPromotionConfig:s,crossfade:f,layoutScroll:l,layoutRoot:c,layoutAnchor:u})}function nr(t){if(t)return t.options.allowProjection!==!1?t.projection:nr(t.parent)}function Fe(t,{forwardMotionProps:e=!1,type:n}={},s,i){s&&Xf(s);const r=n?n==="svg":Xn(t),o=r?uh:ch;function a(c,u){let f;const h={...b.useContext(Gn),...c,layoutId:mh(c)},{isStatic:d}=h,p=th(c),y=o(c,d);if(!d&&typeof window<"u"){yh();const m=gh(h);f=m.MeasureLayout,p.visualElement=dh(t,y,h,i,m.ProjectionNode,r)}return at.jsxs(Pe.Provider,{value:p,children:[f&&p.visualElement?at.jsx(f,{visualElement:p.visualElement,...h}):null,rh(t,c,hh(y,p.visualElement,u),y,d,e,r)]})}a.displayName=`motion.${typeof t=="string"?t:`create(${t.displayName??t.name??""})`}`;const l=b.forwardRef(a);return l[fh]=t,l}function mh({layoutId:t}){const e=b.useContext(Tn).id;return e&&t!==void 0?e+"-"+t:t}function yh(t,e){b.useContext(Xo).strict}function gh(t){const e=Yo(),{drag:n,layout:s}=e;if(!n&&!s)return{};const i={...n,...s};return{MeasureLayout:n!=null&&n.isEnabled(t)||s!=null&&s.isEnabled(t)?i.MeasureLayout:void 0,ProjectionNode:i.ProjectionNode}}function vh(t,e){if(typeof Proxy>"u")return Fe;const n=new Map,s=(r,o)=>Fe(r,o,t,e),i=(r,o)=>s(r,o);return new Proxy(i,{get:(r,o)=>o==="create"?s:(n.has(o)||n.set(o,Fe(o,void 0,t,e)),n.get(o))})}const xh=(t,e)=>e.isSVG??Xn(t)?new qu(e):new zu(e,{allowProjection:t!==b.Fragment});class Th extends dt{constructor(e){super(e),e.animationState||(e.animationState=Ju(e))}updateAnimationControlsSubscription(){const{animate:e}=this.node.getProps();Se(e)&&(this.unmountControls=e.subscribe(this.node))}mount(){this.updateAnimationControlsSubscription()}update(){const{animate:e}=this.node.getProps(),{animate:n}=this.node.prevProps||{};e!==n&&this.updateAnimationControlsSubscription()}unmount(){var e;this.node.animationState.reset(),(e=this.unmountControls)==null||e.call(this)}}let bh=0;class wh extends dt{constructor(){super(...arguments),this.id=bh++,this.isExitComplete=!1}update(){var r;if(!this.node.presenceContext)return;const{isPresent:e,onExitComplete:n}=this.node.presenceContext,{isPresent:s}=this.node.prevPresenceContext||{};if(!this.node.animationState||e===s)return;if(e&&s===!1){if(this.isExitComplete){const{initial:o,custom:a}=this.node.getProps();if(typeof o=="string"||typeof o=="object"&&o!==null&&!Array.isArray(o)){const l=bt(this.node,o,a);if(l){const{transition:c,transitionEnd:u,...f}=l;for(const h in f)(r=this.node.getValue(h))==null||r.jump(f[h])}}this.node.animationState.reset(),this.node.animationState.animateChanges()}else this.node.animationState.setActive("exit",!1);this.isExitComplete=!1;return}const i=this.node.animationState.setActive("exit",!e);n&&!e&&i.then(()=>{this.isExitComplete=!0,n(this.id)})}mount(){const{register:e,onExitComplete:n}=this.node.presenceContext||{};n&&n(this.id),e&&(this.unmount=e(this.id))}unmount(){}}const kh={animation:{Feature:Th},exit:{Feature:wh}};function Xt(t){return{point:{x:t.pageX,y:t.pageY}}}const _h=t=>e=>$n(e)&&t(e,Xt(e));function Nt(t,e,n,s){return Ut(t,e,_h(n),s)}const sr=({current:t})=>t?t.ownerDocument.defaultView:null,ii=(t,e)=>Math.abs(t-e);function Sh(t,e){const n=ii(t.x,e.x),s=ii(t.y,e.y);return Math.sqrt(n**2+s**2)}const oi=new Set(["auto","scroll"]);class ir{constructor(e,n,{transformPagePoint:s,contextWindow:i=window,dragSnapToOrigin:r=!1,distanceThreshold:o=3,element:a}={}){if(this.startEvent=null,this.lastMoveEvent=null,this.lastMoveEventInfo=null,this.lastRawMoveEventInfo=null,this.handlers={},this.contextWindow=window,this.scrollPositions=new Map,this.removeScrollListeners=null,this.onElementScroll=p=>{this.handleScroll(p.target)},this.onWindowScroll=()=>{this.handleScroll(window)},this.updatePoint=()=>{if(!(this.lastMoveEvent&&this.lastMoveEventInfo))return;this.lastRawMoveEventInfo&&(this.lastMoveEventInfo=te(this.lastRawMoveEventInfo,this.transformPagePoint));const p=je(this.lastMoveEventInfo,this.history),y=this.startEvent!==null,m=Sh(p.offset,{x:0,y:0})>=this.distanceThreshold;if(!y&&!m)return;const{point:g}=p,{timestamp:v}=$;this.history.push({...g,timestamp:v});const{onStart:x,onMove:T}=this.handlers;y||(x&&x(this.lastMoveEvent,p),this.startEvent=this.lastMoveEvent),T&&T(this.lastMoveEvent,p)},this.handlePointerMove=(p,y)=>{this.lastMoveEvent=p,this.lastRawMoveEventInfo=y,this.lastMoveEventInfo=te(y,this.transformPagePoint),R.update(this.updatePoint,!0)},this.handlePointerUp=(p,y)=>{this.end();const{onEnd:m,onSessionEnd:g,resumeAnimation:v}=this.handlers;if((this.dragSnapToOrigin||!this.startEvent)&&v&&v(),!(this.lastMoveEvent&&this.lastMoveEventInfo))return;const x=je(p.type==="pointercancel"?this.lastMoveEventInfo:te(y,this.transformPagePoint),this.history);this.startEvent&&m&&m(p,x),g&&g(p,x)},!$n(e))return;this.dragSnapToOrigin=r,this.handlers=n,this.transformPagePoint=s,this.distanceThreshold=o,this.contextWindow=i||window;const l=Xt(e),c=te(l,this.transformPagePoint),{point:u}=c,{timestamp:f}=$;this.history=[{...u,timestamp:f}];const{onSessionStart:h}=n;h&&h(e,je(c,this.history));const d={passive:!0,capture:!0};this.removeListeners=Kt(Nt(this.contextWindow,"pointermove",this.handlePointerMove,d),Nt(this.contextWindow,"pointerup",this.handlePointerUp,d),Nt(this.contextWindow,"pointercancel",this.handlePointerUp,d)),a&&this.startScrollTracking(a)}startScrollTracking(e){let n=e.parentElement;for(;n;){const s=getComputedStyle(n);(oi.has(s.overflowX)||oi.has(s.overflowY))&&this.scrollPositions.set(n,{x:n.scrollLeft,y:n.scrollTop}),n=n.parentElement}this.scrollPositions.set(window,{x:window.scrollX,y:window.scrollY}),window.addEventListener("scroll",this.onElementScroll,{capture:!0}),window.addEventListener("scroll",this.onWindowScroll),this.removeScrollListeners=()=>{window.removeEventListener("scroll",this.onElementScroll,{capture:!0}),window.removeEventListener("scroll",this.onWindowScroll)}}handleScroll(e){const n=this.scrollPositions.get(e);if(!n)return;const s=e===window,i=s?{x:window.scrollX,y:window.scrollY}:{x:e.scrollLeft,y:e.scrollTop},r={x:i.x-n.x,y:i.y-n.y};r.x===0&&r.y===0||(s?this.lastMoveEventInfo&&(this.lastMoveEventInfo.point.x+=r.x,this.lastMoveEventInfo.point.y+=r.y):this.history.length>0&&(this.history[0].x-=r.x,this.history[0].y-=r.y),this.scrollPositions.set(e,i),R.update(this.updatePoint,!0))}updateHandlers(e){this.handlers=e}end(){this.removeListeners&&this.removeListeners(),this.removeScrollListeners&&this.removeScrollListeners(),this.scrollPositions.clear(),ht(this.updatePoint)}}function te(t,e){return e?{point:e(t.point)}:t}function ri(t,e){return{x:t.x-e.x,y:t.y-e.y}}function je({point:t},e){return{point:t,delta:ri(t,or(e)),offset:ri(t,Mh(e)),velocity:Ph(e,.1)}}function Mh(t){return t[0]}function or(t){return t[t.length-1]}function Ph(t,e){if(t.length<2)return{x:0,y:0};let n=t.length-1,s=null;const i=or(t);for(;n>=0&&(s=t[n],!(i.timestamp-s.timestamp>G(e)));)n--;if(!s)return{x:0,y:0};s===t[0]&&t.length>2&&i.timestamp-s.timestamp>G(e)*2&&(s=t[1]);const r=Z(i.timestamp-s.timestamp);if(r===0)return{x:0,y:0};const o={x:(i.x-s.x)/r,y:(i.y-s.y)/r};return o.x===1/0&&(o.x=0),o.y===1/0&&(o.y=0),o}function Ah(t,{min:e,max:n},s){return e!==void 0&&t<e?t=s?D(e,t,s.min):Math.max(t,e):n!==void 0&&t>n&&(t=s?D(n,t,s.max):Math.min(t,n)),t}function ai(t,e,n){return{min:e!==void 0?t.min+e:void 0,max:n!==void 0?t.max+n-(t.max-t.min):void 0}}function Ch(t,{top:e,left:n,bottom:s,right:i}){return{x:ai(t.x,n,i),y:ai(t.y,e,s)}}function li(t,e){let n=e.min-t.min,s=e.max-t.max;return e.max-e.min<t.max-t.min&&([n,s]=[s,n]),{min:n,max:s}}function Eh(t,e){return{x:li(t.x,e.x),y:li(t.y,e.y)}}function Vh(t,e){let n=.5;const s=W(t),i=W(e);return i>s?n=jt(e.min,e.max-s,t.min):s>i&&(n=jt(t.min,t.max-i,e.min)),ot(0,1,n)}function Dh(t,e){const n={};return e.min!==void 0&&(n.min=e.min-t.min),e.max!==void 0&&(n.max=e.max-t.min),n}const vn=.35;function Rh(t=vn){return t===!1?t=0:t===!0&&(t=vn),{x:ci(t,"left","right"),y:ci(t,"top","bottom")}}function ci(t,e,n){return{min:ui(t,e),max:ui(t,n)}}function ui(t,e){return typeof t=="number"?t:t[e]||0}const Lh=new WeakMap;class Ih{constructor(e){this.openDragLock=null,this.isDragging=!1,this.currentDirection=null,this.originPoint={x:0,y:0},this.constraints=!1,this.hasMutatedConstraints=!1,this.elastic=F(),this.latestPointerEvent=null,this.latestPanInfo=null,this.visualElement=e}start(e,{snapToCursor:n=!1,distanceThreshold:s}={}){const{presenceContext:i}=this.visualElement;if(i&&i.isPresent===!1)return;const r=f=>{n&&this.snapToCursor(Xt(f).point),this.stopAnimation()},o=(f,h)=>{const{drag:d,dragPropagation:p,onDragStart:y}=this.getProps();if(d&&!p&&(this.openDragLock&&this.openDragLock(),this.openDragLock=au(d),!this.openDragLock))return;this.latestPointerEvent=f,this.latestPanInfo=h,this.isDragging=!0,this.currentDirection=null,this.resolveConstraints(),this.visualElement.projection&&(this.visualElement.projection.isAnimationBlocked=!0,this.visualElement.projection.target=void 0),nt(g=>{let v=this.getAxisMotionValue(g).get()||0;if(it.test(v)){const{projection:x}=this.visualElement;if(x&&x.layout){const T=x.layout.layoutBox[g];T&&(v=W(T)*(parseFloat(v)/100))}}this.originPoint[g]=v}),y&&R.update(()=>y(f,h),!1,!0),ln(this.visualElement,"transform");const{animationState:m}=this.visualElement;m&&m.setActive("whileDrag",!0)},a=(f,h)=>{this.latestPointerEvent=f,this.latestPanInfo=h;const{dragPropagation:d,dragDirectionLock:p,onDirectionLock:y,onDrag:m}=this.getProps();if(!d&&!this.openDragLock)return;const{offset:g}=h;if(p&&this.currentDirection===null){this.currentDirection=Oh(g),this.currentDirection!==null&&y&&y(this.currentDirection);return}this.updateAxis("x",h.point,g),this.updateAxis("y",h.point,g),this.visualElement.render(),m&&R.update(()=>m(f,h),!1,!0)},l=(f,h)=>{this.latestPointerEvent=f,this.latestPanInfo=h,this.stop(f,h),this.latestPointerEvent=null,this.latestPanInfo=null},c=()=>{const{dragSnapToOrigin:f}=this.getProps();(f||this.constraints)&&this.startAnimation({x:0,y:0})},{dragSnapToOrigin:u}=this.getProps();this.panSession=new ir(e,{onSessionStart:r,onStart:o,onMove:a,onSessionEnd:l,resumeAnimation:c},{transformPagePoint:this.visualElement.getTransformPagePoint(),dragSnapToOrigin:u,distanceThreshold:s,contextWindow:sr(this.visualElement),element:this.visualElement.current})}stop(e,n){const s=e||this.latestPointerEvent,i=n||this.latestPanInfo,r=this.isDragging;if(this.cancel(),!r||!i||!s)return;const{velocity:o}=i;this.startAnimation(o);const{onDragEnd:a}=this.getProps();a&&R.postRender(()=>a(s,i))}cancel(){this.isDragging=!1;const{projection:e,animationState:n}=this.visualElement;e&&(e.isAnimationBlocked=!1),this.endPanSession();const{dragPropagation:s}=this.getProps();!s&&this.openDragLock&&(this.openDragLock(),this.openDragLock=null),n&&n.setActive("whileDrag",!1)}endPanSession(){this.panSession&&this.panSession.end(),this.panSession=void 0}updateAxis(e,n,s){const{drag:i}=this.getProps();if(!s||!ee(e,i,this.currentDirection))return;const r=this.getAxisMotionValue(e);let o=this.originPoint[e]+s[e];this.constraints&&this.constraints[e]&&(o=Ah(o,this.constraints[e],this.elastic[e])),r.set(o)}resolveConstraints(){var r;const{dragConstraints:e,dragElastic:n}=this.getProps(),s=this.visualElement.projection&&!this.visualElement.projection.layout?this.visualElement.projection.measure(!1):(r=this.visualElement.projection)==null?void 0:r.layout,i=this.constraints;e&&_t(e)?this.constraints||(this.constraints=this.resolveRefConstraints()):e&&s?this.constraints=Ch(s.layoutBox,e):this.constraints=!1,this.elastic=Rh(n),i!==this.constraints&&!_t(e)&&s&&this.constraints&&!this.hasMutatedConstraints&&nt(o=>{this.constraints!==!1&&this.getAxisMotionValue(o)&&(this.constraints[o]=Dh(s.layoutBox[o],this.constraints[o]))})}resolveRefConstraints(){const{dragConstraints:e,onMeasureDragConstraints:n}=this.getProps();if(!e||!_t(e))return!1;const s=e.current,{projection:i}=this.visualElement;if(!i||!i.layout)return!1;i.root&&(i.root.scroll=void 0,i.root.updateScroll());const r=Bu(s,i.root,this.visualElement.getTransformPagePoint());let o=Eh(i.layout.layoutBox,r);if(n){const a=n(Ru(o));this.hasMutatedConstraints=!!a,a&&(o=Po(a))}return o}startAnimation(e){const{drag:n,dragMomentum:s,dragElastic:i,dragTransition:r,dragSnapToOrigin:o,onDragTransitionEnd:a}=this.getProps(),l=this.constraints||{},c=nt(u=>{if(!ee(u,n,this.currentDirection))return;let f=l&&l[u]||{};(o===!0||o===u)&&(f={min:0,max:0});const h=i?200:1e6,d=i?40:1e7,p={type:"inertia",velocity:s?e[u]:0,bounceStiffness:h,bounceDamping:d,timeConstant:750,restDelta:1,restSpeed:10,...r,...f};return this.startAxisValueAnimation(u,p)});return Promise.all(c).then(a)}startAxisValueAnimation(e,n){const s=this.getAxisMotionValue(e);return ln(this.visualElement,e),s.start(Bn(e,s,0,n,this.visualElement,!1))}stopAnimation(){nt(e=>this.getAxisMotionValue(e).stop())}getAxisMotionValue(e){const n=`_drag${e.toUpperCase()}`,i=this.visualElement.getProps()[n];return i||this.visualElement.getValue(e,this.visualElement.latestValues[e]??0)}snapToCursor(e){nt(n=>{const{drag:s}=this.getProps();if(!ee(n,s,this.currentDirection))return;const{projection:i}=this.visualElement,r=this.getAxisMotionValue(n);if(i&&i.layout){const{min:o,max:a}=i.layout.layoutBox[n],l=r.get()||0;r.set(e[n]-D(o,a,.5)+l)}})}scalePositionWithinConstraints(){if(!this.visualElement.current)return;const{drag:e,dragConstraints:n}=this.getProps(),{projection:s}=this.visualElement;if(!_t(n)||!s||!this.constraints)return;this.stopAnimation();const i={x:0,y:0};nt(o=>{const a=this.getAxisMotionValue(o);if(a&&this.constraints!==!1){const l=a.get();i[o]=Vh({min:l,max:l},this.constraints[o])}});const{transformTemplate:r}=this.visualElement.getProps();this.visualElement.current.style.transform=r?r({},""):"none",s.root&&s.root.updateScroll(),s.updateLayout(),this.constraints=!1,this.resolveConstraints(),nt(o=>{if(!ee(o,e,null))return;const a=this.getAxisMotionValue(o),{min:l,max:c}=this.constraints[o];a.set(D(l,c,i[o]))}),this.visualElement.render()}addListeners(){if(!this.visualElement.current)return;Lh.set(this.visualElement,this);const e=this.visualElement.current,n=Nt(e,"pointerdown",c=>{const{drag:u,dragListener:f=!0}=this.getProps(),h=c.target,d=h!==e&&du(h);u&&f&&!d&&this.start(c)});let s;const i=()=>{const{dragConstraints:c}=this.getProps();_t(c)&&c.current&&(this.constraints=this.resolveRefConstraints(),s||(s=Bh(e,c.current,()=>this.scalePositionWithinConstraints())))},{projection:r}=this.visualElement,o=r.addEventListener("measure",i);r&&!r.layout&&(r.root&&r.root.updateScroll(),r.updateLayout()),R.read(i);const a=Ut(window,"resize",()=>this.scalePositionWithinConstraints()),l=r.addEventListener("didUpdate",(({delta:c,hasLayoutChanged:u})=>{this.isDragging&&u&&(nt(f=>{const h=this.getAxisMotionValue(f);h&&(this.originPoint[f]+=c[f].translate,h.set(h.get()+c[f].translate))}),this.visualElement.render())}));return()=>{a(),n(),o(),l&&l(),s&&s()}}getProps(){const e=this.visualElement.getProps(),{drag:n=!1,dragDirectionLock:s=!1,dragPropagation:i=!1,dragConstraints:r=!1,dragElastic:o=vn,dragMomentum:a=!0}=e;return{...e,drag:n,dragDirectionLock:s,dragPropagation:i,dragConstraints:r,dragElastic:o,dragMomentum:a}}}function fi(t){let e=!0;return()=>{if(e){e=!1;return}t()}}function Bh(t,e,n){const s=vs(t,fi(n)),i=vs(e,fi(n));return()=>{s(),i()}}function ee(t,e,n){return(e===!0||e===t)&&(n===null||n===t)}function Oh(t,e=10){let n=null;return Math.abs(t.y)>e?n="y":Math.abs(t.x)>e&&(n="x"),n}class Nh extends dt{constructor(e){super(e),this.removeGroupControls=Q,this.removeListeners=Q,this.controls=new Ih(e)}mount(){const{dragControls:e}=this.node.getProps();e&&(this.removeGroupControls=e.subscribe(this.controls)),this.removeListeners=this.controls.addListeners()||Q}update(){const{dragControls:e}=this.node.getProps(),{dragControls:n}=this.node.prevProps||{};e!==n&&(this.removeGroupControls(),e&&(this.removeGroupControls=e.subscribe(this.controls)))}unmount(){this.removeGroupControls(),this.removeListeners(),this.controls.isDragging||this.controls.endPanSession()}}const $e=t=>(e,n)=>{t&&R.update(()=>t(e,n),!1,!0)};class Fh extends dt{constructor(){super(...arguments),this.removePointerDownListener=Q}onPointerDown(e){this.session=new ir(e,this.createPanHandlers(),{transformPagePoint:this.node.getTransformPagePoint(),contextWindow:sr(this.node)})}createPanHandlers(){const{onPanSessionStart:e,onPanStart:n,onPan:s,onPanEnd:i}=this.node.getProps();return{onSessionStart:$e(e),onStart:$e(n),onMove:$e(s),onEnd:(r,o)=>{delete this.session,i&&R.postRender(()=>i(r,o))}}}mount(){this.removePointerDownListener=Nt(this.node.current,"pointerdown",e=>this.onPointerDown(e))}update(){this.session&&this.session.updateHandlers(this.createPanHandlers())}unmount(){this.removePointerDownListener(),this.session&&this.session.end()}}let ze=!1;class jh extends b.Component{componentDidMount(){const{visualElement:e,layoutGroup:n,switchLayoutGroup:s,layoutId:i}=this.props,{projection:r}=e;r&&(n.group&&n.group.add(r),s&&s.register&&i&&s.register(r),ze&&r.root.didUpdate(),r.addEventListener("animationComplete",()=>{this.safeToRemove()}),r.setOptions({...r.options,layoutDependency:this.props.layoutDependency,onExitComplete:()=>this.safeToRemove()})),ce.hasEverUpdated=!0}getSnapshotBeforeUpdate(e){const{layoutDependency:n,visualElement:s,drag:i,isPresent:r}=this.props,{projection:o}=s;return o&&(o.isPresent=r,e.layoutDependency!==n&&o.setOptions({...o.options,layoutDependency:n}),ze=!0,i||e.layoutDependency!==n||n===void 0||e.isPresent!==r?o.willUpdate():this.safeToRemove(),e.isPresent!==r&&(r?o.promote():o.relegate()||R.postRender(()=>{const a=o.getStack();(!a||!a.members.length)&&this.safeToRemove()}))),null}componentDidUpdate(){const{visualElement:e,layoutAnchor:n}=this.props,{projection:s}=e;s&&(s.options.layoutAnchor=n,s.root.didUpdate(),jn.postRender(()=>{!s.currentAnimation&&s.isLead()&&this.safeToRemove()}))}componentWillUnmount(){const{visualElement:e,layoutGroup:n,switchLayoutGroup:s}=this.props,{projection:i}=e;ze=!0,i&&(i.scheduleCheckAfterUnmount(),n&&n.group&&n.group.remove(i),s&&s.deregister&&s.deregister(i))}safeToRemove(){const{safeToRemove:e}=this.props;e&&e()}render(){return null}}function rr(t){const[e,n]=qo(),s=b.useContext(Tn);return at.jsx(jh,{...t,layoutGroup:s,switchLayoutGroup:b.useContext(er),isPresent:e,safeToRemove:n})}const $h={pan:{Feature:Fh},drag:{Feature:Nh,ProjectionNode:Go,MeasureLayout:rr}};function hi(t,e,n){const{props:s}=t;t.animationState&&s.whileHover&&t.animationState.setActive("whileHover",n==="Start");const i="onHover"+n,r=s[i];r&&R.postRender(()=>r(e,Xt(e)))}class zh extends dt{mount(){const{current:e}=this.node;e&&(this.unmount=cu(e,(n,s)=>(hi(this.node,s,"Start"),i=>hi(this.node,i,"End"))))}unmount(){}}class Uh extends dt{constructor(){super(...arguments),this.isActive=!1}onFocus(){let e=!1;try{e=this.node.current.matches(":focus-visible")}catch{e=!0}!e||!this.node.animationState||(this.node.animationState.setActive("whileFocus",!0),this.isActive=!0)}onBlur(){!this.isActive||!this.node.animationState||(this.node.animationState.setActive("whileFocus",!1),this.isActive=!1)}mount(){this.unmount=Kt(Ut(this.node.current,"focus",()=>this.onFocus()),Ut(this.node.current,"blur",()=>this.onBlur()))}unmount(){}}function di(t,e,n){const{props:s}=t;if(t.current instanceof HTMLButtonElement&&t.current.disabled)return;t.animationState&&s.whileTap&&t.animationState.setActive("whileTap",n==="Start");const i="onTap"+(n==="End"?"":n),r=s[i];r&&R.postRender(()=>r(e,Xt(e)))}class Hh extends dt{mount(){const{current:e}=this.node;if(!e)return;const{globalTapTarget:n,propagate:s}=this.node.props;this.unmount=mu(e,(i,r)=>(di(this.node,r,"Start"),(o,{success:a})=>di(this.node,o,a?"End":"Cancel")),{useGlobalTarget:n,stopPropagation:(s==null?void 0:s.tap)===!1})}unmount(){}}const xn=new WeakMap,Ue=new WeakMap,Wh=t=>{const e=xn.get(t.target);e&&e(t)},Kh=t=>{t.forEach(Wh)};function Gh({root:t,...e}){const n=t||document;Ue.has(n)||Ue.set(n,{});const s=Ue.get(n),i=JSON.stringify(e);return s[i]||(s[i]=new IntersectionObserver(Kh,{root:t,...e})),s[i]}function qh(t,e,n){const s=Gh(e);return xn.set(t,n),s.observe(t),()=>{xn.delete(t),s.unobserve(t)}}const Xh={some:0,all:1};class Yh extends dt{constructor(){super(...arguments),this.hasEnteredView=!1,this.isInView=!1}startObserver(){var l;(l=this.stopObserver)==null||l.call(this);const{viewport:e={}}=this.node.getProps(),{root:n,margin:s,amount:i="some",once:r}=e,o={root:n?n.current:void 0,rootMargin:s,threshold:typeof i=="number"?i:Xh[i]},a=c=>{const{isIntersecting:u}=c;if(this.isInView===u||(this.isInView=u,r&&!u&&this.hasEnteredView))return;u&&(this.hasEnteredView=!0),this.node.animationState&&this.node.animationState.setActive("whileInView",u);const{onViewportEnter:f,onViewportLeave:h}=this.node.getProps(),d=u?f:h;d&&d(c)};this.stopObserver=qh(this.node.current,o,a)}mount(){this.startObserver()}update(){if(typeof IntersectionObserver>"u")return;const{props:e,prevProps:n}=this.node;["amount","margin","root"].some(Zh(e,n))&&this.startObserver()}unmount(){var e;(e=this.stopObserver)==null||e.call(this),this.hasEnteredView=!1,this.isInView=!1}}function Zh({viewport:t={}},{viewport:e={}}={}){return n=>t[n]!==e[n]}const Qh={inView:{Feature:Yh},tap:{Feature:Hh},focus:{Feature:Uh},hover:{Feature:zh}},Jh={layout:{ProjectionNode:Go,MeasureLayout:rr}},td={...kh,...Qh,...$h,...Jh},yp=vh(td,xh);export{yd as $,mp as A,rd as B,ld as C,od as D,Td as E,vd as F,xd as G,bd as H,Sd as I,Yd as J,Nd as K,Ad as L,Rd as M,Ld as N,sp as O,Fd as P,Bd as Q,zd as R,Wd as S,op as T,cp as U,Hd as V,id as W,hp as X,ep as Y,dp as Z,Zd as _,tp as a,gd as a0,Ed as a1,sd as a2,pd as a3,fp as a4,dd as a5,lp as a6,Md as a7,jd as a8,md as a9,_d as aa,ip as ab,ad as ac,cd as ad,hd as ae,Ud as af,Od as b,xt as c,qd as d,Pd as e,Cd as f,ap as g,Dd as h,$d as i,Vd as j,wd as k,Qd as l,np as m,Xd as n,up as o,Id as p,kd as q,Kd as r,Jd as s,yp as t,ud as u,fd as v,rp as w,nd as x,V as y,Gd as z};
