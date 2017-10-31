---
layout: post
title:  "마이크로소프트의 Machine Learning 기술을 활용한 데브시스터즈의 예측분석 서비스 구축"
author: "Dae Woo Kim, Hyewon Ryu"
#author-link: "Add author's Twitter URL here"
#author-image: "{{ site.baseurl }}/images/authors/photo.jpg"
date:   2017-08-01
categories: [Machine Learning], [Azure Functions]
color: "blue"
#image: "{{ site.baseurl }}/images/imagename.png" #should be ~350px tall
excerpt: Devsisters, top game development company, and Microsoft hackfest to improve predictive analytics for more captivating game users.
language: [Korean]
verticals: [Game]

Key technologies used  
Azure Functions  
Azure Machine Learning  
Azure Storage Blob  
Azure Redis Cache  

---

데브시스터즈는 게임 서비스의 마켓 리더로 2009년부터 다양한 모바일 게임들을 발표한 대표 게임 제작사입니다. 데브시스터즈는 게임 고객 대상 맞춤 서비스와 이탈 및 결재 예측 서비스를 구축하기 위해 마이크로소프트와 hackfest를 진행했습니다.  

Hackfest 팀:
- 박주홍 - 데브시스터즈  
- 이태권 - 데브시스터즈  
- 김대우 - 한국마이크로소프트, 부장  
- 류혜원 - 한국마이크로소프트, 과장  

## 고객 정보
![devsisters logo]({{site.baseurl}}/images/2017-08-01-devsisters/logo_devsisters.png)  
[데브시스터즈](http://www.devsisters.com/)는 서울에 위치한 게임 개발사로 2009년부터 다양한 모바일 게임들을 발표했습니다. 특히, 가장 성공한 런닝 게임으로, 쿠키런과 쿠키런:오븐브레이크 게임이 있습니다. 쿠키런은 지난 2013년 발표되었으며 데브시스터즈는 2015년 APAC의 가장 빠르게 성장하는 기술기업에서 최우수 기업으로 선정되었고, 현재는 쿠키런시리즈로 1억번 이상의 누적 다운로드를 기록하고 있으며 빠르게 지속 성장하는 회사입니다.  

![devsisters cookierun]({{site.baseurl}}/images/2017-08-01-devsisters/Cookie-Run-OvenBreak-small.jpg)  

## 고객의 난제
데브시스터즈는 23개 이상의 국가에서 최고의 게임으로 랭크되었고 1억건 이상의 누적 다운로드를 기록하며 지속적으로 빠르게 성장하고 있습니다. 데브시스터즈는 이런 많은 사용자들의 이탈을 방지하길 희망했고 결재율을 더 향상시키기 희망했으며 데브시스터즈의 현재의 예측 시스템을 더 효율적으로 구축해 차별화된 사용자 대상 프로모션 제공을 희망했고 궁극적으로 인공지능 기반 서비스를 통한 수익 극대화가 필요했습니다.  

## 솔루션 및 해결 과정
데브시스터즈는 게임 사용자를 대상으로 획일화된 이탈 방지가 아닌 사용자군을 여러 단계로 분리하고 개별 사용자군에 특화된 이탈 방지 및 결재 예측 서비스를 제공할 필요성이 있었습니다. 또한, 현재 AWS에 구축된 기존 시스템의 게임 로그 데이터를 효율적이고 안정적으로 이전하고 batch 기반 분석 전체 과정을 자동화 시키기 위해 마이크로소프트는 [Azure Machine Learning](https://azure.microsoft.com/en-us/services/machine-learning/)을 이용한 고객 군집 및 분류 예측 분석과 서비스 자동화를 위한 "Server-less" 아키텍처 기반 [Azure Function](https://azure.microsoft.com/en-us/services/functions/)을 제안했습니다.  

### 데브시스터즈 서비스 아키텍처 다이어그램  
![Devsisters Architecture]({{site.baseurl}}/images/2017-08-01-devsisters/devsisters-architecture.png)  

데브시스터즈 팀과 마이크로소프트는 Azure Machine Learning - 군집 및 분류 서비스를 위한 클라우드 기반 아키텍처를 구현하고, 실시간 분석 및 배치 기반 분석 아키텍처를 함께 구성했고 완료 했습니다.  

### Cold path - 배치 분석 과정  
Cold path 과정은 배치 분석 과정을 통해 주기적으로 예측 서비스를 구축해 데이터베이스에 미리 적재 후 사용자의 요청이 있을 경우 보여주기 위한 분석 방안입니다.  
- Batch 분석에 실행되는 데이터는 [AWS S3](https://aws.amazon.com/s3/)에 존재하고, S3의 bucket으로부터 blob object를 Azure Fuctions를 이용해 Azure Blob Storage로 업로드합니다.  
- Azure Functions로 업로드한 로그 데이터는 즉시 이용 가능하고 [Hadoop - HDInsihgt](https://azure.microsoft.com/en-us/services/hdinsight/)를 이용해 간단하게 전처리 하거나 필요한 통계 정보 추출을 위해 Hive를 통해 처리하고 완료 후 Blob에 저장한다고 가정합니다.  
- S3로부터 데이터를 전송하는 Azure Function 또는 HDInsight가 Blob에 파일을 올려 두면, Azure Functions은 Blob trigger를 이용해 자동으로 업로드된 파일을 가져와 예측 분석을 실행하도록 처리합니다.  
- 예측 작업이 완료되면 Azure Function은 이 사용자별 이탈예측 결과를 현재 운영 환경인 [AWS의 RDS(Relational Database Service)](https://aws.amazon.com/rds/)에 업로드하고 작업을 완료합니다.  

### Hot path - 실시간 예측 요청 처리  
Hot path는 사용자의 요청을 실시간으로 처리하기 위한 방안을 구현한 것입니다. 예측 분석 서비스에 만들어진 모델에서 실시간으로 추천 결과를 가져옵니다.  
- 이미 실시간 예측에 필요한 예측 분석 결과는 위의 배치 분석 등을 통해 추천 서비스들에 저장된 상태로 가정합니다.  
- [AWS의 EC2](https://aws.amazon.com/ec2/)에서 실행되는 [Python Django framework](https://www.djangoproject.com/)에서 Restful API 방식으로 Redis 서비스를 호출해 캐싱된 예측 결과를 받아오거나 캐시가 없다면 Machine Learning 서비스 접근 후 예측 결과를 받아와 [Redis](https://azure.microsoft.com/en-us/services/cache/)에 적재 후 사용자에게 예측 결과를 제공합니다.  

### AWS S3로부터 가져온 데이터를 Azure Blob 저장소로 적재
데브시스터즈의 게임 서비스는 AWS에서 운영 중입니다. Machine Learning 분석 서비스 구현을 위해 기존의 서비스에 전혀 영향을 주지 않고 분석을 수행하기 원했습니다. 이를 위해 AWS의 S3에 적재되는 로그 데이터를 [Azure의 Blob Storage](https://docs.microsoft.com/en-us/azure/storage/)로 주기적으로 가져올 필요가 있었습니다.  

Azure에서 스케쥴링 작업을 수행할 수 있는 방법은 다양합니다. [Azure Scheduler](https://docs.microsoft.com/en-us/azure/scheduler/), [Web Job](https://docs.microsoft.com/en-us/azure/app-service-web/websites-webjobs-resources), [Function App](https://docs.microsoft.com/en-us/azure/azure-functions/) 등의 다양한 서비스를 고려할 수 있습니다. Hackfest 동안 이런 스케쥴러의 장단점과 주요한 서비스를 검토 했으며, server-less 코딩 및 이런 경우 batch 분석을 위한 blob 트리거 및 timer 트리거, 그리고 그 이후 필요시 수행 가능한 webhook 등을 자동으로 처리해 코드에만 집중 할 수 있는 [Azure function app](https://docs.microsoft.com/en-us/azure/azure-functions/)을 선택하였습니다.  

먼저, 데브시스터즈의 현재 데이터는 Azure Functions의 timer 트리거를 이용해 1일 1회 AWS의 S3로부터 데이터를 가져와 Azure Blob Storage로 업로드하는 코드를 구현했습니다.  

데브시스터즈 분석팀은 Python3를 이용해 서비스를 개발, 운영하고 있었습니다. Azure Functions에서 기본 제공하지 않는 AWS의 S3 SDK를 사용하기 위한 Python3 package를 추가로 설정하려면, [Kudu](https://github.com/projectkudu/kudu)에서 아래 과정을 통해 Python 3.5 설치 명령을 수행해 구성합니다.  

```
nuget.exe install -Source https://www.siteextensions.net/api/v2/ -OutputDirectory D:\home\site\tools python352x64  
mv /d/home/site/tools/python352x64.3.5.2.6/content/python35/* /d/home/site/tools/  
```

이후 아래 명령을 통해 Azure SDK를 설치합니다.  

```
cd /d/home/site/tools/
python -m pip install azure
```

다음과 같은 Python3 코드를 이용해 Azure Function에서 Azure Blob storage로 S3의 blob을 전송합니다.  

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

Azure Functions에서 Python으로 S3의 blob을 이전하는 전체 코드는 아래의 Github 리포지토리에서 확인 가능합니다.  

[S3 데이터를 Blob으로 전송하는 Github 프로젝트 리포지토리](https://github.com/ds-project/ds-s3-to-blob)  

이렇게 AWS S3로부터 blob을 Azure Functions를 이용해 Azure Blob Storage로 이전이 가능합니다.  

## Azure Machine Learning 예측분석  
데브시스터즈 분석팀은 Azure Machine Learning을 이용해 사용자의 이탈과 결재 가능성을 예측하고 사용자군(User Cluster)을 나눠 개별 사용자군에 맞는 적절한 프로모션을 제공하기 원했습니다. 이러한 기능을 제공하기 위해 Azure Machine Learning은 다양한 예측분석 알고리즘을 제공하고, PaaS 기반 서비스를 제공해 개발자는 인프라에 대한 고려 없이 안정적으로 예측 분석 서비스를 제공 가능한 장점이 있을 뿐만 아니라, Restful API로 손쉽게 예측 모델을 배포가 가능하고, Batch Traning 과정을 Azure Functions를 활용해 실행도 가능합니다.  

Hackfest팀에서는 이탈/결재예측 모델과 사용자군을 나누는 모델을 하나의 워크플로우로 구축했습니다.  
![데브시스터즈 예측분석 머신러닝 모델]({{site.baseurl}}/images/2017-08-01-devsisters/ds-ml-azure-model.png)  

이렇게, 이탈 예측 및 결재 예측과 사용자 군집화 문제를 하나의 모델로 제작 했습니다. 전체 워크플로우 및 검토는 아래 Cortana Intelligence Gallery 링크를 통해 "Open in Studio"를 진행하면 즉시 모델을 테스트 가능합니다.  

[Hackfest 예측분석 프로젝트 리포지토리 링크](https://github.com/ds-project/ds-ml)  
[Hackfest Cortana Intelligence Gallery 링크](https://gallery.cortanaintelligence.com/Experiment/ds-project-ml)  

### Azure Machine Learning에 사용된 분석 항목
데브시스터즈가 원하는 예측 분석 과정을 수행하기 위해 아래와 같은 패턴으로 개별 워크플로우를 구축했고, 구축된 결과를 단계별로 자동화했습니다.  

* 이탈 문제
    1. 데이터셋 입수
    2. 데이터셋에서 필요한 칼럼만 분류
    3. 데이터셋을 Train, Test 셋으로 분류
    4. Two-Class Boosted Decision Tree 를 사용
    5. 모델 학습 후 평가

* 결제 문제
    1. 데이터셋 입수
    2. 데이터셋에서 필요한 칼럼만 분류
    3. 데이터셋을 Train, Test 셋으로 분류
    4. Two-Class Boosted Decision Tree 를 사용
    5. 모델 학습 후 평가

* 군집화 문제
    1. 데이터셋 입수
    2. 데이터셋에서 필요한 칼럼만 분류
    3. 데이터셋을 Train, Test 셋으로 분류
    4. K-Means Clustering 를 사용
    5. 모델 학습 후 평가

위의 모델을 통해 예측 분석 작업을 수행하고 분석된 결과를 AWS의 RDS로 저장하는 Batch 처리 과정을 진행합니다.  

## 분석 결과를 Function App을 이용해 AWS의 RDS로 저장  
Azure Machine Learning을 이용하여 분석 서비스 구현 과정을 진행했습니다. 데브시스터즈의 현재 운영상황을 고려해 분석된 결과를 현재 AWS RDS의 MySQL에 적재하는 과정을 수행할 필요가 있었고, 이 과정은 Server-less 환경으로 동작하는 Azure Function으로 수행하는 것이 최선의 방안이었습니다.  

마찬가지로, Azure function에서 Python3로 Blob 저장소와 MySQL을 이용하기 위해 Azure SDK와 [pymysql](https://github.com/PyMySQL/PyMySQL) 라이브러리가 필요합니다.  

```
> cd /d/home/site/tools/
> python -m pip install azure 
> python -m pip install pymysql 
```

이어서, 실제 Machine Learning 의 batch 분석 결과를 AWS의 RDS로 저장하기 위해 batch.py 과정을 수행합니다.  

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

invokeBatchExecutionService를 이용해 Azure Machine Learnring batch 작업이 수행되는 blob에 분석할 파일을 업로드하고, 분석이 완료되면 # start putting on mysql 루틴을 통해 결과를 AWS의 RDS에 적재하는 과정이 실행됩니다. 이 과정의 전체 코드를 아래 Hackfest Github 리포지토리에서 보실 수 있습니다.  

[Hackfest Azure Function - batch 코드](https://github.com/ds-project/ds-ml-batch)  

## Azure Function - Redis 캐시가 적용된 실시간 예측 분석 구현  
AWS의 EC2에 위치한 어플리케이션에서 실시간으로 요청하는 상황으로 가정합니다. 위의 과정에서도 일부 소개된 것처럼, 먼저 Redis cache에 cache 존재 여부를 체크하고 캐시가 존재하면 리턴하며 캐시가 없을 경우 Azure Machine Learning에 요청하고 결과를 Redis cache에 넣고 리턴하게 됩니다.  

## Azure Function - Redis Cache  
[Azure Redis Cache](https://azure.microsoft.com/en-us/services/cache/)는 Key/Value 기반의 인메모리 NoSQL 저장소로 완전히 관리되는 서비스로 제공되며, 다양한 언어에서 손쉽게 사용 가능한 Proxy 함수를 제공하기 때문에 Azure Machine Learning의 요청 캐싱 서비스로 최적의 선택이었습니다. 간략히, 사용자ID를 식별자로 Redis cache에서 key로 적재해 캐시 적중을 체크하게 되는 루틴으로 Azure Function을 구현했습니다.  

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

[Hackfest Github real-time 캐시 처리 Azure Function 리포지토리 코드 링크](https://github.com/ds-project/ds-realtime-cache)  

이렇게 전체 실시간 분석 및 캐시 서비스를 위한 워크플로우도 Azure Function을 통해 Server-less 환경으로 빠르게 완성할 수 있었습니다.  

### 결론  
고객 이탈 및 결제 예측, 고객군 예측 서비스를 구현하기 위해, 빠르고 쉬운 구성은 물론 정확한 예측까지 제공하고 예측된 결과를 손쉽게 배포 가능한 기존의 서비스를 활용할 필요가 있었습니다.  

Hackfest 기간 동안 데브시스터즈는 실시간 예측 모델과 배치 기반 예측 모델의 전체 솔루션 아키텍처를 구현하고 개발할 수 있었습니다. 마이크로소프트와의 Hackfest를 통해 데브시스터즈는 성공적으로 Python에서 Restful API 방식으로 다양한 Azure Machine Learning 기반 서비스를 활용할 수 있었고, Azure Functions을 활용해 높은 확장성을 가지며 관리 포인트가 줄어든 서비스를 구축할 수 있었고, 개발팀은 오직 코드에만 집중하여 빠르게 구현할 수 있었습니다. 특히 server-less 서비스인 Azure Functions에서 Python를 이용해 기존 개발 패턴과 똑같이 이용 할 수 있었고, 이벤트 트리거를 코드 한 줄 없이 구현하여, 백엔드 예측분석 로직을 인프라 없이 코드로 Azure Functions에서 쉽게 구현할 수 있었습니다.  

> Azure 를 통해 실시간으로 유저의 행동을 예측하고 이해할 수 있는 인프라를 경험할 수 있었다. 또한 간단한 마우스 클릭으로도 여러가지 모델을 학습하고 적용하면서 성능을 향상 시킬 수 있었다. 데브시스터즈는 앞으로도 머신러닝을 활용하여 유저의 만족감을 향상시키는 노력을 할 것이다. 이를 통해 유저에게 더 나은 게임을 제공할 수 있도록 최선을 다하겠다.  
> 데브시스터즈 김종흔 공동대표

![Devsisters hakcfest photo]({{site.baseurl}}/images/2017-08-01-devsisters/devsisters-hackfest.png)  

### Hackfest를 통해
Microsoft Azure에서 제공하는 머신러닝 서비스를 통해 난제였던 예측 분석 서비스의 전체 과정을 더욱 효율적으로 구현하고 서비스할 수 있었습니다. 특히, "Server-less" 환경으로 제공되는 Azure Function이 타이머를 트리거 할 수 있기 때문에 AWS의 S3 데이터를 주기적으로 가져올 수 있었고, Blob 컨테이너를 트리거 할 수 있기 때문에, 대량 분석 데이터를 Blob 컨테이너에 업로드만 하면 되었고, 배치 분석 작업이 종료되면 발생하는 추가 트리거로 기존 DBMS에 로드하는 로직을 Azure Function으로 즉시 구현 가능했습니다. 즉, 인프라스트럭처 구축이나 polling 프로세스 또는 데몬 프로세스 트리거 없이 바로 그들이 선호하는 언어로 코드를 작성하기만 하면 됩니다.  

예측 분석 기법들은 다양한 인더스트리에서 예전부터 자주 활용되는 서비스 중 하나였습니다. 앞으로 이런 서비스는  Machine Learning 기법들을 통해 지속적으로 성능이 향상될 것이고, 더 많은 데이터를 통해 높은 정확도를 제공하는 서비스로 재탄생할 것입니다. Machine Learning 예측 서비스와 Azure Functions을 활용한 배치 작업 및 스케쥴러 서비스는 훌륭한 솔루션이며, 향후 다양한 예측 분석 솔루션 시나리오에서 최고의 사례가 될 것입니다.  

## 추가 리소스
[Azure Functions](https://azure.microsoft.com/en-us/services/functions/)  
[Azure Machine Learning](https://azure.microsoft.com/en-us/overview/machine-learning/)
[Azure Blob storage](https://azure.microsoft.com/en-us/services/storage/blobs/)
[Azure Redis Cache](https://azure.microsoft.com/en-us/services/cache/)
 