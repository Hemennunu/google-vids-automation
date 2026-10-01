# ICT_G11_U03_S07 — Database Normalisation

Grade 11 ICT (Ethiopian curriculum). Textbook sub-chapter: 3.3 Creating Relational Database in Microsoft Access.

## MUST-COVER CHECKLIST (teach every item)
- Creating Microsoft Access Database
- Creating Table in Microsoft Access
- Creating Query in Microsoft Access
- Adding Criteria to Query Design
- Selecting Data from Multiple Tables

## LMS LESSON (authoritative)
LEAD

This unit covers Database Management as part of the Grade 11 ICT curriculum, aligned with the Ethiopian MoE 2023 standard textbook.

ETHIOPIAN CONTEXT

Ethiopian Curriculum ContextThis content is assessed in the Grade 11 national examinations. Ethiopian examples, data, and contexts are integrated throughout each section.

KEY CONCEPTS

Core Topicsrelational databases, SQL, ER diagrams, normalisation, Access/LibreOffice Base.

How to Use This UnitWork through the sections in order. Master the Key Vocabulary before the main content. Attempt each Worked Example independently before checking the solution. Complete the Interactive Tools and Assessment sections to consolidate your understanding.

## TEXTBOOK CONTENT (authoritative)
3.3. Creating Relational Database in Microsoft Access
This section explains how to create and manage a database on Microsoft (MS)
Access. Relations or entities are represented as database tables. Attributes are
represented as table fields. Figure 3.14 shows the required transformation between
relations in the relational data model and MS Access database tables.
Student entity
Attribute name
student_id
student_name
Sex
Grade
Address
Student table
Field name Data type
student_id Text
student_name Text
sex Text
grade Number
address Text
The data type column indicates the type of data to be stored for the respective field.
For example, student name field, as shown in Figure 314, has Text data type while
grade is assigned Number as its data type.
3.3.1 Creating Microsoft Access Database
When you work on Microsoft Access, creating a database is the first step. In
MS Access, a database is a container of database objects such as tables, forms,
queries and reports. There are different versions of MS Access software to create
and manage databases. In this textbook, you will learn how to create and manage
database objects using MS Access 2010.
In order to create a database, follow the following steps:
1. Open MS Access Software
2. In the main Window, click on Blank database
3. Enter the database name in the File Name input box. (When giving a name to
the database, it is highly recommended to use names that properly describe
the data stored in the database.)
4. Click on the Create button.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 64
After the database is created, another MS Access window is opened where database
objects can be created. Before other database objects are created, a table object
must be created. A table is a set of fields that store data about a certain entity.
We use the following tables in Figure 3.15 for the following practical activities in
MS Access.
Student
Student_ID Sname Sex Age Grade_level
ST0001 Brook Assefa M 17 11
ST0002 Chaltu Bayissa F 18 12
ST0003 Giday Hagos M 15 9
ST0004 Nejat Mohammed F 17 11
ST0005 Hailu Mekonnen M 16 9
ST0006 Kedir Ali M 18 12
Teacher
Teacher_ID tname sex age specialization
T0001 Oljira Kuma M 42 Biology
T0002 Hagos Kiros F 35 Chemistry
T0003 Rediet Assefa F 28 Mathematics
T0004 Ahmed Yusuf M 27 Physics
T0005 Delebo Nurye M 26 IT
Grade
Student ID Teacher_ID subject grade
ST0001 T0001 Biology 75
ST0001 T0002 Chemistry 86
ST0002 T0002 Chemistry 70
ST0001 T0003 Mathematics 95
ST0001 T0004 Physics 65
ST0003 T0002 Chemistry 82
ST0002 T0003 Mathematics 78
ST0001 T0005 IT 90
ST0002 T0001 Biology 67

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 65
3.3.2 Creating Table in Microsoft Access
When you create a new table, Microsoft Access asks you to define table fields.
Table fields are entity attributes. One or more tables can be created in one database.
Each table name must be unique. The tables must also have two or more fields.
Field names must be unique in a table.
Follow the following steps to create a table in MS Access:
1. Open a database file.
2. Click on Table Design button from the Create menu.
3. Enter field names for the new table such as Student ID, Sname, Sex, Age
and Grade_level.
4. Specify the data type of the field. The data type can be text, number, date/
time, currency, etc. depending on the type of data that the field is used to
store.
5. When you finish, click on the Save button.
6. In the popup that is displayed, enter the table name and click on the Ok
button.
Notes
 When you want to create a new table or add data into or modify an
existing table, you must first open the database in which you want to
store your database objects. This is important because there can be
more than one database in a single computer.
 When you define a field to a table, you must specify the appropriate
data type for a Field name. The data type could be text, number, date
and currency. Data types are one form of validation mechanisms that
ensure the correctness of data in the database. If you set the data type
as Text, it will not accept its data as Number or any other type. Only
text is a valid value to it.
 To set the field as primary key, go to the table design view, select the
field and click on Primary Key ( ) button in the toolbar.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 66
Follow the following steps in order to enter data into a database table:
1. Open a database if it is not already opened
2. Click on the table name and select Datasheet View from View in the
toolbar. For example, open student table.
3. Enter appropriate values for each field.
4. Enter all the records of the Student table. (See
Activity 3.6
1. Create a database by your school’s name.
2. Create the three tables in the new database you
created.
3.3.3 Creating Query in Microsoft Access
Query is a database object that provides a custom view of data from one or more
tables. It is a way of searching for and compiling data from one or more tables.
In MS Access, data is retrieved through query by creating graphical query or
writing Structured Query Language (SQL) statements. In this section, you will
learn how to retrieve data using graphical query. A query is used to define specific
search conditions to find exactly the data you want.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 67
Follow the following steps in order to create a query in Microsoft Access:
1. Open a database where your database tables are stored
2. Click on Create menu button. Then, you get the following MS Access toolbar
You can create query using Query Wizard or Query Design. Let us see how to
create a query using Query Design option.
3. Click on Query Design button from Microsoft Access toolbar.
4. Select a table or tables from Show Table box from which you want to select
records for your query, and click on OK bottom. You then get
the following window.
Field row
5. Select the fields in the Field row. For example, if you want to select only sname
and sex field, select sname in the first column and sex in the second column of
the Field row.
6. Select Datasheet View from the toolbar to see your query results.If you do it correctly, you get the following results.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 68
Activity 3.7
1. Create a query that displays teacher name and specialization from the
teacher table. Save your query as Teacher_Specialization.
2. Create a query that displays student name and grade level from student
table. Save your query by a appropriate name.
3.3.4 Adding Criteria to Query Design
By adding additional criteria to a query design, it is possible to retrieve specific
data from a table.
Follow the following steps in order to add criteria to a query.
1. Open the Query Design Window.
2. Add a table to query design window.
3. Select fields to be displayed in Query Result Window.
4. In the Criteria row, enter query selection criteria. For example, if you want
to display only Male students, under Sex column, enter M as your query
selection criteria.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 69
Notes
 The criteria you enter in the criteria row must be exactly the same with
the data stored in the table. For example, if sex data is kept in the table
using a single character (for example m), you cannot get the required
result if you enter ‘Male’.
3.3.5 Selecting Data from Multiple Tables
The power of a relational database is that it allows you to retrieve data from two
or more tables.
Follow the following steps in order to select data from multiple tables:
1. Open the Query Design window.
2. Add a table to the Query Design window. If Show Table window is not
displayed, click on Show Table button from the Toolbar. You will have a list
of tables in the Show Table Box.
3. Select a table and click on Add button to add the table into Query Design
Window.
4. Repeat step 3 to add more tables.
5. Establish a relationship between the tables by dragging the primary key field
in the Parent table to the Child Table.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 70
6. Select the fields to be displayed in Query Datasheet View. For example, we
want to select student name (fname) from student table, subject and grade
from grade table, and teacher name (tname) from teacher table.
7. Choose the Save button from the File menu to save your query.
8. Enter a file name for the new Query, and click on the OK button.
9. Click on the View button in the Toolbar to see the query results.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 71
Activity 3.8
1. Create a query in the student database that lists female students. Save the
query as Female_Students.
2. Create a query that selects data from student and grade table. Display
only student name from student table, and subject and grade from grade
table. Save the query as Student-Grade.
3. Create a query that lists students who scored above 85 in all subjects.
Unit Summary
In this unit, you have learnt about:
• what is meant by Emerging Technologies
• what is meant by a database
• file based data management
• database approach for data management
• what is meant by database management system (DBMS) software
• the different benefits of the database approach for data management
• what is meant by data models
• the structure of relational data model
• ERD as a data model representation tool
• what is meant by entity, attribute, and relationship
• the different types of relationships between entities
• implementation of relational database on Microsoft Access
• creation of Tables in Microsoft Access
• creation of Query in Microsoft Access
• selection of data from two or more tables using Microsoft Access Query

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 72
Key Terms
Attributes are properties of entities that are used to describe the entities.
Data model is a blueprint of the database.
Database is a shared collection of logically related data.
DBMS which stands for database management system is a software which is
used to create and manage databases.
Entities are people, places, or things about which you want to keep information
in a database.
Entity Relationship Diagram (ERD) is a visual representation tool for data
models.
Field refers to a column of a table in the database table. It is similar to an
attribute in the logical data model.
File based data management is a system of data management based on a
single file.
Foreign key is an attribute in a table that matches the primary key of another
related table.
Microsoft Access is relational DBMS software. It is used to manage databases.
Primary Key is a field which has a unique value for each record in a table.
Record is a row in a database table. It stores data about one real-world object
represented in a table.
Relational data model is a type of data model that represents data in terms
of two-dimensional tables called relations.
Relational database is a type of database that contains a logically related set
of tables.
Relationship is an association between entities.
Attributes

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 73
Review Questions
Part I: Write True if the statment is correct and False if it is incorrect.
1. A database is a collection of related data.
2. A database approach improves data sharing.
3. ERD is a visual representation of data model.
4. There is only one type of relationship between entities in the ER model.
5. Attributes are used to describe the characteristics of an entity.
6. Relational database stores data in one file.
7. A Primary key is an attribute that has duplicate values for different
records in a table.
8. Tables are used to store data in Microsoft Access.
Part II: Choose the correct answer from the given alternatives.
1. _____ is used to store a logically related data.
A. file B. database
C. data model D. DBMS
2. The element of ERD that represents real-world things such as people,
places, or events about which we want to store data is called:
A. attributes B. database
C. relationship D. entities
3. The properties of entities that are used to differentiate one entity from the
other entity is called:
A. attributes B. database
C. relationship D. entity
4. _____________ is considered as a blueprint of a database.
A. attributes B. database
C. data model D. entities

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 74
5. In a relational data model, entities are represented as:
A. attributes B. relations
C. data models D. databases
6. ____ is a container of database objects in Microsoft Access.
A. field B. database
C. table D. form
7. A field which has a unique value for each record of a table is called:
A. foreign key B. attribute
C. data type D. primary key
8. One of the following is not a valid data type name for a field ___.
A. text or string B. number
C. entity D. date
9. A Query in Microsoft Access is used to:
A. store data for future use
B. select records from the underlying table that meet some search
criteria
C. create a form to facilitate data entry
D. None
10. In order to retrieve data from two or more tables through query, we must
establish a _____ between tables
A. field B. primary key
C. relationship D. criteria
Part III: Write short answers to the following questions .
1. What is a database?
2. What are the basic elements of ERD?
3. What is a relational data model?
4. What is a one-to-many relationship? Give examples.
5. What is the use of table object in Microsoft Access
6. What is the use of query in Microsoft Access?

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 75
Part IV: Discussion questions
Answer the following case study questions in groups.
1. XY manufacturing company produces different types of products. The
products are described by: product ID, product name, quantity, and price.
The products are sold to different customers. The company also keeps track
of its customers’ information as customer ID, customer name, customer
address. The customer makes orders to buy products from the company
at different times. It is also necessary to keep order information, which
includes order ID, product ID, customer ID, order quantity, and order date.
Identify the entities, attributes, and relationships for the XY manufacturing
company database and construct an ERD for the data model of XY
manufacturing company.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 76
Learning Outcomes
At the end of this unit, students will be able to:
 Define the Web
 Explain a website and its benefits
 Elaborate the purpose of web design
 Describe basic concepts of HTML and web development
 Create webpages with images, videos, links, tables, lists, and links
Unit Overview
Web development is the process of creating websites for various purposes such
as information sharing and facilitating online businesses. In this unit, the World
Wide Web (WWW) and its foundations as well as the concept and uses of
websites are discussed. In addition, different types of HTML (Hypertext Markup
Language) elements are presented with examples of how they work.
