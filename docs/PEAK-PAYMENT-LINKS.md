# การดึงลิงก์ 2C2P จาก PEAK และแจ้งชำระอัตโนมัติ

ขอบเขตเพิ่มเติม CR-PEAK-2C2P-001 ตามคำขอผู้ใช้วันที่ 28 กันยายน 2569 เชื่อมโยง FR-SALES-010, FR-PAY-002, FR-PAY-003 และ FR-AUTO-001 ถึง FR-AUTO-003 ไม่เปลี่ยนจำนวน baseline 72 ข้อ และไม่ใช่การอนุมัติเปลี่ยนสัญญา

## วิธีทดลอง

1. เลือกบทบาทผู้บริหาร เปิดการเงินและการชำระ → 2C2P และแจ้งเตือน
2. กดเลือกชำระ 2C2P เลือก INV-2609-005 ซึ่งมี PEAK Customer ID และ Invoice ID แล้ว
3. เลือกสถานการณ์สำเร็จ กดบันทึกและเริ่มอัตโนมัติ ระบบบันทึก paymentMethod เป็น 2C2P จำลองรับลิงก์จาก PEAK แล้วสร้าง Email และ SMS พร้อมข้อความและผู้รับทันที
4. ดูลิงก์ แหล่งข้อมูล ยอด วันหมดอายุ และประวัติแยกช่องทาง กดดูหน้าชำระจำลองเพื่อแสดงสิ่งที่ลูกค้าจะพบ โดยไม่กรอกข้อมูลบัตรและไม่จ่ายเงินจริง
5. เลือกใบแจ้งหนี้เดิมซ้ำ: ลิงก์ที่ยังใช้ได้ถูกนำกลับมาใช้ และไม่มีข้อความใหม่ การส่งสำเร็จไม่ถูก Retry
6. เลือก INV-2609-006 และสถานการณ์ SMS ล้มเหลว: Email สำเร็จ แต่ SMS มีข้อผิดพลาด กดลองส่งใหม่เฉพาะ SMS โดย Email ไม่ถูกส่งซ้ำ
7. เลือก INV-2609-007 และสถานการณ์ PEAK ไม่พร้อม: ยังไม่มีข้อความใดส่ง กดลองดึงใหม่เพื่อจำลองกู้คืน

## เงื่อนไขและผลลัพธ์

- ต้องเป็น Invoice ที่ยังไม่ยกเลิก มีลูกค้า active มี PEAK Customer ID และ PEAK Invoice ID และยอดคงเหลือมากกว่า 0
- อายุลิงก์เดโม 24 ชั่วโมงเป็นค่าตัวอย่าง ไม่ใช่ข้อกำหนดจาก PEAK เมื่อหมดอายุหรือยอดเปลี่ยนต้องดึงลิงก์เวอร์ชันใหม่
- URL เดโมใช้ https://payment.example.invalid เพื่อไม่ให้เข้าใจผิดว่าเป็นลิงก์เรียกเก็บเงินจริง เปิดตัวอย่างผ่านปุ่มใน CRM เท่านั้น
- ส่งอัตโนมัติเมื่อได้รับลิงก์สำเร็จทั้ง Email และ SMS ถ้าข้อมูลติดต่อของช่องทางใดไม่ถูกต้อง ให้ช่องทางนั้น Failed อีกช่องทางทำงานต่อได้
- Idempotency แยกระดับลิงก์และช่องทาง ลูกค้าหนึ่งรายมีหลายใบแจ้งหนี้ได้ แต่การเลือกใบเดิมซ้ำไม่สร้างรายการแจ้งเตือนซ้ำ
- การส่งข้อความและการกดลิงก์ไม่ทำให้รายการชำระ Success ต้องมีผลชำระที่ตรวจสอบจาก provider ฝั่ง server
- ข้อมูลและประวัติทั้งหมดอยู่ใน localStorage ของแต่ละ browser ไม่มี scheduler หรือ durable queue และไม่มีการส่งอีเมล/SMS ออกไปจริง

## การเชื่อมระบบจริงที่ยังต้องทำ

PEAK Invoice API ที่ตรวจสอบยังไม่ได้ยืนยัน endpoint และ field สำหรับ URL ของ 2C2P จึงไม่ใช้ documentLink หรือ onlineViewLink แทนโดยพลการ การรองรับช่องทาง e-Wallet 2C2P ใน PEAK ไม่ได้ยืนยันว่ามี API สำหรับสร้างหรือดึงลิงก์ 2C2P

lib/integrations/peak-payment-link.ts กำหนด contract กลางและตัวตรวจสอบที่ใช้หลัง mapping เท่านั้น ไม่อ้างว่าเป็น schema ของ PEAK จริง โดยตรวจ source/provider, invoice/customer mapping, amount/currency, HTTPS hostname allowlist และ expiry ขณะนี้ gateway ตั้งใจปฏิเสธ live request จนกว่าจะได้รับสเปกยืนยัน

ทีมพัฒนาต้องรับเอกสาร endpoint/payload และตัวอย่าง response ของบัญชี PEAK ที่ใช้งานจริง จากนั้นทำ gateway implementation ฝั่ง server หาก PEAK ไม่รองรับ ต้องให้เจ้าของงานอนุมัติ flow ที่สร้างลิงก์ผ่าน 2C2P โดยตรงแล้วบันทึกกลับ PEAK แยกต่างหาก ห้ามเปลี่ยนเส้นทางเงียบ ๆ

Production ต้องมี Auth/RBAC, database transaction/outbox, unique idempotency keys, worker lock, retry backoff/DLQ, expiry/revocation, email provider, SMS gateway, delivery callback, secret manager และ signed payment callback/inquiry ตรวจยอดก่อนบันทึกบัญชี ควรแยกข้อความธุรกรรมออกจากการตลาด และยืนยันช่องทาง/รูปแบบข้อความกับเจ้าของงาน

## แหล่งอ้างอิงที่ตรวจสอบ

- PEAK Get Invoice: https://developers.peakaccount.com/reference/get_api-v1-invoices
- PEAK คู่มือรับชำระด้วยบัตรเครดิต: https://www.peakaccount.com/peak-manual/sales-document/receipt/receive-payment-by-credit-card
- 2C2P Payment methods และ Payment links: https://2c2p.com/payment-methods/

เอกสารนี้อธิบายการทำงานของเดโมและงานที่เหลือ ไม่รับรองว่า PEAK มี Payment Link API ตาม contract ที่ออกแบบ
