# ICT_G12_U06_S06 — Comments and the Python Interpreter

Grade 12 ICT (Ethiopian curriculum). Textbook sub-chapter: 6.2 Comments in Python.

## MUST-COVER CHECKLIST (teach every item)
- Comments
- Although triple-quoted strings
- as the Python Virtual Machine
- Python
- interpreter
- Bytecode interpretation
- PVM
- Script mode
- Several IDEs
- Thonny
- PyCharm

## LMS LESSON (authoritative)
LEAD

Two essential aspects of working with Python that every programmer must understand are how to annotate code with comments and how the Python interpreter processes and executes source code. These topics bridge the gap between writing code that merely works and writing code that is maintainable, understandable, and professionally crafted. While comments serve the human reader of your code, the interpreter is the engine that brings your code to life on the machine.

PARAGRAPHS

Comments are descriptive texts that exist in program source code but are ignored by the compiler and interpreter. They are not executable statements and have no effect on the program's behaviour. Instead, comments serve the human reader: they explain what each part of the program is doing, document the purpose of variables and functions, and provide context for complex algorithms. In Python, single-line comments begin with the hash symbol (#). Everything after the # on that line is ignored by the interpreter. Multi-line comments can be created by placing a # at the start of each line, or by using triple-quoted strings (""" """) that span multiple lines. Although triple-quoted strings are technically strings rather than comments, they are commonly used as documentation strings (docstrings) to describe the purpose of functions and modules.

Comments are also valuable during the debugging process. By temporarily commenting out sections of code, you can isolate problematic areas and test whether a particular block is causing an error. IDLE, Python's integrated development environment, provides convenient features for commenting and uncommenting regions of code through the Format menu or using the shortcut keys Alt+3 to comment out and Alt+4 to uncomment.

Python is an interpreted programming language, although compilation is a step in the Python interpreter process. The interpreter is the program that is responsible for executing each line of statements sequentially and running the Python code or script. When you write and save a Python program with the extension .py, the interpreter first compiles your source code into a format called bytecode, which is usually stored in a file with the extension .pyc. This compilation is a simple translation process that converts your human-readable Python code into an intermediate representation that is more efficient for the machine to process. Following compilation, the bytecode is loaded into the Python runtime and interpreted by a component known as the Python Virtual Machine (PVM). The PVM reads each instruction in the bytecode one by one and executes whatever operation is indicated. Bytecode interpretation is automatic, and the PVM is simply part of the Python system installed on your computer. The PVM is the component that truly runs your scripts; running your program is the final step of what is called the Python interpreter process.

Python can be used in two modes: interactive mode and script mode. In interactive mode, you type Python commands directly into the Python shell (identified by the >>> prompt), and each command is executed immediately. This mode is useful for testing small snippets of code, experimenting with new functions, and learning the language. In script mode, you write an entire program in a file with the .py extension and then run the entire file as a single unit. Script mode is used for developing complete applications.

Several IDEs are available for Python development, each with its own strengths. IDLE (Integrated Development and Learning Environment) is the default IDE that comes with Python installations and is perfectly adequate for beginners. It provides a simple editor, syntax highlighting, and a built-in debugger. Thonny is another IDE designed specifically for beginners, offering a clean interface and a step-by-step debugger that visualises how variables change during execution. PyCharm is a more advanced IDE used by professional developers, offering powerful features such as code completion, refactoring tools, and version control integration. Visual Studio Code (VS Code) has become one of the most popular code editors for Python development, with extensions that provide debugging, linting, and virtual environment management.

ETHIOPIAN CONTEXT

🌍 Ethiopian ContextPython has been adopted as the primary programming language for the Ethiopian high school ICT curriculum, making it one of the most widely taught programming languages in the country. This official endorsement has created a large and growing community of Python learners and practitioners across Ethiopia. The availability of free tools such as IDLE, Thonny, and VS Code means that any student with access to a computer can begin programming without any financial investment. This democratisation of programming education is a key factor in Ethiopia's strategy to develop a skilled technology workforce capable of competing in the global digital economy.

## TEXTBOOK CONTENT (authoritative)
6.2. Comments in Python
Brainstorming 6.4
 Have you ever noticed a comment in a program so far? What is its
purpose?
Comments are descriptive texts that exist in program source code and are ignored
by a compiler and interpreter. Comments are not executable statements or part of
the program. Using comments, a program can make code more readable for other
developers as it provides some information or explanation about what each part
of a program is doing. Depending on the purpose of your program, comments can
serve as notes to yourself or reminders.

I nformatIon technology grade 12 ~ Student textbook 187
In python, comments are denoted by the hash symbol (#). Anything after the #
symbol is ignored by the interpreter (See the above example program code with the
# symbol). Comments can be given in a single line or may take multiple lines. In
any case, all comment lines should start with the special character (#). In general,
you can use comments to describe your program code, to make the code more
readable, or to prevent the execution of some parts of the code while testing the
code. Examples of each are given below.
Creating comment: In Python, comments start with a hash symbol (#), and the
Python interpreter ignores them.
Figure 6. 24 Illustration of Comments in Python Script
In the above example, the two comments (i.e. ones that start with #) are ignored
while executing the program.
Commenting part of the code: Comments can also be used to comment out parts
of the code that you do not want to execute while compiling or running a program.
The program in the following example has two fragments of code. The second
fragment of code (next to line pi = 3.14) is commented out to prevent that part of
the code from execution. IDLE provides features to comment out (uncomment)
parts of code in your source program.
Figure 6. 25 Illustration of Commenting out Part of Code

I nformatIon technology grade 12 ~ Student textbook 188
Commenting in IDLE: In IDLE, commenting features are found under the
‘Format’ menu. Select part of the code you want to comment out, then click on the
‘Format’ menu, and from the list, select ‘Comment Out Region’, or you can use the
short cut key ‘Alt+3’. In order to uncomment, select the part of code you want to
uncomment. Then click on ‘Format’ menu, and from the list, select ‘Uncomment
Region’, or you can use short cut key ‘Alt+4’.
To comment out
Select part of code
Click on Format
menu
From the list, select
Comment Out region
or use Alt+3
Figure 6. 26 Illustrate Commenting Tool in IDLE
Figure 6. 27 Illustrates the First Part of the Code Commented out

I nformatIon technology grade 12 ~ Student textbook 189
Activity 6.18
1. Comment on the second part of the program in the above figure and run
the program. Then, write the output.
2. Uncomment the first part of the program in the above figure and run the
program. Then write the output.
3. Add comment that describes the second part of the program.
When you experience errors after writing new lines of code, then you might
comment on a few of them to see if you can troubleshoot the precise issue.
