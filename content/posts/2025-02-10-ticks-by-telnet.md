---
date: 2025-02-10
title: 'Ticks by Telnet: Load Testing IBM Z Mainframe Terminals with py3270 and Locust'
template: post
thumbnail: '../thumbnails/square_mile.png'
slug: ticks-by-telnet
categories:
  - Technology
tags:
  - mainframes
  - ibm
  - tech
---

At the stroke of a key, I have dozens of ASCII cows whispering sweet _moos_, load balanced amongst a population of virtual users, vying for their shared time on a mainframe terminal session. A hypnotic scenario, a server 'farm' with bit-tripped bovines chewing the cud on synthetic green screens, evoking The Matrix. But to what end?

![Screenshot from Control (2019)](https://preview.redd.it/im-obsessed-with-the-retro-technology-in-control-i-barely-v0-2tf8smcftdud1.png?width=1920&format=png&auto=webp&s=319bafe2637c50c895dcd8dec2fd94b55aef2e58)

Recall from our [previous adventure]("https://medium.com/theropod/swarming-stressed-servers-open-source-load-testing-on-z-os-mainframes-with-locust-42a1d5e3363e") the need to simulate a high volume of transactions on an IBM Z mainframe. As industry leading machines, these massive computers cannot buckle under the load of millions of concurrent requests and responses, and as mainframe testers it becomes our responsibility to simulate this type of workload to preemptively spot and zap out issues.

In my former tango with Locust, I deployed it for HTTP request testing, as it is well-suited out of the box to handle a large amount of concurrent GET, POST, PUT, and other such methods, submitted to an API endpoint. However, mainframes have several entrypoints to connect and execute functions on - besides HTTP, there are also web interfaces, FTP, SSH, and the classic Telnet protocol. 

The IBM 3270 terminal is what is commonly known as the 'green-screen' terminal, and is the legacy interface for interacting with IBM mainframe software. Predominant z/OS applications such as Interactive System Productivity Display (ISPF) and System Display and Search Facility (SDSF) are only accessible through a 3270 emulator session connected via Telnet.

The following interface is of Telehack.com, a functional emulation of a classic green-screen interface that offers some toy applications - including `cowsay`.

```
Connected to TELEHACK port 121

It is 10:03 pm on Sunday, February 9, 2025 in Mountain View, California, USA.
There are 119 local users. There are 26648 hosts on the network.

May the command line live forever.

Command, one of the following:
  2048         ?            a2           advent       aquarium     basic
  cal          calc         callsign     cat          ching        clear
  clock        date         delta        diff         eliza        factor
  figlet       file         fnord        head         help         ipaddr
  joke         liff         mac          md5          more         morse
  netstat      newuser      notes        octopus      pig          ping
  pong         primes       rainbow      rand         recover      rfc
  rig          roll         rot13        run          salvo        starwars
  sudoku       tail         today        typespeed    units        uptime
  users        uumap        uuplot       weather      when         zc

More commands available after login. Type HELP for a detailed command list.
Type NEWUSER to create an account. Press control-C to interrupt any command.
.
```

The UI of a 3270 application lacks the graphical elements one might expect of a modern application, being built up of text and characters that are transmitted via a terminal, lines and blocks being formed from underlines, bars, and slashes. This has the advantage of producing lightweight programs that can still offer a 'visual' interface, and the learning curve is small for those already comfortable with keyboard based navigation. Instead of entering commands via a text buffer such as in an SSH session, input is accepted at certain coordinates within the display grid. 

Thankfully, modern libraries exist that provide clean APIs for creating a 3270 session, one of which is py3270:
```
from py3270 import Emulator
em = Emulator()

em.connect('3270host.example.com')
em.fill_field(17, 23, 'mylogin', 8)
em.fill_field(18, 23, 'mypass', 8)
em.send_enter()

# if your host unlocks the keyboard before truly being ready you can use:
em.wait_for_field()

# maybe look for a status message
if not em.string_found(1, 2, 'login successful'):
    abort()

# do something useful

# disconnect from host and kill subprocess
em.terminate()
```

Note how specific coordinates are provided to emulator functions such as `fill_field` and `string_found`, in order to make the most of 3270 automation, one must already have an understanding of the positioning of desired elements on the terminal. 

Here's sample code to connect to telehack:
```
em.connect('telehack.com')
em.wait_for_field()
em.send_string("cowsay")
em.wait_for_field()
em.send_string("cowsay hello")
em.save_screen("telehack.html")
em.terminate()
```

Running this script and viewing the generated .HTML will reward us with:
```
.cowsay hello
 _______ 
< hello >
 ------- 
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

Note how the scripting for 3270 is 'step-by-step', with the user waiting for an input field and submitting commands one at a time. Those who are familiar with browser automation such as Selenium WebDriver may feel right at home, as this type of careful puppeteering is necessary when dealing with what is essentially a graphical user interface. I highly recommend manually performing tests to clearly identify the discrete instructions needed before diving into automation.

Now that we've established the 'unit' case, let's return to the promise of Locust - commandeering a swarm of users to rampage on a server, slamming it with requests to emulate hectic real-world scenarios. But if Locust is primarily intended for HTTP/S testing, then where does the classic 3270 fit in?

A peek in the Locust documentation reveals that it "can be extended to test almost any system", and indeed repositories like [locust-plugins](https://github.com/SvenskaSpel/locust-plugins) host extensions that enable FTP, Selenium, Kafka, etc. load testing. 

Since Telnet is just another connection protocol, and we have a handy Python interface to launch 3270 sessions, let's dive right in and extend Locust. By following the lead of the given Locust plugins, we can write a wrapper around the base `User` and create hooks for the connection to be made:

```
class tn3270User(User):
    abstract = True

    def __init__(self, environment):
        super().__init__(environment)
        self.client = tn3270Client(environment=environment)


class tn3270Client:
    def __init__(self, environment):
        self.environment = environment
        self.emulator = None

    def connect(self, user=None, password=None, port=23, timeout=30, trace=False, tracefile=None):
        self.user = user
        self.password = password
        self.port = port
        self.timeout = timeout
        self.tracefile = tracefile
        if trace:
            self.emulator = Emulator(visible=False, timeout=self.timeout, args=["-trace", "-tracefile", self.tracefile])
        else:
            self.emulator = Emulator(visible=False, timeout=self.timeout)
        self.emulator.connect("y:%s:%d" % (self.environment.host, self.port))
```

This `tn3270Client` can now be cleanly invoked by a Locustfile:

```
class DemoTn3270User(tn3270User):
    def on_start(self):
        self.environment.host = "telehack.com"
        self.client.connect()
        self.client.emulator.wait_for_field()
        self.client.string_wait("Type NEWUSER to create an account.")
        self.client.emulator.wait_for_field()
        self.client.emulator.send_string("cowsay")
        self.client.emulator.send_enter()

    @task
    def run_command(self):
        self.client.emulator.wait_for_field()
        self.client.emulator.send_string("cowsay hello")
        self.client.emulator.wait_for_field()
        # Pretty prints the current screen
```

- and initiated from the command line as usual, e.g. `locust -f locustfile.py -u 10 -t 60`, which will launch the above script with 10 virutal users and run for 60 seconds. Upon start, each virtual user will instantiate their own 3270 emulator that connects to telehack.com and enters the `cowsay` program, and the repeated task that happens on each actor tick is the submission of `cowsay hello`. This results in 10 agents sending repeated requests to the machine that exercises the `cowsay` function. That's a lot of cows. 

This, of course, is a very rudimentary example. With the versatility and extensibility of scripting in Python, as well as Locust's valuable features like distributed testing, there are numerous directions one could take this. On an actual IBM Z mainframe, one could use this as a template to script interactions with components such as DB2, CICS, RACF, and so on. Not just automating the behavior of one developer, but also the myriad of transactions that could occur on a typical enterprise system. 

So long as modern developers continue to engineer extensions, green-screen interfaces will continue to live on. Even though software is moving towards more programmatic directions, such as via REST APIs, and more accessible UIs on a web browser, there is no denying how much infrastructure is sustained on applications that rely on 3270 interaction. These can still receive the care and attention they deserve without having to compromise on our desire for modernization.

Contrary to popular belief:
```
 ______________________________________________ 
< "This dino can still learn some new tricks!" >
 ---------------------------------------------- 
\                             .       .
 \                           / `.   .' "
  \                  .---.  <    > <    >  .---.
   \                 |    \  \ - ~ ~ - /  /    |
         _____          ..-~             ~-..-~
        |     |   \~~~\.'                    `./~~~/
       ---------   \__/                        \__/
      .'  O    \     /               /       \  "
     (_____,    `._.'               |         }  \/~~~/
      `----.          /       }     |        /    \__/
            `-.      |       /      |       /      `. ,~~|
                ~-.__|      /_ - ~ ^|      /- _      `..-'
                     |     /        |     /     ~-.     `-. _  _  _
                     |_____|        |_____|         ~ - . _ _ _ _ _>
```

*Articles represent my views only and not IBM's.*