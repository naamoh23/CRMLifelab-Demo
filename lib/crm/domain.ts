import type { PaymentLink,Delivery } from './payment-links';
export const DEMO_DATE='2026-09-28';
export const STAGES=['Lead ใหม่','เสนอราคา','รอชำระเงิน','ตรวจสอบการชำระเงิน','ชำระแล้ว / รอเรียน','เข้าเรียน','เรียนจบรอใบประกาศ','ตรวจสอบยอดเงินครบ','ออกใบประกาศ','ปิดเคส'];
export const ROLES=['ผู้บริหาร','หัวหน้าฝ่ายขาย','ฝ่ายขาย','เซลล์ภายนอก','หัวหน้าบัญชี','พนักงานบัญชี','ปฏิบัติการ','การตลาด','System Admin'];
export const COURSES=[{id:'C01',name:'NLP A la cart',short:'A la cart',price:36000,color:'blue',type:'online'},{id:'C02',name:'NLP Practitioner',short:'Practitioner',price:98000,color:'purple',type:'live'},{id:'C03',name:'NLP Master Practitioner',short:'Master Practitioner',price:174000,color:'teal',type:'live'},{id:'C04',name:'NLP Trainer',short:'Trainer',price:272000,color:'orange',type:'live'},{id:'C05',name:'NLP Master Trainer',short:'Master Trainer',price:170000,color:'pink',type:'live'}];
export type Customer={id:string;name:string;nickname:string;nameEn:string;phone:string;email:string;address:string;company:string;age:number;source:string;landing:string;owner:string;originOwner:string;tags:string[];peakId:string;lineId:string;verified:boolean;consent:boolean;guardian:string;guardianConsent:boolean;interviewChild:string;interviewParent:string;created:string;notes:string;segment:string;sends:number;archived?:boolean};
export type Lead={id:string;customerId:string;courseId:string;owner:string;stage:number;value:number;probability:number;next:string;due:string;lastContact:string;lostReason?:string;commissionRate:number};
export type Case={id:string;customerId:string;title:string;type:string;status:string;priority:string;owner:string;due:string;created:string;comments:{text:string;actor:string;date:string}[];resolution:string;attachments:string[]};
export type Invoice={paymentMethod?:string;id:string;customerId:string;courseId:string;subtotal:number;discount:number;vat:number;total:number;due:string;status:string;peakId:string;kind:string};
export type Payment={id:string;invoiceId:string;amount:number;date:string;method:string;status:string;reference:string;submittedBy:string;reason:string;slip:string;settled:boolean};
export type Enrollment={id:string;customerId:string;courseId:string;invoiceId:string;cohort:string;date:string;cutoff:string;progress:number;attendance:number;written:boolean;practical:boolean;adminVerified:boolean;finalApproved:boolean;cert:string;printed:boolean;packed:boolean;tracking:string;shipped:string;address:string;alacart:boolean};
export type Task={id:string;title:string;customerId:string;owner:string;due:string;time:string;type:string;done:boolean};
export type SyncJob={id:string;entityId:string;customerId:string;type:string;key:string;status:string;attempts:number;error:string;externalId:string;date:string;provider:string};
export type Audit={id:string;action:string;entity:string;actor:string;before:string;after:string;date:string};
export type Message={id:string;customerId:string;direction:string;text:string;time:string;status:string};
export type Installment={id:string;invoiceId:string;amount:number;due:string;status:string;retries:number};
export type Membership={id:string;customerId:string;type:string;expiry:string;status:string};
export type Staff={id:string;name:string;email:string;roles:string[];status:string};
export type Automation={id:string;name:string;trigger:string;channel:string;days:number;enabled:boolean;template:string;version:number};
export type Refund={id:string;invoiceId:string;amount:number;credit:number;rule:string;status:string;reason:string;date:string};
export type CRMState={version:number;paymentLinks:PaymentLink[];deliveries:Delivery[];customers:Customer[];leads:Lead[];cases:Case[];invoices:Invoice[];payments:Payment[];enrollments:Enrollment[];tasks:Task[];jobs:SyncJob[];audit:Audit[];messages:Message[];installments:Installment[];memberships:Membership[];staff:Staff[];automations:Automation[];refunds:Refund[];campaignLog:{id:string;name:string;count:number;date:string;ids:string[]}[];migrationRuns:{id:string;date:string;total:number;valid:number;duplicates:number;errors:number}[]};
export const money=(v:number)=>new Intl.NumberFormat('th-TH',{maximumFractionDigits:2}).format(v);
export const baht=(v:number)=>`฿${money(v)}`;
export const dateTH=(v:string)=>v?new Date(v).toLocaleDateString('th-TH',{day:'numeric',month:'short',year:'2-digit'}):'—';
export const uid=(prefix:string)=>`${prefix}-${crypto.randomUUID().slice(0,8).toUpperCase()}`;
export const paidFor=(s:CRMState,id:string)=>s.payments.filter(p=>p.invoiceId===id&&p.status==='Success').reduce((n,p)=>n+p.amount,0);
export const balanceFor=(s:CRMState,id:string)=>Math.max(0,(s.invoices.find(i=>i.id===id)?.total??0)-paidFor(s,id));
export function certificateChecks(s:CRMState,e:Enrollment){return{attendance:e.attendance>=80,written:e.written,practical:e.practical,admin:e.adminVerified,payment:!!s.invoices.find(i=>i.id===e.invoiceId)&&balanceFor(s,e.invoiceId)===0,executive:e.finalApproved};}
export const certificateReady=(s:CRMState,e:Enrollment)=>Object.values(certificateChecks(s,e)).every(Boolean);
export function normalizePhone(s:string){const d=s.replace(/\D/g,'');return d.startsWith('66')?'0'+d.slice(2):d;}
export function duplicateCustomer(list:Customer[],input:Pick<Customer,'name'|'phone'|'email'>,except=''){return list.find(c=>c.id!==except&&!c.archived&&((input.phone&&normalizePhone(c.phone)===normalizePhone(input.phone))||(input.email&&c.email.trim().toLowerCase()===input.email.trim().toLowerCase())||(input.name&&c.name.replace(/\s/g,'')===input.name.replace(/\s/g,''))));}
export function installmentSchedule(total:number,count:number,first:string,extendedApproved=false){
 if(!Number.isFinite(total)||total<=0||!Number.isInteger(count)||count<1||count>60)throw Error('กรอกยอดเงินและจำนวนงวดที่ถูกต้อง');
 if(count>18&&!extendedApproved)throw Error('เกิน 18 งวด ต้องได้รับอนุมัติจากผู้บริหาร');
 const cents=Math.round(total*100),base=Math.floor(cents/count),extra=cents%count;
 if(base<1000000)throw Error('ยอดแต่ละงวดต้องไม่น้อยกว่า 10,000 บาท');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(first)||Number.isNaN(Date.parse(first)))throw Error('วันครบกำหนดไม่ถูกต้อง');
 const[y,m,d]=first.split('-').map(Number);
 return Array.from({length:count},(_,i)=>{const last=new Date(Date.UTC(y,m+i,0)).getUTCDate();return{amount:(base+(i<extra?1:0))/100,due:new Date(Date.UTC(y,m-1+i,Math.min(d,last))).toISOString().slice(0,10)};});
}
export function refundEstimate(x:{paid:number;price:number;deposit:number;daysBefore:number;daysAfter:number;abroad:boolean;kind:string;during:boolean;returned:boolean;withinCutoff:boolean;reason:string}){
 const{paid,price,deposit,daysBefore,daysAfter,abroad,kind,during,returned,withinCutoff,reason}=x;
 if([paid,price,deposit].some(n=>!Number.isFinite(n)||n<0)||!Number.isFinite(daysBefore)||!Number.isFinite(daysAfter)||daysAfter<0||paid>price||deposit>price)throw Error('ยอดเงินหรือช่วงเวลาไม่ถูกต้อง');
 if(kind!=='live')return{cash:0,credit:0,rule:'BR-REFUND-08',note:'สินค้าออนไลน์ไม่คืนเงิน; สื่อชำรุดเปลี่ยนสินค้า'};
 if(['no-show','removed','force'].includes(reason))return{cash:0,credit:reason==='force'?paid:0,rule:reason==='force'?'BR-REFUND-09':reason==='removed'?'BR-REFUND-06':'BR-REFUND-05',note:reason==='force'?'เปลี่ยนรอบหรือโอนสิทธิ์คอร์ส รออนุมัติ':'ไม่คืนเงินตามเหตุที่ระบุ'};
 if(daysAfter<=(abroad?7:3)&&paid<=deposit)return{cash:0,credit:0,rule:'BR-REFUND-01 / 07',note:'เงื่อนไข Cooling-off กับยอดไม่เกินมัดจำขัดกัน ต้องผู้บริหารยืนยัน',review:true};
 if(daysAfter<=(abroad?7:3))return{cash:Math.min(paid,deposit),credit:0,rule:'BR-REFUND-01',note:'คืนมัดจำเต็มจำนวน; ยอดส่วนอื่นต้องตรวจสอบ'};
 if(paid<=deposit)return{cash:0,credit:0,rule:'BR-REFUND-07',note:'ชำระไม่เกินมัดจำ ไม่คืนเงิน'};
 if(during)return{cash:returned&&withinCutoff?paid:0,credit:0,rule:'BR-REFUND-04',note:returned&&withinCutoff?'ต้องยกเลิกสิทธิ์ A la cart ด้วย':'ต้องคืนอุปกรณ์และอยู่ภายในเวลาที่วิทยากรกำหนด'};
 if(daysBefore>=60)return{cash:Math.max(0,paid-deposit-price*.2),credit:0,rule:'BR-REFUND-02',note:'หักมัดจำและค่าธรรมเนียม 20% ของราคาคอร์ส'};
 return{cash:0,credit:Math.max(0,paid-deposit-15000),rule:'BR-REFUND-03',note:'เครดิตคอร์สอายุ 2 ปี หักมัดจำและค่าธรรมเนียม 15,000 บาท'};
}
export function canEnroll(c:Customer,courseId:string){if(c.age<9)return'ช่วงอายุนี้ยังไม่มีข้อกำหนดการเรียนที่ยืนยัน';if(c.age<20&&courseId!=='C02')return'ผู้เยาว์เรียนได้เฉพาะ NLP Practitioner';if(c.age<20&&!c.guardianConsent)return'ต้องมีความยินยอมผู้ปกครอง';if(c.age<=16&&(!c.interviewChild||!c.interviewParent))return'ต้องสัมภาษณ์เด็กและผู้ปกครองก่อน';return'';}
