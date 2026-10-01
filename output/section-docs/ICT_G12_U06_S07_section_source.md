# ICT_G12_U06_S07 — Testing and Debugging Programs

Grade 12 ICT (Ethiopian curriculum). Textbook sub-chapter: 6.4 Testing and Debugging Programs.

## MUST-COVER CHECKLIST (teach every item)
- first type
- Syntax errors
- second type
- Logic errors
- Trace tables
- intended logic

## LMS LESSON (authoritative)
LEAD

Once you have written a program, you must test it to verify that it produces the expected output. Unfortunately, programs do not always run correctly on the first attempt. An unexpected problem in a program is called a bug, and the process of identifying, isolating, and fixing these problems is called debugging. Bugs can appear in many forms, and some are far more difficult to fix than others. Understanding the different types of errors and the tools available for debugging is essential for every programmer, whether you are writing a simple calculator or a complex data analysis system.

PARAGRAPHS

Python programmers encounter three main categories of errors. The first type is the syntax error, which occurs when the code violates the grammatical rules of the Python language. A missing colon at the end of an if statement, a misplaced quotation mark, or inconsistent indentation are all examples of syntax errors. When Python encounters a syntax error, it refuses to run the program and displays an error message indicating the line where the problem was found. Syntax errors are usually the easiest type of error to fix because the interpreter clearly indicates what went wrong and where.

The second type is the runtime error, also known as an exception. Runtime errors occur during program execution when the program attempts an operation that is impossible to perform. Common runtime errors include dividing by zero (ZeroDivisionError), trying to convert a non-numeric string to an integer (ValueError), and accessing an index that does not exist in a list (IndexError). Unlike syntax errors, a runtime error may occur only under certain conditions, making it more challenging to reproduce and fix. For example, a program that divides two numbers entered by the user will run successfully unless the user enters zero as the denominator.

The third and most insidious type is the logic error. A logic error does not cause the program to crash, but it produces incorrect results. The program runs from start to finish without any error messages, but the output is wrong because the programmer's reasoning was flawed. For instance, a program that calculates a student's final grade using the wrong formula or that uses > instead of >= in a comparison will produce incorrect results without any warning. Logic errors are the most difficult to find because the programmer must trace through the code manually, checking each assumption against the expected behaviour.

The simplest and most widely used debugging technique is print debugging. By inserting print() statements at strategic points in your code, you can display the values of variables at each stage of execution. This allows you to verify that variables contain the expected values and that the program flow is following the intended path. For example, if a loop is not producing the expected results, you can print the loop variable and the result of each iteration to see exactly what is happening.

A trace table is a manual debugging technique in which you create a table that records the value of each variable as the program executes step by step. For each line of code, you write down the current state of all variables. Trace tables are particularly useful for understanding how loops and conditionals affect the program state, and they are an excellent learning tool for beginners who are developing the mental models necessary for debugging.

Consider a program that calculates the average mark of three Ethiopian secondary school subjects and assigns a letter grade. The intended logic is: if the average is 80 or above, the grade is A; if 70 or above, the grade is B; if 60 or above, the grade is C; if 50 or above, the grade is D; otherwise, the grade is F. A student writes the code but uses > instead of >= in the conditions. A student with an average mark of exactly 80 would not receive an A; instead, the program would incorrectly fall through to the next condition and assign a B. Print debugging or a trace table would reveal that the condition mark > 80 excludes the boundary value of 80 itself, and the fix is to use mark >= 80.

Python IDLE provides a built-in debugger that gives you complete control over program execution. To activate it, select Debug from the IDLE menu bar and then select Debugger. The interpreter displays [DEBUG ON] just before the prompt (>>>), indicating that the debugger is ready. When you run your Python file, the debugger window appears, allowing you to inspect the values of your variables as your code executes. You can set breakpoints by right-clicking on a line of code and selecting Set Breakpoint. A breakpoint is a line of code that you have selected as a place where the interpreter should pause while running your code. Once the program pauses at a breakpoint, you can use the Go, Step, and Over buttons to advance through the code one instruction at a time, observing how the data changes along the way.

ETHIOPIAN CONTEXT

🌍 Ethiopian ContextThe ability to debug programs systematically is highly valued in Ethiopian technology companies and government ICT departments. In a country where many organisations are building digital systems for the first time, software bugs can have serious consequences, from incorrect student grade reports to errors in financial transactions. Programmers who can efficiently find and fix bugs are essential to the success of Ethiopia's digital transformation. By developing strong debugging skills now, you are preparing yourself for the quality assurance standards expected in professional programming environments.

## TEXTBOOK CONTENT (authoritative)
6.4. Testing and Debugging Programs
Brainstorming 6.6
 Why do we need to test a program?
Once you write your program source code, you save the file and run the code to
test whether the desired or expected output is generated. The program sometimes
fails to run correctly because of a bug. A bug is an unexpected problem in your
program. Bugs can appear in many forms, and some are more difficult to fix than
others. Some bugs are tricky enough that you will not be able to catch them by just
reading through your program. Luckily, Python IDLE provides some basic tools
that help you debug your programs with ease. Debugging means, having complete
control over the program execution.
Getting Started Interpreter DEBUG Mode
If you want to run your code with the built-in debugger in Python IDLE, you
need to turn to debug mode feature. To do so, select Debug → Debugger from the
Python IDLE menu bar. In the interpreter, you should see [DEBUG ON] appear
just before the prompt (>>>), which means the interpreter is ready and waiting (See
When you run your Python file, the debugger window appears (See Figure 6.29
below):

I nformatIon technology grade 12 ~ Student textbook 192
Figure 6. 29 Debug Control Window When Debug Mode On
In this window, you can inspect the values of your variables as your code executes.
This gives insight into how your data is being manipulated as your code runs.
Click the following buttons to move through your code:
Go: Press Go to advance execution as normal until a breakpoint is encountered (or
input is requested).
Step: Press Step to see all the internal commands that python uses to execute the
current line and go to the next one.
Over: Press the Over option to see line-by-line execution of the program.
For our purposes, we can use ‘Go’ and ‘Step’ to trace and fix the bug in the following
program. Before running the program, set a breakpoint on a statement that causes
an error in your program.
A breakpoint is a line of code that you have selected as a place where the interpreter
should pause while running your code. To set a breakpoint, right-click on the line
of code that you wish

I nformatIon technology grade 12 ~ Student textbook 193
Figure 6. 30 a breakpoint set to code in the program.
to pause(See Figure 6.30 that Error: Reference source not found). This highlights
the line of code in yellow as a visual indication that a breakpoint is set. You can
set as many breakpoints in your program code as you like. To undo a breakpoint,
right-click the same line again and select Clear Breakpoint.
Now run the program. Then from the
DEBUG control (shown on the left) press
‘Go’. This prompts you to type values for
num1 and num2. Enter the numbers from
the keyboard and press enter.
As shown below.

I nformatIon technology grade 12 ~ Student textbook 194
Now press ‘Step’
from Debug Control
to execute line by
line. This displays
TypeError (highlighted
in yellow). Go to the
source code to fix the
problem by casting the
input to integer.
Then repeat the above
steps to check the bug
is fixed
Activity 6.20
• The following code could generate error if the value for num2 is zero.
Trace and debug the error using python DEBUG control.

I nformatIon technology grade 12 ~ Student textbook 195
Unit Summary
In this unit, you have learnt about:
• program flow control.
• the special purpose of indentation in python.
• types of flow controls in python.
• conditional or branching statements in python – if, if…else, if…elif…
else, if with in/and/or.
• looping or iteration statements in python – for…loop, while…loop, for
loop with range(), break, and continue.
• the purpose of comment in program source code.
• using IDLE commenting features
• steps in the python interpreter process
• testing and debugging program code – Debug Control and breakpoint

I nformatIon technology grade 12 ~ Student textbook 196
Key Terms
Program flow controls - A program flow control refers to the order of
execution of the program’s code. Python implement the flow control of the
program through the sequential statements, conditional statements and loop
statements.
Syntax in a python program - is a set of rules that define how a python
program is written and interpreted.
Indentation - Indentation refers to the spaces at the beginning of a code line.
Unlike other programming languages, python uses indentation to indicate a
block of code.
The number of spaces is up to you as a programmer, but it has to be at least
one.
Conditional statements -are statements in a program where there are points
at which the program decides at runtime whether some parts of the code
should or should not be executed.
Conditional statements -can be implemented by ‘if statement’. Such as
simple if, if…else, if…elif…else, nested…if
Iteration - This is a programming logic to automate repetitive tasks. Repeated
execution of a set of statements is called iteration. Python provides various
versions of for statements and while statements to implement iteration.
Continue -is a keyword which is used with for loop. With the continue
statement, you can stop the current iteration of the loop, and continue with
the next.
Break - is a keyword which is used with for loop. With the break statement,
you can stop the loop before it has looped through all theitems.
Comments - are descriptive texts in program source code that are ignored by
compilers and interpreters. Using comments, programs can make code more
readable for humans as it provides some information or explanation about
what each part of a program is doing or about.
Key Terms
Program flow controls - A program flow control refers to the order of
execution of the program’s code. Python implement the flow control of the
program through the sequential statements, conditional statements and loop
statements.
Syntax in a python program - is a set of rules that define how a python
program is written and interpreted.
Indentation - Indentation refers to the spaces at the beginning of a code line.
Unlike other programming languages, python uses indentation to indicate a
block of code.
The number of spaces is up to you as a programmer, but it has to be at least
one.
Conditional statements -are statements in a program where there are points
at which the program decides at runtime whether some parts of the code
should or should not be executed.
Conditional statements -can be implemented by ‘if statement’. Such as

I nformatIon technology grade 12 ~ Student textbook 197
Interpreter is a special program that executes instructions written in a
programming language. It can either execute the source code directly or
translate the source code in a first step into a more efficient representation,
and execute this code.
A bug is an unexpected problem in your program. Bugs can appear in many
forms, and some are more difficult to fix than others.
A breakpoint is a line of code that you have identified as a place where the
interpreter should pause while running your code.
I nformatIon technology grade 12 ~ Student textbook 197
Interpreter is a special program that executes instructions written in a
programming language. It can either execute the source code directly or
translate the source code in a first step into a more efficient representation,
and execute this code.
A bug is an unexpected problem in your program. Bugs can appear in many
forms, and some are more difficult to fix than others.
A breakpoint is a line of code that you have identified as a place where the
interpreter should pause while running your code.
Interpreter is a special program that executes instructions written in a
programming language. It can either execute the source code directly or
translate the source code in a first step into a more efficient representation,
and execute this code.
A bug is an unexpected problem in your program. Bugs can appear in many
forms, and some are more difficult to fix than others.
A breakpoint is a line of code that you have identified as a place where the
interpreter should pause while running your code.
I nformatIon technology grade 12 ~ Student textbook 197
Interpreter is a special program that executes instructions written in a
programming language. It can either execute the source code directly or
translate the source code in a first step into a more efficient representation,
and execute this code.
A bug is an unexpected problem in your program. Bugs can appear in many
forms, and some are more difficult to fix than others.
A breakpoint is a line of code that you have identified as a place where the
interpreter should pause while running your code.

I nformatIon technology grade 12 ~ Student textbook 198
Review Questions
Part I: Write True if the statement is correct and False if it is incorrect.
1. There are three program logics: sequential, conditional (branching), and
iterative (looping).
2. Indentation in python is used for code readability only.
3. In python, looping can be implemented using for and while statement.
4. The order in which the program code execution is determined is referred
as flow control.
5. In python, we can apply different indentations in a program.
6. Condition (expression) in the conditional statement must evaluate to
either true or false.
7. In while statement, the loop continues as long as the condition is satisfied.
8. A comment is an executable statement.
9. Interpreter can either execute the source code directly or translate the
source code in a first step into a more efficient representation and execute
this code.
10. A bug is a syntax error in your program.

I nformatIon technology grade 12 ~ Student textbook 199
Part II: Match the items given under column B with associated items in
column A
A B
1. Program flow control
2. Bytecode(.pyc file)
3. Breakpoint
4. Indentation
5. Branching statement
6. Nested loop
7. Condition(expression)
8. IDE
9. Read-Eval-Print Loop (REPL)
10. Comment
A. if, if…else, if…elif..else
B. interactive interpreter
C. a>b, a==b
D. writes, compiles, tests
and runs a program
E. line interpreter pauses
while running
F. Loop inside another
loop
G. Order of code execution
H. Indicates block of code
I. Any line preceded by
the hash(#)
J. Python Virtual
Machine(PVM)
Part III: Choose the correct answer from the given alternatives.
1. All are a program flow controls except____.
A. sequential statement B. branching statement
C. looping D. comment
2. The statement range(9) generates a sequence of numbers from_____.
A. 0 to 9 B. 0 to 8
C. 1 to 9 D. 1 to 8
3. One of the following cannot be the condition(expression) of ‘if state-
ment’:
A. a = b B. a !=b
C. a >=b D. a == b

I nformatIon technology grade 12 ~ Student textbook 200
4. Which of the following indentation is not valid in python?
A. if 5:
print(‘five’)
B. if a>b:
print(‘greater than’)
C. if 4 > 5: print(‘false’) D. if a:
print(‘yes’)
5. Compiled source code is stored in_____.
A. .pyc file B. .py file
C. Pvm file D. Compiler
Part IV: Code Writing
1. Use branching statement to write a program that reads student mark, and
determine pass if the mark is greater or equal to 50; otherwise, print fail.
2. Given letters = “ABCDEFGHIJKLMNOPQRSTUVWXYZ”:
a. Write a for loop statement to print a character per line in each
iteration.
b. Repeat the for loop but the character should print in a single line.
3. Write a program based on the following requirements.
a. Prompt the user to input an integer number from the keyboard.
b. Then print all sequences of numbers from 1 to the input number.
c. Display the data type of the variable before and after the
reassignment.
4. Write a program that performs the arithmetic operation (+, -, *,/).
Hint: Ask the user to enter the operation to perform(1 for addition, 2
for subtraction, 3 for multiplication, and 4 for division;Otherwise, print
invalid input.
