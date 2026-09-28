/** Backend contract awaiting PEAK confirmation. No guessed PEAK endpoint/field mapping. */
export type VerifiedPeakPaymentLink={source:'PEAK';provider:'2C2P';peakInvoiceId:string;peakCustomerId:string;amount:number;currency:'THB';url:string;expiresAt:string};
export interface PeakPaymentLinkGateway {
 readPaymentLink(peakInvoiceId:string):Promise<VerifiedPeakPaymentLink>;
}
export function validatePeakPaymentLink(value:VerifiedPeakPaymentLink,expected:{peakInvoiceId:string;peakCustomerId:string;amount:number},allowedHosts:readonly string[],now=Date.now()){
 if(value.source!=='PEAK'||value.provider!=='2C2P'||value.currency!=='THB'||value.peakInvoiceId!==expected.peakInvoiceId||value.peakCustomerId!==expected.peakCustomerId||!Number.isFinite(value.amount)||value.amount<=0||Math.round(value.amount*100)!==Math.round(expected.amount*100))throw Error('PEAK payment link does not match invoice');
 const u=new URL(value.url);if(u.protocol!=='https:'||u.username||u.password||u.port||!allowedHosts.includes(u.hostname))throw Error('Payment URL must use an approved HTTPS host');
 if(!Number.isFinite(Date.parse(value.expiresAt))||Date.parse(value.expiresAt)<=now)throw Error('Payment link expired or missing expiry');
 return value;
}
export class UnconfiguredPeakPaymentLinkGateway implements PeakPaymentLinkGateway {
 async readPaymentLink():Promise<VerifiedPeakPaymentLink>{throw Error('PEAK payment-link endpoint and response contract require provider confirmation; live notifications are disabled');}
}
