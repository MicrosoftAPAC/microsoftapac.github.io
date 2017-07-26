---
layout: post
title: "Using Azure IoT Suite to develop a personalized driving experience service"
author: "Eric ShangKuan"
author-link: "https://twitter.com/ericsk"
#author-image: "{{ site.baseurl }}/images/authors/ericsk.jpg"
date: 2017-05-05
categories: [IoT]
color: "blue"
image: "images/KingwaytekIoT/discussion.jpg"
excerpt: KingwayTek, the number one navigation and map service provider in Taiwan, teamed up with Microsoft to develop a new personalized driving experience service. 
language: [English]
verticals: [Logistics]
geolocation: [Taiwan]
#permalink: /<page-title>.html
---

With the popularity of 4G/LTE technology, getting data from the Internet has become easier and more efficient. KingwayTek was looking for an appropriate platform to build a vehicle-connected system to provide a more personal driving experience service to a broad range of drivers. They chose to work with Microsoft to build the system and used Azure IoT services to improve their development productivity and enable the system to handle a large number of requests.

### Key technologies

- [Microsoft Azure IoT Suite](https://www.microsoft.com/en-us/internet-of-things/azure-iot-suite)
- [Azure IoT Hub](https://azure.microsoft.com/en-us/services/iot-hub/)
- [Azure Stream Analytics](https://azure.microsoft.com/en-us/services/stream-analytics/)
- [Azure Blob storage](https://azure.microsoft.com/en-us/services/storage/blobs/)
- [Azure SQL Database](https://azure.microsoft.com/en-us/services/sql-database/?v=16.50)
- [Azure DocumentDB](https://azure.microsoft.com/en-us/services/documentdb/)
- [Azure Service Bus](https://azure.microsoft.com/en-us/services/service-bus/)
- [Azure Functions](https://azure.microsoft.com/en-us/services/functions/)
- [Azure App Service](https://azure.microsoft.com/en-us/services/app-service/)
- [Azure HDInsight](https://azure.microsoft.com/en-us/services/hdinsight/)
- [Microsoft Power BI Embedded](https://azure.microsoft.com/en-us/services/power-bi-embedded/)

### Core team

- Paddy Peng – Senior Manager, KingwayTek
- Knight Tseng – Technical Manager, KingwayTek
- Penny Jian – Engineer, KingwayTek
- Rice Li – Assistant Manager, KingwayTek
- Anne Shih – Partner Business Evangelist, Microsoft Taiwan
- [Eric ShangKuan](https://twitter.com/ericsk) – Senior Technical Evangelist, Microsoft Taiwan
- Jennifer Chiu – Audience Evangelism Manager, Microsoft Taiwan

## Customer profile

[KingwayTek Technology Co., Ltd.](http://www.kingwaytek.com/) was founded in December 2007. Its major business operation is the development of a series of digital map database products. It is the biggest map provider in Taiwan and owns most of the market share.

In 2010, KingwayTek extended their business to the navigation software field, launching a new product named [Naviking (導航王)](https://naviking.localking.com.tw/). This product uses location to develop web services (such as weather, movie information, and parking) and bundles all cell phones sold by the Chunghua Telcom channel. Naviking became a well-known navigation software and successfully brought users a new experience for multiple online services from the 3G era.

In the future, in addition to its current digital products, KingwayTek will offer more high quality products to customers by accumulating more development resources for professional map information, digital content, software tool development, and integrated software techniques.

## Problem statement

The vehicle-connected system is designed as a breadth consumer product. The customer installs an Android-based device on the car's dashboard that provides navigation services and an entertainment system (for example, customers can receive traffic prediction information or operate their own vehicle through a mobile app). The device then collects information (such as driving speed and location) and sends the collected data (telemetry data) to the cloud. 

To handle all the data sent from a large number of vehicles and process it as soon as possible, high-bandwidth data ingestion must be enabled in the system. Because data loss is inevitable in the transmission, it's important to plan for that too. Moreover, the product team would like to get more insights from the processed data.

After some discussion, we decided to use Azure IoT services to build this system to meet these criteria.

## Solution and steps

We first transformed the product specification into a system architecture. In the following photo, Eric (on the left) and Knight (on the right) work out the plan.

![Architecture discussion]({{ site.baseurl }}/images/KingwaytekIoT/discussion.jpg)

<br/>

To develop the system, we agreed to use the architecture shown in the following diagram.

![Architecture of the driving experience system]({{ site.baseurl }}/images/KingwaytekIoT/kwiot.png)

<br/>

1. Each vehicle logs telemetry data every second and batch-sends it to Azure IoT Hub every two minutes (the batching time interval is configurable).

2. Azure Stream Analytics processes data from Azure IoT Hub in real time and routes the data to the following:

    - Azure Blob storage archives all the data collected for future on-demand processing.
    - Azure SQL Database stores the vehicle trip information for one month. Customers can query the information via the mobile app.
    - Azure DocumentDB stores the latest status of a vehicle. The key data is the device ID that can be instantly inserted or updated. The status data can also be queried from the mobile app.

3. If Stream Analytics processes data that indicates an abnormal status for a vehicle, it instantly generates an item to the Azure Service Bus topic. Next, Azure Functions is triggered by the new topic in the Service Bus and sends a reconfiguration command (for adjusting the data collection interval) back to the vehicle through Azure IoT Hub. The abnormal message in Service Bus can also be subscribed to by other applications (for extension).

4. In this system, customers can download an Android/iOS app to interact with the system. A Web API service hosted by the Web Apps feature of Azure App Service can be invoked by the mobile app to retrieve the trip information stored in SQL Database and the latest status in DocumentDB.

5. Azure HDInsight transforms data stored in Blob storage to different perspectives of the data for BI and audit reports. The data size of every single computation is at least 300 GB.

6. Microsoft Power BI is used to generate reports for the auditing, business development, and engineering teams to view the correlation of the collected data.

## Technical delivery

There are four key parts in this solution:

* [Configuring a bi-directional gateway](#configuring-a-bi-directional-gateway) 
* [Configuring the Stream Analytics job](#configuring-the-stream-analytics-job)
* [Triggering the reconfiguration command](#triggering-the-reconfiguration-command)
* [Transforming the archived data](#transforming-the-archived-data)

### Configuring a bi-directional gateway

A bi-directional gateway was used for ingesting data and sending commands back to vehicles. The device installed in the vehicles is an Android-based device that provides navigation services and an entertainment system. The data from the device is transmitted through 4G/LTE and Wi-Fi networks (collaborating with a local Telecom partner). The data sender and receiver are apps on this Android device, so we can use [Azure IoT SDK for Java](https://github.com/Azure/azure-iot-sdk-java) in the Android apps to easily communicate with Azure IoT Hub.

The following segment shows how the device registers on IoT Hub.

```java
import com.microsoft.azure.iot.service.exceptions.IotHubException;
import com.microsoft.azure.iot.service.sdk.Device;
import com.microsoft.azure.iot.service.sdk.RegistryManager;

import java.io.IOException;
import java.net.URISyntaxException;
...

/**
 * Register the vehicle to the Azure IoT Hub
 *
 * @param String vechleId The vehicle's ID.
 * @return String The device ID of the vehicle registration. A null value means the failure of registration.
 */
private static String RegisterIoTHub(String vehicleId) {
    RegistryManager registryManager = RegistryManager.createFromConnectionString("IOTHUB_CONNECTIONSTRING");

    // reister with the vehicleId
    Device device = Device.createFromId(vehicleId, null, null);
    String deviceId = null;
    try {
        device = registryManager.addDevice(device);
    } catch (IotHubException iote) {
        try {
            device = registryManager.getDevice(vehicleId);
        } catch (IotHubException iotf) {
            // generate an error log
            Log.e(TAG, Log.getStackTraceString(iotf));
        }
    }

    // successfully register or get the device from IoT Hub
    if (device != null) {
        deviceId = device.getDeviceId();
    }

    return deviceId;
}
```

<br/>

The following segment describes sending data from a device to IoT Hub. If the data fails to send to IoT Hub, the data is stored in a retry queue.

```java
import com.microsoft.azure.iothub.DeviceClient;
import com.microsoft.azure.iothub.IotHubClientProtocol;
import com.microsoft.azure.iothub.Message;
import com.microsoft.azure.iothub.IotHubStatusCode;
import com.microsoft.azure.iothub.IotHubEventCallback;
import com.microsoft.azure.iothub.IotHubMessageResult;
import com.google.gson.Gson;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.Random;
import java.util.concurrent.Executors;
import java.util.concurrent.ExecutorService;

...
/**
 * The telemetry data model class.
 */
private static class TelemetryData {
    public String DeviceId;
    public double Speed;
    public double Lat;  // latitude
    public double Lng;  // longitude
    public String checksum;

    public String serialize() {
        Gson gson = new Gson();
        return gson.toJson(this);
    }
}

/**
 * Callback object of the Azure IoT Hub communication.
 */
private static class EventCallback implements IotHubEventCallback {
    public void execute(IotHubStatusCode status, Object context) {
        Log.i(TAG, "IoT Hub Responsed: " + status.name());
        if (context != null) {
            synchronized (context) {
                context.notify();
            }
        }
    }
}

/**
 * Send data to Azure IoT Hub
 * 
 * @param List<TelemetryData> telemetryDataList The list of collected data sent to Azure IoT Hub.
 */
private void sendMessageToCloud(List<TelemeryData> telemetryDataList) {
    DeviceClient client = new DeviceClient(IOTHUB_CONNECTIONSTRING, IotHubClientProtocol.HTTPS);
    // for HTTPS certificate
    client.setOption("SetCertificatePath", PATH_TO_CERTIFICATE);

    client.open();

    int partitionId = 0;
    // prepare for the sending message
    for (TelemetryData data : telemetryDataList) {
        Message msg = new Message(data.serialize());
        try {
            client.sendEventAsync(msg, new EventCallback(), partitionId);
        } catch (Exception e) {
            RetryList.add(data);
        }

        partitionId = (partitionId + 1) % NUM_PARTITIONS;
    }
    client.close();
}
```

<br/>

Because the system may send a reconfiguration command message back to the device, we have to prepare for receiving messages from IoT Hub. When we get the command message, the app will trigger a reconfiguration process.

```java
import java.nio.charset.StandardCharsets;
import com.microsoft.azure.iothub.*;

public static class CommandReceiver implements MessageCallback {

    public IotHubMessageResult execute(Message msg, Object context) {
        String command = new String(msg.getBytes(), StandardCharsets.UTF_8);
        String segs = command.split(" ");

        if ("RECONF".equals(seg[0])) {      // reconfigure command. adjust the data transmission interval.
            GlobalConfig.DATA_TRANSMISSION_INTERVAL = Integer.parseInt(segs[1]);
        } else {
            Log.w(TAG, "Unknown command: " + command);
        }
        
        return IotHubMessageResult.COMPLETE;
   }
}
```

<br/>

### Configuring the Stream Analytics job

This job processed and dispatched data to different storage locations; the query consisted of three parts:

1. Archiving all data into Blob storage.

    ```sql
    SELECT * INTO ArchiveBlob FROM TheHub
    ```

    <br/>

2. Filtering the data and stores into SQL Database.

    ```sql
    SELECT deviceId,lat,lon,speed,trackid,vehicle_status INTO TracksDb FROM TheHub
    ```

    <br/>

3. Pushing the status into DocumentDB and the Service Bus topic (the abnormal status is labeled `abnormal`).

    ```sql
    SELECT deviceId,lat,lon,vehicle_status INTO StatusDocDb FROM TheHub
    SELECT deviceId,vehicle_status INTO StatusTopic FROM TheHub WHERE vehicle_status = 'abnormal'
    ```

<br/>

### Triggering the reconfiguration command

The Azure Functions app is set to be triggered when a new item is inserted into the Service Bus topic. The function app sends a reconfiguration command through Azure IoT Hub back to the vehicle. Because the engineers at KingwayTek are very familiar with C#, the function app is written in C# instead of Node.js. The function app can also be installed from .NET packages from NuGet. In this case, the [Microsoft.Azure.Devices](https://www.nuget.org/packages/Microsoft.Azure.Devices/) package needs to be installed to communicate with IoT Hub.

```csharp
using System.Text;
using Microsoft.Azure.Devices;
using Newtonsoft.Json;

public class VehicleStatus
{
    public string VehicleId;
    public string Status;
}

public static void Run(string mySbMsg, TraceWriter log)
{
    VehicleStatus status = JsonConvert.DeserializeObject<VehicleStatus>(mySbMsg);

    // create IoT Hub connection.
    ServiceClient serviceClient = ServiceClient.CreateFromConnectionString("{IOTHUB_CONNECTIONSTRING}");

    // Composing the command message
    // reconfiguration command and set the frequency to 30,000 ms.
    var commandMessage = new Message(Encoding.ASCII.GetBytes("RECONF 30000"));
    // send command to specified device.
    serviceClient.SendAsync(status.VehicleId, commandMessage);
}
```

<br/>

### Transforming the archived data

Because we archived all the data in Blob storage, we can transform this data into useful information. In this case we chose Azure HDInsight to accomplish the transformation because the data size of a single transformation is at least 300 GB. After we get the average speed of the vehicles, we may use the following `Pig` script on HDInsight.

```pig
raw_data = LOAD 'BLOB_URL/{2017/02/14}/*' USING PigStorage(',') AS (hwkey:chararray, lat:int, lon:int, speed:int, status:int, roadid:chararray, epoch:long, trackid:int);

data_group_by_trackid = GROUP raw_data BY (hwkey, trackid);

speed_avg = FOREACH data_group_by_trackid  GENERATE FLATTEN(group) , AVG(data_group_by_trackid.speed);

STORE speed_avg INTO 'BLOB_URL/speed_avg.csv' USING PigStorage(',');
```

<br/>

The following `Pig` script is used to get the accumulated usage time.

```pig
timeinterval=FOREACH data_group_by_trackid GENERATE FLATTEN(group) ,  MAX(data_group_by_trackid.epoch)-Min(data_group_by_trackid.epoch);

STORE timeinterval INTO 'BLOB_URL/timeinterval.csv' USING PigStorage(',');
```

<br/>


## Conclusion

After we applied this solution and code into the system, the engineers at KingwayTek launched a first version of the product to the public. Its product name is [Autoking (樂客車聯網)](http://www.autoking.com.tw/) and it's ready to sell to car owners. All data is sent to the cloud through the HTTP over SSL protocol and uses SHA256 for the checksum, which means that this system promises data security and consistency.

Autoking's dashboard enables the user to access many services.

![Car Dashboard]({{ site.baseurl }}/images/KingwaytekIoT/cardashboard.png)

<br/>

Users can interact with their car (equipped with this product) via mobile phone.

![Mobile app]({{ site.baseurl }}/images/KingwaytekIoT/mobileapp.png)

<br/>

Microsoft and KingwayTek will continue their partnership and make efforts to enhance this product. 

Following is a quote from KingwayTek in the product launch press:

> "The key part of the connected-vehicle system is its capabilities of handling a large amount of map data and traffic situations. Using Microsoft Azure as the core infrastructure makes us more focused on business and marketing. Among various cloud platform providers, Microsoft Azure is the only cloud platform that provides end-to-end IoT solutions." —San Huang, Vice President, KingwayTek

During the technical engagement, the technical manager gave the following feedback:

> "With Azure IoT Hub, it is very easy to implement bi-directional (cloud-to-device) communication in the IoT scenario. It has capabilities of high-bandwidth data ingestion and device management. We saved a lot of time building a high bandwidth message queue."—Knight Tseng, Technical Manager, KingwayTek

Going forward, we will try to enhance the data pipeline by adopting more Azure data services (such as Data Lake and Data Warehouse) into the architecture to optimize performance and billing. In the meantime, KingwayTek can also leverage [Xamarin](http://xamarin.com/) to improve the productivity of its mobile app development.
