---
layout: post
title:  "Digital management solution for conference based on Wechat app"
author: "Shijun Liu"
author-link: "#"
#author-image: "{{ site.baseurl }}/images/authors/photo.jpg"
date:   2016-12-12
categories: [Azure App Service]
color: "blue"
image: "images/AnRuiZhuoYue/Architecture.png" #should be ~350px tall
excerpt: Microsoft teamed up with AnRuiZhuoYue, digital marketing provider, to develop an intelligent conference management system with face registration and check-in functions. This system's frontend is based on Wechat App, as Wechat is the most popular digital marketing channel in China.  
language: [English]
verticals: [Entertainment, Media & Cable]
geolocation: [China]
---
WeChat is the center of digital marketing strategy in China. It has more than 500 million users, of which more than 50% open it 10 times a day. 
Wechat solutions can be hosted on Azure Web App. The ability to scale-out and scale-up, makes Azure App Service ideal for Wechat live-campaign scenarios.
We engaged with top Wechat partner Anruizhuoyue to help them migrate their digital marketing Wechat solution to Azure.

Microsoft teamed up with AnRuiZhuoYue, digital marketing provider, to develop an intelligent conference management system with face registration and check-in functions. This system's frontend is based on Wechat App. Its backend is hosted on Azure Web App, and powered by Cognitive Service. The team members are listed in the bottom of this article.

## Customer profile ##

[AnRuiZhuoYue](http://www.anruichina.com/) (NEEQ: 838075) is the leading end-to-end marketing services provider in China. Its services include Content Marketing, Digital Marketing and O2O Marketing. It's the </b>Top 1 Winner of Microsoft Global MSP Excellence Awards Supplier of the Year 2016</b>, and also the content and marketing supplier of Apple, Oracle, Lenovo and China Telecom.

 
## Problem statement ##

### *Business pain points* ###
In today's Internet environment, AnRuiZhuoYue's customers need more digital tools to improve their offline campaign experiences, such as client registration, check-in and feedback survey in the marketing roadshow or workshop. But the traditional event management has several disadvantages: 
* 	No self-services portal; 
* 	No fully mobile support and social integration; 
* 	Need to manually check-in; 
* 	No real-time data collection and analysis. 

So AnRuiZhuoYue plans to develop an self-service registration, check-in and feedback system based on Wechat for offline events .

### *Technical pain points* ###
* When audience check in at the offline event, large amounts of concurrent requests will go to the VM. They have to spend efforts on scaling out instances and load balancing. They need some method to easily manage the multi-instances.
*	Self-service check-in has some risks of someone checking in on behalf of others. So face identification is ideal in this scenario to strengthen the process of self-service check-in.

So AnRuiZhuoYue plans to develop this system with Cognitive Service Face API, and host its backend on Azure Web App for load balancing.



## Solution, steps, and delivery ##

### *Solution delivery* ###
AnRuiZhuoYue and us worked together, delivered an end to end Wechat conference management solution, including a Wechat app for offline event, an management portal also as a backend server, a UWP and auto-deployment ARM template. 

* The Wechat App includes:
    * **Basic features**: Users can follow this app in Wechat, to apply for the event, upload personal information and get notifications from the organizers.
    * **Face registration and check-in features**: Users can upload face photos in Wechat as face database, and test if it can be identified.

* The management portal includes:

    *	**Management features:** Operator can monitor all the users through this portal. 
    *	**Backend service:** It provides check-in API for the mobile app.

* The UWP mobile app includes:

    *	**Onsite Check-in feature:** Attendees can check in using mobile device onsite provided by the organizer. 

* The auto-deploy templatee includes:

    *	**ARM template:** This template is for Azure App Service, Storage, SQL Database creation and code package deployment.
    *	**Deployment project:** It is used to sign in and trig the deployment process for users.

*Figure.1 Face uploaded in Wechat*

![Face Upload Capture]({{site.baseurl}}/images/AnRuiZhuoYue/H5Capture.jpg)

*Figure.2 Wechat response*

![Wechat Capture]({{site.baseurl}}/images/AnRuiZhuoYue/WechatCapture.jpg)

*Figure.3 Face detection UWP*

![UWP Capture]({{site.baseurl}}/images/AnRuiZhuoYue/UWPCapture.jpg)

*Figure.4 Management portal*

![Management Portal Capture]({{site.baseurl}}/images/AnRuiZhuoYue/ManagementPortal.png)


### *Technical Architecture* ###
This solution leverages Azure Web App, Azure SQL Database, Azure Storage and Cognitive Service.
* The backend of Wechat App is actually a web server, and hosted on Azure Web App.
* The Mangement Portal and the API service backend is hosted on Azure Web App.
* Images are stored in Azure Blob Storage.
* User data are stored in Azure SQL Database.
* Face detection and indentification are implemented by Cognitive Service.

*Figure.5 Technical architecture*

![Technical Architecture]({{site.baseurl}}/images/AnRuiZhuoYue/Architecture.png)

### *Activities* ###
We hosted two hackfests with AnRuiZhuoYue, especially the second one, we invited AnRuiZhuoYue to BJW building, with Corp TE together to help them migrate their solution to Azure.

*Figure.6 Hackfest photos*

![Hackfest Photo]({{site.baseurl}}/images/AnRuiZhuoYue/Hackfest.jpg)
![Hackfest Photo]({{site.baseurl}}/images/AnRuiZhuoYue/HackfestGroup.jpg)

![Hackfest Photo]({{site.baseurl}}/images/AnRuiZhuoYue/HackfestWhiteBoard.jpg)

### *Technical Implementation* ###
After several months' work, we delivered code package based on .NET and Wechat API, including Wechat App backend, API server, and managment web page.

*Figure.7 Wechat backend code*

![Wechat Backend Code Capture]({{site.baseurl}}/images/AnRuiZhuoYue/CodeCapture.jpg)

All these web servers are hosted on Azure Web App with some advanced features being used, especially the Wechat backend server on Azure Web App.
* Leverage the autoscale feature to handle the high concurrent requests when the Wechat compaign activities is being hosted. This decreases their IT operation efforts compared with using their local servers.  
* We found that Wechat sometimes blocks the Azure domain name. We bind custom domain name with our Azure Web App to solve this issue.
* They also use remote debugging feature on Azure Web App to check their SQL database connection issue.

*Figure.8 Azure Web App*

![Azure Web App Capture]({{site.baseurl}}/images/AnRuiZhuoYue/AzureWebApp.jpg)

They also leverage Azure Storage and SQL Database as data store.

*Figure.9 Azure Storage*

![Azure Storage Capture]({{site.baseurl}}/images/AnRuiZhuoYue/AzureStorage.jpg)

*Figure.10 Azure SQL Database*

![Azure SQL Database Capture]({{site.baseurl}}/images/AnRuiZhuoYue/AzureSQLdb.jpg)

The auto-deploy ARM template help AnRuiZhuoYue quickly set up the Azure environment. Part of the json file is as below:

```ARM
  {
      "name": "[parameters('WebAppName')]",
      "type": "Microsoft.Web/sites",
      "location": "[resourceGroup().location]",
      "apiVersion": "2015-08-01",
      "dependsOn": [
        "[concat('Microsoft.Web/serverfarms/', parameters('WebAppSvcPlanName'))]"
      ],
      "tags": {
        "[concat('hidden-related:', resourceGroup().id, '/providers/Microsoft.Web/serverfarms/', parameters('WebAppSvcPlanName'))]": "Resource",
        "displayName": "WebApp"
      },
      "properties": {
        "name": "[parameters('WebAppName')]",
        "serverFarmId": "[resourceId('Microsoft.Web/serverfarms/', parameters('WebAppSvcPlanName'))]"
      },
      "resources": [
        {
          "apiVersion": "2015-08-01",
          "name": "web",
          "type": "config",
          "dependsOn": [
            "[concat('Microsoft.Web/sites/', parameters('WebAppName'))]"
          ],
          "tags": {
            "displayName": "WebAppConfig"
          },
          "properties": {
            "phpVersion": "5.6",
            "netFrameworkVersion": "v4.6",
            "use32BitWorkerProcess": false,
            "webSocketsEnabled": true,
            "alwaysOn": false,
            "remoteDebuggingEnabled": false
          }
        },
        {
          "name": "appsettings",
          "type": "config",
          "apiVersion": "2015-08-01",
          "dependsOn": [
            "[concat('Microsoft.Web/sites/', parameters('WebAppName'))]"
          ],
          "tags": {
            "displayName": "WebAppAppSettings"
          },
          "properties": {
            "Oxford:FaceAPIPrimaryKey": "[parameters('CognitiveKey')]",
            "AppUrlBase": "[concat('http://',parameters('WebAppName'),'.chinacloudsites.cn')]",
            "blob:Account": "[parameters('StorageAccountName')]",
            "blob:Key": "[listKeys(resourceId('Microsoft.Storage/storageAccounts', parameters('StorageAccountName')), providers('Microsoft.Storage', 'storageAccounts').apiVersions[0]).keys[0].value]",
            "wx:AppId": "[parameters('wxAppId')]",
            "wx:AppSecret": "[parameters('wxAppSecret')]",
            "ef:ConnectionString": "[concat('Server=tcp:', reference(concat('Microsoft.Sql/servers/', parameters('SQLServerName'))).fullyQualifiedDomainName, ',1433;Database=', parameters('SQLDBName'), ';User Id=', parameters('sqlAdministratorLogin'), '@', parameters('SQLServerName'), ';Password=', parameters('sqlAdministratorLoginPassword'), ';Trusted_Connection=False;Encrypt=True;Connection Timeout=30;')]"
          }
        },
        {
          "name": "MSDeploy",
          "type": "extensions",
          "location": "[resourceGroup().location]",
          "apiVersion": "2015-08-01",
          "dependsOn": [
            "[concat('Microsoft.Web/sites/', parameters('WebAppName'))]"
          ],
          "tags": {
            "displayName": "WebAppMSDeploy"
          },
          "properties": {
            "packageUri": "[variables('packageURI')]"
          }
        }
      ]
    }
```

The Deployment project is implemented as a console application. IT Pro can set up the environment and deploy the code by signing in using his Azure account, powered by Azure Active Directory. Part of the .NET code is as below:
```.NET
public static void Main(string[] args)
{

            //Deploy Parameters
            var groupName = "";
            var rgPara = new ResourceGroup("China North");
            var subscriptionId = "";
            string ClientId = "";
            var deploymentName = "";

            //Resource Parameters
            ...

            //Get Token
            var token = GetAccessTokenAsync(ClientId);
            var credential = new TokenCredentials(token.Result.AccessToken);

            //Create Parameter Json
            string parametersJson = UpdateParameterJson(webAppName, ...);
        
            //Create ARM
            var dpResult = CreateTemplateDeploymentAsync(credential, rgPara, groupName, deploymentName, subscriptionId, parametersJson);
            Console.WriteLine(dpResult.Result.Properties.ProvisioningState);

            Console.WriteLine("Press Enter to exit");
            Console.ReadLine();
        }
        private static async Task<AuthenticationResult> GetAccessTokenAsync(string clientId)
        {
            Uri rUri = new Uri("https://login.chinacloudapi.cn");
            var context = new AuthenticationContext("https://login.chinacloudapi.cn/common");
            var token = context.AcquireToken("https://management.chinacloudapi.cn/", clientId, rUri);
            if (token == null)
            {
                throw new InvalidOperationException("Could not get the token.");
            }
            return token;
        }
        public static async Task<DeploymentExtended> CreateTemplateDeploymentAsync(
          ServiceClientCredentials credential,
          ResourceGroup rgPara,
          string groupName,
          string deploymentName,
          string subscriptionId,
          string parametersJson)
        {
            Console.WriteLine("Creating the template deployment...");
            var resourceManagementClient = new ResourceManagementClient(new Uri("https://management.chinacloudapi.cn/"), credential)
            { SubscriptionId = subscriptionId };
            DeploymentExtended aa = null;
            try
            {
                var result = resourceManagementClient.ResourceGroups.CreateOrUpdateAsync(groupName, rgPara).Result;
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
            var deployment = new Deployment();
            deployment.Properties = new DeploymentProperties
            {
                Mode = DeploymentMode.Incremental,
                Template = File.ReadAllText("..\\..\\WebappTemplate.json"),
                Parameters = parametersJson
            };

            try
            {
                aa = await resourceManagementClient.Deployments.CreateOrUpdateAsync(
                groupName,
                deploymentName,
                deployment);
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
            }
            return aa;
}
```
 
## Conclusion ##

As a result of this technical engagement, AnRuiZhuoYue positions this solution as their company's SaaS product. They have published it to one of their Wechat public account: AnRuiEvent. This product is hosted entirely on Microsoft Azure. 

This solution will also be promoted on [Azure China official site](www.azure.cn), as one pilot of digital marketing solution based on Wechat and Azure, delivered by Microsoft partner. This promotion will help attract Wechat partners, in order to grow Azure business in China.

From technical apsect, we demonstrated that Azure App Service can handle the load balancing demand of Wechat live compaign, got a lot of experiences in integating Wechat backend to Azure, and delivered an ARM template of Wechat related Azure services. This will help partner and us quickly implement Azure based Wechat solution. 



## Great team ##
Special thanks to the AnRuiZhuoYue team, the Microsoft China DX Technical Evangelist team, and the Microsoft Audience Evangelism team.

This project team included the following participants:

* Qisheng Zhu –	AnRuiZhuoYue GM
* Weiqi Ma –	AnRuiZhuoYue dev manager
* Feihong Gan –	AnRuiZhuoYue developer
* Malgosia Mazany - Microsoft Corp DX Audience Evangelism Manager
* Yan Zhang – Microsoft China DX Audience Evangelism Manager
* Zepeng She – Microsoft China DX Technical Evangelist
* Rita Zhang – Microsoft Corp DX Technical Evangelist
* Bhargav Nookala - Microsoft Corp DX Technical Evangelist
* Haishi Bai - Microsoft Corp DX Technical Evangelist
* Zepeng She – Microsoft China DX Technical Evangelist
* Qixiao Wang –	Microsoft China DX Technical Evangelist
* Shijun Liu –	Microsoft China DX Technical Evangelist

