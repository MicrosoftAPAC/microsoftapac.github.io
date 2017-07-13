---
layout: post
title: "Prototyping of nursing care colution with Azure IoT Platform"
author: "Kazuyuki Nomura"
author-link: "#"
#author-image: "{{ site.baseurl }}/images/Proxfinity/AuthorsPhoto350.png"
date:   2017-01-24
categories: [IoT]
color: "blue"
image: "images/2017-01-24-MountainFields/D2CMessaging.jpg"
excerpt: Recently Mountain Fields is joining in a start-up business for nursing and personal care facility. They hoped to accelerate development of cloud solution with IoT Hub and other Microsoft IoT services.
verticals: [Healthcare]
language: English
geolocation: [Japan]
---

Recently Mountain Fields is joining in a start-up business for nursing and personal care facility to harness their monitoring knowledge and experience around IoT devices and cloud computing. 
They hoped to accelerate development of cloud solution that monitors patients' health status and vitals while 
helping the experienced health care works to respond quicker and be more effective with their quality patient time.
This is the team that was involved with the HackFest:
- Hyungjun Lim – Development Lead, Mountain Fields
- Yusuke Nakajima – Development engineer, Mountain Fields
- Hiroshi Kubo – CEO, enlive
- Ayako Omori – Technical Evangelist, Microsoft 
- Kazuyuki Nomura – Technical Evangelist, Microsoft

### Key technologies
- IoT Hub
- Stream Analytics
- Document DB
- Blob Storage
- Azure Functions
- Notification Hubs
- Event Hubs
- Cognitive Services (Emotion API)


## Customer profile ##
[Mountain FIELDS, INC.](http://www.mt-fields.com/) is an IoT management company. They established management system and service of renewable energy and disaster prevention for local enterprise customers. They also plan to develop business area with high quality of Japanese IoT management services to APAC, Europe, and North America.


![People]({{ site.baseurl }}/images/2017-01-24-MountainFields/people.jpg)


## Problem statement ##
If experienced care workers take care of people requiring long-term care (patient) one by one, they are able to notice changes of their condition or accidents. However, the care workers are very lack of resources in Japan. In the nursing care industry, the younger generation tend not to become care works because of low salary and very hard work such as excretion assistance, meal assistance, and bath assistance for patient. For warmly watching patients carefully instead of experienced care workers, they hope to collect and analyze information such as vital information and moving images of each patient collected from IoT devices based on Azure PaaS, and provide insights from its data analysis. And they also hope to Raise an alert to the concerned smart device without delay when there is any changes in the patients’ conditions even minor changes.

## Solution and steps ##
Prior to the HackFest we discussed about solution architecture by looking at following UI form mock-up.
![UI]({{ site.baseurl }}/images/2017-01-24-MountainFields/UI.JPG)

The solution architecture can be represented as follows :
- Vital sensors will capture patient’s heartbeat, breathing and body motion.
- Camera will take a photo of patient’s face.
- Patient’s vital information and photo will be uploaded to IoT Hub with regularity. Photo will be stored into Azure Blob storage with IoT Hub File API.
- IoT Hub will transfer the vital data to Stream Analytics.
- Stream Analytics will insert the data into Document DB and analyze it if the patient’s health condition is changing or not using query with windowing function. If the patient’s condition is getting bad, alert message will be sent to Event Hub.
- Azure function app will be triggered by Event Hub and raise an alert message via Notification Hub.
- The application on Android smart phone will show alert message from Notification Hub.
- Other Azure function app will be triggered by inserting photo into Blob storage and call Cognitive Services Emotion API to analyze patient’s emotion, and save result of Emotion API into Document DB.
- Web form on Android smart phone will show patient’s photo image, vital sign with emotion information.
The architecture diagram is as follows.<br>

![UI2]({{ site.baseurl }}/images/2017-01-24-MountainFields/arch.jpg)

### Device Info ###
* Hardware Raspberry Pi 3 Model B
https://www.raspberrypi.org/products/raspberry-pi-3-model-b/ 

+ 1.2GHz 64-bit quad-core ARM Cortex-A53 CPU
+ 1GB RAM
+ 32GB Storage (micro SD-Card)
+ Power is line

* Operating System
RASPBIAN JESSIE WITH PIXEL (Linux based on Debian)
https://www.raspberrypi.org/downloads/raspbian/

+ Version:January 2017
+ Release date:2017-01-11
+ Kernel version:4.4

![Device]({{ site.baseurl }}/images/2017-01-24-MountainFields/device.jpg)

## Technical delivery ##
The application get the data of vital sign and picture from Edge device made with Raspberry Pi 3. 
The emotional data is made from the result of Emotion API, Cognitive Services. 
These data are shown on a dashboard (Web application made with ASP.NET) as follows.       
![Dashbord]({{ site.baseurl }}/images/2017-01-24-MountainFields/dashboard.JPG)

When the patient’s health condition is getting worse and fall below or rise above set thresholds, alert messages are sent to the device of care personnel.
They will update Windowing function in Stream Analytics to raise an alert when there would be abnormal value more than 
several times in a certain period of time as next step.<br>

Here is a sample code to analyze patient’s vital sign written as Stream Analytics query.<br>
```ASA <br>
SELECT
    datatype=1,
    userid,
    username,
    roomid,
    CONCAT('https://protoblob.blob.core.windows.net/protocontainer/image/', faceimage) AS faceimage,
    pulse,
    breath,
    move,
    pulserate,
    breathrate,
    x,
    y,
    z,
    [datetime]
INTO
    outputToDocumentDB
FROM
    input
TIMESTAMP BY CAST(CONCAT(SUBSTRING([datetime], 1, 10), 'T', SUBSTRING([datetime], 12, 2), ':', SUBSTRING([datetime], 15, 2), ':', SUBSTRING([datetime], 18, 2), '.', SUBSTRING([datetime], 21, 6)) AS datetime)

SELECT
    datatype=3,
    collectionid='protocollection',
    userid, 
    username,
    roomid,
    faceimage=CONCAT('https://protoblob.blob.core.windows.net/protocontainer/image/', faceimage),
    alertid=1,
    alertmessage='脈拍数が正常範囲を超えています',
    alertdatetime=CONCAT(CAST(DATEPART(yyyy, System.timestamp) AS NVARCHAR(MAX)), '-', CAST(DATEPART(mm, System.timestamp) AS NVARCHAR(MAX)), '-', CAST(DATEPART(dd, System.timestamp) AS NVARCHAR(MAX)), '_', CAST(DATEPART(hh, System.timestamp) AS NVARCHAR(MAX)), '-', CAST(DATEPART(mi, System.timestamp) AS NVARCHAR(MAX)), '-', CAST(DATEPART(ss, System.timestamp) AS NVARCHAR(MAX)), '_', CAST(DATEPART(ms, System.timestamp) AS NVARCHAR(MAX)))
INTO
    outputToEventHub1
FROM
    input
TIMESTAMP BY CAST(CONCAT(SUBSTRING([datetime], 1, 10), 'T', SUBSTRING([datetime], 12, 2), ':', SUBSTRING([datetime], 15, 2), ':', SUBSTRING([datetime], 18, 2), '.', SUBSTRING([datetime], 21, 6)) AS datetime)
WHERE
    pulserate != LAG(pulserate) OVER (PARTITION BY userid LIMIT DURATION(hour, 1)) AND
    (CAST(pulserate AS bigint) < 60 OR CAST(pulserate AS bigint) > 80)

SELECT
datatype=3,
collectionid='protocollection',
userid,
username,
roomid,
faceimage=CONCAT('https://protoblob.blob.core.windows.net/protocontainer/image/enliveraspi_', CONCAT(CAST(DATEPART(yyyy, System.timestamp) AS NVARCHAR(MAX)), '-', CAST(DATEPART(mm, System.timestamp) AS NVARCHAR(MAX)), '-', CAST(DATEPART(dd, System.timestamp) AS NVARCHAR(MAX)), '_', CAST(DATEPART(hh, System.timestamp) AS NVARCHAR(MAX)), '-', CAST(DATEPART(mi, System.timestamp) AS NVARCHAR(MAX)), '-', CAST(DATEPART(ss, System.timestamp) AS NVARCHAR(MAX)), '_', CAST(DATEPART(ms, System.timestamp) AS NVARCHAR(MAX))), '.jpg'),
alertid=0,
alertmessage='睡眠時無呼吸が発生している可能性があります',
alertdatetime=CONCAT(CAST(DATEPART(yyyy, System.timestamp) AS NVARCHAR(MAX)), '-', CAST(DATEPART(mm, System.timestamp) AS NVARCHAR(MAX)), '-', CAST(DATEPART(dd, System.timestamp) AS NVARCHAR(MAX)), '_', CAST(DATEPART(hh, System.timestamp) AS NVARCHAR(MAX)), '-', CAST(DATEPART(mi, System.timestamp) AS NVARCHAR(MAX)), '-', CAST(DATEPART(ss, System.timestamp) AS NVARCHAR(MAX)), '_', CAST(DATEPART(ms, System.timestamp) AS NVARCHAR(MAX)))
INTO outputToEventHub2
FROM input
TIMESTAMP BY CAST(CONCAT(SUBSTRING([datetime], 1, 10), 'T', SUBSTRING([datetime], 12, 2), ':', SUBSTRING([datetime], 15, 2), ':', SUBSTRING([datetime], 18, 2), '.', SUBSTRING([datetime], 21, 6)) AS datetime)
GROUP BY userid, username, roomid, HoppingWindow(second, 4, 1)
HAVING MAX(ABS(CAST(pulse AS bigint))) < 15000 AND MAX(ABS(CAST(breath AS bigint))) < 15000 AND MAX(ABS(CAST(move AS bigint))) < 15000
```

Here is sample code to raise an alert message toward Android smart phone written as Azure Function app triggered by Event Hub.<br>
```csharp <br>
#r "Microsoft.Azure.NotificationHubs"
#r "Newtonsoft.Json"

using System;
using Microsoft.Azure.NotificationHubs;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

public static async Task Run(string myEventHubMessage, IAsyncCollector<Notification> notification, TraceWriter log)
{
    myEventHubMessage = myEventHubMessage.Remove(0, 1);
    myEventHubMessage = myEventHubMessage.Remove(myEventHubMessage.Length - 1, 1);

    string gcmNotificationPayload = myEventHubMessage;

    await notification.AddAsync(new GcmNotification(gcmNotificationPayload));
}
```

For device message originally we prepared dummy data for vital sign with over 6,000 records for 1 minute, but since it’s not realistic scenario, 
we will send data (512 byte per device) every 5-10 seconds to Azure.
Here is example of messages.<br>

```device message <br>
[
    '{"y": 0, "datetime": "2017-01-26_11-38-49_733436", "x": 0, "pulse": "-2709", "userid": "1", "faceimage": "", "move": "3377", "roomid": "101", "username": "Steven Seagal", "breathrate": "13", "breath": "8374", "z": 0, "pulserate": "52"}',
    '{"y": 0, "datetime": "2017-01-26_11-38-50_648381", "x": 0, "pulse": "-2161", "userid": "1", "faceimage": "", "move": "1673", "roomid": "101", "username": "Steven Seagal", "breathrate": "13", "breath": "9429", "z": 0, "pulserate": "52"}',
    '{"y": 0, "datetime": "2017-01-26_11-38-51_509553", "x": 0, "pulse": "-1258", "userid": "1", "faceimage": "", "move": "-2275", "roomid": "101", "username": "Steven Seagal", "breathrate": "13", "breath": "9578", "z": 0, "pulserate": "52"}',
…
```

Even though IoT Hub File API is available for uploading images from device, we uploaded it to Blob storage at the HackFest because of running out.
We will use the following sample code for next step.<br>
http://blog.jongallant.com/2017/01/azure-iot-hub-file-upload-python/<br> 
Here is code example for device to cloud messaging working on Raspberry Pi 3.<br>

```device message <br>
def main():
    # Definition for camera on Raspberry Pi
    cam_w = 640
    cam_h = 480

    video_capture = picamera.PiCamera()
    video_capture.resolution = (cam_w, cam_h)

    # Definition for window
    cv2.namedWindow('Video')

    # Capturing image with camera
    stream = io.BytesIO()
    for foo in video_capture.capture_continuous(stream,"jpeg",use_video_port=True):

        # showing vector of face direction
        # showing vital sensor info.
        face_recognition()

        # send cropped face image to blob storage
        current_datetime = datetime.now().strftime("%Y-%m-%d_%H-%M-%S_%f")[:-3]
        str_faceimage_filename = "enliveraspi_" + str(current_datetime) + ".jpg"

        thread1 = threading.Thread(target=block_blob_service.create_blob_from_path, 
                args=('protocontainer',
                'image/'+str_faceimage_filename,
                str_faceimage_filename,
                ContentSettings(content_type='image/jpeg'),))
                thread1.start()

        # receiving serial data from vital sensor and formatting to JSON
        result_json = serial_main()

        # send JSON data(vital info, user ID, url of face image, etc.) IoTHub
        iotHubClient = IoTHubClient("xxxxxxxxxxxxxxxxxxxxxxxxxxx",IoTHubTransportProvider.HTTP)
        message = IoTHubMessage(str(result_json)) 
        message.message_id = "message_%d" % int_json_count
        message.correlation_id = "correlation_%d" % int_json_count
        iotHubClient.send_event_async(message, send_confirmation_callback, int_json_count)
        result_json.clear()

        cv2.imshow('Video', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'): break
   
    ser.close()
    video_capture.close()
```


## Security consideration ##
This HackFest was out of the scope on security because we had not enough time. As next step we will implement security on the protocol level.  

 
## Conclusion ##
They had experience of application development for Azure with Cloud services, but was unfamiliar with our IoT platform technology.
In spite of it we had done with implementing one end-to-end scenario during the four days HackFest, 
we realized high development productivity with Azure IoT platform. 
In fact they were satisfied with getting things to work in four days with support from Microsoft, 
because their previous IoT product (energy management service on Azure) was built with ASP.NET MVC and it was hard to implement, but IoT Hub was very easier for them.
We found also such an effort was good for brushing up architecture because we could learn pros/cons of our concept earlier. 
They are also willing to try to detect patient falling of the bed with Kinect sensor, and we aim to bring this POC into production in Q2 CY17. 
