'use client';
import { hasRole,visibleCustomers } from '@/lib/crm/access';
import { CRMState,Customer,uid } from '@/lib/crm/domain';
import { seed } from '@/lib/crm/seed';
import { createContext,ReactNode,useCallback,useContext,useEffect,useState,useSyncExternalStore } from 'react';
import { toast } from 'sonner';
const KEY='lifelab-crm-demo-v1';
type Context={state:CRMState;role:string;setRole:(s:string)=>void;actor:string;mutate:(action:string,entity:string,fn:(draft:CRMState)=>void)=>void;customers:Customer[];finance:boolean;executive:boolean;operations:boolean;page:string;go:(p:string)=>void;inspect:(id:string)=>void;selected:string;setSelected:(id:string)=>void;reset:()=>void;ready:boolean};
const C=createContext<Context|null>(null);
export function Provider({children}:{children:ReactNode}){
 const hydrated=useSyncExternalStore(subscribeHydration,()=>true,()=>false);
 return hydrated?<ClientProvider>{children}</ClientProvider>:<div className="empty" role="status">กำลังเปิด LifeLab Workspace…</div>;
}
const subscribeHydration=()=>()=>{};
function restoreState(){try{const raw=localStorage.getItem(KEY);if(raw){const x=JSON.parse(raw),shape=seed();if(x.version===1){x.paymentLinks??=[];x.deliveries??=[];}if(x.version===1&&Object.keys(shape).every(key=>key==='version'||Array.isArray(x[key])))return x as CRMState;}}catch{/* Invalid or unavailable local storage falls back to synthetic seed data. */}return seed();}
function ClientProvider({children}:{children:ReactNode}){
 const[state,setState]=useState(restoreState),[role,setRole]=useState('ผู้บริหาร'),[page,setPage]=useState(()=>location.hash.slice(1)||'dashboard'),[selected,setSelected]=useState('');const ready=true;
 useEffect(()=>{const f=()=>{setPage(location.hash.slice(1)||'dashboard');setSelected('');};window.addEventListener('hashchange',f);return()=>window.removeEventListener('hashchange',f);},[]);
 useEffect(()=>{if(ready)try{localStorage.setItem(KEY,JSON.stringify(state));}catch{toast.error('พื้นที่บันทึกเต็ม กรุณาส่งออกข้อมูลสำรอง');}},[state,ready]);
 const actor=role==='ฝ่ายขาย'?'เมย์':role==='เซลล์ภายนอก'?'นัท':role==='หัวหน้าฝ่ายขาย'?'แพร':role;
 const executive=hasRole(role,'ผู้บริหาร');const finance=hasRole(role,'ผู้บริหาร','หัวหน้าบัญชี','พนักงานบัญชี');const operations=hasRole(role,'ผู้บริหาร','ปฏิบัติการ');
 const customers=visibleCustomers(state.customers,role);
 const mutate=useCallback((action:string,entity:string,fn:(draft:CRMState)=>void)=>{setState(prev=>{const next=structuredClone(prev);fn(next);next.audit.unshift({id:uid('AUD'),action,entity,actor,before:JSON.stringify(snapshot(prev,entity)),after:JSON.stringify(snapshot(next,entity)),date:new Date().toISOString()});return next;});},[actor]);
 const go=(p:string)=>{setPage(p);setSelected('');location.hash=p;};
 return <C.Provider value={{state,role,setRole:(r)=>{setRole(r);setSelected('');setPage('dashboard');location.hash='dashboard';},actor,mutate,customers,finance,executive,operations,page,go,inspect:setSelected,selected,setSelected,reset:()=>{setState(seed());toast.success('คืนค่าข้อมูลตัวอย่างแล้ว');},ready}}>{children}</C.Provider>;
}
function snapshot(s:CRMState,id:string){for(const value of Object.values(s)){if(Array.isArray(value)){const record=value.find((v:{id?:string})=>v.id===id);if(record)return record;}}return{ref:id};}
export const useCRM=()=>{const c=useContext(C);if(!c)throw Error('CRM Provider missing');return c;};
