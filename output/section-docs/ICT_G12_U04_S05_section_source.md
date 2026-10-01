# ICT_G12_U04_S05 — HTML vs XML

Grade 12 ICT (Ethiopian curriculum). Textbook sub-chapter: 4.2 HTML vs. XML.

## MUST-COVER CHECKLIST (teach every item)
- Advantages and Disadvantages of XML
- While both
- HTML
- HTML tags
- XML documents

## LMS LESSON (authoritative)
LEAD

Understanding the differences between HTML and XML is fundamental to web authoring. While both are markup languages that use tags to structure content, they serve entirely different purposes and follow different rules. This section provides a detailed comparison to help you choose the right tool for the right task.

PARAGRAPHS

The first major difference lies in the purpose of each language. HTML is designed for presenting information to human readers through a web browser, while XML is designed for transporting and storing data between computer systems. HTML uses a predefined set of approximately 100 tags that cannot be extended, whereas XML allows you to create any tags you need to describe your data. HTML is relatively forgiving of syntax errors: many browsers will still display a page even if tags are not properly closed or nested. XML, by contrast, is strict: a single syntax error will prevent an XML document from being parsed, and the document must be well-formed to be valid. HTML tags are primarily concerned with presentation, such as <b> for bold and <i> for italics, while XML tags describe the semantic meaning of data, such as <price> or <customerName>.

HTML's main advantage is its simplicity and universality: every web browser understands HTML, and it requires minimal training to create basic web pages. However, HTML cannot describe the meaning of data, making it unsuitable for data exchange between systems. XML's main advantage is its flexibility and extensibility: you can create custom vocabularies for any domain, from mathematics to medicine to education. However, XML tends to be more verbose than HTML, and processing XML requires additional software tools such as parsers, XSLT transformers, and schema validators. XML documents are also larger in file size compared to equivalent data in other formats such as JSON.

Use HTML when you need to create content for display in a web browser, such as building a website, writing a blog post, or designing an online course page. Use XML when you need to exchange structured data between different systems, such as transferring student records between a school's database and a national education ministry,

DEFINITIONS

HTML (HyperText Markup Language) is a presentation-oriented markup language with a fixed set of tags used to structure and display content in web browsers. HTML tells the browser how content should look, including headings, paragraphs, images, links, and tables. XML (eXtensible Markup Language) is a data-oriented markup language that allows users to define their own custom tags to describe data. XML tells other systems what the data means, without any instructions about how it should be displayed.

## TEXTBOOK CONTENT (authoritative)
4.2. HTML vs. XML
Brainstorming 4.2
 Compare the features of HTML and XML.
HTML is the markup language that helps you to create and design web content.
It has a variety of tags and attributes for defining the layout and structure of the
web document. It is designed to display data in a formatted manner. An HTML
document has the extension .htm or .html.

I nformatIon technology grade 12 ~ Student textbook 117
XML is a markup language that is designed to store data. It is popularly used for
the transfer of data. It is case sensitive. XML offers you the ability to define markup
elements and generate customized markup language. The basic unit in XML is
known as an element, and the extension of an XML file is .xml
Table 4.2 Compares common features of HTML and XML.
Parameter XML HTML
Type of language XML is a framework for
specifying markup languages.
HTML is a predefined
markup language.
Structural details They are provided. They are not provided.
Purpose Transfer of data. Display / Presentation of
data
Nesting It Should be done appropriately. It does not have any effect
on the code.
Driven by XML is content driven. HTML is format driven.
Size Documents are mostly lengthy
in size, especially when an ele-
ment-centric approach is used in
formatting.
The syntax is very brief
and yields formatted text.
Learning curve It is very hard as you need to learn
technologies like XPath, XML
Schema, DOM, etc.
It is a simple technology
stack that is familiar to
developers.
Coding Errors No coding errors are allowed. Small errors are ignored.
Extension .xml .html or .htm
E.G. Page1.xml E.G. Page1.html
Whitespace
Output
White spaces can be used in your
code.
White spaces cannot be
used in your code.
<Name> Motherland
Ethiopia</Name>
<p>Motherland
Ethiopia</p>
Motherland Ethiopia Motherland Ethiopia

I nformatIon technology grade 12 ~ Student textbook 118
Parameter XML HTML
Language type It is case sensitive. It is case insensitive.
<Name>Lucy</Name> <STRong>Lucy<strONG>
Tag Tags are defined as per the need
of the programmer.
It has its own predefined
tags.
E.G. <book><Author><Title> E.G. <body><b><i>
End of tags The closing tag is essential in a
well-formed XML document.
The closing tag is not
always required.
<Person><student><Name>Your
name
</Name</student>></Person>
<body><P> This is
paragraph </body>
Quotes Quotation marks are required
around XML attribute values.
Quotation marks are not
required for the values of
attributes.
< D e p a r t m e n t > < n u m b e r
type=”int”> 101 </number></
Department>
< b o d y
bgcolor=#00ff00><p>
This is paragraph </body>
Activity 4.7
• Discuss the similarities and differences between HTML and XML.

I nformatIon technology grade 12 ~ Student textbook 119
4.2.1 Advantages and Disadvantages of XML
Some of the advantages and disadvantages of XML are listed below.
Table 4. 3 The Advantages and the Disadvantages of XML
Advantages of using XML Disadvantages of using XML
• XML makes documents
transportable across systems
and applications. With
the help of XML, you can
exchange data quickly
between different platforms.
• It separates the data from
HTML.
• It simplifies the platform
exchange process.
• XML requires a processing
application
• The XML syntax is very
similar to other alternative
‘text-based’ data transmission
formats which are sometimes
confusing
• No intrinsic data type support
• The XML syntax is redundant
• It does not allow users to create
their tags.
Activity 4.8
• Discuss the advantages and disadvantages of XML with a partner.
