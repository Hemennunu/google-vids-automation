# ICT_G12_U06_S04 — Program Flow Controls – Conditionals

Grade 12 ICT (Ethiopian curriculum). Textbook sub-chapter: 6.1 Program Flow Controls and Syntax in Python.

## MUST-COVER CHECKLIST (teach every item)
- Conditionals Program Flow Controls
- Price = 135
- What is the output if you write age 15?
- What is the output if the age is 20?
- What if the number 0 is stored in age?
- When do you get the output “You are children”?
- Loops or Iteration Program Flow Controls
- Program flow control
- sequential flow control
- Conditionals
- core idea
- elif keyword
- conditions

## LMS LESSON (authoritative)
LEAD

Program flow control refers to the order in which the code of a program executes. In Python, the flow of a program is regulated by three fundamental constructs: sequential, conditional (branching), and iterative (looping) logic. The sequential flow control is the simplest form, consisting of a list of statements that are executed in the order they are written. Declaring variables, printing output, and reading input from the keyboard are all examples of sequential statements that you learnt in Grade 11. However, sequential execution alone is insufficient for solving most real-world problems, because programs often need to make decisions based on input data. This is where conditional flow controls become essential.

PARAGRAPHS

Conditionals are statements in a program that allow the program to decide at runtime whether some parts of the code should or should not be executed. The core idea is simple: evaluate a condition that is either true or false, and then choose a path of execution based on that evaluation. Python provides several versions of branching statements using the if keyword, each suited to different decision-making scenarios.

Before writing conditional statements, it is important to understand conditional expressions. Conditional expressions use comparison operators to compare two values and return a Boolean result (True or False). Python supports the following comparison operators: == (equal to), != (not equal to), < (less than), > (greater than), <= (less than or equal to), and >= (greater than or equal to). In addition, Python provides the logical operators and, or, and not for combining multiple conditions. For example, the expression age >= 18 and age <= 60 checks whether a person is within the working age range.

The simplest form of a conditional statement is the if statement, which executes a block of code only when the condition is true. The condition must end with a colon, and the statements to be executed must be indented. Consider the following example that checks whether a person's age is valid:

If the user enters a positive number, both print statements execute. If the user enters a negative number or zero, the condition is false and the indented block is skipped entirely.

The if-else statement provides two alternatives: one block executes when the condition is true, and a different block executes when the condition is false. This creates a true binary branching structure. For example, a program that determines whether a number is even or odd can be written as follows:

In this example, the expression num % 2 == 0 is evaluated first. If the remainder when dividing by 2 is zero, the number is even; otherwise, it is odd.

For problems that have more than two possible outcomes, Python provides the if-elif-else construct. The elif keyword is short for "else if" and allows you to chain multiple conditions together. The interpreter evaluates each condition in order, and the first one that is true causes its corresponding block to execute. If none of the conditions are true, the else block executes as a fallback. A classic Ethiopian example is the grade classification system:

This program reflects the Ethiopian grading system used in many secondary schools across the country. The conditions are evaluated from top to bottom: a mark of 85 triggers the first condition and prints "Excellent", without evaluating the remaining conditions.

Conditionals can also be placed inside other conditionals, creating what is known as a nested if statement. This is useful when a decision depends on multiple layers of conditions. For example, a school may want to award a distinction grade only to students who have passed all subjects, and among those, only to students with an average above 90. Care must be taken with indentation when nesting conditionals, as incorrect indentation causes syntax errors.

The logical and and or operators allow you to combine multiple conditions in a single if expression. The and operator returns True only if both conditions are true, while the or operator returns True if at least one condition is true. For instance, a program that checks whether a person should take an umbrella might use if is_raining and is_windy: to recommend a sturdy umbrella only when both conditions are met.

Key Understanding: Conditional statements transform a program from a simple list of instructions into an intelligent system capable of making decisions based on input data. The Ethiopian grade classification example above demonstrates how a few lines of Python can automate a process that would otherwise require manual calculation for each student. As you practise writing conditionals, pay special attention to the colon at the end of each condition line and the consistent indentation of code blocks, as these are the most common sources of syntax errors for beginners.

ETHIOPIAN CONTEXT

🌍 Ethiopian ContextThe grade classification system used in this example is directly applicable to Ethiopian secondary schools, where students receive letter grades based on their average marks. Understanding how to implement such systems in Python prepares you for developing educational management software, student record systems, and other applications that are in high demand in Ethiopia's growing education technology sector.

## TEXTBOOK CONTENT (authoritative)
6.1. Program Flow Controls and Syntax in Python
Brainstorming 6.1
 In what order do instructions in a Python program execute?
A program flow control is the order in which the program’s code executes. In
Python, the flow control of the program is regulated by the implementation of three
types of programming language constructs or program logic, namely sequential,
branching, and loop. The sequential flow control consists of a simple list of
statements that are to be executed in the order given. Everything you learnt about
declaring variables, printing output, and reading input from the keyboard in Grade
11 are sequential statements. In this unit, the implementation of the remaining two
language constructs: conditional and loop flow controls are focused.
Activity 6.1
• Discuss the three types of programming language constructs and
connect them with real-world problems.
6.1.1 Conditionals Program Flow Controls
Brainstorming 6.2
 “If it rains, then I will take an umbrella.” – what type of statement is
this?
In some cases, you may need a program to choose one out of two or more alternatives,
depending on the input given. For example, suppose you design a program that
determines whether the given number is even or odd. An even number is a number
divisible by two without a remainder, whereas an odd number is divisible by two
with a reminder. We can describe the problem with the following mathematical
equation which is called expression in python.
• num % 2 = 0  num is Even, for num any integer number.
• num % 2 ≠ 0  num is Odd, for num any integer number.

I nformatIon technology grade 12 ~ Student textbook 166
A given integer number is either even or odd (i.e. two possible options), but this
can be decided based on the remainder after dividing the number by two. Python
provides conditional or branching statement to implement such solutions. Before
starting conditional statements, it is important to learn conditional expressions in
Python.
Conditional Expression
Conditional expressions are statements that use Boolean operators (such as
AND, OR, NOT) or comparison operators (such as >,<. ≠). Like in mathematics,
comparisons of two values in Python are described with comparison signs used
in mathematics. Table 6.1 below presents comparison expressions in Python and
Mathematics.
Table 6. 1 Conditional Expression
Description Comparisons in Python Comparisons in Math-
ematics
Equals
Not Equals or inequality
Less than
Greater than
Less than or equal to
Greater than or equal to
a == b
a != b
a < b
a > b
a <= b
a >= b
a = b
a ≠ b
a < b
a > b
a ≤ b
a ≥ b
The comparisons in Table 6.1 are also called conditional expressions that correspond
to the Boolean values - true or false. For example, 3==4 results in false (as 3 is not
equal to 4). Note that operators used in python’s expressions are slightly different
from operators used in Mathematics (e.g. == vs. =, != vs. ≠ ). Python conditionals
can be used in several ways, most commonly in ‘if statements’ and loop statements.

I nformatIon technology grade 12 ~ Student textbook 167
Activity 6.2 Work in group
1. Write the python equivalent expression for the following mathematical
equation and determine its output.
a. 21 ≠ 21
b. 97 ≥ 99
c. Price = 135
2. Write a python expression to describe the following statement.
a. Age is less than 12.
b. Student mark is equal to 95.
c. Weight less than or equal to 45.5.
3. What is the output of the following expressions (use python IDE to confirm
your answer)?
a. 19 != 20
b. age = 22 age ==22
c. ‘zenash’ == ‘zehara’
4. What is the difference between height = 2.5 and height == 2.5 in python?
Conditional or branching statements
Conditionals are statements in a program in which the program decides at runtime
whether some parts of the code should or should not be executed. From the earlier
even/odd example, a given integer number can be even or odd, but this can be
decided based on the remainder after dividing the number by two. Therefore, first:
Decide whether (num % 2 == 0) is or is not true.
If it is true, then the number is even.
If it is not, then the number is odd.
The evaluation of the conditions (i.e., num%2==0) is a test that can be checked to
see if it is true or false; as a result, executing one thing when the condition is true,
or something else when the condition is false.
In Python, a conditional statement is written using the if keyword. Like many other
programming languages, Python provides various versions of branching statements

I nformatIon technology grade 12 ~ Student textbook 168
that can be implemented using the if clause: simple if statement, if..else statement,
and if..elif…else statement.
if statement: this is the simplest implementation of a conditional statement that
decides only one part of the program to be executed if the condition is satisfied or
ignored if the condition fails. The condition is an expression that is either true or
false. If the condition (expression) is true, then do the indented statement(s) (See
Evaluation of the expression is either true or false.
If it is true, then the indented statement(s) is or are
executed, otherwise skip the indented statements.
This group of statements is called a block.
Figure 6. 1 Syntax for if…statement
Example – simple if statement
If your input is 1, the expression age>0 (i.e. 1>0) is true. Therefore, the two
indented statements are executed, and they display their contents on the screen.
However, if the input is -1, the expression age>0 (i.e. -1>0) is false. Therefore, the
program ignores the indented statement.
Notes
 The expression (if age>0:) must end with colon(:). Missing colon at
the end of expression is a syntax error.

I nformatIon technology grade 12 ~ Student textbook 169
Activity 6.3
• Based on the example presented under the simple if statement above:
a. What is the output if you write age 15?
b. What is the output if you write age 0? Discuss in pair.
c. What is the output of if the second print statement is unindented?
Discuss in pair.
Notes
 You can have any statement before or after the ‘if statement’ which is
not considered as part of the ‘if statement’ and is executed as normal.
However, the ‘if expression’ must follow at least one statement to be
executed, otherwise it is a syntax error. See Figure 6.2 for syntactically
correct and incorrect if statements.
Example code Output description
No error, empty output
No error, output
Error, if clause must have at least one
statement.
The last statement is not part of ‘if
statement’, so execute as normal.
Figure 6. 2 syntax error in if statement
Activity 6.4
1. Modify age in the example above to check if the age is greater than 18, and
then print ‘You are Adult’
2. The following code has an error. Which part of the code does cause the error?

I nformatIon technology grade 12 ~ Student textbook 170
3. If you type -1 and 1, what is the output of the following program? What do you
noticed about the first and the last statements?
if…else statement: The ‘if...else statement’ provides two alternative statements or
blocks: one following the ‘if expression’ and another following the ‘else clause’.
‘if…else’ allows us to specify two options: one which is executed if a condition is
true (satisfied), and another which is executed if the condition is false (not satisfied)
(See Figure 6.3 below).
if expression :
yes_statement1
yes_statement2
....
else :
no_statement3
no_statement4
....
The interpretation of the syntax is that if the
expression evaluates to true all the yes statements
under expression are executed, and if expression
evaluates to false all the no statements under else
clause are executed.
Figure 6. 3: Syntax for if. else statement
Now let us see an example that makes use of the above if…else syntax. Predict
what the following program prints.
As the value of age is 18, the program outputs the first print statement (See in the
example below that error: reference source not found).

I nformatIon technology grade 12 ~ Student textbook 171
Output:
Figure 6. 4 Implementation of If Else Statement - Code (left) and Output (right)
The ‘if...else statement’ can make a choice between two alternative actions. Thus,
the even/odd problem discussed earlier can be accomplished with the following
python statement:
In the above program, first the expression num % 2 == 0 is evaluated (checked). If
num % 2 is true (condition satisfied), then the statement following (print (num, “is
Even number”) is executed. Otherwise, which means the condition num % 2 == 0
has not satisfied (or false), then the statement following else (print(num, “ is Odd
number”) is executed. Now it is time to learn additional syntax rules in python.
Syntax in a python program is a set of rules that defines how a python program is
written and interpreted. For instance, the expression of an ‘if statement’ must be
followed by a colon (:). Some programming languages require expressions to be
enclosed in parenthesis, but in python it is optional. So in python, “if num % 2 ==
0:” or “if (num % 2 == 0):”, this complies to Python’s syntax rule.
Another important syntax in python is indentation. In Figure 6.3, it is noted that
the ‘yes_statements’ and ‘no_statements’ must be indented. Indentation refers to
the spaces at the beginning of a code line. While in other programming languages
the indentation in code is only for readability, the indentation in Python is very
important.
Python uses indentation to indicate a block of code. For example, if you ignore the
indentation in the example ‘if statement’ above, and begin the yes_statements or

I nformatIon technology grade 12 ~ Student textbook 172
the no_statements without indentation, the code generates an error. Of course, the
number of spaces is up to you as a programmer, but it has to be at least one.
Notes
 Use the same number of spaces in the same block of code; otherwise,
Python gives you an error (See Figure 6.5, the last if statement). These
are important concepts when you write control statements.
It has error, missing
colon(:) at the end of
expression
It has no error, runs
correctly. Enclosing
expression with
parenthesis is
optional.
It has no error; it is
a properly indented
block.
It has an error, the
block is not indented.
It has an error
because of, an
inconsistent
indentation in the
same block.

I nformatIon technology grade 12 ~ Student textbook 173
Figure 6. 5 Illustrate Syntax rules in Python ‘if statement’
Activity 6.5
1. Based on the code in Figure 6.4,
a. What is the output if the age is 20?
b. What if the number 0 is stored in age?
c. When do you get the output “You are children”?
2. A group activity. Write a Python program that read two numbers from
the keyboard and compute division of the first number by the second.
Apply appropriate if statement to check that the second number is differ-
ent from zero, otherwise print division by zero is not allowed. Do in pair
if...elif…else statement: Assume a problem that could have many options to
choose from or require several conditions. For example, you want to develop a
program that will print ‘Excellent, Very Good, Good, Satisfactory, or Fail’ based
on the student mark. In such situations, Python allows you to add any number of
alternatives using an elif clause after an if and before an else clause.
The elif is a keyword in Python to say “if the previous condition(s) are not true,
then try this condition”. The else keyword catches anything that is not caught by
all the preceding conditions. The general syntax for ‘if…elif…else’ is given in

I nformatIon technology grade 12 ~ Student textbook 174
if expression1:
statement1
statement2
...
elif expression2:
statement3
statement4
...
elif expression3:
statement5
statement6
....................
else:
statement7
statement8
...
Figure 6. 6 If…elif…else Syntax in Python
The interpretation of the above syntax is that first, each expression is evaluated
one after the other, and if the expression is found to be true, all statements in that
specific block are executed. Otherwise, if none of the expressions before the last
‘else’ statements are true, the statements under ‘else’ are executed.
The program in Figure 6.7 contains a series of conditions using ‘if…elif…else’ to
determine the status of the age (child, adolescent, adult, and senior adult). Since the
age is 80, it does not match all conditions. Therefore, the statement under ‘else’ is

I nformatIon technology grade 12 ~ Student textbook 175
executed (See the output in Figure 6.7 under the ‘Output’ column).
if…elif…else based program Output
Figure 6. 7 conditional with if…elif…else statement
Another example in Figure 6.8 below demonstrates the application of a series of
conditions using the ‘if...elif…else’ statement to get the type of a variable. type()
which is a function that returns the type of the argument, in our case price. What is
the type of price? It is a floating number. See the output in the right side of Figure
6.8 below.
if…elif…else based program Output
Figure 6. 8 Implementation of If...elif...else Statement - Code (left) and Output (right)

I nformatIon technology grade 12 ~ Student textbook 176
Activity 6.6
1. Replace price =49.5 by the message = “Hello Student”, and the variable
price in all expressions by the message in Figure 6.8 above. Then,
discuss the output of the code.
2. Use appropriate conditional statements to write a Python program that
solves the following problem:
¾ The program should prompt the user to enter her/his average mark in the
last or the current semester and then print excellent, very good, good,
satisfactory or fail based on the evaluation of the mark entered.
¾ What necessary to write the program code?
3. Write a Python program that calculates the four arithmetic operations
(i.e. +, *, - and /).
¾ The program asks the user to enter one of the four arithmetic symbols.
Then:
• It asks the user to enter two integer numbers.
• Based on the operator and numbers entered by the user, calculate
and display the result.
Using ‘and’ and ‘or’ with if…statement: The ‘and’, and ‘or’ keywords are
also used with ‘if...statement’ in Python. The ‘and’ and ‘or’ keywords are logical
operators and are used to combine conditional statements.
‘and’ operator in if … statement:
Output:
Figure 6. 9 and operator in ‘if statement’ - Code (left) and Output (right)

I nformatIon technology grade 12 ~ Student textbook 177
Notes
 Any statement that is preceded by the hash symbol (#) is a comment
and ignored by the Python interpreter. You will learn comments in
Section 6.2.
In Figure 6.9 above, the evaluation of ‘isBodyTemperatureHigh’ and ‘isCoughing’
(i.e.True and True) is True. Therefore, the indented statement following the ‘if’ is
executed.
Activity 6.7
1. Discuss the evaluation of the expression ‘isBodyTemperatureHigh’ and
‘isCoughing’, if the value is True and False (See Figure 6.9 above).
2. Test your response by substituting the value in the program.
3. Replace the ‘and’ operator by ‘or’ and discuss the output
Using ‘or’ operator with if… statement: The ‘or’ operator in Figure 6.10 is used
to combine conditional statements. The three conditional statements compare the
value of mySubject with ‘Physics’, ‘Chemistry’, and ‘Geograpy’. The evaluation
of the ‘if’ expression is True if one of these three conditions is satisfied. Otherwise,
the expression evaluates to False, and in that case, it executes the statement under
the else clause.
Figure 6. 10 Illustrates the use of ‘on’ Operator in if… Statement
Notes
 The ‘subject’ in Figure 6.10 is declared as array of string. An array is
a variable used to store multiple values in one single variable. In the
example, ‘subject’ stores four subject names or values.

I nformatIon technology grade 12 ~ Student textbook 178
Activity 6.8
• What is the output of the program in Figure 6.10?
6.1.2 Loops or Iteration Program Flow Controls
Brainstorming 6.3
 How do you represent 1 to 10 by repeating some pattern?
Most of real-world problems include some action that is repeated several number of
times. For example, consider the program you designed in (Activity 6.6 Question
2) that determines the student’s mark as “Excellent”, “Very Good”, etc. If you
have 50 students in a class, then a more complete program would repeat this status
determination 50 times (i.e. once for each student in the class). A program is often
used to automate such repetitive tasks. A portion of program code that repeats a
statement or group of statements in programming is called loop.
Loops are set of statements that run repeatedly for a fixed number of times, or until
a condition is satisfied. Loop statements control a block of code to be executed
iteratively or until a certain condition fails. Loops are a useful and frequently used
feature in all modern programming languages. Python provides several language
features to make iteration/looping easier. There are two types of loops that are built
into Python: for loops and while loops. In the following section, implementation of
‘for loop’ is discussed and then followed by ‘while loop’ in python.
for loops: The for loop in python is used to iterate over a sequence. For loop in
combination with the Python’s range() function is used for counting in all kinds of
ways (See for loop with range function at the end of this section). The for loop in
python differs a bit from other like C or Pascal. In Python for loop is used to iterate
over the items of any sequence including the python list, string, tuple, dictionary,
etc. It is also used to access elements from a container (e.g. list, string, tuple) using
a built-in function range(). The general syntax of for loop is as follows.

I nformatIon technology grade 12 ~ Student textbook 179
Syntax:
for variable_name in sequence :
statement_1
statement_2
[....]
Figure 6. 11 For Loop Syntax in Python
The description of the above for loop syntax is:
Name Description
variable_name This represents a temporary variable that sets a new
value for each iteration of the loop.
Sequence Sequences are values that can be assigned to a
temporary variable (i.e. variable_name). Values are
provided using a list or a string or from the built-in
function range().
Statement_1, state-
ment_2
[..]
These represents a block of program statements.
Python’s syntax requires this to be indented.
for loop with range() function: The range() function returns a list of consecutive
integers. The sequence of numbers starts from 0 by default, and counts by
incrementing 1(by default), and ends at a specified number. It is widely used count
controlled loops.
Notes
 In the syntax below, the range() function takes one, two, or three
parameters. The last two parameters are optional.
Syntax Example
range(x)
range(x,y)
range(x,y,z)
range(5)generate sequence 0 to 4
range(2,5)generate sequence 2 to 4
range(1,10,2)generate sequence 1,3,5,7,9
Figure 6. 12 Range Function Syntax with One, Two, and Three Parameters
range(x): generates a sequence of numbers from 0 to x, excluding x, incrementing
by 1. Figure 6.13 demonstrates a simple counter program using range(5).

I nformatIon technology grade 12 ~ Student textbook 180
Python script Output on IDLE Shell
Figure 6. 13 Implementation of for Loop with Range - Code (left) and Output (right)
Activity 6.9
1. The above program output is 0 to 4, not 5. Discuss
what the reason is with a partner.
2. Write a program that prompts the user to enter an integer number from
the keyboard and generate a sequence of numbers from 0 to user input.
Hint: use input statement to accept user input, convert the number
to a numeric type, and give as a parameter for the range function.
range(x, y): This generates a sequence of numbers from x to y excluding y,
incrementing by 1. The program in Figure 6.14 uses range to generate a sequence
of numbers from 5 to 8.
Python script Output on IDLE Shell
What is the output?
Figure 6. 14 Implementation of For Loop with Range Function
Activity 6.10
1. Write the output of the above program ( in Figure 6.14) in the space provided.
2. Write a for loop that counts from 51 to 70.

I nformatIon technology grade 12 ~ Student textbook 181
range(x, y, z): This generates a sequence of numbers from x to y excluding y,
incrementing by z. This is different from the above range function in that the
increment is set by the z value ( See Figure 6.15).
Python script Output on IDLE Shell
Figure 6. 15 Implementation of For Loop with Range Function with Three
Parameters - Code (left) and Output (right)
Activity 6.11
1. Write a program that generates a sequence of numbers from 10 to 100,
incrementing by 10.
2. Write a for loop to generate 1, 4, 7, 10, 13, 16, 19, and 22.
for loop in iterable object: Now let us see an example of a for loop in an iterable
object. Unlike the earlier example, the loop iterates while something is true. This
type of loop is called a condition controlled loop.
Python script Output on IDLE
Shell
Figure 6. 16 Implementation of For Loop - Code (left) and Output (right)

I nformatIon technology grade 12 ~ Student textbook 182
The for loop program in Figure 6.16 is condition controlled. The ‘regionalState’
is a sequence that contains a list of regional states. When the for loop is executed,
the first item (i.e. Afar) is assigned to the ‘region’. The ‘region’ is a temporary
variable that actually represents an element in the list. After this, the print statement
executes, and the process continues until we reach the end of the list (i.e. Sidama),
or while there is an element in the list. See the output in Figure 6.16 above on the
right hand side.
Activity 6.12
Write a for loop statement that displays the following list of fruits.
• fruits = [“Mango”, “Orange”, “Banana”, “Pineapple”, “Papaya” ];
Syntax: for variable_name in string
for loop can iterate through string. The string is an iterable object in python because
it contains a sequence of characters. Thus, applying for loop in a string allows us
to access the content character by character.
Python script Output on IDLE Shell
Figure 6. 17 for Loop in a String
In the above program, in each iteration, one character is accessed from the string
value and stored in the letter variable, and printed on the screen. The iteration
continues until the last character (i.e. m) is accessed and printed on the screen.

I nformatIon technology grade 12 ~ Student textbook 183
Activity 6.13
• Write for loop to get your name from the keyboard and print character by
character.
Hint: use input statement to read your name from the keyboard.
break Statement with for: The term break is a keyword in python. With
the break statement, you can stop the loop before it has looped through all the
items:
Python script Output on IDLE
Shell
Figure 6. 18 for Loop with break Statement – Code (left) and Output (right)
In the above program, the loop exits when the value of ‘language’ is ‘Python’.
Activity 6.14
1. Modify the program in Figure 6.17 (for loop in string) above to stop the loop if
the value of letter is white-space.
Hint: use ‘if statement’ to check if letter == ‘ ’
2. What is the output of Figure 6.18 if you replace the ‘if statement’ by if lan-
guage== “HTML”?
continue keyword with for loop: The term continue is a keyword in python.
With the continue statement, you can stop the current iteration of the loop, and it
continues with the next.

I nformatIon technology grade 12 ~ Student textbook 184
Python script Output on IDLE
Shell
Activity 6.15
• Modify the above statement to escape “Java” and “C++” using continue
keyword.
Hint: use the operator to combine the condition if language ==”Java” or
language==”C++”.
while Statement: The while statement in Python supports repeated execution of a
statement or block of statements that is controlled by a conditional expression. The
general syntax for the while statement is:
Syntax:
while expression:
Statement_1
Statement_2
[…]
Note that in python expression must end by
colon(:). Statements under the while must be
indented.
Figure 6. 20 while loop syntax
The while loop runs as long as the condition (expression) evaluates to True
and executes the program block (statement_1, statement_2 …). The expression
is checked every time at the beginning of the loop and the first time when the
expression evaluates to False, the loop stops without executing any remaining
statement(s).

I nformatIon technology grade 12 ~ Student textbook 185
Python script Output on IDLE Shell
Figure 6. 21 Implementation of While Loop - Code (left) and Output (right)
The while loop above prints the value of count as long as the count is less than
5. The last statement (count += 1) is important to increment the value of count at
every iteration and eventually terminate the loop.
Notes
 Don’t forget to increment count(i.e. count +=1 in Figure 6.21);
otherwise, the loop continues forever.
Activity 6.16
• Rewrite the problem described in Activity 6.11 using a ‘while’
statement.
Hint: Set the count to 10, and increments count by 10.
break and continue keywords with while loop: With the break statement, you
can stop the loop even if the while condition is true. It causes the loop to quit even
before reaching the last iteration. The loop in the program below terminates when
the value of count is 5 (in the 5th iteration).
Python Script Output on IDLE Shell
Figure 6. 22 Implementation of While Loop with break Statement - Code (left)
and Output (right)

I nformatIon technology grade 12 ~ Student textbook 186
As you have learned in for loop above, the continue statement, causes the current
iteration to stop, and continues with the next.
Python script Output on IDLE Shell
Figure 6. 23 Implementation of While Loop with continue Statement - Code (left)
and Output (right)
The above program is supposed to iterate 9 times but prints 8 values by escaping
print when the value of count is equal to escape.
Activity 6.17
• If the user input is 8, what is the output of the above ( in Figure 6.23) program?
