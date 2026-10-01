# ICT_G12_U04_S04 — Introduction to XML

Grade 12 ICT (Ethiopian curriculum). Textbook sub-chapter: Unit 4: 4.1, 4.2, 4.3.

## MUST-COVER CHECKLIST (teach every item)
- Introduction to XML
- HTML vs. XML
- Publishing Website
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
4.1 Introduction to XML
Brainstorming 4.1  What comes to your mind when you hear the term ‘markup language’? The eXtensible Markup Language (XML) is a markup language like HTML. A markup language is a computer language that uses tags enclosed with less than (<) and greater than (>) symbols to define elements within a document. When the file is processed by a suitable application, the tags are used to control the structure or presentation of the data contained in the file. Any text that appears within one of

4.2 HTML vs. XML
Brainstorming 4.2  Compare the features of HTML and XML. HTML is the markup language that helps you to create and design web content. It has a variety of tags and attributes for defining the layout and structure of the web document. It is designed to display data in a formatted manner. An HTML document has the extension .htm or .html. 

4.3 Publishing Website
Brainstorming 4.3  What do you know about website publishing? You have learned that the purpose of XML is for storing structured data, not formatting or styling a document. That is why you see on top of the browser “This XML file does not appear to have any style information associated with it” when you open your XML document (See Figure 4.5 above).
