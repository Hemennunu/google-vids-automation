# ICT_G11_U04_S07 — HTML Links

Grade 11 ICT (Ethiopian curriculum). Textbook sub-chapter: 4.4 HTML Links.

## MUST-COVER CHECKLIST (teach every item)
- Links to other Pages
- Links to Page Sections
- Hyperlinks
- Absolute paths
- Relative paths

## LMS LESSON (authoritative)
LEAD

This unit covers Web Development as part of the Grade 11 ICT curriculum, aligned with the Ethiopian MoE 2023 standard textbook.

PARAGRAPHS

Hyperlinks are what make the World Wide Web a web, connecting documents across the internet through clickable links. In HTML, links are created using the anchor tag <a> with the href attribute specifying the destination URL. The text or image placed between the opening and closing anchor tags becomes the clickable element. For example, <a href="https://www.moe.gov.et">Visit the Ministry of Education Website</a> creates a link that, when clicked, navigates the browser to the Ethiopian Ministry of Education website. The target attribute controls how the linked document opens. Setting target="_blank" opens the link in a new browser tab or window, which is useful when linking to external websites so that the user does not navigate away from the current page. Omitting the target attribute or setting target="_self" opens the link in the same tab.

HTML supports two types of paths for linking to resources: absolute and relative paths. An absolute path contains the full URL, including the protocol (http:// or https://), domain name, and file path, such as https://www.ethiotelecom.et/support. Absolute paths are used when linking to resources on external websites. A relative path specifies the location of a resource relative to the current document's location, without including the domain name. For example, if a page is in the root directory and the target file is in a subfolder called "images," the relative path would be images/photo.jpg. Relative paths are used for linking to resources within the same website because they are shorter, easier to maintain, and work regardless of the domain name.

Images can also function as links by nesting an <img> tag inside an <a> tag. This technique is commonly used for creating clickable banners and logo links. For instance, <a href="https://www.moe.gov.et"><img src="moe-logo.png" alt="Ministry of Education Logo"></a> creates a clickable image that links to the ministry's website. Email links use the mailto: scheme to open the user's default email client with a pre-addressed message. For example, <a href="mailto:info@school.et">Contact Our School</a> opens a new email message addressed to the specified email address. The mailto: scheme can also include subject line, CC, and BCC parameters, such as <a href="mailto:admin@school.et?subject=Grade%2011%20Inquiry&cc=teacher@school.et">Send Inquiry</a>, where spaces in the subject text are encoded as %20.

ETHIOPIAN CONTEXT

Ethiopian Curriculum ContextThis content is assessed in the Grade 11 national examinations. Ethiopian examples, data, and contexts are integrated throughout each section.

KEY CONCEPTS

Core TopicsHTML, CSS, website design principles, hyperlinks, forms, web publishing.

How to Use This UnitWork through the sections in order. Master the Key Vocabulary before the main content. Attempt each Worked Example independently before checking the solution. Complete the Interactive Tools and Assessment sections to consolidate your understanding.

EXAMPLES

Example: HTML Links in Practice <!-- External link opening in new tab --> <a href="https://www.ethiotelecom.et" target="_blank">Ethio Telecom Website</a> <!-- Relative link within same site --> <a href="about-us.html">About Our School</a> <!-- Image as a link --> <a href="https://www.moe.gov.et"> <img src="moe-logo.png" alt="MOE Logo"> </a> <!-- Email link --> <a href="mailto:info@mymarian.school">Contact MyMarian Platform</a>

## TEXTBOOK CONTENT (authoritative)
4.4. HTML Links
HTML links are used to navigate from one webpage to another or from one part
of a webpage to another. The links could come in the form of text or images and
are normally known as hyperlinks. Hyperlinks can easily be distinguished by the
hand symbol that the mouse cursor is turned to when the mouse is hovering over
the hyperlinks.
4.4.1 Links to other Pages
The anchor tag (<a>) is used to create hyperlinks. An HTML element that is formed
from an anchor tag has the following format:

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 88
<a href =”URL”> clickable text </a>
This is the anchor tag.
<a href = <a href = <a href =
href is the attribute
that the URL of the
destination web-
page is assigned to.
URL > clickable text </a>
URL stands for
Uniform Resource
Locator. It is used to
reference the address
of the linked web-
page.
> clickable text </a> > clickable text </a>
This is the part of the
hyperlink that will
be visible to the user
when the webpage is
displayed on the web
browser. When this is
clicked, the user will
be redirected to the
given URL.
The example in Figure 4.9 shows how a link to Google is created and what the
hyperlink looks like when it is displayed on the web browser.
HTML Code Output on the
Web Browser
<a href=”http://www.google.com”>Google</a> Google
Notes
 Note that it is only the clickable link that is displayed when the webpage
is displayed on the browser. If the user clicks on Google, the user is
moved to Google’s webpage. That is because the URL of Google is
given as a value to the href attribute.
Another important attribute of the anchor tag is the “target” attribute. The value of
the “target” attribute determines where the linked document is displayed. See the
following table for the meaning of each value of the “target” attribute.
Table 4.3 The “target” attribute and its values
Value Meaning
_self The webpage is displayed in the same window/tab. (Default)
_blank The webpage is displayed on a separate window/tab.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 89
Activity 4.8
1. Using Notepad, create an HTML document that has links to Ethiopian
Airlines, ethio telecom, and Commercial Bank of Ethiopia using the
following URLs:
https://www.ethiopianairlines.com
https://www.ethiotelecom.et
https://www.combanketh.et
2. Modify the HTML code you just created above so that the pages are
displayed in a new tab.
In addition to texts, images also can be used as links that users can click on to go
to a specified webpage. To use images as a link, simply embed the image element
inside the anchor tag.
HTML Code Output on the
Web Browser
<a href=”http://www.google.com”
target=”_parent”>
<img src=”google.png”>
</a>
Notes
 Note that the image element is placed between <a> and </a>. Also
note that a relative URL, as opposed to an absolute URL, is used to
reference the “google.png” image. The assumption in the way the URL
is given is that the image and the current webpage are found under the
same folder.
 Absolute URL: is a URL that includes every element of a URL such
as the protocol, the hostname, as well as path of the webpage. In other
words, it will have a form such as this:
http://www.somewebsite.com/somefile.html
 Relative URL: is a path given relative to the location of the current
webpage. Example: somedirectory/somefile.html

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 90
Activity 4.9
• Redo the first question of Activity 4.8 using three images as hyperlinks.
4.4.2 Links to Page Sections
Hyperlinks can be created not only to establish links to other pages, but also to
different parts, or sections of the same page. This is especially useful in a webpage
that has a large size content. Readers can easily go to different sections of the page
without having to scroll up and down.
To create such types of links, the <a> tag is used in two different ways: in
designating names to specific locations and in creating links to the locations from
other places on the same page. While the “name” attribute is used to designate a
name to a location, the “href” attribute is used to create links to the locations. See
the following example.
<h3>Section One
<a name=”section_one”></a>
</h3>
.
.
.
.
<a href=”#section_one”>Go to section one</a>
The HTML element you see at the bottom of the above code creates the Go to
section one link. If this link is clicked, the user is moved back to the top of the
webpage. (Note that in order to see this effect the webpage should be long enough
that the link and the top of the document cannot be seen on one screen.)
Notes
 Note also that the way the value to the href attribute is given. The value
is given as the # symbol followed by the name of the section.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 91
Activity 4.10
1. Create three HTML documents in the same folder. Then create a link in
each of the HTML documents to all the others so that one can access all
the pages by simply opening only one of them.
2. Create a webpage that has a content that is grouped into at least three
sections and then create:
a. a link at the end of each section to the top of the document.
b. a link at the beginning of each section to the beginning of all the
other sections. (Note that the top of the document will be the same
as the beginning of section one)
