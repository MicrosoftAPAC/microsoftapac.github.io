---
layout: post
title:  "Mobile DevOps＋Xamarin improved 4,000% productivity for No.1 EMM Service in Japan by i3Systems."
author: "Tatsuhiko Tanaka"
author-link: "https://blogs.msdn.microsoft.com/ttanaka/"
#author-image: "{{ site.baseurl }}/images/authors/photo.jpg"
date:   2017-05-25
categories: [Mobile DevOps]
color: "blue"
image: "images/i3systems_mdo/ArchitectureDesign.jpg" #should be ~350px tall
excerpt: It took 9 months to develop and launch the original CLOMO MDM Agent app but this Xamarin-based app and Mobile DevOps took only in less than 2 months with 10 times more than the number of functions from the first launch. Release cycle is faster by over 400% and the volume of the source code and engineering productivity are improved by 4,000%.
language: [English]
verticals: [Other]
geolocation: [Japan]
---

**Solution overview**

CLOMO, Cloud As A Module, is developed using Ruby on Rails on Azure, managing over 1million licenses and is one of the largest EMM cloud services, achieving as the No.1 MDM market share in Japan for sixth consecutive years. 
It took 9 months for developing and launching the original CLOMO MDM Agent app but this Xamarin-based app and Mobile DevOps took only in less than 2 months with 10 times more than the number of functions from the first launch. This means that the release cycle is faster by over 400% and the volume of the source code and engineering productivity are improved by 4,000%

**Key technologies used**

- [Xamarin](https://www.xamarin.com/)
- [Visual Studio Team Services](https://www.visualstudio.com/team-services/)
- [HockeyApp](https://www.hockeyapp.net/)

**Core Team:**

<code>i&sup3; Systems, Inc.: </code>

- Hitoshi Ichikawa - CTO
- Takaaki Nagano - Project Leader
- Takeshi Fujimoto - Engineer
- Daisuke Tsutsumi - Engineer
- Satoru Shingu - Engineer
- Julliet Baylon - Engineer
- Yasuhiro Yamada - Designer
- Ryosuke Matsumura - Engineer (Microsoft Azure MVP)

<code>Microsoft Japan: </code>

- Tatsuhiko Tanaka - Technical Evangelist
- Chiyoda Madoka - Technical Evangelist

 
## Customer profile ##

CLOMO, a mobile device management platform for corporations, has achieved the top share in the EMM (MDM, MAM, and MCM) market in Japan for six consecutive years.
CLOMO was originally built on AWS until 2015, but to provide customers with more secure and productive environment, we have successfully migrated CLOMO from AWS to Azure at the end of year 2015, which we believed to be the best Iaas/PaaS service to meet business requirements.

[i3Systems Website](http://www.i3-systems.com/index_en.html)

 
## Problem statement ##

Their development process was quite costly because of developing native iOS, Android, and Windows apps. Many of build processes and testing were not automated, which required a lot of human resources. We had each development team for iOS, Android, and Windows, having difficulties in sharing source code and related developmental knowledge.
Under these circumstances, they tried to reduce development processes of apps, which had been developed individually according to each platform, by sharing C# source code based on Xamarin, while reviewing and streamlining the whole development process by applying the concept of DevOps.

 
## Solution, steps, and delivery ##

Upon the innovation of the conventional development process, we tried to introduce a more efficient development process while conducting Value Streaming Mapping.

**Value Streaming Mapping**

Value Streaming Mapping sorted out the current development process.
<img alt="VSM left" src="{{ site.baseurl }}/images/i3systems_mdo/vsm1.jpg" width="400">
<img alt="VSM right" src="{{ site.baseurl }}/images/i3systems_mdo/vsm2.jpg" width="400">

This attempt clarified the following problems:

-	The same processes are separately conducted in each development process of iOS and Android.
-	The build process is conducted manually.
-	A lot of test processes have yet to be automated.
-	Only little information is obtained when an app is modified because failure logs are not collected.

To solve these problems, they adopted the following:

- Continuous Integration : They have migrated all of their manually builds to VSTS and introduced Continuous Integration. They have successfully automated a wide range of build processes. As a result, they realized a significant devrease in build time.
- Automated Testing : Automated UI testing was adopted for testing.
- User Telemetry : Introduced HockeyApp to collect crash logs and user metrics.

**Architecture Design**

Reviewing the development process, we re-developed applications based on the composition shown below.
<img alt="Architecture Design" src="{{ site.baseurl }}/images/i3systems_mdo/ArchitectureDesign.jpg" width="400">

The following points are the key factors in this new system composition.

-	Sharing source code by using Xamarin
-	Automating the build process by using VSTS
-	Automating the test process by using VSTS
-	Collecting failure logs and access logs by using HockeyApp

To achieve these points, the following measures were implemented.

-	A technical discussion regarding Xamarin
-	A technical discussion regarding VSTS
-	Hackfest
-	A technical discussion regarding Xamarin.UITest


**Hackfest**

With Xamarin Evangelists, this discussion considered the points of notice regarding development based on Xamarin before introducing Xamarin.
<img alt="Discussion about Xamarin" src="{{ site.baseurl }}/images/i3systems_mdo/XamarinDiscussion.jpg" width="400">

“Hackfest” was held at the seminar room in the Kyushu Branch of Microsoft Japan.
In this workshop, engineers tried to set up a CI environment by using VSTS and implement Xamarin.

<img alt="Hackfest at Microsoft office" src="{{ site.baseurl }}/images/i3systems_mdo/hackfest1.jpg" width="400">
<img alt="Hackfest at Microsoft office" src="{{ site.baseurl }}/images/i3systems_mdo/hackfest2.jpg" width="400">

**Provisioning for iOS apps based on VSTS**

Executing multiple enterprise build processes concurrently by using VSTS and Mac agents reduced a considerable amount of waiting time. A build process based on VSTS and Mac agents requires less time when compared to a build process based on Xamarin on hand.

<img alt="VSTS" src="{{ site.baseurl }}/images/i3systems_mdo/vsts1.jpg" width="400">

**CI**

They were doing many kinds of build manually for Android and iOS. They have managed to automate all the builds by introducing VSTS and have been able to cut down a lot of the time they had ever spent on builds.

They use our in-house Nuget servers running on Azure. The in-house framework taken out from Nuget is used for an automated build process.
The test process is actually omitted because of executing multiple enterprise build processes.

<img alt="CI" src="{{ site.baseurl }}/images/i3systems_mdo/ci.jpg" width="400">

**Xamarin.UITest**

For UI testing, they were able to automate it by using Xamarin.UITest. Xamarin.UITest is a testing framework that enables Automated UI Acceptance Tests written in NUnit to be run against iOS and Android applications.

One of the Xamarin.UITest cases is the multilingual automated test in order to support multilingualization within iOS.

<img alt="UI Test" src="{{ site.baseurl }}/images/i3systems_mdo/uitest.jpg" width="400">

**HockeyApp**

By integrating HockeyApp into the app, they can get crash reports when the app crashes.
The following lists shows logs collected by HockeyApp which is embedded in an app.
The information based on these failure logs helped in clarify the problems to be solved and points to be modified.

<img alt="HockeyApp" src="{{ site.baseurl }}/images/i3systems_mdo/hockeyapp.jpg" width="400">

 
## Conclusion ##

Through the transition process, they introduced Visual Studio, VSTS, HockeyApp, Xamarin and Azure for their Mobile DevOps.
As a result of the VSM, they introduced the CI/CD and automated UI tests.
They have achieved a significant improvement in their development efficiency and quality by using a proven track record IDE in their development and automations, by bringing automation process of VSTS, and by improving the quality with efficient crash report and user metric analysis of HockeyApp/Azure Application insights.
They plan to use Visual Studio Mobile Center as it goes GA because they are taking advantage of their HockeyApp konwledge and verifying Xamarin Test Cloud.


## Additional resources ##

[CLOMO product site: http://www.i3-systems.com/index_en.html](http://www.i3-systems.com/index_en.html)

[Migration cases from AWS to Azure: https://customers.microsoft.com/Pages/CustomerStory.aspx?recid=28933](https://customers.microsoft.com/Pages/CustomerStory.aspx?recid=28933)
