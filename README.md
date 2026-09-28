# LifeLab CRM — Presentation Demo

Responsive CRM ภาษาไทยสำหรับนำเสนอ **Case → Cash → Certificate** อ้างอิง Requirement, Final Pack, SOW และชุด SDLC ที่ /Users/naamoh/Documents/CRMLifeLab รองรับ Light / Dark และ Desktop / Tablet / Mobile

**Interactive demo ไม่ใช่ระบบ Production ตามสัญญา** ข้อมูลทั้งหมดเป็นข้อมูลสมมติ เก็บใน localStorage ของแต่ละ browser/origin ไม่มีการตัดบัตร ส่ง LINE หรือออกเอกสารเข้า PEAK จริง ตัวเลือกบทบาทเป็นเครื่องมือสาธิต ไม่ใช่ระบบ Authentication หรือการป้องกันข้อมูลจริง

## เริ่มใช้งาน

Node.js 22.13 ขึ้นไป

```sh
cd /Users/naamoh/Documents/CRMLifelab-Demo
npm run install:ci
npm run dev -- --host 127.0.0.1
```

เปิด URL ที่ terminal แสดง (โดยปกติ http://localhost:5173) เปลี่ยนธีมด้วยปุ่มดวงจันทร์/ดวงอาทิตย์ เลือกบทบาทจากแถบ DEMO ด้านบน ไม่ต้องกรอก Password

```sh
npm test
npm run typecheck
npm run lint
npm run build
npm start
```

Build อยู่ใน `dist/` ใช้ Cloudflare-compatible worker วันที่ธุรกิจของเดโมคือ 28 กันยายน 2569 เพื่อให้การนำเสนอคงที่ ส่วน Audit ใช้เวลาจริง

## หน้าจอ 15 ส่วน

| ส่วน | สิ่งที่ทดลองได้ |
|---|---|
| ภาพรวมธุรกิจ | KPI คำนวณจากข้อมูลใน browser, กราฟ, งานวันนี้, Drill-down |
| Customer 360 | เพิ่ม/ค้นหา/กรอง/เรียง/แก้ไข, 9 หมวดข้อมูล, Consent, Merge, CSV |
| Sales Pipeline | 10 ขั้นตามรายการในเอกสาร, ลากการ์ด/เลือกสถานะ, Lead, Lost reason, ตรวจเงื่อนไขชำระ/ใบประกาศ |
| เคสและบริการ | Owner, Priority, กำหนดส่ง, สถานะ, Resolution, Reopen, Internal comment |
| กิจกรรม | Task / Call / Meeting / Follow-up, list / calendar, ทำเครื่องหมายเสร็จ |
| การเงิน | เอกสาร, ส่วนลด/VAT, ชำระ/อนุมัติ/ปฏิเสธ, ผ่อน, Retry, Settlement, คืนเงิน/เครดิต |
| คอร์สและใบประกาศ | ลงทะเบียน, Attendance/ผลสอบ, Admin verify, Executive approval, HIDE/SHOW, พิมพ์/แพ็ค/Tracking, hypno.club |
| LINE Inbox | ข้อความจำลอง, สร้างเคส, OTP ตัวอย่าง 123456 |
| การตลาด | Audience แบบอธิบายเงื่อนไขได้, Preview, Opt-out, จำกัด 3 ครั้ง/สัปดาห์เดโม |
| Automation | เปิด/หยุด, Template/Version, Preview, ทดสอบกฎด้วยปุ่ม, กันรันซ้ำ |
| รายงาน | Conversion / Pipeline / Won-Lost / Sources / Aging / Revenue, filters, CSV |
| Integrations | PEAK queue / mapping / Retry / unique key / Demo API, สถานะระบบอื่น |
| ทีมและสิทธิ์ | 9 บทบาท, Multiple-role, Invite record / คิวอนุมัติ / ระงับ แบบจำลอง |
| Audit | ค้นหา/กรอง/export, before/after ของระเบียน |
| ตั้งค่า/นำเข้า | CSV ตรวจผิด/ซ้ำ, Dry run 2 ครั้ง, import, JSON backup, Reset พร้อมยืนยัน |

## PEAK Account

หน้า Integrations มี flow ที่ทดลองได้ ส่วน `lib/integrations/peak.ts` เป็น server adapter สำหรับ Client Token และอ่าน Contacts/Invoices พร้อม HMAC-SHA1, timeout, cache และ refresh 401 ทดสอบด้วย fake transport เท่านั้น

`GET /api/integrations/peak` ตอบ Demo เสมอ **ใส่ environment variables อย่างเดียวไม่เปิด Live mode** ต้องต่อ Auth, backend queue, payload mapping และผ่าน UAT ก่อนเปิด route ทำรายการจริง ไม่มีหน้ารับ Secret หรือการเก็บ token ใน localStorage ดู [PEAK Integration](docs/PEAK-INTEGRATION.md)

## เอกสารประกอบ

- [สคริปต์นำเสนอประมาณ 10 นาที](docs/DEMO-SCRIPT.md)
- [ข้อกำหนดและขอบเขตเดโม](docs/REQUIREMENTS-COVERAGE.md)
- [ผลตรวจสอบและข้อจำกัด](docs/VERIFICATION.md)
- [บัญชีไฟล์ต้นทางและ SHA-256](docs/SOURCE-INVENTORY.json)

## โครงสร้างและขอบเขต

React 19, TypeScript, Next-compatible App Router บน Vinext/Vite, Tailwind, shadcn/ui, Recharts และ Cloudflare worker build: UI ใน `components/crm/`, กฎใน `lib/crm/`, adapter ใน `lib/integrations/`, tests ใน `tests/`

Production stack ในสัญญาคือ Next.js / Hono / Cloudflare / Supabase เดโมยังไม่มี Hono, Supabase Auth/RLS, DB migration, shared persistence, durable queue/cron, file storage, session revocation หรือ integration webhook จึงไม่ใช่การส่งมอบ P1–P5 หรือการรับรอง NFR/SLA/PDPA ตามสัญญา

เอกสารแนบ/สลิปเป็นชื่อและ metadata ตัวอย่าง ใบแจ้งหนี้/ใบประกาศดาวน์โหลด HTML สำหรับ Print / Save as PDF พร้อมข้อความ DEMO ไม่มีการนำเอกสารต้นทางหรือข้อมูลบุคคลจากสัญญาไปเผยแพร่ในเว็บ

JSON backup เป็นการ export ไม่มีหน้า restore JSON การ Reset คืน seed และล้างการแก้ไขใน browser นี้ ควรสำรองก่อนเริ่มใหม่ ไม่ส่งผลต่อ browser อื่น

## รุ่น GitHub Pages และการแจ้งชำระ

เพิ่มหน้า การเงิน → 2C2P และแจ้งเตือน: จำลองดึงลิงก์จาก PEAK และแจ้ง Email/SMS อัตโนมัติ ดู docs/PEAK-PAYMENT-LINKS.md

Build สำหรับ GitHub Pages ด้วย `npm run build:pages` ได้ dist-pages/ และทดลองด้วย `npm run preview:pages` เป็น static demo ไม่มี server API หรือการส่งเงินจริง/ข้อความจริง ต้องเปิด Settings → Pages → Source เป็น GitHub Actions ก่อน deploy workflow

ซอร์สโค้ดฉบับเต็มอยู่ใน repository นี้ คู่มือ Word ใน docs/deliverables/ อธิบายวิธีใช้ โครงสร้างโค้ด สคริปต์นำเสนอ และขอบเขต 72 ข้อ
