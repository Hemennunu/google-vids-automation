# ICT_G11_U06_S06 — Variables and Data Types

Grade 11 ICT (Ethiopian curriculum). Textbook sub-chapter: 6.3 Variables and Data Types.

## MUST-COVER CHECKLIST (teach every item)
- Variables
- Identifier
- Data Types
- Data Type Conversion
- Python
- Python programs
- Variables in Python
- Functions
- Lists
- Items
- Python strings
- Booleans

## LMS LESSON (authoritative)
LEAD

Python is a high-level, interpreted, general-purpose programming language designed for readability and simplicity. Created by Guido van Rossum and first released in 1991, Python has become one of the most widely used programming languages, particularly in data science, artificial intelligence, web development, and automation.

PARAGRAPHS

Python programs are executed line by line by the Python interpreter. This interpreted nature makes Python highly interactive: students can test code snippets immediately in the Python shell (REPL: Read-Evaluate-Print Loop) without the compile-link-run cycle required by languages like C++. Variables in Python are dynamically typed: their type is determined at runtime and can change. Fundamental data types include int (whole numbers: 5, -100), float (decimal numbers: 3.14), str (strings: "Hello"), and bool (True or False). Variables are assigned using the = operator: age = 16; name = "Abebe"; gpa = 3.75.

Arithmetic operators perform calculations: + (addition), - (subtraction), * (multiplication), / (division, always returns float), // (integer division), % (modulo/remainder), ** (exponentiation). Comparison operators return boolean values: == (equal), != (not equal), < > <= >=. Logical operators combine boolean expressions: and, or, not.

Control flow structures determine execution order. The if-elif-else statement executes different code blocks based on conditions. Indentation (4 spaces) is mandatory in Python and defines code blocks. For loops iterate over sequences: for i in range(10): print(i) prints 0 through 9. While loops repeat while a condition is true. Functions are defined with def: def calculate_area(length, width): return length * width. Functions promote code reuse and modularity.

Lists are ordered, mutable sequences: fruits = ["mango", "banana", "avocado"]. Items are accessed by zero-based index: fruits[0] returns "mango". Dictionaries store key-value pairs: student = {"name": "Tigist", "grade": 11, "score": 85}. Python is the primary language for data science, with NumPy for array operations, Pandas for tabular data, Matplotlib and Seaborn for visualisation, and Scikit-learn for machine learning — libraries used by data professionals worldwide.

Python supports several built-in data types that determine what kind of data a variable can store and what operations can be performed on it. The integer data type (int) represents whole numbers without a fractional part, such as 5, -12, or 1024. Integers in Python can be arbitrarily large, limited only by the available memory, which distinguishes Python from many other programming languages where integers have fixed size limits. The float data type (float) represents numbers with a decimal point, such as 3.14, -0.5, or 2.0. Floats can also be written in scientific notation, such as 1.5e4 representing 15000. When performing arithmetic operations that involve a float and an integer, Python automatically converts the result to a float, a process known as implicit type conversion.

The string data type (str) represents sequences of characters enclosed in either single quotes, double quotes, or triple quotes for multi-line strings. Strings support numerous operations including concatenation using the + operator, repetition using the * operator, and indexing using square brackets to access individual characters. Python strings are immutable, meaning that once a string is created, its characters cannot be changed; any operation that appears to modify a string actually creates a new string object. The Boolean data type (bool) represents one of two values: True or False. Booleans are the result of comparison operations such as ==, >, <, and are used extensively in conditional statements and loops to control program flow.

Type conversion, also known as type casting, allows programmers to explicitly convert a value from one data type to another using built-in functions such as int(), float(), str(), and bool(). For example, converting the string "25" to an integer using int("25") produces the integer 25, enabling arithmetic operations on what was previously text. Converting a float to an integer using int(3.9) truncates the decimal part and returns 3, discarding the fractional portion without rounding. Converting a number to a string using str(42) produces the string "42", allowing it to be concatenated with other strings. Python variable naming rules require that names start with a letter or underscore, contain only letters, digits, and underscores, and are case-sensitive, meaning that Score and score are different variables. Reserved keywords such as if, else, while, for, and class cannot be used as variable names. Following the convention of using lowercase letters with underscores between words, such as student_name or total_marks, makes code more readable and maintainable.

EXAMPLES

Example: Variables and Data Types in Python # Integer variable student_count = 45 print(type(student_count)) # Output: <class 'int'> # Float variable average_score = 78.5 print(type(average_score)) # Output: <class 'float'> # String variable school_name = "Addis Ababa School" print(type(school_name)) # Output: <class 'str'> # Boolean variable is_passed = True print(type(is_passed)) # Output: <class 'bool'> # Type conversion examples age_string = "16" age_integer = int(age_string) print(age_integer + 5) # Output: 21 marks_float = 85.7 marks_integer = int(marks_float) print(marks_integer) # Output: 85 (truncated, not rounded)

## TEXTBOOK CONTENT (authoritative)
6.3. Variables and Data Types
6.3.1 Variables
Variables are computer memory locations. They are the means to store data in
computer memory. A variable is used every time user data or intermediary data is
needed to be kept.
In Python, a variable is created along with its value. Values are assigned to variables
using the assignment (=) operator, which has two operands. The operand to the left
of the operator is always a variable while the operand to the right of the operator
is either a literal value or any other type of expression. The following example
demonstrates how a variable named “x” is created with the value 5 in the interactive
interpreter.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 140
The example that follows shows how a variable named “y” is created and assigned to
the result of an expression. The value of “y” would be the sum of 5 and 9, which is 14.
Links
See section 6.4 to learn about expressions in Python.
To see the current value of a variable, you can simply type the name of the variable
and press the enter key in the interactive interpreter. The value will then be displayed
as shown in the following example.
The value 25 that is shown in blue color is the value of the variable y. Moreover, a
variable can be assigned to another value than the one it was previously assigned
to. The following example shows how the value of y is changed from 25 to 30.
6.3.2 Identifier
The name that is given to variables is called an identifier. Identifiers are a string
of one or more characters and have to conform to some rules in Python to be
considered valid. The rules of identifiers are:
• The first character should be either a letter or an underscore ( _ ).
• If the identifier is made up of more than one character, the characters after the
first one should be a letter, number, or underscore.
• An identifier cannot be the same as any of the keywords in Python. See Figure
6.6 for a list of keywords in Python.
• Identifiers are case-sensitive. (For instance, x and X are considered as
different identifiers in Python)

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 141
and del from not while
as elif global or with
assert else if pass yield
break except import print
class exec in raise
continue finally is return
def for lambda try
Notes
 Keywords are reserved words that have predefined meanings in a
programming language.
According to the above rule, the following are valid identifiers:
X
area
area_5
x5
The identifiers given below, on the other hand, are not valid identifiers as they
violate the rules stated above.
1x
*_5
while
X_&
Notes
 The first two identifiers begin with a character that is not allowed. The
third identifier used the name that is considered a keyword in Python.
The last identifier is invalid because its last character is not allowed to
be used in identifiers.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 142
Although meeting the above requirements suffices to define a valid identifier, it is
always recommended to use identifiers that are self-descriptive. Self-descriptive
identifiers are names that express what they are intended to be used for. Using such
types of identifiers makes programs more understandable and clearer.
Activity 6.4
• Identify the valid identifiers and explain why they are so.
a. x
b. 1x
c. _x
d. x*y
6.3.3 Data Types
A data type is a classification that specifies the type of values a variable can have,
and the type of operations defined on the values. Integer (int), floating-point number
(float), string (str), and Boolean (bool) are some of the major built-in data types in
Python.
Notes
 Floating point numbers are numbers with decimal points that
represent real numbers. See Table 6.1 for more on Python operators.
 Built-in data types are data types that are built into the Python
language.
The data type of variables in Python is set when values are assigned to the variables.
If an integer number is assigned to a variable, the variable will be of type int. If a
string is assigned to a variable, the variable then will be of type str. The following
example in the interactive interpreter shows how data types are set to variables
based on the value assigned to the variables.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 143
Notes
 As you can see in the above example, string values should be placed
in quotation marks.
 To learn the data type of a particular variable, the type() function
can be used. Simply write type(variable_name) and press enter. The
interactive interpreter displays the data type of the variable as shown
above. In the above example, the data type of the variable x is int
while the data type of the variable y is str.
The four major built-in data types in Python and their descriptions are given in
Table 6.1. The table also contains the various types of operators that apply to the
respective data types with examples of how the operators are used.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 144
Table 6.1 Data types
Data
Type
Meanings and
sample values
Associated operators Sample expressions
Int Integer numbers
Example:
34
4
56
10
Arithmetic operators
• Addition (+)
• Subtraction (-)
• Division (/)
• Floor Division (//)
• Multiplication (*)
• Modulus (%)
• Exponentiation (**)
float Floating-point
numbers.
Example:
4.5
10.6
100.0
Arithmetic operators
• Addition (+)
• Subtraction (-)
• Division (/)
• Multiplication (*)
• Exponentiation (**)
Str A sequence of
characters en-
closed in a dou-
ble quotation.
Example:
”Hello world”
Concatenation (+)
Bool True or False
values.
Example:
True
False
Boolean operators
• and
• or
• not

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 145
Notes
Note the following points on some of the operators listed in Table 6.1:
 The + operator behaves differently depending on the type of the operand.
When the operands are integer or floating-point numbers, the operator
serves as a normal addition operator known in mathematics. But
when the operands are strings, the operator serves as a concatenation
operator, which combines the strings given to it into one.
 The modulus (%) operator returns the remainder of the division of the
left operand by the right one.
 The floor division also known as integer division (//) operator divides
and returns only the integer value of the quotient. The division (/)
operator, however, generates the exact division result including the
fraction part if any.
 The exponentiation (**) operator raises the left operand to the power
of the right operand.
Variables can be assigned to values of a different data type than the one they
were previously assigned to. Therefore, the value of a variable, as well as
its type, can be changed to something different from what it was first set to
in Python. As you can see in the following example, the variable “x” is first
assigned to a floating-point number. Then it is assigned to a string value
“Hello”. The second assignment results in a change not only in the value but
also in the data type of the variable.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 146
Activity 6.5
• Write the results of the following expressions.
a. 10%2 ________________
b. 2.5**3 ________________
c. 11//3 ________________
6.3.4 Data Type Conversion
Type conversion is the process of converting the value of one data type to another.
Type conversion is of two types in Python: implicit conversion and explicit
conversion.
Implicit conversion is a type of conversion in which Python does the conversion
without the involvement of the programmer. This is usually done to avoid loss of
data. See the following example.
Notes
Note the following points from the above example:
 The data types of x and y are int and float respectively as shown in the
example.
 The variable z is assigned to the value of x+y, and its data type is
automatically set to float. This is because Python always converts
smaller data types (int in this case) to larger data types (float in this
case) to avoid data loss. If the data type of z is set as int, the value that
will be stored in it will not be the correct value.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 147
Explicit conversion is a type of conversion of one data type to another that is done
by the programmer. The predefined functions associated with the different kinds of
data types such as int(), float(), and str() are used for explicit conversion.
The syntax for conversion is given as follows:
<required_dataType>([value])
The following example demonstrates how Python responds to an attempt to add
string and integer variables.
Notes
 As shown in the above example, Python does not allow adding an
integer number with a string. If the numbers stored in the integer and
the string variables are to be added up, an explicit type conversion has
to be used. See the following example to learn how the above error is
avoided using explicit type conversion.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 148
Notes
 As shown in the above example, the code did not generate any error
this time. This is because explicit type conversion is used to convert
the value of y to int type before it is added with the value of x.
Activity 6.6
• Write the expressions used to convert the value 1.5 into integer as well as
string values?
