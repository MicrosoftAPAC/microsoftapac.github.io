---
layout: post
title:  "마이크로소프트 Azure Machine Learning과 Azure Functions을 이용한 호갱노노 부동산 서비스의 실시간 & 배치 추천 솔루션 구축"
author: "Dae Woo Kim, Hyewon Ryu"
#author-link: "Add author's Twitter URL here"
#author-image: "{{ site.baseurl }}/images/authors/photo.jpg"
date:   2017-03-07
categories: [Azure Machine Learning, Azure Functions]
color: "blue"
image: "images/2017-03-07-hogangnono/hackfest02.png" #should be ~350px tall
excerpt: Hogangnono, a top real estate startup, and Microsoft improve real estate recommendations to captivate more app users.
language: [Korean]
geolocation: [Korea]
verticals: [Facility Management]
---

Key technologies used  
- Azure Machine Learning - Matchbox : 머신러닝 기법을 이용한 부동산 아이템 추천 서비스 구현  
- Azure Functions : 스케쥴러 서비스로 활용해, 머신러닝 학습 모델을 생성 및 [AWS(Amazon Web Service)의 S3](https://aws.amazon.com/s3)로부터 로그 데이터 복사
- Azure Storage Blob, Table : 사용자 로그 분석을 위한 데이터 저장소의 목적으로 Blob Storage 활용 및 사용자의 실시간 부동산 아이템 추천에 대한 로그 데이터 적재 목적으로 Table Storage 사용  
- Azure HDInsight : 대량 사용자 로그 데이터에 대한 기본적인 전처리 및 통계 데이터 확보  

---

호갱노노는 부동산 앱 서비스의 마켓 리더로 30만명이 넘는 사용자들에게 맞춤형 부동산 서비스를 제공하고 있습니다. 서비스의 사용성과 더 많은 사용자에게 유용한 정보를 제공하기 위해 고객 맞춤 추천 서비스를 제공하기 위한 hackfest를 진행했습니다.  

Hackfest 참여 인원 :  
- 안오균 - 호갱노노, 기술이사  
- 김광욱 - 디에스이트레이드, 부장  
- 박고은 - 디에스이트레이드, 대리  
- 구자연 - 디에스이트레이드, 사원  
- 김대우 - 한국마이크로소프트, 부장  
- 배민수 - 한국마이크로소프트, 차장  
- 류혜원 - 한국마이크로소프트, 과장  
- 김은지 - 한국마이크로소프트, 사원  

## 고객 정보
![Hogangnono logo]({{site.baseurl}}/images/2017-03-07-hogangnono/logo.png)  
[호갱노노](https://hogangnono.com/)는 경기도 판교에 위치한 부동산 앱 서비스의 마켓 리더로 30만명이 넘는 사용자들에게 맞춤형 부동산 서비스를 제공하고 있습니다. 호갱노노가 서비스하는 대부분의 정보는 정부가 제공하는 공공데이터를 활용하고 있으며 국토교통부의 주택 실거래가 정보, 보건복지부의 병원 정보, 교육부의 학교 관련 정보 등을 이용해 사용자 대상 맞춤 서비스를 제공하고 있습니다. 호갱노노는 서비스를 AWS에서 운영 중이었으나, 최적의 추천서비스를 위해 여러 서비스를 검토했습니다. 호갱노노는 급성장하는 한국의 유망한 스타트업이자 스타트업들의 롤모델이며, 성장 가능성이 높은 스타트업들을 대상으로 특별히 지원되는 마이크로소프트 BizSpark Plus 파트너사이고, 구성원들은 모두 한국 최대의 포털인 Naver와 Kakao 출신입니다.  

## 고객의 난제
호갱노노는 서비스를 시작한 이후부터 지속적으로 사용자에게 최적화된 부동산 정보를 제공하며 성장하고 있습니다. 스타트업의 가장 큰 고민은 적은 리소스로 빨리 개발하고 빨리 서비스에 적용해야 하는 것입니다.  
사용자가 아파트를 조회하면 항상 주변 추천 아파트를 함께 보고 싶어하는 요구가 있었습니다. 사용자의 조회 패턴을 이해해 정확한 추천을 제공하는것이 서비스의 성장을 이끌어 가기 때문입니다. 이를 위해 호갱노노는 맞춤형 부동산 서비스를 머신러닝 기반 추천 서비스를 활용해 제공할 필요가 있었으나, 워낙에 많은 데이터가 존재하며, 스타트업에게 필수적인 빠른 추천 서비스 기능 개발과 구현 하기 쉽지 않았습니다. 호갱노노는 머신러닝 추천 서비스를 통해 더 많은 사용자를 신규로 유치하고, 지속적인 클릭을 유도해 이탈률을 낮추며 궁극적으로 서비스를 통한 수익 극대화를 위한 머신러닝 기반 추천 서비스가 필요했습니다. 이 문제를 해결하기 위해 호갱노노는 다양한 머신러닝 기술들과 인공지능 서비스들을 조사했고, 최종적으로 마이크로소프트 Cognitive Service와 머신러닝을 도입하기로 결정했습니다. 그 이유는, 마이크로소프트 Azure Machine Learning이 추천 모델을 사용하기 쉽고 빠른 구현이 가능했기 때문이며, 최적의 추천 결과를 아주 짧은 시간 내에 원하는 모든 기능들을 구현할 수 있었기 때문에 도입하게 되었습니다.  

## 솔루션 및 해결 과정
호갱노노는 사용자를 대상으로 유사한 부동산 매물, 사용자 추천 매물과 같은 향상된 실시간 및 배치 기반 인공지능 추천 서비스 제공을 할 필요성이 있었습니다. 마이크로소프트는 이를 위해 대량 Recommendations API 호출 처리를 구현하기 위한  Azure Machine Learning 기반 Matchbox 알고리즘을 이용한 추천 서비스 및 오픈소스 기술인 R arule, Python Apriori Association Rule을 이용한 추천 방안을 제안했습니다.  
이 기술들은 모두 추천 서비스 구현에 일반적으로 사용되는 기술들이지만 약간의 차이가 있습니다. Machine Learning Matchbox는 model workflow 개발에서 데이터의 구조 또는 scoring을 다양한 패턴으로 조절해 원하는 추천 결과를 얻기 위한 다양한 옵션을 조절 가능합니다. Hackfest 팀은 최적의 방안을 선택하기 위해 이 추천 서비스들을 구현했으며, 추가적으로 실제 데이터를 AWS로부터 가져오고 batch 기반 분석 전체 과정을 자동화 시키기 위한 Azure Functions를 제안 했습니다.  

### Hogangnono 서비스 아키텍처 다이어그램  
![Hogangnono Architecture]({{site.baseurl}}/images/2017-03-07-hogangnono/hogangnono-architecture_2.png)  

Hogangnono 팀과 디에스이트레이드, 마이크로소프트는 Azure Machine Learning Matchbox 추천 서비스를 위한 클라우드 기반 아키텍처를 구현하고, 실시간 분석 및 배치 기반 분석 아키텍처를 함께 구성했고 완료 했습니다.  

### Cold path - 배치 분석 과정  
Cold path 과정은 배치 분석 과정을 통해 주기적으로 추천 서비스를 구축해 데이터베이스에 미리 적재 후 사용자의 요청이 있을 경우 보여주기 위한 분석 방안입니다.  
- Batch 분석에 실행되는 데이터는 AWS S3에 존재하고, S3에 bucket으로부터 blob object를 Azure Fuctions를 이용해 Azure Blob Storage로 업로드한다.  
- Azure Functions로 업로드한 로그 데이터는 즉시 이용도 가능하고 Hadoop - HDInsihgt를 이용해 간단하게 전처리 하거나 필요한 통계 정보 추출을 위해 Hive를 이용해 처리하고 완료 후 Blob에 저장한다고 가정한다.  
- HDInsight가 Blob에 파일을 올려 두면, Azure Functions은 Blob trigger를 이용해 자동으로 업로드된 파일을 가져와 이 파일을 각각의 추천 서비스가 요구하는 위치에 업로드 하거나, 예측 분석 결과를 실행하도록 처리한다.  
- 파일 업로드 또는 예측 작업이 추천 서비스로부터 완료되면 Azure Function은 이 완료 결과인 사용자별 추천 아이템(User-to-Items)를 현재 운영 환경인 [AWS의 RDS(Relational Database Service)](https://aws.amazon.com/rds/)에 업로드하고 작업을 완료한다.  

### Hot path - 실시간 예측(추천) 요청 처리  
Hot path는 사용자의 요청을 실시간으로 처리하기 위한 방안을 구현한 것입니다. 예측 분석 서비스에 만들어진 모델에서 실시간으로 추천 결과를 가져옵니다.  
- 이미 실시간 예측에 필요한 예측 분석 결과는 위의 배치 분석 등을 통해 추천 서비스들에 저장된 상태로 가정합니다.  
- AWS의 EC2에서 실행되는 node.js에서 Restful API 방식으로 추천서비스를 호출해 추천 항목들을 받아온 후 log 목적으로 Azure Table Storage에 저장하고, 사용자에게 추천 결과를 제공합니다.  
- 이후 추천 서비스로부터 추천된 항목으로 로그로 저장해, 추천 결과의 정확도 수정에 반영하는 목적으로 재사용이 가능합니다.  

### AWS S3로부터 가져온 데이터를 Azure Blob 저장소로 적재
현재 호갱노노의 서비스는 AWS에서 운영 중입니다. 향상된 인공지능 기반 분석 서비스 구현을 위해 기존의 서비스에 전혀 영향을 주지 않고 분석을 수행하기 원했습니다. 이를 위해 AWS의 S3에 적재되는 로그 데이터를 [Azure의 Blob Storage](https://docs.microsoft.com/en-us/azure/storage/)로 주기적으로 가져올 필요가 있었습니다.  
Azure에서 스케쥴링 작업을 수행할 수 있는 방법은 다양합니다. [Azure Scheduler](https://docs.microsoft.com/en-us/azure/scheduler/), [Web Job](https://docs.microsoft.com/en-us/azure/app-service-web/websites-webjobs-resources), [Function App](https://docs.microsoft.com/en-us/azure/azure-functions/) 등의 다양한 서비스를 고려할 수 있습니다. Hackfest 동안 이런 스케쥴러의 장단점과 주요한 서비스를 검토 했으며, server-less 코딩 및 이런 경우 batch 분석을 위한 blob 트리거 및 timer 트리거, 그리고 그 이후 필요시 수행 가능한 webhook 등을 자동으로 처리해 코드에만 집중 할 수 있는 [Azure function app](https://docs.microsoft.com/en-us/azure/azure-functions/)을 선택하였습니다.  

특히, 호갱노노의 현재 데이터는 S3에 1시간 간격으로 적재하는 중이었기 때문에 Azure Functions의 timer 트리거를 이용해 1시간 간격으로 AWS의 S3로부터 데이터를 가져와 Azure Blob Storage로 업로드하는 코드를 구현했습니다.  

  

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

호갱노노는 node.js를 이용해 서비스를 개발, 운영하고 있었습니다. Azure Functions에서 기본 제공하지 않는 AWS의 S3를 사용하기 위한 node package를 추가로 설정하려면, Kudu에서 추가하고 아래 과정을 통해 "npm install" 명령을 수행해 구성합니다.  

package.json 파일  


```
{
    "dependencies": {
        "aws-sdk": ">= 2.0.9",
        "node-uuid": ">= 1.4.1"
    }
}
```
[Azure Functions - Node Version & Package Management](https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference-node#node-version--package-management)  

Azure Functions에서 node.js로 AWS S3의 blob을 이전하는 과정은 아래 Github repo에서 전체 코드를 확인 가능합니다.  

[Hackfest Azure function app code repo](https://github.com/hnn-project/azure-function)  

이렇게 AWS S3로부터 blob을 Azure Functions를 이용해 Azure Blob Storage로 이전이 가능합니다.  

### HDInsight - Hadoop big data를 이용한 로그 데이터 전처리  
일반적으로 간단한 데이터 형변환을 위해 기본 S3에 적재되는 JSON 형태의 데이터를 Azure Functions 에서 Deserialize 후 CSV 형태 등으로 손쉽게 변환시킬 수 있습니다. 하지만, 로그 크기가 매우 방대해 전처리나 로그 데이터 형변환이 어려워지고, 관리 및 모니터링을 위해 로그 데이터에서 insight를 얻어야 할 경우가 있습니다. 이를 위해 Hackfest 과정에서 간략히 HDInsight - Hadoop을 이용해 데이터를 분석하는 과정을 수행했습니다.  

[Hackfest HDInsight 전체 리포지토리 경로](https://github.com/hnn-project/azure-content)  

- HDInsight를 활성화 시키고 Hadoop 서비스 동작 방식과 구조에 대한 이해  
- Ambari를 이용해 관리 포털에서 Hive 쿼리 수행  
- 전체 workflow는 Azure Data Factory를 통해 이루어진다고 가정(Hackfest 에서 리뷰하지 않음)  
- 데이터는 약 1만건 정도의 CSV 파일  
- 약 30여개의 부동산 지역이 있다고 가정하고, 어느 지역에 가장 많이 사용자가 오래 체류하는지 분석한다고 가정  

이 외에도 다양한 Hadoop 분석 시나리오를 도출 가능합니다. 예를 들어,  
- 주요 부동산 매물들의 조회량 변화 추이  
- Feature별로 group된 부동산 정보  

등의 다양한 log를 활용한 시나리오를 저장소와 Hadoop - Big data로 분석 가능합니다.  

![Hogangnono hakcfest]({{site.baseurl}}/images/2017-03-07-hogangnono/hackfest01.png)  

## 추천서비스(Recommendation service)  
추천 서비스는 프로젝트의 핵심적인 요소로 hackfest 기간 동안 다양한 형태로 평가했고, 많은 시간을 할애한 부분이었습니다. 우리는 미리 아래 3가지의 추천 기술들을 준비해 실제 hackfest 기간 동안 수행하고 비교해 적합한 최선의 추천 서비스를 얻는 것을 목표로 진행했습니다.  

- Azure Machine Learning matchbox  
- R / arules - Association rules  
- Python / Apriori  

### Azure Machine Learning matchbox  
Azure Machine Learning의 Recommender 모듈을 이용하는 matchbox 알고리듬은 추천 서비스에 적용이 가능하고 다양한 소셜미디어 사이트나 대부분의 종류의 이커머스 사이트, 검색 엔진의 스폰서 검색결과 등에 실제 이용되고 있습니다.  
특히, Azure Machine Learning은 PaaS 기반 서비스를 제공해 개발자는 인프라에 대한 고려 없이 안정적으로 추천 서비스를 제공 가능한 장점이 있을 뿐만 아니라, Restful API로 손쉽게 추천 모델을 배포가 가능하고, Batch Traning 과정을 Azure Functions를 활용해 실행도 가능합니다.  

호갱노노 역시 부동산 아이템에 대해 즉각적인 아이템 추천 및 사용자 추천을 제공하기 위해 이미 Azure Machine Learning의 matchbox를 고려하고 있었고 좀더 추천의 정확도를 높이는 방법이 필요했습니다. Hackfest기간 동안 우리는 마이크로소프트의 머신러닝 파트너이자 국내 최고의 분석 서비스 컨설팅 제공사인 디에스이트레이드와 함께 matchbox 모듈을 적용해 볼 수 있었습니다.  

![Hogangnono Azure Machine Learning Matchbox]({{site.baseurl}}/images/2017-03-07-hogangnono/hogangnono-matchbox01.png)  

Matchbox는 기본적으로 사용자가 보유한 아이템을 기준으로 유사도가 높은 아이템을 추천하는 시스템입니다. 사용자가 아이템을 구매한 트렌젝션 당 점수(스코어)를 기준으로 유사도를 도출하며 구매한 정보가 많을수록 높은 정확도의 추천 결과를 얻을 수 있습니다.  

![Hogangnono Azure Machine Learning Matchbox]({{site.baseurl}}/images/2017-03-07-hogangnono/hogangnono-matchbox02.png)  

#### Matchbox 데이터
Matchbox 알고리듬은 기본적으로 다음 세가지의 데이터를 제공해야 합니다.  
- Item 정보  
- User 정보  
- User-Item 스코어 정보  

이 정보들을 이용해 추천합니다.  

![Hogangnono Azure Machine Learning Matchbox]({{site.baseurl}}/images/2017-03-07-hogangnono/hogangnono-matchbox03.png)  

User to Item 추천 결과는 일반적으로 이렇게 추천 결과가 제공됩니다.  

![Hogangnono Azure Machine Learning Matchbox]({{site.baseurl}}/images/2017-03-07-hogangnono/hogangnono-matchbox04.png)  

Hackfest 기간 동안 matchbox 구현을 위해 위와같은 형태로 모델을 구축했습니니다. 물론, 데이터에 대한 기본적인 전처리 과정(data wrangling)은 포함하지 않았고, 호갱노노의 데이터 보호를 위해 예제 데이터를 활용했습니다.  

#### Matchbox 스코어링
Matchbox에서 정확도를 높이기 위해서는 스코어링(Scoring)이 매우 중요하게 적용됩니다. 즉, 어떤 정보에 가중치를 제공해 유사도를 높여 반영할지 판단해야 합니니다. 예를 들어, 부동산 서비스 비즈니스에 대한 추천일 경우에 이 스코어정보를 위해 추가적인 다양한 feature를 만들어 사용합니다. 단순히 고객정보만을 활용하는 것이 아니라,  
- 최근에 방문 수  
- 추가한 즐겨찾기 항목  
- 방문별 취한 액션(평형 정보를 보거나, 교통 정보를 조회 하거나)  
  
이런 다양한 정보를 활용해 스코어를 만드는 것이 중요합니다.  

스코어링을 위해 일반적인 비즈니스에서는 RFM을 이용합니다.  
R- 가장 최근 접속해 구매한 기간 (오늘 - 마지막 구매일을 시간으로 변환)  
F- 얼마나 자주 구매했는지, 구매 빈도 수치  
M- 얼마나 많은 금액을 썼는지  
와 같은 정보입니다.  

[RFM - customer value](https://en.wikipedia.org/wiki/RFM_(customer_value))  

예를 들어, 한번 구매할때 많이 샀는지? 여러번 구매를 했으나 적은 금액만 구매 했는지? 등에 따라서 분류하기 때문입니다. 6개월 전에는 자주 왔으나, 이사를 가서 자주 안 올 경우도 하나의 지표로 판단 가능할 것 입니다.  
이렇게 일반적으로 RFM으로 이용하면 상품 하나하나와 고객의 매칭된 정보로 볼 수 있습니다.  

보통 물류/유통 비즈니스에서 사용되지만, 부동산 정보에서도 유사한 정보를 취합할 수 있을 것이고, 예를 들어, 매물간 거리(매물 주소 정보를 활용한 등의 정보가 주요할 것입니다.  

또한, 사용자를 단순 분류(classification)만 하는 것이 아니라, 사용자 별 10단계로 나누고 각 단계별로 차별화된 마케팅이나 등급 업을 위한 추천도 가능합니다. 예를 들어, 단계별로, 추천을 할 타겟 고객을 뽑아서 추천 상품을 push 알림 등으로 발송하고 그 결과로 추천의 정확도를 어느 정도 평가할 수 있습니다. 문자나 푸쉬알림을 무작위로 보내는 것이 아니기 때문에 더 정확도가 높은 결과를 얻을 수도 있습니다.  

#### Feature 제어
RFM 방식이 일반적인 방식이지만, 다양하고 복잡한 수백여개의 feature들간에 어느 feature에 가중치를 둬야 할지 판단이 어려울 수 있습니다. 이 경우 PCA 분석 기법도 고려할 수 있습니다.  

주성분 분석 - 스코어링 = PCA 방식 = 어디에 가중치를 두어야 하는지가 이 부분에서 등장합니다.  
[Principal component analysis](https://en.wikipedia.org/wiki/Principal_component_analysis)  

PCA는 피처를 줄이는 기법으로 피처가 200개 정도 존재할 경우, PCA 과정을 통해 5개 정도로 추릴 수 있습니다.  
가중치는 PCA를 돌려 보고 숫자를 결정합니다. 회귀계수 또는 상관계수를 이용하여, 유의한지 여부를 결정할 수 있습니다. 이 가중치를 레이팅 등의 스코어링에 사용할 수 있습니다.  

[R과 Python에서 PCA 분석을 사용하는 예제 코드](https://www.analyticsvidhya.com/blog/2016/03/practical-guide-principal-component-analysis-python/)  

높은 스코어의 추천만 나타나기 때문에 정확한 추천이 어려워 질 수 있으므로, 스코어링이 한쪽에만 치우치지 않도록 주의해야 합니다. 예를 들어, 일반적으로 많이 검색되고 조회되는 서울, 경기도만 주로 보이게 되는 문제가 발생할 수 있기 때문에 필터링 작업이 필요합니다. 땅끝마을 근처에 사는 살고 있어서, 땅끝마을 부근의 정보를 확인하고 싶은 경우에도 서울 및 경기도만 보이는 문제가 발생할 수 있습니다. 이러한 경우 거리 정보에 높은 스코어링을 매길 수 있을 것 입니다.  

#### Matchbox 모델 구현
Hackfest에서 matchbox 모델을 구현하기 위해 검토한 예제 모델들은 아래와 같습니다. 튜토리얼과 좋은 데이터셋이 잘 마련되어 있어서 쉽게 적용이 가능합니다. 호갱노노의 경우 실제 데이터를 matchbox에 올리기 위해 여러 보간법을 활용했고 hackfest 동안 알게된 위의 고려 사항들과 추가적인 데이터 취합 노하우를 지속적으로 서비스에 적용 중 입니다.  

[Matchbox 튜토리얼](https://gallery.cortanaintelligence.com/Tutorial/8-Recommendation-System-1)  

[영화 추천](https://gallery.cortanaintelligence.com/Experiment/Recommender-Movie-recommendation-3)  

[레스토랑 추천](https://gallery.cortanaintelligence.com/Experiment/Recommender-Restaurant-ratings-2)  

이렇게 Azure Machine Learning의 Matchbox 추천 모듈을 알아 보았고, 이후에는 R과 Python에서 일반적으로 사용되고 있는 연관성 분석도 hackfest 기간 동안 살펴 보았습니다.  

### R / arules - Association rules  
연관성 분석은 업계에서 shopping cart 분석으로 알려져 있으며, 복수 발생한 거래 또는 트렌젝션에서 규칙을 찾아내는 분석방법 입니다.  

[Association rule learning](https://en.wikipedia.org/wiki/Association_rule_learning)  

월마트 사례로도 많이 알려져 있는 맥주와 기저귀의 사례로도 유명하며, 아내의 부탁으로 기저귀를 사러 온 남성들이 맥주도 같이 구매하는 패턴이 발견된 사례로도 알려져 있습니다. 업계에서 많이 사용되었고, 일반화된 연유는 이 연관 분석을 활용해 함께 잘 팔리는 상품의 패턴을 알아내서 cross-sell이나 up-sell 또는 상품 진열 전략에도 활용 가능하기 때문입니다.  

#### R apriori 함수
R의 arules 패키지 내의 apriori 함수를 활용해 연관성 규칙을 발견 할 수 있습니다. apriori 함수는 최소 지지도(support)에 의해 가지치기를 하는 알고리듬입니다.  

**A. 지지도 (Support)**  
: 전체 거래에서 특정 물품 A와 B가 동시에 거래되는 비중으로, 해당 규칙이 얼마나 의미가 있는 규칙인지 알 수 있음  
=P(A∩B) : A 와 B가 동시에 일어난 횟수 / 전체 거래 횟수  

**B. 신뢰도 (Confidence)**  
: A 를 포함하는 거래 중 A와 B가 동시에 거래되는 비중으로,  
A라는 사건이 발생했을 때 B가 발생할 확률이 얼마나 높은지 알 수 있음  
= P(A∩B) / A): A와 B가 동시에 일어난 횟수 / A가 일어난 횟수  

**C. 향상도 (Lift)**  
: A 와 B가 동시에 거래된 비중을 A와 B가 서로 독립된 사건 일 때 동시에 거래된 비중으로 나눈 값. 즉, A 와 B가 우연에 의해서 같이 거래된 확률보다 A와 B 사이의 관계가 얼마나 더 우월 한지 보는 지표 입니다.  
= P(A∩B) / A)* P(B|A) : A 와 B가 동시에 일어난 횟수 / A, B가 독립된 사건일 때 A,B가 동시에 일어날 확률  

품목 A와 B사이에 아무런 관계가 상호 관계가 없다면 향상도 = 1.  
향상도 1보다 높아질 수록 이 규칙은 우연히 일어나지 않았다는 강한 표시로 볼 수 있습니다.  

Parameter|Description|Default value
---|---|---|
support|규칙의 최소 지지도|0.1
confidence|규칙의 최소 신뢰도|0.8
minlen|규칙에 포함되는 최소 물품 수|1
maxlen|규칙에 포함되는 최대 물품 수|10
smax|규칙의 최대 지지도|1
  

#### R apriori 함수 실행코드  
[Hogangnono hackfest arules repo](https://github.com/hnn-project/r-arules)  
[r-aules-script.R 파일을 이용해 Association Rule 수행](https://github.com/hnn-project/r-arules)  

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

![R arules plot]({{site.baseurl}}/images/2017-03-07-hogangnono/aurles-plot-00.png)  
  
#### Hackfest와 R arules
연관 규칙을 찾는 데는 유용했지만 이번 hackfest의 목표와는 거리가 있었고, 연관 규칙 자체만으로 호갱노노가 기대하는 다양한 요구를 맞추기는 어려웠습니다. 하지만, 향후 연관 규칙과 유사한 프로젝트를 진행하는 개발자들에게 분명 많은 도움이 되리라 예상됩니다.  

아래는 arule을 구현한 Azure Machine Learning의 Association Rules custom module이며 이 프로젝트를 그대로 Machine Learning Studio에서 실행해 R arule을 구현 할 수 있습니다.  

[Azure Machine Learning Studio - Discover Association Rules](https://gallery.cortanaintelligence.com/CustomModule/Discover-Association-Rules-1)  

### Python / Apriori  
Association Rule은 R 뿐만 아니라 다른 언어나 개발자 ecosystem에서 다양하게 활용되는 알고리듬입니다. Python에서도 이 Assoication Rule을 구현하는 방법에 대한 많은 논의가 있었고 여러 OSS 프로젝트로 공개되어 있습니다. 특히, Python 은 개발자들에게 매우 인기가 있으며, 접근성이 좋고, 데이터 분석 과정에 특화된 [NumPy](http://www.numpy.org/) 및 [pandas](http://pandas.pydata.org/) 등을 지원하고 있으며, [scikit-learn](http://scikit-learn.org) 과 같은 다양한 머신러닝 라이브러리를 제공하고 있습니다. 마찬가지로, arule의 apriori function 역시 python에서 OSS로 공개된 프로젝트가 여러건 있었으며, hackfest에서 검토하였습니다.  

#### tesco.csv 데이터와 구조  
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

apriori.py 라는 파이선 코드와 tesco.csv 데이터 파일을 이용하여 지지도 0.17 및 신뢰도 0.68 이상의 데이터를 추출하는 명령어 입니다.  

```
python apriori.py -f tesco.csv -s 0.17 -c 0.68
```

![Python apriori result]({{site.baseurl}}/images/2017-03-07-hogangnono/python-apriori-result.png)  

#### Python apriori 함수 코드
Python으로 호출하는 더 상세한 방안을 아래 hackfest 리포지토리에서 확인 하실 수 있습니다.  

[hackfest python-apriori repo](https://github.com/hnn-project/python-apriori)  
[asaini/Apriori project](https://github.com/asaini/Apriori)  


### 분석 결과를 Function App을 이용해 AWS의 RDS로 저장  
Azure Machine Learning matchbox, R과 Python Assocation Rule을 이용하여 어떤 형태로 추천 서비스를 활용할 수 있을지 확인해 보았습니다. 대부분의 경우 실시간 서비스에 활용되는 것이 일반적이지만, FBT나 I2I, U2I 모두 미리 추천된 결과를 받아 Database에 저장 후 활용되는 시나리오 역시 고려해볼 수 있었습니다.  
Azure Machine Learning에서 실행 가능한 matchbox는 batch mode를 이용해 예측 분석이 가능합니다.  
우리는 이런 상황을 고려해 분석된 결과를 현재 호갱노노가 사용하는 AWS RDS의 MySQL에 load하는 과정을 수행할 필요가 있었고, 이 과정은 server-less 환경으로 동작하는 Azure Function으로 수행할 경우 최선의 방안이었습니다.  

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
[Hackfest Azure Functions을 이용한 storage to mysql 전체 코드 링크](https://github.com/hnn-project/azure-function/blob/master/nodejs/azure-storage-to-mysql.js)  

### 실시간 추천 사용  
AWS의 EC2에 위치한 node.js에서 실시간으로 요청하는 상황으로 가정합니다. 위의 과정에서도 일부 소개된 것처럼, 간략히 request를 수행하고, response 받은 데이터를 로그 목적으로 table 저장소로 저장시킨 후 사용자에게 결과를 리턴합니다.  

#### Azure Table Storgae
Azure Table Storage는 Key/Value 기반의 NoSQL 저장소로 C# 뿐만 아니라, node.js 등의 다양한 언어에서 손쉽게 사용 가능한 Proxy 함수를 제공하며, 영구적인(Persistent) 저장소이기 때문에 향후 로그 분석에 활용 가능한 저장소로 최적의 선택이었습니다.  

Table Storage의 Partition Key와 RowKey를 각각 사용자 ID, GUID로 저장한 후 Log 목적으로 Azure Machine Learning으로부터 받은 response JSON을 그대로 Table Storage에 저장하는 작업을 수행합니다.  

Azure Table Storage에 적용 여부 확인 및 개발/테스트를 위해 Azure Storage Explorer 툴을 사용하였습니다.  
[Azure Storage Explorer](http://storageexplorer.com/)  

#### Restful API 개발 및 테스트
Hackfest에서는 Restful API를 손쉽게 호출하기 위한 개발 및 디버깅 도구인 [Postman](https://www.getpostman.com/)을 이용했고, Postman으로 Rest API를 테스트하고 이를 node의 Request Package를 이용해 호출하는 방안을 이용했습니다.  

- Postman을 이용해 Rest API를 호출 테스트 생성  
- node.js에서 Request 수행해 Recommendation을 받음  
- 추천된 결과를 NoSQL – Azure Table Storage에 적재  
- User에게 Recommendation 받은 결과를 전달  

[Hackfest 리포 코드 링크](https://github.com/hnn-project/azure-function/blob/master/nodejs/cognitive-api-to-table.js)  

이렇게 전체 Recommendations를 위한 워크플로우를 완성할 수 있었습니다.  

### 결론  
추천 서비스를 구현하기 위해, 빠르고 쉬운 구성은 물론 정확한 예측까지 제공하고 예측된 결과를 손쉽게 배포 가능한 기존의 서비스를 활용할 필요가 있었습니다.  

Hackfest 기간 동안 호갱노노는 실시간 추천 모델과 배치 추천 모델의 전체 솔루션 아키텍처를 구현하고 개발할 수 있었습니다. 추천 서비스를 구현하기 위해 여러 대안기술들을 검토했으나, 최종적으로 마이크로소프트를 선택했습니다. 마이크로소프트는 추천서비스 구현에 필요한 모든 기술들을 제공하고 있기 때문입니다.  
마이크로소프트, 머신러닝 전문가 그룹인 디에스이트레이드와의 Hackfest를 통해 호갱노노는 성공적으로 node.js에서  Restful API 방식으로 다양한 Azure Machine Learning 기반 서비스를 활용할 수 있었고, Azure Functions을 활용해 높은 확장성을 가지며 관리 포인트가 줄어든 서비스를 구축할 수 있었고, 개발팀은 오직 코드에만 집중하여 빠르게 구현할 수 있었습니다. 특히 server-less 서비스인 Azure Functions에서 node.js를 이용해 기존 개발 패턴과 똑같이 이용 할 수 있었고, 이벤트 트리거를 코드 한 줄 없이 구현하여, 백엔드 추천 로직을 인프라 없이 코드로 Azure Functions에서 쉽게 구현할 수 있었습니다.  

> 호갱노노와 같은 스타트업에게는, 필요한 서비스를 PaaS 기반으로 짧은 시간내에 높은 수준으로 구현것이 가장 중요하다. 여러 추천 서비스들을 검토 하던 중, Azure의 Machine Learning Matchbox 서비스들을 접하게 되었고, PaaS로 머신러닝 추천 서비스를 즉시 생성 후 추천을 받을 수 있어서 우리에게 필요한 분석/예측 서비스들을 별다른 준비 과정이나 추가 인프라 생성/유지 없이 빠른 시간내에 구축 가능했다. - 호갱노노 심상민 대표
  

> 사용자가 아파트를 조회하면 항상 주변 추천 아파트를 함께 보고 싶어하는 요구가 있었다. Hackfest 진행 중, Azure Machine Learning Matchbox는 짧은 시간에 대단히 좋은 품질을 만들 수 있었다. 또한, Azure Function을 이용해 자동화 과정을 구현하는 것은 물론, 로그를 적재/분석 후 다시 Machine Learning으로 학습하는 과정을 생각보다 짧은 시간내에 구현 가능해서 좋았다. 뿐만아니라, Server-less 개발 방식의 Azure Function을 활용해 기존의 AWS 인프라와 연동 아무 인터럽트 없이 구축 가능했다.  추천 서비스를 빠르게 구축하기 희망하는 다른 스타트업들에게도 Azure Machine Learning을 추천하고 싶다. - 호갱노노 안오균 기술이사

![Hogangnono hakcfest]({{site.baseurl}}/images/2017-03-07-hogangnono/hackfest02.png)  

### Hackfest를 통해
인공지능 기반 추천 서비스를 구현하기 위해 고객은 IaaS기반 가상머신에 필요한 인프라를 구축하고 직접 분석 어플리케이션을 올려 구현해야 했습니다. 그러나, Azure Machine Learning를 통해 더 빠르고 손쉬운 추천 서비스를 구현해 가장 중요한 회사의 추천 로직과 다양한 이탈을 막는 지속 가능한 서비스를 구현할 수 있었으며 더 빠르고 기민하게 비즈니스 요구에 대응할 수 있었습니다.  

예전에는, 대량 배치 분석을 분석 서비스에서 수행하기 위해 직접 트리거를 만들어 처리 상태와 업데이트 상태를 직접 체크해야 했으며, 이를 구현하기 위해 고객은 직접 스케쥴러 프로세스 데몬을 올리고, 상태 등을 지속적으로 polling하는 로직을 구현해야 했습니다. 그러나, Azure Function은 모든 것을 바꾸었습니다. 타이머와 Blob 컨테이너 뿐만 아니라, 다양한 객체들에 대해 트리거 이벤트를 받을 수 있어서 손쉬운 개발이 가능해 졌습니다.  
Azure Function이 타이머를 트리거 할 수 있기 때문에 AWS의 S3 데이터를 주기적으로 바로 server-less로 가져올 수 있었고, Blob 컨테이너를 트리거 할 수 있기 때문에, 호갱노노는 대량 분석 데이터를 Blob 컨테이너에 업로드만 하면 되었고, 배치 분석 작업이 종료되면 발생하는 추가 트리거 이벤트를 데이터를 기존 DBMS에 로드하는 로직을 Azure Function으로 구현 가능했습니다. 즉, 인프라스트럭처 구축이나 polling 프로세스 또는 데몬 프로세스 트리거 없이 바로 그들이 선호하는 언어로 코드를 작성하기만 하면 됩니다.  

추천 서비스는 다양한 인더스트리에서 예전부터 자주 활용되는 서비스 중 하나였습니다. 앞으로 이런 추천 서비스는  Machine Learning 기법들을 통해 지속적으로 성능이 향상될 것이고, 고객의 데이터와 함께 정확한 추천이 제공될 것입니다. Machine Learning 추천 예측 서비스와 Azure Functions을 활용한 배치 작업 및 스케쥴러 서비스는 훌륭한 솔루션이며, 향후 다양한 추천 및 예측 분석 솔루션 시나리오에서 최고의 사례가 될 것입니다.  
 