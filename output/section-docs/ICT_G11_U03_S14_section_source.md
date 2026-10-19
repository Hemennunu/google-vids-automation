# ICT_G11_U03_S14 — 10 Unit Summary

Grade 11 ICT (Ethiopian curriculum). Textbook sub-chapter: Unit 3: 3.1, 3.2, 3.3.
Structure: 1. Welcome & Introduction to the section • 2. Core concept teaching & examples • 3. Summary & section conclusion.

## MUST-COVER CHECKLIST (teach every item)
- Data Management Approaches
- Data Model
- Creating Relational Database in Microsoft Access
- Databases
- Relationships
- begins with an Entity-Relationship
- Cardinality specifies whether relationships
- Structured Query Language
- Database Management Systems
- Database administrators
- ER diagrams
- Entities

## LMS LESSON (authoritative)
LEAD

MyMarian Platform | Addis Ababa | ICT Grade 11 Lecture Notes

PARAGRAPHS

A database is an organised collection of structured data stored electronically, designed to allow efficient retrieval, management, and manipulation of information. Databases are foundational to virtually every modern information system.

The Relational Database Model organises data into tables (relations), where each table represents an entity type, each row (record or tuple) represents an instance, and each column (attribute or field) represents a characteristic. Relationships are established through keys: a Primary Key uniquely identifies each record; a Foreign Key in one table references the Primary Key of another, linking related data.

Database design begins with an Entity-Relationship (ER) diagram showing entities (Student, Course, Teacher), their attributes, and the relationships between them. Cardinality specifies whether relationships are one-to-one, one-to-many, or many-to-many. Normalisation reduces data redundancy and improves data integrity: First Normal Form (1NF) requires atomic values; Second Normal Form (2NF) requires all non-key attributes to depend on the entire primary key; Third Normal Form (3NF) eliminates transitive dependencies.

Structured Query Language (SQL) is the standard language for managing relational databases. The SELECT statement retrieves data and can filter with WHERE, sort with ORDER BY, group with GROUP BY, and combine tables with JOIN operations. The INSERT, UPDATE, and DELETE statements modify data. The CREATE TABLE and ALTER TABLE statements define and modify database structure.

Database Management Systems (DBMS) provide the software infrastructure for databases. Examples include MySQL (open-source, widely used for web applications), PostgreSQL (open-source, advanced features), Microsoft Access (desktop DBMS for small organisations), and Oracle Database (enterprise-grade). The Commercial Bank of Ethiopia uses enterprise DBMS to manage millions of customer accounts, requiring robust security, regular backups, and disaster recovery procedures. Database administrators (DBAs) are responsible for database design, performance tuning, backup and recovery, and access control.

LIST ITEMS

The file-based approach causes data redundancy, inconsistency, and isolation — problems that a DBMS — Database Management System solves through centralised, structured data management.

The relational model organises data in tables linked by primary and foreign keys. It is the dominant database model for business applications worldwide, proposed by Edgar Codd in 1970.

ER diagrams are the standard tool for planning a relational database — design before we build. Entities are rectangles, attributes are ovals, relationships are diamonds.

Primary keys must be unique and non-null. Foreign keys implement relationships and referential integrity.

Cardinality types: 1:1, 1:N, and M:N. Many-to-many relationships require junction tables to resolve them in the relational model.

Microsoft Access provides tables, forms, queries, and reports — the four core objects for creating a functional relational database application.

Database normalisation reduces redundancy and improves data integrity through 1NF, 2NF, and 3NF.

SQL — Structured Query Language is the universal language for relational databases. SELECT, WHERE, ORDER BY, and JOIN are the most important clauses at this level.

## TEXTBOOK CONTENT (authoritative)
3.1 Data Management Approaches
Brainstorming 3.1  Discuss the types of data schools capture and how they manage it to run their day-to-day activities. Data management is an integral part of our daily lives. Traditionally, data used to be managed manually using physical papers. As the size of data that organizations manage become larger and larger, computers have become instrumental for efficient 3

3.2 Data Model
Data model of a database is the blue print of the database. It is used as a guide to store data in a database. It shows database entities, attributes and the relationships between the entities. It also specifies what data to store in the database. For example, a school database stores data about students and teachers. It does not need to store data about patients or traffic accidents. These data do not have relevance to the school’s day-to-day activities. Likewise, hospitals store data about patients and physicians.

3.3 Creating Relational Database in Microsoft Access
This section explains how to create and manage a database on Microsoft (MS) Access. Relations or entities are represented as database tables. Attributes are represented as table fields. Figure 3.14 shows the required transformation between relations in the relational data model and MS Access database tables. Student entity Attribute name student_id
