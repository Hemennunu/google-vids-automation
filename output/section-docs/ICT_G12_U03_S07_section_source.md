# ICT_G12_U03_S07 — Practical Investigation

Grade 12 ICT (Ethiopian curriculum). Textbook sub-chapter: none matched.

## MUST-COVER CHECKLIST (teach every item)
- s Education Management Information System
- following unnormalized table

## LMS LESSON (authoritative)
LEAD

This practical investigation section provides students with hands-on activities designed to reinforce the concepts of relational database design and SQL programming. Students are encouraged to complete these activities using a real database management system such as MySQL, MariaDB, or SQLite, which are freely available for download and installation. If a full database server is not available, students may use online SQL editors or the DB Browser for SQLite, which is a lightweight, portable alternative.

PARAGRAPHS

Visit your school's administration office or speak with a school administrator to learn about the database systems they use to manage student records, attendance, and grades. Alternatively, research online about how the Ethiopian Ministry of Education's Education Management Information System (EMIS) collects and manages data from schools across the country. Write a brief report that answers the following questions: What types of data are stored? How is the data organized? Who has access to the data? What measures are in place to protect student privacy and data security? How does the database help the school or the ministry make better decisions?

Imagine you have been asked to design a database for a small Ethiopian business, such as a traditional coffee exporter in Addis Ababa that sources coffee beans from farmers in Yirgacheffe, Sidama, and Limu. The business needs to track information about farmers, coffee batches, quality grades, prices, and export shipments. Design a relational database with at least four tables, clearly identifying the primary keys, foreign keys, and relationships between tables. Draw an entity-relationship diagram showing your design. Then write the SQL CREATE TABLE statements to implement your database.

Using the database you designed in Activity 3.4.2, write SQL queries to answer each of the following questions. Test your queries using a real database system if possible, or manually trace through the expected results.

The following unnormalized table is used by a school to track teacher assignments. Identify the normalization problems and redesign the table to comply with Third Normal Form (3NF).

After completing your redesign, write the SQL CREATE TABLE statements for each table and explain how your design addresses the issues of redundancy, insertion anomalies, update anomalies, and deletion anomalies that existed in the original flat-file structure.

Check Your Understanding: Why is it important to store the DepartmentHead field in a separate Departments table rather than repeating it for every teacher record? What kind of update anomaly would occur if the department head changed and the field was stored redundantly in multiple teacher records?
