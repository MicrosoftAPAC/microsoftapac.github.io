---
layout: post
title: "Add title with customer name here"
author: "Add author name here"
author-link: "Add URL for author's Twitter account here"
date: 2017-05-23
categories: [Bot Framework]
color: "blue"
image: "images/projectname/feat_image.png" #must be 440px wide
excerpt: Add a short description of what this article is about, helping fellow developers understand why they would want to read it. What value will they get out of reading it? Focus on the problem or technologies and let that be the guiding light.
language: The language of the article; e.g., [English]
verticals: The industry on which this article focuses; choose from the following: ["Agriculture, Forestry & Fishing"], [Banking & Capital Markets], [Discrete Manufacturing], [Education], [Entertainment], [Facility Management], [Government], [Health], [Hospitality & Travel], [Insurance], [Logistics], [Media & Cable], [Nonprofit], [Power & Utilities], [Process Mfg & Resources], [Professional Services], [Public Safety], [Retail & Consumer Goods], [Security], [Telecommunications]
geolocation: The geolocation of the article; choose one of the following: [Africa], [Asia], [Central America and the Caribbean], [Europe], [Middle East], [North America], [Oceania], [South America]
---

***PLEASE READ:** The goal of this write-up is to allow IT pros, developers, or BDMs to immediately identify the problem being solved, and for developers to be able to follow your steps to recreate the solution. Be as concise as possible, but be clear how you get to each step.*

*For Tier 1 write-ups, use this template in its entirety. For Tier 2 write-ups, only the following sections are required:*
 
- *Summary*
- *Technology used*
- *Lessons learned*
- *Conclusion*

***REMOVE ALL GUIDANCE TEXT BEFORE SUBMITTING A PULL REQUEST FOR THIS WRITE-UP***

***Goal of this section:** A developer, IT pro, or BDM can read this section, understand the problem solved, and have clear steps to implement the same solution.*

*Begin with a sentence or two to quickly introduce the project, providing a transition from the title and excerpt to the summary section.*

## Summary ##

*Required content:*

*Problem statement: ~2 sentences to concisely show the problem you solved; for example,*

PartnerName needed to reduce the hundreds of hours spent manually answering customer questions.

*Solution overview: Short paragraph describing your solution; for example,*

This solution implements a web-embedded knowledge search and human-handoff customer-service bot that uses a simple waterfall dialog to guide the customer to an answer. When an answer cannot be found, the bot places the customer in queue for a human customer-support agent.

## Key technologies ##

*Required content:*

*Key technologies used (indicated planned vs. implemented technologies)*

- *Link to Microsoft product or documentation pages*
- *Identify specific APIs by name*
- *Include any platform information (such as C# or Node.js)*

## Customer profile ##

*This section contains general information about the customer, including the following:*

- *Name and URL*
- *Description*
- *Location*
- *Product or service offerings*
 
## Solution overview ##

***PLEASE READ***

***Goal of this section:** To introduce and summarize what will be covered in detail in the technical delivery section. Provide a scenario walkthrough, and refer to the architecture diagram to help developers navigate the solution.*

*Required content:*

*Architecture diagram*

![CaaP architecture diagram](/images/templates/caaparchitecture.png)

*A brief description of the solution they will execute below by walking through the diagram*

***Directions for adding images***

*1. Create a folder for your project images in the "images" folder in the GitHub repo. This is where you will add all images associated with your write-up.* 
*2. Add links to your images using the following absolute path:*

    `![Description of the image]({{ site.baseurl }}/images/projectname/myimage.png)`
  
    *Here's an example:*

    `![Value stream mapping]({{ site.baseurl }}/images/orckestra/orckestra2.jpg)`

*Note that capitalization of the folder name, file name, and file extension must match *exactly* for the images to render properly.*

## Technical delivery ##

***PLEASE READ:***

***Goal of this section:** Provide step-by-step instructions on how to implement the solution.*

### Prerequisites

*Required content:*

- *Links to tools and instructions that need to be installed (such as Visual Studio)*
- *Links to SDKs and installation instructions*
  - *Links to accounts and sign-up instructions that are required (such as Azure)*
  - *Links to keys or other resources needed*

*A developer should not have to do any further guessing or research to implement a similar problem. Ensure that the prerequisites describe what needed to be done to get to this point. (For example, install Visual Studio and Bot Builder SDK, install Bot Emulator, sign up for Azure account, or obtain Cognitive Services keys.)* 

*Include a description for each step; don't leave gaps. Each step needs to include **what** was done, **why** it was done, and **where** readers can find code or instructions. See the following four examples, based on different available evidence:*

*Example 1: Point to existing documentation that provides the correct steps.*

Get access token to call the Bot Connector Service. This is required to enable the bot to talk to the Bot Connector. Documentation on this step can be found in [Authentication](https://docs.microsoft.com/en-us/bot-framework/rest-api/bot-framework-rest-connector-authentication).

*Example 2: Point to a code sample that will be installed or modified.*

Fork and install the Contoso Flowers Sample Bot. This sample provides the foundation for our product-search bot and will be edited in further steps. The code is available in the [BotBuilder-Samples](https://github.com/Microsoft/BotBuilder-Samples/tree/master/CSharp/demo-ContosoFlowers) repo on GitHub.

*Example 3: Point to a code sample that will be installed or modified.*

Copy the following code into the MessagesController file. This code initiates the bot conversation.

```
POST https://api.botframework.com/v3/conversations HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1Ni...
Content-Type: application/json

{
    "bot": {
        "id": "12345678",
        "name": "bot's name"
    },
    "isGroup": false,
    "members": [
        {
        "id": "1234abcd",
        "name": "recipient's name"
        }
    ],
    "topicName": "News Alert"
}
```
 
If the connector is able to establish the conversation with the specified users, the response contains an ID that identifies the conversation. Be sure to capture the ID because you'll need it to send messages to the users. The following example shows a response that contains a conversation ID.

```
{
    "id": "abcd1234"
}
```

*Example 4: Indicate variables that need to be set.*

Set the IsSpellCorrectionEnabled key to true in the [Web.config](https://github.com/Microsoft/BotBuilder-Samples/blob/master/CSharp/intelligence-LUIS/Web.config) file to enable spelling correction. See the [Spell Check API](https://dev.cognitive.microsoft.com/docs/services/56e73033cf5ff80c2008c679/operations/56e73036cf5ff81048ee6727) documentation for more details.

## Conclusion ##

***PLEASE READ***

***Goal of this section:** Summarize how you solved the business problem listed in the abstract and provide next steps.*

*Required content:*

- *Summary of the problem statement*
- *Summary of the solution you implemented*
- *Video, link, or screenshot of the solution*

*Optional content:*

>*If you’d really like to make your write-up pop, include a customer quote highlighting impact, benefits, general lessons, and/or opportunities. Attribute all quotes with name, title, and company.*

### Code repository ###

***Goal of this section:** Provide a comprehensive list of resources to implement a similar solution.*

*In this section, include a list of open-source code repositories or any open-source code repos you used in this solution.

- *Link to the repo for this solution*
- *Link to sample code repos that were used as a foundation*

## Additional resources ##

***PLEASE READ***

***Goal of this section:** Provide a comprehensive list of resources to implement a similar solution. In this section, include a list of links to resources that complement your story, including (but not limited to) the following:*

- *Documentation*
- *Blog posts*
- *Tools and SDKs*
- *Code/document sources*

## Team ##

*Include Microsoft and partner team members (denote company), GitHub IDs, and photo if desired.*
