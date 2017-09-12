---
layout: post
title:  "Live Monorail monitoring solution using Microsoft IoT with Scomi Engineering"
author: "Aswin C."
author-link: "https://twitter.com/mraswinc"
#author-image: "{{ site.baseurl }}/images/authors/photo.jpg"
date:   2017-01-19
categories: [IoT]
color: "blue"
image: "images/ScomiEngineering/Portal1.png" #should be ~350px tall
excerpt: Scomi Engineering developed Live Monorail monitoring using combination of open source technologies and .NET on Microsoft IoT platform 
language: [English]
verticals: [Logistics]
geolocation: [Malaysia]
permalink: /scomiengineeringiot.html
---

Microsoft worked together with Scomi Engineering Bhd, a monorail manufacturer based in Malaysia to develop a PoC (proof of concept) for their live monorail monitoring solution using Azure IoT services. This would enable their customer to view the telemetry of the trains including faults so that it could be rectified quickly as well and as well as building up the data required for predictive maintenance in the future by using Machine Learning.

Key technologies:
-Proprietary Vehicle Management System (VMS) controller
-Azure IoT Hub
-Azure Stream Analytics
-Azure CosmosDB
-Azure SQL DB
-Bing Maps with ASP.NET Web Form
-Azure App Service

The project team:
1. Peter John Edwards, Vice President – Engineering, Scomi Engineering Berhad
2. Foo Yeun Yong, Vehicle Management System Manager, Scomi Engineering Berhad
3. Aswin C. , Sr. Technical Evangelist, Microsoft Malaysia
4. Tham Cheng Bin, Technical Evangelist, Microsoft Malaysia
5. Zalina Halim, Audience Marketing Manager, Microsoft Malaysia

## Customer profile ##
[Scomi Engineering Bhd](http://www.scomiengineering.com.my) is a subsidiary company of Scomi Group Bhd, a global service provider in the oil & gas and transport solutions industries based in Malaysia.

Scomi Engineering offers total systems and solutions covering public transportation spanning from conventional rail systems to buses and deliver the management and integration systems to complement these products. Monorails are an area of increased focus for Scomi Engineering, and is one of few companies in the world providing integrated monorail solutions.

## Problem statement ##

Scomi Engineering deployed monorails in few different countries including Malaysia, India and Brazil. With the experience in those years, comes the awareness how they could create the next generation platform for their customers whether existing or new customers to improve the operation, maintenance and riding experience.

Scomi Engineering wanted to explore a live/automated way of gathering telemetries from their train into a centralized environment.Foo Yeun Yong, the Vehicle Management System Manager and an engineer himself, had attended the IoT Hackfest in Singapore organized by Microsoft and Intel and from the hackfest, he got an idea how to enhance his current solution and connected with Microsoft on how to realize the idea.

Currently, the train captain that is operating the monorails have to report in the status and alerts from the train to the Operation Control Center manually using the communication system available in the train. This might cause some miscommunication and delays in rectification of the issues and eventually might cause downtime to the monorail service. Besides that, with this telemetry, human error factor could be reduced or elimanated altogether. 

With the goal in mind, the technical objectives were set
1. How to pull data from train's Vehicle Management System (VMS) and push it to the cloud?
2. What is the best way to store and view the data being received in the cloud?
3. How should we present the data? In PowerBI or Web?

<img alt="Discussion" src="{{ site.baseurl }}/images/ScomiEngineering/Discussion.png" width="960">

<img alt="Coding" src="{{ site.baseurl }}/images/ScomiEngineering/Coding.png" width="960">

## Solution and steps ##

<img alt="AzureResources" src="{{ site.baseurl }}/images/ScomiEngineering/AzureResourceGroup.png" width="960">

One of the first key step in the whole solution is pulling the data from VMS controller and sending the telemetry to Azure IoT Hub. Onboard the monorail, contains a powerful Linux based machine that powers some of the functionalities in the monorail. Hence, for the pulling data portion, we have decided to write a Python based program to extract the telemetry from VMS controller as Python is a cross-platform language.

For this PoC, we have decided to use Rockwell automation controller to simulate the controller in the train. However, for a real production controller, the controller would be using a proprietary controller that conforms to EN50155, which is an international regulation covering electronic equipment for railway applications.

For the pushing of telemetry data, we have experimented with various ideas including the idea with using a specialized gateway to push the data into IoT Hub. However,  we have decided to use the Linux machine instead as it is both capable of pulling data from controller and sending the data to IoT Hub. As the pulling of data program is written using Python, we have also decided to write a Python program to send the data to Azure IoT Hub. In IoT, there are a lot of choices to choose in terms of connection protocol. We have chosen to use HTTPS as it is secured and we need it to support large file size.

Ubuntu 16.04 LTS based Linux machine is used in this PoC to simulate the onboard computer in the train. However, in the train, Kontron fanless operational Computer is used and the model used is a certified Gateway enabling data connectivity to telemetry devices, station and train control.

We have set to push the data every 5 seconds which is good for the PoC purpose. For real production environment, this value can be changed to be as often as 1 second.

<img alt="Architecture" src="{{ site.baseurl }}/images/ScomiEngineering/Architecture.png" width="960">

On the cloud side, I have setup the workflow in which Azure IoT Hub will ingest the data from the VMS controllers and output it through Azure Stream Analytics for near real-time data analysis. Stream Analytics is configured to output its data to Cosmos DB. We have chosen to use Cosmos DB as it stores the data in json format and it is also schema-free. Besides that, the Cosmos DB is chosen as it would be used as repository for machine learning in the future once we have collected enough data.

<img alt="CosmosDB" src="{{ site.baseurl }}/images/ScomiEngineering/AzureCosmosDB.png" width="960">

In deciding the presentation layer, we have decided to go with ASP.NET Web Form. This is mainly because we need to embed Bing Maps with polylines and showing the real-time location of the monorail. I have written the ASP.NET Web Form application that is hosted in the Azure Web App and the web application will query the data from Cosmos DB and will populate the data accordingly including showing the location of the monorail using Bing Maps. I have also used the SQL Azure database to store the user profiles for authentication and authorization for the web application. The web application is polling the CosmosDB every 5 seconds using AJAX.

<img alt="PortalMain" src="{{ site.baseurl }}/images/ScomiEngineering/Portal1.png" width="960">

<img alt="PortalDetail" src="{{ site.baseurl }}/images/ScomiEngineering/Portal2.png" width="960">

## Technical delivery ##
The client or the controller is using Python SDK for Azure IoT Hub and the message is being sent about 5 seconds once as it is not too crucial and it is also costly for it to be in the precision of 1 second.

POC_Looping_Main.py
```python

MsgSender = D2CMsgSender('HostName={iothubname}.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey={SharedKey}')
print(MsgSender.sendD2CMsg('RSV21',msgstring))

```

For the library used, we're using the [Device to Cloud sample for Python](https://github.com/Azure-Samples/iot-hub-python-get-started/blob/master/Python/device/d2cMsgSender.py) in Github

MsgSenderGateway.py
```python
import base64
import hmac
import hashlib
import time
import requests
import urllib

# from flask import Flask # for python 2
# import urllib.parse for python 3

class D2CMsgSender:
    API_VERSION = '2016-02-03'
    TOKEN_VALID_SECS = 10
    TOKEN_FORMAT = 'SharedAccessSignature sig=%s&se=%s&skn=%s&sr=%s'
    def __init__(self, connectionString=None):
        if connectionString != None:
            iotHost, keyName, keyValue = [sub[sub.index('=') + 1:] for sub in connectionString.split(";")]
            self.iotHost = iotHost
            self.keyName = keyName
            self.keyValue = keyValue
    def _buildExpiryOn(self):
        return '%d' % (time.time() + self.TOKEN_VALID_SECS)
    def _buildIoTHubSasToken(self, deviceId):
        resourceUri = '%s/devices/%s' % (self.iotHost, deviceId)
        targetUri = resourceUri.lower()
        expiryTime = self._buildExpiryOn()
        toSign = '%s\n%s' % (targetUri, expiryTime)
        key = base64.b64decode(self.keyValue.encode('utf-8'))
        signature = urllib.quote(
            base64.b64encode(
                hmac.HMAC(key, toSign.encode('utf-8'), hashlib.sha256).digest()
            )
        ).replace('/', '%2F')
        return self.TOKEN_FORMAT % (signature, expiryTime, self.keyName, targetUri)
    def sendD2CMsg(self, deviceId, message):
        sasToken = self._buildIoTHubSasToken(deviceId)
        url = 'https://%s/devices/%s/messages/events?api-version=%s' % (self.iotHost, deviceId, self.API_VERSION)
        r = requests.post(url, headers={'Authorization': sasToken}, data=message)
        return r.text, r.status_code
if __name__ == '__main__':
    connectionString = 'HostName=<iot-hub-name>.azure-devices.net;SharedAccessKeyName=device;SharedAccessKey=<device-policy-key>'
    d2cMsgSender = D2CMsgSender(connectionString)
    deviceId = 'iotdevice1'
    message = 'Hello, IoT Hub'
    print(d2cMsgSender.sendD2CMsg(deviceId, message))

```

The data sent is formatted in json and Stream Analytics input has been set to Azure IoT Hub. Here is a sample of how it looks like.

```json
{
	"primarypowerstatus": 0,
	"trainid": "RSV 21",
	"lowvoltagestatus": 0,
	"timestamp": 1495614376.731,
	"Alarm": [{
		"timestamp": "2017-05-24 16:26:16",
		"id": 44
	}, {
		"timestamp": "2017-05-24 16:26:16",
		"id": 1121
	}, {
		"timestamp": "2017-05-24 16:26:16",
		"id": 1121
	}, {
		"timestamp": "2017-05-24 16:26:16",
		"id": 1121
	}, {
		"timestamp": "2017-05-24 16:26:16",
		"id": 1121
	}, {
		"timestamp": "2017-05-24 16:26:16",
		"id": 1121
	}, {
		"timestamp": "2017-05-24 16:26:16",
		"id": 1121
	}, {
		"timestamp": "2017-05-24 16:26:16",
		"id": 3156
	}, {
		"timestamp": "2017-05-24 16:26:16",
		"id": 3156
	}, {
		"timestamp": "2017-05-24 16:26:16",
		"id": 3156
	}, {
		"timestamp": "2017-05-24 16:26:16",
		"id": 3156
	}],
	"hvacstatus": 0,
	"brakestatus": 0,
	"direction": 0,
	"longitude": 101.68840026855469,
	"Time_Table": {
		"MR9_Up": "2017-05-24 16:26:16",
		"MR2_Up": "2017-05-24 16:26:16",
		"MR4_Up": "2017-05-24 16:26:16",
		"MR2_Down": "2017-05-24 16:26:16",
		"MR10_Up": "2017-05-24 16:26:16",
		"MR9_Down": "2017-05-24 16:26:16",
		"MR3_Up": "2017-05-24 16:26:16",
		"MR1": "2017-05-24 16:26:16",
		"MR5_Down": "2017-05-24 16:26:16",
		"MR6_Down": "2017-05-24 16:26:16",
		"MR3_Down": "2017-05-24 16:26:16",
		"MR5_Up": "2017-05-24 16:26:16",
		"MR7_Up": "2017-05-24 16:26:16",
		"MR8_Up": "2017-05-24 16:26:16",
		"MR8_Down": "2017-05-24 16:26:16",
		"MR7_Down": "2017-05-24 16:26:16",
		"MR10_Down": "2017-05-24 16:26:16",
		"MR6_Up": "2017-05-24 16:26:16",
		"MR4_Down": "2017-05-24 16:26:16",
		"MR11": "2017-05-24 16:26:16"
	},
	"vmsstatus": 0,
	"auxiliarypowerstatus": 0,
	"latitude": 3.13215708732605,
	"propulsionstatus": 0,
	"guid": "a7f735c0405a11e7ac79005056c00008",
	"passengerdoorstatus": 0,
	"cosstatus": 0
}
```

For Stream Analytics, we have set the output into 2. One is to store the raw data in Cosmos DB Raw Collection for future machine learning purpose and some analytical purpose for the web. Another would be to filter out the alarm and input into Cosmos DB Alarm collection.

Here is the code to get the raw data. The output would be exactly the same as the input above.
```sql
SELECT
    *
INTO
    cosmosdboutput
FROM
    scomiiothub
```

Here is the code to extract alarm data from the input
```sql
SELECT scomiiothub.trainid,
    a.arrayvalue.timestamp,
    a.arrayvalue.id
INTO alarmoutput
FROM scomiiothub
CROSS APPLY GetArrayElements(scomiiothub.Alarm) as a
```

This would result in a json that looks like this
```json
[
   {
      "trainid":"RSV 21",
      "timestamp":"2017-05-24 16:26:16",
      "id":44
   },
   {
      "trainid":"RSV 21",
      "timestamp":"2017-05-24 16:26:16",
      "id":1121
   },
   {
      "trainid":"RSV 21",
      "timestamp":"2017-05-24 16:26:16",
      "id":1121
   },
   {
      "trainid":"RSV 21",
      "timestamp":"2017-05-24 16:26:16",
      "id":1121
   },
   {
      "trainid":"RSV 21",
      "timestamp":"2017-05-24 16:26:16",
      "id":1121
   },
   {
      "trainid":"RSV 21",
      "timestamp":"2017-05-24 16:26:16",
      "id":1121
   },
   {
      "trainid":"RSV 21",
      "timestamp":"2017-05-24 16:26:16",
      "id":1121
   },
   {
      "trainid":"RSV 21",
      "timestamp":"2017-05-24 16:26:16",
      "id":3156
   },
   {
      "trainid":"RSV 21",
      "timestamp":"2017-05-24 16:26:16",
      "id":3156
   },
   {
      "trainid":"RSV 21",
      "timestamp":"2017-05-24 16:26:16",
      "id":3156
   },
   {
      "trainid":"RSV 21",
      "timestamp":"2017-05-24 16:26:16",
      "id":3156
   }
]
```

For the ASP.NET Web Form, to pull data from Cosmos DB, I used CosmosDB SDK for .NET. Here's the sample code to pull the data from Cosmos DB. Then we will bind the data pulled to each control in the web application.

```csharp
using (this.client = new DocumentClient(new Uri(EndpointUri), PrimaryKey))
{
trains = this.client.CreateDocumentQuery<TrainData>(UriFactory.CreateDocumentCollectionUri(Database, Collection)).Take(50).ToList();
}
```

One of the trickiest part is the Bing Maps integration as the V8 control now uses Javascript library. To generate the polylines which is the path/tracks of the monorail including showing the location of the train using pushpin, this is the code that I have written

```javascript
<script type='text/javascript'>
        function loadMapScenario() {
            var map = new Microsoft.Maps.Map(document.getElementById('myMap'), {
                credentials: '<Your Credentials Here>',
                center: new Microsoft.Maps.Location(3.139003, 101.686855),
                mapTypeId: Microsoft.Maps.MapTypeId.aerial,
                zoom: 15
            });
            var jsonpolylines = '<%=jsonpolylines%>';
            var jsonstations = '<%=stationlist%>';
            var latitude = '<%=latitude%>';
            var longitude = '<%=longitude%>';
            var polylines = JSON.parse(jsonpolylines);
            var stations = JSON.parse(jsonstations);
            var completedpolylines=[];
            var j = 0;
            $.each(polylines, function (j, val) {
                
                var coordinatepin = new Microsoft.Maps.Location(polylines[j].lat, polylines[j].lon);
                
                completedpolylines.push(coordinatepin);
            });
            var trainlocation = new Microsoft.Maps.Location(latitude, longitude);
            var pushpin = new Microsoft.Maps.Pushpin(trainlocation, null);
            console.log(trainlocation);
            map.entities.push(pushpin);
            console.log(completedpolylines);
            var polyline = new Microsoft.Maps.Polyline(completedpolylines, { strokeColor: 'red', strokeThickness: 5 });
            map.entities.push(polyline);
            var pins = new Microsoft.Maps.EntityCollection();
            var k = 0;
            console.log(stations);
            $.each(stations, function (k, val) {

                var coordinatepin = new Microsoft.Maps.Location(stations[k].lat, stations[k].lon);
                var stationcode = stations[k].Code;
                var stationname = stations[k].Name;
                var pin = new Microsoft.Maps.Pushpin(coordinatepin, { text: 'M', title: stationcode, subTitle: stationname });
                pins.push(pin);
            });
            map.entities.push(pins);
        }
</script>

```

### Security Details

Communication between the Linux Machine and Azure IoT Hub is done through HTTPS and authenticated using Device Key that is registered in Azure IoT Hub. Access to Cosmos DB is also authneticated using key that is generated in Azure Cosmos DB settings.

The Web Application access is secured using ASP.NET Identity that provides claims based access control

## Conclusion ##

Scomi Engineering with their team managed to build the PoC together with Microsoft in the span of about 4 months with no IoT programming background. This PoC will allow them to showcase the solution as part of their add-ons in the product. They will continue to use this PoC for their next phase of providing integration with Dynamics CRM to automate the task assignment to maintenance department. Besides that, with the collection of data in DocumentDB, they also would like to be able to do predictive maintenance using Azure Machine Learning.

The success of this PoC allows Scomi Engineering to start pitching this solution to their existing and new customers. As a company that also provide transportation solutions, they're extending this project to cover other scenarios such as fleet management.

On the technical side, lessons that we have learned throughout this journey is one of them being there are a couple of ways to ingest data into Azure IoT Hub and since Python works best for the development environment and production environment, we have chosen that path. Besides that, we have to think about the intermittent connection problem that might be faced when pushing the data into the cloud.

>The success and completion of this PoC with Microsoft is one step towards greater public transport experience.” – Foo Yeun Yung, Scomi Engineering Bhd

