---
layout: post
title:  "Implementing Power BI Embedded into its school management app helps QiankunCloud's customers monitor their sales and marketing contents"
author: "Shijun Liu"
date: 2017-06-12
categories: [Power BI Embedded]
color: "blue"
image: "images/2017-06-17-QiankunCloud-PBIE/Hackfest.jpg"
excerpt: Working together with Microsoft, QiankunCloud integrated Power BI Embedded into its SaaS school managment solution, to give customers full information about schools' sales and marketing.
verticals: [Retail]
language: [English]
geolocation: [China]
---

QiankunCloud is a cloud based school management SaaS provider. They provide solutions for schools, especially training organizations, to manage their sales and marketing and daily operation process. They found that with Power BI Embedded, their solution can present richer visualization for their customers with less development efforts, comparing with traditional frontend. So they finally integrated the Power BI report in their management website and provide it to customers. 

## Key technologies used ##

* [Power BI Embedded](https://azure.microsoft.com/en-us/services/power-bi-embedded/)
    * [Power BI Embedded .Net SDK](https://github.com/Azure-Samples/power-bi-embedded-integrate-report-into-web-app/)
* [Power BI Desktop](https://powerbi.microsoft.com/en-us/desktop/)
* Azure SQL Database ([Direct Query connection to Power BI Embedded](https://powerbi.microsoft.com/en-us/documentation/powerbi-azure-sql-database-with-direct-connect/))

## Core project team ##

* __Microsoft__
    * Shijun Liu – Technical Evangelist
    * Bo Wang – Technical Evangelist
    * Yan Zhang – Audience Evangelism Manager
* __QiankunCloud__
    * Jiannian Hou – CEO of QiankunCloud
    * Wenjun Hao – Developer
    * Yinan Kong – Developer

## Customer profile ##

[QianKun Cloud](http://www.qiankunyun.com/) (Beijing) Information & Technology Co, Ltd. was founded by Qiankun Technology in 2016. The core team has 10 years experiences in software development and has a deep cooperation with Shanghai Volkswagen and China mobile.

Their product Xlingtong is a cloud based education SaaS product. It provides full process management solution for schools and training organizations, including students recruitment, marketing, consultant, sales, courses administration and communication app between teachers and students.    

## Problem statement 

As a startup, they'll need much time to develop the BI report, with not enough developers.With Power BI Embedded, their solution can present richer visualization with less development efforts, comparing with traditional frontend. For example, they can quickly design and integrate a Power BI report to show school administrators monly, quartly and yearly revenue reports, with in-report rich interaction and filter. So they decided to use Power BI Embedded for sales report and consultant intent statistics report. 

## Solution, steps, and delivery 

### Project target
The main aim of this project was to design and integrate two reports in Xlingtong products. One report is sales report, with customers' quantity and revenue, each sales' competition, total revenue' composition, and so on. The other report is consultant report, with customers' intention, and consultant stage by each branch. These two reports are designed for school administrators. They can view the overall status quickly with rich and easy interaction.

We reached this target through a two-day hackfest in Beijing from May 22nd to May 23rd, 2017.

![Hackfest photo]({{ site.baseurl }}/images/2017-06-17-QiankunCloud-PBIE/Hackfest.jpg)

### Overall architecture

As Xlingtong is a .Net based product totally hosted on Azure, as below architecture, it was easy for QiankunCloud to use Power BI Embedded with direct query to Azure SQL database.

![Architecture of Solution]({{ site.baseurl }}/images/2017-06-17-QiankunCloud-PBIE/Architecture.PNG)

As shown on above picture, Xlingtong 's backend server is hosted in Azure Virtual Machine, and its frontend is hosted on Azure Web App. All the data are stored in Azure SQL Database. So the report is integrated in Azure Web App with .Net SDK and use direct query to impletement real-time data refreshing.

### Code snapshot 

* Azure China endpoint:

Azure China is seperated with other Azure, and QiankunCloud was customers of Azure China. So we had to update the Power BI Embedded endpoint to Azure China specific.

``` Endpoint
<!-- The Power BI API Endpoint -->
<add key="powerBiApiEndpoint" value="https://api.powerbi.cn" />
<!-- The Azure Resource Manager API Endpoint-->
<add key="azureApiEndpoint" value="https://management.chinacloudapi.cn" />
```

* Report importing and dataset management

QiankunCloud just used the open source Power BI Embedded sample importing code to create the workspace, upload report and set database connection string.

* Get report from Power BI Embedded:
```.Net
    public class PowerBiController : Controller
    {

        private readonly string workspaceCollection;
        private readonly string workspaceId;
        private readonly string accessKey;
        private readonly string apiUrl;

        public PowerBiController()
        {
            this.workspaceCollection = ConfigurationManager.AppSettings["powerbi:WorkspaceCollection"];
            this.workspaceId = ConfigurationManager.AppSettings["powerbi:WorkspaceId"];
            this.accessKey = ConfigurationManager.AppSettings["powerbi:AccessKey"];
            this.apiUrl = ConfigurationManager.AppSettings["powerbi:ApiUrl"];
        }

        // GET: Platform/PowerBi
        public ActionResult Index()
        {
            using (var client = this.CreatePowerBIClient())
            {
                var reportsResponse = client.Reports.GetReports(this.workspaceCollection, this.workspaceId);

                var viewModel = new ReportsView
                {
                    Reports = reportsResponse.Value.ToList()
                };

                return View(viewModel);
            }
        }

        [ChildActionOnly]
        public ActionResult Reports()
        {
            using (var client = this.CreatePowerBIClient())
            {
                var reportsResponse = client.Reports.GetReports(this.workspaceCollection, this.workspaceId);

                var viewModel = new ReportsView
                {
                    Reports = reportsResponse.Value.ToList()
                };

                return PartialView(viewModel);
            }
        }

        public async Task<ActionResult> Report(string reportId)
        {
            using (var client = this.CreatePowerBIClient())
            {
                var reportsResponse = await client.Reports.GetReportsAsync(this.workspaceCollection, this.workspaceId);
                var report = reportsResponse.Value.FirstOrDefault(r => r.Id == reportId);
                var embedToken = PowerBIToken.CreateReportEmbedToken(this.workspaceCollection, this.workspaceId, report.Id);

                var viewModel = new ReportView
                {
                    Report = report,
                    AccessToken = embedToken.Generate(this.accessKey)
                };

                return View(viewModel);
            }
        }

        private IPowerBIClient CreatePowerBIClient()
        {
            var credentials = new TokenCredentials(accessKey, "AppKey");
            var client = new PowerBIClient(credentials)
            {
                BaseUri = new Uri(apiUrl)
            };

            return client;
        }
    }
```
* Integrate report in web page: Index.cshtml

```javascript
<body>
    <div class="panel-body">
        <ul class="nav navbar-nav">
            @foreach (var report in Model.Reports)
            {
                var reportClass = Request.QueryString["reportId"] == report.Id ? "active" : "";
                <li class="@reportClass">
                    @Html.PlatformActionLink(report.Name, "Report", new { reportId = report.Id })
                </li>
            }
        </ul>
    </div>
</body>
```

* Add the filter in Javascript code: Report.cshtml
```Javascript
<script>
        $(function () {
            // For complete list of embed configuration see the following wiki page
            // https://github.com/Microsoft/PowerBI-JavaScript/wiki/Embed-Configuration-Details
            var reportConfig = {
                settings: {
                    filterPaneEnabled: false
                }
            };
            var reportElement = document.getElementById('pbi-report');
            var pageName = document.getElementById('page-name');

            // Embed report
            // https://microsoft.github.io/PowerBI-JavaScript/classes/_src_service_.service.html#embed
            var report = powerbi.embed(reportElement, reportConfig);

            var pages = [];
            var pageIndex = 0;
            var currentPage = null;

            // For a complete guide to event handling see the following wiki page
            // https://github.com/Microsoft/PowerBI-JavaScript/wiki/Handling-Events
            report.on('loaded',
                function () {
                    // Get report pages
                    // https://microsoft.github.io/PowerBI-JavaScript/classes/_src_report_.report.html#getpages
                    report.getPages()
                        .then(function (reportPages) {
                            pages = reportPages;
                        });
                });

            // Handling pageChanged event
            // https://microsoft.github.io/PowerBI-JavaScript/classes/_src_report_.report.html#on
            report.on('pageChanged',
                function (e) {
                    currentPage = e.detail.newPage;
                    pageName.innerText = e.detail.newPage.displayName;

                    if (pages.length === 0) {
                        return;
                    }

                    pageIndex = pages.findIndex(function (el) {
                        return el.name === e.detail.newPage.name;
                    });
                });
                ......
```
### Final delivery

Finally, the two reports were integrated into Xlingtong product, as below. So when ad

![Sales Page]({{ site.baseurl }}/images/2017-06-17-QiankunCloud-PBIE/Consultant.PNG)


![Consultant Page]({{ site.baseurl }}/images/2017-06-17-QiankunCloud-PBIE/Sales.PNG)


### Technical details we solved 

* We help them implement the conditional conjunctive merge in PBIX using Q language in Advanced Editor of Power BI desktop.

* We validated Azure China's Power BI Embedded development endpoint.

* We solved the problem of unabling to connect to Azure SQL Database, when embedding the report in the website, with updating database connection string function of Power BI Embedded .Net SDK. 

## Conclusion

Microsoft and QiankunCLoud worked together to implement the Power BI reports embedded in its product Xlingtong. During the development stage, we help solve several technical problems QiankunCloud came up with. CEO of QiankunCloud was satisfied with the two-day hackfest delivery, and recognized Power BI Embedded as a quick and richly interactive BI tool. They'll go on integrating more reports in their product and provide it to school customers.

