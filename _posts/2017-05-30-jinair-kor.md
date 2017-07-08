---
layout: post
title:  "진에어 고객지원 챗봇 서비스 구축"
author: "오일석, 류혜원"
author-link: "http://ilseokoh.com"
#author-image: "{{ site.baseurl }}/images/authors/photo.jpg"
date:   2017-05-26
categories: [Bot Framework,Azure Search,Azure Cosmos DB,Azure Web App,Cognitive Services-LUIS]
color: "blue"
image: "images/jinair/jinair-title.jpg" #should be ~350px tall
excerpt: "진에어는 고객지원을 더욱 효과적으로 하기위해 마이크로소프트 Bot Framework, 인지서비스를 사용하여 챗봇서비스를 구현했다."
language: [Korean]
verticals: ["Transportation & Logistics"]
geolocation: [Korea]
permalink: "/2017-05-26-jinair-kor.html"
---

진에어는 국내 저가항공사의 대표 기업으로 국내 뿐만 아니라 아시아 지역에서도 항공 서비스를 제공하고 있으며 전화를 통한 고객지원 서비스의 효율을 높이고 고객의 만족도를 높이기 위해 챗봇 서비스 도입을 적극 검토하고 있다. 챗봇의 지원 서비스는 항공권 예약조회, 항공기의 출도착조회, 항공 스케줄조회, 서비스문의 이렇게 4가지이다. 자연스러운 대화 형식으로 고객이 필요한 정보를 제공하고 4가지 언어 지원과 다양한 메신저 채널을 지원하는 것이 목표다. 

Core Team 
- 이정철: 진에어 IT 전략팀, 부장
- 김현석: 진에어 IT 전략팀, 과장
- 정미연: 진에어 IT 전략팀, 사원
- 김영천: 한진정보통신 진에어 SM그룹, 부장
- 김태우: 한진정보통신 진에어 SM그룹, 대리
- 정신철: 한진정보통신 진에어 SM그룹, 대리
- 김은희: 한진정보통신 디지털테크그룹, 차장
- 오일석: 마이크로소프트, Technical Evangelist
- 류혜원: 마이크로소프트, Audience Evangelism Manager

사용한 기술

- [Microsoft Bot Framework](https://dev.botframework.com/): Bot Builder .NET SDK 3.8, Direct Line REST API 3.0
- [Cognitive Services](https://azure.microsoft.com/ko-kr/services/cognitive-services/): LUIS(Language Understanding Intelligent Service)
- [Azure Search](https://azure.microsoft.com/ko-kr/services/search/), Azure Cosmos DB, Azure Web App
- [카카오 플러스친구](https://www.kakao.com/helps?category=29&locale=ko&service=8) API 2.0
- [Visual Studio 2017](https://www.visualstudio.com/ko/), C#
- Conversation Channels: Skype, Facebook messenger, Web Chat, 카카오톡

 ![JIN air]({{ site.baseurl }}/images/jinair/cognitivjinair.png)

## 고객사 ##
[진에어](http://www.jinair.com/)는 2008년 설립된 국내의 대표적인 LCC(low Cost Carrier)이다. 국내 LCC중 동남아 최다 노선을 보유하고 있으며 매년마다 신규 노선을 빠르게 늘리고 있어 2016년 기준으로 국내 5개 도시 및 22개의 해외 도시 운항을 하고 있다. 특히 글로벌 비즈니스를 위해서 국내외 총 30개의 지점을 보유하고 있으며 WIFI를 활용한 기내 엔터테인먼트 서비스(JINI PLAY)를 도입하는 등 업계에서 IT의 선진 기업의 이미지를 확보하기 위해 노력하고 있다.  
 
## 고객의 난제 ##
진에어의 고객들은 예약정보나 항공정보를 이용하기 위해 고객센터로 전화를 하거나 홈페이지를 통해서 정보를 조회한다. 하지만 전화를 통한 고객 서비스는 비용이 많이 들고 늘어나는 고객 요청에 빠르게 응답하기에는 부족함이 있다. 따라서 예약정보와 같이 간단한 질문에 대한 응답은 챗봇을 통해서 서비스하여 고객의 만족도를 높이고 싶다. 

여러 아시아 국가에 항공서비스를 제공하고 있는 진에어는 한국어, 영어, 중국어, 일본어 이렇게 4가지 언어를 통해서 고객서비스를 제공하고 있다. 챗봇 서비스가 자리를 잡으려면 4가지 언어에 대해서 자연스러운 자연어 처리가 필요하고 항공 서비스에서 사용하는 용어들, 예를 들어 공항이름, 취항 도시이름 등을 잘 인식해야 한다. 또한 한국인 고객이 많기 때문에 메신저 시장점유율 95%인 [카카오톡](http://www.kakao.com/talk/ko)을 반드시 지원해야 한다.
 
## 솔루션 ##

![Jinair chatbot architecture diagram]({{ site.baseurl }}/images/jinair/jinair-architecture-diagram.png)

전체 챗봇 서비스는 위의 아키텍쳐 다이어그램과 같다. 실제 사용자들이 사용하는 각종 메신저 채널, 챗봇 애플리케이션, 검색과 진에어 API 이렇게 3가지로 나눌 수 있다.  

1. 지원하는 메신저 채널은 기존 Microsoft Bot Framework의 공식 채널인 Facebook 메신저, Skype 메신저, 웹 페이지에 넣을 수 있는 웹 메신저를 포함하고 진에어 주요 고객인 한국인들의 많이 사용하는 카카오톡을 연결했다. 
1. 챗봇 애플리케이션은 Microsoft Bot Builder .NET SDK 3.8을 사용하여 Visual Studio 2017에서 C# 언어를 이용하여 개발했다. 
1. 자연어 처리를 위해서 [Microsoft Cognitive 서비스](https://azure.microsoft.com/ko-kr/services/cognitive-services/) 중에서 언어 인식 인텔리전트 서비스(LUIS, Language Understand Intelligent Service)를 사용했다. 
1. 백엔드 서비스는 서비스 문의에 대한 검색과 진에어 내부 API 호출 부분이다. Azure Cosmos DB를 DocumentDB API로 만들어서 FAQ 데이터를 넣고 Azure Search를 연결하여 검색용 인텍스를 생성했다. 

전체 서비스는 Azure 위에서 운영된다.

## Technical delivery ##

### 카카오톡 지원 ###
카카오톡은 Microsoft Bot Framework에서 공식적으로 지원하는 메신저가 아니다. 따라서 연결을 위해서 추가개발이 필요하다. 카카오톡의 API 서비스 중에 [카카오 플러스친구](https://pf.kakao.com) API가 있다. 카카오 플러스친구는 원래 쇼핑몰 운영자나 기업의 마케팅 담당자들이 고객 카카오톡을 통해 대화를 주고 받은 서비스인데 자동으로 응답 할 수 있는 API를 제공한다. 그리고 Bot Framework는 [Direct Line REST API](https://docs.botframework.com/en-us/restapi/directline3/)를 제공하여 메신저 채널과 Bot Framework, 정확히 말해서는 Bot Connector와 연결할 수 있도록 했다. 이 두가지 API를 웹 애플리케이션을 통해서 서로 연결해주면 카카오톡과 챗봇이 대화를 할 수 있다. 

![Kakao Talk connection diagram]({{ site.baseurl }}/images/jinair/plus-api-diagram.png)

플러스 친구 API는 4가지 API 스팩(Keyboard, message, friend, chat_room)이 있는데 이중에 message API가 대화를 주고 받을 때 사용한다. 카카오 톡에서 사용자가 입력한 메시지는 ASP.NET MVC로 구현된 웹 애플리케이션에서 받아서 Direct Line API의 데이터 타입인 Activity로 만들어서 Bot Connector에 전달하면 챗봇까지 메시지가 전달된다. 챗봇이 백엔드 서비스를 사용해 만든 응답 메시지는 다시 웹 애플리케이션에서 받아서 카카오톡이 사용하는 메시지 타입으로 변환하여 전달한다. 

``` c#
[AcceptVerbs(HttpVerbs.Post)]
public async Task<ActionResult> Index(string user_key, string type, string content)
{
    try
    {
        // covert from Kakao talk message to Bot Builder Activity
        Activity activity = new Activity
        {
            From = new ChannelAccount(user_key),
            Type = ActivityTypes.Message
        };
        if (type == "text") activity.Text = content; // text
        else if (type == "photo")                    // image from Kakao Talk
        {
            activity.Attachments = new List<Attachment>();
            activity.Attachments.Add(new Attachment
            {
                ContentUrl = content
            });
        }

        // Send activity to Bot and Polling to receive Activity from Bot
        var response = await conversationService.SendAndReceiveMessageAsync(user_key, activity);
        // response has multiple activities
        // Here is the cap between Activity type and Kakao message type
        var msg = MessageConvertor.DirectLineToKakao(response);

        // Send to Kakao talk
        return Json(msg);
    }
    catch (Exception ex)
    {
        throw new InvalidOperationException("Direct Line Error", ex);
    }
}
```

구조는 단순하지만 두 API의 차이점 때문에 몇 가지 제약사항이 생긴다. Bot Framework의 Acitity 타입은 텍스트, 이미지, 카드, 버튼을 여러개를 사용하여 다양한 표현이 가능하지만 카카톡의 메시지 구조는 텍스트 1개, 이미지 1개로 표현해야하는 차이점 때문에 한계를 가지고 있다. 예를들어 챗봇은 사용자가 조회한 항공기 출도착 정보를 여러개의 이미지로 만들어 메시전에 전달하지만 카카오톡은 여러 이미지를 표현하기 못하기 때문에 그 중 하나의 이미지만 보여줄 수 밖에 없다. 이 경우는 전체 내용을 하나의 이미지로 렌더링 해서 보여주는 방법을 사용해야만 했다. 

### 백엔드 서비스 
진에어 서비스 팀에서는 고객들의 다양한 질문을 FAQ로 만들어 지속적으로 [홈페이지에 게시](http://www.jinair.com/HOM/FAQ/FAQ01List.aspx)한다. 이 데이터를 그대로 챗봇 서비스에서 사용하기로 했다. 마이크로소프트의 Cognitive 서비스 중에 QnA Maker라는 서비스를 사용하면 구현이 가능해서 적용해봤지만 고객의 질문에 대한 다양한 검색이 어려워서 검색엔진을 사용하기로 했다. Azure Cosmos DB를 DocumentDB API로 만들어서 FAQ 데이터를 넣고 Azure Serach를 붙여서 인덱스를 생성할 수 있다. 이 방법은 코드를 작성하지 않고 Azure 포털을 통해서 진행 할 수 있다. [참조 문서: [DocumentDB를 Azure 검색에 연결](https://docs.microsoft.com/ko-kr/azure/search/search-howto-index-documentdb)] 

![Azure Cosmos DB - Azure Search]({{ site.baseurl }}/images/jinair/azure-cosmosdb-search.png)

Cosmos DB의 문서는 질문, 답변, 카테고리, 언어 데이터가 들어있고 이 데이터를 그대로 Azure Search의 인덱스로 만들면서 각 데이터를 검색, 필터링, 정렬 등이 가능하도록 설정했다. 이렇게 만든 Azure Serach에 쿼리만 잘 던지면 검색이 가능하다. 검색은 [Microsoft.Azure.Search 라이브러리](https://www.nuget.org/packages/Microsoft.Azure.Search)를 Nuget에서 받아서 사용하면 간단한 코드로 검색을 수행 할 수 있다. 더 중요한 것은 사용자의 질문에서 검색어를 어떻게 찾아낼 것인가에 있다. 

``` c#
public async Task<DocumentSearchResult<T>> Search<T>(string searchText) where T : class
{
    try
    {
      // Create an HTTP reference to the catalog index
      ISearchServiceClient _searchClient = new SearchServiceClient(searchServiceName, new SearchCredentials(apiKey));
      ISearchIndexClient _indexClient = _searchClient.Indexes.GetClient($"idx-qna-{language}");
      SearchParameters sp = new SearchParameters() { SearchMode = SearchMode.Any };
      return await _indexClient.Documents.SearchAsync<T>(searchText, sp);
    }
    catch (Exception ex)
    {
    }
    return null;
}
```
이 검색 서비스를 Bot Builder의 Dialog 클래스를 상속받아서 SearchDialog로 구현해서 사용자가 서비스 문의를 선택해서 질문을 했을 때 검색을 통해서 답변을 사용자에게 전달했다. 

``` c#
[Serializable]
public class FAQSearchDialog : IDialog<object>
{
    private SearchHelper sh;
    private IEnumerable<Qna> searchResults;
    private List<string> searchTexts;

    public async Task StartAsync(IDialogContext context)
    {
        sh = new SearchHelper(context.Activity.AsMessageActivity().Locale);
        searchTexts = new List<string>();

        context.Wait(MessageReceivedAsync);
    }

    public async Task MessageReceivedAsync(IDialogContext context, IAwaitable<IMessageActivity> result)
    {
        // search with language
        sh = new SearchHelper(context.Activity.AsMessageActivity().Locale);
        searchTexts.Add(message.Text);
        var res = await sh.Search<Qna>(string.Join("+", searchTexts));

        if (res.Results.Count > 0)
        {
            searchResults = res.Results.Select(r => r.Document).ToList<Qna>();
            // show reslult to use
            var answers = res.Results.Select(c => c.Document.Answer);
            foreach (var answer in answers)
            {
                await context.PostAsync(answer);
            }
        }
    }
}
```
### 챗봇 ###
챗봇은 사용자가 입력한 메시지를 받고 백엔드 서비스를 연동하기 때문에 전체 시스템을 통합하는 코드를 작성하는 것과 같다. 즉 메신저 채널과 대화를 주고 받고 LUIS에 연결해서 메시지의 의도를 파악하고 그 의도에 따라서 백엔드 서비스를 호출해 가장 알맞은 대답을 생성해서 고객에게 응답한다. 

우리 일상의 대화는 흐름과 맥락이 있다. 따라서 챗봇도 대화의 흐름을 만들어주면 좀 더 자연스러워지는 것과 동시에 챗봇이 답변할 수 없는 쪽으로 대화의 흐름이 벗어나는 것을 막을 수 있다. 진에어의 챗봇은 아래 다이어그램처럼 대화가 이어진다. 처음 대화가 시작 될 때 사용자에게 인사말과 함께 챗봇이 서비스 할 수 있는 내용을 대략 알려주고 선택 할 수 있는 메뉴를 제시한다. 이 방법이 효과적인 이유는 사용자의 의도를 명확히 하면서 메시지를 챗봇에게 전달 할 수 있기 때문이다. 만약 메뉴가 없고 즉시 메시지를 입력 받으면 어떤 종류의 대화인지 알기 어렵다. 따라서 메뉴선택으로 의도를 명확히 하고 시작하면 코드도 매우 간단해 지는 걸 알 수 있다. 그 다음 대화는 선택된 의도에 따라서 LUIS를 거쳐서 진행되는 경우와 직접 검색 서비스를 이용하는 경우로 분기된다. 

![Dialog Flow]({{ site.baseurl }}/images/jinair/dialog-flow.png)

LUIS는 메시지를 분석해서 의도(Intent)와 핵심어(Entity)를 전달해 준다. 항공기 스케줄 조회의 경우 LUIS가 출발지, 도착지, 날짜 3가지 핵심어를 전달해 줘야 정확한 조회가 가능하다. 만약 사용자가 "내일 서울에서 도쿄로 가는 비행기 일정을 알려줘."라고 입력 했을 때는 3가지 값이 모두 존재하지만 "서울에서 도쿄로 가능 비행기 일정을 알려줘"라고 하면 날짜를 알지 못해 조회를 하지 못한다. 이런 경우 다시 FormFlow Dialog로 대화를 전달해서 날짜를 한번 더 물어보고 날짜를 입력을 받아서 스케줄 조회를 한다. LUIS를 통해서 전달 받은 결과는 이렇게 FlowFlow 를 통해서 입력 데이터를 확인하고 진에어 API를 통해서 정확한 데이터를 입력 받는다. 

### 자연어 처리 (LUIS)
자연어 처리는 챗봇 서비스의 성패를 좌우하는 중요한 기능이다. 진에어 챗봇에서는 대화의 처음에 메뉴 선택을 통해서 대화의 의도를 명확히 하기 때문에 LUIS 학습도 많이 쉬워 졌다. 메뉴 선택 이후에도 메시지 입력방법을 간단하게 알려주면 더 정확한 대화가 가능하다. 

HackFest 팀에서는 두명이 전담으로 고객들과의 예상되는 대화의 흐름을 문서화 해서 팀에 공유하고 그 내용을 [LUIS](http://luis.ai)에 훈련을 시키고 테스트를 진행 했다. 항공 스케줄 조회는 출발지, 도착지, 날짜 등의 핵심어를 뽑아 내기 위한 학습을 진행했다. 

![Dialog Flow]({{ site.baseurl }}/images/jinair/luis-document.png)

![Dialog Flow]({{ site.baseurl }}/images/jinair/luis-schedule.png)

## Conclusion ##

진에어의 챗봇이 실제 의미있는 서비스로 자리를 잡으려면 아무래도 자연어 처리가 잘 되어야 할 것 같다. 고객의 메시지를 잘 이해하는 것이 첫 시작이기 때문이다. LUIS의 학습 자체는 어려운 일이 아니었지만 정말 다양한 인간의 언어를 이해하도록 하려면 오랫동안 훈련을 시키는 피드백 과정이 필요할 것 같다. 우선 고객의 의도를 잘 이해 한다면 그 후 과정은 Microsoft Bot Framework나 Azure의 서비스를 잘 조합해서 사용하면 빠르게 서비스를 구축할 수 있었다. 

이번 HackFest를 통해서 
- 진에어의 챗봇 서비스의 기본적인 틀을 만들 수 있었다. 
- Microsoft Bot Framework의 Dialog 클래스를 이용해서 대화의 흐름을 만들면서 자연스러운 대화가 이어지고 추가적인 정보를 사용자로부터 얻어 낼 수 있었다. 
- 한국에서 챗봇 서비스를 하기 위해서 가장 중요한 요소인 카카오톡 메신저 지원이 가능하다는 것을 증명했기 때문에 실제 라이브 서비스까지 고려할 수 있다. 
- 챗봇에 제공할 데이터들을 클라우드에 저장하고 검색할 수 있는 기술을 얻었다. 
- 고객들이 어떤 메시지를 전송할지 예상하고 LUIS를 통해 구현해봤다. 이 과정을 개발팀이 아닌 고객 지원 부서에서 지속적으로 개선할 수 있도록 하려면 문서화나 노하우가 필요할 것 같다. 
- 다국어 지원은 단순히 번역의 수준이 아니고 언어의 특징을 잘 반영해 줘야 한다. 

챗봇 서비스의 가장 기본적인 틀을 만들었으니 이 기본 서비스를 안정화해서 실제 활용되도록 다듬어서 곧 실제 출시할 계획이 있다. HackFest가 팀에 자신감을 심어줬다. 

![Jinair Hackfest]({{ site.baseurl }}/images/jinair/hackfest.jpg)

![Jinair Chatbot]({{ site.baseurl }}/images/jinair/jinair-chatbot.png)
