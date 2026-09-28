import { cancelStaleLinks } from './payment-links';
import { balanceFor,CRMState,uid } from './domain';
export function queuePeak(s:CRMState,entityId:string,customerId:string,type='Invoice'){
 const key=`peak:${type.toLowerCase()}:${entityId}`;
 const existing=s.jobs.find(j=>j.key===key);if(existing)return existing;
 const job={id:uid('SYNC'),entityId,customerId,type,key,status:'Queued',attempts:0,error:'',externalId:'',date:new Date().toISOString(),provider:'PEAK'};s.jobs.unshift(job);return job;
}
export function approvePayment(s:CRMState,id:string,actor:string){
 if(!['ผู้บริหาร','หัวหน้าบัญชี'].includes(actor))throw Error('บทบาทนี้ไม่มีสิทธิ์อนุมัติสลิป');
 const p=s.payments.find(p=>p.id===id);if(!p||p.status!=='Pending')throw Error('รายการนี้ไม่ได้รออนุมัติ');
 if(p.submittedBy===actor)throw Error('ผู้เสนอสลิปต้องเป็นคนละคนกับผู้อนุมัติ');
 if(p.amount<=0||!Number.isFinite(p.amount)||p.amount>balanceFor(s,p.invoiceId))throw Error('ยอดชำระเกินยอดคงเหลือหรือไม่ถูกต้อง');
 if(s.payments.some(x=>x.id!==p.id&&x.reference===p.reference&&x.status==='Success'))throw Error('เลขอ้างอิงชำระซ้ำ');
 p.status='Success';cancelStaleLinks(s,p.invoiceId);const inv=s.invoices.find(i=>i.id===p.invoiceId)!;inv.status=balanceFor(s,inv.id)===0?'Paid':'Partial';queuePeak(s,p.id,inv.customerId,'Payment');
}
export function processPeakJob(s:CRMState,id:string){
 const job=s.jobs.find(j=>j.id===id);if(!job)throw Error('ไม่พบงานซิงก์');if(job.status==='Success')return;
 const customer=s.customers.find(c=>c.id===job.customerId);if(!customer)throw Error('ไม่พบลูกค้า');
 job.attempts++;job.date=new Date().toISOString();
 if(!customer.peakId&&job.type!=='Contact'){job.status='Error';job.error='กรุณาสร้าง PEAK Customer ID ก่อนซิงก์เอกสาร';return;}
 job.status='Success';job.error='';job.externalId=`DEMO-PEAK-${job.type.toUpperCase()}-${job.entityId}`;
 if(job.type==='Contact')customer.peakId=job.externalId;
 if(job.type==='Invoice'||job.type==='Quotation'){const invoice=s.invoices.find(i=>i.id===job.entityId);if(invoice)invoice.peakId=job.externalId;}
}
export function retryInstallment(s:CRMState,id:string){const row=s.installments.find(i=>i.id===id);if(!row||row.status!=='Pending')throw Error('รายการนี้ไม่สามารถ retry ได้');row.retries++;if(row.retries>=3){row.status='Carried';const others=s.installments.filter(i=>i.invoiceId===row.invoiceId&&i.due>row.due&&i.status==='Pending').sort((a,b)=>a.due.localeCompare(b.due));if(others.length){others[0].amount=Math.round((others[0].amount+row.amount)*100)/100;}else{const date=new Date(row.due+'T00:00:00Z');date.setUTCMonth(date.getUTCMonth()+1);s.installments.push({id:uid('INS'),invoiceId:row.invoiceId,amount:row.amount,due:date.toISOString().slice(0,10),status:'Pending',retries:0});}}}
export const escapeHTML=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
