# ICT_G11_U04_S06 — HTML Fundamentals

Grade 11 ICT (Ethiopian curriculum). Textbook sub-chapter: 4.3 HTML Basics.

## MUST-COVER CHECKLIST (teach every item)
- HTML Tags and Elements
- Structure of HTML Documents
- HTML Attributes
- Document Type Declaration
- Paragraphs
- Images

## LMS LESSON (authoritative)
LEAD

This unit covers Web Development as part of the Grade 11 ICT curriculum, aligned with the Ethiopian MoE 2023 standard textbook.

PARAGRAPHS

HTML, or HyperText Markup Language, is the standard language used to create web pages. Every HTML document follows a basic structure that consists of a Document Type Declaration (DOCTYPE), which tells the browser which version of HTML is being used, followed by the root HTML element that contains two main sections: the head and the body. The head section contains metadata about the document, such as the page title displayed in the browser tab, character encoding declaration, links to CSS stylesheets, and meta tags for search engine optimisation. The body section contains all the visible content that users see in their web browser, including text, images, links, and multimedia elements.

A basic HTML document begins with <!DOCTYPE html> to declare HTML5, followed by the opening <html> tag. Inside the HTML tags, the <head> element contains the <title> tag, which sets the page title. The <body> element holds all visible content. Common HTML tags for structuring content include six levels of headings from <h1> (the most important) to <h6> (the least important). Headings create a hierarchical structure for the page content, with <h1> typically used for the main page title and subsequent headings for subsections. Paragraphs are created with the <p> tag, and line breaks within paragraphs can be inserted using <br>.

Text formatting tags allow authors to emphasise or style content. The <strong> tag indicates strong importance and typically renders as bold text, while the <em> tag indicates emphasis and typically renders as italic. Other formatting tags include <u> for underlined text, <mark> for highlighted text, and <small> for smaller text such as disclaimers and side comments. Images are inserted using the <img> tag, which is a self-closing tag that requires the src attribute to specify the image file path and the alt attribute to provide alternative text for accessibility. Lists can be created using <ul> for unordered (bulleted) lists and <ol> for ordered (numbered) lists, with each list item wrapped in <li> tags.

ETHIOPIAN CONTEXT

Ethiopian Curriculum ContextThis content is assessed in the Grade 11 national examinations. Ethiopian examples, data, and contexts are integrated throughout each section.

KEY CONCEPTS

Core TopicsHTML, CSS, website design principles, hyperlinks, forms, web publishing.

How to Use This UnitWork through the sections in order. Master the Key Vocabulary before the main content. Attempt each Worked Example independently before checking the solution. Complete the Interactive Tools and Assessment sections to consolidate your understanding.

EXAMPLES

Example: Basic HTML Document <!DOCTYPE html> <html> <head> <title>My School - Ethiopia</title> </head> <body> <h1>Welcome to Addis Ababa Secondary School</h1> <p>This is the official website of our school. We provide quality education for Grade 11 students in Ethiopia.</p> <h2>Our Mission</h2> <p>We aim to <strong>empower</strong> students with the knowledge and skills needed for the <em>digital future</em>.</p> <img src="school-logo.jpg" alt="School logo"> <h2>Departments</h2> <ul> <li>ICT Department</li> <li>Science Department</li> <li>Mathematics Department</li> </ul> </body> </html>

## TEXTBOOK CONTENT (authoritative)
4.3. HTML Basics
HTML is a markup language that is used to create webpages. The different elements
of a webpage such as headings, tables, paragraphs, images, and others are defined
using the predefined set of markup tags of HTML.
HTML has gone through multiple revisions since its invention in 1989. The current
version of HTML is HTML5.
HTML documents can be prepared using simple text editor software such as
Notepad. The documents are saved with a “.html” extension. For example, home.
html is a valid file name for an HTML document or a webpage.
4.3.1 HTML Tags and Elements
HTML tags are a set of predefined names enclosed in angle brackets. Each HTML
tag has its specific meaning, and web browsers are designed to interpret or render
HTML tags according to their intended purposes. Sample HTML tags and their
meanings are shown in Table 4.1.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 81
Table 4.1 Sample HTML tags
Tag Name Meaning
<b> Bold
<p> Paragraph
<i> Italic
<h1> Heading
Links
Visit the following webpage for the list of all html tags:
https://www.w3schools.com/tags/default.asp
HTML elements are components of an HTML document and normally have
a <start tag> followed by content and an </end tag>. HTML elements are the
building blocks of a webpage. Figure 4.3 shows some examples of HTML elements
and their outputs on the browser.
HTML Code
<h1>This is a heading</h1>
<p>This is a paragraph</p>
<b>This is a bold text</b>
<i>This is an italic text</i>
Output on the Web Browser
This is a heading
This is a paragraph
This is a bold text This is an italic text
Notes
 In Figure 4.3 that while the heading and the paragraph elements are
displayed on a separate line each, the bold and italic texts are displayed
next to each other. This is because the browser inserts a new line every
time it finds HTML elements like <h1> and <p>, but it doesn’t insert
new lines for <b> and <i> HTML elements.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 82
Activity 4.3
• Write an HTML document that has two paragraphs.
Though a significant majority of HTML elements conform to the <start tag>
content </end tag> format, there are some HTML elements that have a different
format. These HTML elements are known as void elements. The following table
shows the format of void elements and their meanings. Void elements do not have
an end tag.
Table 4.2 Void elements
HTML element Meaning
<br> Inserts a new line
<img> Inserts an image
<hr> Inserts a horizontal line
Notes
 Note that the <img> element needs an attribute that indicates the
address of the image for the browser to insert the image into the
webpage. An example of how to insert an image is given in Section
4.3.3

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 83
HTML Code
<hr >
<p>This is a <br> paragraph </p>
<hr >
Output on the Web Browser
Notes
 Note that the two horizontal lines placed above and below the
paragraph are the result of the two <hr > elements. Also, note that the
text “paragraph” is shown in a new line because the <br > element is
inserted right before it, inside the <p> element.
Activity 4.4
• Create a webpage that has three paragraphs enclosed by horizontal lines.
4.3.2 Structure of HTML Documents
All HTML documents or webpages have a common structure. What changes from
one webpage to another is what goes inside the <body> and the <head> sections
of HTML documents. Figure 4.2 shows what the structure of HTML documents
looks like in HTML5.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 84
Notes
 <!DOCTYPE html>: this element indicates the type of the document.
 <html> …</html>: represents the entire document, and it is divided
into two major sections: the head (<head>..</head>) and the body
(<body>…</body>) sections.
 <head>..</head>: this part of the HTML document is used to keep all
the information about the webpage such as the page title.
 <body>…</body>: is the part of the HTML document where the
content of the webpage is kept. Everything that is shown in the web
browser, when the webpage is displayed, is what is contained in this
part of the HTML document.
Activity 4.5
• Open a webpage from the Internet. Right-click on any area of the webpage
and click on the “View page source” option. Then, after the complete
HTML code is displayed, identify those tags that you are familiar with,
and explore more about those that you do not recognize.
4.3.3 HTML Attributes
HTML attributes are used to define more properties to HTML elements. HTML
paragraphs, for example, are left-aligned by default. However, if a paragraph is

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 85
needed to be presented with the texts aligned to the right, the “align” attribute
should be used. Attributes are written inside the start tag with attribute-value pairs
(attribute=value). Figure 4.4 shows how the text of a paragraph is aligned to the
right using the “align” attribute.
HTML Code
<h1>This is a heading</h1>
<p align=”right” > This is a paragraph </p
Output on the Web Browser
This is a heading
This is a paragraph
Attributes are normally optional to many of the HTML tags. However, there are
some HTML elements that cannot function as intended without the use of some
attributes. The <img> HTML element is one such example. The <img> element
should have the “src” attribute, which refers to the name and location of the actual
image that is required to be inserted into the webpage. See the following example.
HTML Code
<img src=”derartu tulu.jpg” >
Output on the Web Browser

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 86
Notes
 Note that the example in Figure 4.6 assumes that the image file and the
HTML file are located in the same folder.
Activity 4.6
1. Write an HTML element that displays a heading with the text right-
aligned.
2. Write an HTML document that has three images each placed in a
separate line.
The other HTML element that uses the “src” attribute is the <video> element.
<video> element is used to add a video to a webpage as shown in the following
example.
HTML Code
<video width=”320” height=”200” controls
src=”Country Landscape.mp4” >
</video>
Output on the Web Browser

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 87
Notes
The meaning of the attributes in the <video> element is given as follows:
 The controls attribute adds controls like play, pause, and volume. Note
that no value is assigned to the controls attribute.
 The width and height attributes control the width and height of the
video on the webpage depending on the value given.
 The src attribute is used to refer to the file name of the video.
Activity 4.7
1. Get a short MP4 video and put it inside a folder.
2. Create an HTML document in the same folder and add a <video> ele-
ment in the HTML document to display the video that you just added to
the folder.
3. Open the HMTL document and see if the video opens.
4. Change the values of the height and width attributes and observe the
differences on the webpage. Observe also the change on the video when
the controls attribute is removed.
