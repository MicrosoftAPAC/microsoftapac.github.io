---
layout: post
title: "Kingston Technology streamlines mobile DevOps with Visual Studio Team Services"
author: "Eric ShangKuan"
author-link: "https://github.com/ericsk"
#author-image: "{{ site.baseurl }}/images/authors/photo.jpg"
date: 2017-04-21
categories: [Mobile DevOps]
color: "blue"
image: "images/Kingston/feat_vsm_team.jpg"
excerpt: "Kingston Technology wants to ensure the quality of their Xamarin apps and efficiently deliver the apps to their employees. Visual Studio Team Services enhances their process and easily integrates with MacinCloud, Xamarin Test Cloud, and HockeyApp."
verticals: [Discrete Manufacturing]
language: [English]
geolocation: [Taiwan]
#permalink: /<page-title>.html
---

Best practices for building high-quality mobile apps include native or high-performance user experiences, fewer crashes, and fast responses to user feedback. Kingston Technology engineers have used Xamarin to develop their enterprise line-of-business (LOB) applications. They're also looking for good UI testing solutions and better ways to distribute LOB apps to the employees in the company. Furthermore, they're interested in the mobile DevOps practices that Microsoft recently announced at many developer events to shorten their development cycle and automate the whole process.

To help Kingston Technology enhance the quality of apps and productivity of mobile development, Kingston Technology Taiwan and Microsoft Taiwan worked together in a hackfest hosted by Microsoft to build the solutions in the real development environment.

The core members of this hackfest were

- Edward Kuo – Assistant Manager, Kingston Technology Far East
- Jerry Chen – Sr. Engineer, Kingston Technology Far East
- Bruce Chen – Sr. Engineer, Kingston Technology Far East
- Gina Chiu – Engineer, Kingston Technology Far East
- Metilda Kuo – Engineer, Kingston Technology Far East
- Jennifer Chiu – Audience Evangelism Manager, Microsoft Taiwan
- Eric ShangKuan – Sr. Technical Evangelist, Microsoft Taiwan
 
## Customer profile ##

[Kingston Technology Corporation](https://www.kingston.com/) has grown to be the world's largest independent manufacturer of memory products. With global headquarters in Fountain Valley, California, Kingston employs more than 3,000 people worldwide. Regarded as one of the "Best Companies to Work for in America" by *Fortune* magazine, the Kingston tenets of respect, loyalty, flexibility, and integrity create an exemplary corporate culture. Kingston believes that investing in employees is essential and that each individual employee is a vital part of the company's success. Kingston serves an international network of distributors, resellers, retailers, and OEM customers on six continents. The company also provides contract manufacturing and supply-chain management services for semiconductor manufacturers and system OEMs.

## Problem statement ##

The mobile-development team in Kingston has used Xamarin to build their in-house mobile LOB apps that target both Android and iOS devices. In this hackfest, they decide to use an internal app named Quotation Approval to build up the mobile DevOps process. Here are the requirements of the app:

* Because the app is used by every manager, produce a solution for distributing this app internally, not publishing to App Store nor Google Play.
* Collect users crash reports for diagnosing problems and improving app quality.
* Automatically test the app by specified test cases and scripts to eliminate crashes and improve app quality.
* Help the development team shorten the development and release cycle.

Before our joint work, the team had been implementing the scrum process in Kingston for five years. They integrated the developer and operator into a scrum team and kept looking for a faster cooperation model. They also believe the DevOps practices may save software development and release time.

Before the hackfest, we held a workshop to identify the resource wasters in their current workflow. In this workshop, Eric introduced [value stream mapping](https://en.wikipedia.org/wiki/Value_stream_mapping) (VSM) to the team. 

During the VSM workshop, we identified the following areas of improvement for their current software delivery process:

1. The continuous integration/continuous deployment (CI/CD) process requires *at least 4 hours lead time* because the development team has only a few Mac computers on which to build the iOS packages. Much time is spent waiting in the build queue.
2. Each developer takes *about 3 hours lead time each* for UI testing in a single build. That's why they're eager to look for good automatic UI testing solutions.
3. Developers also mentioned that, during the development process, they need to confirm with the project owner and the users in the company, which might slow the development work *by a factor of 2*.

After the VSM workshop, the team realized that they waste time in three areas: answering user feedback, testing the app, and releasing the app in the production environment. That's exactly why they would like to improve their productivity by adopting the CI/CD flows.

The engineer Bruce Chen said,

> "VSM is a great tool that helps us visualize the wasters in each flow. It not only helps us to discuss how to optimize the workflow but also makes project managers realize why the development tasks take time."

*The core team (and some other engineers) at the completion of the VSM workshop*

<img alt="Photo of team members holding diagrams" src="{{ site.baseurl }}/images/Kingston/vsm_team.jpg" width="800">
 
## Solution, steps, and delivery ##

Overall, three key problems needed to be resolved:

1. An easy way to distribute the LOB apps to users in the company and proactively notify users when newer versions are available
2. An automatic UI testing solution
3. Shortening the time of the CI/CD process and decreasing the nubmer of manual operations for distribution

After the discussion, we decided to use [HockeyApp](https://www.hockeyapp.net/) as the *enterprise store* for app distributions; and to use [Xamarin Test Cloud](https://www.xamarin.com/test-cloud) as the UI testing solution. [Visual Studio Team Services](https://azure.microsoft.com/services/visual-studio-team-services/) will be the orchestrator of the CI/CD process.

*The solution architecture*

<img alt="Architecture diagram" src="{{ site.baseurl }}/images/Kingston/arch.png" width="875">

### App distribution ###

Because Kingston Technology had adopted Office 365, Eric advised that HockeyApp is perfect for them to use as an (enterprise) internal app distribution infrastructure. Users can also receive app update notifications if they download and install the apps from HockeyApp. Furthermore, they can also specify a dev team, a beta-testers team, and an end-users team in HockeyApp for different levels of app distribution. For example, members in the dev team might receive the nightly build of the app, beta testers might receive updates of beta releases, and the end-users team might receive only the stable releases.

Here are the steps of leveraging HockeyApp:

1. Using the work (Office 365) account, [sign in](https://rink.hockeyapp.net/users/sign_in) to HockeyApp. Create an app and get the App ID from the management page. Here is a sample:

   <img alt="Getting App ID in HockeyApp" src="{{ site.baseurl }}/images/Kingston/hockeyapp_appid.png" width="440">

2. Back in the Xamarin project, install [HockeyApp SDK for Xamarin](https://www.nuget.org/packages/HockeySDK.Xamarin/) from 	NuGet.

3. For Xamarin.iOS project, add the following code before the end of the **FinishedLaunching** method in the AppDelegate.cs file and replace `HOCKEYAPP_APPID` with the real App ID in HockeyApp.

	  ```csharp
	  using HockeyApp.iOS;
	  ...
	
	  ...
	  public override bool FinishedLaunching(UIApplication application, NSDictionary launchOptions)
	  {
	      ...
	
	      AddHockeyApp();
	
	      return base.FinishedLaunching(application, launchOptions);
	  }
	
	  private static void AddHockeyApp()
	  {
	      /* Add HockeyApp manager */
	      var manager = BIHockeyManager.SharedHockeyManager;
	      manager.Configure(HOCKEYAPP_APPID);
	      manager.StartManager();
	
	      /* Check update from HockeyApp */
	      manager.Authenticator.AuthenticateInstallation();
	  }
	  ```

4. Rebuild the package and upload it to HockeyApp. The app distribution work is done.

### Automatic UI testing ###

For Xamarin projects, the [Xamarin.UITest](https://developer.xamarin.com/guides/testcloud/uitest/) framework is a great tool for UI testing. However, it's also time-consuming to generate test code and easy to get things wrong. Eric recorded the following two videos to help the team understand how to translate the operations to the test code and how Xamarin Test Cloud works.

*Using Xamarin Test Recorder*

<iframe width="560" height="315" src="https://www.youtube.com/embed/o3bjJeY3nV8" frameborder="0" allowfullscreen></iframe>

*Using Xamarin Test Cloud*

<iframe width="560" height="315" src="https://www.youtube.com/embed/lUhKkHiNNu0" frameborder="0" allowfullscreen></iframe>

Here is my Xamarin iOS UI test code for testing whether the sum of two values from two **Entry** elements is correct. It helps the development team correctly launch the app for testing:

```csharp
// Tests.cs
using System;
using System.IO;
using System.Linq;
using NUnit.Framework;
using Xamarin.UITest;
using Xamarin.UITest.Queries;

namespace Kingston.LOB.UITests
{
    [TestFixture(Platform.iOS)]
    public class Tests
    {
        IApp app;
        Platform platform;

        public Tests(Platform platform)
        {
            this.platform = platform;
        }

        [SetUp]
        public void BeforeEachTest()
        {
            app = ConfigureApp.iOS.AppBundle("../../../iOS/bin/iPhoneSimulator/Debug/QuotationApproval.app").StartApp();
            }

        [Test]
        public void XYTest()
        {
            app.Tap(x => x.Marked("0"));
            app.ClearText(x => x.Class("EntryEditText").Text("0"));
            app.EnterText(x => x.Class("EntryEditText"), "37");
            app.Tap(x => x.Marked("0"));
            app.ClearText(x => x.Class("EntryEditText").Text("0"));
            app.EnterText(x => x.Class("EntryEditText"), "48");
            app.WaitForElement(x => x.Text("85"));
        }
    }
}
```

After viewing these two videos, the team quickly created UI test code and confirmed that the test code can be executed correctly on Xamarin Test Cloud. For the Xamarin iOS project, some additional work has to be done before uploading to Xamarin Test Cloud:

1. Update the Xamarin.UITest NuGet package in the UI testing project if you plan to test the app on new versions of iOS.
2. Add the [Xamarin Test Cloud Agent](https://www.nuget.org/packages/Xamarin.TestCloud.Agent/) package from NuGet to the Xamarin.iOS project.
3. Add the following code segment before the end of the **FinishedLaunching** method:

	```csharp
	#if ENABLE_TEST_CLOUD
    	Xamarin.Calabash.Start();
	#endif
	```

4. Define the **ENABLE_TEST_CLOUD** constant in the Xamarin.iOS Release configuration. Update the project's .csproj file like this—

	```xml
	...
	<PropertyGroup Condition=" '$(Configuration)|$(Platform)' == 'Release|iPhone' ">
	...
	    <DefineConstants>__UNIFIED__;__MOBILE__;__IOS__;ENABLE_TEST_CLOUD</DefineConstants>
	...
	</PropertyGroup>
	...
	```

   —or edit in the Visual Studio GUI tool:

   <img alt="Defining the constant for release configuration" src="{{ site.baseurl }}/images/Kingston/define_constant.png" width="890">

Without these steps, Xamarin Test Cloud might fail to launch the tests.

### Put it together in the CI/CD process ###

Visual Studio Team Services can integrate a physical Mac or a third-party service like [MacinCloud](http://www.macincloud.com/) as an agent for building iOS packages. Before setting up the build definitions for the Xamarin iOS project, the Mac agent has to be configured in the Team Services agent pool page.

<img alt="Team Services agent-pool page" src="{{ site.baseurl }}/images/Kingston/vsts_agents.png" width="804">

We set up the agent by referring to the [Getting Started](https://support.macincloud.com/support/solutions/articles/8000016614-getting-started-with-the-macincloud-vsts-build-agent-plan) guide on the MacinCloud support portal. After setup, we can create Build and Release definitions that inform Team Service how to work with the projects.

#### Build (CI)

First we defined the build tasks like this:

<img alt="Defining build tasks" src="{{ site.baseurl }}/images/Kingston/build_def.png" width="438">

- **NuGet restore** This task restores packages used by the app from NuGet.
- **Version Assemblies** These two tasks modify the version number and the version string of the newly built app.
- **Xamarin component restore** This task restores the components downloaded from the Xamarin Component Store. You have to set up the Xamarin credentials here to restore the components.

  <img alt="Xamarin Component Restore dialog box" src="{{ site.baseurl }}/images/Kingston/build_restorecomponent.png" width="400">

- **Xamarin build** In this task, be sure it will create the app package and restore the NuGet packages. Because the team will use the MacinCloud agent to build the Xamarin iOS packages and put the certificate and provision file in the agent, leave the certificate and the provision file fields here blank.

  You can also set the **Configuration** field to a variable if you would like to change the value for different purposes.

  <img alt="Configuring the Xamarin build task" src="{{ site.baseurl }}/images/Kingston/build_build.png" width="400">

- **Copy Publish Artifact** The final task in the build process is copying the app package (\*.ipa) and the test assemblies to the staging folder for release.

  <img alt="Configuring task to copy files to staging folder" src="{{ site.baseurl }}/images/Kingston/build_copy.png" width="400">

#### Release (CD)

The release definition on Team Services can also be triggered by the completion of a build process. The development team specified that the package must pass all UI tests before being deployed to HockeyApp. So the release process can be defined as follows:

<img alt="Release definition" src="{{ site.baseurl }}/images/Kingston/release_def.png" width="600">

- **Test in Xamarin Test Cloud** Because the release task is triggered by the previous build process, the task can get the package and the test assemblies from the staging folder and then upload them to Xamarin Test Cloud for testing.

  In this task, be careful when specifying the paths for the package, the test assemblies, and the test-cloud.exe file. It's not easy to debug the relative-path problem.

  <img alt="Test configuration" src="{{ site.baseurl }}/images/Kingston/release_test.png" width="536">

- **Deploy to HockeyApp** In this task, Team Services will upload the successfully tested package to HockeyApp. Just set up the HockeyApp connection and point to the correct App ID.

  <img alt="Release to HockeyApp" src="{{ site.baseurl }}/images/Kingston/release_hockeyapp.png" width="536">

## Conclusion ##

After the hackfest, engineers from Kingston Technology have adopted the CI/CD process on Team Service for the internal Quotation Approval app. Edward, the tech lead from in tston Far East in this hackfest, said,

> "DevOps scope is big. For enterprise, it is needed can be to gradually complete. After this hackfest we've completed the automation of the mobile-app CI/CD processes, which saved us approximately 75 percent in time compared to the previous process. We've already moved one big step toward our DevOps goal. So we will continue to do continuous build, continuous delivery, continuous integration, automated release, and incremental testing."

It will help the development team efficiently deliver the app to the sales managers for reviewing approvals and ensure the quality by testing. In the future, every app in Kingston Technology will be delivered in the same way. The users in the company not only download apps from a single stop (HockeyApp) that can be authenticated by the same account but also easily send crash reports and feedback to the development team. Benefits to each other!
	
*The core team at the end of the hackfest*

<img alt="Photo of core team in front of projected computer screen" src="{{ site.baseurl }}/images/Kingston/success.jpg" width="800">