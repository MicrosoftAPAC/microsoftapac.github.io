---
layout: post
title:  "Building a tire monitoring solution with Tyre Express"
author: "Gandhali Samant"
author-link: "#"
#author-image: "{{ site.baseurl }}/images/authors/photo.jpg"
date:   2016-11-02
categories: IoT
color: "blue"
#image: "{{ site.baseurl }}/images/imagename.png" #should be ~350px tall
excerpt: In this IoT hackfest, Microsoft teamed up with Tyre Express to connect their tire monitoring solution to the Azure cloud. 
language: English
verticals:  Transportation & Logistics
geolocation: [India]
---

Tyre Express is a startup that is pioneering tire lifecycle management for fleet operators. Its IoT platform enables fleet operators to track tires and monitor their performance (pressure, temperature, and so on) on a real-time basis. This will enable them to carry out preventive maintenance and detect any abnormalities in the system. This will also enable fleet operators to control their tire inventory and build operational efficiency by reducing tire wear and increasing mileage. Tyre Express has interest from several clients and prominent fleet operators in the logistics space to test this solution.

For any fleet company, tire procurement accounts for a significant business cost. Tires are the largest consumable after fuel for any fleet operator. In India, for example, procurement of new tires for each vehicle has an annual cost of Rs 1.25 to Rs 1.50 Lakhs ($1,800-$2,200), according to Tyre Express research. 

Fluctuations in pressure and temperature can have a dramatic effect on the life span of a tire. Monitoring these parameters and taking preemptive measures can enhance their useful life. With this in mind, Tyre Express is developing an IoT-based platform to monitor and measure tire performance. 

The solution will benefit various stakeholders as follows: 

- Fleet operators will see reduced stoppages caused by premature tire failure, resulting in increased availability of the fleet.
- Fleet operators and OEMs will get detailed analysis of the performance of the tire. (Details below.)
- Depending on the business case, the Tyre Express team intends to share the data accordingly with the OEMs and other institutions.

Though many mature markets offer solutions for tire performance management, there is an addressable gap in the Indian market. Tyre Express envisions an IoT-based solution to bridge this gap for commercial customers.

The project team included the following:

- Gandhali Samant – Microsoft, Senior Technical Evangelist, DX India
- Surbhi Jain – Microsoft, Audience Marketing, DX India
- Shweta Gupta – Microsoft, Senior SDE
- Dinesh Wakale – Tyre Express, Founding Team
- Brijesh Shukla –  Tyre Express, Founding Team
- Vinit Palkar – Tyre Express, Founding Team
- Anand Balagopal – Tyre Express, Development Team
- Rakesh Barai – Tyre Express, Development Team
 
## Pain point ##

Initial Scenario

Tyre Express created an initial POC for an IoT platform, with a handheld Raspberry Pi 3 device with Arduino board that was connected to sensors to measure tire pressure and depth (threading). They also had an RFID scanner to identify individual tires. The Raspberry Pi 3 was running Rasbian OS and they had a Python application that would collect the data and transmit it to the cloud. They used IoTHub client SDK for Python to achieve this. But the solution had a few problems:

- Since the device was handheld, its operator had to move from tire to tire and therefore a lot of manual intervention was needed. Each vehicle can have 6-18 tires depending on the vehicle length, which would have further increased the probability of errors. 
- Real-time data could not be gathered because the device could not capture data when the vehicle was in motion.

The Tyre Express team then started working on a new solution to reduce manual intervention and gather multiple parameters for better monitoring of tire performance.

Final Structure 

The new solution has two components: a hub device on the vehicle and a tire-mounted sensor. This hub device is a custom build device without a standard OS. It has an industrial grade GSM/GPRS module to connect to the cloud. The tire-mounted device includes sensors to gather real-time data, such as tire temperature and inflation and deflation of tires. The hub device also has sensors to gather geolocation data (latitude and longitude) as well as accelerometer data.

**Note** Tire depth sensor, tire ID tag, and a vibrations sensor will be added to the solution at a later point.

The sensors mounted on tires send data to the hub device using radio frequency. The hub device has a GPS module that transmits the location and speed of the vehicle to the cloud, in addition to the data coming from tire-mounted sensors. 
 
## Solution ##

**Step 1: Evaluation of sensors**

The Tyre Express team had already started working with their custom device. They were evaluating different sensors and had selected the ones they would eventually use. They were able to read the messages from the sensors coming to hub device but the hub device was not connected to the cloud. 

**Step 2: Determining hub device connectivity to the cloud**

Our biggest concern from a solution perspective was to determine if the hub device could actually connect to the Azure IoT Hub. We had realized at the envisioning session that it would be impossible to install the IoT Hub SDK on the device. We first evaluated whether we could use any of the prebuilt Azure IoT SDKs to connect the devices to the IoT Hub. Since there was no OS, we also tried to see if we could directly copy relevant C source code from the SDKs, but since the device had limited memory, we decided to go with the REST APIs. 

**Step 3: Building the end-to-end flow**

Once we determined their device could send HTTP messages to the IoT Hub, we created a simple end-to-end flow as shown in the following architecture diagram.

*Figure 1: Data insertion architecture*

![]( {{ site.baseurl }}/images/TyreExpress/TyreExpress1.png)

**Challenge:** We tried to use Azure IoT Hub REST APIs to connect from the device to send the data. But we ran into an unforeseen issue. The Azure IoT Hub always returned Http status code 204 (No content) on the successful data insertion. On the device side, the device firmware was expecting Http Status code 200 (OK) for success and the device started hanging because it could not understand status 204. We confirmed with the product teams that this is how the IoT Hub has always worked. (MSDN documentation showed that ideally it should return 200. After we raised this issue, they have now updated the MSDN documentation to reflect the status code as 204. [https://msdn.microsoft.com/en-us/library/azure/mt590784.aspx](https://msdn.microsoft.com/en-us/library/azure/mt590784.aspx)). We have also started working with device manufacturers to find a workaround. 

**Solution:** Because that was taking longer, we decided to go ahead with adding an additional API layer where the device can send data and which in turn will handle communication with the IoT Hub. So our revised architecture looked like the following.

*Figure 2: Revised data insertion architecture*

![]( {{ site.baseurl }}/images/TyreExpress/TyreExpress2.png)

**Step 4: Configuring IoT Hub, API app, and Stream Analytics**

We started working with device level code in C and created HTTP requests to connect to the Web API hosted in the Azure API app. The sensors sent the temperature and pressure data to the hub device and the hub device collected acceleration and geolocation data.

*Figure 3: Hub device and sensor on tire*

![]( {{ site.baseurl }}/images/TyreExpress/TyreExpress3.png)

Following is the sample request call from the hub device.

*Figure 4: Web API call from device - Code in C*

![]( {{ site.baseurl }}/images/TyreExpress/TyreExpress4.png)

The sensors send the data to the hub device every 4 minutes. The hub device then adds geolocation and acceleration data and sends the request to the web API. Following is the data format in JSON. The first part of the message (DeviceData) is used for the authentication and the remaining part (SensorData) is sent as a message to the IoT Hub. Device data consists of Device ID, Authentication Token and expiry time whereas Sensor data consists of Acceleration, Time, SensorID, Latitude, Longitude, Pressure and Temperature. DeviceID is unique for each vehicle. And SensorID is unique for each tire.
        
        Code Snippet 1 –Message structure sent from hub device to API :
        
        { 
            "DeviceData":
            { 
                "Auth":"xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
                "DeviceId":"xxxxxx",
                "Expires":"1484113314"
            },
            "SensorData": 
            { 
                "Acceleration":"0",
                "HTime":"0",
                "ID":"8324",
                "Latitude":"19.126480",
                "Longitude":"73.01101",
                "Pressure":"60",
                "Temperature":"25"
            }
        }

        

The Web API has two functions, one to generate the authentication token for each device and the other to send the data to the IoT Hub using the authentication token. Every time the device boots it sends an initial message to the IoT Hub to check token validity. If the token is expired, it will generate a new token valid for 7 days.

        Code Snippet 2 – Web API Code :

        string IOTHubName = "Your IOT Hub Name";
        string IOTHubKey = "Your IOT Hub Key";

        [HttpPost]
        public String Post([FromBody] object request)
        {
            var data = JsonConvert.DeserializeObject<DataModel>(request.ToString());
            if (data != null && data.DeviceData != null && data.SensorData != null)
            {
                data.SensorData.Pressure = Math.Round((Convert.ToDouble(data.SensorData.Pressure) * 0.145),1).ToString();
                var client = new HttpClient();
                client.BaseAddress = new Uri("https://"+ IOTHubName + ".azure-devices.net/devices/" + data.DeviceData.DeviceID + "/messages/events?api-version=2016-02-03");
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                client.DefaultRequestHeaders.TryAddWithoutValidation("Authorization", "SharedAccessSignature sr=demo-myiothub.azure-devices.net%2fdevices%2f" + data.DeviceData.DeviceID + "&sig=" + data.DeviceData.Auth + "&se=" + data.DeviceData.Expires);
                HttpResponseMessage response = client.PostAsJsonAsync("", data.SensorData).Result;
                if (response.StatusCode == HttpStatusCode.NoContent)
                    return new HttpResponseMessage(HttpStatusCode.OK).ToString();
                else
                    return response.ToString();
            }
            else return "Empty data";
        }

        [HttpGet("{deviceId}")]
        public DeviceData Get(String deviceId)
        {
            TimeSpan fromEpochStart = DateTime.UtcNow - new DateTime(1970, 1, 1);
            string expiry = Convert.ToString((int)fromEpochStart.TotalSeconds + 3600);
            string baseAddress = (IOTHubName + ".azure-devices.net/devices/" + deviceId).ToLower();
            string stringToSign = WebUtility.UrlEncode(baseAddress).ToLower() + "\n" + expiry;
            byte[] data = Convert.FromBase64String(IOTHubKey);
            HMACSHA256 hmac = new HMACSHA256(data);
            string signature = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(stringToSign)));
             string token = String.Format(CultureInfo.InvariantCulture, "SharedAccessSignature sr={0}&sig={1}&se={2}",
                            WebUtility.UrlEncode(baseAddress).ToLower(), WebUtility.UrlEncode(signature), expiry);
            return new DeviceData {DeviceID = deviceId, Auth = WebUtility.UrlEncode(signature), Expires=expiry };
            
        }

When a message enters the Azure IoT Hub, Stream Analytics casts the data to appropriate data types and sends it to Power BI for a visualization demo and also to a SQL database. As the data grows, it will be stored in Blob storage, but now for development and testing purposes the data is also stored in an Azure SQL database.

*Figure 5: Stream Analytics inputs and outputs topology*

![]( {{ site.baseurl }}/images/TyreExpress/TyreExpress5.png)


        Code Snippet 3 – Stream Analytics query code :
        SELECT
        System.TimeStamp AS HTime,ID,
                cast(Temperature as float) AS Temperature,
                cast(Pressure as float) as Pressure,
                cast(Latitude as float) as Latitude,
                cast(Longitude as float) as Longitude,
                cast(Acceleration as float) as Acceleration
        INTO
            Output1
        FROM
            Input1 TIMESTAMP BY HTime
            
        SELECT 
            System.TimeStamp AS HTime,ID,
                cast(Temperature as float) AS Temperature,
                cast(Pressure as float) as Pressure,
                cast(Latitude as float) as Latitude,
                cast(Longitude as float) as Longitude,
                cast(Acceleration as float) as Acceleration
        INTO OutputSql
        FROM Input1 TIMESTAMP BY HTime

**Step 5: Data visualization for demos and testing using Power BI**

After being able to successfully read data and insert it in storage, we started creating Power BI visualizations for demos. These visualizations were created using Power BI. The next step is to integrate them with customer websites using Power BI Embedded.

*Figure 6: Power BI visualization*

![]( {{ site.baseurl }}/images/TyreExpress/TyreExpress6.png)

**Step 6: Device testing with a moving vehicle** 

[https://1drv.ms/v/s!Ah4WFmYLnUQyjs1_U42ia6H_WMWAPA](https://1drv.ms/v/s!Ah4WFmYLnUQyjs1_U42ia6H_WMWAPA) 

*Figure 7: Some pictures from the hackfest*

![]( {{ site.baseurl }}/images/TyreExpress/TyreExpress7.png)


## Architecture ##

The schema of the solution architecture is explained above.

## Device used and code artifacts ##

Industrial grade GSM/GPRS modules. 

Details about sensors not available.

## Opportunities going forward ##

We will continue to engage with Tyre Express to find a permanent solution to the HTTP status code issue. We are working with the device manufacturer for the same.

In the next phase, Tyre Express is planning to add a tire depth sensor as well as a sensor to detect vibrations. We will continue to work with them for the integration. 

On the cloud side, Tyre Express is planning a feature to add alerts for drivers and fleet owners using Azure Functions. For example, if the tire pressure drops below a certain threshold, the driver will be immediately notified to check if there is a puncture.

Once they gather a sufficient amount of data, they will also use Azure machine learning for predictive analytics. 

Additionally, after using Power BI for data visualization, the team is exploring Power BI Embedded to integrate the visualizations in their customer-facing website.

## Conclusion ##

The Microsoft and Tyre Express teams worked closely to conclude a successful implementation of the IoT solution. The Tyre Express team had their device-side code (to read the data from sensors and communications between hub and sensors) ready when we started the engagement. We used Azure IoT Hub and Stream Analytics services, which are platform as a service (PaaS) services, hence the integration was quick and straightforward.

We ran into few challenges as we started developing the solution. We finished an end-to-end scenario where we read data from sensors mounted on tires on moving vehicles and we could generate the real-time visualizations. The Tyre Express team got to learn about using Azure PaaS services along the way and they were happy to see the seamless integration. Our team also learned about different types of sensors, controllers, and hardware that is being used in local industries and gained experience about connecting those to our Azure services.

Here is a quote from the customer:

> “We are delighted to partner with Microsoft for the Azure services cloud platform which helps us to deliver an enhanced customer experience. Tires are one of the largest consumable for the fleet operators after fuel. Our IoT platform helps customers monitor tire performance in real time as well as track inventory. Azure enables us to create a superior customer experience by allowing us to seamlessly integrate our devices with the cloud, store and analyze the data, and visualize the same in the form of easy-to-understand dashboards. We can help customers take suitable action based on such inputs to improve operational efficiency, reduce costs, and improve profitability.” 







