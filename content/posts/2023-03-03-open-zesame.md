---
date: 2024-08-26
title: 'Open Zesame: Dual Development with Z Open Automation Utilities and z/OS Open Tools'
template: post
thumbnail: '../thumbnails/square_mile.png'
slug: dual-development-z-open
categories:
  - Technology
tags:
  - mainframes
  - ibm
  - tech
---

‘Open’ can feel like a buzzword at times, eliciting jamais vu, feeling less and less like a meaningful descriptor and more like a noise prepended to software terminology to tickle shareholders. One only needs to look at the mainstream success of companies like ‘OpenAI’ and wonder — wait, what’s ‘open’ about it?

So lets take a step back, a deep breath, and look at two recent initiatives in the mainframe space that live up to the ‘open’ name — Z Open Automation Utilities and z/OS Open Tools. In specific, we’ll take a look at how the tooling offered by these projects can streamline development and testing on z/OS, making it easier for newer z/OS system programmers to tackle operations and automate their infrastructure.

Let’s jump right into a scenario: you’re a z/OS systems tester who wants to display the current status of OMVS to check on its health. The traditional method of issuing this command would be to open up a 3270 emulator i.e. a “green screen”, log onto a z/OS system via TSO, open SDSF, tab over to the command line and enter `D OMVS`, which will return the output. Oh — and this is what you’re working with:

![ISPF](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*173WqwF8MemlDI7i.png)

A constrained window with a ‘graphical’ interface, with limited space for copy and pasting, and no immediate options to return parseable text formatted in JSON or YAML.

Interacting with the green screen is expected for most z/OS tasks. I highly advise system programmers to familiarize themselves with 3270 interfaces such as TSO, ISPF, and SDSF and how to navigate and operate with z/OS with it. They are highly reliable thanks to decades of development, are required for numerous mission critical tasks, and sustain a retro charm.

However, interacting solely via a “green screen” limits the extent with which one can integrate the capabilities of z/OS with modern automation and tooling. Languages like Python and CI/CD tools like Jenkins can work beautifully with z/OS — but it requires thinking outside of the beige box, and exploring more ‘open’ alternatives.

This is where Z Open Automation Utilities comes in, offering a suite of binaries that perform z/OS functions within z/OS Unix System Services — meaning they can be executed from an SSH session within your terminal emulator of choice. And to our luck — ZOAU ships with opercmd , which does as it says on the tin:

```
ssh testuser@ABC
testuser@ABC > opercmd 'D OMVS'
testuser@ABC&opercmd 'D OMVS'
ABC        2026212  16:29:37.00             ISF031I CONSOLE TEST0000 ACTIVATED
ABC        2026212  16:29:37.00            -D OMVS
ABC        2026212  16:29:37.00             BPXO042I 16.29.37 DISPLAY OMVS 482
                                           OMVS     0012 ACTIVE             OMVS=(00)
```

If the output is still a little unfriendly for one’s tastes, no matter, simply add the `-j` flag to spit it out in `.json`.

```
testuser@ABC > opercmd -j 'D OMVS'
{"data":{"output":"BPXO042I 16.32.23 DISPLAY OMVS 617\nOMVS     0012 ACTIVE             OMVS=(00)\n"},"timestamp":"2026212  16:32:23.00","timeout":100,"command":"D OMVS","program":"opercmd","options":"-j ","rc":"0"}
```

Excellent. Not only does this give us the output of the command, but it feeds back the return code, timestamp, and the original command we submitted — all packaged in neat JSON.

Now one can envision crafting more elaborate pieces of automation — perhaps a Python script that SSH’s into a mainframe, submits opercmdcommands to run health checks, parses the return output and prints them to a GitHub log, or a JavaScript server that continuously checks for DASD volume status and displays it on a webpage.

But with our capabilities boosted, why not dream bigger? Can we use bash for a more streamlined terminal experience? Execute curl to post the output of ZOAU commands to a web server? Pipe in jq to transform the json we’ve just received? But a quick search reveals these tools are either non-existent in a standard z/OS installation, or are scattered as convoluted installation packages from third parties.

Enter z/OS Open Tools: an initiative to port highly useful open-source tools to z/OS, primarily for use in z/OS Unix System Services. The above tools are all ported, alongside neovim , ncurses , nano , and more than 200 other programs.

A quick example of what can be done with jq , which is a command-line JSON processor:

```
testuser@ABC> opercmd -j 'D OMVS' | jq
{
  "data": {
    "output": "BPXO042I 16.51.59 DISPLAY OMVS 785\nOMVS     0012 ACTIVE             OMVS=(ST,R5,MM,Z2)\n"
  },
  "timestamp": "2026212  16:51:59.00",
  "timeout": 100,
  "command": "D OMVS",
  "program": "opercmd",
  "options": "-j ",
  "rc": "0"
}
```

The `|` operator ‘pipes’ the output of opercmd into jq, so jq is reading the JSON that opercmd generates and is pretty-printing it for us. But `jq` is more powerful than simply rendering aesthetically pleasing text — for example, we can get a leaner output from the JSON and just retrieve the result of the operator command:

```
testuser@ABC> opercmd -j 'D OMVS' | jq .data.output
"BPXO042I 16.54.07 DISPLAY OMVS 845\nOMVS     0012 ACTIVE             OMVS=(AB,CD)\n"
```

Very clean.

Let us dive into a more complex example-what if I was embarking on a Pokedex project to catalog all the world’s portable creatures, and wished to record their traits in z/OS data sets — for I’m sure there are still mainframes in the fantasy world of Pokemon.

We can issue a curl `GET` request to PokéAPI (pokeapi.co) and pass in ‘Pikachu’ as our parameter, pipe that output into jq and pass in . to neatly retrieve the data, then write it to a flat text file titled `pikachu_entry` .

```
curl --request GET --url https://pokeapi.co/api/v2/pokemon/pikachu | 
jq . >> pikachu_entry
```

We can quickly check that the new file pikachu_entry has captured the requested data by using head to get the first 10 lines of the file and wc to check the word count:

```
testuser@ABC > head -n 10 pikachu_entry
{
  "abilities": [
    {
      "ability": {
        "name": "static",
        "url": "https://pokeapi.co/api/v2/ability/9/"
      },
      "is_hidden": false,
      "slot": 1
    }, 

testuser@ABC > wc -w pikachu_entry
  20477    pikachu_entry
```

This looks good — however, we are in the realm of z/OS, so we’re not satisfied with just a flat text file- we’ve gotta wrangle with data sets. Let’s use the ZOAU `decho` command to write to a data set, without the need for using ISPF based editors:

```
cat pikachu_entry | decho TESTUSER.PIKACHU.ENTRY
```

`decho` accepts input from `stdin` , which means we can pipe in the output of `cat pikachu_entry` into `decho` and it will correctly parse it as input. This prevents us from needing to wrap the entirety of Pikachu’s entry between quotes — especially useful when dealing with large text content.

We can confirm that our data set was successfully created and filled in by logging into a TSO session, starting ISPF and querying for our data set name `TESTUSER.PIKACHU.ENTRY` — we should be able to browse it.

```
  Menu  Options  View  Utilities  Compilers  Help                              
────────────────────────────────────────────────────────────────────────────── 
DSLIST - Data Sets Matching TESTUSER.PIKACHU.ENTRY          Data Set - Browsed 
                                                                               
Command - Enter "/" to select action                  Message           Volume 
-------------------------------------------------------------------------------
         TESTUSER.PIKACHU.ENTRY                       Browsed           ABC123 
***************************** End of Data Set list ****************************
                                                                               
                                                                               
                                                                               
                                                                               
                                                                               
                                                                               
                                                                               
                                                                               
                                                                               
                                                                               
                                                                               
                                                                               
                                                                               
Command ===>                                                  Scroll ===> PAGE 
 F1=Help    F2=Split   F3=Exit    F5=Rfind   F7=Up      F8=Down    F9=Swap     
F10=Left   F11=Right  F12=Cancel                                               
```

```
 Menu  Utilities  Compilers  Help                                             
 ───────────────────────────────────────────────────────────────────────────────
 BROWSE    TESTUSER.PIKACHU.ENTRY                   Line 0000000000 Col 001 080 
********************************* Top of Data **********************************
{                                                                               
  "abilities": [                                                                
    {                                                                           
      "ability": {                                                              
        "name": "static",                                                       
        "url": "https://pokeapi.co/api/v2/ability/9/"                           
      },                                                                        
      "is_hidden": false,                                                       
      "slot": 1                                                                 
    },                                                                          
    {                                                                           
      "ability": {                                                              
        "name": "lightning-rod",                                                
        "url": "https://pokeapi.co/api/v2/ability/31/"                          
      },                                                                        
      "is_hidden": true,                                                        
      "slot": 3                                                                 
 Command ===>                                                  Scroll ===> PAGE 
  F1=Help    F2=Split   F3=Exit    F5=Rfind   F7=Up      F8=Down    F9=Swap     
 F10=Left   F11=Right  F12=Cancel
 ```

Even with our convenient suite of ZOAU commands, it is reassuring to see the 3270 terminal reflect the new operations we’ve performed.

Now we have a z/OS sequential data set with information about Pikachu, that we are free to do with as we wish. With it being a z/OS data set, one can feed it into jobs that run z/OS programs like `SORT` and `IDCAMS` to manipulate and copy data. And with the data formatted as JSON, we can reliably parse it, for example:

```
testuser@ABC> dcat TESTUSER.PIKACHU.ENTRY | jq 'keys'
[
  "abilities",
  "base_experience",
  "cries",
  "forms",
  "game_indices",
  "height",
  "held_items",
  "id",
  "is_default",
  "location_area_encounters",
  "moves",
  "name",
  "order",
  "past_abilities",
  "past_types",
  "species",
  "sprites",
  "stats",
  "types",
  "weight"
]
```

That’s right — we can feed the z/OS data set itself into `jq`. We now have all the keys in the Pikachu data model, so let’s pull some information from the abilities key:

```
testuser@ABC> dcat TESTUSER.PIKACHU.ENTRY | jq .abilities[].ability.name 
"static"
"lightning-rod"
```

The ZOAU command `dcat` will print the contents of the data set, then we use `jq` to filter that output by iterating over the abilities array and printing the name of each ability, which gives us a clean way of retrieving Pikachu’s innate gifts of Static and Lightning Rod.

`jq` gives us some powerful formatting tools, for example, we can dig into the stats key, pull out Pikachu’s numerical attributes, and format them as a table:

```
testuser@ABC> dcat TESTUSER.PIKACHU.ENTRY | jq -r '.stats[] | "\(.stat.name)\t\(.base_stat)"'
hp 35
attack 55
defense 40
special-attack 50
special-defense 50
speed 90
```

Sometimes, we may want to be extra careful ensure the data is intact when copying it to a data set, as encoding issues may occur. We can create sequential data sets on the fly with `dtouch -tseq TESTUSER.PIKACHU.STATS` and edit it in ISPF:

```
 File  Edit  Edit_Settings  Menu  Utilities  Compilers  Test  Help            
───────────────────────────────────────────────────────────────────────────────
EDIT       TESTUSER.PIKACHU.STATS                               Data set saved 
****** ***************************** Top of Data ******************************
==MSG> -Warning- The UNDO command is not available until you change            
==MSG>           your edit profile using the command RECOVERY ON.              
000001 hp              35                                                      
000002 attack          55                                                      
000003 defense         40                                                      
000004 special-attack  50                                                      
000005 defense-defense 50                                                      
000006 speed           90                                                      
****** **************************** Bottom of Data ****************************
                                                                               
                                                                               
                                                                               
                                                                               
                                                                               
                                                                               
                                                                               
                                                                               
Command ===>                                                  Scroll ===> PAGE 
```

You may have noticed I’ve formatted the data in a particular way — this is to prepare it for z/OS’s `SORT` program! Let’s say we want to sort Pikachu’s stats from best to worst, we can now pass in this data set to `SORT` — and thanks to ZOAU, we will not need to submit a job. Instead, this can be handled all in one command line input:

```
echo "   SORT FIELDS=(17,2,ZD,D)" | mvscmd --pgm=sort 
                                           --sysout=* 
                                           --sortin=TESTUSER.PIKACHU.STATS 
                                           --sortout=TESTUSER.PIKACHU.STATS 
                                           --sysin=stdin
```

ZOAU’s mvscmd program allows us to run the usual programs one may invoke in JCL, but run via z/OS Unix System Services instead, allowing us to convert JCL syntax to single line runnable programs that will immediately provide output.

In this instance, we invoke the `SORT` program via `pgm=sort` , then pass in the `IBMUSER.PIKACHU.STATS` data set as both sortin and sortout data definition statements to indicate that we want to sort this particular data set ‘in-place’. We pass in `“ SORT FIELDS=(17,2,ZD,D)”` as the argument to SORT , specifying that the value we want to sort by (Pikachu’s statistic) starts on the 17th column, is 2 characters lone, is a zoned decimal (ZD), and presented in descending order.

After running this command in our Unix shell, we can retrieve the output of the modified data set, and verify that it has correctly sorted its stats from best to worst:

```
testuser@ABC> dcat TESTUSER.PIKACHU.STATS
speed           90
attack          55
defense-defense 50
special-attack  50
defense         40
hp              35
```

To sum up — using binaries provided by Z Open Tools, we were able to pull data from a live API via curl and clean it up with jq . Then with the commands provided by ZOAU including decho, dtouch , and mvscmdare able to copy to and manipulate data sets to perform operations on this collected data — and we are capable of doing all of this within the comfortable confines of the Unix shell.

The proliferation of modernization efforts on z/OS have transformed it into a more open platform. ‘Open’, in this instance, is no buzzword.

Our capacity to execute tasks on z/OS has literally opened up, with fresh toolkits that integrate more beautifully and seamlessly with modern development environments and sensibilities. There has been an increased push for open-source on z/OS, with a vibrant community eager to share examples of how to leverage this new software to automate legacy tasks. And most important of all, we can approach development, testing, and maintenance of z/OS with more open minds that are receptive to new ways of interacting with these fascinating machines.

Let us continue this culture of openness, of community, and of progress.

Now go and be the very best, like no one ever was.

![Red](https://miro.medium.com/v2/resize:fit:1288/format:webp/0*35_0DEVnhvWLZCcC.png)
