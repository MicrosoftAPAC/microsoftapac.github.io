---
layout: post
title: "Add title with customer name here"
author: "Add author name here"
author-link: "Add URL for author's Twitter account here"
date: 2016-08-24
categories: [IoT]
color: "blue"
image: "images/projectname/feat_image.png" #must be 440px wide
excerpt: Add a short description of what this article is about, helping fellow developers understand why they would want to read it. What value will they get out of reading it? Focus on the problem or technologies and let that be the guiding light.
language: The language of the article; e.g., [English]
verticals: The industry on which this article focuses; choose from the following: ["Agriculture, Forestry & Fishing"], [Banking & Capital Markets], [Discrete Manufacturing], [Education], [Entertainment], [Facility Management], [Government], [Health], [Hospitality & Travel], [Insurance], [Logistics], [Media & Cable], [Nonprofit], [Power & Utilities], [Process Mfg & Resources], [Professional Services], [Public Safety], [Retail & Consumer Goods], [Security], [Telecommunications]
geolocation: The geolocation of the article; choose one of the following: [Africa], [Asia], [Central America and the Caribbean], [Europe], [Middle East], [North America], [Oceania], [South America]
---

Begin with an intro statement with the following details:

- Solution overview 
- Key technologies used 
- Core team: names, roles, and Twitter handles 

## Customer profile ##

This section will contain general information about the customer, including the following:

- Name and URL
- Description
- Location
- Product/service offerings
 
## Problem statement ##

This section will define the problem(s)/challenges that the customer wants to address with an IoT solution. Include things like costs, customer experience, and so on.
 
>If you’d really like to make your write-up pop, include a customer quote that highlights the customer’s problem(s)/challenges. Attribute all quotes with name, title, company.
 
## Solution and steps ##

The majority of your win artifacts will be included in this section, including (but not limited to) the following: pictures, drawings, architectural diagrams, value stream mappings, and demo videos.

This section should include the following details:

- What was worked on and what problem it helped solve
- Architecture diagram/s (**required**). Example below:

  ![IoT architecture diagram](/images/templates/iotarchitecture.png)

**Directions for adding images:**

1. Create a folder for your project images in the “images” folder in the GitHub repo files. This is where you will add all of the images associated with your write-up. 
2. Add links to your images using the following absolute path:

   `![Description of the image]({{ site.baseurl }}/images/projectname/myimage.png)`
    
   Here’s an example: 

   `![Value Stream Mapping]({{ site.baseurl }}/images/orckestra/orckestra2.jpg)`

Note that capitalization of the file name and the file extension must match exactly for the images to render properly.

>If you’d really like to make your write-up pop, include a customer quote that highlights the solution. Attribute all quotes with name, title, company.

## Technical delivery ##

This section will include the following details of how the solution was implemented:

- Security details
- Device used (be specific; provide details for PLC, microcontroller, etc.)

  Customer had X design their devices for them, which were manufactured by Y. The device has ### MB/KB of memory and ### GB/MB of storage and uses [line | battery] power and Z for connectivity. It is running [firmware | RTOS | Linux | Windows IoT | other]. They are using the [Azure IoT Device SDK | Azure IoT Gateway SDK] and writing their device app in [Node.js | Java | C# | C | Python].

- Device messages sent (packet size, frequency of send/day/device, number of messages)
- SDKs and languages used
- Code artifacts
- Pointers to references or documentation
- Learnings from the Microsoft team and the customer team
 
## Conclusion ##

This section will briefly summarize the technical story with the following details included:

- Measurable impact/benefits resulting from the implementation of the solution
- General lessons
  - Insights the team came away with
  - What can be applied or reused for other environments or customers
- Opportunities going forward
  - Details on how the customer plans to proceed or what more they hope to accomplish

>If you’d really like to make your write-up pop, include a customer quote highlighting impact, benefits, general lessons, and/or opportunities. Attribute all quotes with name, title, company.

## Additional resources ##

In this section, include a list of links to resources that complement your story, including (but not limited to) the following:

- documentation
- blog posts
- GitHub repos
- Explore [Azure IoT Hub documentation](https://docs.microsoft.com/en-us/azure/iot-hub/)
- Find IoT devices and starter kits: [Azure IoT device catalog](https://catalog.azureiotsuite.com/kits)
- Try any Azure services for free: [Create your free Azure account today](https://azure.microsoft.com/en-us/free/)
- Check out a curated collection of IoT learning resources: [Microsoft Technical Community Content](https://github.com/Microsoft/TechnicalCommunityContent/tree/master/IoT) on GitHub
- Read more IoT-focused [technical case studies](https://microsoft.github.io/techcasestudies/#technology=IoT&sortBy=featured) (like this one)
