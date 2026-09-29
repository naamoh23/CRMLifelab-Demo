# Requirement coverage — Demo

เทียบ Functional Requirements ทีละ ID จาก FR-NFR-spec-draft.md ไม่ใช่ใบรับรองผ่าน Acceptance Criteria ของ Production คำว่า “ได้” ในตารางหมายถึงทำกับข้อมูลสมมติใน browser เท่านั้น

| ID | ผลในเดโม / ขอบเขตที่ยังเหลือ |
|---|---|
| FR-CUST-001 | Customer ID + PEAK/LINE mapping; WooCommerce ID ยังไม่ sync |
| FR-CUST-002 | Customer 360 9 หมวด; เอกสารเป็น metadata |
| FR-CUST-003 | ค้นหา/กรอง/เรียง/เพิ่ม และผู้บริหารแก้ไข |
| FR-CUST-004 | ตรวจซ้ำและ Merge ประวัติใน browser; ยังไม่มี DB unique constraint |
| FR-CUST-005 | Audit before/after ระเบียน; ยังไม่ใช่ immutable server audit |
| FR-CUST-006 | ข้อมูลติดต่อ/บริษัท/OTP/source; ไม่เก็บเลขบัตรประชาชนจริงในเดโม |
| FR-CUST-007 | Guardian consent/วันที่สัมภาษณ์; ไม่เก็บเนื้อหาสัมภาษณ์ |
| FR-CUST-008 | Printed/Packed/Tracking/วันที่/ที่อยู่ในหน้าใบประกาศ |
| FR-CASE-001 | เลขเคส/ลูกค้า/owner/priority/due; collaborator/opportunity/course links ยังไม่ครบ |
| FR-CASE-002 | 6 สถานะ รวม Reopened และ Audit |
| FR-CASE-003 | Internal comment/มอบหมาย/กิจกรรม/Overdue; notification จริงยังไม่ต่อ |
| FR-CASE-004 | Owner บังคับในฟอร์ม |
| FR-CASE-005 | Consent flag และ enrollment gate; หลักฐานลงนามยังเป็นตัวอย่าง |
| FR-CASE-006 | ชื่อไฟล์แนบในข้อมูลตัวอย่าง; ไม่มี binary upload/storage |
| FR-CASE-007 | มีฟอร์มเคสใช้งานได้; ยังไม่มี usability timing test กับผู้ใช้จริง |
| FR-SALES-001 | 10 ขั้นตามรายการจริงในเอกสาร (ข้อความระบุ 9 แต่แจกแจง 10) |
| FR-SALES-002 | ลาก/เลือก stage พร้อม Audit; ยังไม่มี editor เปลี่ยนชื่อ/ลำดับ stage |
| FR-SALES-003 | Lead fields และ Next Action/Lost reason |
| FR-SALES-004 | ตรวจยอดชำระ/การเรียน/ใบประกาศก่อนข้ามขั้นหลัก |
| FR-SALES-005 | List/calendar/task completion; reminder แบบจำลอง |
| FR-SALES-006 | รายงานคำนวณจากข้อมูลใน browser |
| FR-SALES-007 | role scope ของตน/ทีม/external origin owner; ไม่ใช่ RLS |
| FR-SALES-008 | Reassign ได้; คอมมิชชันรอสูตร ไม่มีการอ้างว่าคำนวณครบ |
| FR-SALES-009 | กฎ Lead เงียบ 3 วัน กดทดสอบสร้าง Follow-up |
| FR-SALES-010 | เข้าคิวต่อ payment และ batch ด้วยปุ่ม; ยังไม่มี live sync/cron 20:00 |
| FR-RBAC-001 | 9 บทบาทตามรายการจริงในสเปก |
| FR-RBAC-002 | union scope และตัวอย่างฝ่ายขาย + ปฏิบัติการ; team record หลาย role |
| FR-RBAC-003 | UI controls/page scope ตามบทบาท; ไม่ใช่ server authorization |
| FR-RBAC-004 | ผู้บริหารจัดการ team record; ไม่มี Auth session ให้ revoke จริง |
| FR-RBAC-005 | Login เดโม user05 / 12345 พร้อม logout; Invite/approval ในเครื่อง ไม่มี server Auth หรือ signup จริง |
| FR-RBAC-006 | Audit บน actions สำคัญในเครื่อง; ยังลบ/แก้ผ่าน localStorage ได้ |
| FR-RBAC-007 | ฝ่ายปฏิบัติการไม่เห็นจำนวนเงิน; แก้ Customer master เฉพาะผู้บริหาร |
| FR-RBAC-008 | Marketing segment/account staff owner filtering แบบตัวอย่าง |
| FR-RPT-001 | รายงาน CSV/filter วันที่/เจ้าของ/คอร์ส/แหล่ง; ตัวกรองทีม/สถานะครบทุกชุดยังต้องขยาย |
| FR-PAY-001 | Quotation/Invoice เลขไม่ซ้ำ/ส่วนลด/VAT/due; HTML พิมพ์ได้ ไม่ใช่ใบกำกับภาษี |
| FR-PAY-002 | unique queue key/Retry/error/mapping จำลอง; token/read adapter ฝั่ง server |
| FR-PAY-003 | ตรวจ PEAK Customer/Invoice ID แล้วจำลองดึงลิงก์ 2C2P จาก PEAK พร้อม Email/SMS อัตโนมัติ; URL .invalid ไม่เก็บ PAN/CVV; live API รอยืนยัน |
| FR-PAY-004 | ยังไม่เปิด webhook; signature/JWT/replay validation รอ 2C2P UAT |
| FR-PAY-005 | Success/Pending/Rejected มี workflow; lifecycle Expired/Cancelled/Voided/Refunded ยังไม่ครบ |
| FR-PAY-006 | เทียบยอดสุทธิ/เลขอ้างอิง/PEAK mapping จากข้อมูลกรอกจำลอง |
| FR-PAY-007 | แผนผ่อน exact cents/18 เดือน/minimum/extended approval/retry carry |
| FR-PAY-008 | อนุมัติ/ปฏิเสธ+เหตุผล+Audit; ชื่อสลิป metadata ไม่มี file upload |
| FR-PAY-009 | กัน reference ซ้ำ/overpayment รวมยอดรออนุมัติ; คงเหลือคำนวณใหม่ |
| FR-PAY-010 | จำลองล้มเหลวครบ 3 ยกยอด; แจ้ง 3 ฝ่ายจริงยังไม่ต่อ |
| FR-PAY-011 | Executive final approval และ certificate AND gate |
| FR-PAY-012 | 432 บาท/ปี/transfer/no auto-renew/expiry; LINE เตือนจำลอง |
| FR-LINE-001 | ยังไม่มี live webhook/signature/async queue/DLQ |
| FR-LINE-002 | LINE ID ใน seed และ OTP ตรวจซ้ำ; auto mapping/manual review จริงยังไม่ต่อ |
| FR-LINE-003 | Timeline ข้อความ/เวลา/สถานะ Demo; attachment/retention config ยังไม่มี |
| FR-LINE-004 | ตอบในเครื่อง สถานะจำลองชัดเจน ไม่อ้าง LINE delivery |
| FR-LINE-005 | ปุ่มสร้างเคสจากบทสนทนา ป้องกันเคสซ้ำ; inbound trigger ยังไม่ต่อ |
| FR-LINE-006 | ฟอร์ม OTP 123456 + dedup ในเดโม; ไม่มีหน้า lifelabacademy.net/OTP gateway จริง |
| FR-LINE-007 | กดทดสอบ reminder/5-day expiry ตาม consent; ไม่ส่ง LINE จริง |
| FR-SYNC-001 | แสดง integration status; ยังไม่เชื่อม WooCommerce REST |
| FR-SYNC-002 | แสดง progress seed/แก้ผลเรียน; ยังไม่อ่าน LearnDash API |
| FR-SYNC-003 | มี mapping/authority guide สำหรับ PEAK; cross-system conflict/loop ยังไม่ implement |
| FR-SYNC-004 | Admin verify แยกจาก progress พร้อม exam/attendance validation |
| FR-SLIP-001 | ตรวจ reference/amount และ manual approval; ไม่เรียก slip provider |
| FR-OTP-002 | TBD ในเอกสารต้นทาง; ใช้ OTP จำลอง ไม่มี SMS Gateway |
| FR-AUTO-001 | กฎ due reminder/config days ตรวจ outstanding; manual test ไม่มี cron |
| FR-AUTO-002 | เปิด/หยุด/template version/preview/dedup; เพิ่ม Email/SMS delivery log และ retry แยกช่องทางใน browser ยังไม่มี durable queue |
| FR-AUTO-003 | แจ้ง 4 ฝ่ายจริงยังไม่ต่อ backend; UI ระบุขอบเขตไว้ |
| FR-DASH-001 | KPI/filter/drill-down และ scope ตาม role; ยังไม่ใช่ dashboard design แยกครบทุกแผนก |
| FR-DASH-002 | เสนอ layout/metric ตัวอย่าง รอ workshop ยืนยัน |
| FR-DASH-003 | มี audience/conversion ตัวอย่าง; open rate จริงไม่มีเพราะไม่ได้ส่งข้อความ |
| FR-SEG-001 | กลุ่ม dynamic ตาม age/consent/tag/completion พร้อม Preview; static/custom rule builder ยังไม่มี |
| FR-SEG-002 | ใช้เกณฑ์ตัวอย่างที่อธิบายได้ รอสเปกอนุมัติ |
| FR-MKT-001 | Consent เดียวคุม LINE + Email; ไม่มี webhook unsubscribe จริง |
| FR-MKT-002 | counter จำกัด 3 ในสัปดาห์เดโม; production ต้องมี calendar-week bucket |
| FR-MIG-001 | CSV customer importer; ยังไม่ได้ migrate Peak/HubSpot/Excel/LINE จริง |
| FR-MIG-002 | normalize/dedup ระหว่าง existing+batch; ไม่ได้ตรวจ 15 record จริงเพราะไม่มี export |
| FR-MIG-003 | Dry run ×2 และจำนวนผ่าน/ซ้ำ/ผิด; ไม่มี financial migration reconciliation จริง |

## จุดไม่สอดคล้องที่จัดการโดยไม่เดาข้อกำหนด

- Pipeline ระบุ 9 แต่แจกแจง 10 ขั้น: เดโมใช้ครบ 10 ชื่อ
- Role acceptance บางจุดระบุ 8 แต่แจกแจง 9: เดโมใช้ 9 บทบาท
- Cooling-off และยอดชำระไม่เกินมัดจำอาจให้ผลขัดกัน: ส่งตรวจทานก่อนยื่น refund ไม่เลือกกฎแทนผู้บริหาร
- คอมมิชชันไม่มีสูตรยืนยัน: แสดงรอสูตร ไม่สร้างตัวเลขสมมติให้ดูเหมือนผลจริง
- SMS OTP, dashboard metrics, segmentation, field-level masking และ PITR option ยังมี TBD ในเอกสาร
- Excel มีตัวเลขประมาณ 1,000/1,100 ต่างตำแหน่ง: ใช้ประมาณ 1,100 ตาม inventory และต้อง reconcile export จริง
- เงื่อนไขสัญญา/Barter/ลายเซ็น/ระยะ warranty เป็นประเด็นใน RAID ไม่มีผลเป็นการอนุมัติ Go-live ของเดโมนี้

## กฎธุรกิจหลัก

ราคา C01–C05 = 36,000 / 98,000 / 174,000 / 272,000 / 170,000 บาท; Open House 26,000; มัดจำ Practitioner 36,000; hypno.club 432/ปี ข้อเสนอ promotion แสดงเป็น catalog ยังไม่มี promotion entitlement engine ครบทุก bundle

Certificate ต้องครบทั้ง attendance ≥80%, written, practical, admin verification, paid in full, executive approval การแก้ผลเรียนให้ไม่ผ่านจะซ่อนใบประกาศและยกเลิก final approval

Refund calculator รองรับ cooling-off 3/7 วัน, ก่อนอบรม ≥60 วันหักมัดจำและ20%ราคา, น้อยกว่า60วันเป็นเครดิตหักมัดจำและ15,000อายุ2ปี, ระหว่างเรียนต้องคืนอุปกรณ์/อยู่ใน cutoff, no-show/removed/online/force majeure ไม่มีการโอนเงินหรือ credit ledger จริง

## Non-functional requirements

Light/Dark และ responsive ทดสอบด้วย browser ในเครื่อง มี typecheck/lint/unit และ UI smoke checks แต่ยังไม่รับรอง P95≤3วินาทีที่20concurrent/50,000records, SLA99.5%, RTO8h/RPO24h, backup/PITR, immutable audit12เดือน, MFA/RLS, vulnerability/pentest, Chrome/Edge/Safariสองเวอร์ชัน, PDPA/data residency หรือ integration SLA

Production ต้องต่อ shared database/auth/authorization/server validation/webhooks/queues/storage/monitoring และทำ UAT ตาม master-test-plan.md ก่อนใช้งานข้อมูลจริง

## เงื่อนไขเพิ่มเติม PEAK และ 2C2P



- ต้องเป็น Invoice ที่ยังไม่ยกเลิก มีลูกค้า active มี PEAK Customer ID และ PEAK Invoice ID และยอดคงเหลือมากกว่า 0
- อายุลิงก์เดโม 24 ชั่วโมงเป็นค่าตัวอย่าง ไม่ใช่ข้อกำหนดจาก PEAK เมื่อหมดอายุหรือยอดเปลี่ยนต้องดึงลิงก์เวอร์ชันใหม่
- URL เดโมใช้ https://payment.example.invalid เพื่อไม่ให้เข้าใจผิดว่าเป็นลิงก์เรียกเก็บเงินจริง เปิดตัวอย่างผ่านปุ่มใน CRM เท่านั้น
- ส่งอัตโนมัติเมื่อได้รับลิงก์สำเร็จทั้ง Email และ SMS ถ้าข้อมูลติดต่อของช่องทางใดไม่ถูกต้อง ให้ช่องทางนั้น Failed อีกช่องทางทำงานต่อได้
- Idempotency แยกระดับลิงก์และช่องทาง ลูกค้าหนึ่งรายมีหลายใบแจ้งหนี้ได้ แต่การเลือกใบเดิมซ้ำไม่สร้างรายการแจ้งเตือนซ้ำ
- การส่งข้อความและการกดลิงก์ไม่ทำให้รายการชำระ Success ต้องมีผลชำระที่ตรวจสอบจาก provider ฝั่ง server
- ข้อมูลและประวัติทั้งหมดอยู่ใน localStorage ของแต่ละ browser ไม่มี scheduler หรือ durable queue และไม่มีการส่งอีเมล/SMS ออกไปจริง


เงื่อนไขเพิ่มเติมอ้าง CR-PEAK-2C2P-001 ไม่เพิ่มหรือลบ ID ใน baseline 72 ข้อ ดู docs/PEAK-PAYMENT-LINKS.md สำหรับ UAT และข้อจำกัด API
