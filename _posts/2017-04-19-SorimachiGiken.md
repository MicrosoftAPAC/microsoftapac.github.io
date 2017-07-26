---
layout: post
title:  "POS and CRM packages optimized for Xamarin and Microsoft Azure PaaS"
author: "Daisuke Inoue"
author-link: "#"
#author-image: "{{ site.baseurl }}/images/authors/daisukei.jpg"
date:   2017-04-20
categories: Xamarin
color: "blue"
image: "images/SorimachiGiken/1allmember.png" #should be ~350px tall
excerpt: New versions of the POS and CRM packages in operation on-premise optimized for Xamarin and Microsoft Azure PaaS.
language: English
verticals:  Retail
geolocation: [Japan]
---
[Sorimachi Giken Co., Ltd.](http://www.s-giken.co.jp/corpinfo/) has Xamarin.Native and WPF resources and they started to consider the implementation of UWP app. However, promptly providing applications with native support for various platforms is becoming difficult due to the diverse range of OSes and devices available on the client side, such as iOS, Windows, and Android. So they reconsidered moving them into Xamarin.Forms. Rebuilding with Xamarin.Forms, they also challenge PCL code sharing among iOS, Android and Windows. About three years ago, they had already considered Xamarin.Forms. However, as Xamarin.Forms at that time was so weak, they stopped it and they implemented with Xamarin Native. But they started reconsidering Xamarin.Forms because they admitted it has well-evolved enough to use.
In this HackFest, we helped them move their Xamarin Native resources into Xamarin.Forms with teaching how to write code with Xamarin.Forms and also we believe Azure PaaS would drastically reduce development and operating costs compared to the cloud services of other companies. We think that utilizing services such as machine learning that were difficult to implement on-premises would enable us to provide customers with new added value that we cannot offer under our existing system.

### Key technologies
- Xamarin Forms
- Event Hubs
- Machine Learning
- Power BI
- Web Apps
- SQL Data Warehouse
- Data Factory

## Customer profile ##
[Sorimachi Giken Co., Ltd.](http://www.s-giken.co.jp/corpinfo/) is an independent company developing our business with in-house technology and our own brand of products. We provide system solutions for companies in the distribution and retail sectors, develop original products, and create new business and products in partnership with companies specialized in the e-money and mobile industries using cutting-edge technology. We participate in many IT-related committees, and we are a coordinating member of initiatives aimed at the domestic and international standardization of technology such as e-money to facilitate business that benefits society as a whole.


![People]({{ site.baseurl }}/images/SorimachiGiken/1allmember.png)

## Problem statement ##
We currently provide services centered around single-tenant applications to medium and large-scale customers. However the advent of technologies such as Amazon Go has intensified competition in the POS (Point of Sale) industry, so we feel that it will become increasingly difficult to expand our business using conventional development and operation techniques going forward.
Another consideration is the fact that promptly providing applications with native support for various platforms is becoming difficult due to the diverse range of OSes and devices available on the client side, such as iOS, Windows, and Android. 


## Solution and steps ##
We want to design and develop new versions of the POS and CRM packages in operation on-premise optimized for Microsoft Azure PaaS. Our goal is to acquire new users by providing multi-tenant applications that can also be used by personal business owners and small-scale companies. We believe Azure PaaS would drastically reduce development and operating costs compared to the cloud services of other companies. We also think that utilizing services such as machine learning that were difficult to implement on-premises would enable us to provide customers with new added value that we cannot offer under our existing system.
We also provide existing iOS and Android tablet applications implemented using the separate native code for each platform. With this project, we aim to improve the efficiency of development and maintenance by increasing the amount of shared code as much as possible using Xamarin.Forms. We believe that utilizing the Xamarin cross-platform development environment will make rapid development and maintenance possible through code sharing.


For small-scale users, we provide reasonably-priced multi-tenant solutions with only simple functions. Here is a diagram. In terms of the front end, we provide Web Applications for PC and Smart Phone to do the routinized word. And also we provide Xamarin Applications for POS tablets. It provides rich, easy-to-use applications that support multiple devices (iOS, Android) using Xamarin.Forms and sends a bunch of requests depending on the number of customers to Event Hubs. We believe Event Hubs can handle it.
![Arch]({{ site.baseurl }}/images/SorimachiGiken/3smallarch.png)

For large-scale users, we add scalability and data analysis functions.
 It produces sales forecasts by performing regression analysis in Azure Machine Learning using accumulated data. Recommend the best products for customers. Accumulated data obtained from devices along with internal company data in the Azure SQL Data Warehouse using Azure Data Factory and also enable end users to analyze data themselves using Power BI. Additionally, it sends notifications about the status of store congestion in real time using the Cognitive Services Computer Vision API.
![Arch]({{ site.baseurl }}/images/SorimachiGiken/4.bigarch.png)
 

## Technical delivery ##
We selected Xamarin.Forms to enable more efficient cross-platform development and maintenance, and we were able to share source code between platforms. The appearance of the standard controls is also sometimes different depending on the version of Android used, but we circumvented this issue using a custom renderer. As a result, we were able to share close to 60% of the code through Hackfest with Microsoft, which we believe will enable us to swiftly handle both new development and changes to specifications.

![People]({{ site.baseurl }}/images/SorimachiGiken/5hacking.png)


Now let’s take a deep dive into the solution technical details. They have POS system. The entire system consists of three systems below. 
- Main system: sales management (Web application) 
- Handy terminal  shipping, inventory system (Cordova (Android/ iOS)) 
- Tablet POS: sales, payment (settlement) system Native application 

They were considering Table POS moving Xamarin.iOS resources into Xamarin Forms so that they can share PCL resource among iOS project, Android project and UWP project. So we focused on Tablet POS system with Xamarin Forms. We wanted to share codes using PCL as much as possible. The architecture diagram is below.
![PCL]({{ site.baseurl }}/images/SorimachiGiken/9PCLArc.PNG)


However,  some features such as 'System.IO.File.GetLastWriteTime' are not included in PCL as shared code. So we decided to make wrapper module to maximize shared codes. The architecture diagram is below.
![PCL]({{ site.baseurl }}/images/SorimachiGiken/8PCL.png)
Here is the sample code we built.
[https://github.com/chomado/PluginSample](https://github.com/chomado/PluginSample)


iOS ClassLibrary “AssemblyTimeStamp.iOS"
```Csharp
using System;
using System.Reflection;
 
namespace AssemblyTimeStamp 
{
    public static class TimeStampUtil
    {
        public static DateTime GetAssemblyTimeStamp()
        {
            return System.IO.File.GetLastWriteTime(
                path: "AssemblyTimeStamp.dll"
            );
        }
    }
}

```


Android ClassLibrary “AssemblyTimeStamp.Droid
```Csharp
using System;
using System.Reflection;
 
namespace AssemblyTimeStamp
{
    public static class TimeStampUtil
    {
        public static DateTime GetAssemblyTimeStamp()
        {
            var assemblyTimeStampDllPath = typeof(TimeStampUtil).Assembly.Location; 
 
            return System.IO.File.GetLastWriteTime(
                path: assemblyTimeStampDllPath
            );
        }
    }
}

```

As a result, we developed following UI using Xamarin Forms. 
![PCL]({{ site.baseurl }}/images/SorimachiGiken/10UXPOS.PNG)



We also ensure scalability by utilizing Event Hubs and App Services to receive server-side messages. We accumulate and manage data acquired along with on-premise internal company data in bulk by loading it into the Azure SQL Data Warehouse regularly using Azure Data Factor. We made it possible to visualize and analyze accumulated data with Power BI. This enables end users to analyze transactions and accumulated data themselves using Power BI. We will also perform predictive analysis via Azure Machine Learning based on accumulated data, and provide this to users.

We are sharing the sample codes below.

[https://github.com/daisukei777/HSD](https://github.com/daisukei777/HSD) 

![People]({{ site.baseurl }}/images/SorimachiGiken/6hacking.png)


## Conclusion ##
Utilizing Xamarin we were able to share close to 60% of the code, and we believe we can capitalize on this to achieve faster development and maintenance. However, since there are just a few staff who have the required skills inside the company, we feel it will be necessary to foster new talent.
By understanding the many services of Microsoft Azure, and combining them in an optimal manner, we think we can improve the efficiency of development and operation, and provide customers with new added value that we cannot offer under our existing system.


## Additional resources ##
GitHub repos   
- [https://github.com/daisukei777/HSD](https://github.com/daisukei777/HSD) 
- [https://github.com/chomado/PluginSample](https://github.com/chomado/PluginSample)



