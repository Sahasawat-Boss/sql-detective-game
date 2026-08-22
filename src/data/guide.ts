import type { GuideChapter } from "@/types";

/**
 * คู่มือคำสั่ง SQL เรียงจากง่ายไปยาก
 * ตัวอย่างทั้งหมดรันได้จริงกับฐานข้อมูลเมือง Los Zorangeles ใน src/data/seed.ts
 * เพิ่มบทใหม่ได้โดยต่อ object ท้าย array นี้ — สารบัญกับหน้า Home ปรับตามอัตโนมัติ
 */
export const GUIDE: GuideChapter[] = [
  {
    id: "select",
    n: 1,
    title: "อ่านข้อมูลออกมาดูก่อน",
    level: "พื้นฐาน",
    summary:
      "ก่อนไขคดีต้องเห็นของกลางก่อน บทนี้คือคำสั่งที่ใช้บ่อยที่สุดในชีวิตการทำงาน — ดึงข้อมูลจากตารางออกมาดู",
    cases: [1],
    topics: [
      {
        id: "select-from",
        title: "SELECT · FROM — หยิบคอลัมน์จากตาราง",
        what: "คำสั่งพื้นฐานที่สุด บอกว่า “เอาคอลัมน์ไหน” จาก “ตารางไหน”",
        syntax: "SELECT คอลัมน์1, คอลัมน์2 FROM ชื่อตาราง;",
        examples: [
          {
            label: "ดูทุกคอลัมน์ในตารางประชากร",
            sql: "SELECT * FROM people;",
            explain:
              "<code>*</code> แปลว่าเอาทุกคอลัมน์ เหมาะกับตอนสำรวจว่าในตารางมีอะไรบ้าง แต่เวลาทำงานจริงควรระบุชื่อคอลัมน์ เพราะอ่านง่ายกว่าและไม่พังเวลามีคนเพิ่มคอลัมน์ใหม่",
            output: "20 แถว · id, name, age, hat_color, shirt_color, height_cm, district",
          },
          {
            label: "เอาแค่ชื่อกับส่วนสูง",
            sql: "SELECT name, height_cm FROM people;",
            explain:
              "ลำดับคอลัมน์ในผลลัพธ์เรียงตามที่เขียนหลัง <code>SELECT</code> ไม่ใช่ตามลำดับในตาราง",
            output: "20 แถว · name, height_cm",
          },
          {
            label: "คำนวณระหว่างทางก็ได้",
            sql: "SELECT name, age, age + 10 AS age_in_10_years FROM people;",
            explain:
              "คอลัมน์ในผลลัพธ์ไม่จำเป็นต้องมีอยู่จริงในตาราง จะคำนวณสด ๆ แล้วตั้งชื่อให้ด้วย <code>AS</code> ก็ได้",
          },
        ],
        pitfalls: [
          "ลืมเซมิโคลอน <code>;</code> ท้ายคำสั่ง — ในเกมนี้ไม่ใส่ก็รันได้ แต่ติดนิสัยใส่ไว้ดีกว่า เพราะเครื่องมือหลายตัวใช้มันแยกคำสั่ง",
          "<code>SELECT *</code> กับตารางที่มี 50 คอลัมน์คือฝันร้ายของคนอ่านผลลัพธ์ ระบุเฉพาะคอลัมน์ที่ใช้จริง",
        ],
      },
      {
        id: "alias-distinct",
        title: "AS · DISTINCT — ตั้งชื่อใหม่ และตัดค่าซ้ำ",
        what: "ทำให้หัวตารางอ่านรู้เรื่อง และดูว่าคอลัมน์หนึ่งเก็บค่าอะไรได้บ้าง",
        syntax: "SELECT DISTINCT คอลัมน์ AS ชื่อใหม่ FROM ตาราง;",
        examples: [
          {
            label: "เมืองนี้มีเขตอะไรบ้าง",
            sql: "SELECT DISTINCT district FROM people;",
            explain:
              "<code>DISTINCT</code> ยุบแถวที่ค่าซ้ำกันให้เหลือแถวเดียว เป็นท่าแรกที่ควรทำเวลาเจอคอลัมน์ที่ยังไม่รู้ว่าเก็บค่าอะไรได้บ้าง",
            output: "4 แถว — Old Town, Neon District, Riverside, Downtown",
          },
          {
            label: "ตั้งชื่อคอลัมน์เป็นภาษาคน",
            sql: "SELECT name AS suspect, hat_color AS hat FROM people;",
            explain:
              "<code>AS</code> เปลี่ยนแค่หัวตารางในผลลัพธ์ ไม่ได้แก้ชื่อคอลัมน์จริงในฐานข้อมูล ถ้าชื่อใหม่มีเว้นวรรคให้ครอบด้วย double quote เช่น <code>AS \"ชื่อผู้ต้องสงสัย\"</code>",
          },
          {
            label: "คู่ค่าที่ไม่ซ้ำกัน",
            sql: "SELECT DISTINCT hat_color, shirt_color FROM people;",
            explain:
              "ใส่หลายคอลัมน์หลัง <code>DISTINCT</code> = ตัดซ้ำโดยดูทั้งชุดพร้อมกัน ไม่ใช่ตัดซ้ำทีละคอลัมน์",
          },
        ],
        pitfalls: [
          "<code>DISTINCT</code> ทำงานกับทั้งแถวผลลัพธ์เสมอ เขียน <code>SELECT DISTINCT name, id</code> แล้วยังเห็นชื่อซ้ำ เพราะ id ต่างกัน",
        ],
      },
      {
        id: "write-commands",
        title: "INSERT · UPDATE · DELETE — คำสั่งที่เกมนี้บล็อกไว้",
        what: "คำสั่งฝั่งเขียนข้อมูล รู้ไว้ให้ครบ แต่ในเกมถูกกันไว้ไม่ให้ของกลางเพี้ยน",
        syntax: "INSERT INTO ตาราง (คอลัมน์…) VALUES (ค่า…);",
        examples: [
          {
            label: "เพิ่มแถวใหม่",
            sql: "INSERT INTO people (name, age, hat_color, height_cm, district)\nVALUES ('พยานปริศนา', 33, 'grey', 170, 'Old Town');",
            explain:
              "ระบุชื่อคอลัมน์ไว้เสมอ ถ้าเขียน <code>INSERT INTO people VALUES (…)</code> เฉย ๆ ต้องใส่ค่าครบทุกคอลัมน์ตามลำดับเป๊ะ ซึ่งพังทันทีที่มีคนเพิ่มคอลัมน์ใหม่",
          },
          {
            label: "แก้ข้อมูลเดิม",
            sql: "UPDATE people SET hat_color = 'blue' WHERE id = 1;",
            explain:
              "<b>ห้ามลืม <code>WHERE</code></b> — ถ้าลืม ทุกแถวในตารางจะโดนเปลี่ยนหมด นี่คือวิธีทำลายฐานข้อมูลจริงที่คนพลาดกันบ่อยที่สุด",
          },
          {
            label: "ลบแถว",
            sql: "DELETE FROM people WHERE id = 1;",
            explain:
              "ทริกกันพลาด: เขียน <code>SELECT * FROM people WHERE id = 1;</code> ก่อน ดูให้ชัดว่าโดนกี่แถว แล้วค่อยเปลี่ยน <code>SELECT *</code> เป็น <code>DELETE</code>",
          },
        ],
        pitfalls: [
          "ในเกมนี้ <code>lib/sqlGuard.ts</code> จะปัดตกคิวรีที่มี INSERT/UPDATE/DELETE/DROP/ALTER — โหมดนักสืบอ่านอย่างเดียว",
          "ของจริงควรทำในทรานแซกชัน (บทที่ 8) จะได้ <code>ROLLBACK</code> กลับได้ถ้าเผลอ",
        ],
      },
    ],
  },
  {
    id: "where",
    n: 2,
    title: "กรองแถวด้วย WHERE",
    level: "พื้นฐาน",
    summary:
      "หัวใจของงานสืบสวน — ตัดคนที่ไม่เกี่ยวออกจนเหลือผู้ต้องสงสัย พยานให้การมาแบบไหน ก็แปลเป็นเงื่อนไขแบบนั้น",
    cases: [1, 2],
    topics: [
      {
        id: "compare",
        title: "ตัวเปรียบเทียบ = <> > < >= <=",
        what: "เทียบค่าในคอลัมน์กับค่าที่กำหนด แถวไหนเงื่อนไขเป็นจริงถึงจะถูกดึงออกมา",
        syntax: "SELECT … FROM ตาราง WHERE คอลัมน์ = 'ค่า';",
        examples: [
          {
            label: "คนที่ใส่หมวกแดง",
            sql: "SELECT name, hat_color FROM people\nWHERE hat_color = 'red';",
            explain:
              "ข้อความต้องครอบด้วย single quote เสมอ ตัวเลขไม่ต้อง และ SQL ใช้ <code>=</code> ตัวเดียวในการเทียบ (ไม่ใช่ <code>==</code> แบบภาษาโปรแกรมทั่วไป)",
            output: "5 แถว — สมชาย, มานี, กิตติ, เอกชัย, ณรงค์",
          },
          {
            label: "คนที่สูงเกิน 180",
            sql: "SELECT name, height_cm FROM people\nWHERE height_cm > 180;",
            explain:
              "“เกิน 180” คือ <code>&gt; 180</code> (ไม่รวม 180) ส่วน “ตั้งแต่ 180 ขึ้นไป” คือ <code>&gt;= 180</code> — คดีชี้เป็นชี้ตายกันตรงรายละเอียดนี้บ่อยมาก",
            output: "6 แถว — สมชาย 183, ธนา 181, อนันต์ 190, วีระ 185, ชลธี 188, บุญมี 182",
          },
          {
            label: "ทุกคนที่ไม่ได้อยู่ Old Town",
            sql: "SELECT name, district FROM people\nWHERE district <> 'Old Town';",
            explain:
              "<code>&lt;&gt;</code> คือ “ไม่เท่ากับ” เขียนเป็น <code>!=</code> ก็ได้ SQLite รับทั้งสองแบบ",
          },
        ],
        pitfalls: [
          "การเทียบข้อความสนตัวพิมพ์ใหญ่เล็ก <code>'Red'</code> ไม่เท่ากับ <code>'red'</code> ถ้าไม่แน่ใจให้ใช้ <code>WHERE LOWER(hat_color) = 'red'</code>",
          "ค่าว่างต้องใช้ <code>IS NULL</code> เท่านั้น เขียน <code>= NULL</code> จะไม่มีวันเป็นจริง",
        ],
      },
      {
        id: "and-or",
        title: "AND · OR · NOT — ต่อหลายเงื่อนไข",
        what: "พยานมักให้เบาะแสมาหลายอย่างพร้อมกัน ต้องรวมเงื่อนไขให้ถูกตรรกะ",
        syntax: "WHERE เงื่อนไข1 AND (เงื่อนไข2 OR เงื่อนไข3)",
        examples: [
          {
            label: "หมวกน้ำเงิน และ สูงเกิน 180",
            sql: "SELECT name, hat_color, height_cm FROM people\nWHERE hat_color = 'blue' AND height_cm > 180;",
            explain:
              "<code>AND</code> = ต้องจริงทั้งคู่ ยิ่งต่อ AND ยิ่งได้แถวน้อยลง เป็นวิธีบีบวงผู้ต้องสงสัยที่ตรงไปตรงมาที่สุด — สำนวนที่ 1 ในเกมใช้ท่านี้ตรง ๆ แค่เปลี่ยนสีหมวก",
            output: "2 แถว — อนันต์ ภูผา 190, ชลธี คลื่นลม 188",
          },
          {
            label: "อยู่ Old Town หรือ Riverside",
            sql: "SELECT name, district FROM people\nWHERE district = 'Old Town' OR district = 'Riverside';",
            explain: "<code>OR</code> = จริงข้อใดข้อหนึ่งก็พอ ยิ่งต่อ OR ยิ่งได้แถวเยอะขึ้น",
          },
          {
            label: "ใส่วงเล็บให้ตรรกะไม่เพี้ยน",
            sql: "SELECT name, district, age FROM people\nWHERE (district = 'Old Town' OR district = 'Riverside')\n  AND age < 35;",
            explain:
              "<code>AND</code> มีลำดับความสำคัญสูงกว่า <code>OR</code> ถ้าไม่ใส่วงเล็บ SQL จะอ่านเป็น <code>district='Old Town' OR (district='Riverside' AND age&lt;35)</code> ซึ่งคนละความหมายกันเลย",
          },
        ],
        pitfalls: [
          "เจอเงื่อนไขผสม AND กับ OR เมื่อไหร่ ให้ใส่วงเล็บทุกครั้ง แม้จะรู้ลำดับอยู่แล้ว — คนที่มาอ่านต่อจะขอบคุณ",
        ],
      },
      {
        id: "like-in-between",
        title: "LIKE · IN · BETWEEN · IS NULL",
        what: "เงื่อนไขแบบ “คล้าย ๆ” “อยู่ในกลุ่มนี้” และ “อยู่ในช่วงนี้”",
        syntax: "WHERE คอลัมน์ LIKE 'ข้อความ%' | IN (…) | BETWEEN a AND b",
        examples: [
          {
            label: "ร้านที่ชื่อขึ้นต้นด้วย Old",
            sql: "SELECT DISTINCT shop FROM purchases\nWHERE shop LIKE 'Old%';",
            explain:
              "<code>%</code> แทนอักษรกี่ตัวก็ได้ (รวมศูนย์ตัว) ส่วน <code>_</code> แทนอักษรหนึ่งตัวพอดี เช่น <code>plate LIKE 'ZR-__23'</code>",
            output: "1 แถว — Old Town Hardware",
          },
          {
            label: "เรื่องร้องเรียนหลายประเภทพร้อมกัน",
            sql: "SELECT type, location FROM complaints\nWHERE type IN ('noise', 'graffiti');",
            explain:
              "<code>IN</code> คือ OR หลาย ๆ อันย่อให้สั้น เทียบเท่ากับ <code>type='noise' OR type='graffiti'</code> แต่อ่านง่ายกว่ามากเมื่อรายการยาว",
            output: "5 แถว",
          },
          {
            label: "การซื้อของในช่วงราคาหนึ่ง",
            sql: "SELECT item, price FROM purchases\nWHERE price BETWEEN 100 AND 300;",
            explain:
              "<code>BETWEEN</code> <b>รวมปลายทั้งสองข้าง</b> เท่ากับ <code>price &gt;= 100 AND price &lt;= 300</code>",
            output: "5 แถว — spray paint ×4, black gloves",
          },
          {
            label: "คนที่ไม่มีข้อมูลสีหมวก",
            sql: "SELECT name, hat_color FROM people\nWHERE hat_color IS NULL;",
            explain:
              "ในฐานข้อมูลนี้ไม่มีใครเป็น NULL แต่มีคนที่เก็บค่าไว้ว่า <code>'none'</code> ซึ่งคนละเรื่องกับ “ไม่มีข้อมูล” — ต้องดูข้อมูลจริงก่อนเสมอว่าเขาแทนค่าว่างด้วยอะไร",
            output: "0 แถว",
          },
        ],
        pitfalls: [
          "<code>NOT IN</code> ที่เจอ NULL ในรายการ จะคืนศูนย์แถวแบบเงียบ ๆ (ดูบทที่ 6)",
          "<code>LIKE '%คำ%'</code> ค้นได้ก็จริงแต่ช้ากับตารางใหญ่ เพราะใช้ index ไม่ได้",
        ],
      },
    ],
  },
  {
    id: "order",
    n: 3,
    title: "เรียงลำดับและตัดยอด",
    level: "พื้นฐาน",
    summary:
      "คำถามแนว “ล่าสุดคืออันไหน” “ใครสูงที่สุด” ตอบด้วยการเรียงข้อมูลแล้วหยิบมาแค่ยอดบน",
    cases: [2],
    topics: [
      {
        id: "order-by",
        title: "ORDER BY — เรียงผลลัพธ์",
        what: "จัดเรียงแถวตามคอลัมน์ที่กำหนด จากน้อยไปมาก (ASC) หรือมากไปน้อย (DESC)",
        syntax: "SELECT … FROM ตาราง ORDER BY คอลัมน์ [ASC|DESC];",
        examples: [
          {
            label: "เรียงคนตามส่วนสูง มากไปน้อย",
            sql: "SELECT name, height_cm FROM people\nORDER BY height_cm DESC;",
            explain:
              "ไม่ใส่อะไรต่อท้าย = <code>ASC</code> (น้อยไปมาก) เป็นค่าเริ่มต้น ใส่ <code>DESC</code> เมื่ออยากได้มากไปน้อย",
            output: "แถวแรก — อนันต์ ภูผา 190",
          },
          {
            label: "เรียงสองชั้น",
            sql: "SELECT name, district, age FROM people\nORDER BY district ASC, age DESC;",
            explain:
              "เรียงตามเขตก่อน ถ้าเขตเดียวกันค่อยเรียงตามอายุจากมากไปน้อย — คอลัมน์ที่เขียนทีหลังใช้ตัดสินเฉพาะตอนที่คอลัมน์ก่อนหน้าเสมอกัน",
          },
          {
            label: "เรียงตามคอลัมน์ที่คำนวณขึ้นมา",
            sql: "SELECT name, height_cm - 170 AS diff FROM people\nORDER BY diff DESC;",
            explain:
              "<code>ORDER BY</code> ทำงานหลัง <code>SELECT</code> เลยเรียกชื่อ alias ได้ ต่างจาก <code>WHERE</code> ที่ทำงานก่อน จึงเรียก alias ไม่ได้",
          },
        ],
        pitfalls: [
          "ถ้าไม่เขียน <code>ORDER BY</code> ฐานข้อมูลไม่รับประกันลำดับแถว อย่าไปเชื่อลำดับที่บังเอิญเห็น",
          "คอลัมน์วันเวลาที่เก็บเป็น TEXT รูปแบบ <code>YYYY-MM-DD HH:MM</code> เรียงแบบข้อความแล้วได้ลำดับเวลาที่ถูกต้องพอดี (ดูบทที่ 7)",
        ],
      },
      {
        id: "limit-offset",
        title: "LIMIT · OFFSET — เอามาแค่ไม่กี่แถว",
        what: "ตัดผลลัพธ์ให้เหลือเท่าที่ต้องการ คู่กับ ORDER BY เพื่อตอบคำถามแนว “ที่สุด”",
        syntax: "SELECT … ORDER BY … LIMIT จำนวน OFFSET ข้ามกี่แถว;",
        examples: [
          {
            label: "เรื่องทิ้งขยะที่ร้องเรียนเข้ามาล่าสุด",
            sql: "SELECT location, reported_at FROM complaints\nWHERE type = 'littering'\nORDER BY reported_at DESC\nLIMIT 1;",
            explain:
              "สูตรมาตรฐานของคำถามแนว “ล่าสุด / มากสุด / น้อยสุด” คือ กรอง → เรียง → <code>LIMIT 1</code> — สำนวนที่ 2 ในเกมใช้ท่าเดียวกันนี้กับเรื่องร้องเรียนอีกประเภท",
            output: "1 แถว — Neon Alley · 2026-03-08 08:00",
          },
          {
            label: "อันดับ 2 ถึง 4",
            sql: "SELECT name, height_cm FROM people\nORDER BY height_cm DESC\nLIMIT 3 OFFSET 1;",
            explain:
              "<code>OFFSET 1</code> คือข้ามแถวแรกไป แล้วค่อยเอา 3 แถวถัดมา — เป็นวิธีทำ pagination แบบง่ายที่สุด",
          },
        ],
        pitfalls: [
          "<code>LIMIT</code> โดยไม่มี <code>ORDER BY</code> = สุ่มหยิบมาโดยไม่รู้เกณฑ์ อาจได้คนละแถวในแต่ละครั้งที่รัน",
          "ถ้ามีค่าเสมอกันที่ตำแหน่งตัด <code>LIMIT 1</code> จะเลือกมาแค่แถวเดียวเงียบ ๆ ถ้าอยากได้ทุกคนที่เสมอกันต้องใช้ window function (บทที่ 8) หรือ subquery (บทที่ 6)",
        ],
      },
    ],
  },
  {
    id: "aggregate",
    n: 4,
    title: "นับและสรุปยอด",
    level: "ระดับกลาง",
    summary:
      "เปลี่ยนจาก “ดูข้อมูลทีละแถว” เป็น “สรุปเป็นตัวเลข” — ใครโผล่กล้องวงจรปิดกี่ครั้ง ใครโทรหาใครรวมกี่นาที",
    cases: [4, 7],
    topics: [
      {
        id: "agg-functions",
        title: "COUNT · SUM · AVG · MIN · MAX",
        what: "ยุบหลายแถวให้เหลือตัวเลขสรุปตัวเดียว",
        syntax: "SELECT COUNT(*), AVG(คอลัมน์) FROM ตาราง;",
        examples: [
          {
            label: "ในเมืองนี้มีกี่คน",
            sql: "SELECT COUNT(*) AS total FROM people;",
            explain:
              "<code>COUNT(*)</code> นับทุกแถว ส่วน <code>COUNT(คอลัมน์)</code> นับเฉพาะแถวที่คอลัมน์นั้นไม่เป็น NULL — ต่างกันตรงนี้",
            output: "1 แถว — 20",
          },
          {
            label: "อายุเฉลี่ย สูงสุด ต่ำสุด ในทีเดียว",
            sql: "SELECT COUNT(*) AS n,\n       AVG(age) AS avg_age,\n       MIN(age) AS youngest,\n       MAX(age) AS oldest\nFROM people;",
            explain:
              "ใส่หลายฟังก์ชันในคิวรีเดียวได้ ทุกตัวสรุปจากชุดแถวเดียวกัน (คือทั้งตาราง เพราะยังไม่มี GROUP BY)",
            output: "1 แถว — 20, 35.85, 22, 55",
          },
          {
            label: "รวมยอดซื้อของทั้งเมือง",
            sql: "SELECT SUM(price) AS total_spent,\n       COUNT(DISTINCT person_id) AS buyers\nFROM purchases;",
            explain:
              "ใส่ <code>DISTINCT</code> ข้างในฟังก์ชันได้ — <code>COUNT(DISTINCT person_id)</code> คือ “มีกี่คน” ไม่ใช่ “ซื้อกี่ครั้ง”",
            output: "1 แถว — 3580, 9",
          },
        ],
        pitfalls: [
          "<code>AVG</code> ข้ามแถวที่เป็น NULL ไปเลย ไม่ได้นับเป็น 0 ถ้าอยากให้นับเป็นศูนย์ต้อง <code>AVG(COALESCE(คอลัมน์, 0))</code>",
          "<code>SUM</code> ของศูนย์แถวได้ NULL ไม่ใช่ 0",
        ],
      },
      {
        id: "group-by",
        title: "GROUP BY — สรุปแยกเป็นกลุ่ม",
        what: "แบ่งแถวเป็นกอง ๆ ตามค่าในคอลัมน์ แล้วสรุปตัวเลขของแต่ละกอง",
        syntax: "SELECT คอลัมน์กลุ่ม, COUNT(*) FROM ตาราง GROUP BY คอลัมน์กลุ่ม;",
        examples: [
          {
            label: "แต่ละเขตมีคนกี่คน",
            sql: "SELECT district, COUNT(*) AS people_count\nFROM people\nGROUP BY district\nORDER BY people_count DESC;",
            explain:
              "อ่านจากล่างขึ้นบน: จัดกองตามเขต → นับจำนวนในแต่ละกอง → เรียงจากกองใหญ่ไปเล็ก",
            output: "4 แถว — แต่ละเขตมี 5 คนเท่ากันพอดี",
          },
          {
            label: "กล้องตัวไหนบันทึกคนไว้เยอะสุด",
            sql: "SELECT camera_location, COUNT(*) AS logs\nFROM cctv_logs\nGROUP BY camera_location\nORDER BY logs DESC;",
            explain:
              "ลำดับการทำงานจริงคือ <code>FROM/JOIN → WHERE → GROUP BY → HAVING → SELECT → ORDER BY → LIMIT</code> เห็นภาพนี้แล้วจะเขียนถูกเองโดยไม่ต้องท่อง — สำนวนที่ 4 ในเกมคือท่านี้บวก JOIN เพื่อเอาชื่อคนมาแทนชื่อกล้อง",
            output: "7 แถว — Neon Alley มากที่สุด 9 ครั้ง",
          },
        ],
        pitfalls: [
          "คอลัมน์ที่อยู่ใน <code>SELECT</code> ต้องเป็นคอลัมน์ที่ใช้จัดกลุ่ม หรือไม่ก็อยู่ในฟังก์ชันสรุป — SQLite ปล่อยผ่านให้แล้วสุ่มค่ามาให้ ซึ่งอันตรายกว่าฐานข้อมูลตัวอื่นที่ฟ้อง error",
          "จัดกลุ่มด้วย <code>name</code> ในตารางที่ชื่อซ้ำกันได้ = คนละคนโดนยุบรวมกัน ปลอดภัยกว่าถ้า <code>GROUP BY p.id, p.name</code>",
        ],
      },
      {
        id: "having",
        title: "HAVING — กรองหลังสรุปยอด",
        what: "เงื่อนไขที่ต้องดูค่าสรุปถึงจะตัดสินได้ เช่น “กลุ่มที่มีมากกว่า 3 ครั้ง”",
        syntax: "SELECT … GROUP BY … HAVING COUNT(*) > 3;",
        examples: [
          {
            label: "เขตที่มีคนเกิน 4 คน",
            sql: "SELECT district, COUNT(*) AS n\nFROM people\nGROUP BY district\nHAVING COUNT(*) > 4;",
            explain:
              "<code>HAVING</code> ทำงานหลัง <code>GROUP BY</code> จึงเห็นค่า <code>COUNT(*)</code> ต่างจาก <code>WHERE</code> ที่ทำงานก่อนจัดกลุ่ม เลยไม่รู้จักค่าสรุปเลย",
            output: "4 แถว — ทุกเขตมี 5 คน",
          },
          {
            label: "ร้านที่ขายของให้มากกว่าหนึ่งครั้ง และยอดรวมเกิน 300",
            sql: "SELECT shop, COUNT(*) AS bills, SUM(price) AS total\nFROM purchases\nWHERE price > 50\nGROUP BY shop\nHAVING COUNT(*) > 1 AND SUM(price) > 300\nORDER BY total DESC;",
            explain:
              "คิวรีนี้ใช้ทั้งสองอย่างพร้อมกัน: <code>WHERE price &gt; 50</code> กรองทีละแถวก่อนจัดกลุ่ม แล้ว <code>HAVING</code> กรองทีละกลุ่มหลังสรุปยอด — สำนวนที่ 7 ในเกมคือโครงเดียวกันเป๊ะ แค่เปลี่ยนตารางเป็นบันทึกโทรศัพท์",
            output: "3 แถว — Downtown Mall, Downtown Hardware, Old Town Hardware",
          },
        ],
        pitfalls: [
          "อย่าเอาเงื่อนไขที่ <code>WHERE</code> ทำได้ไปใส่ <code>HAVING</code> — ได้ผลเท่ากันแต่ช้ากว่า เพราะจัดกลุ่มข้อมูลที่ไม่ต้องใช้ไปแล้ว",
          "จำสั้น ๆ: <b>WHERE กรองแถว · HAVING กรองกลุ่ม</b>",
        ],
      },
    ],
  },
  {
    id: "join",
    n: 5,
    title: "JOIN — ต่อหลายตารางเข้าด้วยกัน",
    level: "ระดับกลาง",
    summary:
      "ของกลางกระจายอยู่คนละตาราง ใบสั่งจอดรถมีแต่ทะเบียน ทะเบียนอยู่ในตารางรถ เจ้าของอยู่ในตารางคน — JOIN คือการลากเส้นเชื่อมสามอย่างนี้เข้าหากัน",
    cases: [3, 5, 8],
    topics: [
      {
        id: "inner-join",
        title: "INNER JOIN — เอาเฉพาะแถวที่จับคู่กันได้",
        what: "ต่อสองตารางด้วยคอลัมน์ที่มีค่าตรงกัน แถวไหนหาคู่ไม่เจอจะหายไป",
        syntax: "SELECT … FROM A JOIN B ON A.คอลัมน์ = B.คอลัมน์;",
        examples: [
          {
            label: "รถแต่ละคันเป็นของใคร",
            sql: "SELECT p.name, v.plate, v.model\nFROM vehicles v\nJOIN people p ON p.id = v.owner_id;",
            explain:
              "<code>v</code> กับ <code>p</code> คือชื่อย่อ (alias) ของตาราง ทำให้เขียนสั้นและบอกได้ชัดว่าคอลัมน์ไหนมาจากตารางไหน เวลาสองตารางมีคอลัมน์ชื่อซ้ำกัน (เช่น <code>id</code>) จำเป็นต้องมีอยู่แล้ว · <code>JOIN</code> เฉย ๆ คือ <code>INNER JOIN</code>",
            output: "8 แถว — เท่าจำนวนรถ",
          },
          {
            label: "ต่อสามตาราง: ใบสั่ง → รถ → เจ้าของ",
            sql: "SELECT p.name, v.plate, t.location, t.issued_at\nFROM parking_tickets t\nJOIN vehicles v ON v.plate = t.plate\nJOIN people p ON p.id = v.owner_id\nWHERE t.paid = 1;",
            explain:
              "ต่อกันเป็นทอด ๆ ได้เรื่อย ๆ ทีละ <code>JOIN</code> คิดเป็นภาพว่ากำลังลากเส้นจากใบสั่ง → ทะเบียนรถ → ตัวเจ้าของ · สำนวนที่ 3 ในเกมคือโครงนี้ แค่เปลี่ยนเงื่อนไขท้ายคิวรี",
            output: "3 แถว — ใบสั่งที่จ่ายค่าปรับแล้ว",
          },
          {
            label: "JOIN แล้วค่อยสรุปยอด",
            sql: "SELECT p.district, COUNT(*) AS vehicles\nFROM vehicles v\nJOIN people p ON p.id = v.owner_id\nGROUP BY p.district\nORDER BY vehicles DESC;",
            explain:
              "JOIN กับ GROUP BY ใช้ร่วมกันได้ตลอด: ต่อตารางให้ครบก่อน แล้วค่อยจัดกลุ่มจากคอลัมน์ที่เพิ่งต่อมาได้",
          },
        ],
        pitfalls: [
          "ลืมเขียน <code>ON</code> = ได้ <b>cross join</b> ทุกแถวคูณทุกแถว 20 คน × 8 คัน = 160 แถวขยะ",
          "ถ้าหนึ่งแถวฝั่งซ้ายจับคู่ได้หลายแถวฝั่งขวา ผลลัพธ์จะบานเป็นหลายแถว — <code>COUNT(*)</code> หลัง JOIN จึงมักได้เลขเกินจริง ระวังจุดนี้ให้มาก",
        ],
      },
      {
        id: "left-join",
        title: "LEFT JOIN — เก็บแถวฝั่งซ้ายไว้ทั้งหมด",
        what: "อยากได้รายการครบทุกแถวฝั่งซ้าย ต่อให้ฝั่งขวาไม่มีข้อมูลจับคู่ก็ตาม",
        syntax: "SELECT … FROM A LEFT JOIN B ON A.x = B.x;",
        examples: [
          {
            label: "คนทุกคน พร้อมทะเบียนรถ (ถ้ามี)",
            sql: "SELECT p.name, v.plate\nFROM people p\nLEFT JOIN vehicles v ON v.owner_id = p.id\nORDER BY p.id;",
            explain:
              "คนที่ไม่มีรถยังอยู่ในผลลัพธ์ แต่ช่อง <code>plate</code> จะเป็น NULL — ต่างจาก <code>INNER JOIN</code> ที่คนกลุ่มนี้จะหายไปทั้งแถว",
            output: "20 แถว — ครบทุกคน",
          },
          {
            label: "หา “คนที่ไม่มีของฝั่งขวาเลย”",
            sql: "SELECT p.name\nFROM people p\nLEFT JOIN vehicles v ON v.owner_id = p.id\nWHERE v.id IS NULL;",
            explain:
              "ท่ามาตรฐานชื่อ <b>anti-join</b>: LEFT JOIN แล้วกรองเอาเฉพาะแถวที่ฝั่งขวาเป็น NULL = คนที่ไม่มีรถ ใช้แทน <code>NOT IN</code> ได้และปลอดภัยกว่าเรื่อง NULL",
            output: "12 แถว",
          },
        ],
        pitfalls: [
          "เงื่อนไขของตารางฝั่งขวาต้องอยู่ใน <code>ON</code> ไม่ใช่ <code>WHERE</code> — เขียน <code>WHERE v.color='black'</code> เมื่อไหร่ LEFT JOIN จะกลายเป็น INNER JOIN ทันที เพราะแถวที่เป็น NULL ถูกกรองทิ้งไปหมด",
        ],
      },
      {
        id: "self-join",
        title: "SELF JOIN — ต่อตารางเข้ากับตัวเอง",
        what: "ใช้ตอนอยากเทียบแถวในตารางเดียวกันสองแถว เช่น หาคู่ที่อยู่เขตเดียวกัน",
        syntax: "SELECT … FROM ตาราง a JOIN ตาราง b ON a.x = b.x AND a.id < b.id;",
        examples: [
          {
            label: "คู่คนที่อยู่เขตเดียวกัน",
            sql: "SELECT a.name AS person_a, b.name AS person_b, a.district\nFROM people a\nJOIN people b ON b.district = a.district AND b.id > a.id\nORDER BY a.district\nLIMIT 10;",
            explain:
              "ตารางเดียวกันแต่ใช้ alias คนละชื่อ ระบบจะมองเป็นสองตาราง · เงื่อนไข <code>b.id &gt; a.id</code> กันไม่ให้ได้คู่ซ้ำแบบ (A,B) และ (B,A) และกันไม่ให้จับคู่กับตัวเอง",
          },
          {
            label: "บันทึกโทรศัพท์ที่อ่านออกเป็นชื่อคน",
            sql: "SELECT caller.name AS caller, receiver.name AS receiver, c.duration_sec\nFROM phone_calls c\nJOIN people caller ON caller.id = c.caller_id\nJOIN people receiver ON receiver.id = c.receiver_id\nORDER BY c.called_at\nLIMIT 5;",
            explain:
              "ตาราง <code>people</code> ถูก JOIN สองรอบ รอบหนึ่งเพื่อแปลง <code>caller_id</code> อีกรอบเพื่อแปลง <code>receiver_id</code> — เจอบ่อยมากกับตารางที่ชี้กลับไปหาตารางคนหลายคอลัมน์",
          },
        ],
        pitfalls: [
          "ลืมเงื่อนไขกันคู่ซ้ำ (<code>b.id &gt; a.id</code>) แล้วจำนวนแถวจะพองเป็นสองเท่าบวกคู่ที่จับกับตัวเอง",
        ],
      },
    ],
  },
  {
    id: "subquery",
    n: 6,
    title: "Subquery — คิวรีซ้อนคิวรี",
    level: "ระดับกลาง",
    summary:
      "บางคำถามต้องหาคำตอบย่อยก่อน เช่น “ใครที่ไม่อยู่ในรายชื่อกล้องคืนนั้น” — ต้องได้รายชื่อนั้นมาก่อน แล้วค่อยเอาไปกรองอีกที",
    cases: [6],
    topics: [
      {
        id: "in-subquery",
        title: "IN · NOT IN — ใช้ผลของอีกคิวรีเป็นรายการ",
        what: "เอาคอลัมน์เดียวจากคิวรีข้างในมาเป็นรายการค่าให้คิวรีข้างนอกกรอง",
        syntax: "WHERE คอลัมน์ IN (SELECT คอลัมน์ FROM อีกตาราง WHERE …)",
        examples: [
          {
            label: "คนที่มีรถ",
            sql: "SELECT name FROM people\nWHERE id IN (SELECT owner_id FROM vehicles);",
            explain:
              "คิวรีข้างในคืนรายการ <code>owner_id</code> ออกมา แล้วข้างนอกกรองคนที่ <code>id</code> อยู่ในรายการนั้น · คิวรีข้างในต้องคืน <b>คอลัมน์เดียว</b> เท่านั้น",
            output: "8 แถว",
          },
          {
            label: "คนใน Riverside ที่ไม่เคยติดกล้องเลย",
            sql: "SELECT name FROM people\nWHERE district = 'Riverside'\n  AND id NOT IN (SELECT person_id FROM cctv_logs);",
            explain:
              "<code>NOT IN</code> คือ “ไม่อยู่ในรายชื่อนั้น” = ท่าหาคนที่ไม่มีข้อแก้ตัว · สำนวนที่ 6 ในเกมใช้ท่านี้ แต่คิวรีข้างในจำกัดช่วงเวลาด้วย",
          },
          {
            label: "คนที่ซื้อของแพงกว่า 500",
            sql: "SELECT name FROM people\nWHERE id IN (\n  SELECT person_id FROM purchases WHERE price > 500\n);",
            explain:
              "คิวรีข้างในจะซับซ้อนแค่ไหนก็ได้ ตราบใดที่ยังคืนคอลัมน์เดียว — เขียนคิวรีข้างในให้รันผ่านเดี่ยว ๆ ก่อนเสมอ แล้วค่อยเอามาเสียบ",
            output: "2 แถว — สุดา ไพรวัลย์, อารีย์ สุขสันต์",
          },
        ],
        pitfalls: [
          "<b>กับดัก NULL:</b> ถ้ารายการจากคิวรีข้างในมี NULL ปนอยู่ <code>NOT IN</code> จะคืน 0 แถวเสมอ โดยไม่ฟ้อง error เลย ป้องกันด้วย <code>WHERE person_id IS NOT NULL</code> ในคิวรีข้างใน หรือเปลี่ยนไปใช้ anti-join / <code>NOT EXISTS</code>",
        ],
      },
      {
        id: "scalar-subquery",
        title: "Scalar subquery — คิวรีที่คืนค่าเดียว",
        what: "ใช้ค่าสรุปอย่างค่าเฉลี่ยหรือค่าสูงสุดมาเทียบในเงื่อนไข",
        syntax: "WHERE คอลัมน์ > (SELECT AVG(คอลัมน์) FROM ตาราง)",
        examples: [
          {
            label: "คนที่อายุมากกว่าค่าเฉลี่ยของเมือง",
            sql: "SELECT name, age FROM people\nWHERE age > (SELECT AVG(age) FROM people)\nORDER BY age DESC;",
            explain:
              "เขียน <code>WHERE age &gt; AVG(age)</code> ตรง ๆ ไม่ได้ เพราะ <code>WHERE</code> ทำงานทีละแถวและยังไม่รู้จักค่าสรุป ต้องให้คิวรีข้างในคำนวณค่าเฉลี่ยออกมาเป็นตัวเลขตัวเดียวก่อน",
            output: "9 แถว (ค่าเฉลี่ย 35.85)",
          },
          {
            label: "คนที่สูงที่สุด รวมทุกคนที่เสมอกัน",
            sql: "SELECT name, height_cm FROM people\nWHERE height_cm = (SELECT MAX(height_cm) FROM people);",
            explain:
              "ต่างจาก <code>ORDER BY … LIMIT 1</code> ตรงที่ถ้ามีคนสูงเท่ากันหลายคน ท่านี้ได้มาครบทุกคน",
            output: "1 แถว — อนันต์ ภูผา 190",
          },
        ],
        pitfalls: [
          "ถ้าคิวรีข้างในเผลอคืนมามากกว่าหนึ่งแถว SQLite จะหยิบแถวแรกมาใช้เงียบ ๆ ซึ่งอาจได้คำตอบผิดโดยไม่รู้ตัว",
        ],
      },
      {
        id: "exists",
        title: "EXISTS · correlated subquery",
        what: "ถามแค่ว่า “มีอยู่ไหม” โดยคิวรีข้างในอ้างถึงแถวที่กำลังพิจารณาอยู่ข้างนอก",
        syntax: "WHERE EXISTS (SELECT 1 FROM B WHERE B.x = A.x)",
        examples: [
          {
            label: "คนที่เคยซื้อของอย่างน้อยหนึ่งครั้ง",
            sql: "SELECT p.name\nFROM people p\nWHERE EXISTS (\n  SELECT 1 FROM purchases pu WHERE pu.person_id = p.id\n);",
            explain:
              "<code>SELECT 1</code> เพราะ EXISTS สนแค่ว่ามีแถวไหม ไม่สนว่าค่าอะไร · คิวรีข้างในอ้าง <code>p.id</code> ของแถวข้างนอก แบบนี้เรียก correlated subquery",
            output: "9 แถว",
          },
          {
            label: "คนที่ไม่เคยซื้ออะไรเลย",
            sql: "SELECT p.name\nFROM people p\nWHERE NOT EXISTS (\n  SELECT 1 FROM purchases pu WHERE pu.person_id = p.id\n);",
            explain:
              "<code>NOT EXISTS</code> ให้ผลเหมือน <code>NOT IN</code> แต่ไม่มีกับดัก NULL — เวลาไม่แน่ใจว่าข้อมูลสะอาดแค่ไหน ให้เลือกตัวนี้",
            output: "11 แถว",
          },
          {
            label: "นับของที่แต่ละคนซื้อ ด้วย subquery ในช่อง SELECT",
            sql: "SELECT p.name,\n       (SELECT COUNT(*) FROM purchases pu WHERE pu.person_id = p.id) AS items\nFROM people p\nORDER BY items DESC\nLIMIT 5;",
            explain:
              "วาง subquery ไว้ในช่อง <code>SELECT</code> ก็ได้ อ่านง่ายกว่า JOIN+GROUP BY ในบางกรณี แต่ทำงานทีละแถว จึงช้ากว่าเมื่อข้อมูลเยอะ",
          },
        ],
        pitfalls: [
          "correlated subquery ถูกรันใหม่ทุกแถวข้างนอก ตารางใหญ่ ๆ จะช้ามาก ถ้าเจอปัญหาให้เปลี่ยนเป็น JOIN หรือ CTE (บทที่ 8)",
        ],
      },
    ],
  },
  {
    id: "datetime",
    n: 7,
    title: "วันเวลา ข้อความ และเงื่อนไขในคอลัมน์",
    level: "ระดับกลาง",
    summary:
      "SQLite ไม่มีชนิดข้อมูลวันเวลาแยกต่างหาก ทุกอย่างเก็บเป็นข้อความ — ซึ่งกลับใช้ง่ายกว่าที่คิด ถ้ารู้กติกา",
    cases: [5, 8],
    topics: [
      {
        id: "datetime-text",
        title: "เทียบวันเวลาที่เก็บเป็น TEXT",
        what: "รูปแบบ YYYY-MM-DD HH:MM เรียงตามตัวอักษรแล้วได้ลำดับเวลาที่ถูกต้องพอดี จึงเทียบด้วย > < BETWEEN ได้ตรง ๆ",
        syntax: "WHERE คอลัมน์เวลา BETWEEN 'YYYY-MM-DD HH:MM' AND 'YYYY-MM-DD HH:MM'",
        examples: [
          {
            label: "แขกที่คืนห้องก่อนเวลาเช็คเอาท์",
            sql: "SELECT p.name, h.room, h.check_out, h.actual_checkout\nFROM hotel_stays h\nJOIN people p ON p.id = h.guest_id\nWHERE h.actual_checkout < h.check_out;",
            explain:
              "เทียบสองคอลัมน์เวลากันเองได้เลย ไม่ต้องแปลงชนิดข้อมูลก่อน · สำนวนที่ 5 ในเกมคือคิวรีนี้กลับเครื่องหมาย",
            output: "3 แถว",
          },
          {
            label: "กล้องที่บันทึกไว้ในช่วงหัวค่ำวันที่ 7",
            sql: "SELECT camera_location, person_id, seen_at\nFROM cctv_logs\nWHERE seen_at BETWEEN '2026-03-07 20:00' AND '2026-03-07 22:00';",
            explain:
              "ท่ามาตรฐานของการจำกัดช่วงเวลา · ระวังว่า <code>BETWEEN</code> รวมปลายทั้งสองข้าง ถ้าไม่อยากรวมนาทีสุดท้ายให้เขียน <code>&gt;= … AND &lt; …</code> แทน",
            output: "3 แถว — Neon Alley 1 แถว, Downtown Plaza 2 แถว",
          },
          {
            label: "ทุกอย่างที่เกิดในวันเดียว",
            sql: "SELECT * FROM cctv_logs\nWHERE seen_at LIKE '2026-03-06%';",
            explain:
              "อยากได้ทั้งวันโดยไม่ต้องพิมพ์ช่วงเวลา ใช้ <code>LIKE 'วันที่%'</code> ได้ — อ่านง่ายกว่า แต่ถ้าตารางใหญ่มากจะช้ากว่าการใช้ช่วง เพราะใช้ index ไม่ได้",
            output: "7 แถว",
          },
        ],
        pitfalls: [
          "ท่านี้ใช้ได้เพราะรูปแบบเป็น <code>YYYY-MM-DD</code> เท่านั้น ถ้าข้อมูลเก็บเป็น <code>06/03/2026</code> การเทียบแบบข้อความจะให้ลำดับผิดทันที",
          "อย่าลืมว่าเวลาที่เก็บมีนาทีด้วย <code>seen_at = '2026-03-06'</code> จึงไม่เคยตรงกับแถวไหนเลย",
        ],
      },
      {
        id: "date-functions",
        title: "date() · strftime() · julianday()",
        what: "ตัดเอาเฉพาะส่วนที่ต้องการจากวันเวลา หรือคำนวณระยะห่างระหว่างสองเวลา",
        syntax: "strftime('%H', คอลัมน์เวลา) · date(คอลัมน์เวลา) · julianday(a) - julianday(b)",
        examples: [
          {
            label: "แต่ละวันมีเรื่องร้องเรียนกี่เรื่อง",
            sql: "SELECT date(reported_at) AS day, COUNT(*) AS n\nFROM complaints\nGROUP BY day\nORDER BY day;",
            explain:
              "<code>date()</code> ตัดเวลาทิ้งเหลือแต่วันที่ ทำให้จัดกลุ่มรายวันได้ — ถ้า <code>GROUP BY reported_at</code> ตรง ๆ จะได้กลุ่มละหนึ่งแถว เพราะนาทีไม่ซ้ำกัน",
            output: "7 แถว — วันที่ 3 มี.ค. หายไปเพราะไม่มีเรื่องร้องเรียนเลย",
          },
          {
            label: "กล้องจับภาพช่วงชั่วโมงไหนบ่อยสุด",
            sql: "SELECT strftime('%H', seen_at) AS hour, COUNT(*) AS n\nFROM cctv_logs\nGROUP BY hour\nORDER BY n DESC;",
            explain:
              "<code>strftime</code> ดึงส่วนไหนก็ได้: <code>%Y</code> ปี <code>%m</code> เดือน <code>%d</code> วัน <code>%H</code> ชั่วโมง <code>%M</code> นาที <code>%w</code> วันในสัปดาห์",
          },
          {
            label: "ออกช้าไปกี่นาที",
            sql: "SELECT room,\n       ROUND((julianday(actual_checkout) - julianday(check_out)) * 24 * 60) AS late_minutes\nFROM hotel_stays\nORDER BY late_minutes DESC;",
            explain:
              "<code>julianday()</code> แปลงเวลาเป็นจำนวนวันแบบทศนิยม ลบกันแล้วคูณ 24 × 60 จะได้นาที · ค่าติดลบแปลว่าออกก่อนเวลา",
            output: "5 แถว — ค่าบวกคือออกช้า",
          },
        ],
        pitfalls: [
          "ฟังก์ชันพวกนี้คืน NULL ถ้ารูปแบบข้อความไม่ถูกต้อง เจอ NULL โผล่มาให้สงสัยข้อมูลต้นทางก่อน",
          "ครอบคอลัมน์ด้วยฟังก์ชันใน <code>WHERE</code> (เช่น <code>WHERE date(seen_at) = '2026-03-06'</code>) ทำให้ index ใช้ไม่ได้ ถ้าตารางใหญ่ให้เทียบเป็นช่วงแทน",
        ],
      },
      {
        id: "case-coalesce",
        title: "CASE WHEN · COALESCE · ต่อข้อความ",
        what: "เขียนเงื่อนไขลงไปในคอลัมน์ผลลัพธ์ จัดกลุ่มค่าเป็นช่วง ๆ และจัดการค่าว่าง",
        syntax: "CASE WHEN เงื่อนไข THEN ค่า ELSE ค่าอื่น END",
        examples: [
          {
            label: "แบ่งช่วงอายุ",
            sql: "SELECT name, age,\n  CASE\n    WHEN age < 30 THEN 'ต่ำกว่า 30'\n    WHEN age < 45 THEN '30–44'\n    ELSE '45 ขึ้นไป'\n  END AS age_band\nFROM people\nORDER BY age;",
            explain:
              "<code>CASE</code> ไล่เงื่อนไขจากบนลงล่าง เจออันแรกที่จริงแล้วหยุด จึงไม่ต้องเขียน <code>age &gt;= 30 AND age &lt; 45</code> ให้ยาว",
          },
          {
            label: "นับแบบแยกช่องในแถวเดียว",
            sql: "SELECT district,\n  SUM(CASE WHEN hat_color = 'red' THEN 1 ELSE 0 END) AS red_hats,\n  SUM(CASE WHEN hat_color = 'black' THEN 1 ELSE 0 END) AS black_hats,\n  COUNT(*) AS total\nFROM people\nGROUP BY district;",
            explain:
              "ท่า <b>pivot</b> แบบมือเปล่า: ใส่ <code>CASE</code> ไว้ข้างใน <code>SUM</code> เพื่อนับเฉพาะแถวที่เข้าเงื่อนไข ใช้ทำรายงานแบบหลายคอลัมน์ได้โดยไม่ต้องรันหลายคิวรี",
          },
          {
            label: "แทนค่าว่างและต่อข้อความ",
            sql: "SELECT p.name || ' (' || p.district || ')' AS label,\n       COALESCE(v.plate, 'ไม่มีรถ') AS plate\nFROM people p\nLEFT JOIN vehicles v ON v.owner_id = p.id\nORDER BY p.id\nLIMIT 8;",
            explain:
              "<code>||</code> คือการต่อข้อความใน SQL (ไม่ใช่ <code>+</code>) ส่วน <code>COALESCE(a, b)</code> คืนค่าแรกที่ไม่ใช่ NULL — ใช้เก็บกวาดผลลัพธ์จาก LEFT JOIN ได้ดี",
          },
        ],
        pitfalls: [
          "ต่อข้อความกับ NULL ได้ NULL ทั้งก้อน ถ้ามีคอลัมน์ที่อาจว่าง ให้ครอบด้วย <code>COALESCE</code> ก่อนต่อ",
          "ลืม <code>ELSE</code> ใน <code>CASE</code> แล้วแถวที่ไม่เข้าเงื่อนไขไหนเลยจะได้ NULL",
        ],
      },
    ],
  },
  {
    id: "advanced",
    n: 8,
    title: "ระดับสูง — Window function, CTE, และของที่ใช้ตอนทำงานจริง",
    level: "ระดับสูง",
    summary:
      "ของที่จะได้ใช้ตอนทำรายงานหรือดูแลฐานข้อมูลจริง ไม่ต้องรีบจำ แต่รู้ว่ามีอยู่แล้วจะประหยัดเวลาตัวเองมหาศาล",
    cases: [],
    topics: [
      {
        id: "window",
        title: "Window function — สรุปยอดโดยไม่ยุบแถว",
        what: "อยากเห็นทั้งรายละเอียดรายแถวและค่าสรุปพร้อมกัน เช่น อันดับ หรือค่าเฉลี่ยของกลุ่มตัวเอง",
        syntax: "ฟังก์ชัน() OVER (PARTITION BY กลุ่ม ORDER BY คอลัมน์)",
        examples: [
          {
            label: "จัดอันดับความสูง",
            sql: "SELECT name, height_cm,\n       RANK() OVER (ORDER BY height_cm DESC) AS rank\nFROM people\nORDER BY rank\nLIMIT 5;",
            explain:
              "<code>RANK()</code> ให้อันดับเท่ากันเมื่อค่าเสมอกันแล้วข้ามเลขถัดไป · <code>DENSE_RANK()</code> ไม่ข้ามเลข · <code>ROW_NUMBER()</code> ไล่เลขไม่ซ้ำเลยแม้ค่าจะเท่ากัน",
          },
          {
            label: "เทียบอายุตัวเองกับค่าเฉลี่ยของเขตตัวเอง",
            sql: "SELECT name, district, age,\n       ROUND(AVG(age) OVER (PARTITION BY district), 1) AS district_avg\nFROM people\nORDER BY district, age DESC;",
            explain:
              "<code>PARTITION BY</code> คือ “GROUP BY แบบไม่ยุบแถว” — ทุกคนยังอยู่ครบ 20 แถว แต่มีคอลัมน์ค่าเฉลี่ยของเขตตัวเองแปะมาด้วย ท่านี้ทำด้วย GROUP BY ล้วน ๆ ไม่ได้",
            output: "20 แถว",
          },
          {
            label: "หยิบอันดับหนึ่งของแต่ละกลุ่ม",
            sql: "SELECT name, district, age FROM (\n  SELECT name, district, age,\n         ROW_NUMBER() OVER (PARTITION BY district ORDER BY age DESC) AS rn\n  FROM people\n)\nWHERE rn = 1;",
            explain:
              "ท่า <b>top-N per group</b> ที่ใช้บ่อยมาก: ให้เลขลำดับในแต่ละกลุ่มก่อน แล้วค่อยกรองเอาเฉพาะลำดับที่ต้องการ · กรอง <code>rn</code> ใน <code>WHERE</code> ชั้นเดียวกันไม่ได้ ต้องซ้อนอีกชั้นแบบนี้",
            output: "4 แถว — คนอายุมากสุดของแต่ละเขต",
          },
          {
            label: "ยอดสะสมตามเวลา",
            sql: "SELECT bought_at, item, price,\n       SUM(price) OVER (ORDER BY bought_at) AS running_total\nFROM purchases\nORDER BY bought_at;",
            explain:
              "ใส่ <code>ORDER BY</code> ข้างใน <code>OVER()</code> จะได้ยอดสะสมจากแถวแรกจนถึงแถวปัจจุบัน — สูตรสำเร็จของกราฟยอดสะสมในรายงาน",
          },
        ],
        pitfalls: [
          "window function ทำงานหลัง <code>WHERE</code> และ <code>GROUP BY</code> จึงเอาไปใส่ใน <code>WHERE</code> ตรง ๆ ไม่ได้ ต้องซ้อนอีกชั้นหรือใช้ CTE",
          "SQLite รองรับตั้งแต่เวอร์ชัน 3.25 ขึ้นไป — sql.js ในเกมนี้ใหม่กว่านั้น รันได้สบาย",
        ],
      },
      {
        id: "cte",
        title: "CTE (WITH) — ตั้งชื่อให้คิวรีย่อย",
        what: "แตกคิวรียาว ๆ เป็นขั้นตอนที่มีชื่อ อ่านง่ายขึ้นมากและใช้ซ้ำได้ในคิวรีเดียวกัน",
        syntax: "WITH ชื่อ AS ( SELECT … ) SELECT … FROM ชื่อ;",
        examples: [
          {
            label: "ยอดซื้อรวมของแต่ละคน แล้วค่อยหาคนที่ซื้อเยอะ",
            sql: "WITH spend AS (\n  SELECT person_id, SUM(price) AS total\n  FROM purchases\n  GROUP BY person_id\n)\nSELECT p.name, s.total\nFROM spend s\nJOIN people p ON p.id = s.person_id\nWHERE s.total > 300\nORDER BY s.total DESC;",
            explain:
              "อ่านจากบนลงล่างเป็นขั้น ๆ: สรุปยอดก่อน → แล้วค่อยเอาไปต่อกับชื่อคน ให้ผลเหมือน subquery ใน FROM แต่อ่านง่ายกว่ามาก",
            output: "4 แถว",
          },
          {
            label: "ต่อ CTE หลายชั้น",
            sql: "WITH night_logs AS (\n  SELECT person_id, seen_at\n  FROM cctv_logs\n  WHERE seen_at BETWEEN '2026-03-06 00:00' AND '2026-03-06 04:00'\n),\nnight_people AS (\n  SELECT DISTINCT person_id FROM night_logs\n)\nSELECT p.name, p.district\nFROM night_people n\nJOIN people p ON p.id = n.person_id\nORDER BY p.district;",
            explain:
              "CTE ตัวหลังเรียกใช้ตัวหน้าได้ คั่นด้วยจุลภาค แล้วเขียน <code>WITH</code> แค่ครั้งเดียว — เหมาะกับการไล่ตรรกะยาว ๆ ทีละก้าวโดยไม่ต้องซ้อนวงเล็บสิบชั้น",
          },
        ],
        pitfalls: [
          "CTE ไม่ได้เร็วขึ้นเสมอไป มันคือเรื่องความอ่านง่ายเป็นหลัก",
          "เขียน CTE แล้วไม่ได้เรียกใช้ = คิวรีนั้นถูกข้ามไปเฉย ๆ ไม่มี error เตือน",
        ],
      },
      {
        id: "recursive",
        title: "Recursive CTE — วนซ้ำในคิวรีเดียว",
        what: "สร้างลำดับ (เช่น ทุกวันในสัปดาห์) หรือไล่โครงสร้างต้นไม้อย่างสายบังคับบัญชา",
        syntax: "WITH RECURSIVE ชื่อ(คอลัมน์) AS ( แถวเริ่มต้น UNION ALL แถวถัดไป ) SELECT …",
        examples: [
          {
            label: "ปฏิทินเรื่องร้องเรียน รวมวันที่ไม่มีเรื่องด้วย",
            sql: "WITH RECURSIVE days(d) AS (\n  SELECT '2026-03-01'\n  UNION ALL\n  SELECT date(d, '+1 day') FROM days WHERE d < '2026-03-08'\n)\nSELECT days.d, COUNT(c.id) AS complaints\nFROM days\nLEFT JOIN complaints c ON date(c.reported_at) = days.d\nGROUP BY days.d\nORDER BY days.d;",
            explain:
              "ส่วนบนของ <code>UNION ALL</code> คือจุดเริ่ม ส่วนล่างคือกฎสร้างแถวถัดไปจากแถวก่อนหน้า วนจนเงื่อนไขไม่จริง · ท่านี้แก้ปัญหาคลาสสิก “กราฟรายวันขาดวันที่ไม่มีข้อมูล”",
            output: "8 แถว — วันละหนึ่งแถวครบทั้งช่วง",
          },
          {
            label: "รูปแบบคลาสสิก: ไล่สายบังคับบัญชา",
            sql: "WITH RECURSIVE org_chart AS (\n  SELECT id, name, manager_id FROM employees WHERE manager_id IS NULL\n  UNION ALL\n  SELECT e.id, e.name, e.manager_id\n  FROM employees e\n  JOIN org_chart o ON e.manager_id = o.id\n)\nSELECT * FROM org_chart;",
            explain:
              "รูปแบบที่เจอในตำราแทบทุกเล่ม — เริ่มจากหัวหน้าสูงสุด แล้วไล่ลูกน้องลงไปเรื่อย ๆ · ฐานข้อมูลในเกมนี้ไม่มีตาราง <code>employees</code> ตัวอย่างนี้จึงรันไม่ผ่าน ใส่ไว้ให้เห็นรูปแบบเฉย ๆ",
          },
        ],
        pitfalls: [
          "ลืมเงื่อนไขหยุดในส่วนล่าง = วนไม่รู้จบจนเบราว์เซอร์ค้าง เขียนเสร็จให้ไล่ดูเงื่อนไขหยุดก่อนรันทุกครั้ง",
        ],
      },
      {
        id: "ops",
        title: "Transaction · Index · View · EXPLAIN",
        what: "ของที่ใช้ตอนดูแลฐานข้อมูลจริง ไม่ได้ใช้ตอบคดี แต่ควรรู้ว่ามีอยู่",
        syntax: "BEGIN; … COMMIT;  ·  CREATE INDEX …  ·  CREATE VIEW …",
        examples: [
          {
            label: "ทรานแซกชัน — สำเร็จทั้งคู่ หรือไม่สำเร็จเลย",
            sql: "BEGIN;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;",
            explain:
              "โอนเงินสองคำสั่งนี้ต้องสำเร็จพร้อมกัน ถ้าคำสั่งที่สองพัง แล้วเราสั่ง <code>ROLLBACK;</code> ยอดจะกลับไปเหมือนเดิมทั้งคู่ — ไม่มีเงินหายกลางทาง",
          },
          {
            label: "อินเด็กซ์ — ทำให้ค้นเร็วขึ้น",
            sql: "CREATE INDEX idx_cctv_seen_at ON cctv_logs(seen_at);",
            explain:
              "index ช่วยให้เงื่อนไข <code>WHERE seen_at BETWEEN …</code> ไม่ต้องไล่อ่านทั้งตาราง แต่แลกมาด้วยพื้นที่และการเขียนที่ช้าลงนิดหน่อย — สร้างเฉพาะคอลัมน์ที่ค้นบ่อยจริง ๆ",
          },
          {
            label: "วิว — ตั้งชื่อให้คิวรีที่ใช้ประจำ",
            sql: "CREATE VIEW suspect_vehicles AS\nSELECT p.name, v.plate, v.color\nFROM vehicles v\nJOIN people p ON p.id = v.owner_id;",
            explain:
              "หลังสร้างแล้วเรียกใช้เหมือนตารางปกติ <code>SELECT * FROM suspect_vehicles;</code> · วิวไม่ได้เก็บข้อมูลซ้ำ มันคือคิวรีที่ตั้งชื่อไว้เฉย ๆ",
          },
          {
            label: "ดูว่าฐานข้อมูลทำงานยังไง",
            sql: "EXPLAIN QUERY PLAN\nSELECT * FROM cctv_logs WHERE seen_at > '2026-03-06';",
            explain:
              "บอกว่าคิวรีนี้ใช้ index หรือไล่อ่านทั้งตาราง (SCAN) เป็นเครื่องมือแรกที่ควรหยิบมาใช้เวลาคิวรีช้า",
          },
        ],
        pitfalls: [
          "คำสั่งกลุ่มนี้ (ยกเว้น EXPLAIN) ถูกบล็อกในเกม เพราะโหมดนักสืบอ่านอย่างเดียว — ลองของจริงได้ใน SQLite บนเครื่องตัวเอง",
        ],
      },
    ],
  },
];
