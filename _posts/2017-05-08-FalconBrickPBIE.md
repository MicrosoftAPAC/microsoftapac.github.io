---
layout: post
title:  "With its analytic dashboard, FalconBrick helps real estate industry streamline thier entire construction cycle"
author: "Sudhir Rawat"
author-link: "#"
#author-image: "{{ site.baseurl }}/images/authors/photo.jpg"
date:   2017-05-02
categories: [Power BI Embedded]
color: "blue"
image: "images/falconbrickpbieimages/fbpbie1.png" #should be ~350px tall
excerpt: Microsoft worked with FalconBrick to design, deploy, and render Power BI Embedded reports, reducing management time and enabling future cross-platform integration. 
language: English
verticals:  ["Real Estate, Construction and Infrastructre Industry"]
geolocation: [India]
---


As a result of its hackfest with Microsoft, Falcon can integrate Microsoft Power BI Embedded into its solution and easily author interactive data reports without writing any code by using Power BI Desktop. The team can choose modern data visualizations out of the box or can customize visualizations without building them from scratch. It reduces their development efforts and offers a lot of flexibility. It also helps FalconBrick customers to have consistent, high-fidelity, interactive data visualization experiences, rendered in thier application.

**Technologies used:**

- Azure Resource Manager 
- Azure Data Factory 
- Azure SQL Database 
- Power BI Desktop 
- Power BI Embedded 
- Node.JS for viewing reports on browser 

**The project team included:**

- Sudhir Rawat – Senior Technical Evangelist, Microsoft DX India
- Surbhi Jain – Audience Marketing, Microsoft DX India
- Aditya Shankar - FalconBrick, Co-Founder 
- Gautam Mayur - FalconBrick, Co-Founder
- Harsha Patil – FalconBrick, Engineer 

## Company profile ##

###### [FalconBrick](http://www.falconbrick.com/) | Bangalore, India ######

FalconBrick is India's only end-to-end mobile based solutions provider for the Real estate / Construction / Infrastructure industry. They help their customers (builders & construction / infra companies) accelerate their projects & streamline their entire construction cycle so that they can provide
a superior experience to their customers (faster handovers, enhanced quality of projects).

FalconBrick solution provides features to real-estate like:
- Automates the end-to-end Execution, Finishing, Inspection & Handover process using mobile
- Customized agenda Screen for each user, showing “top units for focus”	
- Screens for each stage (Self inspection by Projects, QA inspection, CRM & customer inspections & handover)
- Snaglists visible on mobile
- Analytics and Reporting

The real estate sector in India faces many challenges—delayed projects, unhappy customers, liabilities for builders and problems with approvals. With the Real Estate Regulatory Act (RERA) coming in, there is a significant push to regulate the sector and bring in clarity for both buyers and developers and FalconBrick does just that. FalconBrick automates and accelerates end-to-end project operations including execution, finishing, handover and facility management. Its app brings site execution, quality, planning and CRM teams as well as contractors onto a single platform so that they can monitor the project on the mobile phone right from excavation till handover.

## Problem statement ##

There are various types of reports FalconBrick provides to their customer including.   

- Live benchmarking and comparison – across projects, contractors and engineers 
- Snag Categorization and root cause analysis
- Project status at a glance
- Operational Daily and Monthly project progress

FalconBrick had built its reports and hosted on PowerBI online. To grant access to their customers, they would create one user account for each customer which had access to the reports. People in field used the PowerBI app on android phone and users at office premises used browser to view reports.
However, there were few challenges with this approach

These are the pain points associated with the existing solution:

- Scalability is a challenge, creating a new user for every customer onboarded is not an optimal solution.
- Their customers need to buy many PowerBI license which increases the total cost of their solution. Pay as you use model is most preferred.   
- Reports are not embedded into their solution. Customers need to switch context of the application to view reports, which is a suboptimal user experience. 

Embedding  PBIE reports within their application was the best solution to the above.

## Solution ##

**Step 1: Building the end-to-end flow**	

We did a Proof of Concept with the FalconBrick team during the PowerBI Embedded Hackfest. First, we got good understanding of their current architecture. Their current architecture includes Mobile native app (written in Java), PostgreSQL to store transactional data, Azure Data Factory to move data
from PostgreSQL to Azure SQL. PowerBI online for report visualization.

The plan was to build new web application (using Node.js + React) for rendering Power BI dashboard and then render some reports in Android based application. We discussed data storage planning, Report design, row level security, deployment and rendering reports on Android native application and
Node.js + React.

The plan is to roll out this solution to their first customer by last week of May 2017.


*Figure 1. Reporting architecture*

![reporting architecture]({{ site.baseurl }}/images/falconbrickpbieimages/fbpbie1.png)


**Step 2: Data storage planning**

The customer already had Azure Data factory pipeline built up for moving data from PostreSQL to Azure SQL database for reporting purpose. However, FalconBrick team had a few concerns on Data.

*Latency:* One of the concerns the team shared was regarding how and when to take a call to move their reporting data. We discussed latency expectations of the end user For instance, if the end user is okay to have one day latency, then we could schedule ADF daily. However, in some scenario end
user need some quick information about unit, project etc for which they were okay to get it from transactional database.

*Data Archiving Policy:* We also discussed to put data archiving policy on analytics database. Once a project is completed and unit (house/flat) is handed over to customer then such information will be moved to another storage and may be used to build
predictive models.

*Setup Elastic Pool:* Currently Falconbrick has different databases for different customer and allocating X DTU for each database. We recommended setting up an elastic pool and allocating eDTUs to the pool. This will help them utilize resources as per the traffic load on individual database. The
technical team were very happy with this approach as they can utilize resources much better and reduce cost.

*Figure 2. Elastic Database Pool*

![elastic database pool]({{ site.baseurl }}/images/falconbrickpbieimages/fbpbie2.png)

*Data Partitioning:* We discussed the benefits of data partitioning and how to design partitions. We walked through three typical strategies for data partition which are horizontal partition, vertical partition and functional partition. Recommend going through [data partition article](https://docs.microsoft.com/en-us/azure/architecture/best-practices/data-partitioning).


**Step 3: Preparing query for reporting**

All reporting data is available in Azure SQL Database. Customer already have SQL queries ready for report generation. 

**Step 4: Report design**

PowerBI desktop is being used for designing the reports. FalconBrick team is well versed with reporting designing using PowerBI desktop tool and aware of inbuilt/custom visualizations.

**Step 5: Row-level security**

One of the key requirement for FalconBrick is to present each user with their own data with no access to other users data As per their design each row has “userassigned” column in tables which indicates which record belongs to which user.  Here is the diagram we discussed with FalconBrick team. 

*Figure 3. Row-level security implementation plan*

![row-level security]({{ site.baseurl }}/images/falconbrickpbieimages/fbpbie3.png)

In PowerBI embedded we created a role to accept “userid” and render data for only that user.  Application running on browser sends “userid” information alongwith the report reques. Report is validated against the user and then delivered on their browser app

Since FalconBrick team had to redesign their analytics database structure we did sample demo of RLS on block-id column.

*Figure 4. Set up role in Power BI report using Power BI Desktop tool*

![create role]({{ site.baseurl }}/images/falconbrickpbieimages/fbpbie4.png)

*Figure 5. Code snippet for sending blobkId from code*

![code for sending blockid]({{ site.baseurl }}/images/falconbrickpbieimages/fbpbie5.png)


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

We ran into a problem when executing PowerBI CLI commands in Mac. Here is the screenshot of the error.

*Figure 6: Error when executes PowerBI CLI commands*

![Error while executing CLI]({{ site.baseurl }}/images/falconbrickpbieimages/fbpbie6.png)

When we look onto the installation of PowerBI CLI,we figured out that each command is prefix with ‘cli-‘. To fix this, we simply removed ‘cli-‘ prefix.

*Figure 7: Code snippet of installation directory*

![Installation directory]({{ site.baseurl }}/images/falconbrickpbieimages/fbpbie7.png)

We also showcased a [“provision solution” sample provided by Microsoft](https://github.com/Azure-Samples/power-bi-embedded-integrate-report-into-web-app).

**Step 7: Report render**

FalconBrick solution is deployed on Android native app. They are building a web solution for showing PowerBI reports to users. They will be using Node.js+React. 

*App.js*
```
/**
 * Module dependencies.
 */
var express = require('express'),
  html = require('html'),
  http = require('http'),
  path = require('path');
var powerbi = require('powerbi-api');
var msrest = require('ms-rest');
var app = express();
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
  var token = powerbi
    .PowerBIToken
    .createReportEmbedToken('HandOff', 'XXXXXX-XXXX-XXXX-XXX-XXX', 'XXX-XXX-XXX-XX-XXX', "XXX-XX-XX-XXX-XX", '', "BGT_BLK_D", "BlockSupervisor");
  var jwtoken = token.generate('b0KXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' +
      '7dMJ4g==');
  console.log(jwtoken);
  res.render('index.html', {
  title: 'PowerBI with Docker',
    jwt: jwtoken
  });
  res.end();
});
app.listen(process.env.PORT || 8000);
```

*Index.html*
```
<!DOCTYPE html>
<html>
<head>
	<title><%- JSON.stringify(title) %></title>
	<script type="text/javascript">
		function doinit(){
			var element = document.getElementById('myReport');
			var report = powerbi.embed(element);
			console.log("initDOne")
		}
	</script>
</head>
<body>

<button onclick="doinit()">Press me to init</button>

<div id="myReport"
	powerbi-type="report"
    powerbi-embed-url="https://embedded.powerbi.com/appTokenReportEmbed?reportId=c0a0b49a-ddb9-45bb-860d-b5c1ce18a570" 
    powerbi-access-token=<%- JSON.stringify(jwt) %> style="height: 600px;"
</div>

<script src="powerbi.min.js"></script>
<script type="text/javascript">
   var reportDiv = document.getElementById("myReport");
   var title =  <%- JSON.stringify(title) %>;
   var jwtValue = <%- JSON.stringify(jwt) %>;
   console.log(jwtValue);
   reportDiv.setAttribute("powerbi-access-token",jwtValue);
   console.log(jwtValue);
</script>
</body>
</html>
```


Github repo [here](https://github.com/brijrajsingh/nodejs-PowerBI-Embedded-Sample)

## Power BI reports ##

Here are some sample reports designed by the customer. 

*Figure 08. Contractor Benchmarking*

![contractor benchmarking]({{ site.baseurl }}/images/falconbrickpbieimages/fbpbie8.png)

*Figure 09. Dashboard*

![Dashboard]({{ site.baseurl }}/images/falconbrickpbieimages/fbpbie9.png)

*Figure 10. Snaglist*

![Snaglist]({{ site.baseurl }}/images/falconbrickpbieimages/fbpbie10.png)

*Figure 11. Certification*

![Certification]({{ site.baseurl }}/images/falconbrickpbieimages/fbpbie11.png)

## Some pictures from the PowerBI Embedded Hackfest ##

*Figure 12. Hackfest Pictures*

![hackfest picture]({{ site.baseurl }}/images/falconbrickpbieimages/fbpbie12.png)

## Opportunities going forward ##

We will continue to engage with FalconBrick to help them with deployment and manageability of PowerBI Embedded reports. We also discussed the opportunity to use Azure function, Cognitive services and Bot framework.

## Recommendations ## 

- If access keys are compromised, regenerate access keys in the Azure portal.
- Ensure that Power BI Desktop has the latest updates. This can be done automatically if “Display update notifications for Power BI Desktop” is checked under Updates in Options (File-> options and settings).
- Check Power BI visual library for custom visuals.
- Keep Azure SQL Server and Power BI Embedded in the same region. This can help avoid any egress charges. 
- Use only a subset of the data that is required for reporting. 
- For report deployment/maintenance, use an existing sample provided by Microsoft in [GitHub](https://github.com/Azure-Samples/power-bi-embedded-integrate-report-into-web-app/) or use PowerBI-Cli.
- Use [App token](https://docs.microsoft.com/en-us/azure/power-bi-embedded/power-bi-embedded-app-token-flow) for embedding reports in the application. Set an expiration time with every App token.

## Conclusion ##

Microsoft and FalconBrick team worked together to conclude a successful implementation of the PowerBI Embedded solution. The FalconBrick team had their reporting solution running on PowerBI online and are now leveraging Azure SQL Database and Power BI embedded (PaaS Services) for their reporting
requirements.

The key benefit FalconBrick derived from this engagement is providing reporting capabilities as part of their application. Also, they can now leverage historical data to provide more insights to their customer. 

Apart from that key benefit, the Power BI Embedded solution offers the following benefits to various stakeholders and developers:

- Ease of report design and more visualization control with Power BI.
- Detailed analysis of various aspects.
- Ability to integrate dashboards across platforms (web, mobile, and so on) in the future.

### Quote from the customer 

Gautam Mayur, Co-Founder, FalconBrick
It was wonderful working with the Microsoft Team on the Power BI Embedded Solution. We were using PowerBI but did not know the correct way to implement/rollout this across multiple customers. PBIE works fabulously for us. Without Microsoft, it would have been a trial-error method and would have
taken a lot of time and effort to do it on our own. Kudos to Sudhir and team to help us in ensuring that our reporting architecture can be scaled easily.