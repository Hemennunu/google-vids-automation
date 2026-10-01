# ICT_G12_U06_S09 — Practical Investigation

Grade 12 ICT (Ethiopian curriculum). Textbook sub-chapter: none matched.

## MUST-COVER CHECKLIST (teach every item)
- problem
- Your task
- Once the basic program

## LMS LESSON (authoritative)
LEAD

This section provides a structured practical investigation activity designed to assess your ability to apply the programming concepts covered in this unit. The activity follows a six-step problem-solving methodology that mirrors the approach used by professional software developers. You are encouraged to complete this investigation independently, using only the knowledge you have gained from the previous sections. The problem is set in the Ethiopian context and requires you to write a Python program that performs arithmetic operations and basic data analysis on real Ethiopian population data.

PARAGRAPHS

The Central Statistical Agency of Ethiopia has published population estimates for the nine regional states and two chartered cities. Your task is to write a Python program that analyses this data. Use the following population data (in millions, approximate): Tigray (5.7), Afar (1.9), Amhara (21.1), Oromia (37.0), Somali (5.7), Benishangul-Gumuz (1.1), SNNPR (12.6), Gambela (0.5), Harari (0.3), Addis Ababa (3.8), and Dire Dawa (0.5). Your program should calculate the total national population, the average regional population, the region with the highest population, and the region with the lowest population.

Read the problem statement carefully and identify what the program needs to do. The program must store the population data for all eleven regions, calculate the sum of all populations to determine the national total, compute the average population by dividing the total by the number of regions, find the maximum and minimum population values, and identify which regions correspond to these extreme values. Consider what data structures you will need. In Python, lists are ideal for storing multiple values of the same type. You will need two lists: one for region names and one for population values.

Before writing any code, plan your approach on paper or in comments. The algorithm for this problem proceeds as follows: create a list of region names, create a corresponding list of population values, use the sum() function to calculate the total population, divide the total by the number of regions (using len()) to find the average, use the max() function to find the highest population value, use the min() function to find the lowest population value, determine the index positions of the maximum and minimum values using the index() method, and finally display all results in a clear, formatted output.

Implement your algorithm in Python. Begin with a comment block that describes the program and its purpose. Use meaningful variable names such as regions and populations. Use a for loop if you want to display the data in a tabular format before showing the analysis results. Include comments throughout the code to explain each major section of the program. Use consistent indentation and ensure that all statements are syntactically correct.

Run your program and compare the output with your expected results. The total national population should be approximately 90.2 million. The average regional population should be approximately 8.2 million. The most populous region should be Oromia with 37.0 million, and the least populous should be Harari with 0.3 million. If your output does not match these expected values, use print debugging or trace tables to identify where the computation is going wrong.

Test your program with incorrect data to verify that it handles edge cases gracefully. For example, what happens if a population value is entered as a string instead of a number? What if one region's data is missing? Although this version of the program uses hard-coded values, reflect on how you could modify it to accept user input for each region. Consider how you might use a for loop to accept eleven population values from the user, and how you would validate that the input is a valid number.

Once the basic program is working correctly, extend it with additional features. Add a conditional statement that displays a warning if any region has a population below one million. Modify the program to display all regions with their populations in descending order. Calculate the percentage of the total population that each region represents. These extensions will challenge you to apply loops, conditionals, and formatting techniques in new ways, reinforcing your understanding of the fundamental programming concepts covered in this unit.
