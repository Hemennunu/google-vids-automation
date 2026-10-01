# ICT_G12_U04_S06 — Publishing a Website

Grade 12 ICT (Ethiopian curriculum). Textbook sub-chapter: 4.3 Publishing Website.

## MUST-COVER CHECKLIST (teach every item)
- What is the name of the website?
- Creating a website
- Domain names
- Web hosting

## LMS LESSON (authoritative)
LEAD

Creating a website is only part of the web authoring process. To make your site accessible to users around the world, you must publish it by uploading its files to a web server and connecting it to a registered domain name. This section explains the key steps and concepts involved in publishing a website, with specific attention to the Ethiopian web hosting environment.

PARAGRAPHS

A domain name is the unique address that users type into their browsers to visit your website, such as www.mariana-school.et. Domain names are registered through accredited organisations called domain registrars, which manage the reservation of domain names on behalf of the internet's Domain Name System. When you register a domain name, you are leasing the right to use that name for a specific period, typically one to ten years, and you must renew the registration before it expires. Domain names are organised hierarchically, with top-level domains such as .com, .org, and .edu, as well as country code top-level domains such as .et for Ethiopia. The .et domain is managed by EthioTelecom, the state-owned telecommunications provider, which serves as the official registry for Ethiopian domain names. To register a .et domain, you must submit an application to EthioTelecom with supporting documentation, including a valid business licence or organisational registration certificate.

Web hosting is a service that provides storage space on a web server where your website files reside. When a user types your domain name into their browser, the browser sends a request to the DNS, which translates the domain name into the IP address of your hosting server. The server then delivers your website files to the user's browser, which renders the page. Web hosting comes in several types: shared hosting, where multiple websites share the same server resources and is the most affordable option; virtual private server hosting, which provides dedicated resources within a shared environment; dedicated hosting, where an entire physical server is reserved for a single website; and cloud hosting, which uses a network of virtual servers that can scale resources on demand. For Ethiopian users, local hosting providers such as EthioTelecom and other private companies offer hosting plans with local support and payment options in Ethiopian Birr. Choosing between local and international hosting depends on factors such as your target audience, budget, and technical requirements. Websites targeting Ethiopian users may benefit from local hosting due to faster loading times within the country, while international hosting providers often offer more features and lower prices.

FTP, or File Transfer Protocol, is the standard method for uploading website files from your local computer to your web hosting server. To use FTP, you need an FTP client such as FileZilla, which provides a graphical interface for transferring files. You will need your hosting provider's FTP server address, your username, and your password, all of which are provided when you set up your hosting account. Once connected to the FTP server, you can drag and drop your website files from your local computer to the appropriate d

## TEXTBOOK CONTENT (authoritative)
4.3. Publishing Website
Brainstorming 4.3
 What do you know about website publishing?
You have learned that the purpose of XML is for storing structured data, not
formatting or styling a document. That is why you see on top of the browser “This
XML file does not appear to have any style information associated with it”
when you open your XML document (See Figure 4.5 above).

I nformatIon technology grade 12 ~ Student textbook 120
XML is just information wrapped in tags. So it is now time to write a piece of
program to display our XML document. In the following discussion, you will learn
how you put all of the XML document, web designing, and publishing concepts that
you have learnt in Grade 11 together to develop further skills in website publishing.
Step-by-Step design of XML document and publishing
So far, it has been discussed that HTML tags are not understood by XML coding.
If that is the case, we can have our own customized tag names for the specific
environment rather than predefined HTML tags. Let us take a ‘college’ environment
and organize the contents of the college documents using an XML structure.
To start your coding, you should write an XML declaration statement at the
beginning to indicate that it is an XML language by using <? Xml version =”1.0”
encoding=”UTF-8”?>, as shown in the example below.
Instead of <html>, we can start our root to be <College>. This shows that the
initial data or root for our XML is going to be college:
XML document Code XML document view on XML Notepad
<?xml version =”1.0” encoding=”UTF-8”?>
<College><!-- Opening tag College-->
</College><!-- Closing tag College-->
Figure 4. 12 XML with custom tags
Save the above document with your name .xml (such as yourname.xml) and keep
updating the data and save your document after each step.
The next step is to organize the data of the college. Different colleges can have
different structures or organizations for their data. Here we organize the college
in terms of departments. The college can have several departments; in our case,
it has three departments. We create again an element named <Department> as a
sub-element of the <College>. The information may be organized as follows (See

I nformatIon technology grade 12 ~ Student textbook 121
XML document Code XML document view on XML Notepad
<?xml version =”1.0”
encoding=”UTF-8” ?>
<!-- Opening tag Col-
lege-->
<College>
<Department>
</Department>
<Department>
</Department>
<Department>
</Department>
</College>
<!-- Closing tag
College-->
The departments in the college can have detail information. This may include
the department name and the department number. Before
proceeding to other sub-elements of the department, we can fill in the content for
the department name and number. For further processing, you can attach data type
to your elements. If you see the first department as an example, the attribute or data
type for the department number is an integer value. Therefore, you have to think
about your values.

I nformatIon technology grade 12 ~ Student textbook 122
XML document Code XML document view on XML Notepad
<?xml version =”1.0” encod-
ing=”UTF-8” ?>
<!-- Opening tag College-->
<College>
<Department>
<Name> ICT </Name>
<Number type=”int”>101 </
Number>
</Department>
<Department>
<Name>Physics</Name>
<Number>102</Number>
</Department>
<Department>
<Name>Biology</Name>
<Number>103</Number>
</Department>
</College>
<!-- Closing tag College-->
Not only the name and number of departments can be added but also details of
students, teachers, and courses. Each of these can also be created as sub-elements
of the department as shown below in Figure 4.15.

I nformatIon technology grade 12 ~ Student textbook 123
XML document view on XML Notepad

I nformatIon technology grade 12 ~ Student textbook 124
XML document
<?xml version =”1.0” encoding=”UTF-8” ?>
<College>
<Department>
<Name>Department Name: ICT </Name>
<dNumber type=”int”>Department Number: 101 </dNumber>
<Course>
<Name> Web Design </Name>
<Number type=”Code”> ICT1012 </Number>
<Credithour type=”Cr_Hr”> 4 </Credithour>
<Teacher>
<TName type=”Teacher”>Abebe</TName>
</Teacher>
</Course>
<Course>
<Name>Programing</Name>
<Number type=”Code”> ICT1212 </Number>
<Credithour type=”Cr_Hr”> 4 </Credithour>
<Teacher>
<TName type=”Teacher”>Ayele</TName>
<IDNO type=”IDNO”> ICT/2323/13 </IDNO>
</Teacher>
</Course>
<Student></Student>
</Department>
<Department>
<Name> Department Name: chemistry </Name>
<dNumber>Department Number: 102 </dNumber>
<Course>
<Name> Organic Chemistry </Name>
<Number type=”Code”> CHEM1212 </Number>
<Credithour type=”Cr_Hr”> 4 </Credithour>
</Course>
<Course>
<Name>Inorganic Chemistry</Name>
<Number type=”Code”> CHEM2121 </Number>
<Credithour type=”Cr_Hr”> 4 </Credithour>
</Course>
<Teacher></Teacher>
<Student></Student>
</Department>
</College>
Figure 4. 15 College Structure with Teachers’ and Students’ Data Added

I nformatIon technology grade 12 ~ Student textbook 125
Also, you can add teachers and students’ data by creating sub-elements such as
name, sex, age, etc.
Once you have designed your website, the next step is to publish it.
Until this point, you have learnt website design. Once you have completed the
design of your website, the next step involves publishing the website so that the
website is accessible worldwide by anyone.
Website publishing is the process of publishing the website’s original content onto
the Internet, or specifically onto a remote server. The term sometimes refers to
the whole process of website design and publishing. This includes building and
uploading websites, updating the webpages, and posting content to these webpages
online. Web publishing includes personal, business, and community websites. The
content meant for web publishing can include text, videos, digital images, artwork,
and other forms of media such as music.
The most common thing about any website is that it is represented by a root di-
rectory. A root directory contains folders to organize images(.jpg,.gif), style files(.
css), and script files(.js) that are used in the website, and its index file (See Figure
4.16 below).
1. root: this is the top level or root folder that represents the website itself. It
contains all other files and folders of the website. For example, moe.gov.et.
2. index.html: contains the main homepages of the site which are written in
HTML. Web servers are by default set up to return to the index.html file if
no file name is specified. For example, if you write moe.gov.et, it returns to
moe.gov.et/index.html.
3. pages folder: this subfolder contains web pages of the site. For example:
about, contact us, etc. The name could be anything related to the site.
4. images folder: this is the subfolder that contains all the images that are
used on the site.
5. CSS folder: CSS code used to style the site resides in this folder. It includes,
for example setting text and background colors.

I nformatIon technology grade 12 ~ Student textbook 126
6. scripts folder: this subfolder contains all the JavaScript code used to add
interactive functionality to the site (e.g. buttons that load data when clicked).
Figure 4. 16 Sample website - directory and files organization
A website is published by uploading website content or files onto the remote
server which is provided by the hosting company or web host. Hosting companies
provide web hosting services, which means providing online space for the storage
of websites. A website is made available via World Wide Web (WWW). Web hosts
must possess a web server. The web server is the actual location where your website
resides. A web server may host single or multiple sites depending on what hosting
service you have paid for.
The process of publishing a website also involves registering a domain name. A
domain name is the part of your internet address that comes after “www”. For
example, in http://www.moe.gov.et/, the domain name is moe.gov. A domain name
becomes your online business address, so care should be taken when selecting a
domain name. Your domain name should be easy to remember and easy to type.
It must be unique. If the one you want to use is taken or not available, domain
registration fails, and you need to find another one.
A domain extension is made up of three letter (for example, .gov in the above
URL) at the end of the internet address which is known as a top-level domain
names. The most common domain extensions include:

I nformatIon technology grade 12 ~ Student textbook 127
• .com for commercial sites.
• .edu for educational institution.
• .gov for government institutions.
• .org for a non-profit organization.
• .mil for military.
• .net for network
Security options
To keep your site safe and secure, a secure URL is needed. Particularly, if the site
visitors are providing their private information, HTTPS is required, not HTTP.
HTTPS (Hypertext Transfer Protocol Secure) is a protocol that is used to provide
security over the Internet. To enable HTTPS, your website needs an SSL. SSL
stands for Secure Sockets Layer which provides a secure online connection, and
your website needs an SSL Certificate. SSL is also another necessary site protocol.
It ensures your site visitor’s personal information transfers between the website
and your database are secure. SSL encrypts information (send from you/receive
from the server) to prevent others from accessing and reading it while in transit.
To check whether a website is secure or not, you can type the website name into
a browser address bar (e.g. ethiopia.gov.et) and notice one of the two results as
shown below. A secure site displays a locked keypad (See the image in the second
column below). If the site is not secure, before the web address, you could see the
information icon and ‘Not secure’ (see the image in the first column below).
Non secure website is shown on a browser
address bar
Secure website is shown on a browser
address bar

I nformatIon technology grade 12 ~ Student textbook 128
Activity 4.9
1. Based on the below website directory:
a. What is the name of the website?
b. Identify the root directory and sub-directory, image directory, style
directory, home page, or index page.
2. Take the websites of five Ethiopian federal institutions and check if their
websites are secured. Hint: moa.gov.et, mofed.gov.et, etc.
3. Review at least two web hosting companies in Ethiopia, with features provided.

I nformatIon technology grade 12 ~ Student textbook 129
Unit Summary
In this unit, you have learnt about:
• the markup language XML.
• the definition of XML, its features, and purpose.
• elements of XML.
• XML vs. HTML – similarities and differences.
• advantages and disadvantages of XML.
• XML tags, root, XML declaration.
• document Type Declaration (DTD), Attributes, Comments.
• ways of opening XML file directly.
• entity references and entity declaration.

I nformatIon technology grade 12 ~ Student textbook 130
Key Terms
A markup language is a type of computer language that uses tags such as
“<” and “>” to define elements in a document.
XML stands for Extensible Markup Language which is a way to apply
structure to a web page. XML provides a standard open format and mechanisms
for structuring a document so that it can be exchanged and manipulated.
An XML document contains the following: XML declaration, Document
Type Declaration (DTD), Internal DTD subset, XML information set /
Content, Root element, Tags, Data, Attributes, and Comments.
Points to remember while you work on XML:
• You should have one root in an XML document.
• XML elements are case-sensitive.
• XML should not overlap or all elements must properly be nested within
each other.
• XML attribute values must always be in quotation marks.
• Comments in XML follow the HTML comment structure.
• XML does not truncate multiple whitespaces.
• Special characters need entity references, otherwise, they create errors.
HTML and XML are two different markup languages. HTML is the markup
language to design and create web content, whereas XML is a markup
language designed to store data. It is popularly used for the transfer of data.
However, the two complement each other.
Entity References: This refers to characters that have special meaning in
XML. There are 5 pre-defined entity references in XML, such as &lt; (<),
&gt; (>), &amp; (&), &apos; (‘), and &quot; (“).
You can open and edit XML with any text editor, and view it with any web
browser, or use a website that lets you view, edit, and even convert it to other
formats.
In DTD the !DOCTYPE - defines the root element of the document.
I nformatIon technology grade 12 ~ Student textbook 130
Key Terms
A markup language is a type of computer language that uses tags such as
“<” and “>” to define elements in a document.
XML stands for Extensible Markup Language which is a way to apply
structure to a web page. XML provides a standard open format and mechanisms
for structuring a document so that it can be exchanged and manipulated.
An XML document contains the following: XML declaration, Document
Type Declaration (DTD), Internal DTD subset, XML information set /
Content, Root element, Tags, Data, Attributes, and Comments.
Points to remember while you work on XML:
• You should have one root in an XML document.
• XML elements are case-sensitive.
• XML should not overlap or all elements must properly be nested within
each other.
• XML attribute values must always be in quotation marks.
• Comments in XML follow the HTML comment structure.
• XML does not truncate multiple whitespaces.
• Special characters need entity references, otherwise, they create errors.
HTML and XML are two different markup languages. HTML is the markup
language to design and create web content, whereas XML is a markup
language designed to store data. It is popularly used for the transfer of data.
However, the two complement each other.
Entity References: This refers to characters that have special meaning in
XML. There are 5 pre-defined entity references in XML, such as &lt; (<),
&gt; (>), &amp; (&), &apos; (‘), and &quot; (“).
You can open and edit XML with any text editor, and view it with any web
browser, or use a website that lets you view, edit, and even convert it to other
formats.
In DTD the !DOCTYPE - defines the root element of the document.

I nformatIon technology grade 12 ~ Student textbook 131
PCDATA in<!ELEMENT releases (#PCDATA)>- means parsed character
data.
Advantages of using XML: It makes documents transportable, separates
data from HTML, flexible platform change process.
Disadvantages of using XML: It requires a processing application, syntax
sometimes confusing, no intrinsic data type, and redundant syntax.
Website publishing is the process of publishing the website’s original content
on the Internet, or specifically on a remote server.
Websites are published by uploading website content/files onto the remote
server which is provided by a hosting company or a web host.
SSL and HTTPS are protocols that provide security options that keep your
site safe and secure. HTTPS is secured and prevents interceptions and
interruptions from occurring while the content is in transit. The website
requires an SSL certificate to enable HTTPS.
I nformatIon technology grade 12 ~ Student textbook 131
data.
Advantages of using XML: It makes documents transportable, separates
data from HTML, flexible platform change process.
Disadvantages of using XML: It requires a processing application, syntax
sometimes confusing, no intrinsic data type, and redundant syntax.
Website publishing is the process of publishing the website’s original content
on the Internet, or specifically on a remote server.
Websites are published by uploading website content/files onto the remote
server which is provided by a hosting company or a web host.
SSL and HTTPS are protocols that provide security options that keep your
site safe and secure. HTTPS is secured and prevents interceptions and
interruptions from occurring while the content is in transit. The website
requires an SSL certificate to enable HTTPS.
I nformatIon technology grade 12 ~ Student textbook 131
PCDATA in<!ELEMENT releases (#PCDATA)>- means parsed character
data.
Advantages of using XML: It makes documents transportable, separates
data from HTML, flexible platform change process.
Disadvantages of using XML: It requires a processing application, syntax
sometimes confusing, no intrinsic data type, and redundant syntax.
Website publishing is the process of publishing the website’s original content
on the Internet, or specifically on a remote server.
Websites are published by uploading website content/files onto the remote
server which is provided by a hosting company or a web host.
SSL and HTTPS are protocols that provide security options that keep your
site safe and secure. HTTPS is secured and prevents interceptions and
interruptions from occurring while the content is in transit. The website
requires an SSL certificate to enable HTTPS.

I nformatIon technology grade 12 ~ Student textbook 132
Review Questions
Part I: Match the items given under column B with associated items in
column A
A B
1. XML declaration
2. HTML tag
3. *.xml
4. https://www.moa.gov.et
5. XML attribute
A. <body>
B. Extension of XML document
C. Secured website
D. <DOCTYPE … [ … ]>
E. <?xml version =”1.0”
encoding=”UTF-8” ?>
F. html
G. <student id=’101’></student>
H. <element/>
Part II: Choose the correct answer from the given alternatives.
1. Which of the following statement is true about XML?
A. Elements are not case-sensitive.
B. Quoting attribute is optional.
C. Elements may nest but not overlap
D. All of the above.
2. If you want to start XML coding, what is the correct declaration syntax
for the version of an XML document?
A. </xml version=”1.0”/> B. <?xml version=”1.0”/?>
C. <xml version=”1.0”> D. <!Element />
3. What does DTD stand for?
A. Dynamic Type Definition
B. Document Type Definition
C. Do The Dance.
D. Direct Type Definition.

I nformatIon technology grade 12 ~ Student textbook 133
4. One of the following does not conform to element naming rule in XML
documents.
A. <Note> B. <h1>
C. <1dollar> D. <NAME>
5. Among the available mark-up languages, XML is a complement to ___.
A. HTML B. XHTML
C. XQuery D. PDF
6. Which of the following is incorrect?
A. The objective of XML is to replace HTML.
B. Attribute of element should be in single or double quotation
marks.
C. Entity declaration is declared in DTD.
D. All XML documents should begin with XML declaration.
7. Which of the following provides secured web access for a website?
A. HTTP B. XML
C. SSL certificate D. HTML
8. Which of the following XML documents is well-formed?
A. <firstElement>some text <secondElement>another text </
secondElement></firstElement>
B. <firstElement>some text</firstElement><secondElement>
another text</secondElement>
C. <firstElement>some text<secondElement> another text</
firstElement></secondElement>
D. </firstElement>some text</secondElement>another text<-
firstElement>
9. An XML document is a well-formed XML document, when it___.
A. contains a root element. B. contains an element.
C. contains attribute. D. contain entity declaration.

I nformatIon technology grade 12 ~ Student textbook 134
10. Which one of the following is not the advantage of XML compared to
HTML?
A. Browser interfaces are simple to build.
B. You can exchange data quickly between different platforms.
C. You can use many tags to make a webpage.
D. It is not object-oriented.
Part III: Code Writing
Take the environment where you are living and design the data structure for a
specific organizational or environmental concept. For example, you may take
animal kingdoms and structure their data, you may take Kebele residences
and structure their data, or any other you feel appropriate.
Project: if you take, for instance Kebele residences, based on that:
● Try to find the structure of the documents in the kebele system
● Develop different pages/documents of the kebele

I nformatIon technology grade 12 ~ Student textbook 135
Learning Outcomes
At the end of this unit, students will be able to:
 Practice installing and uninstalling software
 Explain software troubleshooting
 Describe network troubleshooting steps
 Identify network maintenance tools
Unit Overview
To ensure the safety and security of computer systems, every system user should
take preventative actions including software preventive measures. Software
preventive maintenance includes upgrading and installing software updates for
security and reliability purposes. With a strong software preventative maintenance
activity, time and money can be saved on one hand and failures can be reduced
on the other. In this unit, you will learn about the installation and uninstallation
of software, techniques used in software preventive maintenance, and basic
maintenance tools that can be applied in our day-to- task routines .
5
UNIT MAINTENANCE AND
TROUBLESHOOTING

I nformatIon technology grade 12 ~ Student textbook 136
