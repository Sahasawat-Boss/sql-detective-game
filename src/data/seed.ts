/**
 * ข้อมูลตั้งต้นของฐานข้อมูลเมือง Los Zorangeles
 * รันครั้งเดียวตอนสร้าง in-memory SQLite
 */
export const SEED_SQL = `
CREATE TABLE people (
  id INTEGER PRIMARY KEY, name TEXT, age INTEGER,
  hat_color TEXT, shirt_color TEXT, height_cm INTEGER, district TEXT
);
INSERT INTO people VALUES
(1,'สมชาย มั่งมี',34,'red','white',183,'Old Town'),
(2,'ปรีชา ทองดี',28,'blue','black',176,'Neon District'),
(3,'มานี ศรีสุข',41,'red','green',165,'Old Town'),
(4,'วิภา จันทร์เพ็ญ',25,'green','white',170,'Riverside'),
(5,'ธนา รุ่งเรือง',50,'black','blue',181,'Neon District'),
(6,'กิตติ แสงทอง',33,'red','red',179,'Riverside'),
(7,'นภา ดาวเรือง',29,'yellow','yellow',158,'Old Town'),
(8,'อนันต์ ภูผา',45,'blue','grey',190,'Downtown'),
(9,'สุดา ไพรวัลย์',38,'none','pink',162,'Downtown'),
(10,'วีระ เข้มแข็ง',27,'black','black',185,'Neon District'),
(11,'จิรา สายลม',31,'white','blue',172,'Riverside'),
(12,'เอกชัย พลเดช',36,'red','black',168,'Downtown'),
(13,'พิมพ์ใจ หวานเย็น',22,'green','pink',160,'Old Town'),
(14,'สมหมาย ใจดี',55,'brown','brown',174,'Riverside'),
(15,'ชลธี คลื่นลม',30,'blue','white',188,'Downtown'),
(16,'รัตนา แก้วใส',26,'none','green',167,'Neon District'),
(17,'ประเสริฐ มั่นคง',48,'black','grey',177,'Old Town'),
(18,'อารีย์ สุขสันต์',35,'yellow','white',155,'Downtown'),
(19,'ณรงค์ ฟ้าใส',40,'red','blue',171,'Neon District'),
(20,'บุญมี ทรัพย์เจริญ',44,'white','black',182,'Riverside');

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
