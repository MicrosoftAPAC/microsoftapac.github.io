---
layout: post
title:  "Learning from a Microservices/Mobile Hackfest with Setouchi Holdings"
author: "Tsuyoshi Ushio"
author-link: "#"
#author-image: "{{ site.baseurl }}/images/authors/photo.jpg"
date:   2016-12-05
categories: [DevOps]
color: "blue"
image: "images/2016-11-31-SetouchiHD/allmembers.jpg" #should be ~350px tall
excerpt: Microservices/Mobile Hackfest using Web/Api Apps and VSTS 
language: English
verticals: [Logistics, Discrete Manufacturing]
geolocation: [Japan]
---

Setouchi Holdings is a company which provides several services related to small airplane manufacturing. They are developing a new reservation system
for small airplane for sight seeing for Setouchi area. They work with [Ci&T](http://www.ciandt.com/highlights) and [Creatinoline](http://www.creationline.com/en/) using Azure.Ci&T is a software development company. They are excellent in Agile development. Creationline is a partner of Microsoft who is very strong at DevOps related technologies. Traditionally, big user company outsources their software development for big SI companies and still using waterfall in Japan. However, SetouchHD chooses Ci&T and  Creationline as their partner because of thier technical excellence to accelerate their business. They are using the latest lean/kanban approach combined with Azure technologies. However, they are new to Azure; they enjoyed the Mobile/Microservices DevOps hackfest with Microsoft. 

- Solution overview: 

The SKY TREK is a membership service for travel including amphibious aircrafts. They provide the one-stop reservation system for a custom tour using Airline, helicopter, amphbious aircrafts, car rental, and hotel. They doesn't need a lot of concurrent access. However, they need to adopt the change very quickly, and expantion for the business model with high-quality service. 
 They already have a good lead time for web deployment. However, they also want to have blue-green deployment for exploratory testing before the production and automated mobile CI/CD pipeline.

  ![Architecture]({{site.baseurl}}/images/2016-11-31-SetouchiHD/architecture.jpg)

- Key technologies used:

  * Azure Web/API apps with C# (Infrastructure as Code) 
  * Visual Studio Team Services (CI/CD/Release Management)
  * Swift(iOS), Testflight, and Fastlane (Mobile DevOps)
  * Goal integration with VSTS (Telemetry)

  ![Hackfest Members]({{site.baseurl}}/images/2016-11-31-SetouchiHD/allmembers.jpg)  

- Core Team: 

  * Geovanne Borges Bertonha @geobertonha - Software Architect/DevOps
  * Andre Ogura Dantas  - Software Architect/ iOS Specialist
  * Leandro de Lima Machado - Software Engineer
  * Andre Santos Kano - @drekano - Software Engineer
  * Tadahiro Yasuda @yasudatadahiro - Creationline
  * Daisuke Ono - Creationline
  * Tsuyoshi Ushio @sandayuu - Technical Evangelist - DevOps
  * Naoki (NEO) Sato @satonaoki - Senior Technical Evangelist - Azure General

## Customer profile ##

- [Setouchi Holdings](http://setouchi-hd.com/)
- Manufacturing for small airplane and transportation services
- Hiroshima, Japan. (Hackfest had in Tokyo, Japan)
- The reservation system for small airplane rental.

They have two partners for this project. 
Development: [CI&T](http://www.ciandt.com/home) 
Infrastructure: [Creationline](http://www.creationline.com/en/)

 
## Problem statement ##

They have enough knowledge of Agile and enough technical skills. However, they were new to Azure and VSTS. Also, they had a lot of manual process. This is partly because they had a lean approach. They had an enough knowledge to automate it for OSS tools. However, they intentionally didn't do it. 
Because this is a new project. Unless need it, they didn't automate it. I think this is the right approach. However, They were still new to Azure and VSTS. Mobile pipeline automation with VSTS and Blue-green deployment on Azure are the biggest issue for them. 
 Also, they want to integrate Goal, which is CI&T internal dashboard system, with VSTS. They are usually used Jira. They like VSTS kanban system,
 so that they wanted to integrate VSTS with Goal. 

## Solution, steps, and delivery ##

We solved these problems by following steps. 

* [1. Value Stream Mapping](#1-value-stream-mapping)
* [2. Blue Green Deployment without Noizy Neighbour problem](#2-blue-green-deployment-without-noizy-neighbour-problem)
* [3. Automated Retain idefinitely flag](#3-automated-retain-indefinitely-flag)
* [4. iOS deployment pipeline automation](#4-ios-deployment-pipeline-automation)
* [5. Kanban customization with Test & Feedback](#5-kanban-customization-with-test--feedback)

### 1. Value Stream Mapping 

Value Stream mapping is valid for the project which already has a decent amount of process and deployment pipeline. However, they don't have it!
This is not because they don't know about development practices and automation, but they follow "Lean" mindset. They don't do anything unless it need it.
Their system will be much more complex. After the few sprints, their system will have Several Microservices using Web/API apps, Mobile, Payment Gateway and so on.
Instead of thinking/building whole architecture at first, for the first sprint they focused on The Web, then API, then Mobile ..., etc.
When I had the Value Stream Mapping session, this is just beginning. That is why they don't have the deployment pipeline. 

We couldn't see the whole picture at that time. However, we discussed the development process of the last time for tipical web-front end, and discuss with them. 
They were going to create Web-Fronts, Api, Mobile an so on. However, we focused on Web-Front VSM at this time.

![Value Stream Mapping Discussion]({{site.baseurl}}/images/2016-11-31-SetouchiHD/VSMdiscussion.jpg)  

![Value Stream Mapping Discussion (Web-Front)]({{site.baseurl}}/images/2016-11-31-SetouchiHD/ValueStreamMapping.png)  


The lead time of the web site is not bad. 2days. My Recommendation is Release Management. They had a lot of manual processes for deployment for every environment. They could implement automated testing by themselves. They were already good at the lead time. However, they didn't implement it as release pipelines according to the environments like Dev/Staging/Production.   
We will automate it quite easily. It will reach 10-deploys-per-day lead time soon. Then the Kaizen of lead time will be enough. So I also recommend feature flags for getting feedback from production.  

However, agile is about "Embrace change," right? When we tried the hackfest, their problem was slightly different. When we had the Value Stream Mapping, they hadn't started Mobile and new Microservices development.
At the time of the hackfest, they started this development. Release Management is the same. They still had some manual processes, but they automated some. They needed the automation of the Mobile CI/CD pipeline. 
Also, They needed to blue-green deployment for the new Microservices, which was for an API apps. Also, they were going to have load testing for the slot in the near future. It will cause the "Noisy neighbor" problem, which means if you had a load testing
for a slot, it would effect the production slot as well. 
 They didn't familiar with VSTS, so they wanted to know about how to organize Kanban and automated "Retain indefinitely" flag for a release.
 
#### hackfest target

* Release Management for automate the deployment for enironments 
* [Blue-Green Deployment]((http://martinfowler.com/bliki/BlueGreenDeployment.html)) for exploratory testing 
* CI / CD for Moblie pipeline for automate manual process

About these pracitces, please refer [DevOps practices -ITPROGUY.com](http://www.itproguy.com/devops-practices/)


Let's get hacking!

### 2. Blue Green Deployment without Noisy Neighbour problem

We started discussing the [blue green deployment](http://martinfowler.com/bliki/BlueGreenDeployment.html). They want it for Web/API apps. The [blue green deployment](http://martinfowler.com/bliki/BlueGreenDeployment.html) itself is very easy for us. Azure Web/API apps already have the deployment slot and swap functionality. It is a fantastic feature. You can read about [Switch deployment slot in Azure web apps](https://www.visualstudio.com/en-us/docs/release/examples/azure/deployment-slots-webapps) for understanding the functionality. However, the article is a little bit old. 
Now, the Visual Studio Team Services supports deployment and swap functionality by the tasks. We can easy to configure these pipeline. Now we have "Azure App Service Manager(PREVIEW)" task on VSTS. You can easy to swap slots just setup this task without writing PowerShell. See this picture. 

![Swap deployment slots]({{site.baseurl}}/images/2016-11-31-SetouchiHD/deploymentslot.jpg)  


 However, the problem is the noisy neighbor problem. Naoki (NEO) Sato toled them a solution for this problem. We solve this by adding an App Service Plan.
 Then change the App Service Plan of a slot. When you use Web/API apps, the resources are shared among the slots. However, if you change only one slot, it means these slots have different App Service Plan. Then Web/API apps, allocate different resources among the slots. 
Using this technique, you can avoid the noizy neighbor problem. 

  ![App Service Plan]({{site.baseurl}}/images/2016-11-31-SetouchiHD/AppServicePlan.jpg)

As a practice of Infrastructure as Code, we use the [ARM template](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-authoring-templates) after finishing configure resource via Azure Portal. Before deploy it, we can download
the template and deployment script. It is a totally easy way to achieve Infrastructure as Code on Azure.

  ![Infrastructure as Code]({{site.baseurl}}/images/2016-11-31-SetouchiHD/IaC.png)
  ![Downloaded scripts]({{site.baseurl}}/images/2016-11-31-SetouchiHD/IaC2.png)

If you are using PowerShell, you can deploy it like this.

```
PS> ./deploy -subscriptionId XXXX-XXXX-XXXX-XXXX... -resourceGroupName YourGroup -resourceGroupLocation JapanEast -deploymentName deploy01
```


### 3. Automated Retain indefinitely flag 

They have already automated almost everything for their web service pipeline except for only one thing. After successfully released, they need to click
`Retain indefinitely` flag to keep the successfully deployed artifact. Sometimes, they want to check the artifact after it is successfully deployed. For this reason, they need to keep their artifacts if these are successfully deployed.

  ![Enable Retain idefinitely]({{site.baseurl}}/images/2016-11-31-SetouchiHD/RetainIndifinitely.jpg)

  We have the VSTS REST-API for this purpose. Just update the status of a release. The best way to solve this problem is, using `System.AccessToken` variables to access the VSTS REST-API. We tried it. However, we couldn't find how to implement it on Release Management. Instead, we use Personal Access Token, for this purpose. Shortly, I believe, the VSTS supports the OAuth Access Token. 

NOTE: Now we can use System.AccessToken for Release Management. [VSTS - Allow Scripts to Access OAuth Token in Release Managment](http://stackoverflow.com/questions/41004090/vsts-allow-scripts-to-access-oauth-token-in-release-managment)

  Please add a batch file step in your release environment.

```
curl --request PATCH -H "Accept: application/json" -H "Content-type: application/json"  -d '{ "keepForever": true }' -u %USER_NAME%:%PERSONAL_ACCESS_TOKEN% %SYSTEM_TEAMFOUNDATIONSERVERURI%DefaultCollection/%SYSTEM_TEAMPROJECT%/_apis/release/releases/%RELEASE_RELEASEID%?api-version=3.1-preview.4
```

  Then, you need to set the variables of your personal access token on your Release definition.

  ![Personal Access Token]({{site.baseurl}}/images/2016-11-31-SetouchiHD/PersonalAccessToken.jpg)

Finally, you can use Run Script task and run the bat file. If you use Linux or Mac for build machine, you can use the same technique for shell script task.  

  ![Run Script]({{site.baseurl}}/images/2016-11-31-SetouchiHD/RunScript.jpg)


### 4. iOS deployment pipeline automation

They have a lot of problems with the iOS deployment pipeline. The first problem is, they need to build three times for their environment. You need to include every artifact into an IPA file. We need to change the connection string for the database. We don't have any way to avoid to build
three times. Generally speaking, you need to build one time; then you need to pass the artifacts into the Release. For this reason, they only had one build pipeline.

  ![Initial Build Pipeline]({{site.baseurl}}/images/2016-11-31-SetouchiHD/InitialBuildPipeline.png)

We improve this step by step. First of all, we build only for dev environment on the Build definition as CI. When you change the Git repository, the VSTS
fire the Build definition. We don't want to build everytime for QA/Staging/Production environment. Then we separate the deployment process into Release
Management. We also add the source code into the drop folder, which is shared directory which contains artifacts, then pass the release management and deploy.
However, the problem is the upload time. Especially ipa is very big. It took a long time to upload the artifact from the build machine to VSTS. 
 That is why we remove some unused files and zip the artifact before upload. It works well.

 Also, sometimes, we had a problem to restore pod files. When we used `pod update` command, sometimes it causes the timeout to restore the pod. Once we use `pod install` command instead,
 the time becomes within 14 seconds. 

  ![Improved Build Pipelline]({{site.baseurl}}/images/2016-11-31-SetouchiHD/ImprovedBuildPipeline.png)

Then we create some release definition to adopt this strategy. We need to re-build/test on the release pipeline. It is against the rule of continuous delivery. 
However, it is the better solution for the ipa build. Because we already finish pod restore one the build definition. And we share it via drop folder. 

   ![iOS Release Pipeline]({{site.baseurl}}/images/2016-11-31-SetouchiHD/ReleaseiOS.jpg)

The next problem is the automated deployment for Test flight and automated submit into the Apple Store. They are going to use the [Hockey Apps](https://hockeyapp.net/) for Android Deployment for testing. 
Currently, they use TestFlight. We need to try Test Flight deployment. We use the [fastlane](https://fastlane.tools/), which helps us to automate iOS/Android deployment and release. They had already used it.
We are using [VSTS build agent for Mac](https://www.visualstudio.com/en-us/docs/build/admin/agents/v2-osx). We can choose a Mac for the build machine using this agent. They use their own Mac. Shortly, they are moving on MacInCloud.
See (Getting Started with the MacinCloud VSTS Build Agnet Plan](https://support.macincloud.com/support/solutions/articles/8000016614-getting-started-with-the-macincloud-vsts-build-agent-plan).  
NOTE: Now we can also use [Visual Studio Mobile Center](https://www.visualstudio.com/vs/mobile-center/) for this purpose. You can build an iOS application on [Visual Studio Mobile Center](https://www.visualstudio.com/vs/mobile-center/). 

  Once we create the Fast file, we can automatically deploy into the Test Flight, and HockeyApps also submit into the Apple Store. It is very convenient.

```
fastlane_version "1.109.0"

generated_fastfile_id "{someid}"

default_platform :ios

before_all do
    ENV["SLACK_URL"] = "{Webhook URL from Slack}}" # Webhook URL created in Slack
    ENV["FL_COCOAPODS_PODFILE"] = "SKY TREK/"
    ENV["PILOT_USERNAME"] = "{Your e-mail address}"
  end

lane :beta do
  # build your iOS app
  cocoapods
  
  gym(
    workspace: 'Sky Trek/Sky Trek.xcworkspace',
    scheme: "Sky Trek Dev"
  )

  testflight(changelog: "Testing Fastlane build support")

  slack(
        message: "Successfully distributed a new beta build for testing.",
        success: true
      )

end
```

This code enable them to build iOS apps then push artifact into testflight then push message to slack. 

Also, we need to change the Fastfile depend on the environment. We create one more artifact directory and put three Fastfiles. After accepting these on the 
Release, we just copy it to Fastfile, according to the environment. Now we were ready to deploy automatically!

  ![Fastlane file structure]({{site.baseurl}}/images/2016-11-31-SetouchiHD/Fastlanefiles.jpg)


Then the slack told us it is successful. The Fast file doesn't include submit into the Apple Store. However, it is very easy. The [Apple Store task](https://marketplace.visualstudio.com/items?itemName=ms-vsclient.app-store)
 uses fastlane inside the task. So we decided to keep on using fastlane to submit the application. After release, we can see the slack notification from the trigger of TestFlight. We've done!

### 5. Kanban customization with Test & Feedback

We need to send some kanban telemetry to the Goal, which is CI&T dashboard system. The Goal is very impressive. It collects a lot of telemetry via Jira. And they can get Business Complexity depend on the story. Generally speaking, we have no way to measure the productivity across the company among agile projects. However, CI&T makes it enable using the business complexity. Goal calculates it and visualizes it. Also, it includes simple and useful telemetries. 

  ![Goal]({{site.baseurl}}/images/2016-11-31-SetouchiHD/Goal.png)
  
 Once they start to sell this dashboard, it is very impactful to the world. It only supports Jira. However, we want to use VSTS this time. We might send data from VSTS to JIRA. However, it must lead some complexity and dependency between two. I recommend them to create an adopter for VSTS. Then, they can support two environments without having a dependency for JIRA.  

Now, we start hacking this. First of all, we need to customize the Kanban board column. Then we need to develop the adopter using VSTS REST-API. We need to wait the specification of the Goal team. We start hacking the two technical elements. We already hacked the REST-API, so we focus on the customize the Kanban 
board. It was also very easy. You can not customize a product backlog of the Scrum template. However, you can copy the Scrum template and customize every work items like a product backlog. 

  ![Work Item Customization 01]({{site.baseurl}}/images/2016-11-31-SetouchiHD/WorkItemCustomize01.png)
  ![Work Item Customization 02]({{site.baseurl}}/images/2016-11-31-SetouchiHD/WorkItemCustomize02.png)
  ![Work Item Customization 03]({{site.baseurl}}/images/2016-11-31-SetouchiHD/WorkItemCustomize03.png)

NOTE: After this hackfest, VSTS add a new feature for customizing work items template without copying the Scrum template. See [Use templates to add and update work items](https://www.visualstudio.com/en-us/docs/work/productivity/work-item-template).

Once we've got the Goal API specification, we going to start the next hackfest!

Also, they are very pleased when I introduce the [Test & Feedback](https://marketplace.visualstudio.com/items?itemName=ms.vss-exploratorytesting-web) feature on the Marketplace. This is one of the favorite features of the VSTS for me.


# Conclusion

We automated a lot. Web/App Swap, CI/CD pipeline for Web/API apps, and iOS CI/CD pipeline using Fastlane. They can measure the Business outcome using the
Goal system. After the hackfest, they can enable 10-deploys-per-day environment on their Web/API apps.
It is just two days hacking among our team. Most importantly, we were enjoyed this hackfests.  

Here are customer comments for this hackfest. 

*"It's amazing the level that Microsoft has achieved regarding DevOps, and this hackfest was fantastic. It's impressive thinking that two hacking days can help us saving lots of days of productivity."* - **Geovanne Borges Bertonha, Software Architect**

*"The Hackfest was very productive and helpful, we've learned a lot of things and improved our continuous integration flow. Amazing. Hope we can have it again someday. Great job!"* - **Andre Ogura, iOS Specialist**

*"I did like very much of the hackfest. Was an opportunity for improve all knowledge and merge ideas. New solutions always are born in this events."* - **Leandro de Lima Machado, Software Engineer**

*"I had the opportunity to know more about Azure and VSTS. It was a great experience."* - **Andre Santos Kano, Software Engineer**

# Other Resources

* [Blue Green Deployment - Martinfowrler.com](http://martinfowler.com/bliki/BlueGreenDeployment.html)
* [Switch deployment slot in Azure web apps](https://www.visualstudio.com/en-us/docs/release/examples/azure/deployment-slots-webapps)
* [Authoring Azure Resource Manager templates](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-authoring-templates)
* [VSTS - allow Scripts to Access OAuth Token in Release Managment](http://stackoverflow.com/questions/41004090/vsts-allow-scripts-to-access-oauth-token-in-release-managment)
* [Hockey Apps](https://hockeyapp.net/)
* [fastlane](https://fastlane.tools/)
* [VSTS build agent for Mac](https://www.visualstudio.com/en-us/docs/build/admin/agents/v2-osx)
* [Visual Studio Mobile Center](https://www.visualstudio.com/vs/mobile-center/)
* [Apple Store task](https://marketplace.visualstudio.com/items?itemName=ms-vsclient.app-store)
* [Use templates to add and update work items](https://www.visualstudio.com/en-us/docs/work/productivity/work-item-template)
