---
layout: post
title: "Creating an interactive dashboard for the LogiCloud supply-chain platform"
author: "Gandhali Samant"
author-link: "https://twitter.com/s_gandhali"
#author-image: "{{ site.baseurl }}/images/authors/photo.jpg"
date: 2017-04-27
categories: [Power BI Embedded]
color: "blue"
#image: "{{ site.baseurl }}/images/imagename.png" #should be ~350px tall
excerpt: LogiCloud and Microsoft worked together to bring an interactive dashboard to its supply-chain collaboration platform with the use of Power BI Embedded. 
language: English
verticals:  [Transportation & Logistics]
geolocation: [India]
---

The biggest problem with managing multiple logistics service providers is the effort of piecing together a clear picture of the operations. It becomes difficult to extract relevant information from the huge amount of data coming from across varied partners. The LogiCloud platform helps shippers and third-party logistics (3PL) companies to track and predict deliveries of shipments across hundreds of partners and modes of transport. 

LogiCloud aggregates streams from multiple logistics service providers, GPS devices, flight information, and even mobile applications used by field teams. Shippers thus get a single window of visibility and prediction across their supply chains. From automatically checking and alerting users on status updates to providing advanced analytics and predictions on all operations, LogiCloud creates a seamless picture across the entire supply chain.

LogiCloud teamed up with Microsoft in a hackfest to bring an interactive dashboard to its supply-chain collaboration platform.

**Key technologies used:** 

- Web Apps feature of Azure App Service 
- Power BI Embedded 
- Azure SQL Database 
- Azure Event Hubs

**The core team:**

- Apurva Mankad – CEO, LogiCloud
- Harshad Sanghani – Azure Solution Architect, LogiCloud
- Chaitanya Tembe – Power BI Architect, LogiCloud
- Rahul Malkani – Solution Design Head, LogiCloud 
- [Sagar Joshi](https://twitter.com/sagarjms) – Senior Technical Evangelist, Microsoft
- [Gandhali Samant](https://twitter.com/s_gandhali) – Senior Technical Evangelist, Microsoft
- Surbhi Jain – Audience Marketing, Microsoft

## Customer profile ##

[LogiCloud](http://www.logicloud.in/) is offered by ECFY Consulting Pvt. Ltd. (ECPL). ECPL is India’s leading player for logistics technology solutions, with more than 85 customers in nine countries. ECPL provides cloud-based solutions for transportation, fleet, and warehouse management. Leveraging its deep domain expertise, ECPL has launched a cloud-born platform “LogiCloud” to connect stakeholders in supply chains from shippers to transporters to banks. ECPL is based in Mumbai, India, with a team of 100-plus professionals.

## Problem statement ##

Logistics operations generate large amounts of data such as bookings, route movements, tracking, POD images, flight movements, and fleet maintenance. Thus, analyzing such data and slicing and dicing the same is crucial to better decision making. 

The LogiCloud team wanted to provide visibility into meaningful data/analysis to the stakeholders. They also wanted to distribute these reports to many users without incurring individual license costs. The access to data needed to be tenant-based. Also, many of these end users might not have the skill sets to create complex reports and will only consume information with basic slice and dice and filtering.

## Solution, steps, and delivery ##

**Step 1: Solution envisioning**

The high-level architecture diagram for the LogiCloud solution is shown here. 

*High-level architecture*

![High level Architecture]({{ site.baseurl }}/images/LogiCloud/LogiCloud1.png)


As part of this hackfest, we concentrated on creating the dashboard experience using Power BI Embedded. Because the LogiCloud application uses Azure SQL Database, which supports DirectQuery from Power BI Embedded, we did not need to create a data pipeline. The following steps were undertaken:

- Connect to SQL Database using DirectQuery from the Power BI Desktop application.
- Create the reports using Power BI Desktop and upload them to the Azure Power BI workspace.
- Generate an authentication token from the web application using the Power BI SDK for .NET and embed the report in the web application using an HTML container and JavaScript.
- The SQL Database is a multitenant database, so for every report the Tenant ID will be sent as a filter value so that any user from a particular customer will have access to data only for that customer (tenant).

**Step 2: Setting up report data**

Since the LogiCloud application uses Azure SQL Database to store its data, Power BI Embedded DirectQuery from SQL Database was used to set up report data.

*DirectQuery from Power BI Embedded to SQL Server*

![Diagram of DirectQuery flow]({{ site.baseurl }}/images/LogiCloud/LogiCloud2.png)


**Step 3: Embedding reports**

The LogiCloud team used Power BI Desktop to create the report using DirectQuery on SQL Database, which was hosting the reporting data. Next, they embedded reports on a web application. With this solution, LogiCloud clients are now able to click the Power BI Dashboard menu and get a list of reports accessible specifically to their departments. With a click, each report is displayed in an HTML container.

Embedding Power BI Dashboard using Microsoft.PowerBI.AspNet.Mvc.Html:

View:

        <div id="divReport">
            @Html.PowerBIReportFor(m => m.Report, new { id = "pbi-report", style = "height:92vh",
                                powerbi_access_token = Model.AccessToken })
        </div>


JavaScript (initialize report):

        var filters1 = [];
        $(function () {
            var reportConfig = {
                settings: {
                    filterPaneEnabled: false,
                    navContentPaneEnabled: false
                }
            };
            
        var filters1 = [];
        reportElement = document.getElementById('pbi-report');
            pageName = document.getElementById('page-name');
            report = powerbi.embed(reportElement, reportConfig); 
        });


JavaScript (report events):

        var pages = []; var pageIndex = 0; var currentPage = null;

        $(report).on('loaded', function () {
            report.getPages().then(function (reportPages) {
                pages = reportPages;
                });
            });

        $(report).on('pageChanged', function (e) {
            currentPage = e.detail.newPage;
            pageName.innerText = e.detail.newPage.displayName;

            if (pages.length === 0) { return; }
            pageIndex = pages.findIndex(function (el) {
                return el.name === e.detail.newPage.name;
            });
            }); 

        $('#pbi-prev-page').on('click', function () { changePage(-1); });
        $('#pbi-next-page').on('click', function () { changePage(1); });

        $('#setting-shownav').on('change', function (e) { updateSetting(e, 'navContentPaneEnabled'); });
        $('#setting-showfilterpane').on('change', function (e) { updateSetting(e, 'filterPaneEnabled'); });
        $('#filter-add').on('click', function () { addFilter(); });

        $('#filter-clear,#clearFilter').on('click', function () {
            report.removeFilters();
            filters1 = [];
            report.setFilters(filters1)
            .then(function (result) { [Do Something] })
            .catch(function (errors) { [Do Something] });
        });


JavaScript (add filter and other functions):

        function changePage(direction) {
            var nextPageIndex = pageIndex + direction;
            if (nextPageIndex < 0) nextPageIndex = pages.length - 1;
            if (nextPageIndex >= pages.length) nextPageIndex = 0;
            pages[nextPageIndex].setActive();
        }
        
        function addFilter() {
            var target = "report";
            var table = "[TableName]";
            var fDate = new Date(fromdate).toISOString();
            var tDate = new Date(todate).toISOString();
        
            arrContent = {
                "$schema": "http://powerbi.com/product/schema#advanced",
                "target": {
                    "table": table,
                    "column": "[DateFieldName]"
                },
                "logicalOperator": "And",
                "conditions": [ {
                    "operator": "GreaterThanOrEqual",
                    "value": fDate
                }, {
                    "operator": "LessThanOrEqual",
                    "value": tDate
                } ]
            }
            filters1.push(arrContent)
        }

        function clearFilters(report) {
            report.removeFilters();
            filters1 = [];
            companyFilter();
        }

Controller:

        public ActionResult Dashboard()
        {
            Microsoft.PowerBI.Api.V1.Models.Report objReport = new Microsoft.PowerBI.Api.V1.Models.Report();
            using (var client = this.CreatePowerBIClient()) {
                var reportsResponse = client.Reports.GetReports(this.workspaceCollection, this.workspaceId);
                reportsList = new BaseViewModel.ReportsViewModel {
                    Reports = reportsResponse.Value.ToList()
                };
            }
            foreach (var item in reportsList.Reports) {
                if (item.Name.Contains("XXXXX")) {
                    objReport.Id = item.Id;
                    objReport.EmbedUrl = item.EmbedUrl;
                    objReport.Name = item.Name;
                    objReport.WebUrl = item.WebUrl;
                }
            }
            // bind the report
            if (objReport != null) {
            var embedToken = PowerBIToken.CreateReportEmbedToken(this.workspaceCollection,
                                this.workspaceId, objReport.Id);
            objReport.EmbedUrl = objReport.EmbedUrl 
            + "&$filter=[TableName]/[ColumnName]%20eq%20'" + [FilterValue] + "'";
            var viewModel = new BaseViewModel {
                Report = objReport,
                AccessToken = embedToken.Generate(this.accessKey), 
            };
            return View("~/Views/Dashboard.cshtml", viewModel);
            }
            else {
            return View("~/Views/Dashboard.cshtml", null);
            }
        }

Here are some reports that are currently available:

- Vehicle availability analysis

  ![Vehicle Availability Analysis]({{ site.baseurl }}/images/LogiCloud/LogiCloud3.png)
  

- Plant-wise vehicle on map – slicing and dicing 

  ![Plant Wise Vehicle on Map- slicing and dicing]({{ site.baseurl }}/images/LogiCloud/LogiCloud4.png)


- Text search

  ![Text Search]({{ site.baseurl }}/images/LogiCloud/LogiCloud5.png)


- Order delivery analysis 

  ![Employee MIS report]({{ site.baseurl }}/images/LogiCloud/LogiCloud6.png)


- Orders with delivery turnaround time (TAT) of more than 6 days 

  ![Employee attrition heatmap]({{ site.baseurl }}/images/LogiCloud/LogiCloud7.png)
  

- Orders with selected biker 

  ![Employee attrition heatmap]({{ site.baseurl }}/images/LogiCloud/LogiCloud8.png)


*Photos from the hackfest*

![Montage of four photos from the hackfest]({{ site.baseurl }}/images/LogiCloud/LogiCloud9.png)


## Opportunities going forward ##

We will continue to work with the ECPL team on the following requirements:

- The ECPL team has multiple other applications in the logistics domain where they will use Power BI Embedded to create the interactive reports.
- Some of the applications are using SQL Database on a virtual machine. When the integration of SQL Database on a virtual machine becomes available, they will integrate those with Power BI Embedded as well.
- Build your own report. ECPL intends to offer Power BI as a tool to help tech-savvy customers build their own report and combine data from non-ECPL systems. 

## Conclusion ##

The LogiCloud team achieved their goal of embedding a Power BI report into their application. The Power BI Embedded integration with the LogiCloud application is now live. The ECPL team had an opportunity to work with the Microsoft team to achieve this during the two-day hackfest.

>“Power BI Embedded is a natural analytics tool for Azure-born cloud applications such as LogiCloud. (Power BI Embedded) helps to quickly deploy new analytics and helps end users slice and dice their data. (Power BI Embedded) is an essential tool to make sense of the jungle of data eaten up by LogiCloud.”
>
>— Apurva Mankad, CEO, LogiCloud
