---
layout: post
title:  "With its analytic dashboard, SnapBizz helps shopkeepers track their sales"
author: "Sudhir Rawat"
author-link: "#"
#author-image: "{{ site.baseurl }}/images/authors/photo.jpg"
date:   2017-05-02
categories: [Power BI Embedded]
color: "blue"
image: "images/snapbizzpbie/snapbizzpbie14.png" #should be ~350px tall
excerpt: Microsoft worked with SnapBizz to design, deploy, and render Power BI Embedded reports, reducing management time and enabling future cross-platform integration. 
language: English
verticals:  ["Retail, Consumer Products & Services"]
geolocation: [India]
---


As a result of its hackfest with Microsoft, SnapBizz can integrate Microsoft Power BI Embedded into its solution and easily author interactive data reports without writing any code by using Power BI Desktop. The team can choose modern data visualizations out of the box or can customize visualizations without building them from scratch. It reduces their development efforts and offers a lot of flexibility. It also helps SnapBizz customers to have consistent, high-fidelity, interactive data visualization experiences, rendered on an Android tablet.

**Technologies used:**

- Azure Resource Manager 
- Azure Data Factory 
- Azure SQL Database 
- Power BI Desktop 
- Power BI Embedded 
- Java application for viewing reports on Android tablet 

**The project team included:**

- Sudhir Rawat – Senior Technical Evangelist, Microsoft DX India
- Surbhi Jain – Audience Marketing, Microsoft DX India
- Muthu Subramaniam – Director, SnapBizz Cloudtech 
- Kishor Babu – Product Development Lead, SnapBizz Cloudtech
- Lalu S – AVP, Convergytics Solution 

## Company profile ##

###### [SnapBizz Cloudtech Pvt. Ltd.](http://www.snapbizz.com/) | Bangalore, India ######

In a diverse market like India's, traditional “kirana” (local) stores make up 98 percent of store coverage and 85 percent of business. Among them, the top 5 percent (400K-500K stores) contribute to 30 percent or more of business. The shelf life of point-of-sale material is extremely limited, sometimes just one day. Its effectiveness is even more limited by the quality of seller, merchandiser, and relationship with the store owner. 

The same can be said of a brand’s engagement directly with the retailer. It's extremely limited and ineffective depending on quality of seller and frequency of visits. The standalone traditional retailer (at the top of the coverage pyramid) faces severe competition from modern trade. E-commerce is highly focused on consumer promotions and significantly better shopper experiences.

In order to join all the dots of this fragmented space, SnapBizz has created a *disruptive solution* to address the business needs of the FMCG (fast-moving consumer goods) ecosystem (brands, retailer, consumer, and distributor) in large/medium “kirana” stores. The Android-based solution helps shopkeepers not only maintain transactions but also reduce excess stock, purchase smarter, and improve profitability. 

Shopkeepers also get *schemes* (special deals, such as buy 1, get 1 free) from sellers directly. They show and promote products to more shoppers to enable sales increases through smart LED screens placed in stores. These attract customers with various schemes. 

SnapBizz currently deploys its solution to around 2,000 shops in various cities in India and is in the process of deploying the same solution to another 3,000 stores.  

## Problem statement ##

SnapBizz provides reporting to business stakeholders and shopkeepers. Let's say *ABC Company* distributes its product to various stores for sale. The shopkeepers display ABC's product on screens provided by SnapBizz. Each product sale gets recorded in an Android tablet. At regular intervals, shopkeepers view sales reports. ABC Company also views various reports provided by SnapBizz. So there are two types of reporting: company and shopkeepers. The focus is on the reporting solution provided to shopkeeper.  

At present, two applications are deployed on the Android tablet. The first application is for recording each sales transaction. All the data gets stored locally and a copy is sent to Azure SQL Database. The second application is used for reporting purposes. This reporting application generates reports from the local data stored in Android. If the SnapBizz solution is installed on new/existing tablets, then all data gets pulled from the Azure SQL Database server.

SnapBizz provides various types of reports to its customers (shop owners), including:

- Inventory tracking 
- Sales summary and detail 
- Product wise sales 
- Product recommendations
- Customer frequency 
- Customer purchase behavior

These are the pain points associated with the existing solution:

- **Adding new reports:** If any customers ask for a new report, they need to create a new application and install it on Android. This results in a lot of application versions to be maintained. 
- **Update the application:** Any change in existing reports requires an application update, which is time-consuming. They also need to make sure that application is updated by all the stores.
- **Visualization:** Visualization of the reports is not appealing with existing technology as compared to Power BI.  
- **Cross-platform reporting:** Currently, all reports are shown only on an Android tablet. However, SnapBizz is planning to provide reports over other devices (such as mobile) in the future, which will be a challenge with the current design.  
- **Interactivity of reports:** Report interactivity is not up to the mark. 

## Solution ##

**Step 1: Building the end-to-end flow**	

We did a proof of concept with the SnapBizz team during the Power BI Embedded hackfest. First, we considered their current architecture. After some discussion, we were able to get a good understanding of it. They have a requirement to run Power BI Embedded reports on Android tablets. Also, they want shop owners to view only their own data. We discussed with them data storage planning, report design, row-level security, deployment, and rendering reports on Android tablets.

*Figure 1. Reporting architecture*

![reporting architecture]({{ site.baseurl }}/images/snapbizzpbie/snapbizzpbie1.png)


**Step 2: Data storage planning**

The data warehouse is built by Microsoft partner Convergytics Solution Pvt. Ltd. using a state-of-the-art Microsoft Azure and hybrid platform. Large volumes of data from stores all around India are extracted, transformed, and loaded to a cloud elastic database running on an Azure database. The data is pushed to on-premises analytical servers and processed to create compressed in memory cubes. Further, this data is aggregated and exposed to various store owners, internal users, and corporate vendors. Millions of records are managed and maintained using efficient ETL (Extract, Transform, Load) packages connected to multiple sources such as DocumentDB, PostgreSQL, Amazon Redshift, MySQL, flat files, and so on using interfaces and R scripts. 

The system is built in such a way that the extraction layer, the storage layer, the analytical layers, and the reporting layers are scalable based on volume of transaction. This has led to massive cost reduction for SnapBizz both in terms of maintenance and manpower. Further, data scientists are working on this data to create predictive models and sophisticated analytical models to give the report users valuable inputs for making strategic and tactical decisions. 

*Figure 2. Existing technical implementation*

![existing technical implementation]({{ site.baseurl }}/images/snapbizzpbie/snapbizzpbie2.png)


We recommended creating another database for shopkeeper reporting. Their concern was how they could better manage DTUs so that enough resources will be available for each database. We discussed enabling the Elastic Database feature of SQL Database so that resources can be shared among a pool of databases on that server.

*Figure 3. Azure SQL Database resource allocation design*

![resource allocation design]({{ site.baseurl }}/images/snapbizzpbie/snapbizzpbie3.png)


**Step 3: Preparing query for reporting**

All reporting data is available in Azure SQL Database, so we didn’t have to spend much time preparing the query for reporting. 

**Step 4: Report design**

Power BI Desktop is being used for designing the reports. SnapBizz has a dedicated team for report designing. They are well versed in the Power BI Desktop tool and in-built/custom visualizations.

**Step 5: Row-level security**

One of the key requirements for SnapBizz is to provide shopkeepers with only their own data. SnapBizz doesn’t want shopkeepers to access each other’s data. As per their design, each row has a “StoreId” column in tables that indicates which record belongs to which store. Figure 4 shows the diagram we discussed with the SnapBizz team. 

*Figure 4. Row-level security implementation plan*

![row-level security]({{ site.baseurl }}/images/snapbizzpbie/snapbizzpbie4.png)


In Power BI Embedded, we created a role to accept “StoreId” and render data for only that store. Applications running on an Android tablet send “StoreId” information whenever any report is requested by the user. The report is then delivered to the user on their tablet.

*Figure 5. Set up role in Power BI report using Power BI Desktop tool*

![create role]({{ site.baseurl }}/images/snapbizzpbie/snapbizzpbie5.png)


*Figure 6. Code snippet for sending StoreId from code running on Android tablet*

![code for sending storeid]({{ site.baseurl }}/images/snapbizzpbie/snapbizzpbie6.png)


**Step 6: Report deployment**

For report deployment, we used the PowerBI-Cli solution provided by Microsoft. [The code is available here](https://github.com/Microsoft/PowerBI-Cli).

Here is the list of Power BI CLI commands used during the hackfest:

```
Setting configuration 
powerbi config -c <collection> -k <accessKey>
```
```
Creates a new workspace within a workspace collection
powerbi create-workspace -c <collection> -k <accessKey>
```
```
Imports a PBIX file into a workspace  
powerbi import -c <collection> -w <workspaceId> -k <accessKey> -f <file> -n [name] -o [overwrite]
```
```
List of all datasets within a workspace
powerbi get-datasets -c <collection> -w <workspaceId> -k <accessKey>
```
```
Updates connection strings and/or credentials for an existing dataset
powerbi update-connection -c <collection> -w <workspaceId> -k <accessKey> -d <datasetId> -s [connectionString] -u [username] -p [password]
```

We also showcased a [“provision solution” sample provided by Microsoft](https://github.com/Azure-Samples/power-bi-embedded-integrate-report-into-web-app).

**Step 7: Report render**

The SnapBizz solution is deployed on an Android tablet (version 4.2) and hence the requirement is to render reports on it. No server is running on it. The application is based on Java 8 and XML. 

**Challenge**

The SnapBizz solution is developed on Android and the Power BI Embedded report has been designed in HTML and JavaScript. The challenge was to call the Power BI Embedded report in an Android application. While doing it, we encountered an unexpected obstacle—we were unable to pass an access token from the Android application to a JavaScript function.

The customer came up with the following architecture to overcome this problem. 

*Figure 7. Architecture change to overcome the report rendering issue*

![architecture change]({{ site.baseurl }}/images/snapbizzpbie/snapbizzpbie7.png)


This worked perfectly but it was putting too much load on the application server. Transaction data already get processed on the application server and now report-handling requests have been added to it. This extra overhead on the application server can cause performance bottlenecks and timeouts or connectivity issues. Another problem with this approach is if a generated URL is compromised, then anyone can see the report. 

We discarded this approach and started debugging the issue. The aim was to figure out the issue and resolve it. Since we were not sure whether the issue was with a WebView or iframe control, we loaded an empty iframe on WebView. The iframe control loaded properly. We then tried to load a JavaScript function, which sets an authentication token and makes a Power BI Embedded report call.

*Figure 8. Code snippet to run script on iframe control*

![code for script on iframe]({{ site.baseurl }}/images/snapbizzpbie/snapbizzpbie8.png)


When the code was executed, neither report nor error was displayed.

*Figure 9. Output* 

![output]({{ site.baseurl }}/images/snapbizzpbie/snapbizzpbie9.png)


**Solution**

This resulted in us creating a separate HTML page in the Android application to load the Power BI Embedded reports. In the HTML page, we first added iframe to load the report after which we loaded the HTML page in the Android application using the WebView component in Android. Our challenge was to pass the access token to the JavaScript function that declared in the HTML page even though `webView.getSettings().setJavaScriptEnabled(true);` is set.

For this we started debugging and referred to Android documents online. Thus, we came to the conclusion that a property called `webView.setWebChromeClient(new WebChromeClient());` is necessary to complete the task. So we added that element and were successful in passing the value to JavaScript from the Android application.

The following code snippet was implemented to pass the access token to the JavaScript function declared in the HTML page:

```
webView.getSettings().setJavaScriptEnabled(true);
webView.loadUrl("file:///android_asset/report.html");
webView.setWebContentsDebuggingEnabled(true);
webView.getSettings().setJavaScriptCanOpenWindowsAutomatically(true);
webView.setWebChromeClient(new WebChromeClient());
webView.setWebViewClient(new WebViewClient(){
public void onPageFinished(WebView view, String url){   
    if(loadStatus == 1)
        webView.loadUrl("javascript:loadReport('" + accessToken + "')");
        ++loadStatus;
}           
});
```

Code snippet of HTML page to load Power BI Embedded reports:

```
<!DOCTYPE html>
<html>
<head>
<title>Day Wise Analysis</title>
<script type="text/javascript">
function loadReport(val){
var iframe = document.getElementById('ifrTile');
iframe.src = 'https://embedded.powerbi.com/appTokenReportEmbed?reportId=XXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX';
    iframe.onload = function() {
    var msgJson = {
        action: "loadReport",
        accessToken: val,
        height: 600,
        width: 722
        };
    var msgTxt = JSON.stringify(msgJson);
    iframe.contentWindow.postMessage(msgTxt, "*");
    };
}
</script>
</head>
<body>
<div id="divView">
<iframe id="ifrTile" width="100%" height="600"></iframe>
</div>
</body>
</html>
```

*Figure 10. Test Power BI Embedded report display on Android tablet*

![test power bie report]({{ site.baseurl }}/images/snapbizzpbie/snapbizzpbie12.png)


## Power BI reports ##

Here are some sample reports designed by the customer. 

*Figure 11. Day-wise analysis*

![day wise analysis]({{ site.baseurl }}/images/snapbizzpbie/snapbizzpbie13.png)


*Figure 12. Category-wise analysis*

![category wise analysis]({{ site.baseurl }}/images/snapbizzpbie/snapbizzpbie14.png)


## Conclusion ##

Microsoft and the SnapBizz team worked together to conclude a successful implementation of the Power BI Embedded solution. The SnapBizz team had their reporting solution running on Android using an in-built library and now leveraging Azure SQL Database and Power BI Embedded (platform as a service) for their reporting requirements.

The key benefit SnapBizz derived from this engagement was reducing its management time for maintaining report application. 

Apart from that key benefit, the Power BI Embedded solution offers the following benefits to various stakeholders and developers:

- Ease of report design and more visualization control with Power BI.
- Detailed analysis of various aspects.
- Ability to integrate dashboards across platforms (web, mobile, and so on) in the future.

*Figure 13. Hackathon pictures*

![hackathon]({{ site.baseurl }}/images/snapbizzpbie/snapbizzpbie15.jpg)


### Recommendations 

- If access keys are compromised, regenerate access keys in the Azure portal.
- Ensure that Power BI Desktop has the latest updates. This can be done automatically if “Display update notifications for Power BI Desktop” is checked under Updates in Options (File-> options and settings).
- Check Power BI visual library for custom visuals.
- Keep Azure SQL Server and Power BI Embedded in the same region. This can help avoid any egress charges. 
- Use only a subset of the data that is required for reporting. 
- For report deployment/maintenance, use an existing sample provided by Microsoft in [GitHub](https://github.com/Azure-Samples/power-bi-embedded-integrate-report-into-web-app/) or use PowerBI-Cli.
- Use [App token](https://docs.microsoft.com/en-us/azure/power-bi-embedded/power-bi-embedded-app-token-flow) for embedding reports in the application. Set an expiration time with every App token.

### Opportunities going forward 

SnapBizz and Convergytics were happy with this engagement. They decided to move this solution to their production and started the planning phase. We will continue to engage with SnapBizz to help them with deployment and manageability of Power BI Embedded reports. 

### Quote from the customer 

>"We are delighted to partner with Microsoft for the Azure services and (Power BI Embedded), which helps us to deliver an enhanced customer experience. We had a fantastic experience at the hackfest. Finding a new way to implement (Power BI Embedded) in the Android application was especially enriching. We always wondered why no one had tried implementing it and are excited to be the first ones to do it. We can now (address) some weird aspects of our system and this will help us become much more efficient." 
>
>— SnapBizz Director Muthu Subramaniam 
