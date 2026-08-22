# SQL Commands Guide — เรียงจากง่ายไปยาก

## 1. Basic — CRUD พื้นฐาน

```sql
SELECT * FROM people;
SELECT name, age FROM people WHERE age > 18;

INSERT INTO people (name, hat_color) VALUES ('Boss', 'red');

UPDATE people SET hat_color = 'blue' WHERE id = 1;

DELETE FROM people WHERE id = 1;
```

## 2. Filtering & Sorting

```sql
SELECT * FROM people 
WHERE hat_color = 'red' AND age >= 20
ORDER BY age DESC
LIMIT 10;

SELECT * FROM people WHERE name LIKE 'B%';
SELECT * FROM people WHERE hat_color IN ('red', 'blue');
```

## 3. Aggregate Functions

```sql
SELECT COUNT(*) FROM people;
SELECT hat_color, COUNT(*) FROM people GROUP BY hat_color;
SELECT hat_color, COUNT(*) FROM people 
GROUP BY hat_color 
HAVING COUNT(*) > 5;
```

## 4. Joins — เชื่อมหลายตาราง

```sql
SELECT p.name, o.order_date
FROM people p
INNER JOIN orders o ON p.id = o.person_id;

SELECT p.name, o.order_date
FROM people p
LEFT JOIN orders o ON p.id = o.person_id;
```

## 5. Subqueries

```sql
SELECT * FROM people 
WHERE id IN (SELECT person_id FROM orders WHERE total > 1000);
```

## 6. Window Functions (ระดับกลาง-สูง)

```sql
SELECT name, age,
  RANK() OVER (ORDER BY age DESC) as age_rank
FROM people;

SELECT name, department,
  AVG(salary) OVER (PARTITION BY department) as dept_avg
FROM employees;
```

## 7. CTE (Common Table Expression)

```sql
WITH high_spenders AS (
  SELECT person_id, SUM(total) as total_spent
  FROM orders
  GROUP BY person_id
  HAVING SUM(total) > 5000
)
SELECT p.name, h.total_spent
FROM people p
JOIN high_spenders h ON p.id = h.person_id;
```

## 8. Advanced — Transactions, Index, Recursive CTE

```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;

CREATE INDEX idx_hat_color ON people(hat_color);

WITH RECURSIVE org_chart AS (
  SELECT id, name, manager_id FROM employees WHERE manager_id IS NULL
  UNION ALL
  SELECT e.id, e.name, e.manager_id
  FROM employees e
  JOIN org_chart o ON e.manager_id = o.id
)
SELECT * FROM org_chart;
```

---

ใช้งานจริงส่วนใหญ่จะวนอยู่แถว 1-4 บ่อยสุด ส่วน window function กับ CTE จะเจอตอนทำ report/analytics