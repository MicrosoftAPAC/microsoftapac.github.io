---
layout: post
title:  "Building Smart Surveillance Cameras with Uncanny Vision"
author: "Gandhali Samant"
author-link: "#"
#author-image: "{{ site.baseurl }}/images/authors/photo.jpg"
date:   2017-04-06
categories: [IoT, Azure Functions]
color: "blue"
image: "images/UncannyVision/UncannyVision3.png" #should be ~350px tall
excerpt: In this IoT hackfest, Microsoft teamed up with Uncanny Vision to connect their smart surveillance camera solution to the Azure cloud. 
language: English
verticals: Security/Surveillance
geolocation: [India]
---

## Customer profile ##

Uncanny Vision is a technology company focused on Computer Vision on Embedded systems. They have manufactured Smarter Surveillance Cameras with Artificial Intelligence (AI). The uncanny  vision software toolkit increases the performance of your computer vision algorithms multifold. Their products are as follows –
1.	UncannyCV - A computer vision/image processing library optimized for Cortex-A series ARM processors.
2.	UncannyDL - An On-Device Deep Learning library for Mobile and Embedded applications.
3.	Uncanny Surveillance with On-Device Video Analytics
They also have UncannyCV Android & iOS SDK.
Company Url - http://www.uncannyvision.com/ 

Earlier this year, Uncanny Vision was announced as one of the top three winners of the first edition of the Qualcomm Design in India Challenge.
https://www.qualcomm.com/news/releases/2017/01/17/qualcomm-announces-expansion-its-design-india-program 

This is the team that was involved with the project:

- Ranjith Parakkal – Uncanny Vision, CEO
- Navaneethan Sundaramoorthy – Uncanny Vision, Co-founder & CMO
- Venkatesh Wadawadagi – Uncanny Vision, Senior Systems Engineer 
- Anoop K P – Uncanny Vision, Senior Software Engineer
- Dossan George – Uncanny Vision, Senior Software Engineer
- Mathew Sebastian – Uncanny Vision, Android developer
- Preethi Gracy – Uncanny Vision, Developer
- Pinto Felix – Uncanny Vision, Developer
- Gandhali Samant – Microsoft, Senior Technical Evangelist, DX India
- Surbhi Jain – Microsoft, Audience Marketing, DX India

 
## Problem Statement ##

Initial Scenario

Surveillance Cameras are being used everywhere today for security and monitoring. Worldwide, there are currently 300+ million surveillance cameras. The main problem is most of them are blind i.e. they are not being used for real time analytics. Currently, the usage pattern of this surveillance cameras is primarily for post-mortem analysis.

The second problem is these cameras record tons of footage which cannot be sent to cloud as the video data is huge in size and would cost a lot in bandwidth and storage. 

Uncanny Vision is trying to solve these two problems by analyzing the footage from the Surveillance camera using AI / Deep Learning-based Vision in real time on the camera itself and using IOT infrastructure on cloud to send alerts and create analytics. 

UncannyCV and UncannyDL are the two libraries that have been developed by them to solve this problem. UncannyCV is based on Computer vision algorithm whereas UncannyDL use deep learning algorithms. These two libraries support various platforms such as Android, iOS, Embedded Linux and various other RTOS platforms.

In addition to this, Uncanny Vision has created a complete product where these embedded libraries can detect the anomalies and send the data to cloud to generate real time alerts and analytics. They needed to use IOT cloud services for this. Initially, Uncanny Vision team was using AWS cloud services for ingesting the data from devices. After understanding the IOT related services available on Microsoft Azure platform they decided to give it a try.
 
## Solutions, steps, and delivery ##

**Step 1: Solution Envisioning**

The Uncanny libraries are installed on the Surveillance camera. The typical hardware configuration can be as follows -

*Figure 1: Typical Hardware Configuration*

![1]( {{ site.baseurl }}/images/UncannyVision/UncannyVision1.png)

Uncanny Vision software is installed in the camera and it monitors processes the video in real time. The machine learning algorithm detects patterns in the Video. E.g. In a Bank ATM, if someone is removing money and moving out in say 4-5 minutes is a normal behaviour. But if a person is detected in bending position and in that position for too long, if someone blocks the camera or if a person is detected waving hands and agitated that is a behaviour that needs an alarm raised. Uncanny Vision uses machine learning to detect these normal vs. Abnormal behaviours. If any unwanted/abnormal behavior is detected in camera using the Uncanny Vision libraries then related data, such as the time and location of the camera will be sent to Azure IOT hub in JSON format. (The IOT hub will not continuously receive data but only when any unwanted behavior is detected.) An Azure stream analytics job will process the data and send a message to Azure Event Hub. (Currently stream analytics job is not doing any aggregation or pattern detection, its being used as a connector to Event hub as well as to store the data in SQL database for Visualization. They wanted the job also as a placeholder for filtering events or aggregating those over a window in future as the team does not want to change setup later). 
When the message reaches Azure Event Hub it triggers the Azure Function which reads the payload data and sends it to Azure logic app using HTTP Request. Azure logic App is triggered by HTTP request trigger and it then reads the payload data and activates Twilio connector to send SMS alert.

**Step 2: Determining hub device connectivity to the cloud**

Uncanny Vision team wanted a scalable cloud service for data ingestion. They were using VMs earlier and wanted to move to PaaS. They tried Azure IOT Hub and decided to use it as since it was a managed service there would not be additional overhead for IT, it was highly scalable and very simple to integrate using available SDKs. They will continue exploring more features such as device cloning and IP whitelisting.
After deciding that Uncanny Vision team will use IOT hub to ingest data into cloud, they tried the SDKs for IOT Hub and decided to use Azure IOT SDK for java to send data from device to cloud. They used the reference samples from here - https://github.com/Azure/azure-iot-sdk-java/tree/master/device/iot-device-samples 

**Step 3: Building the end-to-end flow**

After the connection to IoT hub was successfully established, a simple end to end flow as shown in the architecture digram below was built.

*Figure 2: Data insertion architecture*

![2]( {{ site.baseurl }}/images/UncannyVision/UncannyVision2.png)

**Step 4: Configuring IOT Hub and Stream Analytics**

The team started with configuring IOT hub and connecting to it from the device by using java sdk. The experience to use Java SDK was very straightforward once they went through the github samples.
The IOT Hub connection using Java SDK is shown in Figure 4 below.The Java SDK uses IOT hub access token to securely communicate with IOT Hub. IOT Hub verifies it against the shared access policies and identity registry security credentials.

*Figure 3– Qualcomm camera with Uncanny Vision Software installed on it*

![3]( {{ site.baseurl }}/images/UncannyVision/UncannyVision3.png)

*Figure 4– Call from Java SDK to Azure IOT Hub*

![4]( {{ site.baseurl }}/images/UncannyVision/UncannyVision4.png)

 

Any time any abnormal behavior is detected in the camera, the data regarding that event is sent to Azure IOT device. The parameters sent would be Geolocation of the camera (Latitude/Longitude), Timestamp, and activity tags. Next a stream analytics job was configured to read the data from IOT hub. We discussed the possibility of directly sending data from Azure IOT hub to trigger Azure functions for alert as the data analysis is being done on the device and stream analytics job is just getting all the data to send to Azure Event hub. But then, it was decided that we will use stream analytics job as we would anyways need to save the data in SQL database for reporting as well as if in future they want to do any stream based analysis, they can just change the query and not rearchitect the solution components. So, in the end, it was decided that stream analytics job would have two outputs one would store the data in SQL database and other will send the data to an Azure event hub which will trigger the Azure Function.

*Figure 5 – Stream Analytics inputs and outputs topology*

![5]( {{ site.baseurl }}/images/UncannyVision/UncannyVision5.png)

Here is a sample JSON Input

*Code Snippet 1 –Sample JSON Input*

```

Initialisation of Camera
{ 
        "TimeStamp1":"0",
        "Latitude":"19.126480",
        "Longitude":"73.01101",
        "AlertName":"initialisation",
        "CameraStatus":"1"
}

Normal behaviour
{ 
        "TimeStamp1":"0",
        "Latitude":"19.126480",
        "Longitude":"73.01101",
        "AlertName":"standing_walking",
        "CameraStatus":"2"
}

Abnormal Behaviour
{ 
        "TimeStamp1":"0",
        "Latitude":"19.126480",
        "Longitude":"73.01101",
        "AlertName":"Hand_Waving",
        "CameraStatus":"4"
}

```


*Code Snippet 2 –Stream analytics Query*

```

SELECT
*
INTO outputEvent
FROM inputData TIMESTAMP BY HTime
        
SELECT 
*
INTO outputData
FROM inputData TIMESTAMP BY HTime

```

**Step 5: Setting up Azure Function and Azure Logic App Twilio connector to send sms alerts**

When Uncanny Vision team was evaluating different Azure services for building their solution, they tried Azure IOT Hub and Stream Analytics and also Azure Logic App for sending the SMS/email notifications. They were unsure about how to bridge the gap between these two parts of the Application. They had thought about using a web app or webjobs but were not sure how it will integrate with other parts of the solution. Since Azure Functions can be triggered by an EventHub message, we recommended them that they send the messages for which alerts need to be raised to Event Hub and then create an Azure Function which gets triggered from the Queue, processes the message and then triggeres a Logic App connector. So Azure Function will be a bridge between the event ingestion and the alert mechanism. There was no readymade documentation or code sample available that time. The Uncanny Vision team was not sure how to send a trigger from Azure Function to Logic app. I created a sample Azure Function which will get triggered by an Event Hub. This Azure function would read the message, process it and send a trigger to Azure Logic App using Http request.

*Figure 6 – Event Hub trigger to Azure Function*

![6]( {{ site.baseurl }}/images/UncannyVision/UncannyVision6.png)

We decided to use Azure function here as that would enable us to connect to Logic app for different connectors (sms/email) as well as give us the flexibility to add different alert mechanisms in future. The Uncanny Vision team also decided to add the functionality for saving generated alerts in blob storage for logging mechanism. We thought Azure Functions is good fit here as it will give the development team the flexibility to select the incoming trigger and since it has consumption-based pricing and scalibility options which will help in managing the cost and performance. 

We created Azure function as shown in the code below and triggered Logic App Twilio connector via HTTP request. We added reference to the NewtonSoft libraries for serialization/deseralization and also to System.Net for generating HTTP request to trigger the Logic App Twilio Connector. 

*Code Snippet 3 – Azure Function Code*

```

#r "Newtonsoft.Json"

using System;
using System.Net;
using Newtonsoft.Json;
using System.Net.Http.Headers;
using System.Runtime.Serialization;
using System.Dynamic;

public static void Run(string myEventHubMessage, TraceWriter log)
{
        log.Info($"C# Event Hub trigger function processed a message: {myEventHubMessage}");
        dynamic data = JsonConvert.DeserializeObject(myEventHubMessage);
        dynamic dataToSend = new System.Dynamic.ExpandoObject();
        dataToSend.TimeStamp1 = data.TimeStamp1;
        dataToSend.Latitude = data.Latitude;
        dataToSend.Longitude = data.Longitude;
        dataToSend.AlertName = data.AlertName;        
        string serData = JsonConvert.SerializeObject(dataToSend);
        var client = new HttpClient();
        client.BaseAddress = new Uri("https://prod-23.southeastasia.logic.azure.com:443/workflows/XXXXXXXXXXXXXXXXXXXXXXXXX/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
        client.DefaultRequestHeaders.Accept.Clear();
        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        HttpResponseMessage response = client.PostAsJsonAsync("", myEventHubMessage).Result;
        log.Info(response.ToString());
}

```

This entire flow is documented as a sample in a blog and is on github. https://blogs.msdn.microsoft.com/gsamant/2017/02/24/create-an-end-to-end-iot-scenario-with-azure-services/ 

Github link - https://github.com/gsamant/IOTEndtoEndDemo


*Figure 7 – Azure Logic app setup to generate sms alert*

![7]( {{ site.baseurl }}/images/UncannyVision/UncannyVision7.png)


**Step 6: Device demo videos** 

https://www.youtube.com/watch?v=gIE9536faVs



## Conclusion ##

Microsoft team and the Uncanny Vision team worked closely together to conclude a successful implementation of the IOT solution using IOT Hub, Stream Analytics, Azure Functions and Azure Logic App. The Uncanny Vision team could build an end-to end flow right from ingesting data in cloud to Send alert to the users using Azure services. The Uncanny Vision team wanted to uses PaaS services for the entire flow which was chieved by this exercise. They had setup their solution on AWS so through this exercise they came to know about all the Azure services that can be very useful in building end to end IOT solution. The Logic app part is right now being used for SMS but the same flow can be used for other form of notifications easily. Also, after working with Azure services for this solution, they wanted to explore how Azure services can help them in creating a dashboard/visualization experience for the customers and from Microsoft team's suggestion they decided to explore Power BI Embedded. Going forward, Uncanny Visionaims to follow a ‘surveillance and analytics as a service’ with their surveillance system where this Cloud based architecture will help them scale easily.

For Microsoft team, it was a great experience to learn how AI and deep learning algorithms are being used to solve real life problems using edge analysis.

Here is a quote from the customer:
> "Uncanny Vision's smart AI based surveillance software provides intelligence to the camera and does advanced processing and detection on the edge.
Interesting insights / unusual activity / suspicious behaviour notifications are pushed to the cloud.
Microsoft Azure seamlessly integrates with our product and ensures end to end connectivity by providing us an effective channel to send out real time sms and e-mail notifications.
We are grateful to the Microsoft team for supporting us on this journey and helping us to leverage the power of the Azure"


Opportunities going forward:
The next steps for this solution will be to add visualizations using PowerBI Embedded service, so that users can have a complete view of all the Security cameras at a given location and they can monitor the status of all the cameras. The Uncanny Vision team also wants to build drill down reports where a user can select a camera location on receiving an alert and can see a real-time image from that location along with the list of suspicious behaviors detected at that location.


## Additional resources ##

https://github.com/Azure/azure-iot-sdk-java/tree/master/device/iot-device-samples 

https://blogs.msdn.microsoft.com/gsamant/2017/02/24/create-an-end-to-end-iot-scenario-with-azure-services/

https://github.com/gsamant/IOTEndtoEndDemo










