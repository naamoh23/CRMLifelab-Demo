# เอกสารส่งมอบ LifeLab CRM Demo

ฉบับ 1.2 วันที่ 29 กันยายน 2569 ภาษาไทย ฟอนต์ Noto Sans Thai

- [คู่มือการใช้งานและโครงสร้างซอร์สโค้ด](01-LifeLab-User-and-Source-Manual.docx)
- [สคริปต์นำเสนอ 15 นาที](02-LifeLab-Presentation-Script.docx)
- [ขอบเขตและการตรวจรับตามข้อกำหนด 72 ข้อ](03-LifeLab-72-Requirements-Scope.docx)

[เปิดเว็บสาธิต](https://naamoh23.github.io/CRMLifelab-Demo/)

ตรวจครบ 72 รหัสกับเอกสารต้นทางและตรวจภาพทุกหน้าหลัง render แล้ว ซอร์สโค้ดฉบับเต็มอยู่ใน repository นี้

รุ่น PEAK → 2C2P → Email/SMS ผ่าน 30 automated tests, typecheck, lint และ build:pages; GitHub Actions run 36451751089 build/deploy สำเร็จ และเปิดเว็บจริงได้

การรับลิงก์และส่ง Email/SMS ยังเป็น Demo ไม่มีการส่งข้อความหรือตัดเงินจริง ต้องยืนยัน PEAK API และทำ backend/provider integration ก่อน Production

รุ่น 1.2 เริ่มที่ Login ด้วย Username user05 และ Password 12345 เข้าครบทุกโมดูลด้วยสิทธิ์ผู้บริหาร มี Logout และ session สำหรับแท็บเดิม กฎธุรกิจคงเดิม
