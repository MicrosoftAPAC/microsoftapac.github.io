---
layout: post
title:  "Concierge service for retailers using QnA Maker and robots by Saison Information Systems"
author: "Tatsuhiko Tanaka"
author-link: "https://blogs.msdn.microsoft.com/ttanaka/"
#author-image: "{{ site.baseurl }}/images/authors/photo.jpg"
date:   2017-05-12
categories: [Cognitive Services]
color: "blue"
image: "images/SIS/header_logo001.gif"
excerpt: This concierge service bot is designed to recognize customer voices correctly and to converse with customers using natural language. The service sets up its own hypotheses and infers and makes predictions, even when presented with vague questions. Using AI capabilities to recommend products based on customer needs, the service connects to customers in new ways and supports higher employee performance levels. 
language: English
verticals: [Retail & Consumer Goods]
geolocation: [Japan]
---

## Solution overview ##
 This concierge service is designed to recognize customer voices correctly and to converse with customers using natural language. The service sets up its own hypotheses and infers and makes predictions, even when presented with vague questions. Using AI capabilities to recommend products based on customer needs, the service connects to customers in new ways and supports higher employee performance levels. The robot and the computer think for themselves and learn, using systems and cognitive computing to arrive at their own answers. This service uses QnA Maker and Bot Framework as the AI technology platform. In Hackfest, Saison made a test installation of the Bot Framework portion.

**Key technologies used**

- Bot Framework
- Bing Translator
- QnA Maker

**Core Team: Names, roles and Twitter handles**

- Ryota Kosaka, Project Leader, SAISON INFORMATION SYSTEMS CO.,LTD.
- Takeshi Umezaki , Software Engineer, SAISON INFORMATION SYSTEMS CO.,LTD.
- Saburo Arima, Software Engineer, SAISON INFORMATION SYSTEMS CO.,LTD.
- Hiroki Sato, Software Engineer, SAISON INFORMATION SYSTEMS CO.,LTD.
- Shiori Shiratori, Software Engineer, SAISON INFORMATION SYSTEMS CO.,LTD.
- Bill Barnes, Principal SDE, Microsoft 
- Tatsuhiko Tanaka, Technical Evangelist, Microsoft Japan


## Customer profile ##
Saison Information Systems is involved in the construction and operation of a large number of customer IT systems primarily in the credit card business and retail distribution. The company’s enterprise middleware HULFT boasts the largest share in Japan and is ranked second worldwide. The concierge service is being developed as part of the STORES family, which is an integrated solution service for retail chain stores designed to achieve the most effective resolution of retail distribution management issues with the smallest possible investment. 


## Problem statement ##
The business issue here is that store personnel have to deal with heavy workloads when they get questions from customers in the store. The goal is to reduce store staff workloads by bringing in robot terminals and by automation using Windows tablets.

Saison Information Systems has already created a prototype alpha version of this service as a technical case study and has presented at events. (See the following press release)
[http://home.saison.co.jp/company/news/pdf/2017/pr170301_01.pdf](http://home.saison.co.jp/company/news/pdf/2017/pr170301_01.pdf)

Since this prototype assumes the use of only one terminal, when they deploy the system to actual stores they have to be able to support multiple stores and multiple terminals.

The goal in this Hackfest is to combine the alpha version that has already been produced with Bot Framework and to change over to an architecture that can support multiple terminals. They will also work to improve response accuracy to be able to respond to unexpected questions.
<img alt="pitcure1" src="{{ site.baseurl }}/images/SIS/picture1.jpg" width="400">

## Solution and steps ##
They expect that the beta version produced in this Hackfest will use Bot Framework and that it will have enhanced response accuracy to be able to handle multiple terminals.
<img alt="pitcure2" src="{{ site.baseurl }}/images/SIS/picture2.jpg" width="400">


## Technical delivery ##
They use Microsoft Cognitive Services because of the importance they attach to affinity: They have already been using NET Framework in another service called STORES GIFT. Also, QnA Maker was released while they were in the process of studying the development of the concierge service, so they studied Microsoft Cognitive Services with interest. Yet another reason for using Cognitive Services is that Saison has a complete service lineup including Face API and others that can probably be used in retail stores.

[UI]
Using a robot called Sota and Windows tablets, and other terminals, and supporting inquiries spoken by users or inquiries made using touchscreens.

[Bot Framework]
Bot Framework’s DirectLine will be used to receive character strings text converted by Sota and information inputted by using Windows tablet touchscreens. DirectLine will be used for responses as well.

[Cognitive Services]
First of all, inputted character strings are translated into English with Translator. Because QnA Maker cannot deal with the ambiguities inherent in Japanese, the goal is to translate questions first into English to increase the accuracy of QnA Maker. If an answer can be obtained by QnA Maker, that answer will be returned.

If an answer cannot be obtained by QNA maker, the question will be analyzed by LUIS and Search will be used to get an answer. However, LUIS processing and beyond has not yet been installed in this Hackfest.

**Bot Framework**

First they conducted a discussion about how Bot Framework will be used.
<img alt="Hackfest 1" src="{{ site.baseurl }}/images/SIS/photo1.jpg" width="400">
<img alt="Hackfest 2" src="{{ site.baseurl }}/images/SIS/photo2.jpg" width="400">

Saison used Bot Framework, acquired conversation logs that have been used as responses, and combined those questions that have been asked by users with answers that have been returned by QNA maker. Associations were made with combinations of paired robots and Tablet PCs, and questions and answers. In so doing, they were able to perform processing for multiple terminals.

<img alt="Visual Studio" src="{{ site.baseurl }}/images/SIS/vs1.jpg" width="400">

```csharp
// POST: api/greeting
[HttpPost]
public async Task<HttpResponseMessage> Post([FromBody]JpTextModel jptextModel)
{
    // 取得済みトークンがあれば使う
    string token = (string)HttpContext.Current.Application["AzureToken"];

    // Translate Text
    var transfer = new AzureTextTransfer();
    var translatedbody = await transfer.GetTextTransferAsync(token, jptextModel.jp_text);

    string patternStr = @"Argument Exception";
    if (Regex.IsMatch(translatedbody,patternStr) )
    {
        // トークンが存在しないか、期限切れの場合
        // Translate Token
        var azureToken = new AzureToken();
        token = await azureToken.GetAccessTokenAsync();

        // トークンを保存
        HttpContext.Current.Application["AzureToken"] = token;

        // Translate Text
        transfer = new AzureTextTransfer();
        translatedbody = await transfer.GetTextTransferAsync(token, jptextModel.jp_text);
    }

    patternStr = @"<.*?>";
    string translated = Regex.Replace(translatedbody, patternStr, string.Empty);

    // QnA
    var qna = new AzureQnA();
    var qnaanswerjson = await qna.GetAnswer(translated);

    var deserialized2 = JsonConvert.DeserializeObject<QnAAnswerModel>(qnaanswerjson);
    var qnaanswer = deserialized2.answer;

    // 一致する内容がない場合
    //qnaanswer = (qnaanswer == "No good match found in the KB" ? "僕にはまだ難しくてわからないよ" : qnaanswer);
    if(qnaanswer == "No good match found in the KB")
    {
        // userlocalへなげる
        var userLocal = new UserLocalWebservice();
        var outputJson = await userLocal.GetUserLocalAsync(jptextModel.jp_text);
        var deserialized3 = JsonConvert.DeserializeObject<UserLocalModel>(outputJson);
        qnaanswer = deserialized3.result;
    }


    // 返却用jsonの生成
    var anwser2 = new Answer2 { MsgId = 0, Msg = "jp:"+ jptextModel.jp_text+" en:"+ translated+" score:"+ deserialized2.score, Text = qnaanswer };
    string jsonAnwser2 = JsonConvert.SerializeObject(anwser2, Formatting.Indented);
    var response = this.Request.CreateResponse(HttpStatusCode.OK);
    response.Content = new StringContent(jsonAnwser2, Encoding.UTF8, "application/json");

    //画面転送
    var socket = new AzureWebSockets();
    await socket.Connect();
    await socket.Send(jsonAnwser2);
    //await socket.Close();

    return response;
}
```

**Translator**

They can simplify the characteristic ambiguity of Japanese by translating inputted Japanese character strings into English. That way they can increase the accuracy of QnA maker.

**QnA Maker**

Japanese responses are provided to English questions in QnA Maker. By providing questions in English, Saison was able to significantly reduce the number of questions that have to be inputted ahead of time. 
<img alt="QnA Maker" src="{{ site.baseurl }}/images/SIS/qnamaker1.jpg" width="400">

## Conclusion ##
By participating in Hackfest, Saison Information Systems has been able to use Bot Framework to install processing to support multiple terminals. In this way, they have achieved their objective of this demonstration test.

Going forward, they plan to conduct demonstration tests of the concierge service in actual retail stores and intent to commercialize the service after further improvements are made.

By using this service, in-store communications can be energized with robots lending a hand in helping with customers, even in the face of the personnel shortages mentioned earlier. The hope is that this service will contribute to greater customer satisfaction and increase customer return visits to stores.


## Additional resources ##
- [Saison Information Systems](http://home.saison.co.jp/english/)
- [Alpha version press release](http://home.saison.co.jp/company/news/pdf/2017/pr170301_01.pdf)

