# หน่วยสืบสวนฐานข้อมูล (SQL Detective)

เกมไขคดีด้วยการเขียน SQL — รัน SQLite จริงในเบราว์เซอร์ผ่าน [sql.js](https://sql.js.org/)
ไม่มี backend ไม่มี API ทุกอย่างอยู่ฝั่ง client

## เริ่มใช้งาน

```bash
npm install     # postinstall จะคัดลอก sql-wasm.wasm ไปที่ public/ ให้อัตโนมัติ
npm run dev     # http://localhost:3000
```

Build:

```bash
npm run build && npm start
```

## หน้าเว็บ

| เส้นทาง | คืออะไร |
|---------|---------|
| `/`     | หน้า Home — ปุ่มเริ่มเกม, วิธีเล่น, รายการคดี, **คู่มือคำสั่ง SQL** 8 บท, ตารางในฐานข้อมูล |
| `/play` | ตัวเกม (`<GameBoard />`) |

## โครงสร้างไฟล์

```
src/
├── app/
│   ├── globals.css        design tokens + คลาสร่วม (.paper, .sheet, .btn, .sql-block, …)
│   ├── layout.tsx         root layout + โหลดฟอนต์
│   ├── page.tsx           หน้า Home
│   └── play/page.tsx      เรียก <GameBoard />
├── components/
│   ├── SiteNav.tsx        แถบนำทางบนสุดของหน้า Home
│   ├── GuideBook.tsx      คู่มือ SQL ทั้งเล่ม (สารบัญ + บท + หัวข้อพับเก็บได้)
│   ├── SqlBlock.tsx       บล็อกโค้ด SQL ระบายสี + ปุ่มคัดลอก
│   ├── GameBoard.tsx      ประกอบทุกส่วนเข้าด้วยกัน (client entry)
│   ├── Header.tsx         หัวเรื่อง + ลิงก์กลับหน้าแรก + ProgressMeter
│   ├── ProgressMeter.tsx  แถบไฟบอกจำนวนคดีที่ปิดแล้ว
│   ├── CaseTabs.tsx       แท็บแฟ้มเลือกคดี
│   ├── CaseFile.tsx       แผงสำนวนคดี + ตราปั๊ม "ปิดคดีแล้ว"
│   ├── QueryConsole.tsx   ช่องเขียน SQL + ปุ่มรัน + ผลลัพธ์
│   ├── ResultTable.tsx    ตารางผลลัพธ์
│   ├── VerdictCard.tsx    ช่องส่งคำตอบ
│   ├── SchemaPanel.tsx    รายการตาราง/คอลัมน์
│   ├── Toolbox.tsx        คำใบ้ + เฉลย
│   └── Message.tsx        กล่องข้อความสถานะ
├── data/
│   ├── seed.ts            SQL สร้างตาราง + ใส่ข้อมูลเมือง Los Zorangeles
│   ├── cases.ts           โจทย์ทั้ง 8 คดี (เนื้อคดี, คำใบ้, เฉลย, คำตอบที่รับ)
│   └── guide.ts           เนื้อหาคู่มือ 8 บท (หัวข้อ, ตัวอย่างคิวรี, กับดักที่เจอบ่อย)
├── hooks/
│   ├── useDatabase.ts     โหลด wasm, สร้าง DB, อ่าน schema, runQuery()
│   └── useGame.ts         คดีที่เปิดอยู่ + คดีที่ปิดแล้ว + ตรวจคำตอบ
├── lib/
│   ├── normalize.ts       เทียบคำตอบแบบไม่สนตัวพิมพ์/ช่องว่าง
│   ├── schemaFromSeed.ts  อ่านชื่อตาราง/คอลัมน์จาก seed.ts (หน้า Home ใช้ ไม่ต้องโหลด wasm)
│   └── sqlGuard.ts        กันคิวรีที่แก้ข้อมูล (อ่านอย่างเดียว)
└── types/index.ts         DetectiveCase, QueryResult, TableSchema
```

## เนื้อหาที่ฝึก

| คดี | หัวข้อ |
|-----|--------|
| 1 | `SELECT` · `WHERE` · `AND` |
| 2 | `ORDER BY` · `LIMIT` |
| 3 | `JOIN` สามตาราง |
| 4 | `GROUP BY` · `COUNT` |
| 5 | เปรียบเทียบวันเวลาแบบ TEXT |
| 6 | Subquery · `NOT IN` |
| 7 | `HAVING` (ต่างจาก `WHERE` ยังไง) |
| 8 | JOIN หลายตาราง + `BETWEEN` |

คดี 6–8 ต่อกันเป็นเนื้อเรื่องเดียว คนที่ดูเหมือนผิดในคดี 6 จริง ๆ แล้วโดนใส่ร้าย

## เพิ่มคดีเอง

1. เติมข้อมูล/ตารางใหม่ใน `src/data/seed.ts`
2. ต่อ object ใหม่ท้าย array ใน `src/data/cases.ts`

UI, schema panel และรายการคดีในหน้า Home ปรับตามอัตโนมัติ ไม่ต้องแก้คอมโพเนนต์

## เพิ่มบทในคู่มือ

ต่อ object ใหม่ท้าย array ใน `src/data/guide.ts` — สารบัญกับตัวนับหัวข้อในหน้า Home ปรับตามเอง
โครงหนึ่งบทคือ บท → หัวข้อ (`topics`) → ตัวอย่าง (`examples`) + `pitfalls`
ช่อง `explain` กับ `pitfalls` ใส่ HTML tag พื้นฐาน (`<b>`, `<code>`) ได้

## หมายเหตุ

- ความคืบหน้าเก็บใน state เท่านั้น รีเฟรชแล้วเริ่มใหม่ — ถ้าอยากให้จำ ค่อยต่อ `localStorage` ใน `useGame`
- คิวรีที่มี `INSERT/UPDATE/DELETE/DROP/ALTER` ถูกบล็อกใน `lib/sqlGuard.ts`
- ฟอนต์โหลดจาก Google Fonts ผ่าน `<link>` ใน `layout.tsx` — ถ้าต้องการออฟไลน์เต็มรูปแบบ ให้ย้ายไป `next/font/local`
