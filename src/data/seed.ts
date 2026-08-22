/**
 * ข้อมูลตั้งต้นของฐานข้อมูลเมือง Los Zorangeles
 *
 * ชื่อคน (people.name) ไม่ตายตัว — สุ่มใหม่ทุกครั้งที่เริ่มเกม (ดู pickSessionNames)
 * ส่วนคุณสมบัติอื่น ๆ ของแต่ละ id (หมวก, ส่วนสูง, เขต ฯลฯ) และตารางที่เหลือคงที่เสมอ
 * เพราะเงื่อนไขของทุกคดีอิงกับ id ไม่ใช่ชื่อ — สุ่มชื่อแล้วคำตอบยังถูกต้องเหมือนเดิม
 * แค่ผู้เล่นเดาคำตอบจากชื่อที่จำได้จากรอบก่อนไม่ได้ ต้องค้นฐานข้อมูลเองทุกรอบ
 */

interface PersonAttrs {
  id: number;
  age: number;
  hatColor: string;
  shirtColor: string;
  heightCm: number;
  district: string;
}

const PEOPLE_ATTRS: PersonAttrs[] = [
  { id: 1, age: 34, hatColor: "red", shirtColor: "white", heightCm: 183, district: "Old Town" },
  { id: 2, age: 28, hatColor: "blue", shirtColor: "black", heightCm: 176, district: "Neon District" },
  { id: 3, age: 41, hatColor: "red", shirtColor: "green", heightCm: 165, district: "Old Town" },
  { id: 4, age: 25, hatColor: "green", shirtColor: "white", heightCm: 170, district: "Riverside" },
  { id: 5, age: 50, hatColor: "black", shirtColor: "blue", heightCm: 181, district: "Neon District" },
  { id: 6, age: 33, hatColor: "red", shirtColor: "red", heightCm: 179, district: "Riverside" },
  { id: 7, age: 29, hatColor: "yellow", shirtColor: "yellow", heightCm: 158, district: "Old Town" },
  { id: 8, age: 45, hatColor: "blue", shirtColor: "grey", heightCm: 190, district: "Downtown" },
  { id: 9, age: 38, hatColor: "none", shirtColor: "pink", heightCm: 162, district: "Downtown" },
  { id: 10, age: 27, hatColor: "black", shirtColor: "black", heightCm: 185, district: "Neon District" },
  { id: 11, age: 31, hatColor: "white", shirtColor: "blue", heightCm: 172, district: "Riverside" },
  { id: 12, age: 36, hatColor: "red", shirtColor: "black", heightCm: 168, district: "Downtown" },
  { id: 13, age: 22, hatColor: "green", shirtColor: "pink", heightCm: 160, district: "Old Town" },
  { id: 14, age: 55, hatColor: "brown", shirtColor: "brown", heightCm: 174, district: "Riverside" },
  { id: 15, age: 30, hatColor: "blue", shirtColor: "white", heightCm: 188, district: "Downtown" },
  { id: 16, age: 26, hatColor: "none", shirtColor: "green", heightCm: 167, district: "Neon District" },
  { id: 17, age: 48, hatColor: "black", shirtColor: "grey", heightCm: 177, district: "Old Town" },
  { id: 18, age: 35, hatColor: "yellow", shirtColor: "white", heightCm: 155, district: "Downtown" },
  { id: 19, age: 40, hatColor: "red", shirtColor: "blue", heightCm: 171, district: "Neon District" },
  { id: 20, age: 44, hatColor: "white", shirtColor: "black", heightCm: 182, district: "Riverside" },
];

/**
 * คลังชื่อสำรอง — มากกว่าจำนวนคน (20) เพื่อให้แต่ละรอบเล่นได้ชุดชื่อไม่ซ้ำเดิม
 * ชื่อเล่น (คำแรก) ทุกชื่อในคลังนี้ไม่ซ้ำกัน กันปัญหาสองคนในรอบเดียวกันมีชื่อเล่นชนกัน
 */
const NAME_POOL = [
  "สมชาย มั่งมี",
  "ปรีชา ทองดี",
  "มานี ศรีสุข",
  "วิภา จันทร์เพ็ญ",
  "ธนา รุ่งเรือง",
  "กิตติ แสงทอง",
  "นภา ดาวเรือง",
  "อนันต์ ภูผา",
  "สุดา ไพรวัลย์",
  "วีระ เข้มแข็ง",
  "จิรา สายลม",
  "เอกชัย พลเดช",
  "พิมพ์ใจ หวานเย็น",
  "สมหมาย ใจดี",
  "ชลธี คลื่นลม",
  "รัตนา แก้วใส",
  "ประเสริฐ มั่นคง",
  "อารีย์ สุขสันต์",
  "ณรงค์ ฟ้าใส",
  "บุญมี ทรัพย์เจริญ",
  "สุรชัย เจริญพร",
  "มาลี พรหมมา",
  "วรรณา ทิพย์รส",
  "สมพงษ์ ยิ้มแย้ม",
  "นิรันดร์ เกียรติศักดิ์",
  "ปัทมา แสงจันทร์",
  "ธีระ วงศ์สุวรรณ",
  "กมลา อินทร์แก้ว",
  "ไพโรจน์ ศรีวิไล",
  "สายฝน บัวขาว",
  "ชูชาติ ทองมา",
  "ดวงใจ รักชาติ",
];

function shuffled<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** สุ่มชื่อชุดใหม่สำหรับหนึ่งรอบเล่น คืนเป็น array ที่ names[i] คือชื่อของคน id = i + 1 */
export function pickSessionNames(): string[] {
  return shuffled(NAME_POOL).slice(0, PEOPLE_ATTRS.length);
}

/** ชื่อชุดตั้งต้น ใช้ตอนเรนเดอร์ฝั่งเซิร์ฟเวอร์ (หน้า Home) ที่ไม่ต้องสุ่มจริง */
export const DEFAULT_NAMES = PEOPLE_ATTRS.map((_, i) => NAME_POOL[i]);

function peopleTableSql(names: string[]): string {
  const rows = PEOPLE_ATTRS.map((p, i) => {
    const name = names[i] ?? NAME_POOL[i];
    return `(${p.id},'${name}',${p.age},'${p.hatColor}','${p.shirtColor}',${p.heightCm},'${p.district}')`;
  }).join(",\n");

  return `CREATE TABLE people (
  id INTEGER PRIMARY KEY, name TEXT, age INTEGER,
  hat_color TEXT, shirt_color TEXT, height_cm INTEGER, district TEXT
);
INSERT INTO people VALUES
${rows};`;
}

/** ตารางที่เหลือ อ้างอิงคนด้วย id ทั้งหมด จึงไม่ผูกกับชื่อ ไม่ต้องสุ่มใหม่ */
const OTHER_TABLES_SQL = `
CREATE TABLE complaints (
  id INTEGER PRIMARY KEY, type TEXT, location TEXT, reported_at TEXT, description TEXT
);
INSERT INTO complaints VALUES
(1,'littering','Zorange Park','2026-03-01 09:12','ถุงขนมกองอยู่ข้างม้านั่ง พยานเห็นชายใส่หมวกแดง สูงเกิน 180 ซม.'),
(2,'noise','Neon Alley','2026-03-02 22:40','เปิดเพลงเสียงดัง'),
(3,'noise','Riverside Walk','2026-03-05 23:15','ตีกลองกลางดึก'),
(4,'graffiti','Old Town Wall','2026-03-06 02:30','พ่นสีสเปรย์บนกำแพงเมืองเก่า'),
(5,'noise','Downtown Plaza','2026-03-07 21:05','คาราโอเกะกลางลาน'),
(6,'littering','Neon Alley','2026-03-08 08:00','ทิ้งแก้วกาแฟ'),
(7,'parking','Zorange Mall','2026-03-08 13:20','จอดขวางทางเข้า'),
(8,'noise','Zorange Park','2026-03-04 20:00','ซ้อมวงดนตรี');

CREATE TABLE vehicles (
  id INTEGER PRIMARY KEY, owner_id INTEGER, plate TEXT, color TEXT, model TEXT
);
INSERT INTO vehicles VALUES
(1,5,'ZR-1123','black','sedan'),
(2,8,'ZR-2244','white','pickup'),
(3,2,'ZR-3390','red','hatchback'),
(4,15,'ZR-4471','blue','van'),
(5,20,'ZR-5502','silver','sedan'),
(6,10,'ZR-6613','black','suv'),
(7,12,'ZR-7724','green','sedan'),
(8,14,'ZR-8835','white','truck');

CREATE TABLE parking_tickets (
  id INTEGER PRIMARY KEY, plate TEXT, location TEXT, issued_at TEXT, paid INTEGER
);
INSERT INTO parking_tickets VALUES
(1,'ZR-1123','Zorange Mall','2026-03-02 10:00',1),
(2,'ZR-3390','Zorange Mall','2026-03-08 13:20',0),
(3,'ZR-4471','Old Town','2026-03-03 11:00',0),
(4,'ZR-6613','Zorange Mall','2026-03-05 15:30',1),
(5,'ZR-7724','Riverside','2026-03-06 09:00',0),
(6,'ZR-8835','Zorange Mall','2026-03-07 18:00',1);

CREATE TABLE cctv_logs (
  id INTEGER PRIMARY KEY, camera_location TEXT, person_id INTEGER, seen_at TEXT
);
INSERT INTO cctv_logs VALUES
(1,'Neon Alley',10,'2026-03-02 22:10'),
(2,'Neon Alley',10,'2026-03-02 22:35'),
(3,'Neon Alley',2,'2026-03-02 22:50'),
(4,'Neon Alley',5,'2026-03-03 19:00'),
(5,'Neon Alley',10,'2026-03-04 21:15'),
(6,'Neon Alley',16,'2026-03-05 18:40'),
(7,'Neon Alley',10,'2026-03-06 23:05'),
(8,'Neon Alley',2,'2026-03-07 20:20'),
(9,'Neon Alley',16,'2026-03-08 07:55'),
(10,'Zorange Park',6,'2026-03-01 09:05'),
(11,'Zorange Park',1,'2026-03-01 09:08'),
(12,'Zorange Park',13,'2026-03-04 20:10'),
(13,'Old Town Wall',15,'2026-03-04 01:20'),
(14,'Old Town Wall',12,'2026-03-06 02:15'),
(15,'Old Town Wall',12,'2026-03-06 02:41'),
(16,'Old Town Gate',1,'2026-03-06 01:10'),
(17,'Old Town Gate',3,'2026-03-06 00:40'),
(18,'Old Town Gate',7,'2026-03-06 02:05'),
(19,'Old Town Gate',13,'2026-03-06 03:30'),
(20,'Downtown Plaza',18,'2026-03-07 21:00'),
(21,'Downtown Plaza',9,'2026-03-07 21:30'),
(22,'Riverside Walk',11,'2026-03-05 23:10'),
(23,'Riverside Walk',14,'2026-03-05 23:20'),
(24,'Zorange Mall',2,'2026-03-08 13:15');

CREATE TABLE hotel_stays (
  id INTEGER PRIMARY KEY, guest_id INTEGER, room INTEGER,
  check_in TEXT, check_out TEXT, actual_checkout TEXT
);
INSERT INTO hotel_stays VALUES
(1,4,201,'2026-03-01 14:00','2026-03-03 12:00','2026-03-03 11:20'),
(2,7,305,'2026-03-02 15:00','2026-03-04 12:00','2026-03-04 15:45'),
(3,13,410,'2026-03-03 13:00','2026-03-05 12:00','2026-03-05 12:00'),
(4,18,112,'2026-03-04 16:00','2026-03-06 12:00','2026-03-06 10:30'),
(5,9,507,'2026-03-05 14:00','2026-03-07 12:00','2026-03-07 11:55');

CREATE TABLE purchases (
  id INTEGER PRIMARY KEY, person_id INTEGER, item TEXT, price REAL, bought_at TEXT, shop TEXT
);
INSERT INTO purchases VALUES
(1,6,'spray paint',180,'2026-03-01 10:00','Old Town Hardware'),
(2,12,'spray paint',195,'2026-03-05 18:00','Downtown Hardware'),
(3,15,'spray paint',175,'2026-03-05 20:00','Downtown Hardware'),
(4,17,'spray paint',180,'2026-03-05 19:30','Old Town Hardware'),
(5,12,'black gloves',250,'2026-03-05 18:10','Downtown Hardware'),
(6,2,'coffee',65,'2026-03-08 08:00','Neon Cafe'),
(7,10,'energy drink',35,'2026-03-02 21:00','Neon Mart'),
(8,9,'karaoke mic',890,'2026-03-06 11:00','Downtown Mall'),
(9,18,'speaker',1290,'2026-03-06 12:00','Downtown Mall'),
(10,7,'drum sticks',320,'2026-03-03 16:00','Music Zorange');

CREATE TABLE phone_calls (
  id INTEGER PRIMARY KEY, caller_id INTEGER, receiver_id INTEGER, called_at TEXT, duration_sec INTEGER
);
INSERT INTO phone_calls VALUES
(1,12,17,'2026-03-04 20:00',300),
(2,12,17,'2026-03-05 09:30',250),
(3,12,17,'2026-03-05 17:10',400),
(4,5,17,'2026-03-03 10:00',100),
(5,5,17,'2026-03-04 10:05',120),
(6,5,17,'2026-03-05 10:02',90),
(7,8,17,'2026-03-05 21:00',900),
(8,20,17,'2026-03-02 12:00',500),
(9,20,17,'2026-03-06 12:00',400),
(10,12,15,'2026-03-05 19:00',150);
`;

/** ประกอบ SQL ตั้งต้นทั้งชุดจากชื่อของรอบเล่นนี้ */
export function buildSeedSql(names: string[]): string {
  return `${peopleTableSql(names)}\n${OTHER_TABLES_SQL}`;
}

/** ชุด SQL แบบชื่อตั้งต้น ใช้ที่ที่ไม่สนใจค่าจริงของชื่อ (เช่น schemaFromSeed อ่านแค่โครงตาราง) */
export const SEED_SQL = buildSeedSql(DEFAULT_NAMES);
