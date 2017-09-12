---
layout: post
title: "Using Desktop Bridge, SaitoKikaku converts Hiemaru Editor to a Windows UWP app"
author: "Shozo Arai"
author-link: "https://blogs.msdn.microsoft.com/shozoa/"
#author-image: "{{ site.baseurl }}/images/authors/photo.jpg"
date: 2017-05-02
categories: [Desktop Bridge]
color: "blue"
image: "images/SaitoKikakuHidemaru/SaitoKikaku.png" #should be ~350px tall
excerpt: Saito Kikaku wanted to meet the demand for a Windows Store version of its successful Hidemaru Editor as text editor software. Beginning with communications, Saito Kikaku and Microsoft worked through the conversion process. 
language: English
verticals: [Retail & Consumer Goods]
geolocation: [Japan]
---

<img alt="Hidemaru Editor public" src="{{ site.baseurl }}/images/SaitoKikakuHidemaru/SaitoKikaku.png" width="600">

[Hidemaru Editor](http://hide.maruo.co.jp/software/hidemaru.html) is the leading shareware in Japan market. It is a text editor and provides variousprogramming features, such as macro, debugger and external commands.  

**Short History:**
- 1992: First version of Hidemaru Editor (16 bit) released for Windows 3.1.  
<img alt="Hidemaru Icon" src="{{ site.baseurl }}/images/SaitoKikakuHidemaru/HidemaruIcon.png" width="50" >
- 1995: Hidemaru Editor v1.05 (32 bit) released for Windows 95. Hidemaru Editor v2.0 - released.
- 1999: Hidemaru Editor v3.0 released. 
- 2003: Hidemaru Editor v4.0 released. 
- 2005: Hidemaru Editor v5.0 released.
- 2006: Hidemaru Editor v6.0 released.
- 2007: Hidemaru Editor v7.0 released.
- 2010: Hidemaru Editor v8.0 released. Added 64 bit support. 
- 2017: Latest version is v8.7.1. 

Hidemaru Editor is a pioneer in a Japan shareware market, Many people love and keep using it. It also keep having an influence on many developer communities.  

Microsoft worked with a team of Hidemaru Editor developers to convert their app to Windows UWP, using Desktop Bridge. Microsoft team did all tasks by remote support.

**The core team:**

- Takashi Yamamoto – Senior Developer, Saito Kikaku
- Hideo Saito – CEO, Saito Kikaku
- Shozo Arai – Technical Evangelist, Microsoft Japan
- Kazuki Tsuguma - App Consultant, Microsoft Japan

*Saito Kikaku member*

<img alt="Saito Kikaku team" src="{{ site.baseurl }}/images/SaitoKikakuHidemaru/yamamoto2.jpg" width="640">

*Microsoft teams*

<img alt="Microsoft teams" src="{{ site.baseurl }}/images/SaitoKikakuHidemaru/MicrosoftTeam.JPG" width="640">


## Customer profile ##

[Saito Kikaku Ltd](http://hide.maruo.co.jp/company.html) is a Japan-based company founded in 1993 by Hideo Saito, a famous developer of shareware in Japan. The flagship product of the company is "Hidemaru Editor". It is a widely used text editor software in Japan. The software runs on Windows, has many sophisticated macro functions, commands that supports C and Java programming. This software is also famous for its great usability.

<img alt="Developemnt Environment" src="{{ site.baseurl }}/images/SaitoKikakuHidemaru/SaitoKikaku3.jpg" width="645">
<img alt="Sabae 1, Fukui" src="{{ site.baseurl }}/images/SaitoKikakuHidemaru/SaitoKikaku1.jpg" width="320">
<img alt="Sabae 2, Fukui" src="{{ site.baseurl }}/images/SaitoKikakuHidemaru/SaitoKikaku2.jpg" width="320">

## Problem statement ##

Hidemaru Editor has various distribution channels. It has two unique characteristics. First, as shareware, it permits durable use. And also has a paid (licensed) version.  There has been a licensing problem because of casual hacking.   Of course, Hidemaru Editor has so many users, so licensing change is difficult. Saito Kikaku is looking for new distribution channel. And, Saito Kikaku decided to distribute its editor on Windows Store.  

There are multiple technical challenges discovered during the initial discussions:

- Licensing: coexistent dual license (Windows desktop and Windows Store). 
- Settings information export and import feature.
- Macro feature.

## Solution, steps, and delivery ##

To resolve these issues, we took the following steps:

1. Discussed issues related to converting Hidemaru Editor to Appx package.
2. Discussed issues related to running UWP App of Hidemaru Editor.
3. Published a UWP app to the Windows Store.

### 1. Discussed issues related to converting Hidemaru Editor to Appx package. ###

**Some questions and answers:**  

- **Can use coexistent dual license?**  

  No, you can use the store licensing only. Please you consider changing app licensing. As result, Saito Kikaku decided to only support store licensing.

- **How do you create the Appx package?**  

  To create the Appx package, it has two methodologies. One is using Desktop App Converter. Based on our investigation, they can create Appx package using "hmsetup" (Hidemaru Editor’s custom setup program). See information at [Package an app using the Desktop App Converter](https://docs.microsoft.com/en-us/windows/uwp/porting/desktop-to-uwp-run-desktop-app-converter).  
  ```batch
  DesktopAppConverter.exe -Installer ".Input\Hmsetup.exe" -InstallerArguments "/h" -InstallerValidExitCodes 1 -Destination "." -AppExecutable "C:\Program Files\Hidemaru\Hidemaru.exe" -PackageName "Hidemaru" -Publisher "CN=SAITO-KIKAKU" -Version 0.0.1.0" -MakeAppx -Verbose
  ```  
  Another is a manual methodology. See information at [Package an app manually](https://docs.microsoft.com/en-us/windows/uwp/porting/desktop-to-uwp-manual-conversion).

- **How do you use in-app purchase and trial?**  

  See information on [in-app purchase and trial](https://docs.microsoft.com/en-us/windows/uwp/monetize/in-app-purchases-and-trials). We provided [IAP-APIs sample code](https://github.com/shozoarai/DesktopBridgeSample/tree/master/Samples/StoreTestHelper).

- **How do you use registry?**  

  Your app modifies HKEY_CURRENT_USER Hive, but cannot modify HKEY_LOCAL_MACHINE Hive. This behavior is described on [this document](https://docs.microsoft.com/en-us/windows/uwp/porting/desktop-to-uwp-prepare). Saito Kikaku decided to create new export and import features, because original features used registry settings. 

- **How do you use Windows Runtime API with minimum impact to existing code?**  

  There are two methodologies. One is using another process, which is written in C# and co-works with the main program. This “C# program” encapsulates Windows Runtime API code. Another is using the win32 dynamic link library to encapsulate Windows Runtime API code, Here is the [DLL sample](https://github.com/shozoarai/DesktopBridgeSample/tree/master/Samples/WpfAppUsingWinRT).


### 2. Discussed issues related to running UWP App of Hidemaru Editor. ###

**Some issues and solutions:**

- **Issue: What is a countermeasure against casual hacking?**

  Hidemaru Editor is deployed using Xcopy and then launch a clone executable. There is a specific behavior for process type UWP App or Desktop App. How do you determine process type? We provided [sample code](https://github.com/shozoarai/DesktopBridgeSample/tree/master/Samples/UwpProcessHelper).  
  Saito Kikaku implemented it and a new feature for coexistent Desktop App.  
  <img alt="new feature" src="{{ site.baseurl }}/images/SaitoKikakuHidemaru/NewFeatures.png" width="645">

- **Issue: How to show same icon of desktop app on the taskbar?**

  <img alt="don't show same icon on the taskbar" src="{{ site.baseurl }}/images/SaitoKikakuHidemaru/DesktopIcon.png" width="200">

  Our investigation found this is related to the plated icon assets, because the taskbar use the un-plated icon assets. Hence, added un-plated icon assets worked well. See information at Guidelines for [tile and icon assets](https://docs.microsoft.com/en-us/windows/uwp/controls-and-patterns/tiles-and-notifications-app-assets). We provided information on [how to use file extension settings](https://github.com/shozoarai/DesktopBridgeSample/blob/master/Doc/HowToUseFileExtension.md) include un-plated icon assets. Also, we provided information on [how to create PRI resources](https://github.com/shozoarai/DesktopBridgeSample/blob/master/Doc/HowToCreatePriResources.md).
 
- **Issue: Google IME was aborted.**  

  This is an issues with Google IME. See information at [Google IME Help forum](https://productforums.google.com/forum/#!topic/ime-ja/7o8SEmVmcHQ;context-place=forum/ime-ja).
 
### 3. Publish a UWP app to the Windows Store ###

Special thanks to Kazuki Tsuguma (Microsoft App Consultant), who helped to publish the Windows App. He was our teacher of publishing process. So, the package is now available on Windows Store. In publishing process, we received few questions about certificate criteria, then we gave an advice.  

<img alt="WindowsStore" src="{{ site.baseurl }}/images/SaitoKikakuHidemaru/WindowsStore.png" width="400">


<img alt="App1" src="{{ site.baseurl }}/images/SaitoKikakuHidemaru/HidemaruApp1.png" width="400"><img alt="App2(New Feature)" src="{{ site.baseurl }}/images/SaitoKikakuHidemaru/HidemaruApp2.png" width="250"> 


<img alt="App3(InAppPurchase)" src="{{ site.baseurl }}/images/SaitoKikakuHidemaru/HidemaruApp4.png" width="300"><img alt="App4(Taskbar)" src="{{ site.baseurl }}/images/SaitoKikakuHidemaru/HidemaruApp3.png" width="300"> 


## Opportunities going forward ##

Saito Kikaku now has the app ready for Windows Store, they have a new distribution channel now.  
Saito kikaku participated in Windows 10 Compatibility Program, and got "Windows 10 Compatible Logo".
<img alt="Windows10 Compatible Logo" src="{{ site.baseurl }}/images/SaitoKikakuHidemaru/Windows10CompatibleLogo.png" width="500">  

And used Windows Store badge.  
<img alt="Store Badge" src="{{ site.baseurl }}/images/SaitoKikakuHidemaru/WindowsStoreBadge.png" width="500">  

 
## Conclusion ##

Saito Kikaku successfully converted Hidemaru Editor app. They are expecting to have broader customer reach with Windows Store, and enhanced usability with additional functions. Here is a quote from our customer. 
>I'm thankful for your polite support. I was reached to publish the app in Windows Store via your support. I could publish an app by your support. Hidemaru Editor has a few issues, such as app update mechanism and purchase mechanism. But these issues were resolved by Windows Store. I received deep support from Microsoft, such as “how to edit appxmanifest”, "testing our apps" and "how to use IAP API". Microsoft team helped convert and put the app to Windows Store. Many thanks for Microsoft team.  
Takashi Yamamoto – Saito Kikaku, Senior Developer  


## Additional resources ##

- [Hidemaru Editor in Windows Store](https://www.microsoft.com/store/apps/9njg526bqn7t)
- [Hidemaru Editor Store Version](http://hide.maruo.co.jp/software/hidemaru_appx.html)
- [Desktop Bridge Sample](https://github.com/shozoarai/DesktopBridgeSample)

