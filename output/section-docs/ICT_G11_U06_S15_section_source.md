# ICT_G11_U06_S15 — 12 Unit Summary

Grade 11 ICT (Ethiopian curriculum). Textbook sub-chapter: Unit 6: 6.1, 6.2, 6.3, 6.4, 6.5.

## MUST-COVER CHECKLIST (teach every item)
- Types of Programming Languages
- Basics of Python
- Variables and Data Types
- Statements and Expressions
- Writing a Simple Program
- Python
- Python programs
- Variables in Python
- Variables
- Functions
- Lists
- Items

## LMS LESSON (authoritative)
LEAD

MyMarian Platform | Addis Ababa | ICT Grade 11 Lecture Notes

PARAGRAPHS

Python is a high-level, interpreted, general-purpose programming language designed for readability and simplicity. Created by Guido van Rossum and first released in 1991, Python has become one of the most widely used programming languages, particularly in data science, artificial intelligence, web development, and automation.

Python programs are executed line by line by the Python interpreter. This interpreted nature makes Python highly interactive: students can test code snippets immediately in the Python shell (REPL: Read-Evaluate-Print Loop) without the compile-link-run cycle required by languages like C++. Variables in Python are dynamically typed: their type is determined at runtime and can change. Fundamental data types include int (whole numbers: 5, -100), float (decimal numbers: 3.14), str (strings: "Hello"), and bool (True or False). Variables are assigned using the = operator: age = 16; name = "Abebe"; gpa = 3.75.

Arithmetic operators perform calculations: + (addition), - (subtraction), * (multiplication), / (division, always returns float), // (integer division), % (modulo/remainder), ** (exponentiation). Comparison operators return boolean values: == (equal), != (not equal), < > <= >=. Logical operators combine boolean expressions: and, or, not.

Control flow structures determine execution order. The if-elif-else statement executes different code blocks based on conditions. Indentation (4 spaces) is mandatory in Python and defines code blocks. For loops iterate over sequences: for i in range(10): print(i) prints 0 through 9. While loops repeat while a condition is true. Functions are defined with def: def calculate_area(length, width): return length * width. Functions promote code reuse and modularity.

Lists are ordered, mutable sequences: fruits = ["mango", "banana", "avocado"]. Items are accessed by zero-based index: fruits[0] returns "mango". Dictionaries store key-value pairs: student = {"name": "Tigist", "grade": 11, "score": 85}. Python is the primary language for data science, with NumPy for array operations, Pandas for tabular data, Matplotlib and Seaborn for visualisation, and Scikit-learn for machine learning — libraries used by data professionals worldwide.

LIST ITEMS

Programming languages range from low-level (machine code, assembly) to high-level (Python, Java). Python is a high-level, interpreted language — ideal as a first programming language.

Compiled languages translate the entire program before execution (faster execution); interpreted languages translate line by line (more flexible, easier debugging).

Python uses dynamic typing — variable types are inferred automatically from assigned values.

Four fundamental data types: int (whole numbers), float (decimals), str (text), bool (True/False).

The input() function always returns a string. Always convert to int() or float() before using for arithmetic.

Arithmetic operators: +, -, , / (returns float), // (integer division), % (remainder), * (power).

Comparison operators: ==, !=, >, <, >=, <=. Return boolean values (True or False).

Logical operators: and, or, not. Combine boolean expressions.

if/elif/else enables conditional execution. Python requires correct indentation for code blocks.

for loops iterate a known number of times (use range()). while loops continue while a condition is True (use when iterations are not known in advance).

Problem decomposition: identify inputs, processing, outputs before writing code. Write pseudocode first.

Three error types: syntax (violates language rules, caught before running), runtime (crash during execution), logical (wrong results, no crash).

## TEXTBOOK CONTENT (authoritative)
6.1 Types of Programming Languages
Brainstorming 6.1  How do computers do the types of tasks we observe them doing? Programming languages are computer languages that are used to write different types of computer programs. They are generally grouped into machine language, assembly language, and high-level language. 6 UNIT FUNDAMENTALS OF

6.2 Basics of Python
Python is one of the popular high-level programming languages in use today. It is widely considered a much easier language to learn. This is one of the main reasons why it is a widely chosen language for teaching programming to those who are new to programming. ## Page 140 

6.3 Variables and Data Types
6.3.1 Variables Variables are computer memory locations. They are the means to store data in computer memory. A variable is used every time user data or intermediary data is needed to be kept. In Python, a variable is created along with its value. Values are assigned to variables using the assignment (=) operator, which has two operands. The operand to the left of the operator is always a variable while the operand to the right of the operator

6.4 Statements and Expressions
A statement is an instruction that the Python interpreter executes. As discussed in the introduction section, instructions are the orders or commands that the computer follows to do something. Assignment and print() statements are the two types of statements that are in some ways mentioned in the previous sections. An assignment statement, for instance, assigns value to a variable while a print() statement displays the value that is given to it. There are several other types of statements in Python including the “if” statement, “while” statement, and “for” statement, which are

6.5 Writing a Simple Program
Programs normally accept input and process the input to produce an output. As shown in the preceding sections, the print() function is used to produce output on the IDLE shell. As shown in multiple examples in the preceding sections, the print() function has the following syntax: print([value]) A function is a piece of code that performs some task and is called by its name. It can be passed data as input to operate on, and can optionally return data as output.
