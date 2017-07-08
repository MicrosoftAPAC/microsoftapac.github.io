---
layout: post
title: "How Hornil brought StylePix application to Windows Store - Desktop Bridge"
author: "Dae Woo Kim, Hyewon Ryu"
author-link: "# add twitter link here"
#author-image: "{{ site.baseurl }}/images/authors/photo.jpg"
date: 2017-05-01
categories: [Desktop Bridge]
color: "blue"
image: "images/2017-05-01-hornil/hackfest.png" #should be ~350px tall
excerpt: Hornil brings their graphic software technology, which is used by more than 400 million worldwide, to the Windows Store.
language: [English]
verticals: [Cross-Industry]
permalink: /hornil-eng.html
---

- Solution overview
Hornil is a software company specialized in researching graphic software technology. With more than 400 million worldwide users, a unified store distribution environment, and a variety of Business model to prepare for launch in the Windows Store, Hackfest with Microsoft, after a series of technical reviews, StylePix products with Microsoft Desktop Bridge Technology to the Windows Store.  

### Core team:  
- Yeonil Gu - Hornil  
- Dae Woo Kim – Senior Technology Evangelist, Microsoft  
- Hyewon Ryu – Audience Evangelism Manager, Microsoft  

## Customer profile ##
![Hornil logo]({{site.baseurl}}/images/2017-05-01-hornil/logo.png)  
[Hornil](http://hornil.com/) is a software company in Seoul, Korea. Hornil was founded in June 2009 by Gu, Yeon-il in order to develop computer graphics software. They developed various software related to image editing and graphics such as [StylePix](http://hornil.com/products/stylepixpro/), [Photo viewer](http://hornil.com/products/photoviewer/), [Photo Resizer](http://hornil.com/products/photoresizer/). Their representative program, StylePix, is 100+ features, globally recognized graphical editing tool. This tool was introduced as an easy and powerful image editor more than 1,000,000 downloads in 202 countries.  

![Hornil StylePixPro]({{site.baseurl}}/images/2017-05-01-hornil/StylePixPro.png)  

StylePix Pro has been released on [Windows Store](https://www.microsoft.com/en-us/store/p/hornil-stylepix-pro/9p820tz13sxj) and has successfully converted all 100 StylePix features developed with Win32 to UWP and provides additional extensions such as UWP [Live Tile](https://docs.microsoft.com/en-us/windows/uwp/controls-and-patterns/tiles-and-notifications-creating-tiles).  


## Problem statement ##
Hornil promoted their software, StylePix and Photo viewer, to download from various websites. However, they were considering entering the new software market by realizing the limitations of existing downloading ways. Today, Windows 10 has a high market share in the OS market, and Windows Store is the most accessible market for users in Windows10. That's why Hornil wanted to launch their software into the Windows store. But developing a new UWP app is a burden for a team of two developers. They hoped to convert their existing Windows32 software to UWP.  

[![Hackfest video link]({{site.baseurl}}/images/2017-05-01-hornil/hackmember.jpg)](https://www.youtube.com/watch?v=AEDOiWSSReQ) 
[Hornil hackfest video, interview file link](https://www.youtube.com/watch?v=AEDOiWSSReQ)  

## Solution, steps, and delivery
Hornil and the hackfest team have been looking for the ground up for launch in UWP application. Desktop Bridge technology is the best platform for converting software developed with Win32 to UWP. For the basic knowledge, hackfest team refer to [Microsoft's Desktop Bridge Official Website](https://developer.microsoft.com/en-us/windows/bridges/desktop) and [Microsoft Virtual Academy - Desktop Bridge](https: //mva.microsoft.com/en-us/training-courses/developers-guide-to-the-desktop-bridge-17373?l=3d78c6WhD_9506218965). In particular, the contents of the MVA site are initially provided with a webcast service that provides step-by-step information to developers who want to convert existing win32 applications to the Desktop Bridge, so hackfest team could understand the overall UWP conversion process.  

The general conversion process is as follows.  
1. Convert to UWP
2. Add UWP feature
3. Windows Store publishing

### Convert to UWP
We have reviewed various ways to convert to UWP. Hornil StylePix is software that offers a variety of powerful image editing functions and uses resources such as registry access internally to implement these features. What the current software uses for the conversion process
It was necessary to prepare and review, and the [Prepare to package an app document](https://docs.microsoft.com/en-us/windows/uwp/porting/desktop-to-uwp-prepare), hackfest team was able to review the all process. Hornil StylePix was developed in C ++ and met the requirements of the Desktop Bridge.  

Hackfest team performed the conversion process [Create a Windows app package](https://docs.microsoft.com/en-us/windows/uwp/porting/desktop-to-uwp-root#convert). Team used packaging with the DAC(Desktop App Converter) and encountered certificattion related errors during this process.  

The first time you install an appx package that has been converted to a DAC, the following error message is displayed:  

```
"0x800B0109, A certificate chain processed, but terminated in a root certificate which isn't trusted by the trust provider."  
```

How to register a certificate is as follows. Double-click the auto-generated .cer file, install the certificate, and install it on both the Current User and the Local Machine. To verify that the certificate is properly registered, you can verify it by running cert by typing "certmgr" in the command window. This confirms that the DAC conversion is normal, has tested that the converted app is running properly, and confirmed that it is okay to run.  

### Adding UWP feature
Everyone on the Hackfest team made a surprisingly fast conversion.  

Once you've packaged your apps, you can light them up with features such as live tiles, and push notifications. Some of these capabilities can significantly improve the engagement level of your app and they cost you very little time to add. Some enhancements require a bit more code. In all, you'll have access to a wide range of UWP APIs. for a complete list, see UWP APIs available to Window Desktop Bridge apps.  

Subsequently, Hornil prepared the UWP function enhancement to add the automatic notification function of the UWP to the Live Tile. Accessing the UWP API requires some additional code to add APIs to existing applications.  

Several reviews were conducted to accomplish this. Since StylePix is a Win32 application developed in C ++, hackfest team reviewed the process for doing this, and in particular, I could see the detailed procedure in the MVA process.  

[MVA - Enhancing Desktop Applications with UWP Features - Demo Use UWP API in Your Code](https://mva.microsoft.com/en-us/training-courses/developers-guide-to-the-desktop-bridge-17373?l=3d78c6WhD_9506218965)  

```
  <Dependencies>
    <TargetDeviceFamily Name="Windows.Desktop" MinVersion="10.0.14393.0" MaxVersionTested="10.0.15063.0" />
  </Dependencies>
  <Capabilities>
    <rescap:Capability Name="runFullTrust" />
  </Capabilities>
```

StylePix is a complex application.  

I was able to refer to this in order to add live tile functionality. By referring to this content, UWP can be utilized for various purposes such as notification, user notice, and update information of UWP which is updated through the tile.  

The functionality of Live Tile was referenced to the [Microsoft sample code](https://github.com/Microsoft/DesktopBridgeToUWP-Samples/tree/master/Samples/VB6withXaml/UWPWrappers).  
  
```
String ^xml = "<toast><visual><binding template='ToastGeneric'><image src='Assets/" + file + "'/><text hint-maxLines='1'>New Landmark</text><text>" + text + "</text></binding></visual></toast>";
try
{
    if (notifier == nullptr)
    {
        notifier = ToastNotificationManager::CreateToastNotifier();
    }
    else
    {
        notifier->Hide(toast);
    }
    XmlDocument^ toastXml = ref new XmlDocument();
    toastXml->LoadXml(xml);

    toast = ref new ToastNotification(toastXml);
    notifier->Show(toast);
}
catch (Exception^ ex) { return false; }
return true;
```

This code is used to implement the Toast function, and UWP's push notification function and etc will be developed in the next version.  

### Store publishing
Before launching the store, Hornil checked whether there is a feature that does not work or has a problem with StylePix. As part of the store verification process, we needed to remove and release the "self-updating" feature. If you are using the Windows Store, you can only update via the Store, so we have removed this feature and passed store verification. The Hackfest team got the following guide and executed the WACK before the final store submission.  

[Windows App Certification Kit](https://developer.microsoft.com/en-us/windows/develop/app-certification-kit)

Hornil already have launched StylePix on a variety of download sites, hornil took full advantage of the release experience. However, in order to obtain permission for the Desktop Bridge, it had to be authorized and approved. You must be authorized for Desktop Bridge before it can be released to the Windows Store.  

In addition, there was this error in the store publishing process, and hackfest team was able to solve it.  

```
•	Package acceptance validation error: You don't have permissions to specify the following namespaces in the appx manifest file of the package Hornil.23E9620B19.appx: http://schemas.microsoft.com/appx/manifest/foundation/windows10/restrictedcapabilities
•	Package acceptance validation error: Your developer account doesn’t have permission to submit apps converted with the Desktop Bridge at this time. https://aka.ms/desktopbridgeforwindowsstore
```

This is because there is no "runFullTrust" permission used in the Desktop bridge. To get this permission, you can find relevant information at [App capability declarations](https://docs.microsoft.com/en-us/windows/uwp/packaging/app-capability-declarations), and request from the link below.  
[How to publish your desktop app or game to Windows Store](https://developer.microsoft.com/en-us/windows/projects/campaigns/desktop-bridge)  

![Hornil hackfest image]({{site.baseurl}}/images/2017-05-01-hornil/hackfest.png)  

## Conclusion ##
Quote
> Hornil needed a UWP app to publish StylePix app, the leading graphic editing software on the Windows Store. However, all of Hornil's apps were built on Win32 technology, so we needed to develop a new UWP app for store listing. Hornil StylePix has an engine for image processing and a UI for communicating with the user. In order to be provided with UWP, at least UI part had to be redeveloped. In fact, there was a huge burden of having to develop one more new app. I was able to use Microsoft Desktop Bridge technology through Hackfest and it was very easy to convert Win32 app to UWP app and launch it on Windows Store. Actual app conversion process did not have any problem after setting DAC and doing a few setup properly. Hornil will convert various graphics software into UWP apps in order to globalize in the future and expect to be able to reach users more easily. In addition, we look forward to seeing more developers join the Windows Store through Desktop Bridge technology to create a richer app experience. - Yeonil Gu, CEO of Hornil  

Microsoft's Desktop Bridge technology makes it easy to integrate legacy win32 applications built with existing Win32 applications, such as WPF or Winform, or even Visual Basic 6.0 technology, which was created over 15 years ago, and C++ - a technology that can be created as a Windows Store App. As you know, to create a UWP app, it has been a big problem for many win32 application developers to change a lot of UI design and design as well as near redevelopment effort. However, Desktop Bridge technology and Desktop App Converter(DAC) technology solve these developers' challenges. We were able to easily convert existing Win32 apps with little code conversion, and in fact, we were able to easily convert Win32 apps into Windows Store apps in just couple days using Desktop Bridge technology. Now it's as easy and convenient as a new way to go without changing code for existing applications, and these technologies will be a huge benefit for developers.  
