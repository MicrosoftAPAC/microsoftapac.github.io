---
layout: post
title:  "How Azure Machine Learning and Azure Functions helped Devsisters improve its predictive analytics"
author: "Dae Woo Kim and Hyewon Ryu"
#author-link: "Add author's Twitter URL here"
#author-image: "{{ site.baseurl }}/images/authors/photo.jpg"
date:   2017-09-29
categories: [Machine Learning, Azure Functions]
color: "blue"
image: "images/2017-08-01-devsisters/tile-devsisters-architecture.png" #must be 440px wide
excerpt: Devsisters, a top game development company, and Microsoft worked together in a hackfest to improve predictive analytics for its games and customers.
language: [English]
verticals: [Entertainment]
geolocation: [Asia]
---

Devsisters, a leading game publisher and market leader in game services, worked with Microsoft in a hackfest to build customized services for game customers, customer churn predictions, and billing predictions.   

**Key technologies used:**

- [Azure Functions](https://azure.microsoft.com/en-us/services/functions/)  
- [Azure Machine Learning](https://azure.microsoft.com/en-us/overview/machine-learning/)
- [Azure Blob storage](https://azure.microsoft.com/en-us/services/storage/blobs/)
- [Azure Redis Cache](https://azure.microsoft.com/en-us/services/cache/)

**The hack team:**

- Juhong Park – Devsisters  
- Taekwon Lee – Devsisters  
- Dae Woo Kim – Senior Technology Evangelist, Microsoft  
- Hyewon Ryu – Audience Evangelism Manager, Microsoft  

## Customer profile

![devsisters logo]({{site.baseurl}}/images/2017-08-01-devsisters/logo_devsisters.png) 

[Devsisters](http://www.devsisters.com/) is a game developer based in Seoul, Korea, that has released mobile games since 2009. Its most successful running games are *Cookie Run* and *Cookie Run: Oven Break*. It has more than 100 million cumulative downloads from the Cookie Run series and is growing rapidly. In 2015, Devsisters was named No. 1 in the [Deloitte Technology Fast 500 APAC rankings](https://www2.deloitte.com/content/dam/Deloitte/global/Documents/Technology-Media-Telecommunications/gx-deloitte-tmt-techfast500-apac-2015-ranking.pdf). 

![devsisters cookierun]({{site.baseurl}}/images/2017-08-01-devsisters/Cookie-Run-OvenBreak-small.jpg)  


## Problem statement

Devsisters is growing rapidly, with more than 100 million cumulative downloads. It wanted to avoid user churn and improve the billing rate. It also wanted to make its forecasting system more efficient, offer differentiated user-targeted promotions, and maximize revenue through artificial intelligence-based services.  

## Solution and steps

Devsisters needed to user group rather than standardized churn prediction for whole game users and to provide churn prediction and payment prediction services that were specific to individual user groups. In order to efficiently and reliably transfer the game log data of existing systems in AWS and to automate the whole process of batch-based analysis, Devsisters and the Microsoft hackfest team developed "serverless" architecture based on[Azure Function](https://azure.microsoft.com/en-us/services/functions/) and [Azure Machine Learning](https://azure.microsoft.com/en-us/services/machine-learning/).  

### Devsisters service architecture diagram  

![Devsisters Architecture]({{site.baseurl}}/images/2017-08-01-devsisters/devsisters-architecture.png)  


Devsisters and the Microsoft hackfest team implemented a cloud-based architecture for Azure Machine Learning—clustering and classification services, with a real-time and batch analysis architecture.  

### Cold path - batch analysis process  

The cold path process is an analytic method for constructing a prediction service periodically through the batch analysis process and displaying it when the user requests it, after loading it in the database. 

- The batch analysis data resides in [AWS S3](https://aws.amazon.com/s3/) and uploads blob objects from S3 buckets to Azure Blob storage using Azure Functions.  
- The log data uploaded by Azure Functions is available immediately and assumes that it is simply preprocessed with [Hadoop - HDInsight](https://azure.microsoft.com/en-us/services/hdinsight/), processed through Hive to extract the required statistical information, and stored in the blob after processing.  
- If the Azure function that sends data from S3 or HDInsight uploads the file to the blob, the Azure function gets a blob trigger to automatically fetch the uploaded file and execute the predictive analysis.  
- When prediction is completed, the Azure function uploads the result of the churn prediction to the current operating environment, [Relational Database Service (RDS) of AWS](https://aws.amazon.com/rds/).  

### Hot path - real-time predictive request processing  

Hot path is an implementation of a way to process a user's request in real time. You can get recommendation results in real time from the model created in Azure Machine Learning predictive analytics service.  

- Assumed that the prediction analysis results are already stored in the recommended services through the above batch analysis.  
- If [Redis service](https://azure.microsoft.com/en-us/services/cache/) is called by the RESTful API method to get cached prediction results, or if there is no cache, it receives prediction results after accessing Azure Machine Learning service and provides prediction results to the user after loading them on Redis Cache in [Python Django framework](https://www.djangoproject.com/) running on [EC2 of AWS](https://aws.amazon.com/ec2/).  

### Load data from AWS S3 into the Azure Blob store

The Devsisters game service is running on AWS. The hackfest team wanted to do analysis without affecting existing services to implement machine learning analysis services. To do this, we needed to periodically import the log data that was loaded into S3 in AWS to [Azure Blob storage](https://docs.microsoft.com/en-us/azure/storage/).  

There are a variety of ways in which you can perform scheduling tasks in Azure: [Azure Scheduler](https://docs.microsoft.com/en-us/azure/scheduler/), [Azure WebJobs](https://docs.microsoft.com/en-us/azure/app-service-web/websites-webjobs-resources), and [Function App](https://docs.microsoft.com/en-us/azure/azure-functions/). During the hackfest, we reviewed the advantages and disadvantages of these scheduling services. Hackfest team has chosen the [Azure function app](https://docs.microsoft.com/en-us/azure/azure-functions/) for the "serverless coding" which is needed "blob triggers", "timer triggers", and "webhook" for the batch analysis.   

First of all, the Devsisters current data transfer service has been implemented using Azure Functions' timer trigger to pull data from S3 in AWS and upload it to Azure Blob storage once a day.  

The Devsisters analysis team was using Python 3 to develop and run the service. To set up an additional Python 3 package for using the S3 SDK that is not included in Azure Functions, configure [Kudu](https://github.com/projectkudu/kudu) by executing the Python 3.5 install command through the following procedure:  

```
nuget.exe install -Source https://www.siteextensions.net/api/v2/ -OutputDirectory D:\home\site\tools python352x64  
mv /d/home/site/tools/python352x64.3.5.2.6/content/python35/* /d/home/site/tools/  
```

Then install the Azure SDK via the following command:  

```
cd /d/home/site/tools/
python -m pip install azure
```

Use the following Python 3 code to transfer from the blob of AWS S3 to Azure Blob storage with Azure Functions.  

```
# Add file to azure blob.
account_name = '<Your Account Name>'
account_key = '<Your Account Key>'
container = '<Target Container>'
block_blob_service = BlockBlobService(account_name=account_name, account_key=account_key)
block_blob_service.create_blob_from_path(
    container,
    filename,
    filename,
    content_settings=ContentSettings(content_type='plain/txt')
    )
```

The complete code to transfer from S3 blobs to Azure Blob storage with Python is available at this GitHub repository: [GitHub Project Repository for Transferring AWS S3 Data to Azure Blob storage](https://github.com/ds-project/ds-s3-to-blob).  

In this way, you can transfer blobs from AWS S3 to Azure Blob storage by using Azure Functions.  

## Azure Machine Learning predictive analytics  

The Devsisters analytics team wanted to use Azure Machine Learning to predict the user churn and payment and to divide a user cluster to provide appropriate promotions for individual users. To provide these predictions, Azure Machine Learning offers a variety of predictive analysis algorithms and provides PaaS-based services, so that developers can provide predictive analytical services reliably without considering the infrastructure. In addition, a predictive model can be deployed as RESTful API, and the batch training process can be executed using Azure Functions.  

The hackfest team built a model of the churn/payment prediction model and the user cluster as one workflow. 

![DevSisters ML model]({{site.baseurl}}/images/2017-08-01-devsisters/ds-ml-azure-model.png)  


In this way, we have created a model of churn prediction and payment prediction and user clustering. The entire workflow can be tested immediately with "Open in Studio" via the Cortana Intelligence Gallery link below.  

- [Hackfest predictive project repository link](https://github.com/ds-project/ds-ml) 
- [Hackfest Cortana Intelligence Gallery link](https://gallery.cortanaintelligence.com/Experiment/ds-project-ml)  


### Analysis used in Azure Machine Learning

Devsisters built an individual workflow in the following pattern to perform the desired analysis process, and automated the results in every step.  

- **User churn**

    1. Fetch dataset
    2. Collect columns needed in the dataset
    3. Classify dataset to Train and Test
    4. Apply Two-Class Boosted Decision Tree
    5. Model training and evaluation 

- **Payment prediction**

    1. Fetch dataset
    2. Collect columns needed in the dataset
    3. Classify dataset to Train and Test
    4. Apply Two-Class Boosted Decision Tree
    5. Model training and evaluation

- **User clustering**

    1. Fetch dataset
    2. Collect columns needed in the dataset
    3. Classify dataset to Train and Test
    4. Apply K-Means Clustering
    5. Model training and evaluation

This model is used to perform the predictive analysis and the batch processing to load the analysis result as AWS RDS.  

## Load analysis results to AWS RDS using Function App  

Azure Machine Learning was used to implement the analysis service. It was necessary to carry out the process of loading the analysis result of Devsisters in current AWS RDS MySQL, and it was the best way to perform this process with Azure Functions, which operates in a serverless environment.  

The Azure function requires the Azure SDK and the [pymysql](https://github.com/PyMySQL/PyMySQL) library to use Azure Blob storage and MySQL as Python 3.  

```
> cd /d/home/site/tools/
> python -m pip install azure 
> python -m pip install pymysql 
```

Then, perform batch.py to save actual machine learning batch analysis results as AWS RDS.  

```
def saveBlobToFile(blobUrl, resultsLabel):
    output_file = "myresults.csv" # Replace this with the location you would like to use for your output file
    print("Reading the result from " + blobUrl)
    try:
        response = urllib.request.urlopen(blobUrl)
    except urllib.error.HTTPError as error:
        print(error.reason)
        return
    ...
    
    # start putting on mysql
    print('putting on mysql...')
    mysql_host = '<mysql_host>'
    mysql_user = '<mysql_user>'
    mysql_password = '<mysql_password>'
    mysql_db = '<mysql_db>'
    conn = pymysql.connect(host=mysql_host, user=mysql_user, password=mysql_password, db=mysql_db)
    cur = conn.cursor()
    result_list = result_csv.split('\n')[1:]
    for row in result_list:
        columns = row.split(',')
        if len(columns) <= 1:
            continue
	
	...

```

The invokeBatchExecutionService is used to upload the file to be analyzed to the blob where the Azure Machine Learning batch is performed. When the analysis is completed, loading the result into AWS RDS is executed through the "# start putting on mysql routine" code block. The full code of this process can be found in the hackfest GitHub repository: [Hackfest Azure Function - batch code](https://github.com/ds-project/ds-ml-batch).  

## Azure Functions - real-time predictive analysis with Redis Cache  

It is assumed that the application in AWS EC2 is requesting in real time. As described in the above process, first check whether there is a cache in Redis Cache and return if a cache exists, or request for Azure Machine Learning if there is no cache, put the result into Redis Cache, and return the result.  

## Azure Functions - Redis Cache  

[Azure Redis Cache](https://azure.microsoft.com/en-us/services/cache/) is a fully managed service with key/value-based in-memory NoSQL repository. It was the best choice for the Azure Machine Learning request caching service. Briefly, we implemented the Azure function as a routine that checks the cache hit by loading the user ID as an identifier in the Redis Cache key.  

```
# filter user index list we should do request
for instance in inputs:
    user_idx = instance[0]
    print('Trying to hit redis User #' + user_idx)
    result_cached = redis_db.get(user_idx)

    if result_cached is None:
        target_instance_list.append(instance)
    else:
        print('Using Cached Data!')
        result_set[user_idx] = result_cached.decode("utf-8")

# If we should do request,
if len(target_instance_list) > 0:
    data_template["Inputs"]["input1"]["Values"] = target_instance_list
    result = do_ml_request(data_template).decode("utf-8") 
    result = json.loads(result)['Results']['output1']['value']['Values']
    for key, val in enumerate(result):
        user_idx = target_instance_list[key][0]
        result_set[user_idx] = val
        redis_db.set(user_idx, val, ex=redis_expire)
...
```

[Hackfest GitHub real-time cache processing Azure Function repo link](https://github.com/ds-project/ds-realtime-cache)  

Full real-time analysis workflow and cache services were also quickly completed in a serverless environment through Azure Functions.  

### Conclusion

In order to implement customer churn, payment prediction, and customer cluster services, we needed to leverage existing services to provide quick and easy configuration as well as accurate prediction and to easily distribute predicted results.  

During the hackfest, Devsisters was able to implement and develop a full solution architecture of real-time and batch-based predictive models. Through the hackfest with Microsoft, Devsisters has been able to successfully use various Azure Machine Learning-based services in Python with the RESTful API method, and has been able to build services with high scalability and reduced management points using Azure Functions. The development team quickly focused on the code itself. Especially with Azure Functions, a serverless service, they were able to use Python in the same way as existing development patterns. Also, they implemented event triggers without a single line of code, making it easy to implement back-end prediction analysis logic in code without infrastructure, in Azure Functions.  

>"Through Microsoft Azure, we were able to build the infrastructure and machine learning architecture to predict and understand user behavior in real time. In addition, we were able to improve performance by learning and applying various models with a simple workflow. Devsisters will continue to use machine learning to improve user satisfaction. I will do my best to provide better games to users."  
>
>— Jong-Ok Kim, Devsisters Joint Representative  

![Devsisters hakcfest photo]({{site.baseurl}}/images/2017-08-01-devsisters/devsisters-hackfest.png)  


### Benefit of the hackfest

With the machine learning service provided by Microsoft Azure, we were able to more efficiently implement and service the entire process of the predictive analytics service. In particular, the Azure function provided in the "serverless" environment can trigger the timer, you can import the S3 data from AWS periodically and trigger the Blob container, so you can only upload bulk analysis data to the Blob container. And the logic to load into an existing DBMS with additional triggers that occur when the batch analysis job is finished can be implemented immediately with Azure Functions. Simply write the code in their preferred language without infrastructure building, polling processes, or daemon process triggers.  

Predictive analytics techniques have been one of the most important services in various industries. In the future, these services will continue to improve performance by machine learning techniques, and will be located as a service that provides higher accuracy through more data. Deployment work and scheduler services using Machine Learning Service and Azure Functions are great solutions and will be the best case in the future for various predictive analytics solution scenarios.  

## Additional resources
[Azure Functions](https://azure.microsoft.com/en-us/services/functions/)  
[Azure Machine Learning](https://azure.microsoft.com/en-us/overview/machine-learning/)
[Azure Blob storage](https://azure.microsoft.com/en-us/services/storage/blobs/)
[Azure Redis Cache](https://azure.microsoft.com/en-us/services/cache/)
 