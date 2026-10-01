# ICT_G11_U03_S06 — Entity-Relationship (ER) Diagrams

Grade 11 ICT (Ethiopian curriculum). Textbook sub-chapter: 3.2 Data Model.

## MUST-COVER CHECKLIST (teach every item)
- Basic Concepts in Data Modelling
- One-to-one relationship
- One-to-many relation
- Many-to-many relationship
- Entity Relationship Diagram
- Relational Data Model
- Relational Database
- Entity-Relationship
- Entity-Relationship Diagram
- Entities
- next step
- Relationships

## LMS LESSON (authoritative)
LEAD

This unit covers Database Management as part of the Grade 11 ICT curriculum, aligned with the Ethiopian MoE 2023 standard textbook.

PARAGRAPHS

An Entity-Relationship Diagram (ERD) is a visual representation of the data model that uses standardised symbols to depict entities, attributes, and relationships. Creating an ERD follows a systematic process that begins with identifying the entities relevant to the system being modelled. Entities are represented as rectangles and should be nouns that represent real-world objects, such as Customer, Product, Order, or Employee. The next step is to identify attributes for each entity, shown as ovals connected to their entity. Attributes that are composite, such as Address (which contains Street, City, and Region), can be further subdivided into component attributes. Key attributes that serve as primary keys are underlined. Derived attributes, which can be calculated from other attributes, are shown with dashed ovals.

Relationships are represented as diamonds connecting two or more entities. The cardinality of a relationship describes how many instances of one entity can be associated with instances of another entity. The three main types of cardinality are: one-to-one (1:1), where a single instance of Entity A is associated with exactly one instance of Entity B; one-to-many (1:M), where a single instance of Entity A can be associated with many instances of Entity B but each instance of Entity B is associated with only one instance of Entity A; and many-to-many (M:N), where many instances of Entity A can be associated with many instances of Entity B. In ERD notation, cardinality is typically indicated by marking "1" on the one side and "M" or "N" on the many side of the relationship line.

To construct an ERD for an Ethiopian library management system as an example, one would identify the entities: Book, Member, and Loan. The Book entity would contain attributes such as BookID (primary key), Title, Author, ISBN, Publisher, and PublicationYear. The Member entity would include MemberID (primary key), FullName, Address, PhoneNumber, and MembershipDate. The Loan entity would record LoanID (primary key), LoanDate, DueDate, and ReturnDate, with BookID and MemberID serving as foreign keys linking to their respective entities. The relationship between Member and Loan is one-to-many, as a single member can borrow many books over time, but each loan record belongs to one member. Similarly, the relationship between Book and Loan is one-to-many, as each book can be loaned multiple times, but each loan record refers to one specific book. This ERD provides the blueprint for creating the underlying database tables in a database management system such as Microsoft Access or LibreOffice Base.

ETHIOPIAN CONTEXT

Ethiopian Curriculum ContextThis content is assessed in the Grade 11 national examinations. Ethiopian examples, data, and contexts are integrated throughout each section.

KEY CONCEPTS

Core Topicsrelational databases, SQL, ER diagrams, normalisation, Access/LibreOffice Base.

How to Use This UnitWork through the sections in order. Master the Key Vocabulary before the main content. Attempt each Worked Example independently before checking the solution. Complete the Interactive Tools and Assessment sections to consolidate your understanding.

## TEXTBOOK CONTENT (authoritative)
3.2. Data Model
Data model of a database is the blue print of the database. It is used as a guide to
store data in a database. It shows database entities, attributes and the relationships
between the entities. It also specifies what data to store in the database. For example,
a school database stores data about students and teachers. It does not need to store
data about patients or traffic accidents. These data do not have relevance to the
school’s day-to-day activities. Likewise, hospitals store data about patients and
physicians.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 56
3.2.1 Basic Concepts in Data Modelling
The basic concepts of entity, relationship and attribute are discussed below:
• Entities are basically people, places or events about which you want to store
data. For example, banks may keep data about customers and bank account
entities. Similarly, a library may have entities like book, loan and borrower.
Entities are equivalent to tables when implemented in the database.
• Attributes are properties of an entity that are used to differentiate one entity
from other entity. For example, customer entity may have customer id,
name, sex and address as its attributes. On the other hand, book entity may
have author name, book title and publication year as its attributes. The two
entities have different attributes because they are different entities.
• A relationship is an association between entities. For example, customer
has account in a bank. The verb ‘has’ indicates the relationship between
customer and bank account entities.
The relationship between entities can take different forms:
• One-to-one relationship: An instance of an entity has only one instance in
the other entity with which it is associated. For example, a
country and a capital city. A country is associated with one capital city, and
a capital city is associated with only one country.
Notes
 Instance of an entity refers to a single occurrence of an entity. For
example, “Addis Ababa” is an instance of the entity “City”.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 57
• One-to-many relation: An instance in one entity is associated with
many instances in the other related entity. For example, a
department called ‘Computer Science’ is associated with multiple students.
• Many-to-many relationship: Instances on both sides of the relationship
are associated with multiple instances of the other entity.
For example, an employee may work in multiple projects. At the same time,
a project may have multiple employees assigned to it.
Activity 3.3
• Explain the differences between entities, attributes, and relationships.
3.2.2 Entity Relationship Diagram
One of the popular representation tools for data model is Entity Relationship
Diagram (ERD). ERD is used to visually represent a data model. It has three main
components discussed in Section 3.2.1, namely entity, attribute and relationship.
Entities are represented as a rectangle and relationships as a line to show the
association between entities. Attributes are represented as ellipses. The names of
entities and attributes are placed inside the rectangle and the ellipse respectively.
The names of relationships, on the other hand, are placed right on top of the line.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 58
and book entities and their respective attributes.
As Figure 3.10 shows, student entity has student_id, name, age and address
attributes. On the other hand, book entity has book_id, book_title, publication_year
attributes. The two entities are related by ‘borrows’ relationship.
Activity 3.4
1. Describe the purpose of ERD.
2. Assume that teachers are assigned to a class schedule in your school. The
Teacher entity has teacher_id, name, sex, and specialization attributes. The
Schedule entity has schedule_id, room, period, and section attributes. Con-
struct an ERD based on the description given.
3.2.3 Relational Data Model
The relational data model represents data in terms of two-dimensional tables
called relations. A relation is nothing but a table of rows and columns. Each row,
also called a record or tuple, contains a unique instance of data. These rows in
the relation denote a real-world entity. The columns in a relation, also known as
attributes or fields, are used to describe the properties of relations. Figure 3.11
shows an example of a student relation.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 59
Student
Student
ID
Name Sex Grade Address Attribute
Records
/tuples
ST001 Brook Assefa M 12 Kebel 05
ST002 Chaltu Bayissa F 11 Kebele 01
ST003 Ali Mohammed M 10 Kebel 03
ST004 Tsion Gabissa F 10 Kebele 01
The relational data model provides conceptual tools to represent a data model of a
relational database. A relational data model captures a collection of relations, their
attributes, and their relationships. See Figure 3.12.
Notes
 Figure 3.12 shows that student relation has student_id, sex, grade and
address attributes. On the other hand, Book_Loan relation has book_id,
student_id and loan_date attributes. Student and Book_Loan relations
are related via the student_id attribute that is paced in the Book_Loan_
relation. In the same way, Book relation is related with Book_Loan_
relation via the book_id attribute placed in the Book_Loan_ relation.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 60
3.2.4 Relational Database
Relational database is a type of database that contains logically related set of tables.
The rows in a table are called records, and the columns are called fields or attributes.
Relational database is implemented using relational database management system
(RDMS) software. The following three tables are used to show implementation of
a relational database.
Student
Primary key

Student ID Name Sex Grade Address
ST001 Brook Assefa M 12 Kebele 05
ST002 Chaltu Bayissa F 11 Kebel 13
ST003 Ali Mohammed M 10 Kebele 05
ST004 Tsion Gabissa F 10 Kebele 08
Book loan
Primary key

Foreign key
 
Book_Loan_No Book ID Student
ID
Loan date
BL0001 B001 ST001 12/5/2021
BL0002 B002 ST002 10/6/2021
BL0003 B003 ST001 3/12/2021
Book
Primary key

Book ID Author Title of book Year
B001 Hana Bekle Introduction to Physics 2004
B002 Dania Kedir Organic Chemistry 2015
B003 Kebede Yohannes Java Programming 2020

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 61
Notes
 The above three tables in Figure 3.13 have a primary key. A Primary
Key is a field which has a unique value for each record. For example,
student_ID serves as a primary key for the Student table because no
two students can have the same id.
 The relational database uses Foreign Keys as a navigational link to
retrieve data from related tables. A foreign key is an attribute in a table
that matches the primary key of another related table. Student_ID and
Book_ID in Book_Loan_Table are foreign key. They are used to link
Student table and Book table respectively to the Book_Loan table.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 62
Activity 3.5
Code Country Population
Area
(Km²)
ET Ethiopia 114,963,588 1,000,000
EG Egypt 102,334,404 995,450
TN Tanzania 59,734,218 885,800
KY Kenya 53,771,296 569,140
UG Uganda 45,741,007 199,810
SD Sudan 43,849,260 1,765,048
Source: https://www.worldometers.info
City Population Code
Addis Ababa 2,757,729 ET
Omdurman 1,200,000 SD
Cairo 7,734,614 EG
Gondar 153,914 ET
Jimma 128,306 ET
Kisumu 216,479 KY
Khartum 1,974,647 SD
Mombasa 799,668 KY
Nairobi 2,750,547 KY
Source: https://worldpopulationreview.com/continents/africa/cities
Answer the following questions based on the tables given above.
1. What are the entities in the above tables? Give a name for each table
that represents the content of the data.
2. What is the attribute that is used to link the two tables?
3. How many fields does the first table have?
4. List the cities that are found in Kenya.
5. Create a new table that contains country name, city name and city popu-
lation attributes.
6. Create an ERD diagram with the relationship type.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 63
