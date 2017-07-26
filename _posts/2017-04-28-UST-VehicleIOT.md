---
layout: post
title: "UST Global creates a Vehicle tracking system to monitor and generate alerts from vehicles using sensors using Azure in real time."
author: "Ritesh Modi"
author-link: "http://twitter.com/automationnext"
#author-image: “{{ site.baseurl }}/images/UST/ritesh.jpg”
date: 2017-04-19
categories: [IoT, Azure functions]
color: "blue"
image: "images/UST/company.png" #should be ~350px tall
excerpt: UST Global creates a Vehicle tracking system to monitor and generate alerts from vehicles using sensors using Azure in real time.
language: English
verticals: Transportation
geolocation: [India]
---


<img src="{{ site.baseurl }}/images/UST/company.png" width="400">

UST Global creates a Vehicle tracking system to monitor and generate alerts from vehicles using sensors using Azure in real time.

## Customer profile

[UST Global](http://www.ust-global.com/) ,is a leading provider of end-to-end IT services and solutions for Global 1000 companies. 
UST global has implemented number of IoT solutions for itself and for their customers. One of the solutions tracks school buses and kids for their safety. Parents can know in real time about the movement of the school bus and their kids. Another solution deployed for a school in Delhi provides SMS to parents when students get into bus along with the bus location and path. 


**The Core team:**

* Thomas KurukootJohn – Architect, UST Global
* Reeba Babu- Developer, UST Global
* Amal Prakash  - Developer, UST Global
* Prasad Easwaramoorthy  - Developer, UST Global
* [Ritesh Modi](http://twitter.com/automationnext) - Senior Technical Evangelist, Microsoft DX India
* [Sudhir Rawat] – Senior Technical Evangelist, Microsoft DX India


**Technologies used:**

* Azure IOT Hub (https://azure.microsoft.com/en-in/services/iot-hub/)
* Azure DocumentDB (https://azure.microsoft.com/en-in/services/cosmos-db/)
* Azure Event Hub (https://azure.microsoft.com/en-in/services/event-hubs/)
* Azure Functions (https://azure.microsoft.com/en-in/services/functions/)
* SendGrid 9 https://docs.microsoft.com/en-us/azure/app-service-web/sendgrid-dotnet-how-to-send-email), (https://sendgrid.com/)
* Twilio (https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-twilio) , (https://www.twilio.com/azure)



## Problem Statement / Pain point

UST have also implemented a vehicle tracking solution that it plans to sell to its customer wanting to monitor their fleet of vehicles. This solution is currently hosted on AWS. UST Global is seeing an increase in demand for an Azure based solution from their customers. This will increase their market breath and give them competitive advantages. 

UST Global reached out to Microsoft to understand how they could architect the solution on Azure. We recommended that they enhance the solution with logging all incoming messages, tracking the health of vehicles based on information gathered from vehicle, and plug/play different channels like email/SMS for generating and sending alerts so that appropriate proactive actions can be taken. 





## Solution, steps, and delivery

 This project had three objectives:
*	To implement an IoT solution for Vehicle tracking using Azure as cloud platform
*	Enhance the existing solution with improved logging and modular destination targets for messages. 
*	Create a demo environment on Azure for demonstration purpose to end customers.


Vehicle Management
The solution focuses on collecting information from sensors in real time. Following types of data are collected with an adjustable interval 
*	Engine coolant temperature
*	Engine RPM
*	Vehicle Speed
*	Vehicle Battery Voltage
*	Coolant Temperature
*	Intake air temperature
*	MAF air flow rate
*	Odometer KM
*	Altitude
*	Speed
*	Latitude/longitude
*   Address
*	Status (InMotion/Stop/IgnitionOn/Speeding)
*	Ambient Air Temperature
*	Catalyst Temperature: Bank 1, Sensor 1
*	Catalyst Temperature: Bank 2, Sensor 1
*	Catalyst Temperature: Bank 1, Sensor 2
*	Catalyst Temperature: Bank 2, Sensor 2


##Architecture##

## Initial Architecture ##
UST already have an implementation of Vehicle tracking IoT on AWS platform. The architecture for AWS solution for Vehicle tracking IOT system is shown next.  The AWS stack consisted of Lambda functions, SNS topics and SQL queries. The messages are picked by Rules engine (SQL Queries) and passed on to other services like Lambda and more for notifying the administrator of vehicles. 

![Initial Architecture]({{ site.baseurl }}/images/UST/Initial.png)

## Final Architecture ##

The approach we took was to identify the components that could
1.	Ingress messages from devices
2.	Store intermittently 
3.	Trigger automatically Rules engine to parse and route the message
4.	Send Emails
5.	Send SMS

In addition, the idea was to build a modular solution such that UST can customize the solution for its customer in plug-and play manner.
There was also scope to improve the overall solution for adding logging mechanism for all messages.
We identified that IoT hubs works well for ingress of messages from Devices. In future, if UST decides to communicate to device from cloud; they will have this capability inbuilt with IotHubs.

Events Hubs is a good choice for storing the messages received by IoTHubs. They allow configuration of Partitions and message retention in days.
Storing messages in JSON format is ideal as it is light-weight, easy to transfer and read. DocumentDB service was a nature choice as log destination.
Routing Engine was implementing using Azure functions and so are other functionalities like Sending Emails and SMS.

UST will be easily able to create new functions along with bindings and triggers for their customer based on new requirements. They would also be able to replace existing functions with other functions by just changing the bindings.

Functions are triggered by on Azure Storage Blobs. Messages are written to separate storage account where each storage is associated with a function.
 
![Final Architecture]({{ site.baseurl }}/images/UST/final.png)

The new architecture is completely implemented using Azure Services. These services include Azure IoT hub, Azure functions, storage accounts, Event Hubs, DocumentDB. It also uses third party services like Sendgrid for sending emails and Twilio for sending SMS. These components are explained in details in later sections. 

The sensors on vehicles and mobile devices connects to Azure IoT hub and sends vehicle metrics as JSON message to it.  The messages are stored in IoT Compatible Event hub and routes to two different destinations. 
•	The messages get logged into NoSQL DocumentDB database and 
•	The messages are routed to dedicated Event Hub instance for the application.

These two Event Hubs are being monitored by an Azure function. Any incoming message to Event hub triggers execution of Azure function where the rules for message routing are implemented. Rules are defined based on incoming vehicle health values. Based on output from these rules, the message is routed to a specific Azure storage account.

Each storage account is again monitored by another set of Azure function. These Azure functions get triggered on arrival of new messages in storage account. Each of these Azure functions are implemented to either send SMS or email. 

As data keeps coming DocumentDB as logs, reports can be created using PowerBI.


## Solution ##

**Step 1: Evaluation of sensors**

The UST team had already build a custom device that can easily be attached to cars. The device details are not sharable.

**Step 2: Determining device connectivity to the cloud**

Our biggest concern from a solution perspective was to determine if the custom IoT could connect to the Azure IoT Hub. The device has capability to http capability but later we found that it was not able to invoke https requests which is a good practice for IoT hubs. Customer confirmed that a firmware upgrade of device or a complete new device with https capability if possible and they would use the same for connecting to IoT Hub. REST API's were used instead of IoT Hub SDK on devices.


**Step 3: Building the end-to-end flow by Configuring IoT Hub, Event Hubs, DocumentDB and Azure functions **

## *IoT* ##


UST has a device installed in every vehicle that needs to be monitored.
The Device is capable of invoking REST API on Azure IOT Hubs and send relevant information to it.

The Routing function checks the type of incoming message, checks its PID value and compares the incoming value with slabs shown in next table. Based on the value, the message could be categorized into 

•	Critical
•	Medium
•	Minor
•	Normal


Sl No	Type	PID	Critical	Medium	Minor	Normal
1	Engine coolant temperature	5	255-200	199-150	149-31	30-0
2	Engine RPM	C	16383-10000	9999-6000	5999-3000	2999-0
3	Vehicle Speed	D	255-200	199-150	149-60	59-0
4	Intake air temperature	F	215-200	199-150	149-31	30-0
5	MAF air flow rate	10	655-500	499-300	299-100	99-0
6	Ambient Air Temperature	46	215-200	199-150	149-31	30-0
7	Catalyst Temperature: Bank 1, Sensor 1	3C	6513-5000	4999-3500	3499-2000	1999-0
8	Catalyst Temperature: Bank 2, Sensor 1	3D	6513-5000	4999-3500	3499-2000	1999-0
9	Catalyst Temperature: Bank 1, Sensor 2	3E	6513-5000	4999-3500	3499-2000	1999-0
10	Catalyst Temperature: Bank 2, Sensor 2	3F	6513-5000	4999-3500	3499-2000	1999-0




Sample payload is shown next

Critical :  {"pid":"5","data":"00 00 00 00 00 00 00 E1"}
Medium :    {"pid":"C","data":"00 00 00 00 00 00 1D 4C"}
Minor :     {"pid":"D","data":"00 00 00 00 00 00 00 7D"}
Normal :    {"pid":"F","data":"00 00 00 00 00 00 00 19"} 


Each Category of message is treated differently. For example, critical messages should be transmitted to an admin using SMS, Medium messages should be sent as email to a group of people, minor messages should not be used at all.

An Azure storage account corresponding to each Message Category is created. The Routing function writes the message to an appropriate storage account.
 
An Azure function corresponding to each storage account is hosted within an app service listening for messages. For every message that arrives at storage account, the corresponding Azure function is executed. This Azure functions acts as a channel to alert about the health of vehicles. 

Two Azure functions were created
6.	SMS using Twilio provider
7.	Email using SendGrid provider
Multiple more Azure functions can be created based on need and can be associated to different storage account.

### *IoT Hub* ###

IoT Hub provides a service that is designed for IoT device connectivity. UST's is building a platform eventually will be sold to enterprise customers. Each customer will have variable number of devices. IoT hub suits this requirement. Also, telemetry from only registered devices should be allowed in the solution. IoT Hub is used primarily for device to cloud communication from authenticated devices. Iot Hub stores messages from Devices in Event Hubs. A single message received by IoT Hub can be send to multiple endpoints.  Two Endpoints each representing an Event Hub is created.

![Iot Hub]({{ site.baseurl }}/images/UST/iothubs.png)

### *Event Hub* ###

Azure Event Hubs is a highly scalable data streaming platform capable of ingesting millions of events per second. Messages are stored in Event Hub captured by IoT hub.  As mentioned before, there are two events hubs created. Both of them get all the messages. While one of them is intended for sending data to DocumentDB for logging them other one is passed through a Azure function that acts as router for messages.

![Event Hub]({{ site.baseurl }}/images/UST/eventhubs.png)

Two custom endpoints are created. A single message can be passed through multiple endpoint and each of them can act based on them. The errormessages endpoint is used to transfer the message to Event Hub having 2 partitions and having retention period of 2 days. This endpoint is used for ascertaining if the messages should be generating alert. If messages are alert bound, then routing engine moves those messages to appropriate storage account.

The allvehicledata endpoint is used to send the message to Event Hub having 2 partitions and having retention period of 2 days. This endpoint is used for logging of message to DocumentDB.


![Event Hub Configuration]({{ site.baseurl }}/images/UST/eventhubsconfig.png)

### *DocumentDB* ###

DocumentDB can store data in JSON format. All vehicle messages are stored in DocumentDB. DocumentDB is used as log destination for the solution. Data in DocumentDB is stored using Azure functions. Azure function provides out of box binding for DocumentDB.

![DocumentDb]({{ site.baseurl }}/images/UST/docdb.png)

## *Azure Functions* ##

Azure functions are hosted within function Apps. The first task was to create and setup an App service that can host our function Apps. Function Apps acts as container for functions. There can be multiple function implemented within a Function App. Consumption pricing tier was used for this implementation however this can be changed to App services plan depending on customers requirement.

### *Routing Messages* ###

The Vehicle tracking solution implements a rules engine. This rules engine could be implemented as webapi in App services or hosted on IIS within virtual machines. In both the cases, the rules engines become tightly coupled with implementation language and the platform itself. By hosting the routing engine on Azure functions, the solution does not have to think and take care of base infrastructure. It does not even have to think about the underlying platform used for hosting the service. Azure function allows the routing rules to be written in any language and hosted on any platform. This bring in de-coupling of routing engine from underlying services. The task of routing messages was a perfect scenario for an Azure function that could utilize an Event Hub trigger, execute the routing logic written in c# and send the output to dynamically ascertained storage account (based on category). The function would run on-demand whenever there is new message in Event hub. This is dynamic routing and is implemented using dynamic output binding. The incoming data is in Hexadecimal format and is converted into binary before passing it through rules.


![Routing Trigger Configuration]({{ site.baseurl }}/images/UST/routingtriggers.png)

In each Azure function, there is a function.json file that specifies the function's bindings. Notice in this binding there is no output mentioned. The output is determined dynamically by code within the dunction.

```JSON
{
  "bindings": [
    {
      "type": "eventHubTrigger",
      "name": "aaa",
      "direction": "in",
      "path": "allvehicledataev",
      "connection": "eventhubconnection"
    }
  ],
  "disabled": false
}


```

This function determines the appropriate storage and output name dynamically using binder object. The sample code shows the way to write to dynamically ascertained storage account. It uses BlobAtrribute object to ascertain the directory and file name in storage which is determined using StorageAccountAttribute object.


```c#
            var attributes = new Attribute[]
            {    
                new BlobAttribute("errortype1/{rand-guid}"),
                new StorageAccountAttribute("CriticalMessagesStorage")
            };
             using (var writer = await binder.BindAsync<TextWriter>(attributes))
            {
                writer.Write(myEventHubMessage);
            }

```
Sample code for routing function is shown next.

![Routing]({{ site.baseurl }}/images/UST/routing.png)





### *Log Messages* ###


The Vehicle tracking solution should log all incoming messages from IoT devices to DocumentDB. This Logger could be implemented as webapi in App services or hosted on IIS within virtual machines. In both the cases, the logger had to custom implementation performing CRUD operations on DocumentDB. The connection configuration (Url and Key) of DocumentDB would have to managed in these services. Functions provides out of box parameter input and outputs services related to DocumentDB. It also helps in managing connection information in easy to use setting section. Again, the task of logging messages was a perfect scenario for an Azure function that could utilize an Event Hub trigger, process the message in Azure function and send the output to DocumentDB. The function would run on-demand whenever there is new message in Event hub.

```c#
using System;
public static   void Run(string myEventHubMessage, out object outputDocument, TraceWriter log)
{
    log.Info($"C# Event Hub trigger function processed error message: {myEventHubMessage}");
        outputDocument = new {
    id = myEventHubMessage ,
    name = myEventHubMessage
  };
}


```

![Log function trigger]({{ site.baseurl }}/images/UST/logtrigger.png)




### *Sending Email* ###


An Azure function is implemented that has storage Account as Trigger and outputs the data to SendGrid Email service. SendGrid services should be configured before this function can be used.

The binding for this functions is here. The storage connection “MyStorageAccount” is stored in Settings section of config file


```Javascript
{
  "bindings": [
    {
      "name": "myBlob",
      "type": "blobTrigger",
      "direction": "in",
      "path": "errortype1",
      "connection": "MyStorageAccount"
    },
    {
      "type": "sendGrid",
      "name": "message",
      "apiKey": "AzureWebJobsSendGridApiKey",
      "direction": "out",
      "from": "xxxxxxxx@xxxxxxxxx.com",
      "subject": "Alert!! There is an outlier in vehicle tracking solution"
    }
  ],
  "disabled": false
}

```

![Sending function trigger configuration]({{ site.baseurl }}/images/UST/emailtrigger.png)

```c#

#r "SendGrid"
using SendGrid.Helpers.Mail;
public static void Run(string myBlob, out Mail message, TraceWriter log)
{
    log.Info($"Sending email to UST admin \n  \n ");

    var personalization = new Personalization();
  personalization.AddTo(new Email("xxxxx@xxxxx.com"));

  var messageContent = new Content("text/html", myBlob);

  message = new Mail();
    
  message.AddContent(messageContent);
  message.AddPersonalization(personalization);

}

```

### *Sending SMS* ###


An Azure function is implemented that has storage Account as Trigger and outputs the data to Twilio SMS service. Twilio services should be configured before this function can be used.

The binding for sending SMS function is shown here. The storage connection “MyStorageAccount” is stored in Settings section of config file.



```Javascript
{
  "bindings": [
    {
      "name": "myBlob",
      "type": "blobTrigger",
      "direction": "in",
      "path": "errortype1",
      "connection": "MyStorageAccount"
    },
    {
      "type": "twilioSms",
      "name": "message",
      "accountSid": "sampleSID",
      "authToken": "token",
      "to": "+xxxxxxxxxxxx",
      "from": "+xxxxxxxxxxxx",
      "direction": "out"
    }
  ],
  "disabled": false
}


```

![Sending function trigger configuration]({{ site.baseurl }}/images/UST/smstrigger.png)

```c#

#r "Twilio.Api"

using Newtonsoft.Json;
using Twilio;

public static void Run(Stream myBlob, out SMSMessage message, TraceWriter log)
{
    log.Info($"C# Blob trigger function Processed blob\n  \n Size: {myBlob.Length} Bytes");

    string msg = "Hello Ritesh, thank you for your order.";

    message = new SMSMessage();

    message.Body = msg;
    
}


```



![Hack with customer]({{ site.baseurl }}/images/UST/hack.png)


## Opportunities going forward ##

•	Upgrade of device firmware
•	Generating dashboards and displaying information using PowerBI
•	Writing more Azure functions integrating custom applications and messages

## Conclusion

The purpose of this project was implement UST’s Vehicle tracking IOT solution on Azure. Azure provides a mature IoT platform. It can register and authenticate devices, ingest data from sensors and devices, transition the messages through a set of business logic services, store them for both short as well as long term and eventually take actions on them to inform stakeholders about Vehicles status and strength. With this project, it was illustrated how to set up Cloud infrastructure and services along with sensors, easily deploy a solution to both collect and store the data, and get alerts from the data.

This project can be used as a starting point for anyone who is planning to deploy IoT solutions on Azure.




Here is a quote from the customer:

> “Thank you for visiting us for the Hackathon with the IOT team on the Predictive maintenance use case for  Vehicles.It was indeed a knowledgfull session and the UST IOT team enjoyed each and every moment in the Hackathon. We could get clarified our doubts on Azure IOT framework. Thanks once again for visiting us. We look forward for fruitful outcomes of this visit.”  - Thomas KurukootJohn – Architect, UST Global
