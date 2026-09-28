/** Server-side adapter only. No live route exposes this client in the presentation demo.
 * PEAK official reference reviewed 2026-09-28. Confirm signature encoding with issued Postman collection before UAT.
 */
export type PeakConfig={baseUrl:string;connectId:string;password:string;userToken:string;signatureEncoding:'hex'|'base64'};
export class PeakError extends Error{constructor(public code:string){super(`PEAK request failed (${code})`);}}
export function peakTimestamp(now=new Date()){return now.toISOString().replace(/[-:T]/g,'').slice(0,14);}
export async function peakSignature(stamp:string,connectId:string,encoding:'hex'|'base64'){
 const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(connectId),{name:'HMAC',hash:'SHA-1'},false,['sign']);
 const raw=new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(stamp)));
 return encoding==='hex'?Array.from(raw,b=>b.toString(16).padStart(2,'0')).join(''):btoa(String.fromCharCode(...raw));
}
export class PeakClient{
 private token='';private expires=0;private pending:Promise<string>|null=null;
 constructor(private config:PeakConfig,private transport:typeof fetch=fetch){const u=new URL(config.baseUrl);if(u.protocol!=='https:'||u.username||u.password||u.search||u.hash)throw new PeakError('HTTPS_BASE_URL_REQUIRED');}
 private async signed(){const stamp=peakTimestamp();return{'Time-Stamp':stamp,'Time-Signature':await peakSignature(stamp,this.config.connectId,this.config.signatureEncoding),'Content-Type':'application/json','Accept':'application/json'};}
 async clientToken():Promise<string>{if(this.token&&Date.now()<this.expires)return this.token;if(this.pending)return this.pending;this.pending=this.issueToken();try{return await this.pending;}finally{this.pending=null;}}
 private async issueToken(){const r=await this.transport(`${this.config.baseUrl.replace(/\/$/,'')}/ClientToken`,{method:'POST',headers:await this.signed(),body:JSON.stringify({PeakClientToken:{connectId:this.config.connectId,password:this.config.password}}),signal:AbortSignal.timeout(10000),redirect:'error'});if(!r.ok)throw new PeakError(String(r.status));const body=await r.json() as {PeakClientToken?:{resCode?:string|number;token?:string}};if(String(body.PeakClientToken?.resCode)!=='200'||!body.PeakClientToken?.token)throw new PeakError('TOKEN_REJECTED');this.token=body.PeakClientToken.token;this.expires=Date.now()+23*3600000;return this.token;}
 async read(resource:'Contacts'|'Invoices',query:Record<string,string>={}){const u=new URL(`${this.config.baseUrl.replace(/\/$/,'')}/${resource}`);for(const[k,v]of Object.entries(query))u.searchParams.set(k,v);for(let attempt=0;attempt<2;attempt++){const r=await this.transport(u,{headers:{...await this.signed(),'Client-Token':await this.clientToken(),'User-Token':this.config.userToken},signal:AbortSignal.timeout(10000),redirect:'error'});if(r.status===401&&attempt===0){this.token='';continue;}if(!r.ok)throw new PeakError(String(r.status));const data=await r.json() as Record<string,unknown>;const payload=(data['Peak'+resource]??data[resource]??data) as Record<string,unknown>;if(payload.resCode!==undefined&&String(payload.resCode)!=='200')throw new PeakError('BUSINESS_'+String(payload.resCode));return data;}throw new PeakError('AUTH_REJECTED');}
}
