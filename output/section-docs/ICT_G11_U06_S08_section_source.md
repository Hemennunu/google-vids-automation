# ICT_G11_U06_S08 — Conditional Statements: if, elif, else

Grade 11 ICT (Ethiopian curriculum). Textbook sub-chapter: 6.4 Statements and Expressions.

## MUST-COVER CHECKLIST (teach every item)

## LMS LESSON (authoritative)
LEAD

This unit covers Programming with Python as part of the Grade 11 ICT curriculum, aligned with the Ethiopian MoE 2023 standard textbook.

ETHIOPIAN CONTEXT

Ethiopian Curriculum ContextThis content is assessed in the Grade 11 national examinations. Ethiopian examples, data, and contexts are integrated throughout each section.

KEY CONCEPTS

Core TopicsPython syntax, variables, data types, operators, conditions, loops, functions.

How to Use This UnitWork through the sections in order. Master the Key Vocabulary before the main content. Attempt each Worked Example independently before checking the solution. Complete the Interactive Tools and Assessment sections to consolidate your understanding.

## TEXTBOOK CONTENT (authoritative)
6.4. Statements and Expressions
A statement is an instruction that the Python interpreter executes. As discussed in
the introduction section, instructions are the orders or commands that the computer
follows to do something. Assignment and print() statements are the two types of
statements that are in some ways mentioned in the previous sections. An assignment
statement, for instance, assigns value to a variable while a print() statement displays
the value that is given to it. There are several other types of statements in Python
including the “if” statement, “while” statement, and “for” statement, which are
covered in the 12th Grade IT textbook.
The example in Figure 6.7 demonstrates the use of assignment and print() statements
in Python.
Python Script Output on the
IDLE Shell
x=5
y=10
print(x+y)
Notes
 As you can see in the output in Figure 6.7, it is only the print statement
that produces an output. The two assignment statements simply assign
values to the variables and do not produce any output.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 149
Expressions are what the Python interpreter evaluates to produce some value. An
expression could be a simple literal value, a variable, or something more complex
which is a combination of literals, variables, and operators.
Table 6.2 shows the three types of expressions, and how they are used in assignment
and print() statements.
Table 6.2 Types of expressions
Literal value expressions Variable expressions Complex expressions
x=7
y=“Hello”
z=5.5
print(“Python”)
x=y
print(x)
x=4*(y-5)
print(x+5)
Notes
 Note that the expressions in the above table are those encircled with
red.
Using the print() and assignment statements, Figure 6.8 further shows the differences
and relationships between statements and expressions in Python.
Literal value expressions
x=7
y=“Hello”
z=5.5
“Python”
x=y
print(x)
x=4*(y-5)
print(x+5)

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 150
If an expression is typed into the interactive interpreter, the Python interpreter
evaluates and displays the value as shown in the following example.
Notes
 However, if any expression is written in the text editor, it will not be
displayed unless it is put inside the parenthesis of a print() statement.
Therefore, to see the value of expressions on the screen while using the
text editor, the print() function has to be used.
Activity 6.7
1. What is the difference between statements and expressions in Python?
2. Identify the statements from the following list that produce outputs.
x=4*3
y=”Programming in Python is fun”
print(y)
z=x/2
print(z)
y=10
print(type(x))
3. When the code given in activity #2 is executed, what would be the out-
put on the screen?

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 151
