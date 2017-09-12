---
layout: post
title:  "Coca-Cola Amatil Indonesia (CCAI) uses Azure IoT to improve Production Quality"
author: "Muhammad Faizal"
date:   2017-05-29
categories: [IoT]
color: "blue"
image: "images/ccai/azure-iot-solution-architecture.png" #should be ~350px tall
excerpt: Coca Cola Amatil Indonesia, a subsidiary of Coca Cola Amatil, one of the largest Coca Cola bottlers in the world, enhances their Production Line Quality Monitoring system by utilizing Azure IoT Hub, Azure Machine Learning and Microsoft R.
language: [English]
verticals: [Process Mfg & Resources, Retail & Consumer Goods]
geolocation: [Indonesia]
permalink: /ccai.html
---

Striving for highest quality product, Coca-Cola Amatil Indonesia deployed an Integrated Quality System using Azure IoT to manage production quality at all manufacturing lines across Indonesia.

## Project Team ##

From Microsoft Indonesia:
- Anthonius Henricus, Developer Experience and Evangelism Director
- Muhamad Faizal, Senior Technical Evangelist
- Wanda Prasetia, ATU Lead
- Andhika Nugraha, TSP Azure
- Marcus Nugroho, TSP Data Platform

## Innovation ##
Coca Cola Amatil Indonesia (CCAI) never stand still, constantly evolving and adapting to the changing markets, consumer tastes and technology. Every day in CCAI means innovation to answer new challenges, optimizing resources to stay ahead in this rapidly growing market.
- Regularly launch new products to answer to the new needs and demands of consumers in Indonesia.
- Have 13 brands in the portfolio, divided into 6 categories: Sparkling, Juice, Tea, Isotonic, Dairy, Water.
- Run 8 state of the art manufacturing facilities across Indonesia, 37 production lines in total.
- Blow fill technology has enabled CCAI to design and bring to market the Ades easy-crush bottle which uses 12% less PET plastic than the previous Ades bottle, lighter than competitor bottles.
- Transformed the approach on secondary packaging by moving from full carton boxes to a 100% recyclable tray shrinks.
- Specifically designed the 1-door-medium coolers to be able to reduce energy usage up to half the required power from their predecessors. Energy efficient cooler will not only benefit the environment, but also generate a significant saving to retailer’s operating costs
 
## Customer profile ##
Coca-Cola Amatil Indonesia (CCAI) is a leading beverage sales, manufacturing, and distribution company that was established in January 1992 and has been operating in Indonesia for 25 years. CCAI is a subsidiary of Coca-Cola Amatil (CCA), one of the largest Coca-Cola bottlers in the world, which is headquartered in Sydney, Australia, and publicly listed on the Australian Securities Exchange. CCAI operates eight manufacturing facilities in Sumatra, Java and Bali and over 200 sales and distribution centers across Indonesia, employs a direct workforce of more than 10,000 people, and distributes million cases of refreshing drinks to more than 700,000 outlets across the nation. Governed by four integrated sustainability pillars: People, Wellbeing, Environment, and Community - CCAI has been running various CSR initiatives such as Coca-Cola Forest, Coke Kicks, education assistance, blood donor, and City Clean-up, which all grow alongside the business across Indonesia.
 
## Problem statement ##

CCAI already has on premise Production Line Quality Monitoring system, called Quinsys. Quinsys is .NET-based application, providing quality reports with data manually collected from Production Line sensor. CCAI uses these data to ensure quality and consistency of the product output.

CCAI has 42 production lines across several production plants in Indonesia. Each production plant managed their own production processes, especially bottling, each on separate systems. The location of the plants that are scattered in various industrial zones makes the integration difficult, which has slowed down several quality assurance processes.

CCAI wants to enhance the capability of Quinsys to be able to capture and process data automatically by integrating Production Lines PLCs. CCAI also wants to have the predictive quality results aligned with the certain ISO standard.

## Solution and steps ##

Microsoft with one of our local ISV partner, Rhemasis, works together with the goal to tackle this problem by integrating CCAI production lines into a single unified application called Quinsys, that was developed by CCAI internal team. The project is also run in cooperation with Rockwell Technologies.

The propopsed solution is an IoT solution based on Azure. Rockwell will provide the controllers to consolidate the data from existing production line PLCs. The collected data will be automatically streamed to IoT Hub in Azure, stored in SQL PaaS databases. Rhemasis ported the quality monitoring application into Azure, to calculate the data, and create predictive quality reports and analytics based on Machine Learning and R in Azure.

By the end of the project, the team successfully integrates the quality assurances into a single system.

### Key Technologies ###

The solution utlizes the following technologies:
- Azure IoT Hub
- Azure Stream Analytics
- SQL Azure
- Azure Machine Learning (and R scripts)
- Azure Web App Service

### Solution Development ###

The project uses several Azure services, namely IoT Hub, Stream Analytics, SQL PaaS, and Azure Machine Learning. Each of them poses different challenges in development, but mostly being straightforward after the team went through the learning curve. All-in-all, the overall development process took around 2 (two) months.

The end-to-end process started by Rockwell team capturing data from production lines using Rockwell Compact Logic 5480 and CCAI team building Quinsys quality assurance dashboards on top of ASP.NET platform. Both separated systems later were integrated by Rhemasis using Azure IoT platform technologies, from IoT Hub, Stream Analytics, AzureML, Azure Web PaaS, and SQL Azure.

#### Azure IoT Hub ####

Azure IoT Hub acts as IoT Cloud Gateway. The original plan was to use Azure Event Hub to receiving incoming data from the Rockwell devices. However, late in the project, the team decided to use Azure IoT Hub instead of Azure Event Hub due to its capability to handle two-way communications.

For this project, data only flows in 1 (one) direction, from Rockwell devices into Azure IoT Hub. The data is sent using CSV format. In the future, CCAI will also use the other direction, from Azure IoT Hub to Rockwell devices, to send commands to control the devices.

#### Azure Stream Analytics ####

The data received by Azure IoT Hub then flows to Azure Stream Analytics. Stream Analytics will parse the data into several different records in the database. The objective is to ensure each SQL insert statements can be executed in a fast and efficient way by the database. Since Stream Analytics only consists of scripts, it requires a steep learning curve and some amount of time to understand how the script can be customized to achieve the objective.

#### SQL Azure ####

Azure Stream Analytics executes several SQL insert statement into SQL Azure, to store all the received data. SQL Azure is used as a replacement for SQL Server on-premise in the old system. The migration process from SQL Server on-premise to SQL Azure is very straightforward and only requires very minimal changes to both the database structure and to the SQL statements.

#### Azure Machine Learning ####

In this pilot project, Azure Machine Learning is used primarily to manage and execute simple R queries. In the future, CCAI will utilize Azure Machine Learning to learn about the system's behaviour, analyze the data collected and predict maintenance needs.

#### Azure Web App Service ####

The team takes 2 (two) weeks to migrate the existing ASP.NET on-premise application into Azure Web App Service. The team only encounters minor issues that can be fixed with minimal code changes. The team also develops additional features in the system, including integration with other CCAI applications.

### Architecture ###

Figure 1. Quinsys System Architecture
![Quinsys System Architecture]({{site.baseurl}}/images/ccai/quinsys-system-architecture.png)

Figure 2. Azure IoT Solution Architecture
![Azure IoT Solution Architecture]({{site.baseurl}}/images/ccai/azure-iot-solution-architecture.png)

Figure 3. IoT Network Connection
![IoT Network Connection]({{site.baseurl}}/images/ccai/iot-network-connection.png)

### IoT Devices ###

| Product          | Description                                                                                                                   | Notes                                                           |
|------------------|-------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------|
| 1783-BMS10CGN    | Stratix,5700 Switch, Managed, 8 Fast Ethernet Copper Ports, 2 Gigabit Ethernet Combo,Ports, Full Software, CIP Sync, NAT, DLR | Switch to connect to local network                              |
| PLX31-EIP-SIE    | EtherNet/IP to Siemens Industrial Ethernet Gateway                                                                            | Communication gateway between EtherNet/IP and Siemens S7-series |
| 9355-OPD2500LENM | FactoryTalk Gateway 70k Tag Limit, Data Management, Open Process Control Server Data Service, English, with RSLinx Enterprise |                                                                 |
| CMX 5480         | IoT, gateway (data concentrator)                                                                                               | Logix controller                                                |

During pilot phase, the project utilized 2 (two) Ethernet/IP to Siemens Industrial Ethernet Gateway, with each connected to a production line. The project also utilized 1 (one) FactoryTalk Gateway and 1 (one) CMX 5480 as data concentrator and IoT gateway.

Figure 4. CMX 5480 - High Level
![CMX 5480 - High Level]({{site.baseurl}}/images/ccai/cmx-5480-high-level.png)

### Security ###

Security is one of the main concern when these controllers are connected to the Internet. The project used several approaches to mitigate the concern and ensure better security:
- To ensure the project only receive data from known devices, the project utilized Azure IoT Hub security features, hence only registered devices can send data to Azure, similar to device management.
- To protect data in-tranist, the project set Azure to only receive communication through secure channel (TLS/SSL/HTTPS).
- The data concentrator is connected through customer LAN, and only got access to specific resource based on the network policy.

### Code Samples ###

The following code snippet shows the code used in Azure Stream Analytics.

```
SELECT 
    DeviceTimeStamp,
    d3025792_RealDataBrix,
    d3025792_RealDataSterilizationTemp01,
    d3025792_RealDataFlowrate01,
    d3025792_RealDataContactTime01,
    d3025792_RealDataSterilizationTemp02,
    d3025792_RealDataFlowrate02,
    d3025792_RealDataContactTime02,
    d3025792_RealDataTransferTemp,
    d3025792_RealDataTransferPress,
    d3025792_RealDataRingBowlTemp,
    d3025792_RealDataRingBowlPress,
    d3025792_RealDataRingBowlLevel,
    d3025792_RealDataFlowrateBev,
    d3025792_RealDataFlowrateSlurry,
    d3025792_RealDataPulpContent,
    d3025792_RealDataNettContent,
    d3025792_RealDataRinserPressure,
    d3025792_RealDataCIPTransTemp,
    d3025792_RealDataCIPRetTemp,
    d3025792_RealDataCIPConductivity,
    d3025793_RealDataBrix,
    d3025793_RealDataGV,
    d3025793_RealDataTransferTemp,
    d3025793_RealDataTransferPress,
    d3025793_RealDataRingBowlTemp,
    d3025793_RealDataRingBowlPress,
    d3025793_RealDataRingBowlLevel,
    d3025793_RealDataCIPTransTemp,
    d3025793_RealDataCIPRetTemp,
    d3025793_RealDataCIPConductivity,
    d3025792_BoolDataStart,
    d3025792_BoolDataStop,
    d3025792_BoolDataIdle,
    d3025792_BoolDataResume,
    d3025792_BoolDataCIPStart,
    d3025792_BoolDataCIPStop,
    d3025793_BoolDataStart,
    d3025793_BoolDataStop, 
    d3025793_BoolDataIdle,
    d3025793_BoolDataResume,
    d3025793_BoolDataCIPStart,
    d3025793_BoolDataCIPStop,
    d3025792_IntDataGeneralProgramFiller,
    d3025792_IntDataCIPStep,
    d3025793_IntDataGeneralProgramFiller,
    d3025793_IntDataCIPStep,
    d3025792_DintDataProductionCounter,
    d3025792_DintDataRejectCounter,
    d3025793_DintDataProductionCounter,
    d3025793_DintDataRejectCounter
INTO
    [ccai-blobstorage-line3]
FROM
    [ccai-iothubcsv]

SELECT 
    DeviceTimeStamp,
    d3025792_RealDataBrix,
    d3025792_RealDataNettContent,
    d3025793_RealDataBrix,
    d3025793_RealDataGV
INTO
    [ccai-sqldatabase]
FROM
    [ccai-iothubcsv]
```

### Issues Experienced ###

- Migrating the current R scripts running on SQL Database on Premise to Azure Machine Learning (maximum capacity of 1 TB)
- Integrating Identity Authentication with Azure Directory Services and Office 365
- Sending SMTP email notification from Azure to Office 365
 
## Opportunities Going Forward ##

After successful Pilot Project Coca-Cola Amatil Indonesia will subsequently deploy to remaining production lines. This Quinsys system is the first of its kind, which has the potential to be referenced by other Coca-Cola systems.
