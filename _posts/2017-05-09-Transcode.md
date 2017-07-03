---
layout: post
title:  "Building scalable driver analytics for the GTaxi smart taxi platform"
author: "Fukiat Julnual and Jierawat Gulsapudom"
author-link: "https://twitter.com/fujute"
#author-image: "{{ site.baseurl }}/images/authors/photo.jpg"
date:   2016-05-19
categories: [IoT]
color: "blue"
image: "images/transcode/p11powerbimap.jpg" #should be ~350px tall
excerpt: Transcode Co., Ltd., a fast growing “Intelligent Transportation Services” startup in Thailand, worked with Microsoft to re-architect its “GTaxi” smart taxi platform, gaining scalability via DocumentDB, better system management with Node.JS and improving on taxi service quality insights with PowerBI.  All with minimum impact to its existing Android developer team.
language: [English]
verticals: Transportation & Logistics
geolocation: [Thailand]
---

Transcode Co., Ltd., a fast growing “Intelligent Transportation Services” startup in Thailand, worked with Microsoft to re-architect its “GTaxi” smart taxi platform, gaining scalability via DocumentDB, better system management with Node.JS and improving on taxi service quality insights with PowerBI.  All with minimum impact to its existing Android developer team.

## Key technologies ##
- [Azure IoT Hub](https://azure.microsoft.com/en-us/services/iot-hub/)
- [Azure Stream Analytics](https://azure.microsoft.com/en-us/services/stream-analytics/)
- [Azure Data Factory](https://azure.microsoft.com/en-us/services/data-factory/)
- [Azure SQL Database](https://azure.microsoft.com/en-us/services/sql-database/?v=16.50) 
- [Azure DocumentDB - MongDB API](https://azure.microsoft.com/en-us/services/documentdb/)
- [Azure EventHub](https://azure.microsoft.com/en-us/services/event-hubs/)
- [Azure  Storage](https://azure.microsoft.com/en-us/services/storage/)
- [Azure App Service – Web Apps](https://azure.microsoft.com/en-us/services/app-service/web/)
- [Microsoft Power BI Embedded](https://azure.microsoft.com/en-us/services/power-bi-embedded/)

## Core team ##

- Sakon Buthong - Project Manager, Transcode Co. Ltd
- Srisai Ratchakit - Software Engineer, Transcode Co. Ltd
- Ananya Kerdkumrai - System Analysis, Transcode Co. Ltd
- [Jierawat Gulsapudom](https://twitter.com/jierawat)- Audience Evangelism Manager, Microsoft Thailand
- [Fukiat Julnual](https://twitter.com/fujute) - Technical Evangelist, Microsoft Thailand

## Customer profile ##

[Transcode Co. Ltd (“Transcode”)](http://transcodeglobal.com) is a fast growing SI/ISV in Thailand, specialized in Intelligent Transportation Services (ITS) solution.  Company provides Intelligence Transportation System, logistic and IoT Gateway solution for various types of customers including logistic & tracking solution for Taxi, fleet management systems.
The vision of Transcode is to provide a solution and services to meet the demands arising from social transformation, shaping new life styles for individuals and creating values for the society.

 
## Problem statement ##

ALL-THAI-TAXI(one of Thailand largest taxi companies needed to innovate to meet their customer growing expectation.The company has been working with Transcode for the end-to-end smart taxi platform called "GTaxi". As ALL-THAI-TAXI rapidly grew their business, they need the infrastructure and driver/customer application that could grow at the same pace.

Transcode also see the business oppertunity in turning data into business insight for ALL-THAI-TAXI to make better business decision and, to serve the requirement from Department of Land Transport to monitor taxi driver behavior and taxi service to ensure quality across the nation.

All this must be accomplished with minimum impact to its existing MongoDB database and be easily implemented by their Node.JS and Android Developer team.Transcode and Microsoft worked together to re-architect the GTaxi platform to scale up to support 200,000 users and move from on premise infrastucture to the Microsoft Azure Cloud.

 
## Solution and steps ##

In the first meeting with Transcode we discussed the existing architect and possibility of moving part of it to the new intelligent cloud platform.  With the goal to minimize the impact to the current system and minimize the effort of its existing Android developer team, both parties have agreed on this project direction and possible solution:
- Leverage the current developer skills, by getting the existing Android developer team work with Azure IoT SDK
- Use DocumentDB with MongoDB API for compatibility with the existing application code.
- Use PowerBI to visualize data from the database system  
- Leverage the  current skill set of Node.JS  and deploy the application on Azure Web Apps for better system management and scalability

We have co-designed the new architecture diagram with Transcode then started the hackfest.  

 ![Architecture  Diagram]({{ site.baseurl }}/images/transcode/p1architecture.jpg)
 
 (Picture 1: Architecture  Diagram)

During the hackfest the development teams worked on four seperate work areas
1.	Ingestion – This allow team members who are experienced in android to work with IoT hub via the Azure IoT SDK.
2.	Processing – This allowed team members to learn on how Azure Steam Analytics works by getting data from IoT and reference data from Blob storage while outputting the data to staging and direct serving to web application.
3.	Staging – This allowed team member to explore the Azure Data platform that covers Azure DocumentDB (MongoDB API) and Azure Storage Table
4.	Serving – This allowed team members who already experience in Node.JS to work on consuming the data from event hub and DocumentDB (MongoDB API). While allowing team members to explore the capacity of PowerBI embedded.
With the architecture, we started the woruk  joining hackathon in Singapore to prove our design architecture with simple data flow by start working on IoT Hub, Stream Analytics, and PowerBI.


 ![Architecture  Diagram]({{ site.baseurl }}/images/transcode/p2fisthackathon.jpg)
 
 (Picture 2: Working diagram during attending first hackathon in Singapore)

 ![Hackathon]({{ site.baseurl }}/images/transcode/p3hackathon.jpg)
 
  (Picture 3: During hackathon in Singapore)

  ![Hackathon]({{ site.baseurl }}/images/transcode/p4hackathon.png)
 
 (Picture 4: During hackathon in Singapore)

Once we came back to Bangkok, we worked more on adoption of appropriate services for the project as follows:
1. Pulling data from Steam Analytics to DocumentDB ( MongoDB API)
2. During the project we discovered that, the DirectQuery function of PowerBI Embedded only supports Azure SQL database and Azure SQL Data Warehouse. To get arround this,We used Azure Data factory to copy data from DocumentDB ( MongoDB API) to Azure SQL Server and then the data was consumed by PowerBI Embedded.
3.	We used reference data in Stream Analytics, then we used Azure Data Factory to copy data from SQL Server to blob Storage. 
4.	We used Event Hub as a source of alert data that will be displayed on the Web Application.


This is a list  of services that we used in the resource group 
![Resource Group]({{ site.baseurl }}/images/transcode/p5resourcegroup.jpg)
 
 (Picture 5: A list of services under project's resources group)

## Technical delivery ##
Key components and how this solution was implemented based on picture 1 (Architecture diagram ) 
- IoT Devices , We use 2 kind of physical device in this projects 
  1) Android tablet. It is running Android 4.4.2, API 19. Writing application in Java with Android Studio and 
  2) Advantech TREK-570 Devices, running Windows Embedded Standard 7 (WES7) 32 bits. Writing application in C with Microsoft Visual Studio.
  - Both devices working with hardware from “http://www.advantech.com“ to collect OBD data from taxi vehicles.
  - Both devices worked with Azure IoT Device SDK for connecting to IoT Hub via MQTT protocol over 3G/4G.

 ![Android Tablet]({{ site.baseurl }}/images/transcode/p6androidtablet.jpg)
 
  (Picture 6: Android Tablet)

  ![Collection ODB Data Devices]({{ site.baseurl }}/images/transcode/p7obd.jpg)
 
 (Picture 7: Devices from Advantech for collecting ODB data)


- Simulator device – We used Node.JS for creating [simulator device](https://github.com/fuju9w/gtx8/blob/master/gtx8_simulator.js) for generating sample data during the project.
- Azure IoT Hub – as a telemetry storage  
- Azure Stream Analytics – initial aggregation, alerts and prepare data which will be consumed by web application & Power BI 
- Azure Data Factory -  copy data between data SQL server to Blob and DocumentDB to SQL Server automatically.
- Azure SQL Server – store data for reference data and staging for Power BI embedded
- Azure DocumentDB (MongoDB API) – store telemetry data and reference data
- Azure EventHub – direct integration with web application for alert data.
- Azure Storage – store reference data for Azure Steam Analytics and archive data of telemetry
- PowerBI Embedded - visualize data
- Azure App Service – Web Apps – for hosting Node.JS application and Power BI Embedded as a monitoring tools and work management.
- Device messages: 
    - Package size < 4KB
    - GPS: Android/ TREK-570 / (frequency   1 min)
    - Engine logs: car monitoring data (speed, RPM, fuel) (frequency   1 min)
    - System logs: system on/off: (frequency   depend on event)
    -	Event data: speed, over speed event, door event (open/close) event, SOS(frequency   depend on event )
    - Finance transection: booking (frequency   depend on event)
- Security details - the data was sent from taxi to MQTT broker (Azure IoT Hub) via Transport Layer Security (TLS). and qualify the device with IMEI ID and using "[Symmetric Key](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-security-deployment)" (SAS Tokens) for this HackFest. In the final implementation, will use difference one. All devices must authenticate with the IoT hub based on credentials stored in the identity registry.

## Implementation ##
1. Both the Android device & TREK-570 use IoT SDK to connect to IoT Hub and sending messaging in multi-level JSON over MQTT protocol. 
2. Then, we use Azure Stream Analytics to collect data from the IoT Devices while getting reference data from blob Storage.

  ![Azure Steam Analytics'job topology]({{ site.baseurl }}/images/transcode/p8asajob.png)
 
 (Picture 8: Azure Steam Analytics'job topology)

 This is a sample of “Stream Analytics Query Language” that collects data from IoT Hub in multi-level JSON string format while joining data with reference data from that store in Azure Storage Blob. And then send out the data to DocumentDB created with the compatible MongoDB API.
 ```sql
WITH AllTaxi AS (
SELECT 
    SYSTEM.TIMESTAMP as TimeValue,
    iotd.DEVICEID,
    iotd.TimestampData,
    iotd.driver.employee_id,
    AVG(iotd.Temperature) as TemperatureReading,
    Ref.driver.firstname.en firstname, 
    Ref.driver.lastname.en lastname
FROM [iotdevices] iotd
JOIN [gtx8referece] Ref 
    ON iotd.driver.employee_id = Ref.driver.employee_id
WHERE
    iotd.DeviceId is not null
    and 
    iotd.TimestampData is not null
GROUP BY 
    iotd.DeviceId,iotd.TimestampData,
    iotd.driver.employee_id,
    Ref.driver.firstname.en, 
    Ref.driver.lastname.en,
    TUMBLINGWINDOW(second, 5)
)

SELECT * INTO mongoout FROM AllTaxi

```
3. At this time, Power BI Embedded can only access Azure SQL database and Azure SQL Data Warehouse as [data sources](https://docs.microsoft.com/en-us/azure/power-bi-embedded/power-bi-embedded-connect-datasource) for DirectQuery. Then,we used Azure Data factory to do an incremental copy of data from DocumentDB ( MongoDB API) to Azure SQL Server and then allowed the data will be consumed by PowerBI Embedded.

  ![Azure Data Factory]({{ site.baseurl }}/images/transcode/p9adfdiagram.jpg)

   (Picture 9: Azure Data Factory: Diagram)
 
   ![Azure Steam Analytics'job topology]({{ site.baseurl }}/images/transcode/p10adfvalidating.jpg)

 (Picture 10: Azure Data Factory: Validating)

 This is sample copy pipeline.

  ```json
{
  "name": "CopyPipeline-5ox",
  "properties": {
    "activities": [
      {
        "type": "Copy",
        "typeProperties": {
          "source": {
            "type": "DocumentDbCollectionSource",
            "query": "$$Text.Format('select * from c where c.gps.ts >= \\'{0:yyyy-MM-ddTHH:mm:ssZ}\\' AND c.gps.ts < \\'{1:yyyy-MM-ddTHH:mm:ssZ}\\'', WindowStart, WindowEnd)",
            "nestingSeparator": "."
          },
          "sink": {
            "type": "SqlSink",
            "writeBatchSize": 0,
            "writeBatchTimeout": "00:00:00"
          },
          "translator": {
            "type": "TabularTranslator",
            "columnMappings": "driver.drv_id:DriverID,driver.firstname.th:FirstName,driver.lastname.th:LastName,taxi_id:TaxiID,driver.employee_id:EmployeeID,gps.loc.coordinates.0:GPSLongitude,gps.loc.coordinates.1:GPSLatitude,service.booking.book_id:service_bookging,gps.ts:Timestamp"
          }
        },
        "inputs": [
          {
            "name": "InputDataset-5ox"
          }
        ],
        "outputs": [
          {
            "name": "OutputDataset-5ox"
          }
        ],
        "policy": {
          "timeout": "1.00:00:00",
          "concurrency": 1,
          "executionPriorityOrder": "NewestFirst",
          "style": "StartOfInterval",
          "retry": 3,
          "longRetry": 0,
          "longRetryInterval": "00:00:00"
        },
        "scheduler": {
          "frequency": "Minute",
          "interval": 15
        },
        "name": "Activity-0-taxipool->[dbo]_[taxipool]"
      }
    ],
    "start": "2017-04-28T11:00:41.377Z",
    "end": "2099-12-30T17:00:00Z",
    "isPaused": false,
    "pipelineMode": "Scheduled"
  },
  "$schema": "http://datafactories.schema.management.azure.com/internalschemas/2015-09-01/Microsoft.DataFactory.pipeline.json"
}


```
4. PowerBI embedded. We used Power BI CLI to create a workspace , Imported the Power BI Desktop File, including updating the database connection String. We tested the function of the Power BI that we created via Power BI Desktop with “ https://microsoft.github.io/PowerBI-JavaScript/demo/code-demo/ “ before  embedding 

 ![PowerBI]({{ site.baseurl }}/images/transcode/p11powerbimap.jpg)
 
  (Picture 11: Rendering data in PowerBI)

5. Finally the web application is using Node.JS to leverage the skill set of developer to access to data in DocumentDB vi MongoDB API

 ```javascript
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url ='mongodb://<endpoint>:<password>@<endpoint>.documents.azure.com:10250/<database>?ssl=true';
var findDrivers = function (db, callback) {
    var cursor = db.collection('<collectionName>').find(
        { 
            "service.breaking": "false", "driver.gender": "M", 
            "driver.employee_id":  { $exists: true, $ne: "" } 
        },
        { "driver.citizen_id": 1, "driver.firstname.en": 1, "driver.lastname.en": 1, 
          "gps.loc.coordinates.0": 1, "gps.loc.coordinates.1": 1, _id: 0 
        }
    );
    db.taxipool.find()
   cursor.each(function (err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            console.dir(doc);
        } else {
            callback();
        }
    });
};
MongoClient.connect(url, function (err, db) {
    assert.equal(null, err);
    findDrivers(db, function () {
      db.close();
   });
});

```
## Conclusion ##
The collaboration between Transcode and Microsoft has demonstrated how Azure IoT and Azure Services can provide the critical scalability with visualization and insights of data and PowerBI.  The project was implemented in just around 3 months with one Technical Evangelist from Microsoft and two developers from Transcode.  They plan to deploy the new system as soon as they got green light from customers and now they are considering to add more advanced functionality like driver face recognition and machine learning  in the future releases of the GTaxi platform.


>“Microsoft Azure has proved to be a great cloud platform which helps us develop and deploy enterprise-scale applications faster, and our developers can easily leverage their skill of Node.JS, Android, and MongoDB. “ -- Sakon Buthong - Project Manager, Transcode Co. Ltd

## Additional resources ##
- [Using Azure Data Factory](https://docs.microsoft.com/en-us/azure/data-factory/data-factory-azure-blob-connector)
- [Samples for the Azure IoT device SDK for Java](https://github.com/Azure/azure-iot-sdk-java/tree/master/device/iot-device-samples)
- [Stream Analytics Query Language Reference](https://msdn.microsoft.com/en-us/library/azure/dn834998.aspx)
- [API for MongoDB](https://docs.microsoft.com/en-us/azure/documentdb/documentdb-protocol-mongodb)
- [ Secure your IoT deployment ](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-security-deployment)