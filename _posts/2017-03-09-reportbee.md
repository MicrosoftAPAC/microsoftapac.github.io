---
layout: post
title:  "ReportBee develops a conversational Bot to help school principals surface relevant insights about classes, students and teachers."
author: "Brijraj singh"
author-link: "http://twitter.com/brijrajsingh"
#author-image: "{{ site.baseurl }}/images/authors/photo.jpg"
date:   2017-03-09
categories: [Conversations as a Platform, Cognitive Services]
color: "blue"
#image: "{{ site.baseurl }}/images/imagename.png" #should be ~350px tall
excerpt: ReportBee (The next generation ReportCard service for schools) develops a  conversational bot to help school principals in tracking and monitoring performance of classes, students and teachers.
language: English
verticals: Education
geolocation: India
---

ReportBee - The next generation ReportCard service had a tough task at hand making sure that users like Principals start using the ReportBee application to find actionable data about student's, teacher's performance without going through a learning curve to use the mobile applications. Reportbee developed a conversational bot using Microsoft Bot framework and cognitive services (LUIS.ai) in their mobile application for school principals to help them converse with a bot in a realistic manner and track/monitor performance of classes, students and teachers. 

**Technologies used:**

- [Microsoft Bot Framework](http://dev.botframework.com)
- [NodeJS](http://nodejs.org)
- [Azure Cognitive Service (LUIS) - Natural Language Processing](http://luis.ai)


**Core Team:**
- Anjan - CTO, Co-founder
- Kaushik Sundar - Developer, ReportBee
- Brijraj Singh - Senior Technical Evangelist, Microsoft DX India

## Company profile ##

###### ReportBee Technologies ######

[ReportBee](http://www.ReportBee.com) is the next generation Report card service for schools. Teachers, principals and other school users use ReportBee web application to store and track data about students. 7000+ teachers from 720+ schools use the ReportBee web applications daily. They use it to generate the Report Cards, Consolidated Marksheets and to track the progress of students. 

ReportBee also has three mobile apps; one each for Teachers, Parents and School Principals. Each mobile app is customized and tuned to the activity of the respective user. 

The mobile app for parents allows them to get easy access to the Report Cards, exams analysis, customised remedial content and other school information. It acts as the channel of communication between the school and parents. 

The mobile app for teachers allows them to enter marks of the students for assessments and maintain attendance. It also allows them to dictate the marks using voice.

The mobile app for Principals helps them in tracking the school's performance. The data from this application helps the principals make decisions related to running extra classes for students, review performance of teachers e.t.c.


## Problem statement ##

The principals like to see the insightful stats about students progress and general health of the school. There are X number of Reports that the mobile application offers today for the principals consumption. These reports are organized in an hierarchical manner and it often takes the principal about 3-4 clicks to find the right report. This multi-level navigation problem also exists for teachers and parents. This resulted in a significant portion of the reports not being used. 

In addition, the stakeholders need to extract information hidden in a combination of reports. ReportBee regularly gets request for customized queries from it users. Some examples are as follows : 

1.	Average of Mathematics for class 8, over 5 yrs
2.	Average marks for a student in Physics, Chemistry and Biology over 5 years

While the data exists, building a report for such customized requirements is a time consuming process, plus the report would be embedded into the application making it difficult to find immediately.  

Reportbee has solved this problem by integration of a Bots in each of the mobile applications. The idea is to give the users the option to query for customized data or request for a report using Natural language. 

## Solution, steps, and delivery ##

ReportBee joined a hackfest event organized by Microsoft in Bangalore in November, 2016. During this 2 day hackfest we discussed and architected the bot implementation that ReportBee wanted to develop. Second half of Day1, itself the ReportBee team started the development. On Day 2 the ReportBee team showcased their Bot implementation. They already had some APIs ready, and they quickly integrated the bot to surface some interesting data for a principal.

The Principals (client) initiates a conversation with the Bot using the mobile application, the Direct line based mobile application sends the conversation text over to LUIS.ai for intent/entity recognition and on the basis of given intents and entities the ReportBee bot calls the logic APIs which are hosted at a RAILS server. The Response from the RAILS server API is then sent over to DirectLine based Mobile app where this data is rendered accordingly.  

Here is a bird eye view of the ReportBee solution which involves the applications, web app as well as APIs

*ReportBee Solution*

![ReportBee Solution]({{ site.baseurl }}/images/ReportBee/ReportBee-SolutionEvidence.jpg)

The following image captures the architecture that was built during the hackfest.

*ReportBee Bot Solution Architecture*

![ReportBee Bot Architecture]({{ site.baseurl }}/images/ReportBee/architecture.png)


#### The Bot and Cognitive Services

##### Cognitive services

During the hackfest itself it became quite clear that free form queries can help the principles dictate as to what dimensions they are looking for in the report. We decided to use LUIS.ai to create the most common intents that a principal may express while interacting with the bot. A team member generated the intents, related entities and trained them with some self-generated utterances. Given below is a snapshot of Intents and Entities generated by ReportBee team.

![ReportBee Bot Intents]({{ site.baseurl }}/images/ReportBee/IntentsReportBee.png)

![ReportBee Bot Entities]({{ site.baseurl }}/images/ReportBee/EntitiesReportBee.png)

![ReportBee Bot Phrases]({{ site.baseurl }}/images/ReportBee/PhrasesReportBee.png)

![ReportBee LUIS APP Stats]({{site.baseurl}}/images/ReportBee/ReportBeePrincipalapp.png)


#### The Bot

The bot is based on LUIS intents which are presented to the user like a menu, the user also has flexibility to type their intent. During the hack the bot was developed using NodeJS and was deployed over Azure as an App Service, but later when we started the actual deployment we found out that the Azure Bot Service was best suited for our needs. Since Azure Bot Service is base over Azure functions, the Bot will run in a server-less environment on Azure that will scale based on demand.
The environment also enables the developers to debug their bot over cloud or locally and provides integrated support for analytics using Application Insights.  

Given below is a snapshot of the Bot implementation in Azure Bot Service

![Azure Portal Bot Service]({{site.baseurl}}/images/ReportBee/AzurePortal-BotService.png)

##### Authentication

ReportBee uses a Ruby on Rails based web app where Teachers, principals and parents could login and prepare/view reports. ReportBee team used the APIs available on this web app, this web app runs in a linux VM as of now over Azure.

The Bot requests for authorization using a link that users can click on. Once the users click on the link they are presented a login page after log in this page a token is generated that user can paste in chat to the bot. The bot stores this token in session.userData object. For further API calls to the rail server the Bot should pass on this user token in the auth header of the API calls.

We took inspiration for this authorization workflow from here - https://blogs.msdn.microsoft.com/tsmatsuz/2016/09/06/microsoft-bot-framework-bot-with-authentication-and-signin-login/ 


##### The Channels

The bot is available over the mobile application only, we implemented the bot for Android application using the Direct Line APIs. The Android sample of a Direct line implementation is also available at - https://github.com/brijrajsingh/DirectLineAndroidSample 

## Conclusion

By using Azure Bot service and Microsoft Bot framework the ReportBee team is now sure that there is a very gentle learning curve for Teachers, Principals and Parents to use the ReportBee applications. 

Enhanced and new features can now be delivered through the Bot only and the ReportBee doesn't need to frequently update the application to deliver the new features.

#### The Bot Demo

The video demo of Bot is available at the link below
![ReportBee Demo Video]({{site.baseurl}}/images/ReportBee/demovideosnap.JPG)

[WATCH HERE - ReportBee Bot Demo Video](https://aka.ms/ReportBeebotvideo)

#### Measurable impacts

- The Bot in principal mobile app is to be released for 15 top schools in phase 1 and will be rolled out to others after taking important feedback from the userbase.
- The Bot was also showcased at the event *.ai and was very well received, following is a picture taken during the event

![ReportBee at *.ai]({{site.baseurl}}/images/ReportBee/ReportBee-Fud2017.jpg)

- The ReportBee bot is expected to run in 720+ schools with as many principals, 7000 + teachers and more than 35000 students.

#### Issues faced & Resolution

- The ReportBee team faced an issue which was basically related to the session values not being saved which was because of the fact that the session.save() api wasn't being called. The issue was filed and later closed as well. https://github.com/Microsoft/BotBuilder/issues/2367 . Mostly the documentation pages don't mention the fact that you have to explicitly call session.save() to save the userdata in session.

- No demo code was available for Directline API implementation with platforms like iOS and Android. Microsoft team developed a basic version first and made it open source at https://github.com/brijrajsingh/DirectLineAndroidSample 

## Opportunities going forward ##

- We need to implement this bot with the Teacher and Parents mobile applications.
- Microsoft education team is also being aligned with ReportBee to explore further opportunities.

#### Customer Quote 

"We wanted to quickly build an app with an NLP-powered conversation interface. Microsoft's hackathons made it easy for us to get started with their Bot Framework. Despite being very new, the Bot Framework and LUIS were a breeze to work with because of the excellent community support and good documentation. Azure's Cognitive Services then made it seamless to host the Bot Framework NodeJS app. Our bot was up and running in a matter of minutes." - Anjan, Co-founder and CTO








