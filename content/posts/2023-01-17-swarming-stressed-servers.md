---
date: 2023-01-17
title: 'Swarming Stressed Servers: Open-Source Load-Testing on z/OS Mainframes with Locust'
template: post
thumbnail: '../thumbnails/square_mile.png'
slug: swarming-servers-locust
categories:
  - Technology
tags:
  - mainframes
  - ibm
  - tech
---

It’s 6 pm. I scan my text editor to paint the finishing whitespace on my test script. Satisfied, I swap to a terminal window and hit enter. In a second, thousands of requests cascade upon the screen, each acting out the life of a user. They hit our server with a stream of queries, submitting and creating hundreds and thousands of tasks and files. I smile — here comes the swarm.

But what are we swarming, and why? The ‘what’ is an IBM Z mainframe running z/OS. The ‘why’ requires a bit more explanation.

![IBM Z Mainframes](https://miro.medium.com/v2/resize:fit:1160/format:webp/1*PwarGcLlnZLi7I2_tFGdnA.png)

Mainframes necessitate large-scale transaction processing. They must handle the millions upon millions of daily requests and responses that power the financial, manufacturing, transportation industries, among others. This means sustaining a large number of concurrent users and transactions per second while ensuring consistent availability. For example, financial institutions have been known to deploy mainframes to support the huge quantity of credit card transactions they need to transmit, process, and store.

As a z/OS Systems Tester, my work on a mainframe OS does not begin and end with validating the input and output of a function. I must verify if such functions can handle the necessary stress that a mainframe workload might induce. As we introduce several new functions to our test systems, we want to regression test these new features to ensure they do not break existing ones, making certain these functions still behave as expected, especially under load.

Simulating load on the system can help preemptively identify bugs and resource shortages. Remember those websites getting hammered with thousands of orders for sneakers or a PS5, and buckling under the load of demand? By testing for these scenarios, including edge-cases where demand suddenly spikes, one can ensure their server stays up and running on D-Day. Consider a load test a rehearsal, with the tester the director — deciding what type of requests are sent, during which times, how often, and what responses to expect.

![Load testing](https://miro.medium.com/v2/resize:fit:550/format:webp/1*LVuzxT0fFi9RnhWiKMZ1ng.png)

Having established what a load test is, it’s time to pick a tool from our toolbox. In addition to the custom internal test frameworks we’ve developed over decades, there exist open-source and more ubiquitous tools, such as Apache JMeter, Locust, Gatling, and Grafana k6. These tools are intended to load test web servers that expose REST APIs, and are extensible, enabling us to load test certain z/OS functions provided there is an API endpoint we can submit requests to. These tools present additional advantages to our internal ones, like being able to script testcases in popular languages such as Python and JavaScript, and more seamlessly integrating into our CI/CD pipelines and source control management.

When starting out writing load tests for z/OS, I chose Locust for its more straightforward Python-based syntax. Behavior for each simulated user is specified in a Python script, e.g.

```
# locustfile.py
from locust import HttpUser

class WebsiteUser(HttpUser):
    def on_start(self):
        self.client.post("/login", {
            "username": "test_user",
            "password": "test_password"
        })

```

The WebsiteUser performs a simple task — upon initialization, submit a post request to the /login endpoint, with username and password included in the request payload.

Some arguments Locust accepts for its load test parameters include:
```
-H — The host Locust will target, in the form of a URL
-u — The number of simulated users
-r — Rate at which users spawn per second
-t — Total duration of the run
— headless —Execute the test exclusively from the command line, without opening up a web UI
```

For example, to execute a one hour long test with our WebsiteUser against example.com with 100 simulated users, spawning at 10 users a second and running only the command line, we’d enter the following command.
```
$ locust -f locustfile.py -H example.com -u 100 -r 10 -t 3600s --headless
```

Now that we have an understanding of how Locust works, how can we use it to target our mainframes? After all, Locust is intended to target web API endpoints, while z/OS is known for its green screen terminals.

Thankfully, there’s the z/OS Management Facility — z/OSMF. This software provides a framework for executing system tasks via web interface — and it also exposes a REST API for z/OS functions. The z/OSMF server is a task that runs on z/OS, and is able to submit jobs, create data sets, and send console commands.

Table 1 lists two job-related operations a user can perform by submitting GET requests to a specific HTTPS endpoint. Traditionally, submitting a z/OS job (i.e. a task or process that can be run in batch) requires logging on to a 3270 green-screen terminal, but now it can also be automated through REST APIs — therefore making a perfect candidate for user behavior our load test can simulate.

Here’s a snippet of how we can use Locust to submit jobs to z/OS:
```
test_jobs = ["//TESTSC JOB (),MSGCLASS=H\n// EXEC PGM=IEFBR14", 
             "//TESTSB JOB (),MSGCLASS=H\n// EXEC PGM=BPXBATCH,PARM='sh sleep " + str(random.randint(10,30)) + "'",
             "//TESTSC JOB (),MSGCLASS=H\n// EXEC PGM=BPXBATCH,PARM='sh echo HiFromRest'"]
```
```
class JobsUser(HttpUser):
    @task
    def on_start(self):
         with self.client.put("zosmf/restjobs/jobs", headers=headers, data=random.choice(test_jobs), catch_response=True, auth=(USERNAME,PASSWORD),verify=False) as response:
             print("Submitted " + response.json()['jobname'] + " with job ID " + response.json()['jobid'] + ". " + response.json()['phase-name'])
```

First, we define a list of strings representing a test job. The jobs are written in Job Control Language (JCL), a scripting language to specify instructions for z/OS batch jobs, which our system will parse and execute. These sample jobs will either perform nothing, execute shell commands to sleep for a certain period of time, or print text to the z/OS Unix shell.

When a new JobsUser is spawned, it will send a PUT request to the zosmf/restjobs/jobs endpoint, along with the necessary authorization and headers, randomly select a test job from the list, and include that string in its payload.

The z/OSMF server will accept the PUT and read in the JCL from the string passed in by the request, and the result is captured in the response variable. We can retrieve data from that response to check the status of our job and print its output. For example, we can check if our job is in the OUTPUT queue, which confirms our job completed processing, and set a corresponding variable. This lets us validate proper submission, execution, and output for all jobs submitted by each user, confirming that the server is properly handling all the requests when under load.

```
                  if response.json()['status'] == 'OUTPUT':
                      job_complete = True
```

Now all the pieces are in place. We have a reliable tool in Locust to create user scripts for our load tests, and we have a server to run our load tests against in the form of z/OSMF. This enables an expansive breadth and depth of testcases, for example, have hundreds of users submitting thousands of jobs over a 24 hour period, or have thousands of users writing to files on the system with 1 user spawning every 2 minutes for two days.

![Locust demo](https://medium.com/theropod/swarming-stressed-servers-open-source-load-testing-on-z-os-mainframes-with-locust-42a1d5e3363e)

Simulating activity on a mainframe can seem daunting at first, but by leveraging existing open-source tools and the latest z/OS features, we have an accessible, extensible, and effective means of generating load on our servers. We can stamp out the bugs to come, with a swarm of our own.

*Special thanks to Frank De Gilio, Michael Gildein, Anthony Giorgio, and Luisa Martinez for assisting in the writing and publication of this article.*

*Articles represent my views only and not IBM's.*