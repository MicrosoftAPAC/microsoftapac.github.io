---
layout: post
title:  "Low battery small device and 3G Comm"
author: "Hiroshi Ota"
author-link: "http://twitter.com/embedded_george"
#author-image: "{{ site.baseurl }}/images/authors/photo.jpg"
date:   2016-05-19
categories: [IoT]
color: "blue"
image: "images/2017-04-10-NaturalStyle/HackFest.png" #should be ~350px tall
excerpt: It is an IoT solution using low power consumption devices and LTE lines. This solution is a case of utilizing it in a solution to prevent animal damage. 
language: English
verticals: [Government]
geolocation: [Japan]
---

Begin with an intro statement with the following details:

- Solution overview
It is an IoT solution using low power consumption devices and LTE lines. 
This solution is a case of utilizing it in a solution to prevent animal damage. 

- Key technologies used
- Azure IoT Hub
- Azure IoT Certified Device(requesting)
- Stream Analytics 
- Azure Functions 
- Event Hubs
- Storage Account 
- Power BI 
- Azure Web Apps, ASP.NET  
 

## Customer profile ##
Natural Style Co., Ltd. 
- [http://na-s.jp/](http://na-s.jp/)
- Natural Style is an ISV which has verious diverse skills for not only solution, service, application, software development but also hardware. 
- This company develop software both edge and cloud side. In addition, operate and maintain this solution. 
- Fukui pref. Japan

PCN Katsuyama Club 
- [http://pcn.club/katsuyama/](http://pcn.club/katsuyama/)
- Utilizing programming teaching materials including BASIC programming exclusive computer "IchigoJam"
By providing a place for children to learn about programming, we aim to improve ICT literacy,
By raising interest in manufacturing, we will contribute to nurturing local human resources
- This organization build physical cage trap and is user of this solution. 
- Fukui pref. Japan


 
## Problem statement ##
In Japan, in the vicinity of the mountain area, the damage caused by agricultural crop disasters and inhabitants is attacked by wild boars and the like is frequent. A countermeasure to prevent animal damage is necessary. As countermeasures against beast damage, it is common to install a cage trap to exterminate the wild boar caught into it. 
However, the installation place of the cage trap is in the mountains so that it is difficult to frequently look around. In addition, In Japan where gun control is severe, unless the capture of a wild boar in a cage trap has been confirmed, hunter can't get permission to carry a gun. As a result, it takes a great deal of time to capture.
For effective disinfection, a cage trap capable of remote monitoring is necessary. 
In Kashiyama city, Fukui Prefecture, there is a request to grasp the operation situation of about 60 units for countermeasures against beast damage (for wild boar) installed in the mountains. 
In paticular, 
- To notify administrator by mail when a cage trap works. 
- To record the operation status of the cage trap and generate a report in a form that is easy to grasp intuitively. 

Cage-trap controller must be battery-powered, low power consumption device because the installation site is in the mountains and there is no electric power. 
For the same reason, it must be possible to connect to the Internet with a wireless public telephone network(eg. 3G comm). 
![Requirements Overview](/images/2017-04-10-NaturalStyle/RequrementsOverview.png)

Overview of the cage trap is shown in the picture bellow. 
![Cage Trap Overview](/images/2017-04-10-NaturalStyle/CageTrapOV.png) 
Install a distance sensor and a solenoid connected to "IchigoJam" in the cage trap. 
The distance sensor senses that the wild boar has entered the cage trap, and close the door. At the same time notify that the trap has worked to Microsoft Azure cloud by [SAKURA internet](https://www.sakura.ad.jp/)'s communication module(LTE) β via [SAKURA internet](https://www.sakura.ad.jp/)'s "Sakura IoT Platform β" service.
[IchigoJam](http://ichigojam.net/) and SAKURA internet's communication module (LTE) β communicate with I2C after applying signal level conversion (3.3 V <-> 1.8 V). By using POKE of IchigoJam BASIC, application create a byte string according to the specification of the communication module on the memory and send it by I2CW command of IchigoJam BASIC. 
![System overview](/images/2017-04-10-NaturalStyle/SystemOverall.png) 
[IchigoJam](http://ichigojam.net/) is low electroc power board and low price hardware. The firmware of IchigoJam has a capability of connect to Microsoft Azure and application can be written by BASIC language. This board is applying for Azure IoT Certified Program. 


## Solution and steps ##
For this project, the following was decided as a prerequisite. 
- Use IchigoJam as main controller 
- Use SAKURA internet as wireless communication line, as a result, using SAKURA internet communication module daughter board. 

We held two day HackFest in Natural Style office. Before HackFest, Microsft send some technical reference to Natural Style via e-mail and SNS, Natural Sytle's had training and preparation.   

### Hacfest core team 
- Takamasa Mitsuji - Director, Natural Style Co., Ltd. 
- Kazuo Tanikawa   - Instructor, PCN Katsuyama Club 
- [Hiroshi Ota](http://twitter.com/embedded_george) - Technical Evangelist, Microsoft

![HackFest](/images/2017-04-10-NaturalStyle/HackFest.png)
We discussed about solution for the problem and decided system architecutre on the first day of the morning. After this, we confirmed steps of work and goal of the HackFest. We spend rest time to build system. 
![Architecure](/images/2017-04-10-NaturalStyle/IoTArchitecture.png) 

### Ichigo Jam application 
Following code is application on Ichigo Jam. This code sense distance sensor, control solenoid and send data to cloud. 
```basic
1 'INOSHISHI VER:1.2
8 C=0:N=0
9 OUT 4,-1
10 V=(ANA(8)*19/12)+70
11 D=1024-ANA(2)+C
15 ?V;"   ";D
20 IF D<V N=N+1 ELSE N=0
25 IF 3<=N OUT1:WAIT30:OUT0:LED1:GOSUB10010:END
30 GOTO10

5 I=1011
6 H=#00

10010 E=#21: S=#0A: T=#49
10020 L = I % #100
10030 M = I / #100
10040 P= E ^ S ^ H ^ T ^ L ^ M
10050 POKE #700,E,S,H,T,L,M,#00,#00,#00,#00,#00,#00,P
10060 R=I2CW(#4F,#700,1,#701,12)
10070 RETURN
```

Solution steps on the cloud side is following. 
![Solution Steps on the cloud side](/images/2017-04-10-NaturalStyle/SolutionStepsOnCloudSide.png) 

### Gateway SAKURA internet to Azure IoT Hub 
SAKURA internet service has feature to regist the HTTP REST API end point as transfer destination when request coming.
We create HTTP REST api supported Azure Function and register the endpoint to SAKURA internet service user configuration dashboard. 
The function work as Gateway on cloud side. When the gateway function is called, access to Azure IoT Hub Device Twin repository and get the device Key of received cage's id by using Azure IoT Hub's registry api and transfer data to Azure IoT Hub by using Azure IoT Hub messaging api. 
Sample code of this gateway is following.
```csharp
#r "Newtonsoft.Json"

using System.Net;
using Microsoft.Azure.Devices.Client;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Text;

public static async Task Run(HttpRequestMessage req, TraceWriter log)
{
    string postData = await req.Content.ReadAsStringAsync();
    dynamic json = JsonConvert.DeserializeObject<dynamic>(postData);

    string deviceId;
    try {
        deviceId = json.payload.channels[0].value;        
    }catch(Exception ex){
        // device status message
        // do nothing
        return;
    }
    var connStr = Environment.GetEnvironmentVariable("IOTHUB_BROWSER_CONNSTR");
    var manager = Microsoft.Azure.Devices.RegistryManager.CreateFromConnectionString(connStr);
    var device = await manager.GetDeviceAsync(deviceId);
    if (device != null)
    {
        var twin = await manager.GetTwinAsync(deviceId);

        double la = 0.0;
        double lo = 0.0;
        if(twin.Tags.Contains("naturalstyle"))
        {
            dynamic props = twin.Tags["naturalstyle"];
            la = props.location.latitude;
            lo = props.location.longitude;
        }
        log.Info($"la:{la},lo:{lo}");

        var ns = new {
            location = new {
                latitude = la,
                longitude = lo
            }
        };
        json.naturalstyle = JToken.FromObject(ns);

        string uri = Environment.GetEnvironmentVariable("IOTHUB_URI");
        string deviceConnStr = "HostName=" + uri
                             + ";DeviceId=" + deviceId
                             + ";SharedAccessKey=" + device.Authentication.SymmetricKey.PrimaryKey;
        var client = DeviceClient.CreateFromConnectionString(deviceConnStr);
        await client.OpenAsync();
        await client.SendEventAsync(new Message(Encoding.UTF8.GetBytes(json.ToString())));
        await client.CloseAsync();
    }
}

```
By adopting this style. It does not need to have a security key on the Ichigo Jam side, so it is secure and easy to set up cage trap at the time of provisioning. In addition, installation location information (longitude and latitude) is also stored in Device Twin repository. 
To use SDK libraries 'Microsoft.Azure.Devices" and 'Microsoft.Azure.Devices.Client' published from nuget service, it was very easy to implement. 
The portal website to regist/update cage traps is build by using ASP.NET on Azure Web Apps. 
With reference to last part of Step 9 in [Hands-on content](http://aka.ms/IoTKitHoLV3On), it was easy to grant access to the Web portal by utilizing App Service and ASP.NET authentication setting. 

### Stream data set processing and sending e-mail
We use Azure Stream Analytics for coming data from Ichigo Jam to process and produce trigger of email sending, data for report and logging data. 
![around Stream Analytics](/images/2017-04-10-NaturalStyle/StreamAnalyticsStructure.png) 
```sql
WITH
temp AS (
    SELECT
     GetRecordPropertyValue(GetArrayElement(payload.channels,0),'value') AS cageid,
     DATEADD(hour,9,GetRecordPropertyValue(GetArrayElement(payload.channels,0),'datetime')) AS eventdt,
     naturalstyle.location.latitude AS latitude,
     naturalstyle.location.longitude AS longitude
    FROM fromIotHub
),
events AS (
    SELECT
        cageid,
        eventdt,
        latitude,
        longitude,
        DATETIMEFROMPARTS(YEAR(eventdt),MONTH(eventdt),DAY(eventdt),0,0,0,0) AS eventdate,
        DATEPART(hour,eventdt) AS eventhour
    FROM temp
)
SELECT * INTO toPowerBI FROM events
SELECT * INTO toSendGrid FROM events
SELECT * INTO toTableStorage FROM events
```
The output "toSendGrid" is binded to Event Hub. A function binds to the Event Hub so that logic on the function runs at the time of message receive on the Event Hub. 
The logic of the function is following. 
```csharp
#r "Newtonsoft.Json"
#r "SendGrid"

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SendGrid.Helpers.Mail;

const string mailTo = “admin@example.com";

public static Mail Run(string message, TraceWriter log)
{
    log.Info($"message: {message}");
    
    dynamic json = JsonConvert.DeserializeObject<object>(message);

    // JSONから必要なパラメータを取り出す
    int numb = json.cageid;
    DateTime ltime = json.eventdt.ToObject<DateTime>();
    string time = ltime.ToString("yyyy/MM/dd HH:mm:ss"); // 日本風フォーマット
    double la = json.latitude;
    double lo = json.longitude;

    // メール作成
    string subject = $"[Monitoring Cage Trap] Cage Trap:{numb} has closed!";
    string mapurl  = "map service url";
    string body    = $"Cage Trap has closed!\nCage Trap No: {numb}\nDate Time: {time}\nPlace: {mapurl}?q={la},{lo}";

    log.Info(subject);
    log.Info(body);

    var mail = new Mail(null, subject, new Email(mailTo), new Content("text/plain", body));
    mail.TrackingSettings = NewTrackingSettings();
    return mail;
}
```
Azure Functions provide SendGrid binding as default so that this implementation is also very easier. 

### Sample Dashboard by Power BI 
Power BI shows summary information of generated data from Azure Stream Analytics. 
We can made a dashboard like follwoing easier. 
![Power BI dashbaord](/images/2017-04-10-NaturalStyle/PBIDashboard.png)
To use Power BI, it is very easy to make verious dashboard for verious scenarios. 


## Conclusion ##
During HackFest, we've finished to develop concept level base-line. 
- By using "SAKURA internet's IoT Platform β", it was relatively easy to make "IchigoJam" have a communication using a 4G line. However, adjustment of the signal voltage was necessary. 
- By using "Azure IoT Hub" and "Azure Functions", it was easy to link events detected by IchigoJam to "Microsoft Azure". 
- By using "Asure Stream Analytics", it was possible to extract only the necessary part from the motion event data in "Azure IoT Hub" and output it easily to the cooperation destination such as "Power BI" and "Event Hub". It was easy to correspond to multiple output destinations. 
- By using "Event Hub" and "Azure Functions", it was easy to create an application to be started when an action event occurred. 
- By using "SendGrid", we was able to send mail without worrying about the processing capacity of a specific mail server implementation. 
- By using "Power BI", it was easy to generate reports from various events. 
In the next step, this system needs more improvement. 
- Since the power supply is limited in the mountains, it is necessary to turn on the power of "IchigoJam" and "Sakura's communication module (LTE) - β version" only when necessary. 
- In order to prevent malfunction, ingenuity to enhance the directivity of the distance sensor is necessary.

Natsural Style says about impressions through the two-day event, 
>"In this time, we have completed construction in advance,
I prepared it well and planned to go to HackFest.
However, on how to utilize IoT Hub
I got a wonderful idea that I did not expect here,
Because I use an unknown library, I can shape it in two days,
I felt a bit uneasy honestly until the first half of the first day.
Just tell us the basic way of Azure,
As we examine the sample code,
At the end of the first day, although the implementation was not advanced,
Anxiety was gone.
On the 2 nd day, as I thoroughly studied it on the 1st day, the crisping work progressed,
I was able to finish the implementation up to what I had assumed.
This time it was Hack Fest with Evangelist one to one,
I think that it was a luxurious experience when I finished.
Next time I would like to invite several other employees.
Finally, although this skill shortage is big,
I was sorry that the dashboard sharing did not go well."

Opportunities going forward 
- In fact there are cases in which animals other than wild boars are mistakenly captured. By making use cognitive service etc, aim to raise accuracy. 
- We want to aim at a more convenient system by combining various data related to the frequency of wild boars such as weather conditions. 
- It is not only Fukui Prefecture, but also the problems that are suffering from beast damage in various parts of Japan. We would like to aim for installation of this mechanism in all over Japan.
- There are many IoT scenarios recommended not only for countermeasures against beast damage but also low power consumption devices and LTE lines, so we would like to apply it to other scenarios. 
