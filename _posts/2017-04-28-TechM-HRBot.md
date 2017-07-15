---
layout: post
title:  "Tech Mahindra develops a conversational Bot to help employees connect and get relevant Human Resource related information in real time."
author: "Ritesh Modi"
author-link: "http://twitter.com/automationnext"
#author-image: "{{ site.baseurl }}/images/TechM/ritesh.jpg"  #should be ~350px tall
date:   2017-04-19
categories: [Conversations as a Platform, Cognitive Services]
color: "blue"
image: "images/TechM/TechM.png" #should be ~350px tall
excerpt: Tech Mahindra develops a conversational Bot HR Bot for internal company employees to connect and get relevant Human Resource related information in real time.
language: English
verticals: [Human Resource]
geolocation: [India]
---


<img src="{{ site.baseurl }}/images/TechM/TechM.png" width="400">

Tech Mahindra develops a conversational Bot HR Bot using Microsoft Bot framework and cognitive services (LUIS.ai)  for internal company employees to connect and get relevant Human Resource related information in real time.

## Customer profile

[Tech Mahindra](http://www.techmahindra.com/) , are a USD 4.2 billion company with 117,000+ professionals across 90 countries, helping over 825 global customers including Fortune 500 companies. Their convergent, digital, design experiences, innovation platforms and reusable assets connect across a number of technologies to deliver tangible business value and experiences to their stakeholders. Tech Mahindra is amongst the Fab 50 companies in Asia (Forbes 2016 list). Tech Mahindra is part of the USD 17.8 billion Mahindra group
Tech Mahindra undertook an initiative to create a Bot for the HR department. They evaluated Microsoft Bot framework and Microsoft Cognitive Services APIs that included LUIS, Text Analytics and Bing Spell Check to satisfy all their requirements Post the implantation, the development team showcased their Bot implementation to the HR department and received positive response from them.



**The Core team:**

* Pravin Ramteke – Program Manager, tech Mahindra
* Manish Chitre - Developer, Tech Mahindra
* Satyansh Sagar - Developer, Tech Mahindra
* Saonti Ghosh - Developer, Tech Mahindra
* [Ritesh Modi](http://twitter.com/automationnext) - Senior Technical Evangelist, Microsoft DX India
* [Brijraj Singh](https://twitter.com/brijrajsingh) – Senior Technical Evangelist, Microsoft DX India


![The team during the value stream mapping and hackfest - image 1]({{ site.baseurl }}/images/TechM/hackfest-1.jpg)

![The team during the value stream mapping and hackfest - image 2]({{ site.baseurl }}/images/TechM/hackfest-2.jpg)

**The Core team:**

* Microsoft Bot Framework
* Azure Cognitive Service (LUIS) – Natural Language processing
* Azure Cognitive Service Text Analytics – Keyword extraction
* Azure DocumentDB
* Azure Search service
* Bing Spell Check



## Problem Statement

Tech Mahindra HR supports large volume of queries and requests across the globe asking for various type of information related to Human Resource. For e.g. Attrition Rate, Country Safety Status, Key Skill Data, information on some standard questions etc. Most of queries are repetitive in nature and therefore a modern standardized solution was the ask. Tech Mahindra have built and deployed a Bot to respond to employee queries in real time around the clock across geographies. Employees can now type their queries in regular English and the bot understands the intent behind the query and provides adequate answers. Tech Mahindra partnered with Microsoft in building the Bot and implementing the solution using appropriate technology components.




## Solution, steps, and delivery

Both Microsoft and Tech Mahindra together defined the architecture and design for the Bot implementation. 

There are six different conversation flow for HR Bot. 

* Country Clearance
* Demographic Data
* Entity Presence
* Rebadging
* RFP Queries
* Attrition Information

A sample flow from Country Clearance is shown here

![Step 1 - image 1]({{ site.baseurl }}/images/TechM/1.jpeg)
![Step 2 - image 2]({{ site.baseurl }}/images/TechM/2.jpeg)
![Step 3 - image 3]({{ site.baseurl }}/images/TechM/3.jpeg)
![Step 4 - image 4]({{ site.baseurl }}/images/TechM/4.jpeg)
![Step 5 - image 5]({{ site.baseurl }}/images/TechM/5.jpg)
![Step 6 - image 6]({{ site.baseurl }}/images/TechM/6.jpg)
![Step 7 - image 7]({{ site.baseurl }}/images/TechM/7.jpg)
![Step 8 - image 8]({{ site.baseurl }}/images/TechM/8.jpg)
![Step 9 - image 9]({{ site.baseurl }}/images/TechM/9.jpg)
![Step 10 - image 10]({{ site.baseurl }}/images/TechM/10.jpg)
![Step 11 - image 11]({{ site.baseurl }}/images/TechM/11.jpg)
![Step 12 - image 12]({{ site.baseurl }}/images/TechM/12.jpg)
![Step 13 - image 13]({{ site.baseurl }}/images/TechM/13.jpg)


We made the following design and architectural decisions: 

1.	No values should be hard-coding in the Bot, all interaction text should come from external DocumentDB NoSQL database in JSON format
2.	Azure Search should be used free text search. All Conversation text is fetched from Resource files while all free text searches are conducted on Azure Search.
3.	The flow of the conversation should be intuitive and friendly for users
4.	Integrate DocumentDB and Azure Search – Azure Search provides advance search query features that will enable Bot to make advance queries and get relevant data. RFP queries flow within the solution makes use of this feature by executing free text queries against Azure search.
5.	LUIS Entities, Intents and features should reflect reality
6.	Usage of Text Analytics Cognitive services for analyzing free text search
7.	There should be no single dialog in the codebase. The entire codebase should be written as multiple Dialogs each having a single responsibility. Usage of Bing Spell checker to ensure that correct words are used for querying.
8.	Introducing paging in bots – users should not be scrolling either horizontally or vertically.

The BOT architecture is described below: 

![Solution Architecture]({{ site.baseurl }}/images/TechM/solution.png)

The sections below describe the implementation details for Cognitive Services, Azure DocumentDB, Azure Search and the Microsoft Bot framework 



## Cognitive Services


### *LUIS.ai (Language Understanding intelligent service)* ###


Free form queries can help the employees submit queries in their natural form and Bot should be intelligent enough to comprehend the intent and respond back accordingly. We decided to use LUIS.ai to create the most common intents that an employee may express while interacting with the bot. TECH M team generated the intents, related entities and trained them with some self-generated utterances. The return values from LUIS are used to perform search queries on Azure search for some of the flows which holds all information about HR department. At the same time, all content related to Bot conversation with user is fetched from DocumentDB. Both Azure Search and DocumentDB information is provided in later sections of the document. Given below is a snapshot of optimized Intents and Entities. 

![LUIS Intents]({{ site.baseurl }}/images/TechM/intents.png)
![LUIS Entities]({{ site.baseurl }}/images/TechM/entities.png)
![LUIS Features]({{ site.baseurl }}/images/TechM/features.png)
![LUIS Dashboard]({{ site.baseurl }}/images/TechM/luisDashboard.png)


### *Text Analytics - Keyword Extraction* ###

One of the flows in HR Bot related to RFP queries is a free form conversation between user and Bot. Users type their queries in their natural form and Bot should not only be able to identify the intent but also conduct intelligent search against the database using Azure Search with important keywords from the user. 
[Keyword extraction Text Analytics API](https://www.microsoft.com/cognitive-services/en-us/text-analytics-api) was used to extract the Keywords and perform case-insensitive queries against Azure search using those keywords. This search is done over and above the normal search with as-is content from the user. Both the contents are joined together into a single data structure, eliminate the duplication, sorted based on their confidence values and presented to user. 



### *Bing Spell Check* ###

Bing spell check was used to auto-correct the spellings and the same was integrated at LUIS level. Image shown next shows Bing Spell check association with Luis.

![Bing Spell check Config]({{ site.baseurl }}/images/TechM/BingSpellCheck-1.png)
![Bing Spell check Config]({{ site.baseurl }}/images/TechM/BingSpellCheck-2.png)




## Azure Services


### *DocumentDB* ###


To avoid coping resource files manually from excel files, we decided to store all information in DocumentDB collections and integrated the DocumentDB to Azure Search. 

The advantage of this approach is: 

1.	Easier management of data for CRUD operations. It is easier to manage data in JSON format rather than in Excel files
2.	Automation of entire flow from DevOps perspective
3.	Availability of single source of data that acts as master.

Following shows a sample DocumentDB collections created for this project. 

docdbcollections
![Bing Spell check Config]({{ site.baseurl }}/images/TechM/docdbcollections.png)

A sample document structure for Head counts and Country clearance is shown next. 

![Head Count schema]({{ site.baseurl }}/images/TechM/headcount.png)
![Country Clearance Schema]({{ site.baseurl }}/images/TechM/countryclearance.png)

A .NET utility was written to upload all existing data to DocumentDB collections. Sample code for the same is shown here.

```c#
namespace UploadJsonToDocumentDB
{
    class Program
    {
        private static string documentDbName = "xxxxxxxxxxxxx";    
       static void Main(string[] args)
       {
            UploadClient client = new UploadClient();

            client.ConnectDocumentDb();

            ObjectFactory objfact = new ObjectFactory();

            var objList = objfact.AddList();

            foreach (KeyValuePair<object,string> obj in objList)
            {
                client.UploadJsonDocuments(documentDbName, obj.Value, obj.Key as   dynamic).Wait();
            }
        }
    }

```

```c#
namespace UploadJsonToDocumentDB
{
    class UploadClient
    {
        private const string _EndpointUrl = "xxxxxxxxxxxx";
        private const string _primaryKey = "xxxxxxxxxx";
        private DocumentClient _client;

        public void ConnectDocumentDb()
        {
            this._client = new DocumentClient(new Uri(_EndpointUrl), _primaryKey);
        }

        public async Task UploadJsonDocuments(string databaseName, string collectionName, dynamic obj)
        {

            await    this._client.CreateDocumentAsync(UriFactory.CreateDocumentCollectionUri(databaseName, collectionName),obj);

        this.WriteToConsoleAndPromptToContinue("Created {0}", obj.Id);

    }


    public void WriteToConsoleAndPromptToContinue(string format, params object[] args)
    {
        Console.WriteLine(format, args);
        Console.WriteLine("Press any key to continue ...");
        //Console.ReadKey();
    }
}

```

```c#
namespace UploadJsonToDocumentDB
{
    class ObjectFactory
    {
        private AttritionSerializable _attritionObj;
        private CountrySerializable _countryObj;
        private DemographicSerializable _demographicObj;
        private Dictionary<object,string> _objects;

    public ObjectFactory()
    {
        _attritionObj = new AttritionSerializable();
        _countryObj = new CountrySerializable();
        _demographicObj = new DemographicSerializable();
        _objects = new Dictionary<object, string>();
    }

    public Dictionary<object,string> AddList()
    {
        _objects.Add(_attritionObj,"attrition");
        _objects.Add(_countryObj,"country");
        _objects.Add(_demographicObj,"demographic");
        return _objects;
    }


}

```

DocumentDB is integrated with Azure Search using Azure out of box connector. The same has been shown in next image. 

![Search Configuration]({{ site.baseurl }}/images/TechM/searchConfig-1.png)



### *Azure Search* ###


Azure search gets all its data from DocumentDB using out of box connector to move data. Data that is stored in DocumentDB is also available for search from Azure Search. Azure Search is ensuring that rich search language can be used to query the search database and this in turn in helping write complex requirements with quite an ease. The next image shows the Azure portal with Search configuration. It also depicts sample schema used for Search Indexes

![Search Configuration]({{ site.baseurl }}/images/TechM/searchConfig-2.png)
![Search Index]({{ site.baseurl }}/images/TechM/searchIndex.png)
![Detailed Search Index]({{ site.baseurl }}/images/TechM/searchIndexdetails.png)

Code for Querying against Azure Search is shown next. Bot dialogs make use of these classes to get data from Azure Search.

```c#
namespace AzureSearch
{
    public class AuthenticationSearchClient
    {
        private static AuthenticationSearchClient _authClient = null;
        private string _searchServiceName;
        private string _queryApiKey;
        public  SearchServiceClient _serviceClient; 
   
        private AuthenticationSearchClient()
        {

        }

  //Create and authenticate search service client.

    public  void CreateSearchServiceClient(string searchServiceName,string apiKey)
    {
        _searchServiceName = searchServiceName;

        _queryApiKey = apiKey;

        _serviceClient = new SearchServiceClient(_searchServiceName, new SearchCredentials(_queryApiKey));
    }

    public static AuthenticationSearchClient GetAuthenticatedSearchClient()
    {
        return _authClient ?? (_authClient = new AuthenticationSearchClient());
    }
}
```

```c#
namespace AzureSearch
{
    public class SearchClient
    {
        private List<string> _resultList;

        public SearchClient()
        {
            _resultList = new List<string>();

        }

    //Search Query
    public async Task SearchQuery<T>(string query, T obj, string indexName,SearchServiceClient serviceClient, SearchParameters _searchParameters) where T : class
    {
        ISearchIndexClient indexClient = serviceClient.Indexes.GetClient(indexName);

        var _result = await indexClient.Documents.SearchAsync<T>(query, _searchParameters);


        foreach (var results in _result.Results)
        {
            _resultList.Add(results.Document.ToString());
        }
    }

    public List<string> GetResultList()
    {
        return _resultList;
    }

}
```




## Bot Framework

The bot is based on LUIS intents which are presented to the user like a menu, the user also has flexibility to type their intent for some of the flows. The bot was developed using C# and is deployed over Azure as an App Service. The Bot is divided into multiple dialog each responsible for a single flow. Bot tries to identify the intent and based on same redirects the request to appropriate dialog.

There are Six different flows within HR Bot. The flow for Country Clearance is shown next.


![Flow Diagram]({{ site.baseurl }}/images/TechM/flowdiagram.png)


MessagesController passes the request to HrLuisDialog which in turn redirects the request to appropriate dialog.


The code for HrLuisDialog is shown next

```c#
namespace HrBotV3.LuisDialog
{
    [Serializable]
    [LuisModel("", "")]
    public class HrLuisDialog:LuisDialog<object>
    {
        private string searchServiceName =      ConfigurationManager.AppSettings["searchServiceName"];
        private string apiKey = ConfigurationManager.AppSettings["azureApiKey"];    

    [LuisIntent("CountryClearance")]
    private async Task CountryClearanceAsync(IDialogContext context, LuisResult result)
    {
        await context.Forward(new CountryClearanceDialog(), OnCompeletionAsync, result, System.Threading.CancellationToken.None);
    }

    [LuisIntent("Attrition")]
    private async Task AttritionAsync(IDialogContext context, LuisResult result)
    {        
        await context.Forward(new AttritionDialog(), OnCompeletionAsync, result, System.Threading.CancellationToken.None);
    }

    [LuisIntent("Demographic")]
    private async Task DemographicAsync(IDialogContext context, LuisResult result)
    {
        await context.Forward(new DemographicDialog(), OnCompeletionAsync, result, System.Threading.CancellationToken.None);

    }

    [LuisIntent("None")]
    private async Task None(IDialogContext context, LuisResult result)
    {
        await context.Forward(new NoneDialog(), OnCompeletionAsync, result, System.Threading.CancellationToken.None);
    }

    [LuisIntent("Rebadging")]
    private async Task Rebadging(IDialogContext context, LuisResult result)
    {
        await context.Forward(new RebadgingDialogs(), OnCompeletionAsync, result, System.Threading.CancellationToken.None);
    }

    [LuisIntent("Help")]
    private async Task HelpAsync(IDialogContext context, LuisResult result)
    {
        await context.PostAsync("Help is coming soon.. !");
    }
    private async Task OnCompeletionAsync(IDialogContext context, IAwaitable<object> result)
    {
        context.Wait(MessageReceived);
    }
}

```
The individual dialog then takes control and further interacts with the user based on its configuration and implementation.

Sample code for one of the dialog CountryClearance is shown next

```c#
Namespace HrBotV3.Dialogs
{
    [Serializable]
    public class CountryClearanceDialog : IDialog<object>
    {
    	private EntityRecommendation _location;
	private EntityRecommendation _entitypresence;
	private EntityRecommendation _ragstatus;
        private EntityRecommendation _travelrisks;
        private EntityRecommendation _clearance;
        private EntityRecommendation _annexuresharing;

        public static CountryManager CountryProp { get; set; }

    public async Task StartAsync(IDialogContext context)
    {
        context.Wait<LuisResult>(GetCountryDataAsync);
    }

    public async Task GetCountryDataAsync(IDialogContext context, IAwaitable<LuisResult> luisResult)
    {
        var result = await luisResult;

        CountryManager countryManager = new CountryManager();

        countryManager.GetEntitiesFromLuis(result);

        CountryClearance countryClearance = new CountryClearance();

        SearchClient searchClient = new SearchClient();



        var _authSearchClient = AuthenticationSearchClient.GetAuthenticatedSearchClient();

        //Entity presence 
        if (result.TryFindEntity(CountryEntity.entitypresence.ToString(), out _entitypresence) && result.TryFindEntity(CountryEntity.location.ToString(), out _location))
        {

            await countryManager.EntityPresenceLocation(countryClearance, searchClient, _authSearchClient._serviceClient);

            var resultList = searchClient.GetResultList();

            if (resultList.Count > 0)
            {
                foreach (var item in resultList)
                {
                    StringBuilder message = new StringBuilder();
                    message.Append(countryManager.ReturnMessage(item));
                    await context.PostAsync(message.ToString());
                }

            }
            else
            {
                await context.PostAsync("Query invalid");
            }
            context.Done<Task>(null);
        }
        //Rag status
        else if (result.TryFindEntity(CountryEntity.ragstatus.ToString(), out _ragstatus) && result.TryFindEntity(CountryEntity.location.ToString(), out _location))
        {
            await countryManager.RagStatusLocation(countryClearance, searchClient, _authSearchClient._serviceClient);

            var resultList = searchClient.GetResultList();

            if (resultList.Count > 0)
            {
                StringBuilder message = new StringBuilder();
                foreach (var item in resultList)
                {
                    message.Append(countryManager.ReturnMessage(item));
                    message.Append("  \n");
                }
                await context.PostAsync(message.ToString());
            }
            context.Done<Task>(null);
        }
        //Travel Risks or about location
        else if (result.TryFindEntity(CountryEntity.travelrisks.ToString(), out _travelrisks) && result.TryFindEntity(CountryEntity.location.ToString(), out _location))
        {
            await countryManager.GetTravelRisks(countryClearance, searchClient, _authSearchClient._serviceClient);

            var resultList = searchClient.GetResultList();

            if (resultList.Count > 0)
            {
                foreach (var item in resultList)
                {
                    StringBuilder message = new StringBuilder();
                    message.Append(countryManager.ReturnMessage(item));
                    message.Append("  \n");
                    await context.PostAsync(message.ToString());
                }
            }
            context.Done<Task>(null);
        }
        //Country clearance or risk rating 
        else if (result.TryFindEntity(CountryEntity.clearance.ToString(), out _clearance) && result.TryFindEntity(CountryEntity.location.ToString(), out _location))
        {
            await countryManager.GetClearanceStatus(countryClearance, searchClient, _authSearchClient._serviceClient);
            var resultList = searchClient.GetResultList();

            if (resultList.Count > 0)
            {
                foreach (var item in resultList)
                {
                    StringBuilder message = new StringBuilder();
                    message.Append(countryManager.ReturnClearanceMessage(item));
                    if (string.IsNullOrEmpty(message.ToString()))
                    {
                        await context.PostAsync("No data found!");
                    }
                    await context.PostAsync(message.ToString());
                }
            }
            context.Done<Task>(null);
            //CountryProp = countryManager;
            //context.Call(new CountryClearanceSubDialog(), CountryClearanceAfterAsync);
        }
        //Annexure Sharing
        else if(result.TryFindEntity(CountryEntity.annexuresharing.ToString(), out _annexuresharing))
        {
            var message = context.MakeMessage();
            Attachment attachment = new Attachment();
            attachment.Content = ;

            message.Attachments.Add();
            context.Done<Task>(null);
        }
        else
        {
            await context.PostAsync("Oops! couldn't retrive data.  \nPlease provide your query in correct format.");
            context.Done<Task>(null);
        }

    }

    private async Task CountryClearanceAfterAsync(IDialogContext context, IAwaitable<object> result)
    {

        context.Done(true);
    }

}
```

The image shown next shows the class diagram for the entire Bot implementation

![Class Diagram]({{ site.baseurl }}/images/TechM/classdiagram.png)


Because of large number of objects in class diagram, it is not complete readable. However, the file is available with this document bundle.


Given below is a snapshot of the Bot implementation in Visual Studio team services.

![Solution structure]({{ site.baseurl }}/images/TechM/solutionstructure.png)





## Bot Security

The Bot does not capture or send any PII information. It will be using Web based authentication when using Web channel. If web based authentication is successful, employees will be able to use the Bot. Authentication to HR Bot is taken care by Tech M team.




## Bot Channels

The bot is available over skype and web channels. 





## Conclusion

The purpose of this project was primarily enabling employees to get ready information without any delays and without any human dependency. Thus, Tech Mahindra and Microsoft built a cohesive, fluid and intuitive HR Bot with conversation flow that is easy to follow in English and free text typing, providing context with messages where ever required and limiting the number of interactions before user gets their answers. The bot is available on Web and Skype channels as of now and eventually Skype for Business will also be used as a channel. This has led to increase in adoption, reducing overhead of HR support staff, solving increased number of queries in reduced amount of time, providing 24x7 support instead of limited time windows and eventually increase employee satisfaction and perception toward HR services as whole.

Creating a project with a clear view of the business models and use cases from the outset has enabled all stakeholders to learn exactly what is involved in developing and deploying a Bot solution that can drive business value. The Bot is getting accolades from Tech Mahindra leadership

The HR bot is expected to run across the globe with serving requests to 117,000 employees around the clock.





## Opportunities going forward

* We need to implement this bot with Skype for Business.
* Custom UI for Bot on web channel, advance functionalities like paging, emailing content.





## Customer Quote

"It is really amazing experience to get connected and working with you. I and team learned lots of things from you. Your guidance has helped us in expediting and implementing free flow implementation in HR BOT. Users have shown tremendous satisfaction on usability of BOT developed under your guidance. It is generating lot of requirements across business. BOT itself has a potential of generating business more than 3 MUSD with smaller team developers. "
