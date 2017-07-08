---
layout: post
title: "Chunjae Education Project"
author: "YoungWook Kim, Hyewon Ryu"
author-link: "#"
#author-image: "{{ site.baseurl }}/images/authors/photo.jpg"
date: 2016-12-08
categories: [CaaP]
color: "blue"
image: "images/chunjae01.jpeg"
excerpt: Chunjae Education Inc. is one of the major education publishers in Korea.
language: [English]
verticals: [Education]
geolocation: [Korea]
permalink: /chunjae-education.html
---
Chunjae Hackfest
Intelligent ChatBot for Education Solutions

The project was accompanied by a Chunjae education that provides education services in Korea.
Chunjae education wanted to serve the encyclopedia that it had with chatbot and hoped that it could be done smoothly by natural language processing.

Chunjae Education Inc. is one of the major education publishers in Korea. As well as textbooks used in school, it publishes more than 3,700 education materials for elementary school, middle school, and high school. Since 2003, it provides the online education services under its own title and provides education services through its related companies in various sectors including multimedia, online, and device businesses.

### Key Technologies Used ###
[Microsoft Bot Framework](http://dev.botframework.com)<br>
[LUIS](http://luis.ai)<br>
[Cognitive Services](https://azure.microsoft.com/ko-kr/services/cognitive-services/)<br>
[Azure Web App](https://azure.microsoft.com/ko-kr/services/app-service/web/)

Hackfest Task Force
-	Hyun-seop Chung, Manager / Chunjae Education Contents Biz Dept. including for staffs
-	Young-wook Kim, Chief Manager / Microsoft, Sr. Technical Evangelist. 
-	Hye-won Ryu, Manager / Microsoft, Audience Evangelism Manager. 


## Customers ##

![Chunjae]({{ site.baseurl }}/images/Chunjae01.jpeg)   
<Figure 1> Chunjae Education Company Logo
 Since its establishment in 1986, Chunjae Education has grown to be a mid-sized company which operates various businesses, such as education materials including textbooks for public and private schools, online education, printing, distribution, and young talent search in mathematics and science. 
Chunjae Education is trying to improve customer services including VR and online messenger in various fields. It operates an education business using Android-based tablet, so it provides the education contents and services with the exclusive tablets. 

![Chunjae]({{ site.baseurl }}/images/Chunjae02.jpeg)   
<Figure 2> MilkT, Chunjae Education’s Device

 Chunjae Education uses KakaoTalk messenger to provide services to its customers. KakaoTalk is the most popular messenger service in Korea, having about 50 million users. 

## Problem Statement ##
 Chunjae Education has sent its news and notices through Plus Friend, a kind of company account provided by KakaoTalk. However, it needed to introduce an intelligent ChatBot service for more proactive service. 

 The intelligent ChatBot service is a completely new field that we have never tried before. So it aimed to learn key technologies with Microsoft and Hackfest and experience trial-and-error first which it would face in a real project. 
 There were many fields to try. First, it decided to implement the encyclopedia service, ‘Chunjae Learning Encyclopedia with the ChatBot 

## Solution Overview ##
 In the two preparatory meetings with Chunjae Education, we defined the challenges to solve as follows:
1.	Implement a ChatBot in the Plus Friend provided by KakaoTalk Messenger. The functions of the ChatBot will use Microsoft’s Bot Framework, 
2.	Use the natural language processing feature for smooth task processing on the ChatBot, 
3.	Use DirectLine 3.0 provided by Bot Framework to connect the internal system of KakaoTalk with the Chatbot, and
4.	Implement Q&A feature to handle simple questions. 

![Chunjae]({{ site.baseurl }}/images/Chunjae03.jpeg)   
<Figure 3> Configuration Chart Developed in the Meeting with Chunjae Education

We have designed the architecture as follows to solve the challenge:

![Chunjae]({{ site.baseurl }}/images/Chunjae04.png)   
<Figure 5> Chunjae ChatBot Service Architecture

1.	Connecting with KakaoTalk Messenger
For now, Microsoft’s Bot Framework does not support KakaoTalk officially. So we determined to connect Microsoft Bot Framework with KakaoTalk by using the DirectLine 3.0 API which can connect to Microsoft Bot Framework using the RESTFul service.
 Many of Chunjae Education’s internal developers are familiar with Node.js. So we decided to use Node.js for the development.

2.	Developing the Bot Framework
To add features to the Microsoft Bot Framework, we needed to select either of C# or Node.js. Many of Chunjae Education’s internal developers preferred Node.js, however, we chose C#, instead of Node.js, for the Bot Framework for additional development in the future. For the Bot Framework, we used the dialog class to configure conversation, utilized LUIS and log, and wrote codes which call the internal search engine of Chunjae. 

3.	LUIS
For a natural and smooth interface, we used LUIS (Language Understanding Intelligent) service. LUIS is a service used to process natural languages and Chunjae Education has shown the highest interest in this service as Korean was supported in the end of February, 2017. We wrote scenarios which guided dialogs for learning. In these scenarios, another possible dialog is proposed when users try dialogs which are completely different from the scenario. 
 However, since there were a lot of contents and words required for learning, we developed a separate tool.

4.	PTT (Pre-Training Tools)
Chunjae Education’s encyclopedia includes huge amount of knowledge. We determined that it was impossible for the Bot to learn the contents on the Luis.ai site manually. So we decided to develop a desktop App which can help the Bot learn a huge volume of data with the Excel-based JSON file that can be recognized by LUIS. For JSON, we used Excel to include questions and contents. We named the tool PTT. 

## Technical Delivery ##

 To connect with KakaoTalk messenger, we need to interwork with the KakaoTalk API. As shown in https://github.com/plusfriend/auto_reply, four APIs should be implemented by default to connect with KakaoTalk messenger: 

-	Home Keyboard API

This API calls the list of Auto-ACK commands which will be displayed on the keyboard area when a user enters a chatting room for the first time. 

Method : GET
URL : http(s)://:your_server_url/keyboard
Content-Type : application/json; charset=utf-8
Ex) curl -XGET 'https://:your_server_url/keyboard'

-	Message Receive and Auto-ACK API

This API sends the command selected by the user to the partner’s server.
The response to the Auto-ACK command consists of the response message and the response type on the keyboard area based on the response message. The response type can be chosen either of text (subjective) or buttons (objective).

Method : POST
URL : http(s)://:your_server_url/message
Content-Type : application/json; charset=utf-8

- Add/Block Friend Notification API

When a KakaoTalk user adds or blocks the Plus Friend, this API sends the corresponding information to the partner’s server.

Method : POST / DELETE
URL : http(s)://:your_server_url/friend
Content-Type : application/json; charset=utf-8

To connect the auxiliary features in the Bot Framework, we developed the Helper classes as follows: 
1.	LuisHelper.cs
2.	QnAMakerHelper.cs
3.	SearchEngineHelper.cs
4.	LoggingHelper.cs

LuisHelper calls the API, gets the result as JSON, and then shows the result. To use JSON, we used the Newtonsoft library in the code. 

```cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Threading.Tasks;
using System.Net.Http;
using Newtonsoft.Json;

namespace Bot_Application1.Helper
{

    //https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/befe90e0-9b68-4562-bbb0-e3b387d9381a?subscription-key=cf5ac7b9b1dd465fbe9bbd1e46ab1564&verbose=true&timezoneOffset=0&q=
    public class LuisHelper
    {
        public static async Task<Entities.LUIS> ParseUserInput(string strInput)
        {
            const string APPLICATION_ID = "{Application ID}";
            const string SUBSCRIPTION_KEY = "{Subscription Key}";

            string strRet = string.Empty;
            string strEscaped = Uri.EscapeDataString(strInput);

            using (var client = new HttpClient())
            {
                string uri = string.Format("https://api.projectoxford.ai/luis/v1/application?id={0}&subscription-key={1}&q={2}", APPLICATION_ID, SUBSCRIPTION_KEY, strEscaped);
                HttpResponseMessage msg = await client.GetAsync(uri);

                if (msg.IsSuccessStatusCode)
                {
                    var jsonResponse = await msg.Content.ReadAsStringAsync();
                    var _Data = JsonConvert.DeserializeObject<Entities.LUIS>(jsonResponse);
                    return _Data;
                }
            }
            return null;
        }
    }
}
```

The dialogues are logged because they can be used as data when there is any problem or any analysis is required. Logs are recorded in the Azure SQL Server. To handle the log, we wrote the LoggingHelper class. 

```cs
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using System.Data.SqlClient;

namespace Bot_Application1.Helper
{

    public class TalkLoggingHelper
    {
        private static string ConnectionString = "{Connection String}";

        public static void TalkLogging(string channelID, string userID, string messageText)
        {
            string query = "INSERT INTO dbo.TalkLogging(ChannelID, UserID, MessageText, TalkTime)" +
                " VALUES(@ChannelID, @UserID, @MessageText, GETDATE())";

            SqlConnection connect = new SqlConnection(ConnectionString);
            SqlCommand command = new SqlCommand(query, connect);

            //Parameter setting
            SqlParameter[] para =
            {
                new SqlParameter("@ChannelID", System.Data.SqlDbType.VarChar),
                new SqlParameter("@UserID", System.Data.SqlDbType.VarChar),
                new SqlParameter("@MessageText", System.Data.SqlDbType.NVarChar, 500)
            };

            para[0].Value = channelID;
            para[1].Value = userID;
            para[2].Value = messageText;

            command.Parameters.Clear();
            foreach(SqlParameter p in para)
            {
                command.Parameters.Add(p);
            }

            //Query execution
            connect.Open();
            command.ExecuteNonQuery();
            connect.Close();
        }
    }
}
```

As a final step, we developed a dedicated training tool to make LUIS recognize huge knowledge contents of Chunjae Education. We utilized WPF to develop this tool and it creates Excel-based LUIS.json files which can be imported to LUIS. 
 During the Hackfest period, we named this tool PTT (Pre-Training Tool). 
PTT consists of four tabs with various steps. The first step is to create a project. 

![Chunjae]({{ site.baseurl }}/images/Chunjae05.png)   

At the second step, load an Excel file. The Excel file consists of four sheets: Intent, Entities, Entities Data, and Sentence. Fill the contents in the file and then load the file. The contents are read as follows: 

![Chunjae]({{ site.baseurl }}/images/Chunjae06.png)   

The final step is to create a JSON file based on the Excel file loaded. 

![Chunjae]({{ site.baseurl }}/images/Chunjae07.png)    

With PTT, we ensured that the training time got shorter significantly. We planned to improve this tool by developing additional features in the future. The source code of the PTT tool is open at: https://github.com/KoreaEva/Bot/tree/master/Tools/LUIS%20Pre-Traning%20Tool/YoungWook.LUIS.PTT. 


## Conclusion ##

Chunjae education has enabled students to use natural language for the information they need. LUIS was the key here. LUIS is available in Korean, which is a significant advantage over other competitors.

 Chunjae education preferred a way to learn a variety of Korean in advance in order to increase the recognition rate. So I developed a program that generates a JSON file that can be recognized by LUIS at once in Excel.
 We named the program as PTT (Pre-Training Tool) and made it possible to read the texts needed for Intents, Entities and learning from Excel.

 ChunJae education was connected with KakaoTalk service which is most used in Korea.
In addition, we have developed a function to search internal dictionaries and to leave a log.
It was a very short time on the 3rd, but based on the results, we are ready to expand to web chat service and features for Android app.

[Bot Framework](http://dev.botframework.com)<br>
[LUIS](http://luis.ai)
[PTT](http://github.com/KoreaEva/Bot)
