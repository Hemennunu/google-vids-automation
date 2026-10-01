# ICT_G11_U05_S05 — Preventive Maintenance

Grade 11 ICT (Ethiopian curriculum). Textbook sub-chapter: 5.1 Hardware Troubleshooting.

## MUST-COVER CHECKLIST (teach every item)
- Hardware Troubleshooting Procedures
- Check POST
- Beep Codes
- BIOS Information
- CMOS Error
- Event Viewer
- Application
- System
- Security
- Hardware Problems
- Diagnostic Tools

## LMS LESSON (authoritative)
LEAD

This unit covers Hardware Troubleshooting as part of the Grade 11 ICT curriculum, aligned with the Ethiopian MoE 2023 standard textbook.

ETHIOPIAN CONTEXT

Ethiopian Curriculum ContextThis content is assessed in the Grade 11 national examinations. Ethiopian examples, data, and contexts are integrated throughout each section.

KEY CONCEPTS

Core Topicscomputer components, preventive maintenance, fault diagnosis, repair procedures.

How to Use This UnitWork through the sections in order. Master the Key Vocabulary before the main content. Attempt each Worked Example independently before checking the solution. Complete the Interactive Tools and Assessment sections to consolidate your understanding.

## TEXTBOOK CONTENT (authoritative)
5.1. Hardware Troubleshooting
Brainstorming 5.1
 What do you know about computer hardware troubleshooting and
maintenance?
Hardware troubleshooting is a systematic approach to locating the cause of a fault
in a computer system and solving technical problems. It starts with general issues
and then gets more specific.
5
UNIT HARDWARE
TROUBLESHOOTING
AND PREVENTIVE
MAINTENANCE

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 110
5.1.1 Hardware Troubleshooting Procedures
Hardware troubleshooting is the process of reviewing, diagnosing, and identifying
operational or technical problems within a hardware device or equipment. It aims
to resolve physical and/or logical problems and issues within computing hardware.
On the other hand, software troubleshooting is the process of scanning, identifying,
diagnosing, and resolving problems, errors, and bugs in software.
Computers can malfunction and get damaged if computer users are not aware of
some of the basic procedures for checking hardware problems. Many computer
problems can be solved by checking the following simple hardware problems:
• Check that your computer is plugged into a working power outlet.
• Check that everything is turned on.
• If the computer is on but the screen is blank, there may be an issue with the
connection between the computer and the screen. First, check to see if the
monitor is plugged into a power outlet and if the connection between the
monitor and computer system unit is connected securely.
• Check that the keyboard, mouse, monitor, speakers, etc. are properly plugged
into the computer system. Try a different port to check if it is a port issue, or
change the device if the device is damaged.
Notes
 It is necessary to switch off the computer before undertaking any
hardware maintenance such as removing or replacing computer parts.
5.1.2 Check POST
POST stands for Power On Self-Test. This is part of a computer’s startup program
that is used to diagnose the keyboard, the Random Access Memory (RAM), disk
drives, and other hardware to make sure they are working properly. If the POST
detects any errors in the hardware, it either displays a text error message on the
screen or emits a series of short and long beeps.
If an error message appears as you boot your computer, type the exact error message
and then search on the Internet to find more information about the error.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 111
Activity 5.1
1. If your computer cannot start, what are the preliminary hardware diag-
noses you do to identify and fix the problems?
5.1.3 Beep Codes
Beep codes are sounds emitted by the computer during Power on Self-Test (POST).
Each BIOS manufacturer has a unique beep sequence, a combination of long and
short beeps, for hardware failures. If there is a problem with the computer, listen
for the beep codes when the computer starts. As the system proceeds through the
Power on Self-Test (POST), most computers emit one beep to indicate that the
system is booting properly. If there is an error, you might hear multiple beeps. You
need to document the beep code sequence and search on the Internet to determine
the specific problem. Some of the beep codes and the respective problems are as
follows:
• No beep but the system turns on and runs fine - Under normal
circumstances, most computer systems will beep one short beep when turned
on. If your computer doesn’t produce a beep sound, your “beeper” may have
died out.
• No beep - The power supply is not plugged in or turned on. If not, the power
supply is completely dead.
• Steady, short beeps - The power supply may be bad or the voltages might
be wrong. A replacement would usually be necessary.
• Steady, long beeps - The power supply has gone bad.
• Long, continuous beep - Your Random Access Memory (RAM) sticks may
have gone bad. If there is more than one stick installed, try taking one out
to see if the computer boots. If it does not, try the same thing with the other
stick. This will tell you which stick has gone bad, and you can replace or
upgrade accordingly. If there is only one stick installed, you will need to
replace or upgrade it to fix the problem.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 112
• One long, two short beeps - There has been a video card failure. Your first
action is to try reseating the video card. This often solves the problem when
the computer system is connected to projectors because the VGA/DVI or
Video cable gets moved so often that the card can be slowly unplugged. If
reseating doesn’t work, replace the video card.
5.1.4 BIOS Information
BIOS stands for basic input/output system. BIOS is a program used by a computer
to start the computer system after it is powered on. It also manages data flow
between the computer’s operating system (OS) and attached devices, such as the
hard disk, video adapter, keyboard, mouse, and printer. If the computer boots and
stops after the POST, your computer has a BIOS setting problem. Fixing BIOS
problems requires a good knowledge of computer hardware. Therefore, when you
face a BIOS setting problem, you are advised to contact a computer hardware
technician to solve the problem.
5.1.5 CMOS Error
The CMOS (Complementary Metal-Oxide Semiconductor) is an onboard chip that
stores information ranging from the time and date to system hardware settings;
its primary function is to handle and store the BIOS configuration settings. If a
computer shows a CMOS alert message on the screen, it indicates that the CMOS
battery needs to be replaced. Upon receiving such type of error message, remove
the CMOS battery carefully, and insert a new battery that is exactly the same as the
old one.
Notes
 Replacing a CMOS battery may be more difficult in laptop computers
than in desktop computers. If the user of the computer does not have
sufficient computer hardware troubleshooting experience, leaving the
task to a professional computer technician is advised.
5.1.6 Event Viewer
When system or application errors occur on a computer running Windows, the
Event Viewer is updated with information about the errors. The Event Viewer records the following information about the problem:

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 113
• The problem that occurred
• The date and time of the problem
• The severity of the problem
• The source of the problem
• The event ID number
• Which user was logged in when the problem occurred
The following steps can be followed to launch the Event Viewer:
1. On the Windows Search box, write event viewer
2. A pop-up menu appears which looks like the one
3. Click on Event Viewer
Figure. 5.1 Launching Event Viewer
Events are placed in different categories as shown on the left side of Figure 5.2.
Expand each category to get more information. Each category is related to a log
that Windows keeps on events regarding that particular category. While there are
a lot of categories, the vast amount of troubleshooting you might want to do is
related to the Windows Log category, which contains the following items:
• Application: The Application log records events related to Windows system
components, such as drivers and built-in interface elements.
• System: The System log records events related to programs installed on the
system.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 114
• Security: When security logging is enabled (it is off by default in Windows),
this log records events related to security, such as logon attempts and resource
access.
When you click on Application under Windows log, you get a list of Application
log records events.
If you want to get detailed information about the error, double-click on the error,
and then you get detailed information in the pop-up window. Although the Event
Viewer lists details about an error, you might need to do further searching on the
Internet about the problem to identify an appropriate solution.
5.1.7 Hardware Problems
Many computer problems are caused by hardware failures or problems with
hardware drivers. Windows usually displays notifications about devices that have a
problem. Device Manager is used to check the status of different hardware devices.
The following steps can be followed to identify hardware problems in Windows-
based systems:
1. Click on the Windows search box in the lower-left corner.
2. Type Control Panel.
3. Double-click the Control Panel on the Windows pop-up menu.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 115
4. Click Hardware and Sound.
5. Under Device and Printers, Click on Device Manager
The Device Manager has the following four benefits.
1. It works as a centralized utility from which all the hardware on a system
can be configured.
2. It provides a central and organized view of all hardware- Microsoft
Windows-recognized hardware- installed on a system.
3. It helps to manage all the hardware devices installed on a system. This
includes keyboards, hard disk drives, USB devices, etc.
4. It helps to change hardware configuration options, manage drivers, enable
or disable hardware, identify conflicts between hardware devices, etc.
When you click on the Device Manager on the Control Panel the Device Manager window is displayed. The devices that
have a problem would have an error icon displayed right next to the name of the
device. The operating system flags the devices with an error icon.
• A yellow triangle with an exclamation mark indicates that the device has
a problem.
• A red X means that the device is disabled or removed or Windows can’t
locate the device.
• A downward-pointing arrow means the device has been disabled.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 116
• A yellow question mark indicates that the system does not know which
driver to install for the hardware. This problem will be solved by installing
the appropriate driver software for the device
Activity 5.2
1. Open the Device Manager and check if there is any problem on your
DVD/CD-ROM drives.
2. If you find a yellow triangle with an exclamation mark on one of your
hardware devices, what will you do to solve the problem?
5.1.8 Diagnostic Tools
Diagnostic Tools are software tools that are used to help troubleshoot, diagnose
and solve hardware problems. Manufacturers of system hardware usually provide
diagnostic tools of their own. For instance, a hard drive manufacturer might provide
a tool to boot the computer and diagnose why the hard drive does not start the
operating system.
The top two diagnostic tools are Windows Performance Monitor and Windows
Resource Monitor.
a) Windows Performance Monitor
The performance monitor gives a quick view of vital information about computer
hardware. The computer’s CPU, Memory, Disk, and Ethernet information can be
checked from there. Performance Monitor is used to examine the effects of running
applications in both real-time and by collecting data to check out for later analysis.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 117
For example, to view the Performance Monitor, the following steps can be followed:
1. Press CTRL + ALT + Delete button at the same time.
2. Choose Task Manager, and the window shows that appears in Figure 5.5.r
3. Then click on the Performance tab to see the performance of the CPU and
other devices in the computer.
Notes
 One quick way of reducing the load from the CPU in Windows is
to restart the computer to remove any unwanted temporary files. Make
sure that all files are saved before proceeding with this step.
 The other option is to look for the applications that are using maximum
CPU resources on the Task Manager. If any application shows CPU
usage of almost 100%, disable the application and then start it again.
Activity 5.3
• Open Task Manager and see if any applications are using excessively
large amounts of the computer’s CPU or memory, and if there are any,
disable them.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 118
b) Windows Resource Monitor
Windows Resource Monitor is better suited for tracking CPU, Network, Memory,
and Disk usage. This tool allows to take an in-depth look into which processes are
affecting the CPU, how much memory is being used, the disk activities, and the
network information such as current TCP (Transport Control Protocol) connections,
and which processes are listening on which port.
The following steps can be followed to open the Windows Resource Monitor:
1. On the Windows search box, write Resource Monitor
2. Click on the Resource Monitor, and then the window shows what appears
in Figure 5.6.
Clicking on the CPU tab in the Windows Resource Monitor lists the four sections
namely, Processes, Services, Associated Handles, and Associated Modules. The
processes that are running are shown in black color under the Processes section,
and those that are suspended are shown in blue color while the processes that are
not responding are shown in red color. Upon selection of a specific running process
from the Processes section the related data under the Services, Associated Handles,
and Associated Modules get populated.

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 119
If you find your computer slowing down unexpectedly, take a look at the CPU
column. If an application is taking up a lot of CPU resources, shut down the
application and restart it.
To stop the application
1. Open resource monitor window
2. Right-click on the application
3. Click on End process
If you want to know more about an application, you can follow the following steps
in the Resource Monitor window:
1. Right-click on the name of the application
2. Choose Search online
This opens your default browser displaying the search result of the application on
the default search engine of your browser. Click on the application links and learn
more about the application.
Activity 5.4
1. What do you understand by hardware troubleshooting?
2. If your computer is slow, what will be the possible problem and what
course of action can you take to solve it?

I NFORMATION TECHNOLOGY GRADE 11 ~ STUDENT TEXTBOOK 120
