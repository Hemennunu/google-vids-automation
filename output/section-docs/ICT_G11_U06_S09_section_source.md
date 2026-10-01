# ICT_G11_U06_S09 — Iteration (Loops)

Grade 11 ICT (Ethiopian curriculum). Textbook sub-chapter: 6.5 Writing a Simple Program.

## MUST-COVER CHECKLIST (teach every item)
- Interpreter
- Compiler
- Machine Language
- Assembly Language
- Statement
- Syntax
- Operator
- Semantics
- IDLE shell
- The sum
- The product
- The average value
- Iteration
- Python
- Python programs
- Variables in Python
- Variables
- Functions
- Lists
- Items

## LMS LESSON (authoritative)
LEAD

Python is a high-level, interpreted, general-purpose programming language designed for readability and simplicity. Created by Guido van Rossum and first released in 1991, Python has become one of the most widely used programming languages, particularly in data science, artificial intelligence, web development, and automation.

PARAGRAPHS

Python programs are executed line by line by the Python interpreter. This interpreted nature makes Python highly interactive: students can test code snippets immediately in the Python shell (REPL: Read-Evaluate-Print Loop) without the compile-link-run cycle required by languages like C++. Variables in Python are dynamically typed: their type is determined at runtime and can change. Fundamental data types include int (whole numbers: 5, -100), float (decimal numbers: 3.14), str (strings: "Hello"), and bool (True or False). Variables are assigned using the = operator: age = 16; name = "Abebe"; gpa = 3.75.

Arithmetic operators perform calculations: + (addition), - (subtraction), * (multiplication), / (division, always returns float), // (integer division), % (modulo/remainder), ** (exponentiation). Comparison operators return boolean values: == (equal), != (not equal), < > <= >=. Logical operators combine boolean expressions: and, or, not.

Control flow structures determine execution order. The if-elif-else statement executes different code blocks based on conditions. Indentation (4 spaces) is mandatory in Python and defines code blocks. For loops iterate over sequences: for i in range(10): print(i) prints 0 through 9. While loops repeat while a condition is true. Functions are defined with def: def calculate_area(length, width): return length * width. Functions promote code reuse and modularity.

Lists are ordered, mutable sequences: fruits = ["mango", "banana", "avocado"]. Items are accessed by zero-based index: fruits[0] returns "mango". Dictionaries store key-value pairs: student = {"name": "Tigist", "grade": 11, "score": 85}. Python is the primary language for data science, with NumPy for array operations, Pandas for tabular data, Matplotlib and Seaborn for visualisation, and Scikit-learn for machine learning — libraries used by data professionals worldwide.

## TEXTBOOK CONTENT (authoritative)
6.5. Writing a Simple Program
Programs normally accept input and process the input to produce an output. As
shown in the preceding sections, the print() function is used to produce output
on the IDLE shell. As shown in multiple examples in the preceding sections, the
print() function has the following syntax:
print([value])
A function is a piece of code that performs some task and is called by its name. It
can be passed data as input to operate on, and can optionally return data as output.
print(), input() and type() are examples of functions.
In the above syntax, the name of the function is print. The value that is given to the
print() function as input can be any type of expression that evaluates to some value.
See the example in Figure 6.9 for the different types of values that the print()
function can take as input.
Notes
 A function is a piece of code that performs some task and is called
by its name. It can be passed data as input to operate on, and can
optionally return data as output. print(), input() and type() are examples
of functions.
 In the above syntax, the name of the function is print. The value that is
given to the print() function as input can be any type of expression that
evaluates to some value.
 See the example in Figure 6.9 for the different types of values that the
print() function can take as input.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 152
Python script Output on the
IDLE Shell
x=6.5
print(5)
print(x)
print(x*5)
print(”This is a string”)
To accept input from the keyboard, the input() function is used. The input() function
has the following syntax.
variable_name=input([prompt])
Notes
The following points are important to understand how the input() function works:
 The prompt that is given as input to the input() function is a string that
tells the user what kind of value the user is expected to enter. Example
“Enter an integer number”
 After the user enters a value and presses the enter key, the input()
function returns the value the user entered as str type. This means that
irrespective of the type of value that the user enters, the value that
the input() function returns is of str type. Therefore, if the value that
is required is of another type, the str type should be converted to the
required type.
Example:
x=input(”Enter an integer number”)
x=int(x)
 The value the input() function returns should be assigned to a variable.
This indicates that when the input() function is used, it is used as an
expression in an assignment statement.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 153
Activity 6.8
• Write a program in the text editor that has the following elements:
° Accept the name, age, and Body Mass Index (BMI) of a person
from the keyboard using the input() function,
° Convert the values to their appropriate data type , and
° Display the values using the print() function.
The following example demonstrates how the input() and the print() functions are
used in a program. It shows how the input() function is used to accept data from the
keyboard, and how the print() function is used to display the result on the screen.
The program simply accepts the radius of a circle from the user and displays the
area and circumference of the circle.
Python Script
PI=3.14
x=input(”Enter the radius:”)
radius=float(x)
area=PI*radius**2
circumference=2*PI*radius
print(”The area of the circle is:”)
print(area)
print(”The circumference of the circle is:”)
print(circumference)
Output on the IDLE Shell

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 154
Notes
The following points are important to note regarding the program shown in
 The prompt given to the input() function should be written in a manner
that helps the user clearly understand what to do.
 The data type of the value that is returned by the input() function is
changed to float, which is the right data type for values like the radius
of a circle.
 print() function displays its outputs in separate lines. Therefore, the
strings and the values are displayed each on a separate line.
In the example a print() function is used to display each
output separately. However, if multiple values are required to be displayed in one
line, the values should be given to the print() function with comma separation. See
Python Script
PI=3.14
x=input(”Enter the radius:”)
radius=float(x)
area=PI*radius**2
circumference=2*PI*radius
print(”The area of the circle is:”, area)
print(”The circumference of the circle is:”, circumference)
Output on the IDLE Shell

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 155
Notes
 the string literal values and the variables are
given to the print() function with comma separation. As a result, the
results are displayed in one line.
Activity 6.9
1. Write a program that accepts two numbers from the user and displays
the product on the screen.
2. Write a program that displays the BMI of a person by accepting the
weight and height from the keyboard.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 156
Unit Summary
In this unit, you have learnt about:
• what is meant by a computer program
• the three types of programming languages, namely, machine language,
assembly language, and high-level language
• translation software, such as Assembler, Compiler, and Interpreter
• the difference between compilers and interpreters
• the concept of syntax and semantics in programming languages, and the
associated error types
• what the high-level programming language called Python is
• how to write Python scripts using the interactive interpreter and the text
editor
• how to save Python script files and how to run the scripts
• the concept of variables and data types in Python
• valid and invalid identifiers
• the basic built-in data types
• assigning values to variables using an assignment operator
• operators, such as arithmetic operators (+, -, /, //, %, *, **), Boolean
operators (and, or, not) and assignment operator (=)
• conversion of values from one data type to another using explicit and
implicit type conversion methods
• the concept of statements and expressions in Python
• the differences and relationships between statements and expressions
• how to write a simple program by reading data from the keyboard using
the input() function and displaying results using the print() function

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 157
Key Terms
Assembler is a software used to translate programs written in assembly
language into machine language.
Assembly Language is a low-level programming language that uses symbols/
mnemonics.
Assignment Operator (=) is an operator used to assign values to variables.
Binary System is a system in which everything is represented in terms of 1s
and 0s.
bool is a data type that represents True or False values.
Data type specifies the type of values a variable can have and the operations
defined on the values.
Explicit type conversion is a data type conversion done by the programmer
using built-in functions.
Expression is what the Python interpreter evaluates to a certain value.
float is a data type for floating-point numbers.
Floating Point Number is a number with a decimal point.
Function is a piece of code that performs some tasks.
High-level Language is a programming language closer to human language.
Identifier is the name of variables.
IDLE shell is the same as the interactive interpreter.
IDLE stands for Integrated Development and Learning Environment.
Implicit type conversion is a data type conversion done by Python without
the involvement of the programmer.
int is a data type for integer values.
Keywords are reserved words that have predefined meanings in Python.
Machine Language is a low-level programming language that the computer
understands directly.
Assembler

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 158
Program is a set of instructions that commands the computer what to do.
Programmer is a professional who writes computer programs.
Programming Languages are computer languages used to write computer
programs.
Python is a popular high-level programming language.
Python’s Interactive Interpreter contains Python shell to write and execute
Python codes one line at a time.
Python’s Text Editor is a text editor to write unlimited lines of Python codes
that can be saved.
Script file is a file with Python scripts.
Script is codes found in a file saved with .py extension.
Semantics is related to the meaning of elements of a program and what they
do.
Statement is an instruction executed by the Python interpreter.
str is a data type for strings enclosed with a double/single quotation.
Syntax is the grammatical rules of a programming language.
Type conversion is the process of converting values from one data type to
another.
Variable is a computer memory location used to store data.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 159
Review Questions
Part I: Write True if the statment is correct and False if it is incorrect.
1. A program written in assembly language can be directly understood by
the computer.
2. It is only high-level programming languages that have syntax and
semantics.
3. Syntax errors are easier to fix than logic errors.
4. Python’s interactive interpreter can be used to execute multiple lines of
codes at a time.
5. When Python’s text editor is opened, the prompt (>>>) immediately
appears.
6. Once a variable is set to a specific data type, its type cannot be changed.
7. The results of the two expressions 5/2 and 5//2 are not the same.
8. In implicit type conversion, the programmer has to use built-in functions
to convert values from one type to another.
9. The data type “bool” has only two possible values.
10. Expressions and statements are the same things in Python.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 160
Part II: Match the items given under column B with associated items in
column A
A B
1. Rules of a language
2. A keyword such as str
3. Name of variables
4. That which is evaluated to some value
5. Meanings of elements of a language
6. 1s and 0s
7. Interface to work with Python language
8. Mnemonics
9. Translating the whole program
10. Translating one line at a time
a. Interpreter
b. Compiler
c. Machine Language
d. Assembly Language
e. Statement
f. Syntax
g. Operator
h. Semantics
i. IDLE shell
j. Identifier
k. Type conversion
l. Data type
m. Expression
Part III: Choose the correct answer from the given alternatives.
1. Which of the following programming languages is the one that is directly
understood by the computer?
A. Assembly Language B. High-level language
C. Machine language D. Python
2. Which of the following is not an example of high-level programming
languages?
A. C++ B. Java
C. Python D. None of the above
3. The operand on the left side of the assignment operator (=) is always:
A. A variable B. String value
C. Integer value D. An expression

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 161
4. Which of the following is a valid identifier?
A. &_x B. _xs.
C. 123 D. print
5. Identify the function that is not used for type conversion purposes.
A. int() B. type()
C. str() D. float()
Part IV: Fill in the blank spaces
1. A programming language that is an example of those that use compilers is
____________.
2. A special type of software used to translate assembly language programs
into machine language is known as _____________.
3. A type of error related to violating the rules of a programming language is
known as ______________.
4. A type of error related to the semantics of a programming language is
known as _____________.
5. The extension with which Python script files are saved by is _________.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 162
Part V: Code Writing
1. Using the print() function, write a program in the text editor that displays
all of the subjects you are taking in the current semester each on a new
line.
2. Write a program in the text editor that does the following:
a. Creates three variables with integer, floating-point number, and
string values.
b. Displays their values and data types. (hint: use the type() function
to know the data types)
3. Write a program in the text editor that does the following:
a. Creates a variable with one type of value.
b. Reassigns the variable to a different type of value.
c. Displays the data type of the variable before and after the
reassignment.
4. Write a program in the text editor that converts the following two string
values into floating-point numbers and displays their product on the
screen.
”4.5” ”30.2”
5. Write a program that accepts two numbers from the user and displays the
following:
a. The sum
b. The product
c. The average value
