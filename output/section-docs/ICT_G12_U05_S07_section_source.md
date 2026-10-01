# ICT_G12_U05_S07 — Network Troubleshooting

Grade 12 ICT (Ethiopian curriculum). Textbook sub-chapter: 5.4 Network Troubleshooting.

## MUST-COVER CHECKLIST (teach every item)
- Basic Network Problems
- Basic Network Troubleshooting Steps
- Network Troubleshooting Tools
- Network troubleshooting

## LMS LESSON (authoritative)
LEAD

A computer network connects two or more computers together to share resources such as printers and scanners, exchange files, or enable electronic communications. When a network fails to function correctly, productivity suffers. Network troubleshooting is the collection of techniques and procedures used to locate, analyse, and resolve issues in a computer network.

PARAGRAPHS

Network problems can manifest in several ways. A complete loss of connectivity means that the computer cannot communicate with any other device on the network or the Internet. Slow network performance results in delays when accessing files or loading web pages. DNS failures prevent the computer from converting domain names such as www.google.com into IP addresses, making web browsing impossible even if the network connection itself is active. Other common issues include cable problems, where the physical cable connecting devices becomes faulty or damaged; connectivity problems where a port or interface is physically down; out-of-range issues with wireless networks; configuration errors; software compatibility problems; and traffic overload when network capacity is exceeded.

The first step in network troubleshooting is identifying the problem. Gather information about the current state of the network using available tools, try to reproduce the problem on a test system, ask users about the errors they have encountered, and identify the symptoms. Next, develop a scenario that could explain the problem. Test your scenario using the tools at your disposal, then formulate a plan of action, implement the solution, verify that the issue has been resolved, and document the entire process for future reference.

Windows operating systems include several command-line tools that are invaluable for network troubleshooting. These are accessed through the Command Prompt (cmd). The following commands provide specific information about network status:

ETHIOPIAN CONTEXT

🇪🇩 Ethiopian ContextIn Ethiopian schools, Internet connectivity challenges are common due to infrastructure limitations and the cost of bandwidth provided by service providers such as Ethio Telecom. Students may experience slow connections or intermittent outages. Understanding network troubleshooting tools empowers students to diagnose whether a problem lies within the school's local network or with the external Internet service. This knowledge is valuable not only for ICT classes but also for everyday use of technology in Ethiopia's evolving digital landscape.

## TEXTBOOK CONTENT (authoritative)
5.4. Network Troubleshooting
Brainstorming 5.4
 What are the possible causes for Internet network disconnection?
Two or more computers connected together to share resources (such printers and
scanners), exchange files, or enable electronic communications make up a network.
A network’s connections to its computers can be made by cables, phone lines, radio
waves, satellites, or infrared laser beams.
The collection of techniques and procedures used to locate, analyze, and fix issues
in a computer network is known as network troubleshooting. Network engineers
and technicians use a logical procedure to fix issues with networks and enhance
network performance.
When you run a network or while working in any system, there are always chances
of failure in the smooth operation owing to technical, physical, or any other faults.
For the uninterrupted running of the system, you need to resolve these raised issues
as soon as possible. Therefore, you need to detect the cause of the problem first
and then fix it. The process of detection, minimization, and resolving the faults that
arise in the network while performing the various day-to-day activities is known as
network troubleshooting.
Because of the variety of network hardware, network configurations, operating
systems, and setups, not all the following information may not apply to your network
or operating system, but it is recommended to check the following common issues
in network troubleshooting
Notes
 Network problems happen when something disrupts the connection
between your computer and the content you are trying to access.

I nformatIon technology grade 12 ~ Student textbook 152
switch failure, modem failure and Wi-Fi router failure
5.4.1 Basic Network Problems
Network problems include slow transmission of data and no connection at all.
The problem can be caused by the following:
Cable Problem: The cable which
is used to connect two
devices can get faulty,
shortened, or can be
physically damaged (See
Connectivity Problem: The port or interface on which the device is connected or
configured can be physically down or faulty due to this the source host can
not communicate with the destination host.

I nformatIon technology grade 12 ~ Student textbook 153
Out of Reach Issue: with wireless networks, the wireless host may be too far from
the access point, or there could be an obstructing object between the access
point and the wireless host.
Configuration Issue: Due to a wrong configuration such as; routing problem, and
other configuration issues, network fault may arise and the services can be
affected.
Software Issue: Owing to software compatibility issues and version mismatch,
the transmission of IP data packets between the source and destination is
interrupted.
Traffic overload: If the link is over-utilized, then the capacity or traffic on a device
is more than its carrying capacity, and due to overload conditions, the
device can start behaving abnormally.
5.4.2 Basic Network Troubleshooting Steps
The first step of solving a network problem is finding the source of the problem.
Network problems are caused by a part of the network you control or outside
your control. We assume that you control your local network and do not control
anything beyond that. The way you solve the problem depends on whether or
not you control the failing part of the network. You can solve the local network
problems by yourself because you control the network. Outside network problems
require help from whoever runs that network.

I nformatIon technology grade 12 ~ Student textbook 154
Activity 5.6
Write the meaning of local network and outside network
• Give an example of a local network and an outside network based
on your context.
• Who manages the outside network in your geographical location?
Network troubleshooting is a repeatable process, which means that you can break
it down into clear steps that anyone can follow.
• Identify the Problem
As discussed earlier, the first step in troubleshooting a network is to identify the
problem. As a part of this step, you should do the following.
o Gather information about the current state of the network using
the network troubleshooting tools that are available to you.
o Duplicate the problem on a test piece of hardware or software, if
possible. This can help you to confirm where your problem lies.
o Ask users on the network to learn about the errors or difficulties
they have encountered.

I nformatIon technology grade 12 ~ Student textbook 155
o Identify the symptoms of the network outage. For example, do
they include complete loss of network connection? Does it slow
behavior on the network? Is there a network-wide problem, or are
the issues only being experienced by one user?
o Determine if anything has changed in the network before the
issues appeared. Is there a new piece of hardware that is in use?
Has the network taken from new users? Has there been a software
update or change somewhere in the network?
o Define individual problems clearly. Sometimes a network can
have multiple problems. This is the time to identify each issue so
that your solutions to one is not bogged down by other unsolved
problems.
• Develop a Scenario
Once you have finished gathering all the information that you can about the network
issue or issues, it is time to develop a working scenario. Sometimes a network
outage occurs because someone tripped on a wire or some other simple problem.
• Test the Scenario
Using the tools at your disposal, test your scenario. If your scenario is that the
network router is defective, try replacing it with another router to see if that fixes
the issue.
Notes
 At this stage, it is important to remember that proving your own
theories wrong does not mean that you have failed. Instead, you return
to step two, develop a new scenario, and then find a way to test that
one.
• Plan of Action
Come up with a plan of action to address the problem. Sometimes your plan can
include just one step. For example, restart the router. In other cases, your plan can
be more complex and take longer, For instance, when you need to order a new part
or roll a piece of software back to a previous version on multiple users’ computers,
you need more steps.

I nformatIon technology grade 12 ~ Student textbook 156
• Implement the Solution
Now you have a plan for fixing the network, it’s time to implement it. There are
some solutions that you may do by yourself, while others may require cooperation
from other network experts or users.
• Verify System Functionality
Make sure that the issue in question has been resolved, but there is also on the
lookout for other issues that may have arisen from the changes that you have made
to the network.
• Document the Issue
Make sure to document each stage of troubleshooting the problem, including the
symptoms that appeared on the network, the scenario you developed, your strategy
for testing the scenario, and the solution you have come up with to solve the issue.
Even if you do not reference this documentation, it may be helpful to other network
technicians, students, or users at your school, home, or organization in the future
and could help to shorten network downtime.
5.4.3 Network Troubleshooting Tools
When it comes to identifying and resolving network issues, you can utilize a variety
of methods. These tools may be built into the operating system of the computer,
available as stand-alone software programs, or available as hardware devices that
you can use to troubleshoot network issues. In this sub-unit, tools that exist in your
operating systems and network maintenance hardware tools are discussed.
5.4.3.1 Command-Line Tools
On Windows PCs, the command prompt can be accessed by searching for it in the
start menu or by typing “cmd” without the quotation marks into the Run
Window.

I nformatIon technology grade 12 ~ Student textbook 157
The following commands can be entered into the command prompt one at a time to
reveal specific information about the network status:
ipconfig — A Windows Transmission
Control Protocol /Internet Protocol
(TCP/IP) utility that verifies network
settings and connections. It can tell
you a host’s IP address, subnet mask,
and default gateway, alongside other
important network information.
ping — A TCP/IP utility that transmits a datagram to another host, specified in the
command. If the network is functioning
properly, the receiving host returns the
datagram. See the fig 5.20 which shows
ping the default gateway which is
192.168.0.1 in this case. Check your
own default gateway and apply ping
command to see the results.
tracert —A TCP/IP utility that determines
the route data takes to get to a particular
destination. This tool can help you to
determine where you are losing packets
in the network, or helping to identify
problems.
nslookup — A domain Name System (DNS) utility that displays the Internet
Protocol (IP) address of a hostname or vice
versa. This tool is useful for identifying
problems involving DNS name resolution.
See Fig 5.22 which shows google dns ip
address (8.8.8.8) with nslookup command.
netstat — A utility that shows the status of each active network connection. This
tool is useful for finding out what services are running on a particular system.

I nformatIon technology grade 12 ~ Student textbook 158
Notes
 In practice, there are many command line tools used for network
troubleshooting for different operating systems including the windows
operating system. You can search online to get, learn and apply different
commands. Those mentioned commands for windows operating
system, are subject to change when you need to apply to another
operating systems like that of Linux/ Unix or Macintosh. Please browse
the equivalent commands based on device own operating system if
any. .
Activity 5.7
Practice the most common network troubleshooting command tools
including; ‘ipconfig’, ‘ping’, ‘tracert’, ‘netstat’ and ‘nslook’ up in the
windows operating system, but do not be limited to these tools.
• Record your results
• You can use Google’s primary DNS server which is 8.8.8.8 to
practice ping command or you can practice the command using
your school Internet default gateway if applicable.
Notes
 You can get your device default gateway from your ipconfig command
practice using cmd. Please also note that the IP address mentioned
above can be changed due to server address changes by their respective
service providers.
In addition to command-line tools, several standalone applications can be used
to determine the status of a network and troubleshoot issues. Some of these
applications include packet sniffer, port scanner, protocol analyzer, Wi-Fi analyzer,
and more.
