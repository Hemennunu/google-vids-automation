# ICT_G11_U06_S04 — Types of Programming Languages

Grade 11 ICT (Ethiopian curriculum). Textbook sub-chapter: 6.1 Types of Programming Languages.

## MUST-COVER CHECKLIST (teach every item)
- Types of Programming Languages
- Syntax and Semantics
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
6.1. Types of Programming Languages
Brainstorming 6.1
 How do computers do the types of tasks we observe them doing?
Programming languages are computer languages that are used to write different
types of computer programs. They are generally grouped into machine language,
assembly language, and high-level language.
6
UNIT FUNDAMENTALS OF
PROGRAMMING

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 133
6.1.1 Types of Programming Languages
Machine Language
Machine language is a low-level computer language. It is a language in which
everything including instructions, numbers, and memory locations are represented
in 1s and 0s – binary system. Machine language is the language that computers
understand directly without any need for translation. That is why it is very fast and
uses memory efficiently. However, writing programs in machine language is very
difficult.
Assembly Language
Assembly language is also a low-level computer language but, instead of 1s and
0s, it uses symbols known as mnemonics. Though it is easier than using a binary
system, assembly language is still difficult.
Since computers do not directly understand any program outside the machine
language, programs that are written in assembly language require a special type of
software. This software is known as Assembler, and it is used to translate assembly
language instructions into machine language.
High-Level Language
High-level languages are closer to human languages compared to both assembly
and machine languages. This type of language allows programmers to focus more
on the problem they want to solve than on the programming language. Examples
of high-level programming languages include C, C++, Java, C#, Python, Perl, and
Ruby.
Just like assembly language programs, high-level language programs also cannot
be directly executed by the computer. The programs have to be first translated
into a machine language using translator software. Depending on the programming
language, the translator software can be either a Compiler or an Interpreter.
Compilers translate high-level language written programs all at once into machine
language. The machine language is then executed by the computer. Examples of
programming languages that use compilers are C, C++, Java, and C#.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 134
Interpreters, on the other hand, translate and execute programs a statement at a
time. They don’t translate the whole program together as do compilers. Examples
of programming languages that use interpreters include Python, Perl, and Ruby.
6.1.2 Syntax and Semantics
Like any human language, all programming languages have syntax and semantics.
Syntax refers to the rules of the programming language. It defines the structure or
grammar of the language that programs should strictly follow. The semantics of a
programming language, on the other hand, is related to the meaning of elements of
a program and what they do.
A program must be written with the correct syntax dictated by the programming
language for the program to be executed by the computer. If a program violates any
of the syntax rules of a language, the compiler or the interpreter produces an error
message. Such type of error is known as a syntax error.
A program can have no syntax error and get executed properly but can still behave
in a way different from what it is intended to. This kind of error is known as logic
error and is associated with the semantics of a language. Since compilers or
interpreters do not catch logic errors, they are far more difficult to identify and fix
than syntax errors.
Links
See Section 6.2 for practical examples of syntax and logic errors.
Activity 6.1
1. Compare and contrast the three types of programming languages.
2. Why are logic errors more difficult to fix than syntax errors?
