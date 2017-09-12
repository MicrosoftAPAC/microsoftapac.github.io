---
layout: post
title:  "How Azure Machine Learning and Azure Functions help Hogangnono to improve its real estate recommendation"
author: "Dae Woo Kim, Hyewon Ryu"
#author-link: "Add author's Twitter URL here"
#author-image: "{{ site.baseurl }}/images/authors/photo.jpg"
date:   2017-03-07
categories: [Azure Machine Learning, Azure Functions]
color: "blue"
image: "images/2017-03-07-hogangnono/hackfest02.png" #should be ~350px tall
excerpt: Hogangnono, a top real estate startup, and Microsoft improve real estate recommendations to captivate more app users.
language: [English]
geolocation: [Korea]
verticals: [Facility Management]
---

Key technologies used  
- Azure Machine Learning - Matchbox : Implementation of real estate item recommendation service using Machine Learning algorithm  
- Azure Functions : For scheduler service purpose, creating a machine learning model and copying log data from [AWS(Amazon Web Service)'s S3](https://aws.amazon.com/s3) with server-less method  
- Azure Storage Blob, Table : Blob data storage for user log to be analyzed and Table Storage for loading real-time user's recommendation log  
- Azure HDInsight : Analyzing massive log data preprocessing and generate statistical data from user log data  

As a market leader in real estate app services, Hogangnono offers customized real estate services to more than 300,000 unique users. We conducted a hackfest to create customized recommendation services to provide more useful information to our users and to the use of our services.  

### Key technologies used  
- [Microsoft Azure Machine Learning](https://azure.microsoft.com/en-us/services/machine-learning/)  
- [Azure Functions](https://azure.microsoft.com/en-us/services/functions/)  
- [Azure Blob storage](https://azure.microsoft.com/en-us/services/storage/blobs/)  
- [Azure HDInsight](https://azure.microsoft.com/en-us/services/hdinsight/)  

### Core team 
- Ohgyun Ahn – Technical Director, Hogangnono  
- Kwang Wook Kim – Manager, DS-eTrade  
- Goen Park – Assistant Manager, DS-eTrade  
- Ja Yeon Koo – Researcher, DS-eTrade  
- Dae Woo Kim – Senior Technology Evangelist, Microsoft  
- Minsoo Bae – Audience Evangelism Manager, Microsoft   
- Hyewon Ryu – Audience Evangelism Manager, Microsoft   
- Eunji Kim – Technology Evangelist, Microsoft   

## Customer profile
![Hogangnono logo](/images/2017-03-07-hogangnono/logo.png)  
[Hogangnono](https://hogangnono.com/) is a market-leading startup in real estate app services located in Pangyo, Gyeonggi-do, Korea. Hogangnono provides customized real estate services to more than 300,000 unique users. Most of the information provided by Hogangnono utilizes the public API data provided by the government, including the Ministry of Land Transport and Transportation, the Ministry of Health and Welfare, and the Ministry of Education. Although the service was operated by AWS, Hogangnono reviewed services for optimal recommendation services. Also, Hogangnono is a member of [BizSpark Plus](https://bizspark.microsoft.com/About/Plus), the Microsoft global startup network program. All members are from Naver and Kakao, Korea's largest portals.  

## Problem statement
Since its start of service, Hogangnono has been continuously growing and providing users with optimized real estate information. Understanding users action patterns and providing accurate recommendations will drive service growth. The biggest problem with start-up is that you have to develop quickly with fewer resources and apply it to service quickly.  
When the user inquires about the apartment, there was always a demand to see the neighboring apartment. For this purpose, it was necessary to provide customized real estate services using machine learning based recommendation service. However, there was a lot of data and it was not easy to develop and implement the "recommendation service" which is essential for business. In order to attract more and more users, to lower churn rates and maximize profit through services ultimately, recommendation service based on machine learning was important. To solve problem, Hogangnono researched various Machine Learning services and frameworks and chose Microsoft Machine Learning. Because, Azure Machine Learning Matchbox was easy to use, easy to implement, and produce very good quality of recommendations in a short amount of time.  

## Solution and steps
There was a need to provide enhanced real-time and batch-based machine learning recommendation services for users, such as similar real estate items and user-recommended items. To implement, Microsoft recommended using the Azure Machine Learning based "Matchbox" algorithm to implement the massive Recommendation API call processing, and recommendation using R "Arules", Python "Apriori" Association Rule.  
These technologies are all techniques commonly used to implement recommendation services, but there are some differences. The Machine Learning Matchbox you can adjust the structure or scoring of data in various patterns to control many options for getting the recommendations you want in model workflow development.  
Regading to the actual data import from AWS, hackfest team proposed an "Azure Functions" to automate the entire batch-based analysis process with "server-less" architecture.  

### Hogangnono service architecture diagram  
![Hogangnono Architecture]({{site.baseurl}}/images/2017-03-07-hogangnono/hogangnono-architecture_2.png)  
With the Hogangnono, DS-eTrade and Microsoft hackfest teams implemented a cloud-based architecture for the Azure Machine Learning Matchbox recommendation services together and constructed a real-time analytics and batch-based analytics architecture.  

### Cold path  
The Cold path process is an analysis method for periodically recommending a service through batch analysis process and displaying it when the user requests it after preloading it in the database.  
- Batch analysis data is existed in AWS S3 and it uploads blob object from S3 bucket to Azure Blob Storage using Azure Functions.  
- The log data uploaded to the Azure Functions is available for statistics report immediately, and it is assumed that Hadoop - HDInsight is used for simple big data preprocessing with Hive to extract necessary statistical information. After the Hive processing, data will be stored in the Azure Blob Storage.  
- If HDInsight uploads the file to the Blob, the Azure Functions takes the uploaded file automatically using the Function App "blob trigger" and uploads it to the location requested by each recommendation service or processes the result of the prediction analysis.  
- When uploading or predicting is completed from recommendation service, Azure function app inserts the completion result, User-to-Items Recommendation, to [AWS RDS(Relational Database Service)](https://aws.amazon.com/rds/) of current operating environment, and then completes the whole operation.  

Since its inception, Hogangnono has been continuously growing and providing users with optimized real estate information. Understanding users' action patterns and providing accurate recommendations drives service growth. The biggest problem with a startup is that you have to develop quickly with fewer resources and apply them to services quickly.  

When a user inquires about an apartment, there is always a demand to see the neighboring apartments. For this purpose, it was necessary to provide customized real estate recommendation services using artificial intelligence (AI). However, there was a lot of data and it was not easy to develop and implement this recommendation service. To attract more users, lower churn rates, and ultimately maximize profits, having a recommendation service based on AI was important.  

To solve the problem, Hogangnono researched various machine learning services and frameworks and chose Azure Machine Learning. Azure Machine Learning Matchbox was able to produce very good quality recommendations in a short amount of time, easy to use and implement.  

## Solution and steps
Hogangnono needed to provide enhanced real-time and batch-based services for users, such as similar real estate items and user-recommended items. To do this, Microsoft recommended using the Azure Machine Learning-based "Matchbox" algorithm to implement the massive Recommendations call processing, along with the R *arules* association rule and the Python Apriori algorithm.  

These technologies are all techniques commonly used to implement recommendation services, but there are some differences. The Machine Learning Matchbox provides the same service, but in model workflow development, you can adjust the structure or scoring of data in various patterns to control many options for getting the recommendations you want.  

Regarding the actual data import from AWS, the hackfest team proposed using Azure Functions to automate the entire batch-based analysis process with "server-less" architecture.  

### Hogangnono service architecture diagram  
![Hogangnono architecture](/images/2017-03-07-hogangnono/hogangnono-architecture_2.png)  
Working together, the Hogangnono, DS-eTrade, and Microsoft hackfest teams implemented a cloud-based architecture for Machine Learning Matchbox recommendation services, and constructed a real-time analytics and batch-based analytics architecture.  

### Cold path  
The Cold path process is an analysis method for periodically recommending a service through a batch analysis process and displaying it when the user requests it after preloading it in the database.  
- Batch analysis data exists in [Amazon Simple Storage Service (Amazon S3)](https://aws.amazon.com/s3/) and uploads blob objects from the Amazon S3 bucket to Azure Blob storage by using Azure Functions.  
- The log data uploaded to Azure Functions is available for statistics reports immediately, and it is assumed that Azure HDInsight (a fully-managed cloud Apache Hadoop offering) is used for simple big data preprocessing with Hive to extract the necessary statistical information. After Hive processing, data will be stored in Azure Blob storage.  
- If HDInsight uploads the file to Blob storage, Azure Functions takes the uploaded file automatically by using the Azure Functions app "blob trigger" and either uploads it to the location requested by each recommendation service, or processes the result of the prediction analysis.  
- When uploading or predicting from the recommendation service is completed, the Azure Functions app inserts the completion result, User-to-Items Recommendation, to the [Amazon Relational Database Service (Amazon RDS)](https://aws.amazon.com/rds/) in the current operating environment, and then completes the entire operation.  

### Hot path, real-time prediction (recommendation) request processing  
Hot path is an implementation of the way to process user requests in real time. Get recommendations in real time from the models created in the recommendation service.  
- Assumed that the prediction analysis result is already required for real-time prediction, and the result is stored in the recommended services through the earlier batch analysis.  
- The node.js running in [Amazon Elastic Compute Cloud (Amazon EC2)](https://aws.amazon.com/ec2/) invokes the recommendation service by using the Restful API method, receives the recommendation items, stores them in [Azure Table Storage](https://azure.microsoft.com/en-us/services/storage/tables/) for logging purposes, and provides the recommendation result to the user.  
- The node.js can be reused to store the log as a recommended item from the recommendation services, and to correct the accuracy of the recommendation result.  

### Load data from Amazon S3 into Azure Blob storage
Currently, the services of Hogangnono are being hosted on AWS. To implement the improved AI-based analysis service, we wanted to perform the analysis without affecting the existing service at all. To accomplish this, we needed to periodically import log data from Amazon S3 into [Azure Blob storage](https://docs.microsoft.com/en-us/azure/storage/).  

You can perform scheduling tasks in Azure by using [Azure Scheduler](https://docs.microsoft.com/en-us/azure/scheduler/), [WebJobs](https://docs.microsoft.com/en-us/azure/app-service-web/websites-webjobs-resources), and [Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/). During the hackfest, we reviewed the advantages and disadvantages of these schedulers and their main services. Azure Functions had the best options to automatically handle the server-less coding, blob triggers, timer triggers for batch analysis, and webhooks.  

In particular, the current data in Hogangnono was being loaded in Amazon S3 every hour. We implemented codes to take data from Amazon S3 and upload it to Azure Blob storage at one hour intervals using the Azure function app timer trigger.  

  
The Azure function app provides a cron style timer and stores it in function.json in the form:  

```
{
  "bindings": [
    {
      "name": "myTimer",
      "type": "timerTrigger",
      "direction": "in",
      "schedule": "0 */5 * * * *"
    }
  ],
  "disabled": false
}
```

Hogangnono develops and operates services using node.js. To configure an additional node package to use Amazon S3, which is not included by default in Azure Functions, add it in "Kudu" console and configure it by executing the following `npm install` command.  

package.json file  


```
{
    "dependencies": {
        "aws-sdk": ">= 2.0.9",
        "node-uuid": ">= 1.4.1"
    }
}
```
[Azure Functions - Node Version & Package Management](https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference-node#node-version--package-management)  

The process of migrating from Amazon S3 to Azure Functions with node.js is shown in the following repo.  

[Hackfest Azure function app code repo](https://github.com/hnn-project/azure-function)  

You can transfer blobs from Amazon S3 to Azure Blob storage.  

### HDInsight - Preprocessing log data using Hadoop big data  
For simple data type conversion, the JSON type log data loaded in basic Amazon S3 can be easily converted into CSV type after deserializing in an Azure function app. However, the log size is too large to preprocess and to become difficult log data type conversion, and it may be necessary to obtain insight from the log data for management and monitoring. To do this, we briefly performed the process of analyzing data using HDInsight – Hadoop during the Hackfest.  

[Hackfest HDInsight repo link](https://github.com/hnn-project/azure-content)  

- Deploying HDInsight and understand how Hadoop services work  
- Performing a Hive query on the management portal by using Ambari  
- Assuming that the entire workflow is done via the Azure Data Factory (Did not review on hackfest)  
- CSV file data is about 10,000 rows  
- Assuming that there are about 30 real estate areas, it is assumed that the analysis of how many users stay for the longest  

Various other Hadoop analysis scenarios can be derived  
- Changes in the volume of inquiries of major real estate properties  
- Grouped property information by feature  

Scenarios that utilize various logs can be used to store and analyze by Hadoop - Big data  

![Hogangnono hakcfest](/images/2017-03-07-hogangnono/hackfest01.png)  

## Recommendation service  
The recommendation service is a core component of Hackfest project and has been assessed in various forms during Hackfest and has invested a lot of time. We have prepared the following three recommended techniques in advance and aimed at achieving the best recommendation service that we can perform and compare for the actual hackfest period.  

- Azure Machine Learning matchbox  
- R / arules - Association rules  
- Python / Apriori  

### Azure Machine Learning matchbox  
The matchbox algorithm using Azure Machine Learning's recommendation module is applicable to recommendation services and is used in various social media sites, most types of e-commerce sites, and sponsor search results of search engines.  
In particular, Azure Machine Learning provides a PaaS-based service which allows developers to reliably provide recommendation services without consideration of any infrastructure. In addition, it can be easily distributed recommendation models using the Restful API, and possible to execute batch training by Azure function app.  


To provide instant item recommendations and user recommendations for real estate items, Hogangnono was already considering the Azure Machine Learning Matchbox and needed a way to improve the accuracy of recommendations. During the hackfest period, we were able to apply the matchbox module together with Microsoft's machine learning partner, DS-eTrade.  

![Hogangnono Azure Machine Learning Matchbox](/images/2017-03-07-hogangnono/hogangnono-matchbox01.png)  

Matchbox is basically a system that recommends items with high similarity based on the items the user has. The degree of similarity is derived based on the score (point) per transaction in which the user purchased the item. More the purchased information, the higher the accuracy of recommendation results.  

![Hogangnono Azure Machine Learning Matchbox](/images/2017-03-07-hogangnono/hogangnono-matchbox02.png)  

#### Matchbox data
The Matchbox algorithm should basically provide the following three data:  
- Item Information  
- User Information  
- User-Item Score Information  

This information will be provided for recommendations.  

![Hogangnono Azure Machine Learning Matchbox](/images/2017-03-07-hogangnono/hogangnono-matchbox03.png)  

User to Item recommendation results are generally provided as recommendations.  

![Hogangnono Azure Machine Learning Matchbox](/images/2017-03-07-hogangnono/hogangnono-matchbox04.png)  

During the hackfest, we built the model in this form for matchbox implementation. Of course, we did not include the basic preprocessing process (data wrangling) for the data, and we used the example data to protect the data of the Hogangnono.  

#### Matchbox scoring
Scoring is very important for accuracy in Matchbox. In other words, we need to determine which information should be weighted to increase similarity and reflection. For example, if a recommendation is made for a real estate service business, an additional variety of features are created and used for this score information. Instead of simply using customer information,  
- Visits recently  
- Added favorite items  
- Actions taken per visit (view apartment size information, view traffic information)  
  
It is important to use this variety of information to create a score.  

In this case of scoring is done by using RFM in general business.  
R- The most recent purchase date (convert number - from today to last purchase date)  
F- How often purchased, frequency of purchase figures  
M- How much money did you spend  
[RFM - customer value](https://en.wikipedia.org/wiki/RFM_(customer_value))  

For example, did buy a lot when you bought one? Have you made multiple purchases but only purchased a small amount? And so on. He would come back often 6 months ago, but if he move out and not came back, it will be an indicator.  
This is generally used as RFM. - It can be seen as matching information of each product and customer.  

It is usually used in the logistics business, but it will be able to collect similar information in real estate information, for example, information on the distance between properties (such as the use of property address information).  

In addition, it is possible to divide the user into 10 steps of group for each user, and recommend for differentiated marketing or rating up, instead of simply classification or enumeration. For example, step by step, you can pick a target customer to recommendation, send a featured item to a push notification, etc., and evaluate the accuracy of the recommendation as a result. You can get more accurate results because you are not sending SMS or push message at random.  

#### Feature control
While RFM is a common practice, it can be difficult to determine which features to weight among the hundreds of different and complex features. In this case, PCA analysis techniques can be considered.  

Principal component analysis - scoring = PCA method = where weights are given here  
[Principal component analysis](https://en.wikipedia.org/wiki/Principal_component_analysis)  

PCA is a technique to reduce features. You do not need 200 features. If you turn the PCA, it can be reduced to about five.  
The weight determines the number by executing the PCA. Try to analyze regression coefficient or correlation coefficient and decide whether it is significant or not. This weight is used for scoring such as rating.  

[Example code that uses PCA analysis in R and Python](https://www.analyticsvidhya.com/blog/2016/03/practical-guide-principal-component-analysis-python/)  

It should be taken care of avoiding the scoring not to put on one side too much. Since only the recommendations of high scores are shown, it becomes difficult to recommend correctly. It is necessary to perform filtering because there is a problem that it is mainly displayed in capital city and big city province, which are generally searched and viewed. For instance, assume that I live near the end of the remote country, but I can not see the surrounding apartments I'm interested in nearby. I just want to see the my area village of the real estate items. You can make the distance information high scoring.  

#### Matchbox model implementation
The matchbox models we have reviewed to implement in hackfest are below. It is easy to apply due to the good tutorial and the good data set. In case of Hogangnono, has used several interpolation methods to upload actual data to the matchbox, and continue to apply the above consideration issues and additional data collection know-how learned during the hackfest.  

[Matchbox Tutorial](https://gallery.cortanaintelligence.com/Tutorial/8-Recommendation-System-1)  

[Movie matchbox](https://gallery.cortanaintelligence.com/Experiment/Recommender-Movie-recommendation-3)  

[Restaurant rating matchbox](https://gallery.cortanaintelligence.com/Experiment/Recommender-Restaurant-ratings-2)  

We have looked the Matchbox recommendation module of Azure Machine Learning, and then we looked the association analysis which is commonly used in R and Python during the hackfest period.  

### R / arules - Association rules  
Association analysis is an industry analysis known as shopping cart analysis that finds rules in multiple transactions or trade.  

[Association rule learning](https://en.wikipedia.org/wiki/Association_rule_learning)  

It is also known as a case of beer and diaper, known as Wal-Mart case, and a case that men who bought diapers with the request of their wives bought a beer. This is because it is widely used in the industry, and the generalized reasoning can be applied to cross-sell, up-sell, or merchandising strategies if the association analysis can be used to identify patterns of good selling products.  

#### R apriori function
The association rule can be found using the apriori function in the *arules*, the package of R. The apriori function is an algorithm for pruning by minimum support.  

**A. Support**  
: In the total transaction, the specific goods A and B are traded at the same time, know how meaningful the rule is.  
= P(A∩B): the number of times A and B occurred at the same time / total number of transactions  

**B. Confidence**  
: The proportion of transactions involving A at the same time, A and B,  
You can see how high the probability B is when an event A occurs.  
= P(A∩B) / A): Number of times A and B occurred at the same time / Number of times A occurred  

**C. Lift**  
The share of A and B traded at the same time is divided by the trading weight at the same time when A and B are independent events. In other words, a measure of how superior the relationship between A and B is than the probability that A and B are traded together by chance.  
= P(A∩B) / A)* P(B|A) : A is the probability that A and B will occur at the same time when A and B are independent events.  

If there is no correlation between items A and B, the Lift = 1.  
The higher the Lift than 1, the stronger the indication that this rule did not happen by accident.  

Parameter|Description|Default value
---|---|---|
support|Minimum support of rules|0.1
confidence|Minimum reliability of the rule|0.8
minlen|Minimum number of items in rule|1
maxlen|Maximum number of items in the rule|10
smax|Maximum support of rules|1
  

#### R apriori function execution code  
[Hogangnono hackfest arules repo](https://github.com/hnn-project/r-arules)  
[Perform Association Rule using r-aules-script.R file](https://github.com/hnn-project/r-arules)  

```
#################################################
### Hogangnono-hackfest arules evaluation script
#################################################
### Inspect Association rule, using Titanic.rdata example dataset 
### Load R arules package and library
setwd("c:/temp/hogangnono-hackfest")
load("titanic.raw.rdata")
install.packages("arules")  #first time install

#load lib
library(arules)

tit <- titanic.raw

head(tit,3)
```
   | Class | Sex  | Age | Survived
  ---|---|---|---|---|
    1|3rd|Male|Child|No
  2|3rd|Male|Child|No
  3|3rd|Male|Child|No

```
str(tit)  #total 2201 rows, 4 columns
```
  
```
'data.frame':	2201 obs. of  4 variables:
$ Class   : Factor w/ 4 levels "1st","2nd","3rd",..: 3 3 3 3 3 3 3 3 3 3 ...
$ Sex     : Factor w/ 2 levels "Female","Male": 2 2 2 2 2 2 2 2 2 2 ...
$ Age     : Factor w/ 2 levels "Adult","Child": 2 2 2 2 2 2 2 2 2 2 ...
$ Survived: Factor w/ 2 levels "No","Yes": 1 1 1 1 1 1 1 1 1 1 ...
```

```
### Execute arules - 1. Parameter default
### Using apriori() function to inspect association rule

rules <- apriori(tit)
```
  
```
Apriori

Parameter specification:
confidence minval smax arem  aval originalSupport maxtime
0.8    0.1    1 none FALSE            TRUE       5
support minlen maxlen target   ext
0.1      1     10  rules FALSE

Algorithmic control:
filter tree heap memopt load sort verbose
0.1 TRUE TRUE  FALSE TRUE    2    TRUE

Absolute minimum support count: 220 

set item appearances ...[0 item(s)] done [0.00s].
set transactions ...[10 item(s), 2201 transaction(s)] done [0.00s].
sorting and recoding items ... [9 item(s)] done [0.00s].
creating transaction tree ... done [0.00s].
checking subsets of size 1 2 3 4 done [0.00s].
writing ... [27 rule(s)] done [0.00s].
creating S4 object  ... done [0.00s].
```

```
### Using inspect() function and check the rule
inspect(rules)
```
  
```
lhs               rhs             support confidence      lift
[1]  {}             => {Age=Adult}   0.9504771  0.9504771 1.0000000
[2]  {Class=2nd}    => {Age=Adult}   0.1185825  0.9157895 0.9635051
[3]  {Class=1st}    => {Age=Adult}   0.1449341  0.9815385 1.0326798
[4]  {Sex=Female}   => {Age=Adult}   0.1930940  0.9042553 0.9513700
[5]  {Class=3rd}    => {Age=Adult}   0.2848705  0.8881020 0.9343750
[6]  {Survived=Yes} => {Age=Adult}   0.2971377  0.9198312 0.9677574
[7]  {Class=Crew}   => {Sex=Male}    0.3916402  0.9740113 1.2384742
[8]  {Class=Crew}   => {Age=Adult}   0.4020900  1.0000000 1.0521033
[9]  {Survived=No}  => {Sex=Male}    0.6197183  0.9154362 1.1639949
[10] {Survived=No}  => {Age=Adult}   0.6533394  0.9651007 1.0153856
[11] {Sex=Male}     => {Age=Adult}   0.7573830  0.9630272 1.0132040
[12] {Sex=Female,Survived=Yes} => {Age=Adult}   0.1435711  0.9186047 0.9664669
[13] {Class=3rd,Sex=Male}     => {Survived=No} 0.1917310  0.8274510 1.2222950
[14] {Class=3rd,Survived=No}  => {Age=Adult}   0.2162653  0.9015152 0.9484870
[15] {Class=3rd,Sex=Male}     => {Age=Adult}   0.2099046  0.9058824 0.9530818
```

```
###Run Association analytics - 2. parameter setting
###Set minlen, support, confidence paramenters / set target rhs(result)
rules2 <- apriori(tit,parameter=list(minlen=2, supp=0.005, conf=0.5), 
                  appearance = list(rhs=c("Survived=No", "Survived=Yes"), default="lhs"),
                  control = list(verbose=FALSE))

rules_sort <- sort(rules2, by="lift")
inspect(rules_sort)
```

```
  lhs                                  rhs            support     confidence lift     
  [1]  {Class=2nd,Age=Child}             => {Survived=Yes} 0.010904134 1.0000000  3.0956399
  [2]  {Class=2nd,Sex=Female,Age=Child}  => {Survived=Yes} 0.005906406 1.0000000  3.0956399
  [3]  {Class=1st,Sex=Female}            => {Survived=Yes} 0.064061790 0.9724138  3.0102430
  [4]  {Class=1st,Sex=Female,Age=Adult}  => {Survived=Yes} 0.063607451 0.9722222  3.0096499
  [5]  {Class=2nd,Sex=Female}            => {Survived=Yes} 0.042253521 0.8773585  2.7159860
  [6]  {Class=Crew,Sex=Female}           => {Survived=Yes} 0.009086779 0.8695652  2.6918608
  [7]  {Class=Crew,Sex=Female,Age=Adult} => {Survived=Yes} 0.009086779 0.8695652  2.6918608
  [8]  {Class=2nd,Sex=Female,Age=Adult}  => {Survived=Yes} 0.036347115 0.8602151  2.6629161
  [9]  {Sex=Female,Age=Adult}            => {Survived=Yes} 0.143571104 0.7435294  2.3016993
  [10] {Sex=Female}                      => {Survived=Yes} 0.156292594 0.7319149  2.2657450
```

```
###Fetch top 10 association rules and build plot by lift order 
install.packages("arulesViz")
library(arulesViz)
  
subrules2 <- head(rules_sort, 10)
plot(subrules2)
plot(subrules2, method="graph")
```

![R arules plot](/images/2017-03-07-hogangnono/aurles-plot-00.png)  
  
#### Hackfest and R arules
It was useful for finding association rules, but it was far from the goal of this hackfest and it was difficult to meet the various demands of Hogangnono that were expected by the association rules alone. However, it is expected that this trial will definitely help developers working on similar projects in the future.  

It is an Association Rules custom module of Azure Machine Learning which implements arule. It is possible to implement R *arules* by executing this project in Machine Learning Studio as it is.  

[Azure Machine Learning Studio - Discover Association Rules](https://gallery.cortanaintelligence.com/CustomModule/Discover-Association-Rules-1)  

### Python / Apriori  
Association Rule is an algorithm that is used not only in R but also in other languages and developer ecosystems. There are many discussions about how to implement this Association Rule in Python and it is implemented in several OSS projects. In particular, Python is an easy language that is very popular with developers, supports [NumPy](http://www.numpy.org/) and [pandas](http://pandas.pydata.org/) specialized in the data analysis process, and offers a variety of machine learning libraries such as [scikit-learn](http://scikit-learn.org). Similarly, the apriori function of *arules* has also been published in Python to OSS and reviewed by hackfest.  

#### tesco.csv data and structure  
```
apple,beer,rice,chicken
apple,beer,rice
apple,beer
apple,mango
milk,beer,rice,chicken
milk,beer,rice
milk,beer
milk,mango
```

It is a command to extract data with a Support of 0.17 and a Confidence of 0.68 or higher by using the apiori.py and the tesco.csv data file.  

```
python apriori.py -f tesco.csv -s 0.17 -c 0.68
```

![Python apriori result](/images/2017-03-07-hogangnono/python-apriori-result.png)  

#### Python apriori function code
More details on how to call Python can be found in the hackfest repository below.  

[hackfest python-apriori repo](https://github.com/hnn-project/python-apriori)  
[asaini/Apriori project](https://github.com/asaini/Apriori)  

### Insert analysis results to AWS RDS using Azure function App  
During the hackfest, team reviewed various recommendation services - Azure Machine Learning matchbox, R and Python Assocation Rule. In most cases, it is generally used for real-time services. However, scenarios for FBT, I2I, and U2I, which are stored in the database after receiving recommended results in advance, can be considered.  
Matchbox that can be executed in Azure Machine Learning can be predicted using batch mode.  
We need to perform the process of insert the analyzed result considering current situation into MySQL of AWS RDS which is currently used by Hogangnono, and this process is best when it is performed with Azure function app that operates in server-less environment.  

azure-storage-to-mysql.js  
```
/**
 * Insert rows with json format to MySQL
 * 
 * @example
 * - data format example
 *      {"id": 1, "name": "Sam"}
 *      {"id": 2, "name": "Steve"}
 *      {"id": 3, "name": "David"}
 *      {"id": 4, "name": "Asher"}
 *      {"id": 5, "name": "Juline"}
 */
function insertLines(connection, data) {
    return new Promise((fulfill, reject) => {
        connection.query(`INSERT INTO ${TABLE_NAME} VALUES ` + makeInsertQuery(data), function (err, result) {
            if (err) {
                reject(err);
                return;
            }
            fulfill(result);
        });
    });
}

function makeInsertQuery(data) {
    var keys = _.keys(data[0]);

    return '(' + keys.join(',') + ') VALUES (' + _.map(data, function (row) {
        return _.map(keys, function (key) {
            return mysql.escape(row[key]);
        }).join(',');
    }).join('),(') + ')';
}

const connection = mysql.createConnection({
    host: DB_HOST,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE
});

connection.connect();

// @see http://azure.github.io/azure-storage-node
const rs = blobService.createReadStream(AZURE_CONTAINER_NAME, 'example/data/data.txt');

const rl = readline.createInterface({
    input: rs
});

let promise = Promise.resolve();
let buffers = [];
const BUFFER_SIZE = 1000;

rl.on('line', (line) => {
    const item = JSON.parse(line);

    if (buffers.length < BUFFER_SIZE) {
        buffers.push(item);
    }

    // Insert rows in buffer units
    if (buffers.length === BUFFER_SIZE) {
        const list = buffers.concat();
        promise = promise.then(() => {
            return insertLines(connection, list);
        });

        buffers = [];
    }
});

rl.on('close', () => {
    // Insert remains
    if (buffers.length) {
        promise = promise.then(() => {
            return insertLines(connection, buffers);
        });
    }

    promise = promise.then(() => {
        connection.end();
        console.log('Completed');
    });
});
```

[Hackfest Storage-to-mysql full code repo with Azure function app](https://github.com/hnn-project/azure-function/blob/master/nodejs/azure-storage-to-mysql.js)  

### Using real-time recommendations  
Assuming that the request is made in real time from node.js located in Amazon EC2. Some of the above steps have been introduced. The request is briefly executed, the response data is stored in the Azure Table Storage for the purpose of logging and then result is returned to the user.  

#### Azure Table Storgae
Azure Table Storage is a key/value based NoSQL repository that provides easy-to-use Proxy functions in various languages such as node.js as well as C#. It is also a persistent repository for future log analysis.  

After saving Partition Key and RowKey of Table Storage as User ID and GUID, respectively, it performs the task of storing the response JSON received from the Azure Machine Learning in the table storage as it is for log purpose.  

Use the Azure Storage Explorer tool for validation, development, and testing of Azure Table Storage.  
[Azure Storage Explorer](http://storageexplorer.com/)  

#### Restful API development and test
Hackfest team used [Postman](https://www.getpostman.com/), a development and debugging tool to easily call Restful APIs, and tested the Post API for the Rest API and called it using the node's Request Package.  

- Call the Rest API using Postman  
- Request from node.js to get a recommendation  
- Insert recommended results in NoSQL - Azure Table Storage  
- Deliver the results of the Recommendation to the User  

[Hackfest repo code link](https://github.com/hnn-project/azure-function/blob/master/nodejs/cognitive-api-to-table.js)  

Thus, we were able to complete the workflow for all Recommendations.  


## Conclusion  
In order to implement recommendation service, it is necessary to provide quick and easy configuration as well as accurate prediction and to utilize the predicted result as an easily distributable service.  

Hackfest enabled Hogangnono to develop and implement a full solution architecture of real-time recommendation models and batch recommendation models. Hogangnono had also reviewed alternative solutions, but chose Microsoft because it provides all the features necessary to build the recommendation service.  

Through Hackfest with Microsoft, it was able to successfully utilize various Azure Machine Learning based service in node.js with Restful API method, and to use Azure function app to reduce the high scalability and management point. The development team was able to implement it quickly by focusing solely on code itself. In particular, the server-less code is available in Azure Functions as node.js, and the event trigger is implemented without a single line of code, making it easy to implement the backend recommendation logic in the Azure Functions without any infrastructure.  

>For startups, it is most important that you have to develop quickly with fewer resources and apply it to service quickly based on PaaS. While reviewing several recommended services, I can immediately get recommendation after creating Azure Machine Learning. It was possible to build quickly without creating or maintaining additional infrastructure. - David Shim, CEO of Hogangnono  

> When the user inquires about the real-estate apartment, there was always a demand to see the recommend apartment. During the Hackfest, the Azure Machine Learning Matchbox was able to produce very good quality in a short amount of time. Also, the server-less development method of Azure Functions using the existing AWS infrastructure can be built without any interruption of legacy. I would like to recommend Azure Machine Learning to other startups who want to quickly build recommendation services. - Ohgyun Ahn, Technical Director of Hogangnono  

![Hogangnono hakcfest](/images/2017-03-07-hogangnono/hackfest02.png)  

### General lessons
To implement the AI-based recommendation service, customers had to build the necessary infrastructure for IaaS-based virtual machines and upload and implement their own analytical applications. However, through the Azure Machine Learning, customer is able to implement faster and easier recommendations to implement the most important company recommendation logic and sustainable services to prevent divergent departures. It was quicker and more responsive to your business needs.  

Because Azure Functions can trigger the timer, customer could import the Amazon S3 data to the server-less away and trigger the Blob container so that we could just upload the bulk analysis data to the Blob container, It was possible to implement the logic to load the data into the existing DBMS with Azure Functions when the batch analysis job was finished. Simply write server-less code in their preferred language without any infrastructure building, polling processes, or daemon process triggers.  

Recommended services have been one of the most frequently used services in various industries. In the future, these recommendation services will continue to improve performance with Machine Learning techniques, and accurate recommendations will be provided along with customer data. The Machine Learning Prediction Service, the batch job and scheduler service using Azure Functions are great solutions and will be the best case in the future for various recommendation and forecast analysis solution scenarios.  
