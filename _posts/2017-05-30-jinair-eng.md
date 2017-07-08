---
layout: post
title:  "Jin Air CaaP Hackfest"
author: "Il Seok Oh, Hyewon Ryu"
author-link: "http://ilseokoh.com"
#author-image: "{{ site.baseurl }}/images/authors/photo.jpg"
date:   2017-05-26
categories: [Bot Framework,Azure Search,Azure Cosmos DB,Azure Web App,Cognitive Services-LUIS]
color: "blue"
image: "images/jinair/jinair-title.jpg" #should be ~350px tall
excerpt: "Jin Air which is LCA in Korea built a chatbot service to make more effective customer support using Microsoft Bot Framework, Cognitive Service and Azure Search."
language: [English]
verticals: ["Transportation & Logistics"]
geolocation: [Korea]
permalink: "/2017-05-26-jinair-eng.html"
---

Jin Air is a Korean low-cost carrier. and always want to support their customer effectively. But customer support by phone can't operate 24/7 and hire more staff is difficult because of fixed budget. So development team tries to build chatbot using [Microsoft Bot Framework](https://dev.botframework.com/) to answer basic requests from the customer which is like searching flight schedule. The conversation between customer and bot starts to select a category. If the customer wants to know their schedule or reservation status, [LUIS(Language Understanding Intelligent Service)](http://luis.ai) will analyze the message and get a proper information from API. All the FAQ which is indexed in [Azure Search](https://azure.microsoft.com/en-us/services/search/) can be searched when customer writes a question.

## Core Team  ##

- Lee Jeong-Cheol: General Manager, Jinair - IT Strategy Team
- Kim Hyun-Suk: Manager, Jinair - IT Strategy Team
- Jung Mi-Yeon: Employee, Jinair - IT Strategy Team
- Kim, Young-Cheon: General Manager, HIST - Jinair SM Group
- Kim Tae-Woo: Assistant Manager, HIST - Jinair SM Group
- Jung Shin-Chul: Assistant Manager, HIST - Jinair SM Group
- Kim Eun-hee: Asst. General Manager, HIST- Digital Tech Group
- Oh Il Seok: Technical Evangelist, Microsoft
- Ryu Hyewon: Audience Evangelism Manager, Microsoft

## Key technologies ##

- [Microsoft Bot Framework](https://dev.botframework.com/): Bot Builder .NET SDK 3.8, Direct Line REST API 3.0
- [Cognitive Services](https://azure.microsoft.com/en-us/services/cognitive-services/): LUIS(Language Understanding Intelligent Service)
- [Azure Search](https://azure.microsoft.com/en-us/services/search/), Azure Cosmos DB, Azure Web App
- [Kakao Friends Plus](https://www.kakao.com/helps?category=29&locale=ko&service=8) API 2.0
- [Visual Studio 2017](https://www.visualstudio.com/), C#
- Conversation Channels: Skype, Facebook messenger, Web Chat, Kakao Talk

 ![JIN air]({{ site.baseurl }}/images/jinair/cognitivjinair.png)

 ## Customer profile ##

 [Jin Air](http://www.jinair.com/) was established in 2008 and is the most representative LCC(Low Cost Carrier) in Korea. Compared to other LCCs in Korea, Jin Air has the largest number of air routes into South-East Asia and adds new lines rapidly every year. As of 2008, the company serves 22 cities in Korea and 55 cities abroad, and has total 30 branches at home and abroad especially for global business. As introducing the in-flight entertainment service called JINI PLAY, Jin Air tries to secure the image of an advanced IT company among air carriers.

 ## Problem statement ##

When Jin Air’s customers want to check booking information or flight information, they usually make a phone call to the customer service or visit the web site. However, operating the customer service to respond phone calls takes too much money and it is not a good way to respond quickly according to a sudden increase of customers. Therefore, to improve customer satisfaction, we decided to serve the chatbot that handles simple questions such as providing reservation information.

To serve air lines in many countries, Jin Air provides customer services in 4 languages: Korean, English, Chinese and Japanese. Therefore, the chatbot service has to handle natural language processing for 4 languages and to recognize terms in aviation field such as airport names and city names. In addition, Korean customers are the significant proportion of customers, so the dominant messenger service named [Kakao Talk](http://www.kakao.com/talk/ko) that covers 95% of total in Korea must be supported.

## Solution overview ##

### Prerequisites for this project

- Install [Visual Studio 2017](https://www.visualstudio.com/ko/downloads/)
- Download [Bot Application Template](http://aka.ms/bf-bc-vstemplate) and copy to Visual Studio 2017 project templates directory.
- Make [LUIS App](http://luis.ai)
- Make a [New Bot](http://dev.botframework.com)
- Sign up for an [Azure Subscription](https://azure.microsoft.com/en-us/free/)
- Obtain [Cognitive Service key on Azure portal](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/azureibizasubscription)
- Sign up for [Kakao Friends Plus](https://www.kakao.com/helps?category=29&locale=ko&service=8)

### Architecture

![Jinair chatbot architecture diagram]({{ site.baseurl }}/images/jinair/jinair-architecture-diagram.png)

The overall chatbot service architecture is illustrated in the diagram above. The architecture can be divided three parts: various messenger channels that customers use, the chatbot application, and the searching service and Jin Air API. 

1. Supporting messenger channels include the official channels of Microsoft Bot Framework such as Facebook messenger, Skype, and web messenger that can be integrated with web pages. In addition, we added Kakao Talk because a Jin Air’s major customer is Korean and Kakao Talk is the most popular messenger in Korea. 
2. The chatbot application was developed using C# language and Microsoft Bot Builder .NET SDK 3.8 on Visual Studio 2017.
3. To handle natural language processing, Microsoft Cognitive Services’ LUIS(Language Understand Intelligent Service) was used. 
4. The backend service is in charge of searching for answers about service inquiries and calling internal Jin Air APIs. DocumentDB APIs were created to enter FAQ data to Azure Cosmos DB, and Azure Search was connected to create searching indexes.

The entire service is operated on Azure. 

## Technical delivery ##

4 parts to build Jin Air chatbot

1. [Support Kakao talk](#kakaotalk)
2. [Build backend service with Azure Search](#backend)
3. [Build bot](#buildbot)
4. [Natural language processing (LUIS)](#luis)

### <a name="kakaotalk"></a> Support Kakao Talk ###

Because Microsoft Bot Framework does not support Kakao Talk officially, additional development is needed to connect with Kakao Talk. Kakao Talk has the API service named Kakao Plus Friend. Kakao Plus Friend is the service originally for operators of online shopping malls or enterprise marketers and makes them communicated with customers. It provides APIs that can produce auto-replies. Bot Framework provides [Direct Line REST API](https://docs.botframework.com/en-us/restapi/directline3/) can connect messenger channels and Bot Framework, technically Bot Connector. After these two APIs are connected in the application, then Kakao Talk and the chatbot can make a conversation. 

![Kakao Talk connection diagram]({{ site.baseurl }}/images/jinair/plus-api-diagram-en.png)

Plus Friends API consists of 4 sorts of APIs: keyboard, message, friend, chat_room. Among them, message API is used to communicate with. The message entered by user is sent to the web application implemented using ASP.NET MVC, and it is transformed to the Activity that is one of data types of Direct Line API. The Activity is sent to Bot Connector and it means that the original message will be reached to the chatbot. The chatbot makes a response message using backend services and this message is sent to the web service again. The web service transforms the message to the form that Kakao Talk uses. Then the transformed message is sent to Kakao Talk. 

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

The structure is so simple but differences between two APIs are causing several restrictions. Whereas the Activity type of Bot Framework can represent various expressions using a number of texts, images, cards, and buttons, the message structure of Kakao Talk has restriction that allows only one text and one image. For example, the chatbot create a message with multiple images for each departure and arrival information. However, Kakao Talk cannot represent multiple images, so only one image would be displayed. To solve this problem, there was no other way except rendering whole content as one image. 


### <a name="backend"></a> Backend service

Jin Air service team updates the [FAQ page](http://www.jinair.com/HOM/FAQ/FAQ01List.aspx) steadily with various questions from customers. We decided to use this data as it is in the chatbot service. Microsoft Cognitive Services’ QnA Maker can cover this feature but when we applied it in practice, it was too difficult to search customers’ question. So we decided to utilize a search engine. DocumentDB APIs were created to enter FAQ data to Azure Cosmos DB, and Azure Search was connected to create searching indexes. You can do this through Azure Portal without writing any code. Refer to “[Connecting Cosmos DB with Azure Search using indexers](https://docs.microsoft.com/en-us/azure/search/search-howto-index-documentdb)” for details. 

![Azure Cosmos DB - Azure Search]({{ site.baseurl }}/images/jinair/azure-cosmosdb-search-en.png)

Cosmos DB Document contains question, answer, category and language data. When we created indexes for Azure Search with these data, we set features such as searching, filtering, and sorting each data as enabled. Then, searching is possible by casting well-written queries to Azure Search. If you download [Microsoft.Azure.Search](https://www.nuget.org/packages/Microsoft.Azure.Search) library in Nuget, you can process searching with simple code. More important thing is how to extract a search keyword from customer’s question. 

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

For the searching service, we implemented FAQSearchDialog that inherited from IDialog class of Bot Builder. When a customer asks a question by selecting a service inquiry, FAQSearchDialog delivers the answer found through searching. 

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

### <a name="buildbot"></a> Build Bot ###

Steps to build Jin air chatbot: 
1. [Get message from channels and show 4 buttons](#getmessage)
1. [Parse message by LUIS](#parsemessage)
1. [Search FAQ when user select 'ask question'](#search)

Because the chatbot accepts messages that user entered and it works with backend services, creating the chatbot means writing code that integrates the whole system. The chatbot makes a conversation with messenger channels, connects with LUIS to figure out the intent of the message, calls backend services according to the intent to create the appropriate answer, and responses to customer with the answer. 

![Dialog Flow]({{ site.baseurl }}/images/jinair/dialog-flow.png)

#### <a name="getmessage"></a> 1. Get message from channels 

All message from channels are sent to RootDialog() directly and show 4 buttons that user can select first using PromptDialog(). 

``` C#
public async Task<HttpResponseMessage> Post([FromBody]Activity activity)
{
    if (activity.Type == ActivityTypes.Message)
    {
        await Conversation.SendAsync(activity, () => new Dialogs.RootDialog());
    }
    else
    {
        await this.HandleSystemMessage(activity);
    }
    var response = Request.CreateResponse(HttpStatusCode.OK);
    return response;
}

 private void ShowOptions(IDialogContext context)
{
    PromptDialog.Choice(context, this.OnOptionSelected, new List<string>() { FlightScheduleOption, FlightStatusOption, MyReservationOption, FAQOption }, "Please select you want.", 3);
}
```

Our usual conversation has the flow and the context. So if we create the flow of the conversation in the chatbot, processes could be more natural and prevent the conversation from flowing in direction that cannot make appropriate answers. The Jin Air’s chatbot processes a conversation as show in the illustration below. When a conversation is started, the chatbot shows a greeting, what it can serve briefly, and menus that can be selected. This is an effective way because it is possible to figure out customer’s intent and to send the categorized message to chatbot according to the intent. When the message is entered without menu, it is too difficult to figure out the kind of the conversation. Also starting with the obvious intention by selecting menu makes code very simple. Then, the message processing branches two directions according to the selected intent: a process through LUIS and a process using the searching service directly. 

#### <a name="parsemessage"></a> 2. Parse message by LUIS 

LUIS analyzes messages and delivers “Intent” and “Entity”. When you want to make a inquiry of the flight schedule, it is impossible to get an accurate result without 3 keywords that LUIS delivers: the origin, destination, and date. If a customer enters a message such as “Tell me flight schedule from Seoul to Tokyo tomorrow”, it includes all 3 keywords. However, if a customer enters a message such as “Tell me flight schedule from Seoul to Tokyo”, it does not include a date so this inquiry cannot be made. In this case, the message is sent to FormFlow Dialog and the date is requested one more time through this dialog. The results delivered from LUIS are checked using FormFlow like this, and then the accurate data is entered through Jin Air API. 

``` c#
switch (optionSelected)
{
    case FlightScheduleOption:
        context.Call(new FlightScheduleDialog(luisService), this.ResumeAfterOptionDialog);
        break;
    case FlightStatusOption:
        context.Call(new FlightStatusLuisDialog(luisService), this.ResumeAfterOptionDialog);
        break;
    case MyReservationOption:
        context.Call(new FlightStatusLuisDialog(luisService), this.ResumeAfterOptionDialog);
        break;
    case FAQOption:
        context.Call(new FAQSearchDialog(), this.ResumeAfterOptionDialog);
        break;
}
```
#### <a name="search"></a> Search FAQ when user select 'ask question'

When user select FAQ and ask what he/she want to know, bot query directly from Azure Search. 

``` c# 
string searchServiceName = ConfigurationManager.AppSettings["SearchServiceName"];
string apiKey = ConfigurationManager.AppSettings["SearchServiceApiKey"];

// Create an HTTP reference to the catalog index
_searchClient = new SearchServiceClient(searchServiceName, new SearchCredentials(apiKey));
_indexClient = _searchClient.Indexes.GetClient($"idx-qna-{language}10");

SearchParameters sp = new SearchParameters() { SearchMode = SearchMode.Any };
await _indexClient.Documents.SearchAsync<T>(searchText, sp);
```

### <a name="luis"></a> Natural language processing (LUIS) ###

Natural language processing is the key feature determines the success or failure of the chatbot service. In the Jin Air’s chatbot, the intent of the conversation becomes clear by selecting menu when the conversation is started, so [LUIS](http://luis.ai) learning becomes easier. After the menu is selected, by telling briefly how to enter the message, the conversation becomes more accurate. 

Two members of the Hackfest team dedicated to write expected dialogue scripts, to share them with the team, to teach LUIS the scripts, and to proceed tests. To make a inquiry of flight schedule, teaching was proceeded to extract keyword such as the origin, destination, and date. 

![Dialog Flow]({{ site.baseurl }}/images/jinair/luis-document-en.png)

![Dialog Flow]({{ site.baseurl }}/images/jinair/luis-schedule-en.png)

## Conclusion ##

To settle the Jin Air’s chatbot as a meaningful service, most of all, natural language processing must be worked well. Because understanding customer’s message well is the beginning. Teaching LUIS itself was not a difficult work but making LUIS understand various human languages would need long time learning and feedback process. If it is possible to understand customer’s intent well, remain works needed to construct a service can be done quickly by combining and utilizing services of Microsoft Bot Framework or Azure. 

What we did through this Hackfest is as below.
- We made the basic framework for the Jin Air’s chatbot service. 
- By creating the flow of the conversations using IDialog class of Microsoft Bot Framework, the conversation was continued naturally and additional information was attained from users. 
- We proved that it is possible to support Kakao Talk using Bot Framework. Actually Kakao Talk support is the most important requisite for providing the chatbot service in Korea. With this proof, we were able to consider to provide the live service in practice.
- We obtained techniques of handling the data for the chatbot: storing to and searching from the cloud. 
- We anticipated what messages customers send and implemented our expectations through LUIS. To improve this process continuously by the customer support division instead of the development team, documentation or any knowhow should be needed.  
- Multilingual support does not mean the level of translation but have to reflect characteristics of each language. 

Now we are planning to release the live service after stabilizing the basic framework of the chatbot we made.

![Jinair Hackfest]({{ site.baseurl }}/images/jinair/hackfest.jpg)

![Jinair Chatbot]({{ site.baseurl }}/images/jinair/jinair-chatbot.png)
