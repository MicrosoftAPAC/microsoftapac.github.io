---
layout: post
title:  "DroneWorks teams up with Microsoft to build a Safety Flight Platform for industrial drones by using Azure IoT Hub"
author: "Kosuke Fujimoto"
author-link: "https://twitter.com/kosfuji"
#author-image: "{{ site.baseurl }}/images/authors/photo.jpg" 
date: 2017-05-19
categories: [IoT]
color: "blue"
image: "images/DroneWorks/MembersPic.jpg" #should be ~350px tall 
excerpt: DroneWorks Inc. worked with Microsoft to build a cloud-based Safety Flight Platform for industrial drones by utilizing Azure IoT Hub, Azure IoT Gateway SDK, Azure Stream Analytics, and other Azure services.
language: [English]
verticals: [Entertainment, Logistics]
geolocation: [Japan]
---

The drone industry is attracting the attention of many people who have innovative ideas for how to use them, and many companies are focusing on building new applications for drones. Therefore, the market is becoming chaotic because many customized flight controllers have no warranties. As a result, DroneWorks is building alliances with stakeholders to standardize manufactured drones and build an industrial drone flight controller and management system. 

Based on [this forecast](http://www.nikkei.com/content/pic/20150715/96958A9F889DEAEAEBE7E3E6E3E2E2E4E2E5E0E2E3E7E2E2E2E2E2E2-DSXZZO8895179006072015000000-PB1-7.png) (Japanese), by 2030, fifty percent of the market for industrial drones will be focused on agriculture and photography. Because most of the industrial drones are quite large and yet have no safety mechanisms in place, DroneWorks wants to come up with a way to safely manage them so they don't cause damage if they lose control due to hacking or malfunctioning. DroneWorks' goal is to create a management system and a malfunction prediction system for industrial drones.

![IoT architecture diagram]({{ site.baseurl }}/images/DroneWorks/drone.JPG)

<br/>

### Key technologies used

- [Microsoft Azure IoT Gateway SDK](https://azure.microsoft.com/en-us/campaigns/iot-edge/)
- [Azure IoT Hub](https://azure.microsoft.com/en-us/services/iot-hub/)
- [Azure Event Hubs](https://azure.microsoft.com/en-us/services/event-hubs/)
- [Azure Machine Learning](https://azure.microsoft.com/en-us/services/machine-learning/)
- [Azure Stream Analytics](https://azure.microsoft.com/en-us/services/stream-analytics/)
- [Azure Table storage](https://azure.microsoft.com/en-us/services/storage/tables/)
- [Microsoft Power BI](https://azure.microsoft.com/en-us/services/power-bi-embedded/)
 
### Core team

- Hironobu Imamura – CEO, DroneWorks Inc.
- Masanori Miyamoto – Development Manager, DroneWorks Inc.
- Yuji Okusu – Intern, DroneWorks Inc.
- [Kosuke Fujimoto](https://twitter.com/kosfuji) – Technical Evangelist, Microsoft
- Hiroshi Ota – Technical Evangelist, Microsoft
- Madoka Chiyoda – Technical Evangelist, Microsoft

![Team members]({{ site.baseurl }}/images/DroneWorks/MembersPic.JPG)

<br/>

## Customer profile

[DroneWorks Inc.](http://www.drone.co.jp/), located in Chiba, Japan, provides consulting, design, manufacturing, sales, and software development for unmanned aircraft or drones. Specifically, they design, produce, and sell original flight controllers for drones. In addition, to support and boost drone businesses in industries, they provide training on how to operate drones and how to customize drone hardware and software. 

## Problem statement

Currently, no sufficient platform exists for managing industrial drones. Drones are being flown without knowing the durability of various drone sensors, which could result in loss of property and accidents. Proactive maintenance is needed to assess timing by using Azure Machine Learning.

Because drones currently transmit raw sensor data directly to Azure, the telecommunication fees are huge. Therefore, it is necessary to preprocess data at the edge side to some extent.

Because there is no tool to manage drones, the possibility exists that a drone with a security hole may be left unattended. A mechanism to manage and upgrade the drone-side system is necessary.

 
## Solution and steps
Working together with the DroneWorks team, we determined that the best solution to these issues was represented in the following architecture diagram. Adding a gateway device for processing raw sensor data acquired from the drone flight allowed us to create a central hub to collect data from the various sensors on the drone and send the data packets to IoT Hub. For the gateway device, we utilized the Azure IoT Gateway SDK.

![IoT current architecture diagram]({{ site.baseurl }}/images/DroneWorks/CurrentArch.png)

<br/>

One of the challenges we discussed was planning for the future architecture of Machine Learning and its scalability. The following diagram shows the future architecture for what DroneWorks would like to achieve next. Their final goal is to predict and detect malfunctions to keep industrial drones safe, so they are planning to use Machine Learning after collecting real data.

![IoT future architecture diagram]({{ site.baseurl }}/images/DroneWorks/FutureArch.png)

<br/>

In planning and architecting the solution, we invested time to whiteboard the scope of the solution as seen in the following image.

![IoT architecture diagram on whiteboard]({{ site.baseurl }}/images/DroneWorks/Discussion.JPG)

<br/>

## Technical delivery ##

### Device used
 
IoT device information:
- [Raspberry Pi](https://www.raspberrypi.org/) 2 as the flight controller on Raspbian for prototype
- Raspberry Pi 3 as the gateway device with Azure IoT Gateway SDK on Raspbian for prototype

### Device messages sent 

- Packet size: about 200 bytes

- Frequency: per second

- Sent data
	- Role, pitch, yaw
	- Gyro x, y, z
	- Battery voltage
	- Remaining amount of battery [%]
	- Temperature

### SDKs and languages used

- Azure IoT Gateway SDK
- C++

### Code artifacts

All code artifacts are published in the following Git repository: [Azure IoT Gateway SDK Extension](https://github.com/drone-works/AzureIoTGatewaySDKExtention)

The following link contains code to generate fake temperature data and send it to udp_gateway by using UDP with instructions: 
[UDP Gateway](https://github.com/drone-works/AzureIoTGatewaySDKExtention/blob/master/samples/udp_gateway/src/README.md)

There weren't any sample codes for the IoT Gateway SDK for UDP so we implemented those codes.

#### Code samples for the flight controller 

**udp.h**
```C

/*
Boost Software License 1.0 (BSL-1.0)
View Summary of Boost Software License 1.0 (BSL-1.0) on TLDRLegal » (Disclaimer)

Permission is hereby granted, free of charge, to any person or organization obtaining a copy of the software and accompanying documentation covered by this 
license (the "Software") to use, reproduce, display, distribute, execute, and transmit the Software, and to prepare derivative works of the Software, 
and to permit third-parties to whom the Software is furnished to do so, all subject to the following:

The copyright notices in the Software and this entire statement, including the above license grant, 
this restriction and the following disclaimer, must be included in all copies of the Software, in whole or in part, 
and all derivative works of the Software, unless such copies or derivative works are solely in the form of machine-executable object code
generated by a source language processor.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE, TITLE AND NON-INFRINGEMENT. 
IN NO EVENT SHALL THE COPYRIGHT HOLDERS OR ANYONE DISTRIBUTING THE SOFTWARE BE LIABLE FOR ANY DAMAGES OR OTHER LIABILITY, 
WHETHER IN CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 
*/ 


#ifndef UDP_H
#define UDP_H

#define DST_IP "127.0.0.1"
#define UDP_PORT "12345" 
#define BUFFER_MAX_LENGTH 2048

extern "C" int receive_udp(char*);
extern "C" int send_udp(char *sd);

#endif /*UDP_H*/
```

<br/>

**udp_receiver.cpp**
```C++
/*
Boost Software License 1.0 (BSL-1.0)
View Summary of Boost Software License 1.0 (BSL-1.0) on TLDRLegal » (Disclaimer)

Permission is hereby granted, free of charge, to any person or organization obtaining a copy of the software and accompanying documentation covered by this 
license (the "Software") to use, reproduce, display, distribute, execute, and transmit the Software, and to prepare derivative works of the Software, 
and to permit third-parties to whom the Software is furnished to do so, all subject to the following:

The copyright notices in the Software and this entire statement, including the above license grant, 
this restriction and the following disclaimer, must be included in all copies of the Software, in whole or in part, 
and all derivative works of the Software, unless such copies or derivative works are solely in the form of machine-executable object code
generated by a source language processor.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE, TITLE AND NON-INFRINGEMENT. 
IN NO EVENT SHALL THE COPYRIGHT HOLDERS OR ANYONE DISTRIBUTING THE SOFTWARE BE LIABLE FOR ANY DAMAGES OR OTHER LIABILITY, 
WHETHER IN CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 
*/ 


#include <iostream>
#include <boost/array.hpp>
#include <boost/asio.hpp>
#include <string.h>
#include "udp.h"

using boost::asio::ip::udp;
boost::array<char,BUFFER_MAX_LENGTH> recv_buf;
char *buff_s;

// 
void receive(const boost::system::error_code& error, std::size_t len)
{
     std::string str; 

    if (!error || error == boost::asio::error::message_size)
    {
		str =  recv_buf.data();
	    std::strncpy(buff_s, str.c_str(), BUFFER_MAX_LENGTH);
    }
}

extern "C" int receive_udp(char *buff_r)
{

    buff_s = buff_r;

	try {
		boost::asio::io_service io_service;

		//
		// Initialise a socket to listen on UDP port UDP_PORT.
		//
		udp::socket socket(io_service, udp::endpoint(udp::v4(), atoi(UDP_PORT)));

		udp::endpoint remote_endpoint;
		boost::system::error_code error;

		// This function will cause the application to listen in the background for a new request. 
		// When such a request is received, receive() function with two arguments: 
		// fisrt : a value whether the operation succeeded or failed, 
		// second: a size_t value bytes_transferred specifying the number of bytes received.
		socket.async_receive_from(boost::asio::buffer(recv_buf), remote_endpoint, &receive);
		io_service.run();

	} catch (std::exception& e) {
		std::cerr << e.what() << std::endl;
		return 1;
	}
	return 0; 
}
```

<br/>

**udp_sender.cpp**
```C++
/*
Boost Software License 1.0 (BSL-1.0)
View Summary of Boost Software License 1.0 (BSL-1.0) on TLDRLegal » (Disclaimer)

Permission is hereby granted, free of charge, to any person or organization obtaining a copy of the software and accompanying documentation covered by this 
license (the "Software") to use, reproduce, display, distribute, execute, and transmit the Software, and to prepare derivative works of the Software, 
and to permit third-parties to whom the Software is furnished to do so, all subject to the following:

The copyright notices in the Software and this entire statement, including the above license grant, 
this restriction and the following disclaimer, must be included in all copies of the Software, in whole or in part, 
and all derivative works of the Software, unless such copies or derivative works are solely in the form of machine-executable object code
generated by a source language processor.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE, TITLE AND NON-INFRINGEMENT. 
IN NO EVENT SHALL THE COPYRIGHT HOLDERS OR ANYONE DISTRIBUTING THE SOFTWARE BE LIABLE FOR ANY DAMAGES OR OTHER LIABILITY, 
WHETHER IN CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 
*/ 

#include <stdio.h>
#include <iostream>
#include <boost/array.hpp>
#include <boost/asio.hpp>
#include "udp.h"

using boost::asio::ip::udp;
extern "C" int send_udp(char *sd)
{
 
	try {
		boost::asio::io_service io_service;
		udp::resolver resolver(io_service);

        // We use an boost::asio::ip::udp::resolver object to find the correct remote endpoint to use based on the host and service names. 
        // The query is restricted to return only IPv4 endpoints by the boost::asio::ip::udp::v4() argument.
		udp::resolver::query query(udp::v4(), DST_IP, UDP_PORT);
		udp::endpoint receiver_endpoint = *resolver.resolve(query);

		//
	    // socket and initiate contact with the endpoint.
	    //
		udp::socket socket(io_service);
		socket.open(udp::v4());
		std::string str = sd;
		socket.send_to(boost::asio::buffer(str), receiver_endpoint);
	} catch (std::exception& e) {
		std::cerr << e.what() << std::endl;
	}
}


```

<br/>

#### Code samples for the gateway device


**udp_generator.h**
```C++
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

#ifndef UDP_GENERATOR_H
#define UDP_GENERATOR_H

#include "module.h"

#ifdef __cplusplus
extern "C"
{
#endif

MODULE_EXPORT const MODULE_API* MODULE_STATIC_GETAPI(GENERATOR_DEVICE_MODULE)(MODULE_API_VERSION gateway_api_version);

#ifdef __cplusplus
}
#endif

#endif /*UDP_GENERATOR_H*/
```

<br/>

**udp_generator.c**
```C++
#include <stdlib.h>
#include <unistd.h>
#include "udp_generator.h"

#include "azure_c_shared_utility/threadapi.h"
#include "azure_c_shared_utility/xlogging.h"
#include "azure_c_shared_utility/crt_abstractions.h"
#include "messageproperties.h"
#include "message.h"
#include "module.h"	
#include <parson.h>


#define BUFFER_LENGTH 2048

typedef struct GENERATORDEVICE_TAG
{
    BROKER_HANDLE       broker;
    THREAD_HANDLE       udp_generatorThread;
    unsigned int        udp_generatorRunning : 1;
} GENERATORDEVICE;

int send_udp(char*);

int udp_generator(void) {
    int temperature;
    char buff_s[BUFFER_LENGTH];
    temperature = 10;
    while(1) {
       sprintf(buff_s, "%d", temperature++);
    	send_udp(buff_s);
    	sleep(5);
 	}
 return(0);
}

static void udp_generator_Destroy(MODULE_HANDLE moduleHandle)
{
    if (moduleHandle == NULL)
    {
        LogError("Attempt to destroy NULL module");
    }
    else
    {
        GENERATORDEVICE* module_data = (GENERATORDEVICE*)moduleHandle;
        int result;

        /* Tell thread to stop */
        module_data->udp_generatorRunning = 0;
        /* join the thread */
        ThreadAPI_Join(module_data->udp_generatorThread, &result);
        /* free module data */
        free(module_data);
    }
}
static void udp_generator_Receive(MODULE_HANDLE moduleHandle, MESSAGE_HANDLE messageHandle)
{
    // Print the properties & content of the received message
    CONSTMAP_HANDLE properties = Message_GetProperties(messageHandle);
    if (properties != NULL)
    {
        const char* const * keys;
         const char* const * values;
         size_t count;

         if (ConstMap_GetInternals(properties, &keys, &values, &count) == CONSTMAP_OK)
         {
            const CONSTBUFFER* content = Message_GetContent(messageHandle);
             if (content != NULL)
             {
                (void)printf(
                "Received a message\r\n"
                "Properties:\r\n"
                 );

                for (size_t i = 0; i < count; ++i)
                {
                    (void)printf("  %s = %s\r\n", keys[i], values[i]);
                }

                (void)printf("Content:\r\n");
                (void)printf("  %.*s\r\n", (int)content->size, content->buffer);
                (void)fflush(stdout);
              }
         }
        ConstMap_Destroy(properties);
    }
    return;
}
static void udp_generator_Start(MODULE_HANDLE moduleHandle)
{
    if (moduleHandle == NULL)
    {
        LogError("Attempt to start NULL module");
    }
    else
    {
        GENERATORDEVICE* module_data = (GENERATORDEVICE*)moduleHandle;
        /* OK to start */
        /* Create a udp data generator thread.  */
        if (ThreadAPI_Create(
            &(module_data->udp_generatorThread),
            udp_generator,
            (void*)module_data) != THREADAPI_OK)
        {
            LogError("ThreadAPI_Create failed");
            module_data->udp_generatorThread = NULL;
        }
        else
        {
            /* Thread started, module created, all complete.*/
        }
    }
}

static MODULE_HANDLE udp_generator_Create(BROKER_HANDLE broker, const void* configuration)
{	
    GENERATORDEVICE * result;
    if(broker == NULL)
    {
        LogError("NULL parameter detected broker=%p", broker);
        result = NULL;
    }
    else
    {
        /* allocate module data struct */
        result = (GENERATORDEVICE*)malloc(sizeof(GENERATORDEVICE));
        if (result == NULL)
        {
            LogError("couldn't allocate memory for BLE Module");
        }
        else
        {
	        result = (GENERATORDEVICE*)malloc(sizeof(GENERATORDEVICE));
    	    if (result == NULL)
       	 	{
            	/*Codes_SRS_BLE_CTOD_13_002: [ BLE_C2D_Create shall return NULL if any of the underlying platform calls fail. ]*/
            	LogError("malloc failed");
        	}
        	else
        	{
            	result->broker = broker;
        	}
            	result->udp_generatorRunning = 1;
             	result->udp_generatorThread = NULL;

            }

     }
    return result;
}


static void * udp_generator_ParseConfigurationFromJson(const char* configuration)
{
    return NULL;
}

void udp_generator_FreeConfiguration(void * configuration)
{
	return;
}
/*
 *    Required for all modules:  the public API and the designated implementation functions.
 */
static const MODULE_API_1 udp_generator_APIS_all =
{
    {MODULE_API_VERSION_1},
    udp_generator_ParseConfigurationFromJson,
	udp_generator_FreeConfiguration,
    udp_generator_Create,
    udp_generator_Destroy,
    udp_generator_Receive,
    udp_generator_Start
};

#ifdef BUILD_MODULE_TYPE_STATIC
MODULE_EXPORT const MODULE_API* MODULE_STATIC_GETAPI(GENERATOR_DEVICE_MODULE)(MODULE_API_VERSION gateway_api_version)
#else
MODULE_EXPORT const MODULE_API* Module_GetApi(MODULE_API_VERSION gateway_api_version)
#endif
{
    (void)gateway_api_version;
    return (const MODULE_API *)&udp_generator_APIS_all;
}

```

<br/>


This diagram shows the data flowing to IoT Hub from a gateway device by using the Azure IoT Gateway SDK.
 
 ![Data from gateway]({{ site.baseurl }}/images/DroneWorks/DataFromGateway.png)

<br/>

This screenshot shows the visualized data on Power BI.
 
 ![BI dashboard]({{ site.baseurl }}/images/DroneWorks/BI_dashboard.png)

<br/>

We finished an end-to-end pipeline including the gateway device by using the Azure IoT Gateway SDK.

## Conclusion ##

DroneWorks finished implementing the basic architecture of their Safety Flight Platform.

### General lessons

- The device twins function in IoT Hub is very useful for managing drone systems.
- The gateway function in the Azure IoT Gateway SDK matched the main strategy of DroneWorks so well that it made it much easier to get the gateway device into their system.
- Due to the differences in the PC ([Ubuntu](https://www.ubuntu.com/)) and Raspbian operating systems, codes which worked on the PC did not work on Raspberry Pi. This was because the way to obtain the symbol name was different on each OS when the Azure IoT Gateway SDK loaded a dynamic library.  
- The data from IoT Hub to Stream Analytics rarely took only a few minutes to arrive. This may be because of a lower plan or another reason, so if there is good information for solving this problem on the product page, it would be great.
- Azure IoT-related services are very scalable, so this architecture is durable even if many more drones are added to their platform.

### Opportunities going forward
  
DroneWorks is now discussing the standard communication method for drones with many organizations. After standardizing communication methods, they will change the communication method between the gateway device and the flight controller and make each communication secure based on the architecture we implemented. They will then gather more data and make a prediction system utilizing Machine Learning. They will also implement the device twins function into the gateway device.

Our coding time...

![Coding time]({{ site.baseurl }}/images/DroneWorks/Coding.JPG)

<br/>

## Additional resources ##

Documentation
- [Get started with device twins](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-node-node-twin-getstarted)

Resources
- [Device Management and Gateway SDK (Japanese)](https://docs.com/ota-hiroshi/6552/azure-iot-hub-device-management-and-gateway-sdk?fromAR=1)

GitHub repos
- [Azure IoT Hands-On (Japanese)](http://ms-iotkithol-jp.github.io/)
- [DroneWorks Git repository](https://github.com/drone-works)
