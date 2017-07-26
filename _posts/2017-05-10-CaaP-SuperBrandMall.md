---
layout: post
title:  "Building a chat bot shopping assistant for Super Brand Mall's WeChat"
author: "Warren Zhou"
#author-link: "#"
date: 2017-06-21
categories: [Bot Framework]
color: "blue"
image: "images/SuperBrandMall/bot-architecture.png"
excerpt: Leveraging Microsoft's platform and intelligent services, a high-end luxury shopping mall in Shanghai built a chat bot for its WeChat official account, allowing customers to easily find mall services and get quick answers to their questions.
language: [English]
verticals: [Retail & Consumer Goods]
geolocation: [China]
---

Nowadays physical malls and stores are facing unprecedented competition from e-commerce. Providing a differentiated in-store experience, knowing their customers better, and increasing customer stickiness are the topmost challenges for mall operators. Super Brand Mall, one of the high-end luxury shopping malls in Shanghai, partnered with Microsoft and built a chat bot for its [WeChat](https://en.wikipedia.org/wiki/WeChat) official account. As a result, Super Brand Mall customers could get information about mall services through a conversational experience, making the bot a key component for this retail giant in remolding its customer experience.


### Key technologies used  

- [Microsoft Bot Framework](https://dev.botframework.com/)
- [Language Understanding Intelligent Service (LUIS)](https://www.luis.ai/home/index)
- [Microsoft Azure SQL Database](https://azure.microsoft.com/en-us/services/sql-database/?v=16.50)

### Core team  

The team was comprised of members from Super Brand Mall's IT department and Microsoft DX China:

- Christina Cheng – Director, IT Core Applications, Super Brand Mall
- Junkai Zhang – Supervisor, IT, Super Brand Mall
- Biyan Huang – Manager, IT, Super Brand Mall
- Warren Zhou – Senior Technical Evangelist, Microsoft China
- Leon Liang – Senior Technical Evangelist, Microsoft China
- Zepeng She – Technical Evangelist, Microsoft China

*Figure 1. The team on a conversation-as-a-platform hackfest in China*

![Hackfest]({{ site.baseurl }}/images/SuperBrandMall/Hackfest.jpg)

<br/>

## Customer profile

[Super Brand Mall](http://www.superbrandmall.com/sbm/) is an international style urban shopping center developed by Shanghai Kinghill Limited, the real estate subsidiary of the Charoen Pokphand Group (CP Group) of Thailand. Super Brand Mall has a combined gross floor area of 250,000 square meters, with 10 floors above ground and 3 floors underground. Super Brand Mall is one of the CP Group's flagship projects in China. 

Located in the Lujiazui area of Pudong, the most important financial district of the city, Super Brand Mall lies in the heart of The Bund. The overall architecture design was by the famous architect firm Jerde Partnership. With five different building elevations, its design, along with colors, makes Super Brand Mall a grand sight within the already exceptional Lujiazui area.

Based on the motto "all aged customers, all day shopping experience, one-place satisfaction," Super Brand Mall strives to meet modern home entertainment and shopping needs to break the general large commercial building layout mode, with a whole new concept in indoor commercial pedestrian street patterns. The design allows for internal and external consumer traffic, thus adding towards the already outstanding layout of the total structure.
 
## Problem statement

Even though Super Brand Mall is one of the prime shopping malls in Shanghai, it lacks an effective way to digitally interact with its customers. The mall operates an official account on WeChat, the primary social and messaging app in China, and has more than 260,000 subscribers. However, it remains a one-way marketing advertisement platform rather than a communication interface. The mall is looking for a way to distinguish active members from ordinary visitors and profile their activities, interests, and preferences.  

Currently the only places that provide in-mall guidance are via some touch-screen directories and information desks, which do not meet the needs of all the customers all the time. 

Some isolated systems provide mall services such as promotional information and coupons, membership and points, and parking and payment. Customers want a unified interface to access these services in a way they prefer. 

> "Before starting this intelligent chat bot project, we do not have a comprehensive and accurate way to record our customers' asks: what are their queries, suggestions or complaints; which brands and promotion coupons they are interested; which services in the mall they really use. Without precisely knowing and profiling our customers, we could never transform ourselves to a better mall they enjoy and love!" —Christina Cheng, Director, IT Core Applications, Super Brand Mall

 
## Solution and steps

Super Brand Mall considers WeChat to be its most important channel for digital marketing and customer engagement, so the chat bot is expected to be a key part of its WeChat official account. The bot is hosted on Microsoft Azure services. Leveraging Microsoft's intelligent services (LUIS), the bot would understand users' natural language inputs in Chinese, make queries to some data systems if needed, and reply to users with the following capabilities:

- Querying the location and promotion information for brands and stores in the mall
- Recommending brands and stores for categories
- Querying in-mall events
- Checking and consuming membership points
- Querying the location and price for the parking lot

To meet the requirements for the Super Brand Mall's chat bot, the following technologies were adopted:

- The chat bot starts from the [Bot Builder SDK for .NET](https://docs.microsoft.com/en-us/bot-framework/dotnet/bot-builder-dotnet-overview). Its conversational logic is written in C#. During the project period, WeChat was *not* yet an officially supported channel, so the bot communicates with WeChat via [Direct Line 3.0 REST APIs](https://docs.microsoft.com/en-us/bot-framework/rest-api/bot-framework-rest-direct-line-3-0-concepts).   
- To understand users' inputs in Chinese natural language, the Microsoft Cognitive Services Language Understanding Intelligent Service (LUIS) was used to extract their intents and variables.
- The chat bot needs some data from the mall's line-of-business (LOB) systems to provide assistance for in-mall events, promotional campaigns, and membership information. Rather than accessing those heterogeneous LOB data sources directly, the bot accesses the easy-to-manage Azure SQL Database to retrieve the necessary data. Periodic synchronization to the LOB databases ensures that the information from the bot is up to date.   

### Architecture diagram

Figure 2 shows the architecture of this chat bot project:

- The bot is implemented in C# and deployed as a web app using Azure App Service on Azure datacenters in China. 

- Texts and clicks to hyperlinks are the only interactions supported in this version, so LUIS is the only Cognitive Services feature invoked at present. Speech recognition using the [Bing Speech API](https://azure.microsoft.com/en-us/services/cognitive-services/speech/) is in the plan for later.

- Azure SQL Database is a periodically synchronized copy of part of the LOB databases and is read by the bot. Later it will also store user preferences and activities extracted from chat history.

*Figure 2. Architecture diagram*

![Architecture]({{ site.baseurl }}/images/SuperBrandMall/Architecture.png)

<br/>

**Demo video**

<iframe src="https://www.youtube.com/embed/raBqccvRO2g" width="560" height="315" frameborder="0" allowfullscreen></iframe>

<br/>

## Technical delivery

### Prerequisite steps

The following resources are prerequisite steps for the development environment:

- Install [Visual Studio](https://www.visualstudio.com/).
- Install the [Bot Builder SDK for .NET](https://docs.microsoft.com/en-us/bot-framework/resources-tools-downloads).
- Obtain [Cognitive Services keys for LUIS](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/home).
- Create an [Azure account](https://azure.microsoft.com/en-us/free/).

### Bot design and configuration  

Because the chat bot interacts with users in the WeChat mobile app on iOS, Android, and Windows phones, the design of the chat bot basically follows the [bots in native mobile app](https://docs.microsoft.com/en-us/bot-framework/bot-design-pattern-embed-app) pattern. 

As mentioned earlier, communicating to the WeChat backend requires enabling the Direct Line channel for this bot. To get the full capability and best performance, ensure that all three version options on the Direct Line configuration page are checked.

*Figure 3. Direct Line configuration*

![Direct Line configuration]({{ site.baseurl }}/images/SuperBrandMall/DLConfig.png)

<br/>

### Language Understanding Intelligent Service (LUIS)

#### Intents

Before doing a deep-dive into the bot code, let's have a quick glance at the LUIS app to see how it helps us understand users' intents in a mall-assistant scenario.

Of the 18 intents defined in the LUIS app, some are frequently asked and quite complex with many utterances, such as `ProvideInfo` (86 utterances), `QueryMemberStore` (44), and `QueryLocation` (41), while some are less popular and simpler with fewer utterances, such as `QueryParkingLot` (7), `SayHello` (4), and `SeeMovie` (3). 

*Figure 4. All intents*

![All intents]({{ site.baseurl }}/images/SuperBrandMall/AllIntents.png)

<br/>

For example, for the `QueryMemberStore` intent, the training utterances cover not only sayings such as "Which stores are members?" but also sayings with some constraints such as Category, Product, and Floor. In the real world, querying member stores for men's clothes or down jackets are common questions.

*Figure 5. The QueryMemberStore intent*

![The 'QueryMemberStore' intent]({{ site.baseurl }}/images/SuperBrandMall/IntentQueryMemberStore.png)

<br/>

#### Entities

Entities are the parameters in the utterances that the scenario cares about. In addition to prebuilt entities such as `datetime` or `number`, seven custom entities are defined in this LUIS app: 

- Category
- Brand
- Product
- Facility
- Landmark
- Floor
- Activity

*Figure 6. All entities*

![All entities]({{ site.baseurl }}/images/SuperBrandMall/AllEntities.png)

<br/> 

#### Phrase lists

After designing the intents and entities, the trained LUIS model did not provide satisfying accuracy for later tests. Deeper investigation showed it performed poorly when recognizing some specific entities such as brand, event, and landmark names or their abbreviations. So the phrase list feature was adopted in the LUIS app by providing all possible entity values related to this mall. The refined and retrained LUIS app performs much better after importing these phrase lists. The learning here is, if there are very specific and uncommon words for your entities, be sure to use the phrase list or other features. 

*Figure 7. All phrase lists*

![All phrase lists]({{ site.baseurl }}/images/SuperBrandMall/AllPhraseLists.png)

<br/>

### Bot code samples

#### MessagesController

Following is the code for `MessagesController`. If there's a message from the Direct Line channel, it invokes the `CRMDialog4WeChat` with parameters of the user's WeChat ID. Although WeChat is the only channel at present that the bot responds to, the code keeps the extensibility to support other channels in the future.

```csharp
    public class MessagesController : ApiController
    {
        public virtual async Task<HttpResponseMessage> Post([FromBody] Activity activity)
        {

            if (activity.Type == ActivityTypes.Message)
            {
                try
                {
					//可以通过ChannelId判断是哪个渠道。不同渠道的返回值可能并不相同，区分之后可以分别回复。
                    if ("directline".Equals(activity.ChannelId))
                    {	
						//微信使用的是DirectLine接入方式，调用api的时候可以将参数加在里面。本项目将微信的微信名作为参数到本地接收。
                        await Conversation.SendAsync(activity, () => new CRMDialog4WeChat(activity.From.Id));
                    } else
                    {
                        await Conversation.SendAsync(activity, () => new CRMDialog(activity.From.Id));
                    }
                }
                catch (Exception e)
                {
                    ConnectorClient connector = new ConnectorClient(new Uri(activity.ServiceUrl));
                    // calculate something for us to return
                    int length = (activity.Text ?? string.Empty).Length;

                    // return our reply to the user
                    Activity reply = activity.CreateReply($"You sent {activity.Text} which was {length} characters" + " error :" + e.ToString());
                    //await connector.Conversations.ReplyToActivityAsync(reply);
                }
            }
            else
            {
                //add code to handle errors, or non-messaging activities
            }

            return new HttpResponseMessage(System.Net.HttpStatusCode.Accepted);
        }


 
    }
```

<br/>

#### CRMInfo

The `CRMInfo` class defines the data object that stores a user's dialog info and the last recognized intent and entity from LUIS. The reason why the bot does not use the intent and entity only for the current user input is that it needs to be context-aware. In some cases, one intent may last for several inputs.

For example, the user question "Any recommendations for Thai food?" may easily be analyzed by LUIS with the intent "HaveMeal" and the entity "Thai food." But when there follows "How about the Western food?", LUIS may probably return no intent but the entity "Western food." In this case, the last intent is referred to for the second input. 

```csharp
    public class CRMInfo
    {
        //顾客编号
        public string customer { get; set; }
        //返回信息
        public string replyString { get; set; }
        //目的
        public string intent { get; set; }
        //品牌
        public string brandText { get; set; }
        //业态
        public string businessFormatText { get; set; }
        //楼层
        public string floorText { get; set; }
        //单品
        public string productText { get; set; }
        //基础信息
        public string basicInfoText { get; set; }
        //活动
        public string activityText { get; set; }

        //特约商户标志
        private bool vipFlag = false;
    }
```

<br/>

#### CRMDialog4WeChat

The `CRMDialog4WeChat` class handles intents and invokes the supporting services in `CRMService4Wechat` to assemble the bot's reply message (`CRMInfo::replyString`) to the user. Let's take the `QueryLocation` intent as an example. When such an intent is passed from LUIS, it calls `JudgeBrand1()` to do a query for a certain brand.

```csharp
    public class CRMDialog4WeChat
    {
        private CRMService4WeChat crmservice = new CRMService4WeChat();
		
        //Intent: QueryLocation
		[LuisIntent("查询地点")]
        public async Task QueryLocation(IDialogContext context, LuisResult result)
        {
            //获取用户会话
            CRMInfo info = crmservice.GetCustomerSession(TestCustomer);
            info.intent = "查询地点";
            info.VipFlag = false;
            //设置通用信息
            crmservice.SetCommonInfo(info, context, result);
            if (crmservice.JudgeBrand1(info))
            {
                await context.PostAsync(info.replyString);
                //清空数据
                crmservice.ClearData(info, false);
            }
            context.Wait(MessageReceived);
        }


    }

```

<br/>

#### CRMService4WeChat

The bot's dialog logic is expressed by the following functions:

- `JudgeBrand1()` in `CRMService4WeChat` is a dispatch function. 
- If there's an effective brand entity string from LUIS, it calls `JudgeBrand2()` to assemble the reply for the brand's location. 
- If the entity returned by LUIS is not a brand but a facility or landmark in the mall, it calls `JudgeBasicInfo2()`.

In addition to providing the location information for a certain brand, the `JudgeBrand2()` function also:
- Checks the category (or business format code) of this brand.
- Tries to find related promotional information in the mall's operations database (replaced by two hardcoded samples).
- Replies to the user with quick hyperlinks. 


```csharp
    public class CRMService4WeChat
    {

        //判断品牌1
        public bool JudgeBrand1(CRMInfo info)
        {
            //判断开始
            if (!String.IsNullOrWhiteSpace(info.brandText))
            {
                JudgeBrand2(info);
            }
            else if (!String.IsNullOrWhiteSpace(info.basicInfoText))
            {
                JudgeBasicInfo2(info);
            }
            else
            {
                info.replyString = "正大君还不知道您想去哪哦。您可以回答：星巴克、同道大叔等等";
            }
            return !String.IsNullOrWhiteSpace(info.replyString);
        }

        //判断品牌2
        public bool JudgeBrand2(CRMInfo info)
        {
            //查询品牌
            t_brand brand = searchService.getBrandByName(info.brandText);
            if (null != brand)
            {
                StringBuilder sb = new StringBuilder();
                sb.Append(BaseInfo.wordDic[brand.brand].name);
                sb.Append("在");
                sb.Append(BaseInfo.wordDic[brand.floor].name);
                sb.Append(brand.house_number).Append("(门牌号)。");
                if (TRUE_1 == brand.vip_flag)
                    sb.Append("是特约商户，可以积分哦。");
                
                //加入业态判断
                List<t_brand_businessformat> list = searchService.getBusinessformatByBrandAndBf(brand.code, null);

                foreach (t_brand_businessformat bb in list)
                {
                    if ("15".Equals(bb.businessformat_word_code) || "22".Equals(bb.businessformat_word_code) || "19".Equals(bb.businessformat_word_code) || "33".Equals(bb.businessformat_word_code))
                    {
                        sb.Append("（可以接入点餐，订座，排队等第三方服务）！");
						//Need to access the operational promotion database, hardcode 2 options below
                        if ("星巴克".Equals(BaseInfo.wordDic[brand.brand].name))
                        {
                            sb.Append("<a href=\"").Append(baseUrl).Append("/index.html\">带我去</a>！");
                            sb.Append("<a href=\"http://m.mwee.cn/c_webapp/search_result?type=search&kw=星巴克&location=1\">优先排队</a>！");
                            sb.Append("<a href=\"https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx1eb4cadd57ef7a2d&redirect_uri=http%3A%2F%2Fzdgc.andoner.com%2Fweixin%2Fzdgc%2Fexchange&response_type=code&scope=snsapi_base&state=1#wechat_redirect\">领取优惠券</a>！");
                            sb.Append("\u0002");
                            sb.Append("现在星巴克有满100减20的活动，");
                            sb.Append("<a href=\"http://www.baidu.com\">点我报名</a>可以折上折哦！");
                            sb.Append("\u0002");
                            sb.Append("您的优惠券：<a href=\"https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx1eb4cadd57ef7a2d&redirect_uri=http%3A%2F%2Fzdgc.andoner.com%2Fweixin%2Fzdgc%2Fmyexchange&response_type=code&scope=snsapi_base&state=1#wechat_redirect\">我的卡券</a>\n");
                            sb.Append("<a href=\"https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx1eb4cadd57ef7a2d&redirect_uri=http%3A%2F%2Fzdgc.andoner.com%2Fweixin%2Fzdgc%2Fprizedetail%2F%3Fprize%3D16&response_type=code&scope=snsapi_base&state=1#wechat_redirect\">星巴克中杯咖啡券</a>\n");
                            sb.Append("<a href=\"https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx1eb4cadd57ef7a2d&redirect_uri=http%3A%2F%2Fzdgc.andoner.com%2Fweixin%2Fzdgc%2Fprizedetail%2F%3Fprize%3D16&response_type=code&scope=snsapi_base&state=1#wechat_redirect\">星巴克买二送一</a>");

                        }
                        else if ("小南国".Equals(BaseInfo.wordDic[brand.brand].name))
                        {

                            sb.Append("\u0001小南国在这里");
                            sb.Append("\u0001点击查看小南国详情");
                            sb.Append("\u0001").Append(baseUrl).Append("/images/1F.png");
                            sb.Append("\u0001").Append(baseUrl).Append("/index2.html");
                            sb.Append("\u0001小南国品牌导购");
                            sb.Append("\u0001点击查看小南国详情");
                            sb.Append("\u0001").Append(baseUrl).Append("/images/xngdg.jpg");
                            sb.Append("\u0001http://zdgc.andoner.com/weixin/zdgc/brands");
                            sb.Append("\u0001小南国优惠券");
                            sb.Append("\u0001点击查看小南国详情");
                            sb.Append("\u0001").Append(baseUrl).Append("/images/xngyhq.jpg");
                            sb.Append("\u0001https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx1eb4cadd57ef7a2d&redirect_uri=http%3A%2F%2Fzdgc.andoner.com%2Fweixin%2Fzdgc%2Fexchange&response_type=code&scope=snsapi_base&state=1#wechat_redirect");
                            sb.Append("\u0001优先排队权");
                            sb.Append("\u0001点击查看小南国详情");
                            sb.Append("\u0001").Append(baseUrl).Append("/images/pd.jpg");
                            sb.Append("\u0001http://m.mwee.cn/c_webapp/search_result?type=search&kw=小南国&location=1");
                            sb.Append("\u0001周末小南国满100减20，点我查看详情");
                            sb.Append("\u0001点击查看小南国详情");
                            sb.Append("\u0001").Append(baseUrl).Append("/images/pd.jpg");
                            sb.Append("\u0001http://m.mwee.cn/c_webapp/search_result?type=search&kw=小南国&location=1");
                            sb.Append("\u0001总而言之言而总之，可以巴拉巴拉写很多很酷炫很吸引人的话放在这里，然后边上配上一张夺人眼球的图片！最多可以放8条");
                            sb.Append("\u0001点击查看小南国详情");
                            sb.Append("\u0001").Append(baseUrl).Append("/images/pd.jpg");
                            sb.Append("\u0001http://m.mwee.cn/c_webapp/search_result?type=search&kw=小南国&location=1");

                        }

                        break;
                    }
                    else if ("27".Equals(bb.businessformat_word_code) || "34".Equals(bb.businessformat_word_code))
                    {
                        sb.Append("（可以接入虚拟试衣，领取优惠券等第三方服务）！");
                        break;
                    }
                }

                info.replyString = sb.ToString();
            }
            else
            {
                info.replyString = "对不起，您说的品牌" + info.brandText + "正大君没查询到哦。";
            }
            return !String.IsNullOrWhiteSpace(info.replyString);
        }


        //判断基础信息2
        public bool JudgeBasicInfo2(CRMInfo info)
        {
            //查询基础信息
            t_basic_info basic_info = searchService.getBasicInfoByName(info.basicInfoText);
            if (null != basic_info)
            {
                StringBuilder sb = new StringBuilder();
                sb.Append(basic_info.remark);
 
                info.replyString = sb.ToString();
            }
            else
            {
                info.replyString = "对不起，您说的基础信息" + info.basicInfoText + "正大君没查询到哦。";
            }
            return !String.IsNullOrWhiteSpace(info.replyString);
        }


    }

```

<br/>

Supporting functions, such as those as shown in the `CRMService4WeChat` code, process the intents and entities according to the dialog logic designed by the mall, and assemble and store the responses in the `replyString` in the `CRMInfo` object reference. The intent handling code in `CRMDialog4WeChat` posts the assembled `replyString` to the channel asynchronously, extending the intent handling entrances and the response generating functions until all the dialog logic is covered.


## Conclusion ##

With Microsoft's platform and partnership, Super Brand Mall in Shanghai published the first customer-facing chat bot for high-end shopping malls. Within only two months, the bot went from ideation to testing. The bot would bring more confidence to Super Brand Mall to engage its customers digitally and effectively. 

> "With the help from Microsoft DX team, we have successfully trained an effective LUIS model and developed an intelligent chat bot that could answer most of the Frequently-Asked-Questions from our customers within such a short period. We really appreciate DX's support. We are scheduling a launch of this bot in the coming months. We believe this bot would surely ignite our WeChat subscribers, provide amazing engagement experience and help us know our customers better." —Christina Cheng, Director, IT Core Applications, Super Brand Mall


### Future work

Many WeChat users prefer using voice rather than typing text. A chat bot that supports voice input would provide a better experience to these WeChat users. Using the Bing Speech API in Cognitive Services to do the speech recognition is definitely on top of Super Brand Mall's to-do list. 

The conversations between the customers and the chat bot contain valuable data that the mall will never ignore. As one of the tasks on the list, customer preferences, interests, and activities would be extracted from the chat history and saved to [Azure Storage](https://azure.microsoft.com/en-us/services/storage/?v=16.50) for future machine learning and user profiling.


## Additional resources ##

- [LUIS documentation](https://docs.microsoft.com/en-us/azure/cognitive-services/LUIS/Home)
- [GitHub repository for MallWeChatBot project](https://github.com/donnerz/MallWeChatBot) 
