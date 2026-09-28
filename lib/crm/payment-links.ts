import { baht,balanceFor,CRMState,normalizePhone,uid } from './domain';
export type PaymentLink={id:string;invoiceId:string;customerId:string;amount:number;method:'2C2P';source:'PEAK';mode:'demo';key:string;status:'Ready'|'Error'|'Expired'|'Cancelled';url:string;expiresAt:string;createdAt:string;attempts:number;error:string};
export type Delivery={id:string;linkId:string;channel:'Email'|'SMS';recipient:string;body:string;status:'DemoSent'|'Failed';attempts:number;error:string;createdAt:string;key:string};
export type DemoScenario='success'|'peak-error'|'sms-error';
function payable(s:CRMState,invoiceId:string){
 const i=s.invoices.find(x=>x.id===invoiceId);if(!i||i.kind!=='Invoice'||['Cancelled','Void','Voided'].includes(i.status))throw Error('ต้องเป็นใบแจ้งหนี้ที่ยังไม่ยกเลิก');
 const c=s.customers.find(x=>x.id===i.customerId);if(!c||c.archived||!c.peakId)throw Error('ต้องเชื่อมรหัสลูกค้า PEAK ก่อน');
 if(!i.peakId)throw Error('ต้องซิงก์ใบแจ้งหนี้กับ PEAK ก่อน');
 const amount=balanceFor(s,i.id);if(amount<=0)throw Error('ใบแจ้งหนี้นี้ชำระครบแล้ว');
 return{i,c,amount};
}
export function linkUsable(s:CRMState,l:PaymentLink,now=new Date().toISOString()){
 try{const {amount}=payable(s,l.invoiceId);return l.status==='Ready'&&l.expiresAt>now&&Math.round(l.amount*100)===Math.round(amount*100);}catch{return false;}
}
function deliver(s:CRMState,l:PaymentLink,channel:Delivery['channel'],fail:boolean,now:string){
 const c=s.customers.find(c=>c.id===l.customerId)!;const key=`${l.id}:${channel}`;let d=s.deliveries.find(x=>x.key===key);if(d?.status==='DemoSent')return;
 const recipient=channel==='Email'?c.email:normalizePhone(c.phone);const valid=channel==='Email'?/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient):/^0\d{9}$/.test(recipient);
 const error=!valid?'ข้อมูลติดต่อไม่ครบหรือรูปแบบไม่ถูกต้อง':fail?'จำลอง SMS Gateway ไม่พร้อมใช้งาน':'';
 const body=`[DEMO ไม่เรียกเก็บเงินจริง] เรียนคุณ ${c.name} ใบแจ้งหนี้ ${l.invoiceId} ยอด ${baht(l.amount)} กรุณาชำระผ่านลิงก์ 2C2P จาก PEAK: ${l.url} ใช้ได้ถึง ${l.expiresAt} ติดต่อ LifeLab หากต้องการสอบถาม`;
 if(!d){d={id:uid('NOTICE'),linkId:l.id,channel,recipient,body,status:'Failed',attempts:0,error:'',createdAt:now,key};s.deliveries.unshift(d);}
 Object.assign(d,{recipient,body,status:error?'Failed':'DemoSent',attempts:d.attempts+1,error,createdAt:now});
}
// Synthetic PEAK response for presentation only; never sends a network request.
export function requestDemoPaymentLink(s:CRMState,invoiceId:string,scenario:DemoScenario='success',now=new Date().toISOString()){
 const{i,c,amount}=payable(s,invoiceId);i.paymentMethod='2C2P';
 for(const l of s.paymentLinks.filter(x=>x.invoiceId===invoiceId&&x.status==='Ready')){if(l.expiresAt<=now)l.status='Expired';else if(l.amount!==amount)l.status='Cancelled';}
 let link=s.paymentLinks.find(l=>l.invoiceId===invoiceId&&linkUsable(s,l,now));
 // Repeated selection must not retry deliveries silently or send duplicates.
 if(link)return link;
 link=s.paymentLinks.find(l=>l.invoiceId===invoiceId&&l.status==='Error'&&l.amount===amount);
 if(!link){const id=uid('LINK');link={id,invoiceId,customerId:c.id,amount,method:'2C2P',source:'PEAK',mode:'demo',key:`peak:2c2p:${invoiceId}:${id}`,status:'Error',url:'',expiresAt:'',createdAt:now,attempts:0,error:''};s.paymentLinks.unshift(link);}
 link.attempts++;
 if(scenario==='peak-error'){link.status='Error';link.error='จำลอง PEAK ไม่ส่ง Payment Link กลับมา ยังไม่ส่งแจ้งเตือน';return link;}
 link.status='Ready';link.error='';link.expiresAt=new Date(Date.parse(now)+86400000).toISOString();
 // Reserved .invalid domain cannot be confused with a real payment provider.
 link.url=`https://payment.example.invalid/2c2p/${encodeURIComponent(link.id)}`;
 deliver(s,link,'Email',false,now);deliver(s,link,'SMS',scenario==='sms-error',now);return link;
}
export function retryDemoDelivery(s:CRMState,id:string,now=new Date().toISOString()){
 const d=s.deliveries.find(x=>x.id===id);if(!d||d.status==='DemoSent')return;
 const l=s.paymentLinks.find(x=>x.id===d.linkId);if(!l||!linkUsable(s,l,now))throw Error('ลิงก์หมดอายุ ยกเลิก หรือยอดเปลี่ยน กรุณาดึงลิงก์ใหม่');
 deliver(s,l,d.channel,false,now);
}
export function cancelStaleLinks(s:CRMState,invoiceId:string){for(const l of s.paymentLinks.filter(x=>x.invoiceId===invoiceId&&x.status==='Ready'))if(!linkUsable(s,l))l.status='Cancelled';}
