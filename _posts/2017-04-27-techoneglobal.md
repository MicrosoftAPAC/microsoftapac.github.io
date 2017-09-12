---
layout: post
title:  "Building a Concierge Bot-as-a-service with Tech One Global"
author: "Alyssa Ong"
author-link: "https://twitter.com/alyssaong1337"
#author-image: "{{ site.baseurl }}/images/TechoneGlobal/authorpic.PNG"
date:   2017-04-27
categories: [Cognitive Services, Bot Framework]
color: "blue"
image: "images/TechoneGlobal/techone_team.JPG" #should be ~350px tall
excerpt: Tech One Global and Microsoft build a concierge bot-as-a-service to answer generic queries.
language: [English]
verticals: [Retail & Consumer Goods]
geolocation: [Philippines]
---

[Tech One Global](https://www.techoneglobal.com/) partners with Microsoft to build a concierge bot as a service. Businesses tend to receive a high volume of customer service inquiries, with a large proportion of these inquiries being generic questions to find out more about the business. Examples of such queries include "what services do you provide?" or "when are your opening hours?". Tech One Global used the Microsoft Bot Framework, Bing Spell Check API and Language Understanding Intelligent Service (LUIS) API to build a bot to help automate generic queries and reduce cost spent on customer service. A web interface was also made for businesses to easily customize the responses of the bot. 

**Key Technologies Used**

- [Microsoft Bot Framework](https://dev.botframework.com)
- [Language Understanding Intelligent Service](https://www.luis.ai)
- [Bing Spell Check](https://azure.microsoft.com/en-us/services/cognitive-services/spell-check/)
- [Azure App Service](https://azure.microsoft.com/en-us/services/app-service/)
- [Azure SQL Database](https://azure.microsoft.com/en-us/services/sql-database/)

**The Core Team:**
- Raveen Subasinghe - Head of Development, Tech One Global
- Haritha Thilakarathne - Software Engineer, Tech One Global
- Shohan Dassanayake - Software Engineer, Tech One Global
- Kamal Rathnayake - Software Engineer, Tech One Global
- Dumin Sahiet - Software Engineer, Tech One Global
- [Aswin C.](https://twitter.com/mraswinc) - Technical Evangelist, Microsoft Malaysia
- ChengBin Tham - Technical Evangelist, Microsoft Malaysia
- Joben Rara - Technical Evangelist, Microsoft Philippines
- Arnie Locsin - Technical Evangelist, Microsoft Philippines
- [Alyssa Ong](https://twitter.com/alyssaong1337) - Technical Evangelist, Microsoft APAC

![Techoneteam]({{site.baseurl}}/images/TechoneGlobal/techone_team.JPG)

## Customer profile ##

[Tech One Global](https://www.techoneglobal.com/) is committed to offering client-oriented services focused on facilitating efficiency, innovation, and creativity in the field of Information Technology (IT). The company provides diverse services catered to all types of enterprises, including software development, enterprise software distribution, document management and knowledge process outsourcing. Additionally, Tech One Global provides IT professionals competency enhancement with its learning solutions and IT certifications through Tech One Learning.

Tech One Global offers services in Bangladesh, Brunei, Nepal, Philippines, Sri Lanka. 

## Problem statement ##

Tech One Global found that across many businesses, both internal and external facing customer service staff get a high load of queries on a day to day basis, with a large volume of these questions being common and generic ones. For instance, a user visiting a company's website would ask simple questions like "what are the services you offer?" or "how can I apply for a job with you?". On the other hand, an internal employee would ask questions such as "how do I change my password?" or "how can I apply for leave?". 

This leads to 2 main problems:
- Businesses face additional cost in hiring more customer support staff to address the high volume of queries
- Users face delayed responses due to most customer support not being available 24/7
 
Tech One Global wants to help businesses automate the responses to these simple queries across their different departments such as HR, Finance, and external facing customer service using natural language processing and bots. For the initial scope of their solution, they would like to focus on automating the external facing customer service, and creating a solution for businesses to be able to customize the responses to these generic questions. The generic questions should be common across businesses. They would also like to introduce a way for businesses to collect information about the user's purpose of visit for analytics and user engagement purposes. 

The requirements of their solution is as follows:
- **Plug and Play**: A no-code solution where any business should be able to register themselves and start customizing responses to common questions in a user friendly way, such as form filling. Edits to responses should be easily done as well. Tech One Global aims to build a no-code solution.
- **Integrated**: The entered responses should automatically reflect in the bot's responses, without the need for someone to manually change the code in the bot.
- **Scalable**: If TechOne wishes to add a new generic question (e.g. who is your CEO?), they should only need to modify their solution once for it to take effect on all customer bots. There should not be a need to edit code on every single customer bot. 
- **Customizable**: While generic templates exist, the bot should be customizable on the customer side (e.g. if the customer would like their bot to answer non-generic questions about their company)  

 
## Solution, steps and delivery ##

The architecture of the overall solution is as follows:

![Architecture]({{site.baseurl}}/images/TechoneGlobal/techone_archi.PNG)

### Plug and Play ###

A company can register on the web portal to get started with their bot as a service. The company's admin will have access to a dashboard where they can fill in business information based on the business function (E.g. HR, public facing, Finance). For instance, on the public facing page they will fill in fields such as company name, description, motto, CEO. These fields will populate a SQL database based on the available generic question set, and the contents of the database will be used as part of the bot's response to generic questions by users. The admin can come back and edit this web portal at any time. 

![Dashboard]({{site.baseurl}}/images/TechoneGlobal/techone_admindash.PNG)

### Integrated ###

As detailed above, every time the admin updates the company information, the bot will immediately use this updated information as well because they share the same response database. 

The response database has the following attributes and example data: 

|CompanyId   |Intent   |Response   |
|---|---|---|
| 10  |Mission   |Tech One Global empowers today's technology professionals and organizations through software development, hands-on trainings, and full learning courses.   |
| 10  |Products   |Tech One Global provides a range of services including software development, document management and Sanje services. Please visit this link to find out more: https://www.techoneglobal.com/services   |
| 30  |Mission   |Microsoft's mission is to empower every person and organisation on the planet to achieve more.   |

The flow is as follows: 

![Flow]({{site.baseurl}}/images/TechoneGlobal/techone_flow.PNG)

The intent is determined based on the field updated in the web portal. LUIS is currently trained to answer generic queries such as what the company does, what services the company has, how to join the company and more.

![Luis]({{site.baseurl}}/images/TechoneGlobal/techone_luis.PNG)

Future work includes an pre-approval process through the web app so that the information is reviewed before being publicly available through the bot. 

### Scalable yet Customizable ###

The original implementation involved using one central bot for all the companies, instead of each company having their own bot. This was so that any changes made only need to be done once. For instance, if we wanted to add a new intent, we only need to change the code of the main bot. However we soon realised several challenges with using a single bot:

- It would be tough to identify which company website the user's message came from, without explicitly asking the user. It is possible to use the webchat backchannel to get information via the company's website, but that is dependent on information in the company's website which is not always reliable and can change over time.
- The number of channels each business can use is limited. For instance, the bot connector currently only connects one bot to a single Facebook page (it only takes one instance of page id, app id, etc.), or a single Skype bot.
- Businesses might not be comfortable with information going through the same bot used by other businesses - they tend to prefer the idea of ownership. It is preferable to separate the flow of information (i.e. Chinese wall).

Hence the architecture was pivoted to each company having their own bot, but abstracting the calls to the Language Understanding Intelligent Service (LUIS) API and Bing Spell check API to an API app. In this way, there does not need to be specific handlers for LUIS intents in each company's bot code. Calls to the API app are authenticated with a required key in the request header. 

For customizability, each customer will have a bot of their own. If the customer has a request for a specific kind of question they want their bot to answer, the customization will happen on their bot side, and they will have their own unique LUIS model on top of the generic one used at the API app. 

### Other considerations ###

The bot is to be used as a complement, not a replacement for customer service. If the user's query is too complex and the bot does not understand it, it will begin a feedback dialog with the user. The feedback dialog consists of asking the user for some basic information like name and email, followed by collecting the feedback from the user. 

![Bot]({{site.baseurl}}/images/TechoneGlobal/techone_bot.PNG)

### Technical Implementation ###

The entirety of the solution was built using .NET, including the bot. The Microsoft Bot Framework was used to manage the bot's dialogs, and deploy the bot to Skype and web. It also opens up the option of deploying to other channels like Facebook Messenger. The Microsoft BotBuilder .NET SDK was used on the bot side. Note that at the time of writing this, BotBuilder version 3.5.5 is used. 

Other SDKs used include the Microsoft.Cognitive.LUIS nuget package to facilitate calls to LUIS. We used the Bing Spell Check sample code [here](https://github.com/Microsoft/BotBuilder-Samples/tree/master/CSharp/intelligence-LUIS) to integrate spell check. 

**Prerequisites**

- Install [Visual Studio](https://www.visualstudio.com/) - the Community 2017 version is sufficient
- Install the [Bot Framework SDK for C#](https://docs.microsoft.com/en-us/bot-framework/dotnet/bot-builder-dotnet-overview)
- Obtain [Cognitive Services API keys](https://azure.microsoft.com/en-us/try/cognitive-services/)
- Obtain an [Azure Subscription](https://azure.com)

First we seed a SQL database with the appropriate intents and responses. When the SQL database is ready, we create an API app in Visual Studio, which contains an API endpoint that accepts the user's message and does spell check and language understanding, then gets the appropriate response from the database to return back to the bot. 

The code to accept the user's message at the API endpoint is as follows. You can see that the calls to LUIS and Bing spell check are being made, followed by obtaining the reply from the data access layer.

```cs
public class ProcessMessageController : ApiController
    {
        private static readonly bool IsSpellCorrectionEnabled = bool.Parse(WebConfigurationManager.AppSettings["IsSpellCorrectionEnabled"]);

        private readonly BingSpellCheckService spellService = new BingSpellCheckService();

        // Messages get sent to this endpoint to be processed
        // POST api/processmessage
        public async Task<HttpResponseMessage> Post([FromBody]Message messageObj)
        {
            var msg = await this.spellService.GetCorrectedTextAsync(messageObj.message);
            var luisRes = await GetIntentsEntities(msg);
            // You could choose to handle the "none" intent here, or in the bot code
            var reply = new DataAccessLayer().GetInfo(luisRes);
            var resp = new HttpResponseMessage(HttpStatusCode.OK);
            resp.Content = new StringContent(reply, System.Text.Encoding.UTF8, "text/plain");
            return resp;
        }

        public async Task<LuisResult> GetIntentsEntities(string msg)
        {
            string appId = ConfigurationManager.AppSettings["LuisAppId"];
            string subscriptionKey = ConfigurationManager.AppSettings["LuisKey"];
            bool preview = true;
            string textToPredict = msg;
            try
            {
                LuisClient client = new LuisClient(appId, subscriptionKey, preview);
                LuisResult res = await client.Predict(textToPredict);
                return res;
            }
            catch (System.Exception exception)
            {
                throw new HttpResponseException(HttpStatusCode.BadRequest);
            }
        }
    }
```

Then, we need to make calls to the response database to obtain the bot response based on the user's intent. The code at the data access layer looks like the following: 

```cs
class DataAccessLayer
    {
        string dbConnection;

        public string GetInfo(LuisResult Luis)
        {
            try
            {
                // Remember to put your connection string in your web.config file
                dbConnection = ConfigurationManager.ConnectionStrings["DbConnStr"].ConnectionString;
                string entities = "";
                foreach (var item in Luis.Entities)
                {
                    entities = entities + item;
                }

                var sqlHelper = new SqlHelper();
                string query;

                if (Luis.Intents.Count() != 0)
                {
                    if (Luis.Entities.Count() == 0)
                    {
                        query = "SELECT [Answer] FROM  [dbo].[GeneralCompanyDetails] WHERE intent = '" + Luis.Intents[0].Name + "' AND Entity IS NULL";
                    }
                    else
                    {
                        query = "SELECT [Answer] FROM  [dbo].[GeneralCompanyDetails] WHERE intent = '" + Luis.Intents[0].Name + "' AND entity = '" + Luis.Entities + "'";
                    }
                    var result = sqlHelper.ExecuteScalar(dbConnection, CommandType.Text, query);
                    return result.ToString();
                }
                else
                {
                    return "";
                }
            }
            catch (Exception)
            {
                throw;
            }

        }
    }
```

For the Bing Spell check code, we used the following sample as a reference: https://github.com/Microsoft/BotBuilder-Samples/tree/master/CSharp/intelligence-LUIS 

For the API authentication code, we used [this post](https://code.tutsplus.com/tutorials/securing-aspnet-web-api--cms-26012) as a reference.

The bot will need to make calls to the API app, with the input being the user's utterance, and the response being the reply that the bot should give to the user. The following shows the main dialog, with the call to the API app on the bot side: 

```cs
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Connector;
using System.Configuration;

namespace CompanyBot1.Dialogs
{
    [Serializable]
    public class MainDialog : IDialog<object>
    {
        private static string companyId = "1";
        //url for the API to get response
        private static string uri = "YOUR_API_APP_URL";

        public async Task StartAsync(IDialogContext context)
        {
            context.Wait(this.MessageReceivedAsync);
        }

        public virtual async Task MessageReceivedAsync(IDialogContext context, IAwaitable<IMessageActivity> result)
        {
            var message = await result;

            var res = await GetReply(message.Text);
            await context.PostAsync(res);
        }

        public async Task<string> GetReply(string msg)
        {
            var client = new HttpClient();
            var msgObj = new Message()
            {
                companyId = companyId,
                message = msg
            };

            client.BaseAddress = new Uri(uri);
            client.DefaultRequestHeaders.TryAddWithoutValidation("Content-Type", "application/json; charset=utf-8");
            client.DefaultRequestHeaders.Add("API_KEY", "cornelia2017key");

            HttpRequestMessage request = new HttpRequestMessage(HttpMethod.Post, "api/processmessage");
            request.Content = new StringContent(JsonConvert.SerializeObject(msgObj),
                                                Encoding.UTF8,
                                                "application/json");

            var response = await client.SendAsync(request);
            var reply = response.Content.ReadAsStringAsync().Result;
            return reply;

        }
    }
}
```
 
## Conclusion ##

Tech One Global managed to built a solid proof of concept for their bot-as-a-service that is scalable and easy to manage over a user friendly web portal. They will be continuing to use Microsoft Cognitive Services and Bot Framework to develop their bot-as-a-service product offering, and eventually deploy it to production. In future, they plan to develop the bot-as-a-service offering for other functions of the business as well, such as HR, finance and internal helpdesk.

*"It was a great pleasure to attend the hackfest at Microsoft Philippines. Though we had already done some work with cognitive services and bot framework, through the hackfest we had the opportunity to get a better idea of the machine learning based services that we can build intelligent applications with. Cornelia will be an intelligent assistant that assists you as the front face for your organization to interact with your clients and employees and provide information and insights about your organization according to their role. She will also have the ability to assist employees on their day-to-day office activities."*

Haritha Thilakarathne, Software Engineer, Tech One Global

### Lessons Learned ###

The solution and architecture can be used as a reference for others who are looking to build **bot as a service solutions** that are customizable. We have found that building a single bot to service multiple customers has limitations, as each customer will not be able to open the bot to other channels like Messenger or Skype. Also, a response repository makes the responses much easier to manage across all bots, and removes the need to hard code.

If a bot to bot scenario is being discussed, step back and consider whether the function of the parent bot can be accomplished with an API app instead of a bot. Initially, we were fixated on a bot to bot scenario where the child bots (the individual company bots) would talk to a parent bot. However, later we found that we did not need a parent bot - an API app that called LUIS and the response database was sufficient. 