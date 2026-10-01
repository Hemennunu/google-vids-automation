# ICT_G12_U03_S04 — Overview of Relational Database Management Systems

Grade 12 ICT (Ethiopian curriculum). Textbook sub-chapter: Unit 3: 3.1, 3.2.

## MUST-COVER CHECKLIST (teach every item)
- Overview of Relational Database Management System
- Database Manipulation Using SQL
- relational database management system
- RDBMS
- relational model
- Foreign keys
- Relational Database Management System (RDBMS)

## LMS LESSON (authoritative)
LEAD

The relational database management system (RDBMS) represents one of the most significant developments in the history of information technology. Conceived by Edgar F. Codd in 1970 while working at IBM, the relational model introduced a mathematically elegant approach to data management that would eventually become the dominant paradigm for organizing and manipulating structured data. An RDBMS is a software system that manages data stored in tables, or relations, and allows users to define relationships between those tables. The relational model is founded on the principle that data should be organized in a way that is independent of its physical storage, making it accessible and manageable through a logical structure that users can easily understand.

PARAGRAPHS

At the heart of any relational database are three fundamental structural components: tables, records, and fields. A table, also called a relation, is a collection of related data organized into rows and columns. Each row in a table is known as a record or tuple and represents a single instance of the entity being modelled. Each column, known as a field or attribute, represents a specific characteristic or property of that entity. For example, consider a student registration system used by an Ethiopian secondary school. A table called Students might contain fields such as StudentID, FirstName, LastName, DateOfBirth, Grade, and Section. Each row in this table would represent one individual student enrolled at the school.

Two of the most important concepts in relational database design are the primary key and the foreign key. A primary key is a field, or a combination of fields, that uniquely identifies each record in a table. No two records can share the same primary key value, and a primary key cannot be empty or NULL. In the Students table, the StudentID field would serve as an ideal primary key because each student has a unique identification number assigned by the school or the Ministry of Education. A foreign key, on the other hand, is a field in one table that refers to the primary key of another table. Foreign keys are the mechanism by which relationships between tables are established and maintained. If the school also has a Enrollments table that records which courses each student is taking, that table might contain a StudentID field that serves as a foreign key, referencing the primary key of the Students table.

The real power of relational databases emerges from the relationships that can be defined between tables. There are three fundamental types of relationships. A one-to-one relationship exists when a record in one table is associated with exactly one record in another table; for instance, each student might have exactly one medical record. A one-to-many relationship is the most common type, where a record in one table can be associated with multiple records in another table; for example, a single teacher can teach many students, but each student may have only one homeroom teacher. A many-to-many relationship occurs when records in both tables can be associated with multiple records in the other; for instance, students can take multiple courses, and each course can have multiple students enrolled. Many-to-many relationships are typically implemented using an intermediate table called a junction or linking table.

Relational databases offer significant advantages over the older flat-file approach to data management. In a flat-file system, data is stored in a single table or file, leading to considerable data redundancy when the same information must be repeated for multiple records. This redundancy not only wastes storage space but also creates the risk of data inconsistency, where the same piece of information might be updated in one place but not in others. A relational database addresses these problems by allowing data to be stored in separate, normalized tables with controlled redundancy. The process of normalization involves systematically organizing data to minimize duplication and dependency, typically through a series of normal forms (1NF, 2NF, 3NF) that each impose increasingly strict rules on table structure. Normalization ensures that each piece of data is stored in exactly one place, with relationships linking it to the relevant records in other tables.

Check Your Understanding: Consider a school library database that tracks books, students, and borrowing records. What tables would you need? What would be the primary keys for each table? What relationships exist between the tables? Identify one example each of a one-to-one, one-to-many, and many-to-many relationship in this system.

ETHIOPIAN CONTEXT

🇧🇪 Ethiopian Context The Ethiopia Commodity Exchange (ECX), established in 2008 in Addis Ababa, operates a large-scale relational database system that tracks every transaction involving coffee, sesame, beans, maize, and other agricultural commodities traded on the exchange. The ECX database manages data about traders, warehouse receipt systems, quality grades, prices, and settlement information across dozens of regional collection centres. When a farmer delivers coffee to an ECX warehouse in Yirgacheffe or Sidama, that transaction is recorded in the database, and the information flows through the system to ensure transparent pricing and secure payment settlement. This real-world example demonstrates how relational database systems underpin critical economic infrastructure in Ethiopia, enabling efficient market operations that connect millions of smallholder farmers to global markets.

DEFINITIONS

Relational Database Management System (RDBMS): A software application that stores, retrieves, and manages data organized in tables with predefined relationships. Examples include MySQL, Oracle Database, Microsoft SQL Server, and PostgreSQL. The RDBMS enforces data integrity rules and provides a structured environment for multi-user data access and manipulation.

KEY CONCEPTS

Key Point A relational database organizes data into tables connected by relationships defined through primary and foreign keys. This structure reduces redundancy, improves data integrity, and allows complex queries across multiple related tables.

## TEXTBOOK CONTENT (authoritative)
3.1 Overview of Relational Database Management System
Brainstorming 3.1  What is a relational database management system? The term Relational Database Management System (RDBMS) usually refers to various types of software systems developed in order to manage databases. RDBMS is used to create, maintain, and provide controlled access to a relational database. A relational database is based on a relational data model. Data are stored in a two- dimensional table, which contains columns or fields and rows or records. Each

3.2 Database Manipulation Using SQL
Brainstorming 3.2  What are the similarities and differences between SQL and other programming languages? SQL (Structured Query Language) is a standard language for accessing and manipulating a database. SQL is a special-purpose query language meant for interacting with relational databases such as Microsoft Access. Understanding how SQL works can help create better queries and make it easier to understand how to
