---
layout: post
title:  "Sumitomo Cement Computer Systems Co., Ltd"
author: "Daiyu Hatakeyama"
author-link: "# https://twitter.com/dahatake"
date:   2016-05-19
categories: [IoT]
color: "blue"
image: "images/2017-02-16-SumitomoCementComputerSystems/RasPiWithSerialPortpng.png"
excerpt: The remote-control system with very legacy device make new business scenario. Also, IoT Hub SDK flexibility make this thing so easy.
language: [English]
verticals: Manufacturing & Resources
geolocation: [Japan]
---

- Solution overview
  - Liquid concrete controlling remote service 
 
- Key technologies used:
  - Azure IoT Suite, Azure App Services, Azure SQL Database
 
- Core Team:
  - Takechi Ichikawa, Lead SE, Sumitomo Cement Systems
  - Masahito Sato, SE, Sumitomo Cement Systems
  - Tsuyoshi Minamino, SE, Sumitomo Cement Systems,
  - Daiyu Hatakeyama, Technical Evangelist, Microsoft Japan
  - Saki Homma, Technical Evangelist, Microsoft Japan

## Customer profile ##
This section will contain general information about the customer, including the following:

- Company name
  - Sumitomo Cement Systems (http://www.sumitem.co.jp/)

- Company description
  - As a subsidiary of Sumitomo Osaka Cement Co., Ltd., Sumitomo Cement Computer Systems Co., Ltd provides IT support to the parent company as well as conduct development and sales of quality, shipping, sales, and automatic vehicle monitoring (AVM) systems for ready-mixed concrete, building management systems, and facility repair and inspection operation support systems.

- Company location
  - Tokyo, Japan (HQ)

## Problem statement ##
Customer provide cement control services for liquied concreate factory. When mixer track come in front of cement mixer, driver control the panel according to billed orderd value on billed paper.

The `control panel` which controls the plant in the liquid concrete factory adjusts the quantity of liquid concrete such as the order quantity and mixing based on the temperature of the day and the amount of advance ordering for liquid concreate truck cars.

On the device side, the PC and the control panel having many ports are connected mamually by `RS - 232C (terminal equipment) `, and the device life spans more than 20-30 years. Therefore, the control panel RS-232 connection is still required. In addition when the track driver departs from the factory to the customer, he or she carries the sales slip printed from the `dot impact printer`.
When the system related to the control panel, and the dot impact printer goes down, the sales losses would be occurred because sales activities stop. Therefore, it would take time to review their system based on the cloud services. 

Since the control panel cannot be controlled unless employees go to the factory, employees manually input the order planning in another system after printing data, which caused less work efficiency.

## Solution and steps ##
 ![DiscussionBoard]({{site.baseurl}}/images/2017-02-16-SumitomoCementComputerSystems/00-DiscussionBoard.png)

### Message flow ##
- The control panel of the liquid concrete factory and the Windows PC are connected by RS-232C, and the PC sends the control data to the control panel upon receiving the shipping instruction from web application on Azure.
- The PC transmits the control message received from the control panel to the Web application of the cloud.
- Since employees can give the shipping instruction and confirm the status of the control panel through web application, they are able to operate shipping instruction from outside of the factor (It is not limited to operations inside the factory as before).
- The real control panel is huge, and it is impossible to quickly confirm. So, we use existing emulator.

  ![Architecture Diagram]({{site.baseurl}}/images/2017-02-16-SumitomoCementComputerSystems/01-SystemArchitecture.png)

### Technical Components ###
- Azure IoT Hub
  - Covering Gateway for send and receive data from the cloud services.
  - This should cover existing Win32 App and Raspberry Pi as prototype.
- Azure Web App
  - new Web UI that can be easy handled by existing employees such as truck drivers.
- SQL Database
  - When the above becomes feasible, it will be easier for employees to place liquid concrete order correctly because the data from each plant will be accumulated on the cloud.
  - The amount of transaction is small. So SQL Database is better to consider any connected other system (LOB, Dashboard like Power BI, Data Analytics system for future Machine Learning).
- Azure Functions
  - To send message to Web UI and Database records, We use ASP.NET SignalR. Azure Functions is easy to handle EventHub message by Triger, so, Stream Analytics -> Event Hub -> Azure Functions enable this very quickly and high scale also, cost effective.

## Technical delivery ##
- Security details
  - We ensure all communication is encrypted by IoT Hub. It cover easier to ensure data encryption, identity and authentication for each device.
  - Web App require authentication by Azure AD (This is not implemented yet) that ensure only permitted use can log in system from remotely.
  - The all of persistant data stored SQL Database with Transparent Data Encryption feature to ensure high security and ensure no change the applicatoin code. This data is important because it impact to billing for each transactions.
  
- Device used
  - We bring `emulator` that use as productoin test for this time. This is very important that how much additional coding task happened or not.
  - Raspberry Pi II as Prototype. The device has 1 GB of memory, 8 GB of storage and uses line power and Ethernet for connectivity. It is running Windows 10 IoT. They are using the Azure IoT Device SDK and writing their device app in C#.
  - The same code including Serial port read/write library run both PC with `emulator` and Raspberry Pi II. We used USB type Serial Port device in this time.
  - ![RasPiWithSerialPort]({{site.baseurl}}/images/2017-02-16-SumitomoCementComputerSystems/06-RasPiWithSerialPortpng.png)

- Azure IoT Hub
  - Device messages sent (less than 1KB packet size, send about 5 times in single control operation, totally 100 message in a day per device)
  - ![Emulator]({{site.baseurl}}/images/2017-02-16-SumitomoCementComputerSystems/02-emulator.png)

``` cs:IoT-Hub-Device-SDK

            Thread thread = new Thread(() =>
            {
                connectSerialDeveice.StartThread("COM1");

                ReceiveCommands();

                while (connectSerialDeveice != null)
                {
                    if (connectSerialDeveice.ReceiveFlag == 1)
                    {
                        SendData sendData = SetSendData(connectSerialDeveice.ReceiveDataSerial);

                        sendData.deviceid = "IoTHubDeviceID";
                        var payload = JsonConvert.SerializeObject(sendData);
                        var message = new Message(System.Text.UTF8Encoding.UTF8.GetBytes(payload));
                        deviceClient.SendEventAsync(message);

                        connectSerialDeveice.ReceiveFlag = 0;
                    }
                }
            });

```


- Azure Stream Analytics Query
  - We need to 2 output for store transaction to database for Billing and real time processing for Web UI.
  - Today, We can't directory reference SQL database table from Stream Analytics, run data copy data to Blob storage job every night via Azure Data Factory.
  - ![Data Factory job]({{site.baseurl}}/images/2017-02-16-SumitomoCementComputerSystems/05-DataFactoryPipelineForStreamAnalytics.png)

``` sql:StreamAnalytics

  -- to store data for billing or so.
SELECT
    devicemapblob.PlantCD,
    iothub.BpBatchNo,
    iothub.BpTime,
    iothub.Neriryo,
    iothub.Setteichi,
    iothub.Keiryochi,
    iothub.Hyomensui,
    iothub.yoseki,
    iothub.RefSykNo,
    iothub.RefSyaban,
    iothub.RefHaigoNo
INTO
    [DeviceData]
FROM
    [iothub]
    join [devicemapblob] ON iothub.DeviceID = devicemapblob.DeviceID

-- transform data to display
SELECT
    devicemapblob.PlantCD,
    iothub.Status
INTO
    [PlantStatus]
FROM
    [iothub]
    join [devicemapblob] ON iothub.DeviceID = devicemapblob.DeviceID

```


- Web UI
  - There are 2 communication channel. The pre-ordered data come from SQL Database. Real-time control data comes from ASP.NET SignalR via Stream Analytics -> Event Hub -> Azure Functions.
  - ![Web Console]({{site.baseurl}}/images/2017-02-16-SumitomoCementComputerSystems/03-WebUI.png)

- Message bus By Event Hub and Azure Functions
  - EventHub Trigger.
  - Send Message to Web UI via ASP.NET SignalR.
  - SQL MERGE statement is so useful to insert/update status data into SQL database to cover additional order without pre-order.

  ``` CS:AzureFunctions.cs

    var constr = GetEnvironmentVariable("SqlConnection");
    var result = 0;

    using (SqlConnection con = new SqlConnection(constr))
    {
        con.Open();
        SqlCommand sql = new SqlCommand(
            $"MERGE INTO PlantStatus AS status
	            USING (SELECT
		          {param1} as [PlantCD],
		          {param2} as [BpBatchNo],
		          {param3} as [BpTime],
		          {param4} as [Neriryo]
	  	          ) AS source
              ON
              (
                Plant.PlantCD = source.PlantCD
              )
              WHEN MATCHED THEN
                  UPDATE SET
                     Neriryo = source.Neriryo
              WHEN NOT MATCHED THEN
                  INSERT (
		              [PlantCD],
		              [BpBatchNo],
		              [BpTime],
		              [Neriryo]
              )
                VALUES
              (
		              source.[PlantCD],
		              source.[BpBatchNo],
		              source.[BpTime],
		              source.[Neriryo]
                  );
        ", con);
        result = sql.ExecuteNonQuery();
    }

```

## Security ##
It's easier turn on/off using current Azure. All of communication channel between devices and Cloud is encrupted by IoT Hub. Data persistent stored at SQL Database with Trunsparent Data Encryption without any impact to application code. Also Web App require authentication by Azure Active Directory (This is not implemented yet).

## Conclusion ##

Azure IoT Suite is so powerful and flexible to add IoT capability to existing systems. It enables customer prepare future new device by using several types IoT Hub device SDK.
The great point is the first prototype build within a couple of days. We believe this is PaaS power.

The hackfest itself help very close technical communication with several experts in a same location. This offline experience make small seminar to learn new technology on demand. For example, we adopt ASP.NET SignalR / Azure Functions. This was not in plan for the hackfest. It help to update system Architecture by incremental implementation.

- General lessons:
  - The good sample code reduces unnecessary research time.
  - Some Azure PaaS components like Azure Functions and Event Hubs help quick design and implement because customer don’t need consider the infrastructure.
  - There is a difference as initial and production database that has big number of normalized table. We needed to change framework.
  - We use only PaaS services for this time. Customer happy to use PaaS compare with IaaS. The Azure cover all of customer requirement. Additionally, if system is new, not migration, it's easy to adopt new cost effective operation process as the production environment.

  - The technical support is great than they expected.
  - It's easy to understand how Hakathon build app so quicky. Therefore, customer can ensure the time to try other area like adding serverless feature to app to consider the production app.

- Opportunities going forward:

  - Customer plan to brush up production by Data component and Web UI component update.
  - Data Analytics feature like predict provide amount of mixing etc. to end-user help delivery high quality of services.

## Resources
- Azure IoT Hands-on in Japanese (http://ms-iotkithol-jp.github.io/)
