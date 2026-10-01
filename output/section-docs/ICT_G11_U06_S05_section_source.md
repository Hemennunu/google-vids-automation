# ICT_G11_U06_S05 — Python Basics: Getting Started

Grade 11 ICT (Ethiopian curriculum). Textbook sub-chapter: 6.2 Basics of Python.

## MUST-COVER CHECKLIST (teach every item)
- Using the Interactive Interpreter
- Using the Text Editor
- Python
- Interactive mode
- Script mode

## LMS LESSON (authoritative)
LEAD

This unit covers Programming with Python as part of the Grade 11 ICT curriculum, aligned with the Ethiopian MoE 2023 standard textbook.

PARAGRAPHS

Python is a high-level, interpreted programming language that emphasises code readability and simplicity, making it an ideal language for beginners and professionals alike. Python can be executed in two distinct modes: interactive mode and script mode. In interactive mode, the user types Python commands directly into the Python interpreter, which executes each command immediately and displays the result. This mode is accessed by opening a terminal or command prompt and typing python (or python3 on some systems). Interactive mode is excellent for experimenting with new concepts, testing small code snippets, and performing quick calculations. The Python interpreter displays a prompt, typically >>>, indicating that it is ready to accept a command. Each line entered is executed immediately, making the interactive mode highly responsive for exploration and debugging.

In script mode, Python code is written in a text file with a .py extension, such as hello.py, and then executed as a complete program by passing the filename to the Python interpreter. The command to run a script is python filename.py. Script mode is used for writing complete programs that consist of multiple lines of code, including variables, loops, conditionals, functions, and complex logic. Unlike interactive mode, where each line is executed immediately, script mode compiles the entire program and executes it from start to finish, producing all output at once. For Grade 11 students, writing Python scripts is the standard approach for completing programming assignments, while interactive mode is useful for testing small code fragments before incorporating them into larger programs.

The print() function is one of the most fundamental and frequently used functions in Python. It outputs text, numbers, or the results of expressions to the console, allowing programmers to display information to the user and to debug their programs by printing intermediate values. The print() function accepts one or more arguments separated by commas and displays them separated by spaces by default. Strings passed to print() must be enclosed in either single quotes or double quotes. The function can also include escape sequences such as \n for a new line and \t for a tab, and can be customised using parameters such as sep to specify a custom separator and end to specify a custom ending character instead of the default newline.

ETHIOPIAN CONTEXT

Ethiopian Curriculum ContextThis content is assessed in the Grade 11 national examinations. Ethiopian examples, data, and contexts are integrated throughout each section.

KEY CONCEPTS

Core TopicsPython syntax, variables, data types, operators, conditions, loops, functions.

How to Use This UnitWork through the sections in order. Master the Key Vocabulary before the main content. Attempt each Worked Example independently before checking the solution. Complete the Interactive Tools and Assessment sections to consolidate your understanding.

EXAMPLES

Example: Python Interactive Mode vs Script Mode # Interactive Mode (at the >>> prompt) >>> print("Welcome to Python Programming") Welcome to Python Programming >>> 5 + 3 8 >>> print("Ethiopia", "is", "my", "country") Ethiopia is my country # Script Mode: save as my_first_script.py print("Grade 11 ICT - Python Programming") print("Welcome to MyMarian Platform") name = "Student" print("Hello, " + name + "!") # Run with: python my_first_script.py

## TEXTBOOK CONTENT (authoritative)
6.2. Basics of Python
Python is one of the popular high-level programming languages in use today. It is
widely considered a much easier language to learn. This is one of the main reasons
why it is a widely chosen language for teaching programming to those who are new
to programming.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 135
Python has a free integrated development environment known as IDLE. IDLE stands
for Integrated Development and Learning Environment. To write Python codes, the
interactive interpreter or the text editor of the IDLE can be used. The interactive
interpreter is used to write one line of Python code at a time and is less convenient
to write and execute a large number of codes. Using the text editor, however, any
number of codes can be written and get executed with a single command.
6.2.1 Using the Interactive Interpreter
The Interactive Interpreter contains a Python shell, which is a textual user interface
used to work with the Python language. The Interactive Interpreter is displayed
when the IDLE is opened. Figure 6.1 shows the Interactive Interpreter.
Links
See Section 6.4 to learn about expressions in Python.
Notes
 The >>> is where codes are written and is called the prompt. After
a user writes a code and presses the enter key, the prompt (>>>)
reappears for the user to write the next code.
The following example demonstrates what the Interactive Interpreter does when
the enter key is pressed after a simple expression is written.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 136
Notes
 5+6 is a syntactically valid expression that evaluates to 11. Therefore,
the Python interpreter evaluated the expression and displayed 11. If,
for example, a syntactically invalid expression like 5+ is given, the
interpreter generates the following syntax error:
To display something on the screen, the print() function is used in Python. The
following example shows how a string is displayed using the print() function.
Notes
 Note that the IDLE uses different types of colors for the different
elements of a Python code to make them easily distinguishable. By
default, outputs are displayed in blue color; functions are displayed
in purple color, and strings are displayed in green color. A string is a
sequence of characters placed under quotation marks such as ”Hello
World” as can be seen in the above example. See Table 6.1 for more
on strings and operators in Python.
Links
See Section 6.5 for more on the print() function.
Activity 6.2
• Use the print() function and display your full name on the screen using the
interactive interpreter.
6.2.2 Using the Text Editor
Python codes can be written in a file using the text editor of Python’s IDLE. The
code that is kept in such files is known as a script. A file that keeps Python scripts
is saved with the .py extension and is called a script file.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 137
A script file can be easily created by selecting “New File” from the “File” menu
in the IDLE’s interactive interpreter. Then the text editor is
opened in a separate window, and it looks something like what is.
Notes
 Note that the prompt (>>>) is not shown in the text editor. The >>>
appears only when code is written in the interactive interpreter, not in
the text editor. While only one line of code is written and executed in
the interactive interpreter, as many lines of code as required can be
written in the text editor.
The example is a script that calculates and displays the area of
a circle for a given radius value of 3. Before the script is run/executed, the script
has to be saved with the .py extension by selecting the “save” option from the “file”
menu in the text editor. To execute the script, the “Run Module” option from the
“Run” Menu should be selected. After the script is executed, the output is displayed
in the IDLE shell/interactive interpreter in a format as shown in the figure below.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 138
Python Script Output on the IDLE Shell
Notes
Note the following points from the script shown above:
 There are four statements in the script. However, the script is executed
with a single command.
 There is no prompt (>>>) in the script. The prompt is shown only in
the interactive interpreter.
 Though there are four statements in the script, only one output is
shown in the IDLE shell. This is because it is only the last statement
that produces an output.
 The output of a script written in the text editor is shown in the IDLE
shell or the interactive interpreter.
Links
The * is multiplication operator in Python and ** is exponentiation operator.
Operators are discussed in section 6.3
Links
See section 6.4 to learn about statements in Python.
The example in Figure 6.5 demonstrates a logic error that is related to the semantics
of programming languages.
Python Script Output on the IDLE Shell

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 139
Notes
 Note that the area of a circle in the above example in Figure 6.5 is
incorrectly calculated as “area=PI*radius*2”. The correct formula for
the area of a circle is “area=PI*radius**2”. However, the interpreter
did not generate any error and simply displayed the incorrect output.
This is a logic error: even though the program does not have any
syntax error, it does not produce the intended correct output.
 The * symbol serves as a multiplication operator in Python. Table 6.1
of this chapter has a list of operators in Python and examples of how
they are used.
Activity 6.3
1. What is the difference between Python’s interactive interpreter and text editor?
2. Use the print() function to display your full name on the screen using the text
editor.
