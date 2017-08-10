---
layout: post
title:  "SnapBizz enables disruptive innovation for Indian “Kirana” stores using Xamarin for Android and Windows Apps and secure cloud, powered by AzureV"
author: "Deepthi Anantharam, Prachi Kushwah"
author-link: "https://twitter.com/Deananth, https://twitter.com/PrachiKushwah"
#author-image: "{{ site.baseurl }}/images/authors/photo.jpg"
date:   2016-09-01
categories: [Xamarin, Azure]
color: "blue"
image: "{{ site.baseurl }}/images/Xamarin-Snapbizz/dashboard23.png" #should be ~350px tall
excerpt: Snapbizz with the help of Microsoft ported all the features of their Android app to Windows App using Xamarin as Middle Tier to support cross platform code sharing along with changes planned for version 2.0 of SnapBizz Android App making it GST compliant.
language: [English]
verticals: ["Retail, Consumer Products & Services"]
geolocation: India
---


Snapbizz builds a custom solution that addresses the unique needs of the Indian “Kirana” by consolidating its portfolio of apps using Xamarin for Android and Windows and also  making the app GST (Goods and Services Tax) compliant.

 
 
## Core Team: 
- Deepthi Anantharam, Sr. Technical Evangelist, Microsoft
- Abhimanyu Singhal, iMentor (Microsoft partner)
- Narayanan Subramanian, Snapbizz


 
## Customer profile ##

In a diverse market like India, where the traditional “kirana” (local) stores make 98% of store coverage and 85% of business. Among them, top 5% (4-5 lakh stores) contribute to more than 30% of business. The shelf life of POS material is extremely limited, sometimes just one day. Its effectiveness is even more limited by the quality of seller, merchandiser and relationship with store owner. Same can be said about a brand’s engagement  directly with the retailer. It’s extremely limited and in-effective depending on quality of seller and frequency of visits made. The standalone traditional retailer (at top of the coverage pyramid), faces severe competition from Modern Trade and also E-commerce is highly aspirational about consumer promotions and significantly better shopper experience.
In order to join all the dots of this fragmented space, [Snapbizz](http://www.snapbizz.com/)  has created a disruptive solution hosted on Azure to address the business needs of the FMCG ecosystem (brands, retailer, consumer, and distributor) in large/medium “kirana” stores.

The benefits are as follows : 
- Delivering to retailers: Improved profitability by transforming them using contextual visibility of merchandize and smart store management. It helps with more customers, improves loyalty in customers and increases profit
- Delivering to brands: Connects brands to retailers and end customers. It helps to engage, track and better manage their retailers and influence end customers

Product also has the following prominent features:
-	Highly improved visibility:
Display products and offers to customers just like a supermarket and make them buy more
-	Fast, easy billing:
Bill multiple customers at the same time. Bill both packaged and loose items
-	Stock Management:
Reduce excess stock, purchase smarter and improve profitability. Also, get schemes from brands directly
-	Customer Relationship Management:
Know you customer much better, manage credit and push offers through SMS. Send special greetings and reminders
-	Web Store:
Let your customers order online from your store and improve your customer base
-	Easy to install:
Simply unpack, plug and play!

 
## Problem statement ##

The SnapBizz solution consisted of four separate tablet applications, two mobile applications and a backend cloud server:
1. Billing Application: To generate bills(invoices) for customers and distributors 
2. Inventory Application: To keep all stocks information 
3. Push Offer Application: To send campaign messages[SMS] to customers 
4. Dashboard Application:  This app displays analytics reports and ad campaigns
5. Consumer Mobile App: For consumers to make order to retail outlets 
6. Merchant Mobile App: For retailers to see all the orders made by consumers 
7. Backend Application: Stores all master data and syncs with user transaction data

Application integrates with different hardware peripherals including 
-	USB Printers
-	Bluetooth Printers
-	Android TV Dongle
-	Credit/Debit Card Swipe Machines
-	Miracast
-	DLNA Dongles
-	Bluetooth Weighing Machines
-	Barcode Scanners

 ![Hardware peripherals]({{ site.baseurl }}/images/Xamarin-Snapbizz/devices.png)

The key problems that needed to be resolved were as follows:
1.	Code maintenance for the four tablet apps and the two mobile apps was cumbersome. Anytime a feature had to be introduced, the feature had to be written across the projects, dependencies had to be taken care of, consequently velocity of development was slow. E.g. Govt. of India has mandated all establishments to be GST (Goods and Services Tax) compliant by June. Getting this done across their applications was going to be a challenge

2.	The traditional PoS (Point of Sale) system could handle single bill at a time. At peak times this became a bottleneck with requests coming in from multiple apps. The application needed to have multi-billing enabled in every retail store

3.	Having four apps also resulted in conflict during local database sync with every transaction. E.g. Earlier the main dashboard was dependent on data from the billing app which resulted in broken experience if there was no/delayed sync between the databases. Hence it was essential to unify the apps with a common database

4.	Since the solution comprised of multiple devices over a local network, figuring out the IP address of the devices was a challenge. 

The SnapBizz team set out to consolidate  the Billing, Inventory, Push Offer and Backend apps into a single application to make the user experience seamless and increase maintainability of the code. They decided to use Xamarin to develop the consolidated app with a single source code, so that they provide choice of devices - either Windows or Android – to their users

 
## Solution, steps, and delivery ##

### Targeting Cross Platform ###
To enable code sharing for all platforms, the solution was re-architected using SOLID Principles ( Single-responsiblity, Open-closed, Liskov substitution, Interface segregation, Dependency Inversion ) of Object Oriented Development along with Common Patterns Like MVVM, Dependency Injection, Inversion of Control (IoC) achieving 75% code reuse.

![Code Sharing across Platforms]({{ site.baseurl }}/images/Xamarin-Snapbizz/codesharing1.PNG)

Code is organized by using Shared Projects in Visual Studio and a Platform Specific project for each targeted platform. The solution includes UWP App for Windows 10, Xamarin.Android App for Android, WPF Desktop App for Windows 8.1 and Below, and Shared Project which has shared code. 

  ![Project Structure in VS2017]({{ site.baseurl }}/images/Xamarin-Snapbizz/projectstruct2.png)

Application integrates with various hardware peripherals such as USB printers, bluetooth printers, android TV dongle, credit/debit card swipe machines, Miracast, DLNA Dongles, bluetooth weighing machines, barcode scanners.
Each of these devices has a distinct API and challenge was compounded as each platform-UWP, Android and WPF, had separate implementations. Integration across platforms could be accomplished by using Shared Project and Dependency Injection. 
Wrappers for these API’s were written for each platform using C# and .NET/Xamarin. These wrapper objects/methods were invoked/injected into Models/ViewModels and other layers with the help of MVVMCross IoC Library. 

An interface was created to abstract/encapsulate all operations/calls to device API’s 

  ![1]({{ site.baseurl }}/images/Xamarin-Snapbizz/interface3.png)

Interfaces created were then implemented in each platform specific project separately.

  ![2]({{ site.baseurl }}/images/Xamarin-Snapbizz/datagram4.png)

From Shared Code these interfaces were resolved with the help of MVVMCross and used. While resolving MVVMCross checked on which platform the application is running and provided an implementation for that platform using built in registration and resolve mechanism for IoC (Inversion of Control). 

  ![3]({{ site.baseurl }}/images/Xamarin-Snapbizz/datagram5.png)

![4]({{ site.baseurl }}/images/Xamarin-Snapbizz/diag6.PNG)

### Multiple POS (Point of Sale) ###
For running Multiple POS (Point of Sale) in a store, a retail organization could have a mixed set of Tablet Devices. For example, a store could have only Windows 10, only Android or a combination of Windows and Android devices. One of the devices will be working as a local server and other devices will be syncing their data to server. This required implementing sync between different platforms. i.e. a Windows device is configured as server whereas multiple android and windows devices are configured as client.

![5]({{ site.baseurl }}/images/Xamarin-Snapbizz/localserver7.PNG)

Sync was implemented by Hosting REST API’s in a separate process on the device running as server. Since the end users will not be having a local administrator available and to keep the maintenance cost low, REST server is discovered using UDP(User Datagram Protocol) Discovery. i.e. each device sends a UDP Broadcast on the network to discover which device is configured as server. Server device responds with a UDP Message telling its IP address to all other devices. Client devices then starts sending updated data to server using REST Messages. 
Implementing REST Client and Server was easier with C# .NET and Xamarin support for Microsoft HttpClient Libraries and shared code was used in REST Client implementation for all platforms. 
![6]({{ site.baseurl }}/images/Xamarin-Snapbizz/win-droid8.png)


### Visibility Integration(Dashboard Application) ###
 SnapBizz App provides a digital signage solution along with POS (Point of Sale) application. Using this solution, a retailer can project offers and discounts over one or more LED TV’s within store. The same infrastructure is used by SnapBizz to advertise specific brand campaigns within stores. This required integration of Multiple Display Technologies: including Miracast, DLNA and Android TV. 
SnapBizz App on Windows or Android Maintains a list of Store Offers which are required to be projected over LED’s. It also downloads content from cloud related to brand campaigns. C#, .NET and Xamarin were used to implement shared logic for projecting these offers and campaigns to screens. 

![7]({{ site.baseurl }}/images/Xamarin-Snapbizz/localserver8.PNG)

Implementation was done using Dependency Injection and IoC (Inversion of Control). Single interface which provides the logic of pushing store offers and campaigns to LED’s

![8]({{ site.baseurl }}/images/Xamarin-Snapbizz/visibility10.png)

Specific Implementations for different interfaces: Miracast, DLNA, Android TV

![9]({{ site.baseurl }}/images/Xamarin-Snapbizz/visibility11.png)

When a user asked for an inventory product to be synced with LED, UDP Discovery was used to discover IP address for LED device and based on its type (Returned by device as UDP broadcast) an instance of interface was constructed and used to send offers and updates to the device. 

![Screen form where user can see what offers are currently running on LEDs]({{ site.baseurl }}/images/Xamarin-Snapbizz/led12.png)

![Other Display Unit]({{ site.baseurl }}/images/Xamarin-Snapbizz/led13.png)

### Printers and Payment Providers ###
The app required printing capability and stores can have different kind of thermal printers including USB or Bluetooth. Most of the USB Printers had a special Android SDK. Same was true with Payment Providers. They had an Android SDK written in Java. 
Java SDK’s were used without having to re-write their SDK’s for Xamarin. For this Xamarin Binding Projects was created, which provided a Wrapper around existing Android Java Libraries and could be used from C# and .NET. There Binding Libraries were used using same Dependency Injection and IoC pattern from Shared Code Base. 

![10]({{ site.baseurl }}/images/Xamarin-Snapbizz/binding14.PNG)

![Android App with JIO Payment Device and USB Printer]({{ site.baseurl }}/images/Xamarin-Snapbizz/jio15.png)


### User Interface, Views & Other Components ###
One of the major requirements was that the app should work on low end devices and the user interface should be consistent across devices- both windows and android with 100% feature parity.  User interface was implemented using native UI Languages for each platform. XAML for Windows UWP, AXML for Android. All views were created separately and the whole middle tier of application was re-used including database, backend services, models (Business Logic, Role Based Access Control), and other infrastructure services like logging and application pre-emptive maintenance, security etc. 

![11]({{ site.baseurl }}/images/Xamarin-Snapbizz/components16.PNG)


### Database & Offline ###
Being a business application app required to have support for querying and transactions. Also, considering sporadic internet connectivity all data had to be maintained at the store level to support Offline Usage and Reporting. 
Xamarin and Shared C# Code became an enabler for diverse and complex data storage requirements. Essentially there was data storage and real time updates required. When a user launches the app initially, app downloads all relevant data for user/store to local device. 
SQLite was an obvious choice for an in-app database which will be used to maintain all data. Being sensitive information. All data was to be kept encrypted. 
In case records were created offline, they were being synced to backend services deployed on Azure(DocumentDB) periodically based on Triggers. 
SQLite PCL NET Library was used, which enabled all of the data access code to be written in shared project. 

![12]({{ site.baseurl }}/images/Xamarin-Snapbizz/db17.png)

For Sync Operation, C# Supported background tasks were used which made programming easier. Since it required to write simple async operations with help of async and await keywords, background tasks could be started based on timers and cancelled in between. The sync jobs invokes a Java based web service hosted on Azure, at a frequency of 5 minutes which in turn connects to the DocumentDB. 


 ![13]({{ site.baseurl }}/images/Xamarin-Snapbizz/sync18.png)

### Role Based Access Control and Business Logic ###
Since the application will be used by multiple users in a retail store/chain of stores, role based access control and securing access by restricting who can perform which operations was important. In a traditional scenario where app is written separately for each platform would have required this to be written separately since each platform has different security infrastructure. Using Xamarin & .NET helped here since developers could write shared code and use dependency services to Identify users and perform authorization based on it. Ensuring code execution security, un-authorized users simply could not execute the code of application. 
App used shared business logic in Models and View Models, this was not duplicated.

Screenshots

 ![Store Registration]({{ site.baseurl }}/images/Xamarin-Snapbizz/storereg19.png)

 ![Login]({{ site.baseurl }}/images/Xamarin-Snapbizz/login20.png)
 
 ![Multiple Carts for Billing]({{ site.baseurl }}/images/Xamarin-Snapbizz/multiplebilling21.png)
 
 ![Customer Management]({{ site.baseurl }}/images/Xamarin-Snapbizz/customerreg22.png)
 
 ![Dashboard]({{ site.baseurl }}/images/Xamarin-Snapbizz/dashboard23.png)
 
 ![Push Offers]({{ site.baseurl }}/images/Xamarin-Snapbizz/pushoffer24.png)
 
 ![Distributor Management]({{ site.baseurl }}/images/Xamarin-Snapbizz/distributor25.png)
 
 ![Inventory Management]({{ site.baseurl }}/images/Xamarin-Snapbizz/inventory26.png)


The diagram below shows interaction between various components of the system:  

 ![Xamarin Architecture Diagram]({{ site.baseurl }}/images/Xamarin-Snapbizz/snapbizz-xam.png)

 ![Overall Architecture Diagram]({{ site.baseurl }}/images/Xamarin-Snapbizz/architecture27.png)


## Conclusion ##

The consolidated SnapBizz app uses Xamarin.Android solution built in C#, that runs natively on Android. The UI uses Android XML. The Windows 10 support is provided by a Universal Windows Platform (UWP) project that uses XAML for the UI and provides a unified experience across computers and devices running Windows 10, including Surface tablets and Windows 10 Mobile phones. 

Following the MMVMCross architecture style, the app has the UI logic in Views. Model are business objects. They provide the factory get and set methods as well as the validation rules. View Models are coordinators between the View and the Model. They provide behavior which the Views will be calling to get the action initiated by the user/system done.

All common code was structured in a Shared Project to facilitate calls to platform-specific APIs. This includes Views, ViewModels, Models, Services, Helpers, Extensions and Behaviors and this ensure consistency across custom class structures used to exchange data between the server and mobile clients.
The app manages data for the various business modules mentioned above in SQLite on the devices. A background job will sync data between the local data on SQLlite to DocumentDB on Azure. Only delta of changes is transferred.

The application interacts with a variety of external devices such as POS, Barcode Scanners, Printers, Billing Systems, Weighing Scales etc.). Device Services provides access to device specific APIs(Connectivity API, Bar code API, Notifications API, Printing API and Weighing API) to Views and View Models. Specifically in case of POS devices, If the retailers already have an existing POS, a PCL( Portable Class Library) plugin integrates the app with existing devices. For devices, where APIs are already written in Java, e.g. payment options plugin, the libraries have been wrapped in C# wrappers to invoke Java code via C# calls. For others, WCF Services interacts with the device specific APIs.  

Multi-billing was enabled by creating a master-slave configuration with devices in every store. One of the devices acts as a server and is responsible for the sanctity of the billing requests. All other Android and Windows devices act as clients and queue up bills with the server. The server device sends a broadcast message via UDP to discover and register other devices. 
The application uses role based access control to authenticate and authorize users across its various features and functionality.

Owing to the shared codebase, testing the application has become easier.
With a single shared codebase of the unified app, the velocity of feature releases improved. While it took over a year to achieve the android app ecosystem, this implementation was done in a period of 3 months.

*"The Architecture uses shared code and libraries that is used across both Windows UWP and Xamarin for Android platforms. This has allowed us to move at a fast pace and release solutions to the market based on customer preference if they wish to adopt Windows or Android platforms. This architecture will allow us to target Windows PC in the future very easily. All we need to is to add Views using WPF using the same shared code base. 
We spent a lot of time deciding upon this architecture and that has helped us to achieve agility in the market place."- Narayana M. Subramanian, Director - Product Design, Snapbizz.*

Going forward the team wants to improve the reporting framework- App Trace, Debug & Usage & Crash Analytics with Azure App Insights & Hockey Apps. Integration of chatbots and ML into their apps, is in the pipeline.

