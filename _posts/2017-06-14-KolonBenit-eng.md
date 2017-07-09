---
layout: post
title: "Kolon Benit Chatbot project"
author: "YoungWook Kim, HyeWon Ryu"
#author-link: "#"
#author-image: "{{ site.baseurl }}/images/authors/photo.jpg"
date: 2017-06-14
categories: [CaaS]
color: "blue"
image: "images/KolonBenit01.jpeg"
excerpt: Kolon Benit is the subsidiary of Kolon group that is one of the primary business group in Korea.
language: [English]
verticals: [Enterprise]
geolocation: [Korea]
---

Kolon Benit Hackfest 

The project used Microsoft's Bot Framework and natural language processing technologies such as LUIS and QnA Maker to solve simple repetitive tasks for enterprise customers. It was very important to reduce simple repetitive tasks. Because most of the inquiries were simple inquiries.

The development of the artificial intelligence chatbot for private messengers of companies and public institutions 

Kolon Benit is the subsidiary of Kolon group that is one of the primary business group in Korea. Kolon Benit is in charge of IT works and provides solutions and services that the group needed. Most of all, the enterprise messenger named IKEN is used in many public institutions in Korea besides in the Kolon group. Because Kolon Benit had a high level of dependence on data center and little experience in cloud services, this Hackfest was a good chance to understand what a cloud service is and how to utilize Azure. 

## Key Technologies Used ##

[Microsoft Bot Framework](http://dev.botframework.com)
[LUIS](http://luis.ai)
[Web App - Microsoft Azure App Service](https://azure.microsoft.com/en-us/services/app-service/web/)
[SOAP Web Service](https://msdn.microsoft.com/en-us/library/ms995800.aspx)


Participants
- Jahyeong Koo - Kolong Benit, WA Team Leader
- DongSoo Kwak - Kolong Benit, SmartWork Team, General Manager of Platform Business Division 
- Solram Yoon - Kolong Benit, SmartWork Team, Manager of Platform Business Division 
- Seuongyup Oh – Kolong Benit, SmartWork Team, Assitant manager of Platform Business Division 
- Yeongwook Kim - Microsoft, Sr. Technical Evangelist
- Hyewon Ryu - Microsoft, Audience Evangelism Manager 
- Eunji Kim - Microsoft, Technical Evangelist


## Customer profile ##

![Kolon Benit]({{ site.baseurl }}/images/KolonBenit01.jpeg)  


![Kolon Benit]({{ site.baseurl }}/images/KolonBenit02.tiff)  
<Figure 1> The logo of Kolon Benit

Kolon Benit was established in 1990 and is running business in many areas of IT business such as SI, ERP and CRM. In addition, the company provides solutions for the public sectors besides the companies. At present the number of employees working in Kolon Benit is about 600. 

Kolon Benit provides the app named IKEN that can be used in conjunction with ERP system. IKEN allows to access various information needed at business. It also provides messenger features that help to progress business quickly. Members of the company can make a communication on safe and official channel. 

![Kolon Benit]({{ site.baseurl }}/images/KolonBenit03.tiff)  
<Figure 2> Kolon Benit IKEN


## Problem Statement ##

Kolon Benit provdes information and services necessary for business activity through the IKEN app. In addition customer’s requests and inquiries are processed using messenger service in the IKEN app. 

However over 80 percent of inquiries were very simple ones but processing them took much effort. And the existing SAP-based system had been operated for a long time so it had many features and menus. Naturally, inquiries about menus needed in business activity and permission requests were repeated and it caused increasing workload of the IT team.

To solve these problems, we decided to introduce a chatbot for giving guidelines and processing various inquiries and business system. 
 
## Solution and Steps ##

Microsoft and Kolon Benit had two orientations and at the orientations several tasks that have to be resolved were defined as below.

1. Implement the chatbot within the messenger features provided by the Kolon Benit IKEN app. Use Microsoft Bot Framework to implement features of the chatbot. 
2. Utilize natural language processing in the chatbot to handle business more naturally. 
3. Utilize DirectLine 3.0 provided by Bot Framework to connect the internal system of Kolon Benit and the chatbot. 
4. Implement Q&A feature to handle simple inquiries. 


 ![Kolon Benit]({{ site.baseurl }}/images/KolonBenit04.png)<br>
 ![Kolon Benit]({{ site.baseurl }}/images/KolonBenit08.png)<br>
<Figure 3> The structure diagram derived at the orientation

To solve problems, we composed the service architecture as show in the illustration below.

 ![Kolon Benit]({{ site.baseurl }}/images/KolonBenit05.png)  
<Figure 5> The architecture diagram of the Kolon Benit chatbot

1. Develop additional service for the Kolon Benit IKEN app
We decided to use Direct Line 3.0 API that can connect to Bot Framework using RESTful method. The connection using Direct Line API would be made between Bot framework and the host service that dedicates to providing services for the Kolon Benit IKEN app.

The IKEN app had a PC version and a mobile version, and the connection using Direct Line API was able to support both versions. Because most of services of Kolon Benit was based on Java, this connection part was implemented additionally using Java. 

2. Develop Bot Framework 
To add features to Microsoft Bot Framwork, we had to make a decision between C# and Node.js. Most of developers in Kolon Benit was skilled in using Java, but we decided to use C# for the additional development in future. Converstions were constructed using Dialog Class in Bot Framework, LUIS and QnA Maker were utilized, and the code that calls the internal system of Kolon Bent using SOAP method was implemented if needed. 

3. LUIS 
We used LUIS(Language Understanding Intelligent) service for more natural interfacing. LUIS is the service that used to process natural language. Kolon Bent had retained great interest in LUIS since LUIS started to support Korean on February 2017. 

We created scenarios that lead a conversation to teach LUIS. It was implemented in the manner of suggesting a new possible scenario when the flow of the conversation is completely out of the given scenario. 

4. QnA Maker 
QnA Maker is an appropriate service to handle simple inquiries. It crawls strings separated by tab or well-constructed FAQ websites, and learns crawled data beforehand, and then answers based on learned data. It is especially appropriate to the service that its update is very rare or non-preriodic. 

In this Project, QnA Maker was used to handle simple inquiries and worked well more than expected. 


## Technical Delivery ##

### Prerequisite steps ###
[Install Visual Studio](https://www.visualstudio.com/)<br>
[Bot Framework SDK](https://docs.microsoft.com/en-us/bot-framework/resources-tools-downloads)<br>
[Obtain Cognitive Services Keys](https://azure.microsoft.com/en-us/services/cognitive-services/)<br>
[Obtain Azure Subscription](https://azure.microsoft.com/ko-kr/offers/ms-azr-0044p/)<br>
[Make the internal system SOAP Interface](https://msdn.microsoft.com/en-us/library/h56f6hs6(v=vs.100).aspx)


What we did first is connect Bot Framework and the messenger provided by the Kolon Benit IKEN app using Direct Line 3.0. Direct Line 3.0 is REST API provided by Microsoft and is used to connect with the messenger services or the apps that Microsoft does not support directly. 

Because the service of the Kolon Benit IKEN app was implemented using Java, this connection code was written based on Java. 

To make a connection, code is needed such as request a token and create a conversation. 

```java
	  public ApiClient() {
	    // Use ISO 8601 format for date and datetime.
	    // See https://en.wikipedia.org/wiki/ISO_8601
	    this.dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ");
	

	    // Use UTC as the default time zone.
	    this.dateFormat.setTimeZone(TimeZone.getTimeZone("UTC"));
	

	    // Set default User-Agent.
	    setUserAgent("Java-Swagger");
	

	    // Setup authentications (key: authentication name, value: authentication).
	    authentications = new HashMap<String, Authentication>();
	    // Prevent the authentications from being modified.
	    authentications = Collections.unmodifiableMap(authentications);
	  }
	
	  public Authentication getAuthentication(String authName) {
	    return authentications.get(authName);
	  }
	

	  /**
	   * Helper method to set username for the first HTTP basic authentication.
	   */
	  public void setUsername(String username) {
	    for (Authentication auth : authentications.values()) {
	      if (auth instanceof HttpBasicAuth) {
	        ((HttpBasicAuth) auth).setUsername(username);
	        return;
	      }
	    }
	    throw new RuntimeException("No HTTP basic authentication configured!");
	}

	  public ApiClient setUserAgent(String userAgent) {
	    addDefaultHeader("User-Agent", userAgent);
	    return this;
	  }
	  public String selectHeaderAccept(String[] accepts) {
	    if (accepts.length == 0) return null;
	    if (StringUtil.containsIgnoreCase(accepts, "application/json")) return "application/json";
	    return StringUtil.join(accepts, ",");
	  }
	

	  public String selectHeaderContentType(String[] contentTypes) {
	    if (contentTypes.length == 0) return "application/json";
	    if (StringUtil.containsIgnoreCase(contentTypes, "application/json")) return "application/json";
	    return contentTypes[0];
	  }

	  public String serialize(Object obj, String contentType) throws ApiException {
	    if (contentType.startsWith("application/json")) {
	      return json.serialize(obj);
	    } else {
	      throw new ApiException(400, "can not serialize object into Content-Type: " + contentType);
	    }
	  }
	

	  public <T> T deserialize(ClientResponse response, TypeRef returnType) throws ApiException {
	    String contentType = null;
	    List<String> contentTypes = response.getHeaders().get("Content-Type");
	    if (contentTypes != null && !contentTypes.isEmpty())
	      contentType = contentTypes.get(0);
	    if (contentType == null)
	      throw new ApiException(500, "missing Content-Type in response");
	

	    String body;
	    if (response.hasEntity())
	      body = (String) response.getEntity(String.class);
	    else
	      body = "";
	

	    if (contentType.startsWith("application/json")) {
	      return json.deserialize(body, returnType);
	    } else if (returnType.getType().equals(String.class)) {
	      // Expecting string, return the raw response body.
	      return (T) body;
	    } else {
	      throw new ApiException(
	        500,
	        "Content type \"" + contentType + "\" is not supported for type: "
	          + returnType.getType()
	      );
	    }
	  }
	

	  private ClientResponse getAPIResponse(String path, String method, List<Pair> queryParams, Object body, byte[] binaryBody, Map<String, String> headerParams, Map<String, Object> formParams, String accept, String contentType, String[] authNames) throws ApiException {
	

	    if (body != null && binaryBody != null){
	      throw new ApiException(500, "either body or binaryBody must be null");
	    }
	

	    updateParamsForAuth(authNames, queryParams, headerParams);
	

	    Client client = getClient();
	

	    StringBuilder b = new StringBuilder();
	    b.append("?");
	    if (queryParams != null){
	      for (Pair queryParam : queryParams){
	        if (!queryParam.getName().isEmpty()) {
	          b.append(escapeString(queryParam.getName()));
	          b.append("=");
	          b.append(escapeString(queryParam.getValue()));
	          b.append("&");
	        }
	      }
	    }
	

	    String querystring = b.substring(0, b.length() - 1);
	

	    Builder builder;
	    if (accept == null)
	      builder = client.resource(basePath + path + querystring).getRequestBuilder();
	    else
	      builder = client.resource(basePath + path + querystring).accept(accept);
	

	    for (String key : headerParams.keySet()) {
	      builder = builder.header(key, headerParams.get(key));
	    }
	    for (String key : defaultHeaderMap.keySet()) {
	      if (!headerParams.containsKey(key)) {
	        builder = builder.header(key, defaultHeaderMap.get(key));
	      }
	    }
	

	    String encodedFormParams = null;
	    if (contentType.startsWith("multipart/form-data")) {
	      FormDataMultiPart mp = new FormDataMultiPart();
	      for (Entry<String, Object> param: formParams.entrySet()) {
	        if (param.getValue() instanceof File) {
	          File file = (File) param.getValue();
	          mp.field(param.getKey(), file.getName());
	          mp.bodyPart(new FileDataBodyPart(param.getKey(), file, MediaType.MULTIPART_FORM_DATA_TYPE));
	        } else {
	          mp.field(param.getKey(), parameterToString(param.getValue()), MediaType.MULTIPART_FORM_DATA_TYPE);
	        }
	      }
	      body = mp;
	    } else if (contentType.startsWith("application/x-www-form-urlencoded")) {
	      encodedFormParams = this.getXWWWFormUrlencodedParams(formParams);
	    }
	

	    ClientResponse response = null;
	

	    if ("GET".equals(method)) {
	      response = (ClientResponse) builder.get(ClientResponse.class);
	    } else if ("POST".equals(method)) {
	      if (encodedFormParams != null) {
	        response = builder.type(contentType).post(ClientResponse.class, encodedFormParams);
	      } else if (body == null) {
	        if(binaryBody == null)
	            response = builder.post(ClientResponse.class, null);
	        else
	            response = builder.type(contentType).post(ClientResponse.class, binaryBody);
	      } else if (body instanceof FormDataMultiPart) {
	        response = builder.type(contentType).post(ClientResponse.class, body);
	      } else {
	        response = builder.type(contentType).post(ClientResponse.class, serialize(body, contentType));
	      }
	    } else if ("PUT".equals(method)) {
	      if (encodedFormParams != null) {
	        response = builder.type(contentType).put(ClientResponse.class, encodedFormParams);
	      } else if(body == null) {
	        if(binaryBody == null)
	            response = builder.put(ClientResponse.class, null);
	        else
	            response = builder.type(contentType).put(ClientResponse.class, binaryBody);
	      } else {
	        response = builder.type(contentType).put(ClientResponse.class, serialize(body, contentType));
	      }
	    } else if ("DELETE".equals(method)) {
	      if (encodedFormParams != null) {
	        response = builder.type(contentType).delete(ClientResponse.class, encodedFormParams);
	      } else if(body == null) {
	        if(binaryBody == null)
	            response = builder.delete(ClientResponse.class);
	        else
	            response = builder.type(contentType).delete(ClientResponse.class, binaryBody);
	      } else {
	        response = builder.type(contentType).delete(ClientResponse.class, serialize(body, contentType));
	      }
	    } else {
	      throw new ApiException(500, "unknown method type " + method);
	    }
	    return response;
	  }
	  private Client getClient() {
	    if(!hostMap.containsKey(basePath)) {
	      Client client = Client.create();
	      if (debugging)
	        client.addFilter(new LoggingFilter());
	      hostMap.put(basePath, client);
	    }
	    return hostMap.get(basePath);
	  }
	}
```
<code 1> the part of Java source code to make a connection using Direct Line 

To connect Bot Framework and other services, we implemented helper classes as below.
1. LuisHelper.cs
2. QnAMakerHelper.cs
3. SOAPHelper.cs
LuisHelper calls API and displays received results in JSON format. We used Newtonsoft library to handle JSON format in our code.

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

Because of QnA Maker, the development period of this project was reduced drastically. QnA Maker is a service that learns basic FAQ from various sources such as txt, url, pdf and doc and is able to answer based on learned data. it made simple to implement the complex search feature.  

![Kolon Benit]({{ site.baseurl }}/images/KolonBenit06.png)  

 
```cs
string responseString = string.Empty;

var query = “hi”; //User Query
var knowledgebaseId = “YOUR_KNOWLEDGE_BASE_ID”; // Use knowledge base id created.
var qnamakerSubscriptionKey = “YOUR_SUBSCRIPTION_KEY”; //Use subscription key assigned to you.

//Build the URI
Uri qnamakerUriBase = new Uri("https://westus.api.cognitive.microsoft.com/qnamaker/v1.0");
var builder = new UriBuilder($"{qnamakerUriBase}/knowledgebases/{knowledgebaseId}/generateAnswer");

//Add the question as part of the body
var postBody = $"{ {\"question\": \"{query}\"} }";

//Send the POST request
using (WebClient client = new WebClient())
{
    //Set the encoding to UTF8
    client.Encoding = System.Text.Encoding.UTF8;

    //Add the subscription key header
    client.Headers.Add("Ocp-Apim-Subscription-Key", qnamakerSubscriptionKey);
    client.Headers.Add("Content-Type", "application/json");
    responseString = client.UploadString(builder.Uri, postBody);
}
```

At last, to work with SAP, we implemented the service that can support SAP using Java. In addition, we exposed two web methods in SOAP format. These methods are for searching requisite menus and requesting permission respectively. And the code that is able to call SOAP was added to Bot Framework. 

![Kolon Benit]({{ site.baseurl }}/images/KolonBenit07.png)  
 
Hackfest with Kolon Benit took five days of total: two times of orientation, and project progressing for three days. 

Feb. 20, orientation – Adjusted Hackfest schedule and development range. 
Feb. 22, orientation – Instructed in Bot Framework and LUIS beforehand. 
Apr. 21, Hackfest – Connected the IKEN service and Bot Framwork using Direct Line API. 
Apr. 22, Hackfest – Constructed Dialogs, and progressed teaching LUIS and connecting to LUIS. 
Apr. 24, Hackfest – Developed an automatic response feature for simple inquiries using OnA Maker. 

## Conclusion ##

Through the Hackfest, Kolon Benit became to be able to provide the intelligent service named a bot that outperforms the existing enterprise messenger. By automating repetitive works, the improvement in work efficiency was triggered. In addition, Kolon Benit became understood about Microsoft Azure platform and had experience in creating new service by connecting many services in server-less manner.

Kolon Benit solved the following problems through this project.

1. We were able to replace the SAP-related request with a chat bot.
   (I developed a web service that retrieves the SAP menu list and requests permission.
   Web services are provided in a SOAP way.
   Chatbot has invoked a web service that provides an appropriate SAP menu and requests permission whenever users request it.)
2. It is now possible to automate simple IT-related requests.
   (More than 80% of the requests per day were simple requests.
   Chatbot has been able to process a lot of simple requests by analyzing users' needs with LUIS and invoking appropriate services.)
3. Most of all, we can learn about chatbot and natural language processing, so it can be applied to various projects in the future.
   (Kolon Benit's core staff has developed together. However, most of Kolon Benit's employees were Java developers and had no experience with Microsoft Azure.
  To do this, we provided learning materials in advance and supported learning through two pre-meetings.)

The following techniques were used in this project.

Microsoft Bot Framework
Azure Web App
Language Understanding Intelligent Service (LUIS)
QnA Maker

Additional resources

- Bot Framework: [http://dev.botframework.com](http://dev.botframework.com)
- LUIS: [http://luis.ai](http://luis.ai)
- QnA Maker: [http://QnAMaker.ai](http://QnAMaker.ai) 
