# ICT_G11_U04_S08 — HTML Tables

Grade 11 ICT (Ethiopian curriculum). Textbook sub-chapter: 4.5 HTML Tables.

## MUST-COVER CHECKLIST (teach every item)
- Monday
- Tuesday

## LMS LESSON (authoritative)
LEAD

Tables present data in a grid format of rows and columns. Modern web development confines tables to displaying genuinely tabular data — schedules, price lists, comparison charts, statistical data. Tables should NOT be used as a general-purpose layout tool.

PARAGRAPHS

The colspan attribute allows a cell to span across multiple columns — merging several column positions into a single wider cell. The rowspan attribute allows a cell to span across multiple rows. Invaluable for complex tables with merged headers or grouped data. When using spanning, care must be taken to remove the corresponding cells being "consumed" by the span, otherwise the table structure will be corrupted.

LIST ITEMS

— container for the entire table. (table row) — creates a row. (table data) — creates a data cell within a row. (table header) — creates a header cell. Browsers render th cells in bold and centred by default. Should include scope attributes ("col" for column headers, "row" for row headers) for accessibility. — placed immediately after the opening tag; provides a title for the table., , — group rows into a table header, body, and footer respectively.The colspan attribute allows a cell to span across multiple columns — merging several column positions into a single wider cell. The rowspan attribute allows a cell to span across multiple rows. Invaluable for complex tables with merged headers or grouped data. When using spanning, care must be taken to remove the corresponding cells being "consumed" by the span, otherwise the table structure will be corrupted.Example — timetable with colspan:`html Grade 11 ICT Weekly Timetable Day Period 1 Period 2 Period 3 Monday ICT Practical (double period) Mathematics Tuesday English Biology Physics

TABLE ROWS

(table data) — creates a data cell within a row.: (table header) — creates a header cell. Browsers render th cells in bold and centred by default. Should include scope attributes ("col" for column headers, "row" for row headers) for accessibility.

Monday: ICT Practical (double period): Mathematics

Tuesday: English: Biology: Physics

## TEXTBOOK CONTENT (authoritative)
4.5. HTML Tables
An HTML table is used to organize data in terms of rows and columns. Tables are
one way of organizing contents or defining a layout for contents in a webpage. The
major HTML tags used for creating tables and their meanings are presented in the
following table.
Table 4.4 HTML tags used for creating tables
HTML Tags Meaning
<table> Used to define the tables
<th> Used to define table headers
<tr> Used to define table rows
<td> Used to define data cells
The number of rows of a table is determined by the number of <tr> elements that
the <table> has while the number of columns is determined by the number of <td>
elements that are found in each <tr>. The example in Figure 4.5 creates a table with
3 columns and 3 rows.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 92
HTML Code
<table border=1>
<tr>
<th>Mountain Name</th>
<th >Elevation</th>
</tr>
<tr>
<td>Ras Dashen</td>
<td>4,620 m</td>
</tr>
<tr>
<td>Tullu Dimtu</td>
<td>4,377 m</td>
</tr>
<tr>
<td>Guge</td>
<td>4,200 m</td>
</tr>
<tr>
<td>Amba Alagi</td>
<td>3,949 m</td>
</tr>
</table>
Output on the Web Browser
Mountain Name Elevation
Ras Dashen 4,620 m
Tullu Dimtu 4,377 m
Guge 4,200 m
Amba Alagi 3,949 m

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 93
Notes
 Note the following points from Figure 4.11:
• The table has a “border” attribute, which is assigned the value 1.
This adds a border to the table when displayed on the web browser as
shown in the example. If the border attribute is not used, the data will
be displayed in the same way but without a border.
• The information in the table is about some of the mountains found
in Ethiopia.
Activity 4.11
1. Design a table that should look like the following when displayed on the
web browser.
column 1 column 2 column 3 column
4
1 2 3 4
2 4 6 8
3 6 9 12
4 8 12 16
2. Modify the table you designed in the first activity so that the output on
the browser will look something like the one shown below.
column 1 column 2 column 3 column
4
row 1 1 2 3 4
row 2 2 4 6 8
row 3 3 6 9 12
row 4 4 8 12 16
When the layout of the table needs the merging of multiple columns or rows,
“colspan” and “rowspan” attributes can be used respectively. For example, the
HTML code in Figure 4.12 shows how two columns are merged both for the
“Cases” and “Deaths” data cells of the table.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 94
HTML Code
<table border=1>
<tr>
<th></th>
<th colspan=2>Cases</th>
<th colspan=2>Deaths</th>
</tr>
<tr>
<th>Date</th>
<th >Total</th>
<th >New</th>
<th >Total</th>
<th >New</th>
</tr>
<tr>
<td>07/29/21</td>
<td>279,629</td>
<td>3,592</td>
<td>4,381</td>
<td>61</td>
</tr>
</table>
Output on the Web Browser
Cases Deaths
Date Total New Total New
07/29/21 279,629 3,592 4,381 61

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 95
Notes
 Note the following points from Figure 4.12:
• The first <th> of the first <tr> does not have data as shown in the
output.
• As the value given to the “colspan” attribute of the second and third
<th> of the first <tr> is 2, the “Cases” and “Deaths” columns span the
two columns under them.
• The data shown in the table is adopted from World Health Organization
and is about the spread of COVID-19 in Ethiopia.
The “colspan” and “rowspan” attributes can also be used to define the layout of
an entire page. The following HTML code generates a typical page layout with
Header, Sidebar, Content area, as well as Footer using an HTML table as shown in
the output of Figure 4.13.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 96
HTML Code
<!DOCTYPE html>
<html>
<head>
</head>
<body>
<table width=”100%”>
<tr>
<td colspan=”2” height=”100px” bgcolor=”#666666”>
<h1>Website Logo</h1>
</td>
</tr>
<tr>
<td width=”20%” bgcolor=”#cccccc” height=”300px”>
<h3>Sidebar</h3>
</td>
<td width=”80%” bgcolor=”#eeeeee”>
<h3>Content</h3>
</td>
</tr>
<tr>
<td colspan=”2” bgcolor=”#777777”>
Footer
</td>
</tr>
</table>
</body>
</html>

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 97
Output on the Web Browser
Notes
 Note the following points from Figure 4.13(a) and Figure 4.13(b):
• The “width” attribute is given the value 100% so that the table
occupies the entire width of the page.
• “px” stands for pixel.
• The “width” of the first <td> of the second <tr> is assigned 20% so
that the “Sidebar” occupies 20% of the width of the table. 80% of the
width of the table is occupied by the second <td> of the second <tr>.
• “colspan” attribute is used to merge the top and bottom rows of the
table.
Activity 4.12
• Create a table that has the following layout:
• The table should occupy the entire width of the page.
• The width of each of the first and third data cells of the second
row occupies 20% of the width of the table.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 98
