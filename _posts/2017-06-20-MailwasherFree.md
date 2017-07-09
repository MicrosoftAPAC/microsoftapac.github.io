---
layout: post
title: "Bringing MailWasher - a five star email spam filtering application - to the Windows Store using the Desktop Bridge"
author: "Regan Murphy"
author-link: "http://twitter.com/nzregs"
#author-image: "{{ site.baseurl }}/images/authors/photo.jpg"
date: 2017-06-20
categories: [Desktop Bridge]
color: "blue"
image: "images/2017-06-20-Mailwasher/mailwasher_splash_help.png" #should be ~350px tall
excerpt: Using the Desktop Application Converter, Firetrust was able to rapidly bring MailWasher Free to the Windows Store.  Already used by over 8 million people,  MailWasher Free will now be simple to acquire, via the Windows Store, for the 400 million users running Windows 10 Desktop.    
language: [English]
verticals: [Security]
geolocation: [New Zealand]
---

MailWasher ([www.mailwasher.net](http://www.mailwasher.net)) is the leader in spam filter software, and the easiest way to check and manage your e-mails before you download them to your computer. MailWasher is free to use and won't ever expire. It works with Windows Mail, Outlook.com, Gmail.com, and every other email program. Over 8 million people use MailWasher as their spam filter, and it has been featured on television on both CNN and BBC.

Made for the Windows Desktop, MailWasher is written in both C# and C++.  Firetrust was keen to bring MailWasher to the Windows Store, but re-writing the application from-scratch would have meant a lengthy delay before it was available.  The Desktop Application Converter, part of the Desktop Bridge technologies for Windows 10, made bringing the MailWasher  application to the store simple, fast, and without any code changes.  

## Core Team ##
- Nick Bolton ([@firetrust](https://twitter.com/firetrust))  CEO, Firetrust Ltd
- Regan Murphy ([@nzregs](https://twitter.com/nzregs))  Senior Technical Evangelist, DX, Microsoft NZ

## Customer profile ##

Firetrust ([firetrust.com](http://firetrust.com)) was founded by Nick Bolton in 2000 with plans to develop an easy to use anti-spam software product for consumers.  Following this, in 2001 MailWasher was released to the world and quickly became very popular because it allowed users to easily take control of their email.

Firetrust exports 99% of its software to the world with the main markets being USA, UK, and Australia. Correspondingly, many of the staff at Firetrust have come from countries such as UK, Germany, Jordan, Pakistan, Chile, China, and Vietnam.  Firetrust is headquartered in Christchurch, New Zealand.


## Problem statement ##

The Windows 10 Store makes finding apps, and installing them, much easier for users.  Many of the potential users of MailWasher are consumers, and may not be confident downloading and installing software themselves.  Having MailWasher discoverable for these users in the Windows Store will help bring the software to a new, wider, audience.

MailWasher was initially built in 2000, and has been continuously updated and enhanced ever since.  The software is built using both C++ and C# and the developers use both Visual Studio 2008 and Visual Studio 2010.  The use of these technologies has meant that MailWasher would need a rewrite before it could be bought to the Windows Store.  That is, however, until the Desktop Bridge technology was created.

Firetrust wanted to bring MailWasher to the Windows Store, but did not have the time or resources to rebuild the application from scratch as a UWP application.

## Solution, steps, and delivery ##

With the Desktop Bridge technologies, developers can take "Win32" applications and package them for the Windows Store.  There are many different methods for doing this. The method that requires the least amount of work, and zero changes to the existing developer environments, was to convert an existing MSI installer file into an Appx package using the [Desktop App Converter](https://docs.microsoft.com/en-us/windows/uwp/porting/desktop-to-uwp-run-desktop-app-converter).

With the Desktop App Converter, Firetrust could quickly package MailWasher for the Windows Store.  The steps were as follows:
1)	Prepare the dev environment
2)	Obtain the installation source packages for MailWasher
3)	Package MailWasher into an Appx bundle using the Desktop App Converter
4)	Deploy MailWasher Appx to a Windows 10 environment and test
5)	Obtain the RunFullTrust permission and publish the MailWasher Appx package to the Windows Store 

A detailed walkthrough of the steps to package an app can be found in the [Package an app using the Deskktop App Converter (Desktop Bridge)](https://docs.microsoft.com/en-us/windows/uwp/porting/desktop-to-uwp-run-desktop-app-converter) article which is part of the [Desktop Bridge](https://docs.microsoft.com/en-us/windows/uwp/porting/desktop-to-uwp-root) documentation.  

The simple command we used to run the Desktop App Converter and generate the packages was as follows:

*Code Snippet 1  Running the Desktop App Converter to produce the Appx bundle*
```ts
DesktopAppConverter.exe -installer .\MailWasher_free_setup_7_11_02_19062017.msi -destination c:\dac\output -PackageName "Firetrust.MailWasherFree" -PackageDisplayName "MailWasher Free" -AppDisplayName "MailWasher Free" -Publisher "CN=AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE" -PackagePublisherDisplayName "Firetrust" -version "7.11.2.0" -Makeappx -sign -PackageArch x86
```

## MailWasher in action ##

Below is a screenshot taken from the MailWasher app running on Windows 10 on a Microsoft Surface device:

![MailWasher Email View](../images/2017-06-20-MailWasher/mailwasher_email_view.png)

Getting up and running is as simple as deploying the [MailWasher Free](https://www.microsoft.com/store/apps/9n88hdrhpnm2) app directly from the Windows Store, configuring your email account details, and sitting back to watch MailWasher work its magic. For new users, there is a handy tour shown by default as can been seen in the following screenshot: 

![MailWasher Help Splash Screen](../images/2017-06-20-MailWasher/mailwasher_spash_help.png)

## Try it for yourself! ##

Mailwasher is now available for Windows 10 and can be found in the [Windows Store](https://www.microsoft.com/store/apps/9n88hdrhpnm2?ocid=badge) so you too can start cleaning your mail and boosting your productivity.

<a href="https://www.microsoft.com/store/apps/9n88hdrhpnm2?ocid=badge"><img src="https://assets.windowsphone.com/f2f77ec7-9ba9-4850-9ebe-77e366d08adc/English_Get_it_Win_10_InvariantCulture_Default.png" alt="Get it on Windows 10" width="180px"/></a>


## Issues encountered, and solutions found ##

We had initially intended to also bring MailWasher Pro to the Windows Store.  MailWasher Pro unlocks the ability to use multiple email accounts in MailWasher. Because there is no automated way to incorporate in-app purchases when using the Desktop App Converter, we will need to take a different approach.  For MailWasher Pro, we will need to bring the primary application development environment up to the latest version of Visual Studio and incorporate the use of the Desktop Bridge APIs - especially the Windows.Services.Store API for in-app purchases.  There is sample code for adding in-app purchases in the [Store API Sample](https://github.com/Microsoft/DesktopBridgeToUWP-Samples/tree/master/Samples/StoreSample) within the [Desktop Bridge to UWP Samples](https://github.com/Microsoft/DesktopBridgeToUWP-Samples/tree/master/Samples/StoreSample) available on GitHub.

## Next Steps ##
The journey does not stop here.  Next up will be bringing MailWasher Pro to the store by incorporating the Windows Store APIs to manage in-app purchases. Beyond this we will look to the user cases for implementing Push Notifications, Live Tiles, and other functionality introduced in Windows 10.  To explore the range of  other APIs that are available to desktop bridge apps, see the following documentation: [UWP APIs that are available to a Desktop Bridge packaged app](https://docs.microsoft.com/en-nz/windows/uwp/porting/desktop-to-uwp-supported-api).

 
## Conclusion ##

Bringing the free version of MailWasher to the Windows Store was simple, fast, and completed without any code changes. This will make the MailWasher app discoverable and easily installable by 400 million+ customers running Windows 10 desktop around the world. Once we get MailWasher Pro into the Windows Store this should drive new revenue from markets that have been previously untapped. 