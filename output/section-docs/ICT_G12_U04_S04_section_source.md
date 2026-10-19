# ICT_G12_U04_S04 — Introduction to XML

Grade 12 ICT (Ethiopian curriculum). Textbook sub-chapter: 4.1 Introduction to XML.
Structure: 1. Welcome & Introduction to the section • 2. Core concept teaching & examples • 3. Summary & section conclusion.

## MUST-COVER CHECKLIST (teach every item)
- Elements of XML Documents
- Creating XML Documents
- document
- Because XML

## LMS LESSON (authoritative)
LEAD

XML, which stands for eXtensible Markup Language, is a versatile markup language designed to store and transport data in a structured, human-readable format. Unlike HTML, which focuses on how data looks when displayed in a browser, XML is concerned with what the data means. This fundamental difference makes XML an essential tool for data exchange between different systems, applications, and organisations, particularly in contexts where data needs to be shared across platforms that may use different operating systems, databases, or programming languages.

PARAGRAPHS

The most significant difference between XML and HTML is that HTML uses a predefined set of tags for formatting content visually, while XML allows you to create your own tags to describe your data. HTML tags such as <h1>, <p>, and <table> tell a browser how to display content, whereas XML tags such as <student>, <book>, or <invoice> describe the data itself. XML also requires stricter syntax: every opening tag must have a corresponding closing tag, tags must be properly nested, and attribute values must be enclosed in quotation marks. Documents that follow these rules are called well-formed XML documents.

An XML document begins with an optional XML declaration that specifies the version and character encoding being used, written as <?xml version="1.0" encoding="UTF-8"?>. Following the declaration, every well-formed XML document must have exactly one root element that contains all other elements. Elements can contain text content, other nested elements, or a combination of both. Attributes provide additional information about elements and appear within the start tag. Consider the following example of a well-formed XML document representing a student record:

In this example, student is the root element, name and grade contain attributes, and all elements are properly nested and closed. The document is well-formed because it follows all XML syntax rules: it has a single root element, all tags are closed, elements are properly nested, and attribute values are quoted.

One of XML's most important applications is in data exchange between different systems. Because XML is platform-independent and uses plain text, data can be transferred between systems running different operating systems and software without losing its structure or meaning. Many organisations use XML to exchange data between their databases, web services, and partner systems. XML Schema and DTDs (Document Type Definitions) provide ways to validate the structure and content of XML documents, ensuring data consistency and accuracy when information is shared between different parties.

ETHIOPIAN CONTEXT

🌍 Ethiopian Context XML plays a significant role i

## TEXTBOOK CONTENT (authoritative)
4.1. Introduction to XML
Brainstorming 4.1
 What comes to your mind when you hear the term ‘markup language’?
The eXtensible Markup Language (XML) is a markup language like HTML. A
markup language is a computer language that uses tags enclosed with less than (<)
and greater than (>) symbols to define elements within a document. When the file
is processed by a suitable application, the tags are used to control the structure or
presentation of the data contained in the file. Any text that appears within one of
these tags is considered part of the markup language. Markup files contain standard
words, rather than typical programming syntax.
Activity 4.1
• Describe one fact about XML.
XML is a way of applying structure to a web page. XML provides a standard open
format and mechanisms for structuring a document so that it can be exchanged
and manipulated. XML complements your HTML knowledge by allowing you to
structure your data by marking up the text and data to define the data content.
XML is used for storing structured data, rather than formatting information on a
page. While HTML documents use predefined tags (such as “ <head>”, “<title> ”
), XML files use custom tags to define elements.
Microsoft Rich Text Format (RTF), Adobe Portable Document Format (PDF), and
HTML are types of markup languages that provide presentational markup. They
are powerful solutions to the problem of displaying information. Their common
limitation is that they describe how the data looks, but they do not give any
information about what it is.
Like HTML, XML uses tags to “mark-up” data content. Unlike HTML, in XML
you define your own tags that meet the exact needs of your document. The custom

I nformatIon technology grade 12 ~ Student textbook 102
tags make your data easier to organize and more searchable. For example, a student
might describe the book she reads on vacation time like this:
<books>
<book>
<title>An Introduction to XML and Web Technologies </title>
<author> by Anders Moller, Michael Schwartzbach</author>
<type>Programming Languages</type>
</book>
</books>
XML does not change the way your web pages looks; instead, it changes the way
the documents are read and filed and stored. Therefore, XML is used to describe
the structure of a document rather than the way it is presented.
The two areas in which XML is useful are structuring data for storage, where a
relational database (See Unit Three about database) is inappropriate, and the
presentation of web pages. For example, a system is handling small quantities of
data, or if the data lacks a relational structure, programmers usually prefer to create
their own data formats, i.e. XML.
Activity 4.2
1. What tags are used by XML? How are they different from tags used in
HTML?
2. Can HTML replaces XML? Explain your reason.
3. Describe two areas where XML is important.
4.1.1 Elements of XML Documents
XML document must contain one root element that is the parent of all other elements,
for example “<people>” in Figure 4.1). The best way to learn what makes up an
XML document is by starting from a simple example. The following is a complete
XML document that lists the names of two known athletes.

I nformatIon technology grade 12 ~ Student textbook 103
XML document structure Example of an XML document
<?xml version=”1.0” encoding=”UTF-8”?>
<!DOCTYPE people[
<!ELEMENT people (person+)>
<!ELEMENT person (name)>
<!ELEMENT name (first, last)>
<!ELEMENT first (#PCDATA)>
<!ELEMENT last (#PCDATA)>
]>
<people>
<person>
<name>
<first>Haile </first>
<last>Gebrselassie</last>
</name>
</person>
<person>
<name>
<first>Derartu</first>
<last>Tulu</last>
</name>
</person>
</people>
Figure 4. 1 XML Document Structure (left) and Example (right)
The above XML lets you name parts of the document such as the first names and
the last names of two of our legendary athletes. You can name anything that is
relevant to the document you want to produce. All that matters is that you follow
the basic rules for creating tags. The above markup does not follow the basic rules
(predefined tags), rather you define your tags. Figure 4.2 highlights the various
elements of the sample document.

I nformatIon technology grade 12 ~ Student textbook 104
Figure 4. 2 Various Elements of the XML document
The numbers are interpreted as follows:
1. XML declaration: describes the general characteristics of the document,
such as XML document, the version of the XML, and the encoding character
it uses. XML documents usually begin with the XML declaration statement
called the processing instructions which provide information on how the XML
file should be processed. E.g. <?XML version= “1.0” encoding=“UTF-8”?>
The processing instruction statement uses the encoding property to specify
the encoding scheme used to create the XML file. Encoding is the process
of converting Unicode character into their binary equivalent representation
depending on the type of encoding(‘UTF-8’ or ‘UTF-16’).
2. Document Type Declaration (DTD): describes the structure of the document
in terms of which elements it may contain, along with any restrictions it may
have. In other words, it describes the root. The above example is about people.
The document ‘people’ is described with five elements. These are described
below.
E.g. <!DOCTYPE people […]>
3. Internal DTD subset: a DTD is internal if the elements are declared within the
same XML file. In the following example, internal declarations that are local to
the XML document are used.
<!ELEMENT people (person+)>
<!ELEMENT person (name)>
<!ELEMENT name (first, last)>

I nformatIon technology grade 12 ~ Student textbook 105
<!ELEMENT first(#PCDATA)>
<!ELEMENT last(#PCDATA)>
Notes
 PCDATA – stands for Parsed Character DATA. Character data is a
text that is found between the start tag and the end tag of an XML
element. E.g. Abebech in Figure 4.2.
4. XML information set or Content: this represents the XML document’s
content—the information that the document conveys. Content refers to the
information that is represented by the elements of an XML document. See the
example in Figure 4.3.
<people>
<person>
<name>
<first>Abebech</first>
<last>Kebede</last>
</name
</person>
<person>
<name>
<first>Jemal</first>
<last>Ahmed</last>
</name>
</person>
</people>
Figure 4. 3 XML document content.
5. Root element: This encloses all of the information. An XML document can
have only one root element. Therefore, “<people>” is the root of this XML
document.
6. Start tag: XML elements have a start and an end tag—the start tag provides
the name of the XML element. E.g. <first>
7. End tag: The name of the end tag must exactly match the name of the start
tag.

I nformatIon technology grade 12 ~ Student textbook 106
E.g. <people> with </people>, <person> with </person>, <first> with </first>
8. XML element: The start and the end tags are collectively referred to as an
XML elements. Elements are the basic units that are used to identify and
describe the data in XML. They are the building blocks of an XML document.
E.g. <last>Kebede</last>
9. Data: XML elements can contain data between the start and the end tags. An
XML document represents information using a hierarchy. That means, it begins
with a root element (e.g. people), which contains sub-elements (e.g. person)
which in turn can contain other sub-elements(e.g. name), data (e.g. Kebede), or
both. E.g. Abebech, Kebede, Jemal, and Ahmed are data.
Besides the above elements, attributes and comments are also part of XML
documents.
Attribute: Like HTML, XML elements can contain attributes. An attribute provides
additional information about the elements for which it is declared. It consists of a
name-value pair. In the following example, the attribute name is personid and the
value is “101”. The attribute value should be quoted: single or double quotes can
be used.
E.g. <name personid = “101”>Ubang </name>
Comment: This is a kind of note or statement that is used to describe the XML
code. Comments can provide documentation information about the XML file or the
application to which the file belongs. A comment is ignored by the XML parser(or
a program that interpretes XML instruction) during code execution.
The syntax for a comment is: <!-- This is a comment -->
We can see the whole hierarchy of the above markup in an upside-down tree struc-
ture.

I nformatIon technology grade 12 ~ Student textbook 107
Figure 4. 4 Tree Structure of Person XML document
Although XML is designed so that people can read it, it is not intended to create
a finished document. In other words, you can not open up just any XML-tagged
document in a browser and expect it to be formatted well. XML is meant to hold
content so that when the document is combined with other resources, such as a
style sheet which renders a web page, it becomes a finished product.
Activity 4.3
1. Describe elements of XML documents and their purposes.
2. Write XML that describes a food menu. Each type of food has a
description which contains the name of the food and its price. Save it as
test.xml.
Hint: root – food_menu, DTD – it is about food, content – food description
(name and price).
4.1.2 Creating XML Documents
There are a few ways of opening an XML file directly. You can open and edit XML
files with any text editor, view them with any web browser, or use a website
that lets you view, edit, and even convert them to other formats. You can also use

I nformatIon technology grade 12 ~ Student textbook 108
applications such as “oxygen” or “XML Notepad” to see your files’ structures. In
this section, we use “XML Notepad” for our demonstration.
For example, after saving the XML code given above as an example with the *.xml
extension in any text editor, when you open the file with XML Notepad, it looks. It just does nothing because XML is just information wrapped
in tags. A piece of program should be written to send, receive, store, or display it.
When you view your XML document in a browser, most browsers display an
XML document with color-coded elements (See Figure 4.5 below comparing the
document Mozilla and Internet Explorer browsers). Often a plus (+) or minus (-)
sign to the left of the elements can be clicked to expand or collapse the element
structure. To view XML source code, try to select “View Page Source” or “View
Source” from the browser menu you use.
XML document on Mozilla
browser
XML document on Internet Explorer browser
Figure 4. 5 XML Document on Browsers – Mozilla and Internet Explorer
editor.

I nformatIon technology grade 12 ~ Student textbook 109
XML document viewed on XML Notepad – Tree View
Tree View on
XML Note-
pad
XML documents viewed on XML Notepad – XSL Output view
XSL Output
on XML
Notepad
Figure 4. 6 XML document view on XML Notepad
Notes
 XSL is a style sheet for XML as CSS is a style sheet for HTML. XSL
transform and render XML document (See Figure 4.6 above).

I nformatIon technology grade 12 ~ Student textbook 110
Activity 4.4
1. Write the above XML on any text editor and save it as test.xml. Then
open the test.xml using at least two browsers and note what you have
observed.
2. Use the file created in Activity 4.3 Question 2 and open the test.xml
using XML Notepad editor and see the result – in Tree View and XSL
Output.
Hint: Don’t forget to add XML declaration statement at the
beginning.<?xml version=”1.0” encoding=”UTF-8”?>
Syntax rules to be remembered while working on XML:
1. You should have one root: XML documents must contain one element that is
the parent of all other elements.
A. <A><X> . . . </X><Y>…</Y></A></X> is wrong
because the root tag starts with <A> and ends with a different tag </X>
B. <A><X> . . . </X><Y>. . . </Y></A>is correct
because the root tag starts with <A> and ends with the same tag </A>
2. XML elements are case sensitive
A. <name>Ibrahim</Name> is wrong
B. <NAME>Ibrahim</Name> is wrong
C. <Name>Ibrahim</Name> is correct
3. All elements should not overlap, and they must properly be nested within each
other.
A. <Name><Student>Almaz</Name></Student> is wrong
B. <Student><Name>Almaz</Student></Name> is wrong
C. <Student><Name>Almaz</Name></Student> is correct
4. XML attribute values must always be quoted. The XML elements can have
attributes in name-value pairs which are similar to HTML.
<note date=”12/11/2007”>
<to>Gebre</to>
<from>Almaz</from>
</note>
5. Comments in XML: The syntax for writing comments in XML is similar to
that of HTML
E.g. <!-- This is a comment -->

I nformatIon technology grade 12 ~ Student textbook 111
6. XML does not truncate multiple white-spaces. In HTML, multiple white-spaces
are truncated to a single white-space.
XML HTML
Hello AbebechGobena Hello AbebechGobena
7. Entity References: In XML, some characters have special meaning. For
example, a character like “<” inside an XML element will generate an error.
This is because the XML parser interprets “<” as the start of a new XML
element. See the example below:
<Message>if salary <1000 then</Message> This generates an XML error:
To avoid this error, replace the “<” character with an entity reference as:
<Message>if salary &lt; 1000 then</Message> This is correct
There are 5 pre-defined entity references in XML. See these references in Table
4.1 below.
Table 4. 1 Entity References in XML
&lt; < less than
&gt; > greater than
&amp; & ampersand
&apos; ‘ apostrophe
&quot; “ quotation mark
Notes
 Only the characters “<” and “&” are strictly illegal in XML. The greater
than character is legal, but it is a good habit to replace it. Therefore,
XML documents that conform to the syntax rules above are said to be
“Well Formed” XML documents.
Activity 4.5
Examine the following XML code and rewrite it if the code is wrong.
XML code to analyze Corrected XML code
<note><to>Lucy</to><from>Hadar</note></from>
<student id=1010><name>Edossa</name></student>
<birth_date>Date of Birth</Birth_date>
<compare>10>5</compare>
<FullName> Robso Amanueal </fullname>

I nformatIon technology grade 12 ~ Student textbook 112
Element Declarations: XML documents consist of three things: elements,
entities, and control information. Elements are surrounded by tags like HTML.
The content of the document has a structure imposed by the rules of XML although
this structure is quite loose. Each document has a single root element that contains
all of the other markups. You have already learned this point in HTML where
all documents are enclosed inside <html></html> tags. The document is then
composed of several sections, each of which is enclosed between tags. The sections
themselves are also elements.
An XML element is everything from the start tag to the end tag’s of the element.
An element without content is said to be empty element. An empty element can be
described in one of the following options.
<element></element> <element />
Naming rules of XML elements:
• Element names are case-sensitive.
• Element names must start with a letter or underscore.
• Element names cannot start with the letters XML.
• Element names can contain letters, digits, hyphens, underscores, and
periods.
• Element names cannot contain spaces.
Any name can be used, but no words are reserved (except XML).
An element can contain:
• Text
• Attributes
• Other Elements,
or
• A mix of the
above
Example of XML
<Bookstore>
<Book category=”children”>
<title> Stories and Parables</title>
<author>Kebede Michael </author>
<year>2007</year>
<price>Birr 150.00 </price>
</Book>
</Bookstore>
Figure 4. 7 XML Elements vs Examples

I nformatIon technology grade 12 ~ Student textbook 113
In the Figure 4.7 above,
• <title>, <author>, <year>, and <price> have text content because they
contain text. E.g. Kebede Michael.
• <Bookstore> and <Book> have element contents because they contain
elements.
• <Book> has an attribute. E.g. category=”children”.
Attribute Declarations: An XML element, like HTML, can have attributes. The
element’s attributes define data related to a specific element. Attributes provide
additional information about the element. An attribute is defined as key-value pair:
the key is the name (e.g. gender) and the attribute has values that must always be
quoted (e.g. “female”). Either single quotation marks (‘ ’) or double quotation
marks (“ ”) can be used. For example, a person element’s gender can be written
like this:
<person gender= “female”>or <person gender= ‘male’>
If the value of the attribute itself contains double quotation marks, use single
quotation marks, as shown in this example:
<person name= ‘Tilahun Gessesse “KomeLimerkish(ቆሜልመርቅሽ)”’ >
XML Elements vs. Attributes
<person gender=”female”>
< f i r s t n a m e > A n n a < / f i r s t n a m e >
<lastname>Smith</lastname>
</person>
<person>
< g e n d e r > f e m a l e < / g e n d e r >
<firstname>Anna</firstname>
<lastname>Smith</lastname>
</person>
Figure 4. 8 XML Elements vs. Attributes
In the first example of Figure 4.8, gender is an attribute. In the next example,
gender is an element. Both examples provide the same information. There are no
rules about when to use attributes or elements in XML.
Entity Declarations: An entity is a declaration of a name that can be used in
an XML in place of content or markup. Entities must be declared before they are
used. All entities are declared with the “ENTITY” declaration. However, the exact
format of the declaration distinguishes between internal, external, and parameter

I nformatIon technology grade 12 ~ Student textbook 114
entities. The internal (parsed) entity declaration will be discussed for our purpose.
The purpose of internal parsed entities is generally to refer to text. It refers to data
that an XML processor has to parse.
Syntax for creating entity declaration Example
<!ENTITY name “value”> <!ENTITY publisher “Berhanena Selam Printing”>
Figure 4. 9 Entity Declaration
There are two parts to entities. The first is an entity declaration of a name that tie the
replacement content. The above example declares an entity of the name ‘publisher’.
The name ‘publisher’ is associated with the content of “Berhanena Selam Printing”.
The second is using the name defined in the entity declaration subsequently in the
XML as shown below. When the entity name is used in XML, it is called an entity
reference.
<author>Addis Alemayehu</author>
<pubinfo>Published by &publisher;</pubinfo>
When the parser subsequently encounters an ampersand symbol (i.e. &) and
semicolon (i.e. ;) which identify a general entity reference, the parser looks
up that name in an entity declaration table. In our case, the
reference, &publisher; is replaced by the content that it represents. Using the
following (left column) XML, expanding the entity reference, and replacing the
&publisher; with the “Berhanena Selam Printing” content gives the following
expanded XML.
XML document with internal DTD
<<?xml version=”1.0”?>
<!DOCTYPE book [
<!ENTITY publisher “Berhanena Selam Printing”>
]>
<book>
<author>Addis Alemayehu</author>
<pubinfo>Published by &publisher;</pubinfo>
</book>

I nformatIon technology grade 12 ~ Student textbook 115
Output on browser
Figure 4. 10 XML Document with DTD and Output on Browser
Document Type Definition (DTD)
A Document Type Definition (DTD) defines the structure attributes of a document
and the legal elements of an XML document. It can be used by an application
to verify that XML data is valid. A DTD declared inside the XML file must be
wrapped inside the <!DOCTYPE> definition. See Figure 4.11 below.
Example of an XML document with internal DTD
<?xml version=”1.0”?>
<!DOCTYPE album [
<!ELEMENT album (singer, name, release, language)>
<!ELEMENT singer (#PCDATA)>
<!ELEMENT name (#PCDATA)>
<!ELEMENT release (#PCDATA)>
<!ELEMENT language (#PCDATA)>
]>
<album>
<singer>Ali Birra</singer>
<name>Ammalele</name>
<release>2012</release>
<language>Oromiffa</language>
</album>

I nformatIon technology grade 12 ~ Student textbook 116
The interpretation of the above DTD is:
• !DOCTYPE album - defines the root element of the document album
• !ELEMENT album - defines the album element which must contain
four elements: “singer, name, release, language”
• !ELEMENT singer - defines singer element type “#PCDATA”
• !ELEMENT name - defines name element type “#PCDATA”
• !ELEMENT release - defines release element type “#PCDATA”
• !ELEMENT language - defines language element type “#PCDATA”
• PCDATA - means parsed character data. Think of character data as
the text that is found between the start tag and the end tag of an XML
element.
Figure 4. 11 Document Type Definition
Activity 4.6
• Write DTD for the following XML and test the output on a browser.
<!ENTITY author “Author: Addis Ababa University.”>
<!ENTITY copyright “Copyright: Ministry of Education.”>
<textbook>&author;&copyright;</textbook>
