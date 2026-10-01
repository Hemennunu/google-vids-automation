# ICT_G11_U03_S04 — Data Management Approaches: File-Based vs DBMS

Grade 11 ICT (Ethiopian curriculum). Textbook sub-chapter: 3.1 Data Management Approaches.

## MUST-COVER CHECKLIST (teach every item)
- File based data management
- Database approach to data management
- Data independence
- Data sharing
- Avoiding data redundancy
- Improved data security
- Databases
- Relationships
- begins with an Entity-Relationship
- Cardinality specifies whether relationships
- Structured Query Language
- Database Management Systems
- Database administrators

## LMS LESSON (authoritative)
LEAD

A database is an organised collection of structured data stored electronically, designed to allow efficient retrieval, management, and manipulation of information. Databases are foundational to virtually every modern information system.

PARAGRAPHS

The Relational Database Model organises data into tables (relations), where each table represents an entity type, each row (record or tuple) represents an instance, and each column (attribute or field) represents a characteristic. Relationships are established through keys: a Primary Key uniquely identifies each record; a Foreign Key in one table references the Primary Key of another, linking related data.

Database design begins with an Entity-Relationship (ER) diagram showing entities (Student, Course, Teacher), their attributes, and the relationships between them. Cardinality specifies whether relationships are one-to-one, one-to-many, or many-to-many. Normalisation reduces data redundancy and improves data integrity: First Normal Form (1NF) requires atomic values; Second Normal Form (2NF) requires all non-key attributes to depend on the entire primary key; Third Normal Form (3NF) eliminates transitive dependencies.

Structured Query Language (SQL) is the standard language for managing relational databases. The SELECT statement retrieves data and can filter with WHERE, sort with ORDER BY, group with GROUP BY, and combine tables with JOIN operations. The INSERT, UPDATE, and DELETE statements modify data. The CREATE TABLE and ALTER TABLE statements define and modify database structure.

Database Management Systems (DBMS) provide the software infrastructure for databases. Examples include MySQL (open-source, widely used for web applications), PostgreSQL (open-source, advanced features), Microsoft Access (desktop DBMS for small organisations), and Oracle Database (enterprise-grade). The Commercial Bank of Ethiopia uses enterprise DBMS to manage millions of customer accounts, requiring robust security, regular backups, and disaster recovery procedures. Database administrators (DBAs) are responsible for database design, performance tuning, backup and recovery, and access control.

## TEXTBOOK CONTENT (authoritative)
3.1. Data Management Approaches
Brainstorming 3.1
 Discuss the types of data schools capture and how they manage it to
run their day-to-day activities.
Data management is an integral part of our daily lives. Traditionally, data used to
be managed manually using physical papers. As the size of data that organizations
manage become larger and larger, computers have become instrumental for efficient
3
UNIT DATABASE MANAGEMENT

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 52
management of data (see Figure. 3.1). The first computer-based data management
is a file-based data management approach. The database approach was introduced
later and addressed the inherent weaknesses of the file-based approach.
3.1.1 File based data management
File-based data management is an approach in which data is stored in separate files
without explicit relationships (see Figure. 3.2). Data in different files is managed
by different application programs. Any change to data requires modification of the
program that uses the data. Changes made on the program may also require change
in the file structure. In file-based data management approach, each department
creates and processes its own files separately. For example, procurement and
finance departments create and manage their own files.
The file-based data management approach creates problems of data duplication and
data inconsistency. For example, let us say employee data is stored both in human
resource and finance departments. When human resource department modifies

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 53
the employee records upon hiring new employees, it may not communicate the
information to the finance department. As a result, different information about
employees would be found in one organization. Such types of contradictions are
caused by the fact that data in one file is not linked to data in other files of the same
organization in the file-based approach. The isolation of data also makes retrieval
of data of the entire organization a very difficult task. These problems led to the
development of the database approach. development of the database approach.
Activity 3.1
1. Discuss the file-based data management approach.
2. Discuss the main limitations of the file-based approach to management of
data in an organization
3.1.2 Database approach to data management
In the database approach to data management, data is managed by a database using
a database management system (DBMS) software. A database is a collection of
logically-related data. It stores all organization’s data in one repository. A database
is created to address the data requirements of different user groups and application
programs in an organization.
Database is an essential resource to every organization. It is used to maintain internal
records of organizations such as student records for schools, customer records and
daily sales records for supermarkets, patient database for hospitals and the like (see
Figure. 3.4). Data in the database are used to generate different information that are

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 54
used in the daily business activities. For example, the salesman in a supermarket
uses database to generate daily or monthly sales reports. Hospitals may generate
report that shows the most frequent disease types in the last year. report that shows the most frequent disease types in the last year.
DBMS is software that manages databases. DBMS is used to add new data, modify
data and delete data in the database. It is also used to retrieve data from the database.
DBMS essentially serves as an interface between the database and end users or
application programs. It ensures that data is easily accessed by potential users.
The database management process has three main components. At
the bottom is the database which stores the actual data. In the middle is a DBMS
which manages the database. At the top of the DBMS are application programs that
use the database. The application programs submit database query to the DBMS.
Then, the DBMS retrieves data that matches the queries and replies retrieved data
to the application programs.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 55
The database approach to data management provides many advantages to the
organization. Some of the advantages are:
• Data independence: A database is created to store all organization data and
support all users of the organization. Each user or department does not need
to manage its own isolated data.
• Data sharing: all organization’s data is stored in one central database.
DBMS allows this central database to be accessed by different users.
• Avoiding data redundancy: Isolated departmental files are stored in one
central database. The DBMS can retrieve data from multiple tables so as to
meet the requirement of different database users or application programs.
• Improved data security: Data in the database is accessed only by authorized
users. Only users who are given data access right can access and modify
data in the database.
Activity 3.2
1. What are the benefits of a database as compared to file-based data man-
agement approach?
2. Why do organizations need to store data in the database?
3. What is the purpose of the DBMS?
