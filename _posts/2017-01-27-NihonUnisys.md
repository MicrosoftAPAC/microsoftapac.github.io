---
layout: post
title:  "Partnering with Nihon Unisys to build an IoT solution using Azure IoT Suite"
author: "Hiroyuki Watanabe"
author-link: "http://twitter.com/hiwatan007"
#author-image: "{{ site.baseurl }}/images/authors/photo.jpg"
date: 2017-05-26
categories: [IoT]
color: "blue"
#image: "{{ site.baseurl }}/images/imagename.png" #should be ~350px tall
excerpt: In this IoT hackfest, Microsoft worked with Nihon Unisys to develop an IoT solution for the manufacturing industry using Azure Data Factory, Azure Machine Learning, and Power BI.
language: [English]
verticals: [Manufacturing & Resources]
---

Nihon Unisys is a system integrator in the manufacturing industry who would like to propose creating a standard method for an IoT solution by using Azure IoT Suite. The solution would use Bluetooth devices to collect data through their Azure IoT Hub, with data being analyzed by Azure Machine Learning and visualized by Power BI.

### Key technologies

- [Microsoft Azure IoT Suite](https://azure.microsoft.com/en-us/suites/iot-suite/)
- [Azure Data Factory](https://azure.microsoft.com/en-us/services/data-factory/) for transferring data from an on-premises SQL database to Azure SQL Database
- [Azure Blob storage](https://azure.microsoft.com/en-us/services/storage/blobs/) for storing transferred data
- [Azure IoT Hub](https://azure.microsoft.com/en-us/services/iot-hub/) for connecting sensor network module devices and Android
- [Azure Stream Analytics](https://azure.microsoft.com/en-us/services/stream-analytics/) for processing and calculating data from the sensors
- [Azure Machine Learning](https://azure.microsoft.com/en-us/services/machine-learning/) for analyzing data
- [Microsoft Power BI](https://azure.microsoft.com/en-us/services/power-bi-embedded/) for visualizing data


### Core team

Nihon Unisys:
- Tadashi Komorizono – Manufacturing System Department
- Yasuhiro Kurita – Manufacturing System Department
- Mieko Matsui – Manufacturing System Department
- Shigeo Yamagishi – Advanced Technology Department

Microsoft DX Japan:
- [Hiroyuki Watanabe](http://twitter.com/hiwatan007) – Technical Evangelist
- Shigeo Fujimoto – Technical Evangelist


## Customer profile

The [Nihon Unisys Group](http://www.unisys.co.jp/e/index.html), headquartered in Tokyo, Japan, provides [integrated services](http://www.unisys.co.jp/e/solutions_services.html) that begin with the analysis of management issues and culminate in their solution, for clients in sectors ranging from financial services, manufacturing and distribution, to energy and government.

By working in close communication with clients, the Group is able to provide powerful support for IT-based management innovation through the creation of systems that are optimized to meet user needs. 

The Group's consulting services assure seamless execution of all processes from formulation of business strategies to implementation of IT systems. The Group's expertise in IT supports companies in fully realizing their business strategies using IT in a three-stage process: 
- Business innovation proposals that recommend management reforms and business strategies
- Business consulting that elaborates on these proposals to develop business process flows and IT strategies
- IT consulting that implements these plans

The Group's strength lies in the ability to swiftly materialize customers' management strategies and corporate vision through the smooth coordination and integration of all necessary processes, from upstream business consulting to downstream implementation and system integration. 

 
## Problem statement

As a system integrator, Unisys would like to propose creating a standard model for an IoT solution for the manufacturing industry. To do this, Unisys would like to utilize the [Azure IoT Suite](https://azure.microsoft.com/en-us/suites/iot-suite/) as a platform for the standard model. 

This solution will help address and resolve the following technical needs:
- Transferring data from a Bluetooth sensor device to Azure IoT Hub by using Alps device sensors
- Transferring data collected through batch processing from an on-premises database to Azure SQL Database 
- Analyzing data acquired from manufacturing equipment in the manufacturing industry by using Azure Machine Learning
- Visualizing that data by using Power BI
 
  
## Solution

Unisys proposed to establish an IoT solution in the manufacturing industry that uses Bluetooth devices to collect data through their IoT Hub. Data will be analyzed by Azure Machine Learning and visualized by Power BI.

- Data visualization (Figure 1): Data about conference space areas collected by Android devices is sent to IoT Hub.
- Data analysis (Figure 2): Data is transferred from an on-premises database to Azure SQL Database, where it is then analyzed by Azure Machine Learning to predict future issues and their solutions.

*Figure 1. Data visualization IoT architecture diagram*
 
![Figure 1: Data visualization IoT architecture diagram]({{ site.baseurl }}/images/2017-01-27-NihonUnisys/NihonUnisys2.png)

<br/>

*Figure 2. Data analysis IoT architecture diagram*
 
![Figure 2: Data analysis IoT architecture diagram]({{ site.baseurl }}/images/2017-01-27-NihonUnisys/NihonUnisys3.png)

<br/>

## Technical delivery

### IoT device information

Unisys will use the [sensor network module devices manufactured by Alps](http://www.alps.com/e/iotsmart-network/index.html), including Alps' firmware. They will also use the Azure IoT Device SDK and write their device apps in the C programming language.

Download a PDF for the [Alps Sensor Network Module Evaluation Kit](http://www.alps.com/e/iotsmart-network/pdf/pamphlet.pdf). 


### IoT device to Azure / Azure to IoT device

The Alps IoT Smart Module Sensor Network Module sends sensor data to Android or iPhone. Data stored in Android or iPhone can be used as a CSV file. In this hackfest, Unisys imported the CSV file to a local PC, and sent the data to Azure for evaluation by using Azure Data Factory.

The source code for Android or iPhone software can be downloaded from the following (note: downloads of this source code are limited to corporations in Japan):

  - [Android (Android 5.0)](http://www.alps.com/j/iotsmart-network/appdownload/SensorModuleSampleCode_11.html)

  - [iPhone (iOS 8.3)](http://www.isb.co.jp/itc/iotsmart-network/)

Unisys is considering sending sensor data from the sensor mentioned to Azure by using these source codes and the Azure IoT Gateway SDK.

The following is a `JSON` code snippet in the IoT gateway for the Alps sensor tag.

```json

{
  "modules": [
    {
      "name": "IoTHub",
      "loader": {
        "name" : "native",
        "entrypoint" : {
          "module.path": "build/modules/iothub/libiothub.so"
        }
      },
      "args": {
        "IoTHubName": "<<Azure IoT Hub Name>>",
        "IoTHubSuffix": "<<Azure IoT Hub Suffix>>",
        "Transport": "amqp"
      }
    },
    {
      "name": "mapping",
      "loader": {
        "name" : "native",
        "entrypoint" : {
          "module.path": "build/modules/identitymap/libidentity_map.so"
        }
      },
      "args": [
        {
          "macAddress": "AA:BB:CC:DD:EE:FF",
          "deviceId": "<<Azure IoT Hub Device ID>>",
          "deviceKey": "<<Azure IoT Hub Device Key>>"
        }
      ]
    },
    {
      "name": "ALPSSensorTag",
      "loader": {
        "name" : "native",
        "entrypoint" : {
          "module.path": "build/modules/ble/libble.so"
        }
      },
      "args": {
        "controller_index": 0,
        "device_mac_address": "<<AA:BB:CC:DD:EE:FF>>",
        "instructions": [
          {
            "type": "read",
            "characteristic_uuid": "47fe55D8-447F-43EF-9AD9-FE6325E17C47"
          },

          {
            "type": "read",
            "characteristic_uuid": "686A9A3B-4C2C-4231-B871-9CFE92CC6B1E"
          },
          {
            "type": "read_nfy",
            "characteristic_uuid": "686A9A3B-4C2C-4231-B871-9CFE92CC6B1E",
            "data": "F21480808080-8080808080-80808000-0000000000"
          },

          {
            "type": "read",
            "characteristic_uuid": "078FF5D6-3C93-47F5-A30C-05563B8D831E"
          },
          {
            "type": "read_nfy",
            "characteristic_uuid": "078FF5D6-3C93-47F5-A30C-05563B8D831E",
            "data": "F21480808080-8080808080-80808000-0000000000"
          },
          {
            "type": "read",
            "characteristic_uuid": "B962BDD1-5A77-4797-93A1-EDE8D0FF74BD"
          },
          {
            "type": "write_writewithoutresponse",
            "characteristic_uuid": "B962BDD1-5A77-4797-93A1-EDE8D0FF74BD",
            "data": "F21480808080-8080808080-80808000-0000000000"
          }
        ]
      }
    },
    {
      "name": "Logger",
      "loader": {
        "name" : "native",
        "entrypoint" : {
          "module.path" : "build/modules/logger/liblogger.so"
        }
      },
      "args": {
        "filename": "<</path/to/log-file.log>>"
      }
    }
  ],
  "links": [
    {
      "source": "*",
      "sink": "Logger"
    },
    {
      "source": "ALPSSensorTag",
      "sink": "mapping"
    },
    {
      "source": "mapping",
      "sink": "IoTHub"
    },
    {
      "source": "IoTHub",
      "sink": "mapping"
    }
  ]
}

```

<br/>

### Azure Stream Analytics operation

Using Azure Stream Analytics, Unisys transferred data from the IoT Hub into the database.

The following is an `SASSensor` snippet from SQL `CREATE DATABASE`.

```sql

CREATE TABLE [dbo].[SASSensor] (
	[PartitionId] NCHAR(64) NOT NULL,
    [msgId]      NCHAR (25) NOT NULL,
    [deviceId]   TEXT       NOT NULL,
    [temp]       REAL       NOT NULL,
    [brightness] REAL       NULL,
    [accelx]     REAL       NOT NULL,
    [accely]     REAL       NOT NULL,
    [accelz]     REAL       NOT NULL,
    [time]       DATETIME   NOT NULL,
    [Longitude]  REAL       NULL,
    [Latitude]   REAL       NULL,
	[IoTHub]	TEXT	NULL,
	[EventEnqueuedUtcTime] DATETIME	NOT NULL,
	[EventProcessedUtcTime] DATETIME	NOT NULL
    PRIMARY KEY CLUSTERED ([msgId] ASC)
);

```

<br/>

The following is an `MLSensor` snippet from SQL `CREATE DATABASE`.

```sql

CREATE TABLE [dbo].[MLSensor] (
    [msgId]      NCHAR (25) NOT NULL,
    [deviceId]   TEXT       NOT NULL,
    [time]       DATETIME   NOT NULL,
    [accelx]     REAL       NOT NULL,
    [accely]     REAL       NOT NULL,
    [accelz]     REAL       NOT NULL,
    [TempStatus] NCHAR (10) NOT NULL,
    PRIMARY KEY CLUSTERED ([msgId] ASC)
);

```

<br/>

The following is a snippet from Azure Stream Analytics query language. In addition to simply transferring sensor data, Unisys set the average value of the sensor data (acceleration) as well as the state variables of temperature.

```sql

SELECT msgId, deviceId, temp, brightness, accelx, accely, accelz, time, Longitude, Latitude INTO ThrOutput FROM sensor;

SELECT deviceId as deviceId, msgId, time as time, Avg(temp) as tempAvg, Avg(brightness) as brightnessAvg, 
AVG(SQRT(POWER(accelx,2)+POWER(accely,2)+POWER(accelz,2))) as AccelScale, Avg(accelx) as accelxAvg, Avg(accely) as accelyAvg, Avg(accelz) as accelzAvg
INTO ALOutput FROM sensor
GROUP BY TUMBLINGWINDOW (second,60), time, deviceId, msgId;

SELECT deviceId as deviceId, time as time, accelx, accely, accelz, msgId,
CASE WHEN temp > 25.0 THEN 'HoT' ELSE 'Cold' END as TempStatus
INTO MLOutput FROM sensor;

```

<br/>

### Power BI operation

Unisys visualized the data on the database with Power BI (Figure 3). Unisys was able to capture data (acceleration, temperature) from the sensor network module devices in real time on Azure. 

*Figure 3. Power BI*
 
![Figure 3: Power BI]({{ site.baseurl }}/images/2017-01-27-NihonUnisys/NihonUnisys8.png)

<br/>

### Data transfer from on-premises database to Azure Blob storage

Unisys transferred the on-premises database data to Azure Blob storage by using Azure Data Factory (Figure 4, Figure 5).


*Figure 4. Data Factory setting 1*

![Figure 4: Data Factory setting 1]({{ site.baseurl }}/images/2017-01-27-NihonUnisys/NihonUnisys4.png)

<br/>

*Figure 5. Data Factory setting 2*

![Figure 5: Data Factory setting 2]({{ site.baseurl }}/images/2017-01-27-NihonUnisys/NihonUnisys5.png)

<br/>

The following is a `JSON` code snippet for the pipeline of Azure Data Factory.

```json

  {
      "name": "ADFTutorialPipelineOnPrem",
      "properties": {
      "description": "This pipeline has one Copy activity that copies data from an on-prem SQL to Azure blob",
      "activities": [
        {
          "type": "Copy",
          "typeProperties": {
            "source": {
              "type": "SqlSource",
              "sqlReaderQuery": "select * from Sample"
            },
            "sink": {
              "type": "SqlSink",
              "writeBatchSize": 0,
              "writeBatchTimeout": "00:00:00"
            }
          },
          "inputs": [
            {
              "name": "SampleOnPremSQLTable"
            }
          ],
          "outputs": [
            {
              "name": "AzureSQLDatasetTemplate"
            }
          ],
          "Policy": {
            "concurrency": 1,
            "executionPriorityOrder": "NewestFirst",
            "style": "StartOfInterval",
            "retry": 0,
            "timeout": "01:00:00"
          }
        }
      ],
      "start": "2017-01-25T12:00:00Z",
      "end": "2017-01-25T15:00:00Z",
      "isPaused": false
    }
  }

```

### Azure Machine Learning operation

Unisys conducted an experiment to see whether Azure Machine Learning was suitable for their actual work (Figure 6, Figure 7), and they determined that it was needed to organize the data.

*Figure 6. Azure Machine Learning 1*

![Figure 6: Azure Machine Learning 1]({{ site.baseurl }}/images/2017-01-27-NihonUnisys/NihonUnisys6.png)

<br/>

*Figure 7. Azure Machine Learning 2*

![Figure 7: Azure Machine Learning 2]({{ site.baseurl }}/images/2017-01-27-NihonUnisys/NihonUnisys7.png)

<br/>

### Documentation

- [MVP Summit 2016 IoT Workshop](https://github.com/Microsoft/mvp-summit-iot-workshop#mvp-summit-2016-iot-workshop): Unisys will write their device app using the Azure IoT Device SDK based on this reference. Although this document is useful, Unisys would like a more detailed manual and reference document for the Azure IoT Gateway SDK.

- [IoT Kit practice material (in Japanese)](https://doc.co/ip7K2W/NsXXfD): This document and sample code are very useful for summarizing this IoT solution.

- [Move data between on-premises sources and the cloud with Data Management Gateway](https://docs.microsoft.com/en-us/azure/data-factory/data-factory-move-data-between-onprem-and-cloud): This document is very useful for data transfer from an on-premises database to Azure SQL Database.

- [Stream Analytics and Power BI - A real-time analytics dashboard for streaming data](https://docs.microsoft.com/en-us/azure/stream-analytics/stream-analytics-power-bi-dashboard): This document is very useful for visualizing data on Azure SQL Database.

### Learnings from the Microsoft team and the customer team

Concerning Azure Machine Learning, Unisys learned that preparing the data in advance is very important to effectively use Azure Machine Learning. In addition, Unisys determined that choosing or selecting the data is necessary for the row data prepared in this hackfest. 

 
## Conclusion

The manufacturing industry needs to consider a lot before introducing IoT solutions. For example, for each type of technology they need to consider code artifacts, device details, code language, device security, and data communication. 

Nihon Unisys has a deep understanding of and experience with introducing IoT solutions for the manufacturing industry. They were able to widen their knowledge of Azure Data Factory, Azure Machine Learning, and Power BI through this hackfest. They have built their IoT solution by using Microsoft IoT technology, and they have gained a more efficient way to prepare proposals for their customer in the manufacturing industry.

The following is a comment from Nihon Unisys:

*"Through this Microsoft IoT hackfest, we were able to widen our knowledge and gain a deeper understanding of the Azure IoT solution. We are very grateful to Mr.Watanabe and Mr.Fujimoto of Microsoft Technical Evangelism. They taught us how to create Azure Data Factory, Azure Machine Learning, and Power BI, including the preparation. It was a very [good] experience for us. We will make use of this knowledge when proposing and building [an] Azure IoT solution from now on. Thank you very much."* — Tadashi Komorizono, Manufacturing System Department, Nihon Unisys
