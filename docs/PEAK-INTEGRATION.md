# PEAK Account integration

## สถานะ

ทดลอง queue, Contact mapping, Invoice/Quotation/Payment mapping, Retry, Audit, dedup key `peak:<type>:<entityId>` และ batch งานค้างได้ในเครื่อง External ID ที่ขึ้นต้น `DEMO-PEAK-` ไม่ใช่ ID จาก PEAK

`lib/integrations/peak.ts` ใช้ dependency injection สำหรับ transport เพื่อทดสอบ token/error โดยไม่ส่งข้อมูลออก Frontend ไม่ import adapter นี้ `app/api/integrations/peak/route.ts` คืน Demo เท่านั้น ยังไม่มี financial POST adapter หรือ write endpoint

## เอกสารทางการที่ตรวจระหว่างพัฒนา

- [Client Token Guide](https://developers.peakaccount.com/reference/peak-api-client-token-guide)
- [ClientToken](https://developers.peakaccount.com/reference/post_api-v1-clienttoken)
- [Contacts](https://developers.peakaccount.com/reference/get_api-v1-contacts)
- [Invoices](https://developers.peakaccount.com/reference/get_api-v1-invoices)
- [ขอ User Token](https://www.peakaccount.com/peak-manual/api-integration/setting-api-integration/request-user-token-api-own-use)

Guide ระบุ Time-Stamp แบบ UTC `yyyyMMddHHmmss`, Time-Signature แบบ HMAC-SHA1 โดยใช้ Connect ID เป็น key, body `PeakClientToken.connectId/password`, ตรวจ `resCode` และ token ไม่ใช้ HTTP 200 อย่างเดียว Client Token อายุ 24 ชั่วโมง ไม่ควรขอใหม่ทุก request

**Signature encoding ต้องยืนยันกับ Postman collection/credential ที่ PEAK ออกให้ก่อน UAT** เพราะ reference ที่อ่านไม่ระบุ hex/base64 ชัดเจน Adapter บังคับเลือก `signatureEncoding` โดยไม่มี default

## Configuration ฝั่ง server

ดู `.env.example`:

```text
PEAK_BASE_URL=<HTTPS base URL รวม path/version ที่ PEAK ยืนยัน>
PEAK_CONNECT_ID=<credential ของระบบ>
PEAK_PASSWORD=<password สำหรับ ClientToken>
PEAK_USER_TOKEN=<token ของกิจการที่ได้รับอนุญาต>
PEAK_SIGNATURE_ENCODING=<hex หรือ base64 ที่ตรวจยืนยันแล้ว>
```

ห้ามใช้ `NEXT_PUBLIC_*` สำหรับ secret การตั้งค่ายังไม่เรียก PEAK อัตโนมัติ ต้องต่อ authenticated server code ก่อนใช้งานจริง

## Flow ที่ต้องต่อใน Production

1. ยืนยันบัญชีกิจการ, UAT environment, version, supported endpoints, fields/VAT และ token permissions กับ PEAK
2. Sync Contact บันทึก CRM↔PEAK Customer ID ก่อนสร้าง Hosted Payment 2C2P
3. การอนุมัติชำระแต่ละงวดเขียน payment และ outbox ใน DB transaction เดียวกัน มี unique index ของ provider/entity/event/version
4. Worker ตรวจ Contact/Invoice mapping ส่ง payload ที่ผ่าน contract test ตรวจ HTTP และ business `resCode` ก่อนเปลี่ยน Success
5. เก็บ request ID/external ID/attempt/nextAttemptAt/sanitized error ห้าม log token หรือข้อมูลบัตร
6. Retry แบบ bounded exponential backoff สำหรับ timeout/429/5xx แยก validation/permission error ให้ตรวจทาน
7. หาก provider commit แล้ว response หาย ต้อง lookup/reconcile ด้วย reference ก่อนส่งซ้ำ unique key ฝั่ง CRM อย่างเดียวไม่รับประกัน idempotency ของ provider
8. ตั้ง fallback 20:00 **Asia/Bangkok** และ Dead Letter Queue เดโมใช้ปุ่ม “ซิงก์งานค้าง” ไม่ได้ตั้ง cron
9. กระทบยอด PEAK ↔ payment Success ↔ 2C2P Settlement ↔ Statement พร้อมหลักฐานตรวจรับ

Token cache เป็น memory ต่อ instance (23 ชั่วโมง) Production หลาย worker ต้องมี shared cache/locking/rate limit การ refresh 401 ทำหนึ่งครั้งต่อ read request

## UAT ที่ยังต้องใช้บัญชีจริง

Credential ถูก/ผิด, encoding/clock skew, token expiry, permission denied, mapping ขาด/ซ้ำ, อักขระไทย, ส่วนลด/VAT/ทศนิยม, partial payment ทุกงวด, timeout หลัง commit, 429/backoff, batch 20:00, reconciliation, เปลี่ยน/ยกเลิกเอกสาร ยังไม่มีการอ้างว่าผ่าน Live PEAK
