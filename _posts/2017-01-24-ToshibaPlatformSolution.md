---
layout: post
title:  "Toshiba Platform Solution Corporation"
author: "Hiroshi Ota"
author-link: "#"
#author-image: "{{ site.baseurl }}/images/authors/photo.jpg"
date: 2016-05-19
categories: [IoT]
color: "blue"
image: "images/toshibapfs/HackFest.jpg" #should be ~350px tall
excerpt: Toshiba Platform Solution Corporation is willing to use the Azure IoT Services to offer widespread services under the title "ToIS IoT Starter Kit" that can be installed quickly, easily, and at low cost for collecting and storing diagnostic information on computers and motherboards for their company's embedded devices and the environmental sensors.
language: [English]
verticals: [Manufacturing & Resources]
geolocation: [Japan]
---

### Key technologies used 
- Azure IoT Hub, Azure IoT Gateway SDK 
- Stream Analytics 
- Document DB 
- Storage Account 
- Power BI 
- Azure Web Apps  

### Hacfest core team 
- Masahiro Tabari - TOSHIBA PLATFORM SOLUTION CORPORATION 
- Masayoshi Kisyu - TOSHIBA PLATFORM SOLUTION CORPORATION 
- Kazeto Watanabe - TOSHIBA PLATFORM SOLUTION CORPORATION 
- [Hiroshi Ota](http://twitter.com/embedded_george) - Technical Evangelist, Microsoft

## Customer profile ##

[TOSHIBA PLATFORM SOLUTION CORPORATION](https://www.toshiba-tops.co.jp/) is embedded solution provider especially focused on development of embedded products, application development services, and customer support services. As a member of Toshiba group, they respond to the diverse needs of their customers by leveraging their expertise accumulated from a consistent system of software, hardware design, manufacturing and maintenance services.


 
## Problem statement ##

We began to recognize the problem of this solution clearly by drawing composition of ToPS's solution and service to be provided. 

[Solution landscape](/images/toshibapfs/solutionlandscape.jpg) 

Toshiba Platform Solution Corporation is willing to use the Azure IoT Services to offer widespread services under the title "ToIS IoT Starter Kit" that can be installed quickly, easily, and at low cost for collecting and storing diagnostic information on computers and motherboards for their company's embedded devices and the environmental sensors provided specifically for customers who adopt IoT solutions. These services will incorporate remote monitoring and error value notification of the collected data and provide computer remote control by linkage with a computer or motherboard for embedded devices by their company for enabling remote maintenance immediately after installation, reduced maintenance costs for customer systems, and reduced downtime. Also, using Azure for the platform will enable adding of sensor devices, expansion of various services, and more, for enabling seamless customization from the ToIS IoT Starter Kit. 

Target devices are follows 
|Gateway Box|Main board|Sensor Hub|Sensor hub inserted in main board| 
|:-:|:-:|:-:|:-:| 
|![GatewayBox](/images/toshibapfs/ppt_Gateway.png)|![MainBoard](/images/toshibapfs/ppt_TEM150-main.png)|![SensorHub](/images/toshibapfs/ppt_SensorHub1.png)|![SensorHubInMainBoard](/images/toshibapfs/ppt_TEM150-SensorHub.png)| 
These boards are used as Factory PC controllers.

## Solution and steps ##

We held two pre meetings two or three hours to hear ToPS's solution and let ToPS understand Azure IoT features. After these preparation We hold 4 days HackFest. 
During HackFest, We clarified problem as described above and discusssed how to solve problems and the architecture. Then we developed product baseline. 

![HackFest](/images/toshibapfs/HackFest.jpg) 

In ToIS IoT Kit, there are initial introduction and full introduction phase. They intend to design initial ToIS IoT Starter Kit be installed fast, easy, and customizable to customer's environment. 
Since it is a trial during the initial introduction, we want to set an upper limit on Azure operation cost. For example, it is necessary to limit the collection and notification of data from Embedded PC in the user environment, with an upper limit of predetermined amount of money per month. 
They also aim to provide the customer with a dashboard that displays the status of the real-time remote monitoring targeted embedded PC. At that time, the dashboard should be customizable by the customer. The service of the page used for displaying Azure and the dashboard is operated and provided by Toshiba platform solution, so it must be a secure environment in which access rights can be set up. 
The starter kit consists of three terminals collecting different kinds of data on the embedded PC and one gateway box, and the detailed configuration will be selected by users.
From the initial introduction trial, transition to full-scale introduction be done seamlessly. 
Initially, notification of abnormality etc. is based on preset threshold value, but Toshiba platform solution can freely set the threshold configuration and settable range as a service provider, but the specific threshold setting can be done by users as well with provided UI. 
After full-scale operation, it is possible to increase the types of sensors by adding measurement objects and so on, and also possible to increase the number of monitoring targets. 
In anticipation of future user growth, the service must be scalable. 

We defined draft architecture and clarified necessary action items by post-it. 
![actionItems](/images/toshibapfs/ActionItems.jpg) 
Each post-it is for each action item. During HackFest, when an action item was done, we peeled off the correspoinding post-it. 

### Architecture 
During development, we refine architecture several times. The architecture at the time of HackFest is 
 ![IoT Architecture Diagram](/images/toshibapfs/architecture.png) 
The logic on WebJob connected to IoT Hub monitor messages which IoT Hub receives. When the recieved messages number reach predeterminated limited number for each gateway box,  the WebJob logic change corresponding sending enable status via IoT Hub Device twin feature. By the logic on Azure Functions activated by the timer, disabled sending status are changed to enabled. This change action is notified to gateway box via IoT Hub Device twin capability. 
The telemetry messages recievied by IoT Hub are transferred to Azure Stream Analytics, aded with contract information, statistically processed, and then output to Power BI's [real-time streaming dataset](https://powerbi.microsoft.com/en-us/documentation/powerbi-service-real-time-streaming/). 

This solution use Azure IoT Hub Device Twin capability and 
To use [Azure IoT Gateway SDK](http://github.com/Azure/azure-iot-gateway-sdk) make it easy to change the configuration of devices. The architecture on the device side is
![Device Architecture Diagram](/images/toshibapfs/ArchitectureOfEdgeSide.png) 
The 'Comm Ctrl msg from PC Board to cloud' module controls communication between gateway box and devices(FA PC Mainbaord and Sensor Hub) just like ble module in the Gateway SDK's ble_gateway sample. 
The C⇔D Mapper module counts check the sending enable status. The module send message to IoT Hub module only when the enable status is enabled. 

## Technical delivery ## 
### Security details 
This solution provides two types of Web UI for administrator(ToPS) and service users. In order to restrict access to only the page corresponding to the user's type, we use authenticaiton mechanisms of Azure App Service and ASP.NET.

### Gateway box  
There are three types devices. Since sensor hubs and main board are going to use exisiting ones are they are, we added new implementation for gateway box only. The gateway box's OS is Ubuntu and development language is C. 
We used [Azure IoT SDK](http://github.com/Azure/azure-iot-sdks) to connect the gateway box with Azure IoT Hub. 
We refered samples of [Azure IoT SDK for C language](http://github.com/Azure/azure-iot-sdk-c) but there is no sample to continue handling Device twin capablity during execution. the technical evangelist provide following C language sample code, 
``` C
#include <stdio.h>
#include <stdlib.h>

#include <sys/signalfd.h>
#include <unistd.h>
#include <signal.h>
#include <time.h>

#include <glib.h>

#include "serializer_devicetwin.h"
#include "iothub_client.h"
#include "iothubtransportmqtt.h"
#include "platform.h"
#include "azure_c_shared_utility/threadapi.h"
#include "parson.h"

/*String containing Hostname, Device Id & Device Key in the format:                         */
/*  "HostName=<host_name>;DeviceId=<device_id>;SharedAccessKey=<device_key>"                */
static const char* connectionString = "[device connection string]";

static int callbackCounter;
static bool g_continueRunning;
static char msgText[1024];
static char propText[1024];

#define SERVER_ERROR 500
#define NOT_IMPLEMENTED 501
#define NOT_VALID 400
#define SERVER_SUCCESS 200

// Define the Model - it is a gatewayBox.
BEGIN_NAMESPACE(IoTKitHoL);

DECLARE_STRUCT(Geo,
    double, longitude,
    double, latitude
);

DECLARE_MODEL(GatewayBoxState,
    WITH_REPORTED_PROPERTY(int32_t, softwareVersion),
);

DECLARE_MODEL(GatewayBoxSettings,
    WITH_DESIRED_PROPERTY(ascii_char_ptr, desired_sendingEnableStatus, onSendingEnableStatus),
    WITH_DESIRED_PROPERTY(Geo, location)
);

DECLARE_DEVICETWIN_MODEL(GatewayBox,
    WITH_REPORTED_PROPERTY(GatewayBoxState, state), /*this is a model in model*/
    WITH_DESIRED_PROPERTY(GatewayBoxSettings, settings), /*this is a model in model*/
    WITH_METHOD(updateFirmware)
);

END_NAMESPACE(IoTKitHoL);

DEFINE_ENUM_STRINGS(DEVICE_TWIN_UPDATE_STATE, DEVICE_TWIN_UPDATE_STATE_VALUES);

METHODRETURN_HANDLE updateFirmware(GatewayBox* gatewayBox)
{
    /* TODO: implement firmware update logic */
    METHODRETURN_HANDLE result = MethodReturn_Create(201, "Result of invoking firmware update");
    return result;
}

void onSendingEnableStatus(void* argument)
{
    /*by convention 'argument' is of the type of the MODEL encompassing the desired property*/
    /*in this case, it is 'GatewayBoxSettings'*/

    GatewayBoxSettings* gatewayBox = argument;
    printf("received a new desired_sendingEnableStatus = %" PRIu8 "\n", gatewayBox->desired_sendingEnableStatus);
}

guint g_event_source_id = 0;
static gboolean signal_handler(
	GIOChannel *channel,
	GIOCondition condition,
	gpointer user_data
);

static void handle_control_c(GMainLoop* loop);

typedef struct IoTKitHoLContext_tag {
	IOTHUB_CLIENT_HANDLE iotHubClientHandle;
	GMainLoop* messageLoop;
  GatewayBox* things[1];
} IoTKitHoLContext;

static int DeviceMethodCallback(const char* method_name, const unsigned char* payload, size_t size, unsigned char** response, size_t* resp_size, void* userContextCallback)
{
  	IoTKitHoLContext* context = (IoTKitHoLContext*)userContextCallback;
	  GatewayBox* gatewayBox =     context->things[0];
    int retValue;
    
    if (method_name == NULL)
    {
        LogError("invalid method name");
        retValue = NOT_VALID;
    }
    else if ((response == NULL) || (resp_size == NULL))
    {
        LogError("invalid response parameters");
        retValue = NOT_VALID;
    }
    else if (gatewayBox == NULL)
    {
        LogError("invalid user context callback data");
        retValue = NOT_VALID;
    }
    else {
        // TODO: real handing code should be implemented here.
        LogInfo("DeviceTwin Method CallBack: Method_name=%s, Payload=%s, size=%u", method_name, payload, size);
        retValue=SERVER_SUCCESS;
    }
    return retValue;
}

static void DeviceTwinPropertyCallback(int status_code, void* userContextCallback)
{
  	IoTKitHoLContext* context = (IoTKitHoLContext*)userContextCallback;
	  GatewayBox* gatewayBox =     context->things[0];
    // TODO: real handing code should be implemented here.
    LogInfo("DeviceTwin CallBack: Status_code = %u", status_code);
}

static void DeviceTwinCallback(DEVICE_TWIN_UPDATE_STATE update_state, const unsigned char* payLoad, size_t size, void* userContextCallback)
{
	IoTKitHoLContext* context = (IoTKitHoLContext*)userContextCallback;
	  GatewayBox* gatewayBox =     context->things[0];
    // TODO: real handing code should be implemented here.
    LogInfo("DeviceTwin CallBack: Status_code = %u", update_state);
}

void iotkithol_sample_mqtt_dm_run(GMainLoop* messageLoop)
{
	IoTKitHoLContext iotKitHoLContext;
	IOTHUB_CLIENT_HANDLE iotHubClientHandle;

	iotKitHoLContext.messageLoop = messageLoop;

	g_continueRunning = true;

	srand((unsigned int)time(NULL));

	callbackCounter = 0;

	if (platform_init() != 0)
	{
		printf("Failed to initialize the platform.\r\n");
	}
	else
	{
        if (SERIALIZER_REGISTER_NAMESPACE(IoTKitHoL) == NULL)
        {
            LogError("unable to SERIALIZER_REGISTER_NAMESPACE");
        }
        else
        {
	    		(void)printf("Starting the IoTHub dm client sample MqTT - %s\r\n", connectionString);
          if ((iotHubClientHandle = IoTHubClient_CreateFromConnectionString(connectionString, MQTT_Protocol)) == NULL)
			    {
				    (void)printf("ERROR: iotHubClientHandle is NULL!\r\n");
			    }
			    else
			  {
				  iotKitHoLContext.iotHubClientHandle = iotHubClientHandle;
	
          // Turn on Log 
	        bool trace = true;
    	    (void)IoTHubClient_SetOption(iotHubClientHandle, "logtrace", &trace);

        	GatewayBox* gatewayBox = IoTHubDeviceTwin_CreateGatewayBox(iotHubClientHandle);
				  if (gatewayBox == NULL)
          {
            printf("Failure in IoTHubDeviceTwin_CreateGatewayBox");
          }
          else
          {
           	iotKitHoLContext.things[0] = gatewayBox;
           	if (IoTHubClient_SetDeviceMethodCallback(iotHubClientHandle, DeviceMethodCallback, &iotKitHoLContext) != IOTHUB_CLIENT_OK)
           	{
             	LogError("failed to associate a callback for device methods");
             	printf("Failure in associate a callback for device methods");
            }
            else{
             	/* TODO: setting values for reported properties*/
  						if(IoTHubClient_SetDeviceTwinCallback(iotHubClientHandle, DeviceTwinCallback, (void*)(&iotKitHoLContext))!=IOTHUB_CLIENT_OK)
	  					{
		  					printf("Failed set DeviceTwin callback");
			  			}

            	/*sending the values to IoTHub*/
	            if (IoTHubDeviceTwin_SendReportedStateGatewayBox(gatewayBox, DeviceTwinPropertyCallback, NULL) != IOTHUB_CLIENT_OK)
              {
        	      (void)printf("Failed sending serialized reported state\n");
              }
              else
              {
                printf("Reported state will be send to IoTHub\n");
              }

					  	// run the glib loop
						  g_main_loop_run(messageLoop);
					}
					IoTHubDeviceTwin_DestroyGatewayBox(iotKitHoLContext.things[0]);
				}
				IoTHubClient_Destroy(iotHubClientHandle);
			}
		}
  		platform_deinit();
    }
}

void* start_message_loop()
{
	GMainLoop* loop = g_main_loop_new(NULL, FALSE);
	handle_control_c(loop);
	return loop;
}

int main(void)
{
	iotkithol_sample_mqtt_dm_run(start_message_loop());
	return 0;
}

static void handle_control_c(GMainLoop* loop)
{
	sigset_t mask;
	sigemptyset(&mask);
	sigaddset(&mask, SIGINT);
	sigaddset(&mask, SIGTERM);

	if (sigprocmask(SIG_BLOCK, &mask, NULL) < 0)
	{
		printf("Failed to set signal mask\r\n");
	}
	else
	{
		int fd = signalfd(-1, &mask, 0);
		if (fd < 0)
		{
			printf("Failed to create signal descriptor\r\n");
		}
		else
		{
			GIOChannel *channel = g_io_channel_unix_new(fd);
			if (channel == NULL)
			{
				close(fd);
				printf("Failed to create IO channel\r\n");
			}
			else
			{
				g_io_channel_set_close_on_unref(channel, TRUE);
				g_io_channel_set_encoding(channel, NULL, NULL);
				g_io_channel_set_buffered(channel, FALSE);

				g_event_source_id = g_io_add_watch(
					channel,
					G_IO_IN | G_IO_HUP | G_IO_ERR | G_IO_NVAL,
					signal_handler,
					loop
				);

				if (g_event_source_id == 0)
				{
					printf("g_io_add_watch failed\r\n");
				}

				g_main_loop_ref(loop);
				g_io_channel_unref(channel);
			}
		}
	}
}

static gboolean signal_handler(
	GIOChannel *channel,
	GIOCondition condition,
	gpointer user_data
)
{
	static unsigned int terminated = 0;
	struct signalfd_siginfo si;
	int fd;
	GMainLoop* loop = (GMainLoop*)user_data;
	gboolean result;

	if (condition & (G_IO_NVAL | G_IO_ERR | G_IO_HUP)) {
		printf("Quitting...");
		g_main_loop_unref(loop);
		g_source_remove(g_event_source_id);
		g_main_loop_quit(loop);
		result = FALSE;
	}
	else
	{
		fd = g_io_channel_unix_get_fd(channel);

		if (read(fd, &si, sizeof(si)) != sizeof(si))
		{
			printf("read from fd failed\r\n");
			result = FALSE;
		}
		else
		{
			switch (si.ssi_signo) {
			case SIGINT:
				printf("Caught ctrl+c - quitting...");
				g_main_loop_unref(loop);
				g_source_remove(g_event_source_id);
				g_main_loop_quit(loop);
				break;
			case SIGTERM:
				if (terminated == 0) {
					printf("Caught SIGTERM - quitting...");
					g_main_loop_unref(loop);
					g_source_remove(g_event_source_id);
					g_main_loop_quit(loop);
				}

				terminated = 1;
				break;
			}

			result = TRUE;
		}
	}

	return result;
}
```
The above code is modfied version of sample published on [https://github.com/ms-iotkithol-jp/IoTKitHoLV3/tree/master/linux_sample/iotkithol_sample_dm](https://github.com/ms-iotkithol-jp/IoTKitHoLV3/tree/master/linux_sample/iotkithol_sample_dm). 

This gateway box also uses Azure IoT Gateway SDK to be able to route both direction messages easily and to respond sensor hub variation. The implementation was done by refering [BLE Gateway Sample](https://github.com/Azure/azure-iot-gateway-sdk/tree/master/samples/ble_gateway). We replaced the ble module with MqTT communication module and in order to limit the usage fee of the cloud service, we added a module with logic to stop the send message process based on the number of sent message. The upper limit of the number of sent messages and sent messages enablement can be set with the property implemented in Device twin. 

Sensor information and sending packet size that can be measured with the main board and sensor hub are as follows. 
|Board Type|Sensors|Packet size|
|:-|:-|-:|
|Main board|CPU Temperature, System Temperature 1～4, DIMM2 Temperature, CPU FUN, SYS FUN1, SYS FUN2, Boot Count|400-500 bytes|
|Sensor Hub|Temperature, Atmospheric pressure, 3 axis accelerometer, distance, brightness|300-400 bytes| 
Each packet is send at 10 second intervals. 

### Stream data processing 
We use Azure Stream Analytics as stream data processing. 
In the processing of Azure Stream Analytics, it is necessary to add information about factories and users where devices are equiped. Since we decide to use property management feature of IoT Hub Device twin, ideally managed properties can be read from Azure Stream Analytics query, but that feature is not provided at present. 
Current implementation use Azure IoT Hub and CSV file in Azure Blob Storage and join information. 

|Ideal Implementation|Current Implementation|
|:-:|:-:|
|![Ideal](/images/toshibapfs/IdealSAImplementation.png)|![Current](/images/toshibapfs/CurrentSAImplementation.png)| 

The way to define file as reference data is 
![ReferenceDataInput](/images/toshibapfs/DataReferenceAsInputSA.jpg) 

Matching query is like... 
```sql
SELECT
  arrangement.Location as Location, 
  arrangement.Company as Company,
  sensor.Devicetime as Devicetime
  sensor.CPUFUN as CPUFUN,
  sensor.CPUTMP as CPUTMP, 
  IoTHub.ConnectionDeviceId as DeviceId
FROM sensor
JOIN arrangement ON IoTHub.ConnectionDeviceId = arrangement.DeviceId
```
※ This query is simplefied for explanation. 
'arrangement' is alias of CSV file stored in Azure Blob Storage defined as 'refrence data' Input. 
In addition, the query checks whether each sensor value is within the allowable range. When some sensor value outside the allowable range is found, the query generate a property having a value indicating that it is abnormal. 

### Data Visualization 
The output data from Stream Analytics is shown on Power BI as monitoring dashboard. 
The error detection display page. 
![Dashboard](/images/toshibapfs/pbiDashboard.png) 
Several sensor values display page. 
![Dashboard2](/images/toshibapfs/pbiDashboard2.png) 
These pages can display the latest data in real-time by using Real-Time Streaming dataset. 
We intended to use Power BI embedded as dashboard implementation technology but When updating the Web page embedded with Power BI at about 10 second intervals, it flickers. So we abandoned the use of this capability but use Office 365's cloud version of Power BI. 
※ At the time of this HackFest, there was bug in the 'Real-time streaming dataset' of Power BI, it didn't display well if it was Japanese language setting. 
 
## Conclusion ##
Through this activity, Toshiba Platform Solution will be able to utilize Azure IoT Hub and Stream Analytics Power BI to make it possible to limit the usage fee to lower the barriers to introducing solutions to customers, to ensure the flexibility to change the configuration of sensors and boards, and to provide scalability for increase customers and telemetry messages, including possiblity to display the latest information in real time on the monitoring dashboard of telemetry data by Power BI. The advice of Microsoft's evangelist helped in advancing activities. 

Through development support by HackFest, Toshiba Platform Solution was able to easily acquire basic tips on development using Azure and knowledge on correct usage of IoT Hub and related related services. In addition, it was able to solve problems such as avoiding faults related to language setting related to real-time display of Power BI, and overall speed up the development work.

The work in this project will help Toshiba Platform Solution not only build it's FA controller monitoring service but also build solid foundation to increase the number of users of the FA PC controller that the company manufactures and sells. 
In the future, not only mere monitoring services, but also the diagnostic diagnosis by machine learning based on FA PC controller data accumulated through this solution, proposal of products with specifications more suitable for customer's needs, Toshiba Platform Solution are planning to offer more sophisticated services.

