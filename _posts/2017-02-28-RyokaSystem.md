---
layout: post
title: "Adding IoT presence sensors to the Ryoka Systems room-availability solution"
author: "Osamu Monoe"
author-link: "https://twitter.com/osamum_MS"
#author-image: "{{ site.baseurl }}/images/authors/osamum.jpg"
date: 2017-04-19
categories: [IoT]
color: "blue"
image: "images/2017-02-28-RyokaSystem/concept.png" #should be ~350px tall
excerpt: By adding data from IoT presence sensors, Ryoka Systems enhanced their meeting-room availability solution.
language: [English]
verticals: [Facility Management]
geolocation: [Japan]
---

This Internet of Things (IoT) solution displays the availability of the meeting room in the open area to the user. It includes automatic detection of the presence of humans.

Key technologies used:

- Windows 10 IoT Core
- Azure IoT Hub
- Azure Stream Analytics
- Azure Table storage
- Azure Machine Learning
- Web Apps feature of Azure App Service
- Power BI  
  
Core team:

- Hideki Tsuji – Technology and Development Dept., Ryoka Systems
- Yuya Modeki – Embedded Solution Dept., Tokyo Electron Device
- Osamu Monoe – Developer Experience and Evangelism, Microsoft Japan
- Hiroshi Ota – Developer Experience and Evangelism, Microsoft Japan

## Company profile

[Ryoka Systems Inc.](http://www.rsi.co.jp/), located in Tokyo, was established in 1970 to provide and support Mitsubishi Kasei Corporation (currently Mitsubishi Chemical Corporation) with information processing systems. Based on the technology and the knowledge acquired through developments and operations of business management systems, they have expanded business support activities beyond the area of management systems to the planning of corporate IT strategy.

## Problem statement

Ryoka wants to make more use of conference space that is available in open areas. They also want to analyze usage and determine whether they have sufficient physical capacity to meet demands.

More broadly, Ryoka would like to accumulate knowledge and experience in IoT and put it to use in future solutions for the company.

Technical challenges include the following:

- How to determine whether a person is in the space
- How to access the Internet, either by bypassing or going through proxy authentication
- Transferring data from sensor devices to the Internet

## Proposed solution

During this hackfast, Ryoka wants to get as far as being able to confirm the usage of the conference room space.

They will mainly use human-detection sensors; however, to increase accuracy they want to apply machine learning to the data from several sensors.

Power BI will be used to analyze past usage patterns.

They want to use the usage data as an input to Azure Machine Learning and be able to predict the future usage of the conference space.

<img alt="Conceptual diagram" src="{{ site.baseurl }}/images/2017-02-28-RyokaSystem/concept.png" width="717">

## Technical delivery  

### Security details

Communication between the sensor device and Azure uses HTTPS. Azure Active Directory (Azure AD) authenticates pages for general users who display conference-room usage status.

### Device

As a result of several trials, Ryoka selected the Arduino Uno R3 as the sensor device.

- Chipset: ATmega328P
- Flash memory: 32 KB
- Programming language: C 
  
### Sensors

We use multiple sensors and Machine Learning to judge whether the source of the event is human.

- Temperature
- Light
- Humidity
- Acceleration (to sense vibrations)
- Sound

### Web apps

- Server: Azure App Service  
- Framework/Language: ASP.NET/C#  
- Authentication: Azure AD

## Storage

- Azure Table storage
  
## Learnings from the Microsoft team and the customer team

The sensor can acquire information on events such as temperature, illuminance, and humidity, but it cannot judge the meaning of an event. In other words, if we detect a warm object, we need another factor such as Machine Learning to judge whether it is a human being or a hot-water bag.
  
The amount of communication exchanged is directly reflected in the usage fee of the cloud. Therefore, it should be considered as a whole, such as the number of sensor devices to be used, the communication frequency, the memory amount of the sensor device, and the amount of data to be prepared at minimum for the analysis.

## Architecture diagram

Data from the "human detection" sensors flows to IoT Hub. Stream Analytics structures the data, which is then stored in Azure Table storage. From there, we can display the results, using the Web App feature for normal users and Power BI for administrators.
  
<img alt="Architecture diagram" src="{{ site.baseurl }}/images/2017-02-28-RyokaSystem/architecture.png" width="717">

## Example code

### Device side

```csharp
[DataContract]
public class SensorData
{
    [DataMember(Order = 0)]
    public string Messageid;
    [DataMember(Order = 1)]
    public string Devicetime;
    [DataMember(Order = 2)]
    public string Deviceid;
    [DataMember(Order = 3)]
    public string Sensorid;
    [DataMember(Order = 4)]
    public string PIRMotionSensor;
    [DataMember(Order = 5)]
    public string Temperature;
    [DataMember(Order = 6)]
    public string Humidity;
}

public sealed partial class MainPage : Page
{
    // GPIO
    private GpioController GPIO;
    private GpioPin PIRPinConnect;
    private GpioPinValue PIRPinValue;
    private const int PIR_PIN_NO = 18;

    // I2Cコントローラー名
    private const string I2C_CONTROLLER_NAME = "I2C1";
    // Grove SHT31温湿度センサーのI2Cバスアドレス（デフォルト：0x44）
    private const byte SHT31_I2C_ADDR = 0x44;
    // Measurement Commands for Single Shot Data Acquisition Mode
    private const byte SHT31_CONDITION_COMMAND_MSB = 0x2C;
    private const byte SHT31_CONDITION_COMMAND_LSB = 0x06;
    // SHT31デバイスの通信チャネル
    private I2cDevice I2C_SHT31Connect;

    private DispatcherTimer Timer;

    // IoT Hubに接続するデバイスの接続文字列（プライマリキー）を指定
    private string IoTHub_DeviceConnectionStringPrimaryKey = "<IoT Hub接続文字列>";

    public MainPage()
    {
        this.InitializeComponent();

        GPIO_Initialize();

        var task = I2C_Initialize();

        Timer = new DispatcherTimer();
        Timer.Interval = TimeSpan.FromMilliseconds(1000);
        Timer.Tick += new EventHandler<object>(DispatcherTimer_Tick);
        Timer.Start();
    }

    private void GPIO_Initialize()
    {
        GPIO = GpioController.GetDefault();
        PIRPinConnect = GPIO.OpenPin(PIR_PIN_NO);
        PIRPinConnect.SetDriveMode(GpioPinDriveMode.Input);
    }

    private async Task I2C_Initialize()
    {
        string aqs = I2cDevice.GetDeviceSelector(I2C_CONTROLLER_NAME);
        DeviceInformationCollection dic = await DeviceInformation.FindAllAsync(aqs);
        I2cConnectionSettings SHT31_i2cSettings = new I2cConnectionSettings(SHT31_I2C_ADDR);
        SHT31_i2cSettings.BusSpeed = I2cBusSpeed.FastMode;
        I2C_SHT31Connect = await I2cDevice.FromIdAsync(dic[0].Id, SHT31_i2cSettings);
    }

    private async void DispatcherTimer_Tick(object sender, object e)
    {
        string PIR_State;

        // PIRモーションセンサーの取得
        PIRPinValue = PIRPinConnect.Read();
        if (PIRPinValue == GpioPinValue.High)
        {
            PIR_State = "High";
        }
        else
        {
            PIR_State = "Low";
        }

        // 温湿度の取得
        byte[] writeBuf = new byte[2] { SHT31_CONDITION_COMMAND_MSB, SHT31_CONDITION_COMMAND_LSB };
        byte[] readBuf = new byte[6];
        I2C_SHT31Connect.WriteRead(writeBuf, readBuf);
        int temperature_Raw = ((int)readBuf[0] << 8) + (int)readBuf[1];
        double temperature_C = -45 + ((175 * (double)temperature_Raw) / (Math.Pow(2, 16) - 1));
        int humidity_Raw = ((int)readBuf[3] << 8) + (int)readBuf[4];
        double humidity_Per = (100 * (double)humidity_Raw) / (Math.Pow(2, 16) - 1);

        // JSONの作成
        SensorData sensor = new SensorData();
        sensor.Messageid = Guid.NewGuid().ToString();
        sensor.Devicetime = DateTimeOffset.Now.ToString("yyyy-MM-dd'T'HH:mm:ss.fffK");
        sensor.Deviceid = "<デバイスID>";
        sensor.Sensorid = "<センサーID>";
        sensor.PIRMotionSensor = PIR_State;
        sensor.Temperature = temperature_C.ToString();
        sensor.Humidity = humidity_Per.ToString();

        // JSONに変換
        DataContractJsonSerializer Serializer = new DataContractJsonSerializer(typeof(SensorData));
        MemoryStream ms = new MemoryStream();
        Serializer.WriteObject(ms, sensor);
        string JsonStr = Encoding.UTF8.GetString(ms.ToArray());

        // IoT Hubに送信するメッセージを作成
        Message IoTHubSendMessage = new Message(Encoding.UTF8.GetBytes(JsonStr));

        // IoT Hubと通信するためのDeviceClientインスタンスを作成
        DeviceClient deviceClient = DeviceClient.CreateFromConnectionString(IoTHub_DeviceConnectionStringPrimaryKey, TransportType.Http1);
        // IoT Hubに送信
        await Task.Run(() =>
        {
            deviceClient.SendEventAsync(IoTHubSendMessage);
        });

        Debug.WriteLine(">Time:{0}\t{1}", DateTimeOffset.Now.ToString("yyyy-MM-dd HH:mm:ss.fff"), JsonStr);
    }
}
```

### View device data page

```csharp
using System.Collections.Generic;
using System.Web.Mvc;
using Microsoft.Azure; // Namespace for CloudConfigurationManager
using Microsoft.WindowsAzure.Storage; // Namespace for CloudStorageAccount
using Microsoft.WindowsAzure.Storage.Table; // Namespace for Table storage types
using SoramachiMtgMgr.Models;

namespace SoramachiMtgMgr.Controllers
{
    public class usageController : Controller
    {
        // GET: usage
        public ActionResult Index()
        {
        // 構成ファイルから Azure Storage への接続文字列を取得
        storageAccount = CloudStorageAccount.Parse(
            CloudConfigurationManager.GetSetting("StorageConnectionString"));

        // Create the table client.
        tableClient = storageAccount.CreateCloudTableClient();
        List<sensorData> callResult = showAll();

        ViewBag.StrageData = callResult;
        return View();
    }

    static CloudStorageAccount storageAccount;
    static CloudTableClient tableClient;

    private List<sensorData> showAll()
    {
        string tableName = "iotdatatable2";
        string PartitionKey = "Device001";
        var list = new List<sensorData>();

        // Create the CloudTable object that represents the "iotdatatable2" table.
        CloudTable table = tableClient.GetTableReference(tableName);
        TableQuery<sensorData> tableQuery = new TableQuery<sensorData>();

        // Construct the query operation for all customer entities where PartitionKey="Device001".
        TableQuery<sensorData> query = new TableQuery<sensorData>().Where(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, PartitionKey)).Take(100);

        // Print the fields for each customer.
        foreach (sensorData entity in table.ExecuteQuery(query))
        {
            list.Add(entity);
        }
        return list;
    }
}
```

## Hackfest

Photos from the hackfest, held in the Soramachi OpenArea meeting space.

<img alt="Participants around conference-room table" src="{{ site.baseurl }}/images/2017-02-28-RyokaSystem/meeting1.jpg" width="490">

<img alt="Participants working on whiteboard" src="{{ site.baseurl }}/images/2017-02-28-RyokaSystem/meeting2.jpg" width="490">

<img alt="Completed whiteboard" src="{{ site.baseurl }}/images/2017-02-28-RyokaSystem/meeting3.jpg" width="490">

<img alt="Participants and whiteboard" src="{{ site.baseurl }}/images/2017-02-28-RyokaSystem/meeting4.jpg" width="490">    

## Conclusion  

This system as a foothold for Ryoka to begin studying IoT. The system is simple, but it has the elements needed to learn and apply IoT: collection of data by the sensor device, the retention and analysis of data by the cloud, and visualization by using Power BI and the Web App feature.

Based on the system we created this time, Ryoka plans to add functions according to requirements and expand them.
