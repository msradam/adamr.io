---
date: 2023-03-03
title: 'Go-ing Native: Porting Grafana k6 to z/OS with Go'
template: post
thumbnail: '../thumbnails/square_mile.png'
slug: porting-grafana-k6
categories:
  - Technology
tags:
  - mainframes
  - ibm
  - tech
---

After a grueling night of ‘git’ clones and ‘go’ installs, I slammed the Enter key for the final time and witnessed as a flurry of user queries flooded the screen. The mainframe was handling everything — submitting, queuing, and processing each and every request — at breakneck speed. The tool that allowed for executing this blazing fast test wasn’t some internal, closed-source utility written in esoteric tongues. Rather, it was an open-source utility written in Go used by Cloud test teams around the world, now running natively on a z/OS mainframe.

![Mainframes](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*YrW6Xx7yEvQDifW8ytgHXg.png)

Let’s take a step back, and recall our motivation for load testing on mainframes from my previous article: we want to hammer our system with a simulated quantity of user activity so we can identify bugs and performance issues before they reach clients. To load test z/OS specifically, I deployed an API load test tool to send requests to a web server hosted on a mainframe, with each request instructing the system to execute some operation such as filesystem read-writes or batch processing. Let’s refer to the machine sending the requests as the ‘control’ node, and the machine processing requests as the ‘managed’ node. For example, a separate Linux instance is a control node submitting POST requests to a managed node in the form of a z/OS partition. The control node must have appropriate network and connection authorizations to communicate with our z/OS test system.

Out of multiple open-source load test tools, I opted for Locust due to its ease of use and familiar Python syntax. This made scripting and executing tests more expedient and accessible, but it presented two downsides:

- Non-native: Locust does not run natively on z/OS. Even though z/OS supports Python and several of its libraries, Locust’s dependencies present low-level incompatibilities when dealing with how other Unix systems and z/OS Unix handle C calls — I know, as I’ve attempted to install Locust on z/OS and have only gotten so far.
This means that Locust must run and submit requests from a separate OS running on an external control node. This results in both the control and managed nodes being stressed — even if the intention is only to stress the managed node — and the control node has to be kept active for the duration of the test. This is rather inconvenient for those moments when I want to shut off my work laptop, or when I want to save resources and not leave a Linux VM running overnight.
While there may be a path to running Locust on z/OS natively, it may be more expedient to opt for a different tool with a higher chance of compatibility.

- Performance: Locust is written in Python which is a high-level interpreted language. The Python interpreter will run through the script line-by-line as it executes it, as opposed to a compiled program which would be converted into machine code and therefore be more likely to perform faster.
Locust does offer distributed load generation features for scaling its tests, which could help accommodate the throughput of a mainframe. But this introduces more complexity when scripting these tests and selecting multiple control nodes — and as I say in point 1, it may be faster to just pick an alternative with better performance out-of-the-box.
These two factors may impact one another. For example, a load test being executed on my work laptop may be bottlenecked by its CPU and memory, impacting the efficacy of the test since not all responses may be received in time to validate.

While Locust remains viable, I desired further optimization— a tool I could kick off on z/OS itself, and leave running 24/7. I wanted the mainframe to be both the control and managed node, handling all of the load. I also wanted it to be portable — a binary I could copy from partition to partition without recompiling or interpreting. One such tool fulfilled all of my requirements: Grafana k6.

![k6](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*DUaN2HoyXCWbAN3Z.jpg)

Grafana k6 is the Go equivalent to Locust. It provides a command line interface with numerous options to parameterize testing, and parses test scenarios written in JavaScript to load test servers via API operations. It is written in Go, immediately solving the two issues presented above.

Well, almost. Go is indeed a compiled language known for its speed, and others have even measured direct comparisons between k6 and Locust, favoring the former. Native z/OS compatibility, on the other hand, is not a given. While z/OS now supports Go, and IBM even documents a process for porting programs to it, k6 is already a mature tool with a large codebase, and porting may not be as simple as modifying a Makefile. However, as I’ve alluded to before, Go being compiled to machine code may increase the chances of native compatibility, so long as we tell the compiler “hey — we’re running on z/OS”. In addition, the promise of being able to compile k6 just once and reusing that binary is enticing.

Porting a piece of software from one architecture to another is a daunting premise, especially with z/OS in the picture. While z/OS’s flavor of Unix — called Unix System Services- offers a lot of support for Unix software system calls, it is still not “just another ‘nix” like Arch or Debian, and there still remain unsupported features and encoding distinctions. Porting may not necessitate a lot of writing new code, but it does mandate a lot of trial and error with debugging, catching compiler errors, digging deep into configuration files and maintaining patience.

Well, as they say, we’ll cross that bridge when we get there. And it’s a winding bridge indeed, requiring us to grok the the recursive process of porting Go software to z/OS:

Before porting a package, port its dependencies
For each dependency, follow (1)
Repeat (2) until all desired packages are compiled
But we won’t know which packages are incompatible ’til we dive in headfirst. To start, I forked the k6 repository, then cloned it to a z/OS test machine. Our goal is a successful execution of go install for k6 — this command will compile the binary, move it to a predetermined $GOPATH/bin , and cache packages for future compilations.

I kicked off a `go install` within the k6 directory and awaited the oncoming storm of errors. Immediately it complained about an undefined syscall from the afero library, which is a filesystem framework and a dependency of k6.

```
 # github.com/spf13/afero
../go/pkg/mod/github.com/spf13/afero@v1.6.0/const_win_unix.go:26:15: 
undefined: syscall.EBADFD
```

As expected — before porting k6, we must port its dependencies. For addressing this undefined syscall, IBM’s docs suggest:

Look for files with build tags like ‘+build linux’ or ‘+build !linux’, which might need to add zos to the build tag: “+build linux zos” or “+build !linux,!zos”.

So I fork and clone the afero repository, added build flags for z/OS:

```
// afero/const_bsds.go

// Before
// +build aix darwin openbsd freebsd netbsd dragonfly 

// After
// +build aix darwin openbsd freebsd netbsd dragonfly zos
```

then compiled afero first to ensure the compiler accepts these changes. For example:

```
❯ cd afero
❯ go install
❯
```

No errors. It compiled. Whoa.

We’re not done. Next, I had to editgo.modin the k6 repository. This file defines the modules that serve as dependencies for k6. When we compile k6, Go will also compile all the dependencies listed in go.mod, which is why we needed to validate that afero builds properly on z/OS first. We can quickly edit go.mod with the following

`go mod edit -replace github.com/spf13/afero => /u/adam/afero`

Now when we build k6, instead of pulling the afero dependency from the official repository, it will use our local version. Note that if the original module is already compatible with z/OS, this isn’t necessary.

We’ll try installing again. First, go mod vendor to sync the changes from `go.mod` , then `go install`.

```
❯ go mod vendor
go: downloading github.com/sirupsen/logrus v1.9.0
go: downloading github.com/stretchr/testify v1.8.0
[...]
go: downloading github.com/dgryski/go-rendezvous v0.0.0-20200823014737-9f7001d12a5f
go: downloading github.com/matttproud/golang_protobuf_extensions v1.0.2-0.20181231171920-c182affec369
bash-4.3# go install
# go.k6.io/k6/cmd
cmd/ui.go:322:12: undefined: getWinchSignal
```

There’s yet another complaint regarding an undefined signal `getWinchSignal` . This time the call is coming from inside the house! Or more specifically— from the cmd module included in the k6 repository.

I’m not familiar with getWinchSignal , but digging into the source code for ui.go in k6 shows its relation to os.signal , which is connected to how Go handles Unix signals.

```
if sig := getWinchSignal(); sig != nil {
          winch = make(chan os.Signal, 10)
          gs.signalNotify(winch, sig)
          defer gs.signalStop(winch)
      }
```

Since this code is related to Unix-specific features, I am inclined to add another z/OS build flag just as we did for afero:


```
// cmd/ui_unix.go

// Before
//go:build darwin || dragonfly || freebsd || linux || netbsd || openbsd

// After
//go:build darwin || dragonfly || freebsd || linux || netbsd || openbsd || zos
```

Since cmd is not an external module defined in go.mod , we can move onto running go install for k6 itself. Depending on what modules are already installed, one may need to execute additional downloads, for example:

```
❯ go mod download cloud.google.com/go/storage
❯ go mod vendor
```

After submitting these commands, we enter one last go install — and after a nail-biting eternity-spanning minute of waiting for the compiler to end its churning, there in the bin folder of GOPATH was our binary, neatly wrapped up and ready for us to use.

```
❯ go install
❯ ls $GOPATH/bin
k6
❯ $GOPATH/bin/k6

          /\      |‾‾| /‾‾/   /‾‾/
     /\  /  \     |  |/  /   /  /
    /  \/    \    |     (   /   ‾‾\
   /          \   |  |\  \ |  (‾)  |
  / __________ \  |__| \__\ \_____/ .io

Usage:
  k6 [command]

Available Commands:
  archive     Create an archive
  cloud       Run a test on the cloud
  completion  Generate the autocompletion script for the specified shell
  help        Help about any command
  inspect     Inspect a script or archive
  login       Authenticate with a service
  pause       Pause a running test
  resume      Resume a paused test
  run         Start a load test
  scale       Scale a running test
  stats       Show test metrics
  status      Show test status
  version     Show application version

Flags:
  -a, --address string      address for the REST API server 
  -c, --config string       JSON config file
  -h, --help                help for k6
      --log-format string   log output format
      --log-output string   change the output for k6 logs, possible values are stderr,stdout,none,loki[=host:port],file[=./path.fileformat] (default "stderr")
      --no-color            disable colored output
  -q, --quiet               disable progress updates
  -v, --verbose             enable verbose logging

Use "k6 [command] --help" for more information about a command.
```

Voila.

The above porting process is a compact recollection of my experience bringing k6 to z/OS. There were numerous other prerequisite hurdles — quirky Go installation paths, repository encodings, space requirements and so on—that are less relevant to porting Go programs to z/OS and more about growing pains that come with working with newer languages on z/OS Unix System Services.

Regardless of the challenges, once you’ve ported one piece of software, you’ve already grown accustomed to the necessary steps (build, fix, sync, repeat) to port other programs.

As for the above changes to afero and k6 — I’ve already opened the respective pull requests for both so that those changes may be rolled upstream.

Go support on z/OS opens up a plethora of opportunities for bringing popular, performant, and practical utilities to the platform. With an easily documented sequence of steps, I was able to compile a well-known cloud testing tool and deploy it in our own test environments, while fully leveraging the existing documentation and resources. It felt empowering and enjoyable working with and contributing to open-source software in the context of mainframes.

I am eager to delve more in-depth about our advanced usage of k6 in z/OS testing, but for now, we can cherish our Go-rgeous victory.

![k6 demo](https://miro.medium.com/v2/resize:fit:1400/format:webp/0*Fxg1f4baplCNo9PY.gif)