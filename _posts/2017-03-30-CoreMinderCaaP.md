---
layout: post
title:  "Extending CRM solution on E-commerce website with Bot Framework and Cognitive Services"
author: "William Dam, Delon Yau"
author-link: "Add URL for author's Twitter account here"
#author-image: "{{ site.baseurl }}/images/authors/photo.jpg"
date:   2017-03-26
categories: [Bot Framework and Cognitive Services]
color: "blue"
#image: "{{site.baseurl}}/images/CoreMinderImages/logo.png" #should be ~350px tall
excerpt: Microsoft work with CoreMinder to extend its CRM Ecommerce platform solution with CaaP
language: English
verticals: Retail, Consumer Products & Services
geolocation: Hong Kong
---
 
**Solution overview:** 
 
 [**CoreMinder Chat management**](http://www.coreminder.com/chat.html) is an add-on solution which integrates Dynamics CRM and social application (e.g. Facebook, WeChat), so that its allow human sale agent able to follow up with customer enquiries. With the rapid growth of their clients’ business, many of their clients' Sale Agents are heavily impacted with repeated questions such as order status and shipping enquires raised from end customers which can up to 5K (social message + Email) enquires per day.  Most of these queries can be automated/handled by Bot service instead. So, we work with CoreMinder together to deliver a solution based on one of their customer (specialized in AirSoft and Wargame equipment) E-commerce test portal, using Microsoft Bot Framework and Cognitive Services to reduce the Agent workload and provide 24x7 instant customer respond so that they can focus more qualify sale lead enquiry

**Key technologies used:**

- [**Bot Framework**](https://dev.botframework.com/), [**QnA Maker**](https://qnamaker.ai/)

- [**Cognitive Services**](https://www.microsoft.com/cognitive-services): [**LUIS**](https://www.microsoft.com/cognitive-services/en-us/language-understanding-intelligent-service-luis)

- Web service: [**Azure Function**](https://azure.microsoft.com/en-us/services/functions/), [**ASP.Net**](https://www.asp.net/)

- [**Dynamic CRM**](https://www.microsoft.com/en-us/dynamics365/home)

- Client: [**WebChat**](https://github.com/Microsoft/BotFramework-WebChat), [**Skype**](https://www.skype.com/en/)

**Core team that was involved with the project:**

- William Dam – Microsoft, Technical Evangelist

- Delon Yau – Microsoft, Technical Evangelist

- John Cheng - CoreMinder, Architect

- Tom Mok - CoreMinder, CTO

Customer profile
---------------- 
 - **Company name:** [**CoreMinder**](http://www.coreminder.com/about.html) 

 - **Company description:** CoreMinder is Microsoft HK gold partner in providing Dynamic CRM and O365 enterprise & e-commerce integrated solutions to small and medium size companies.

 - **Company Location:** Hong Kong


Problem statement:
--------------------

Currently [**CoreMinder Chat Management**](http://www.coreminder.com/chat.html) solution allows retailers' customers to use WebChat to communicate with the individual human sale agent. The CRM system at the back-end will capture all these conversation, and therefore the cases can be followed up closely. This also allows retailers to provide close customers relationship and impacts of losing customers due to sales turnover are also reduced.  But with the growth of the their client business and amount of customer enquires also signaficant increase.  Existing resource/human agent would not able to respond all these enquries with fast turn around time anymore unless adding more resources.


Solution and Steps:
-------------------------------

We discussed with Coreminder technical team and proposed that we can build a Chat Bot service to handle majority of the customer queries and able to provide instant respond retrieved from their back end CRM as a human sale agent to reduce impact to their workload.  The architecture will start with the Bot Framework as our building block as it's tightly integrated with Microsoft Cognitive Services. And we can also leverage QnA Maker for most common FAQ handling.

![Here's the architecture diagram]({{site.baseurl}}/images/CoreMinderImages/HighLevelArchDigitalFormat.JPG)

The [**CoreMinder Chat Management**](http://www.coreminder.com/chat.html) provide Sale Agent a web user interface to monitor and follow up customer enquires thru an CRM Web Gateway connecting to a backend Dynamic CRM, both running on premises. (Refer to Existing 1 & 2 above diagram)

To preserve their existing close customer engagement experience, the chat bot will use LUIS for natural language experience. And we'll also use QnA Maker for most common FAQ handling.  For this solution, we'll focus on the Webchat and can be extended to other Social Channels e.g. Facebook Messenger etc. which offer from the Bot Framework.  When user like to raise a query, they can use the Bot embedded in the E-Commerce site instead of email now, and here're the flow:

 - Step 0: We can identify the user if they've logon to the E-commerce portal.  

 - Step 1 & 2: We'll get into whether the query should handle by CRM or FAQ Bot later. For now, assuming the query is handled by the CRM Bot
 
 - Step 3: LUIS will able to detect the query intent and route to the appropriate CRM Azure Functions which can be a simple order status query or create a new support case to CRM.
 
 - Step 4: We will need to migrate their existing CRM Web API that using Dynamic CRM's low-level interaction and wrapper methods running on premises that handle the CRM communication for the Bot/CRM connection to Azure Function.
 
 - Step 5: If the case is CRM Bot creating a new support case from end user, the Sale Agent will then handle the new case as is existing.


Technical Delivery
-------------------------------

**Prerequisite**

- [**Visual Studio 2015 update 1**](https://www.visualstudio.com/en-us/news/releasenotes/vs2015-update1-vs) at least & [**Bot Framework plugin**](https://www.nuget.org/packages/Microsoft.Bot.Builder/3.5.8), more info [**here**](http://www.c-sharpcorner.com/article/creating-a-simple-bot-application-using-microsoft-bot-framew/)
- [**LUIS Key**](https://docs.microsoft.com/en-us/azure/cognitive-services/LUIS/azureibizasubscription) & [**Spell Check subscription key **](https://docs.microsoft.com/en-us/azure/cognitive-services/LUIS/manage-keys#create-and-use-external-keyshttps://docs.microsoft.com/en-us/azure/cognitive-services/LUIS/manage-keys#create-and-use-external-keys) from Azure portal
- Download the [**Bot Framework Emulator**](https://github.com/Microsoft/BotFramework-Emulator)
- Search and Find those [**CRM nuget packages**](https://www.nuget.org/packages/Microsoft.CrmSdk.CoreAssemblies/) you need

**LUIS - Dialog design**

We start with defining the LUIS intents and breaking into 3 categories:
 1. Retrieve data from CRM (e.g. order status check)
 2. Create a new case in CRM (e.g. reporting issue, like shipping problem)
 3. Handling most common FAQ using QnA Maker

And we 1st discover few of the FAQ have some overlapped of the LUIS intent e.g. order status enquiry.  To avoid the confusion to LUIS, we decide to separate the FAQ from the LUIS bot and embedded in an existing FAQ page instead.

Here's the instruction to [**create an LUIS model**](https://docs.botframework.com/en-us/node/builder/guides/understanding-natural-language/) for reference.  For this case we create 2 intents, namely "OrderEnquiry" and "ReportShiipiongProblem" to illustrate the above case 1 & 2.

![Here's the simple LUIS screen shot]({{site.baseurl}}/images/CoreMinderImages/LUIS.JPG)

![The "OrderEnquiry" intent take one entity which is the OrderID and here's screen shot of the sample utterance]({{site.baseurl}}/images/CoreMinderImages/LUIS-OrderEnquiry.JPG)

![The "ShippingProblemReport" take no entity and here's the screen shot of the smaple utternace]({{site.baseurl}}/images/CoreMinderImages/LUIS-ReportShippingProblem.JPG)

You may keep fine tunning the LUIS with more utterance and test it.  Once its ready, you can publish it and you will require LUIS subscription key from the Azure portal. It is also best practice to use the [**Bing Spell Check API**](https://www.microsoft.com/cognitive-services/en-us/bing-spell-check-api) together with LUIS to improve the input recognition when there's typo etc.

![Screen shot of the LUIS publish with spell check option enable]({{site.baseurl}}/images/CoreMinderImages/InkedLUIS-Publish_LI.jpg)

![Screen shot of spell check that improve LUIS recognition with user typo example]({{site.baseurl}}/images/CoreMinderImages/LUIS+SpellCheck.JPG)

As you can see the typo, "shpping problm" from input are recognized as "shipping problem" before submitting to LUIS, so that LUIS can identify the intent as "ReportShippingProblems" correctly.

**Bot Implementation**

We can now start the Bot implementation using Visual Studio to create a new bot template project  

Step 1: Creating a new Bot Project from Visual Studio

You may find more detail of how to get start with bot implementation [**here**](https://docs.botframework.com/en-us/csharp/builder/sdkreference/)

After creating the project you will get some files in solution explorer and lets open the "Web.config" File, and give the AppId and AppSecret keys for your project. If you are running this project locally, then you can give any AppId and AppSecret.   But if you host your bot as web service later on, then you have to register your bot [**here**](https://dev.botframework.com/bots/new). And after registration you will get your bot AppID and AppSecret.

![Sample screen shot of the Web.config File]({{site.baseurl}}/images/CoreMinderImages/BotWebConfig.JPG)

Step 2: Obtaining User ID for Bot conversation from Web logon using ASHX file handler

Since it’s an ecommerce site, instead of using the Sign-In card inside the bot, we will leverage the E-commerce web portal (SSL protected) member login procedure than extract the user name from email logon as an identifier (User ID) for Bot/CRM communication. And store it into the Bot's user data store along the conversation.  In production, we'll need to ensure it'll successfully sign on before assigning the User Email as the userId.

To capture the email id, you need to put these following logon script in the default.htm file 

```
<table>
        <tr>
            <td><label id="From" />Please Enter your Email : </td>
            <td><input id="TxtFrom"></td>
        </tr>
        <tr>
            <td><label id="To" />Please Enter Your Password</td>
            <td><input type="password" id="TxtTo" required="required"></td>
        </tr>
        <tr>
            <td />
            <td style="align-content:flex-end">
                <button onclick="loadJsonData();">Login</button>
            </td>
        </tr>
    </table>
```

Then extract the user Email and ID from web handler by adding an ASHX file, MailHandler.ashx in the project.  The MailHandler class can process the web user logon input via the IHttpHandler interface and here's the sample code
``` 
   class Mail
    {
        public string From { get; set; }
        public string To { get; set; }
      

    }

    public class MailHandler : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            string jsonString = String.Empty;
            HttpContext.Current.Request.InputStream.Position = 0;
            using (System.IO.StreamReader inputStream =
            new System.IO.StreamReader(HttpContext.Current.Request.InputStream))
            {
                jsonString = inputStream.ReadToEnd();
                System.Web.Script.Serialization.JavaScriptSerializer jSerialize =
                    new System.Web.Script.Serialization.JavaScriptSerializer();
                var email = jSerialize.Deserialize<Mail>(jsonString);

                if (email != null)
                {
                    //These are the user info we need
                    string from = email.From;
                    MessagesController.UserEmail = email.From;
                    string to = email.To;
                    MessagesController.password = email.To;
                }
            }
            
        }
```

![Here's the website sign on page illustration screen shot]({{site.baseurl}}/images/CoreMinderImages/useLogOn.JPG)

Step 3: Start the Bot logic from the MessagesController.cs

We can now modify the MessagesControllers.cs with 1st extract the user Email when logon as its ID then invoke a LUIS dialog to handle the customer dialog logic. We will save the ID in [**User Data Store**](https://docs.botframework.com/en-us/core-concepts/userdata/) and use the [**Bot State Service**](https://docs.botframework.com/en-us/csharp/builder/sdkreference/stateapi.html) to track the conversation by adding the following code

This is the sample code storing the user data in bot state with user email as the user identifier.
```
public async Task<HttpResponseMessage> Post([FromBody]Activity activity)
        {
            //initialize the user data store
            stateClient = activity.GetStateClient();

            userData = await stateClient.BotState.GetUserDataAsync(activity.ChannelId, activity.From.Id);
            userData.SetProperty("userId", UserEmail);
            userData.SetProperty("userChannel", activity.ChannelId);
            userData.SetProperty("userMessage", activity.Text);
            
            await stateClient.BotState.SetUserDataAsync(activity.ChannelId, activity.From.Id, userData);    
...............
```

![This is the screen shot of the Bot Emulator that shown the user ID been capture from web logon]({{site.baseurl}}/images/CoreMinderImages/botIdentifyUserFromWebLogOn.JPG)

Once the user state been created, we can now start the Luis dialog, CustomerDialog by adding this line in MessageController.cs inside the ActivityTypes.Message
```
if (activity.Type == ActivityTypes.Message)
            {
                await Microsoft.Bot.Builder.Dialogs.Conversation.SendAsync(activity, () => new CustomerDialog());
            }
```

Step 4: Handling the Conversation logic with LUIS intent

Now create a new file called CustomerDialog.cs in the project to handle the conversation logic.  This dialog contain the logic to handle the LUIS intents defined above.  And you may override the StartAsync method to greet the user and in this case, it will call out the User ID from web logon with welcome message when the 1st dialog initiated from user.  And we'll show the rest of the intents implementaion below.
```
public class CustomerDialog : LuisDialog<object>
    {

        public string UserEmail { get; private set; }

        //override the StartAsync and make this to the root of the dialog
        public override async Task StartAsync(IDialogContext context)
        {
            var welcomeMessage = context.MakeMessage();
            welcomeMessage.Text = "Hello " + context.UserData.Get<string>("userName") + " How may I help you....";
            await context.PostAsync(welcomeMessage);
            context.Wait(this.MessageReceived);
        }

        [LuisIntent("OrderEnquiry")]
        //public async Task OrderEnquiry(IDialogContext context, IAwaitable<IMessageActivity> activity, LuisResult result)
        public async Task OrderEnquiry(IDialogContext context, LuisResult result)
        {
            ..............
        }

        //***** Report Shipping Problem ********
        [LuisIntent("ReportShippingProblems")]
        public async Task ReportShippingProblems(IDialogContext context, LuisResult result)
        {
            .............
     
        }

        [LuisIntent("Help")]
        public async Task Help(IDialogContext context, LuisResult result)
        {
            ............
        }

        [LuisIntent("None")]

        public async Task NoneHandler(IDialogContext context, LuisResult result)
        {
            .............
        }

    }
}
```

We can now implement the "OrderEnquiry" intent logic in the CustomerDialog.cs.  We will need to create an async task metnod, orderEnquiry associated with LUIS intent "OderEnquiry".  The 1st thing we check is if the user has provided the orderID from the entity. If not, we prompt for user to input.
```
 [LuisIntent("OrderEnquiry")]
        //public async Task OrderEnquiry(IDialogContext context, IAwaitable<IMessageActivity> activity, LuisResult result)
        public async Task OrderEnquiry(IDialogContext context, LuisResult result)
        {
            //Prompt for missing order number  
            while (result.Entities.Count < 1) {
                new PromptDialog.PromptString("What is the order number?", "Please enter the order number", attempts: 3);
            }
            Debug.WriteLine("Order Number: " + result.Entities[0].Entity);
            await context.PostAsync($"Please wait a moment, we are searching your order '{result.Entities[0].Entity}'");
            Debug.WriteLine("checking CRM.......");
```

Once we have the OrderID, we can now call the Azure Function to retrieve the Order ID and parse the JSON response when it's returned and display the result using [**HeroCard**](https://docs.botframework.com/en-us/csharp/builder/sdkreference/attachments.html) with one big static image for illustration only.  And for now, lets ignore the Azure Function call detail which will explain in step 5 later.
```
            //
            //replacing the existing CRM web api to AzFn call...........
            string baseUrl = "https://coremindercrmazfn.azurewebsites.net/api/getOrderStatus?code=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx==";
            string prodid = result.Entities[0].Entity;
            var request = (HttpWebRequest)WebRequest.Create(baseUrl);
            request.ContentType = "application/json";
            request.Method = "POST";
            using (var streamWriter = new StreamWriter(request.GetRequestStream()))
            {
                string json = new JavaScriptSerializer().Serialize(new
                {
                    orderID = prodid
                });
                streamWriter.Write(json);
                streamWriter.Flush();
                streamWriter.Close();
            }
            var response = (HttpWebResponse)request.GetResponse();
            var responseString = new StreamReader(response.GetResponseStream()).ReadToEnd();

            // TODO: Parse the responseString to json object
            RootObject r = JsonConvert.DeserializeObject<RootObject>(responseString);
            Debug.WriteLine("return from CRM......");
            if (r.salesorders.Count != 0)
            {
                var replyToConversation = context.MakeMessage();
                List<CardImage> cardImages = new List<CardImage>();
                //the products associated with the order number return from CRM........
                cardImages.Add(new CardImage(url: "https://rfpicdemo.blob.core.windows.net/rfdemo/AS-APRON-1L.jpg"));
                if (r.salesorders[0].new_shippingstatus.ToString() == "Pending")
                {
                    HeroCard replyCard = new HeroCard()
                    {
                        Title = "Order Status",
                        Images = cardImages,
                        Subtitle = "Status of your order " + result.Entities[0].Entity + " is " + r.salesorders[0].new_shippingstatus.ToString(),
                        Text = "Your order will be shipped soon. Notification email will be sent to you once shipped."
                    };
                    replyToConversation.Attachments.Add(replyCard.ToAttachment());
                }
                else
                {
                    HeroCard replyCard = new HeroCard()
                    {
                        Title = "Order Status",
                        Images = cardImages,
                        Subtitle = $"Status of your order {result.Entities[0].Entity} is {r.salesorders[0].new_shippingstatus.ToString()}.",
                        Text = "Your order is shipped. Please check your email."
                    };
                    replyToConversation.Attachments.Add(replyCard.ToAttachment());
                }
                await context.PostAsync(replyToConversation);
            }
```

We also need to create another async task method that associate with the LUIS "ReportShippingProblems" intent. Since the report shipping problem take no entity but require user to input the problem description, we will need to create a call back function from the intent logic, "ResumeAfterPrompt".  This call back function will prompt and wait for the user input before write to CRM to create a new case for shippng problem.  This is the sample code
```
private async Task ResumeAfterPrompt(IDialogContext context, IAwaitable<string> result)
        {
            var parameter = await result;
            string problemDescription = parameter;
            string userID = context.UserData.Get<string>("userId");
   
            await context.PostAsync("creating case in CRM with description: " + problemDescription);
            Debug.WriteLine("Recording to CRM.......");

            //Fill the CRM logic here instead
            string baseUrl = "https://coremindercrmazfn.azurewebsites.net/api/caseSubmit?code=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx==";
            var request = (HttpWebRequest)WebRequest.Create(baseUrl);
            //change to json format
            request.ContentType = "application/json";
            request.Method = "POST";
            using (var streamWriter = new StreamWriter(request.GetRequestStream()))
            {
                string json = new JavaScriptSerializer().Serialize(new
                {
                    userID = userID,
                    userDescription = problemDescription
                });
                //now should clear the problemDescription for next use
                newProblemDescription = null;
                streamWriter.Write(json);
                streamWriter.Flush();
                streamWriter.Close();
            }
            var response = (HttpWebResponse)request.GetResponse();
            var responseString = new StreamReader(response.GetResponseStream()).ReadToEnd();
            if (response.StatusCode == HttpStatusCode.OK)
            {
                await context.PostAsync("Case Submitted, our Agent will contact you shortly");
            }
            else
            {
                await context.PostAsync("Case Submitted failed, Invalid user profile or info, please submit again");
            }
        }

        [LuisIntent("ReportShippingProblems")]
        public async Task ReportShippingProblems(IDialogContext context, LuisResult result)
        {

            //get the user description
            if (result.Entities.Count == 0)
            {
                var dialog = new PromptDialog.PromptString("Please provide your description: ", "please try again", 2);
                context.Call(dialog, ResumeAfterPrompt);
            }
            else
            {
                context.Wait(MessageReceived);
            }
     
        }

```
As mentioned, the shipping problem LUIS has no entity defined and we just need to prompt the user to provide the problem description to open the case in CRM.  We've some challenge to get this prompt dialog work inside LUIS, as most often we got compliant on the IAwaitable<string> null reference in runtime if not handling properly.  In addition, the line context.call(dialog, ResumeAfterPrompt) would not wait for user input and will continue to run the code, so we move the CRM logic inside the ResumeAfterPrompt.  In general, we like to have better api support in [**taking simple user input**](https://github.com/Microsoft/BotBuilder/issues/428)

Step 5: Creating Azure Functions to handle the CRM communication with the bot

For the CRM connection, we use Azure Function with Dynamic CRM's low-level interaction and wrapper methods instead as its can work with both Dynamic 365 on premises and on-line.  You may create the Azure Function using the Azure portal and instruction [**here**](https://azure.microsoft.com/en-us/resources/videos/create-your-first-azure-function/).  

We will use C# HTTP trigger Azure Fucntion to implement the logic.  1st we need migrating CoreMider XRM SDK code by replacing the nuget packages and with some code modification.  It takes quite an effort to figure out all the correct nuget package dependencies and specific version to get its compiled. During the hack, there're few times that we experience Azure Function are cached no matter what changes putting in but will resume normal sometime after?  This is another reason it takes us longer time to debug/change.

One recommendation to CRM developer if working on Azure Function, you might find adding this [**TraceListener**](http://crmtipoftheday.com/2017/01/05/tracing-with-xrm-tooling-in-azure-functions/) helpful as we use to capture XRM connector logs on Azure Function to help troubleshooting.

Finally, these are the correct nuget package & version that make our code work for your reference and you need it to save in the "project.json" file created under the same directory of your Azure Function.

```
"frameworks": {
   "net46":{
     "dependencies": {  
        "Microsoft.CrmSdk.CoreAssemblies": "8.2.0.2",
        "Microsoft.CrmSdk.Extensions" : "7.1.0.1",
        "Microsoft.CrmSdk.XrmTooling.CoreAssembly": "8.2.0.2",
        "Microsoft.CrmSdk.Deployment" : "8.2.0.2",
     }
   }
```

This is the HTTP Trigger Azure Function that use the [**XRM Tool Connector**](https://msdn.microsoft.com/en-us/library/jj602917.aspx#XrmTooling) to connect to Dynamic CRM (on-premises) to retrieve the order status.  And you might have notice I've a line of code to get rid of the SSL trust connection issue right before the CRM connection. This is to allow bypassing the Azure Function policy to make and SSL connection to a self signed cert that being used in this CRM test environment setup.  For production, once you change to the real certificate, you won't need that.

```
public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, TraceWriter log)
{
    log.Info("C# HTTP trigger function processed a request.");

    TraceControlSettings.TraceLevel = SourceLevels.All;
    TraceControlSettings.AddTraceListener(new Toolinglistener("Microsoft.Xrm.Tooling.Connector", log));

    // parse query parameter
    string orderID = req.GetQueryNameValuePairs()
        .FirstOrDefault(q => string.Compare(q.Key, "orderID", true) == 0)
        .Value;

    // Get request body
    dynamic data = await req.Content.ReadAsAsync<object>();

    // Set name to query string or body data
    orderID = orderID ?? data?.orderID;
    string orderStatus = "no order status";

    //temporary get rid of the SSL trust connection issue due to this CRM using self signed cert....
    System.Net.ServicePointManager.ServerCertificateValidationCallback += (sender, certificate, chain, sslPolicyErrors) => true;

    //CoreMinder Dynamic CRM On-premises with provided user credentials
    string connectionString = System.Environment.GetEnvironmentVariable("CoreMinderCRMConnectionString");
    Dictionary<string, object> result = new Dictionary<string, object>();
    string json = "";
    CrmServiceClient crmSvc = new CrmServiceClient(connectionString);
    log.Info("crmSvc : " + crmSvc );

    // Cast the proxy client to the IOrganizationService interface.
    IOrganizationService _orgService = (IOrganizationService)crmSvc.OrganizationWebProxyClient != null ? (IOrganizationService)crmSvc.OrganizationWebProxyClient : (IOrganizationService)crmSvc.OrganizationServiceProxy;
    log.Info("_orgService : " + _orgService );

    if (crmSvc != null & orderID != null & _orgService != null) {
        log.Info("CRM connected.....");
        //get the oder status..........
        .....
        .....
    return orderID == null
        ? req.CreateResponse(HttpStatusCode.BadRequest, "Please pass an orderID in the request body")
        : req.CreateResponse(HttpStatusCode.OK, orderStatus);
}
```

One suggestion we've is perhaps the Azure Function can have a friendly user interface to download the nuget package as currently the way to find the nuget package and add to the project.json file is too manual. In addition, if there's Dynamic CRM built-in connector on Azure function equivalent with [**CrmServiceClient**](https://msdn.microsoft.com/en-us/library/dn688177.aspx)_would will make it much easier.

![Screen shot of the Bot in getting the order status successfully from CRM ] ({{site.baseurl}}/images/CoreMinderImages/orderNumberChecking.JPG}})

The same logic will be applied for other similar LUIS intent to read from Dynamic CRM and below is the Azure Function sample code that write to the Dynamic CRM by taking the ReportShippingProblems LUIS intent example

This is the Azure Function to create a new case in Dynamic CRM
```
public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, TraceWriter log)
{
    log.Info("C# HTTP trigger function processed a request.");

    TraceControlSettings.TraceLevel = SourceLevels.All;
    TraceControlSettings.AddTraceListener(new Toolinglistener("Microsoft.Xrm.Tooling.Connector", log));

    // parse query parameter
    string queryParameter = req.GetQueryNameValuePairs()
        .FirstOrDefault(q => string.Compare(q.Key, "userID", true) == 0)
        .Value;

    // Get request body
    dynamic data = await req.Content.ReadAsAsync<object>();

    // Set name to query string or body data
    queryParameter  = queryParameter  ?? data?.queryParameter ;

    //temporary get rid of the SSL trust connection issue as this CRM using self signed cert....
    System.Net.ServicePointManager.ServerCertificateValidationCallback += (sender, certificate, chain, sslPolicyErrors) => true;
    
    //Fill the crm logic
    string userID = data.userID;
    string userDescription = data.userDescription;
    bool caseCreated = false;

    //CoreMinder Dynamic CRM On-premises with provided user credentials
    string connectionString = System.Environment.GetEnvironmentVariable("CoreMinderCRMConnectionString");
    Dictionary<string, object> result = new Dictionary<string, object>();

    CrmServiceClient crmSvc = new CrmServiceClient(connectionString);
    log.Info("crmSvc: " + crmSvc );

    // Cast the proxy client to the IOrganizationService interface.
    IOrganizationService _orgService = (IOrganizationService)crmSvc.OrganizationWebProxyClient != null ? (IOrganizationService)crmSvc.OrganizationWebProxyClient : (IOrganizationService)crmSvc.OrganizationServiceProxy;
    log.Info("_orgService: " + _orgService );

    log.Info("log: " + userID + userDescription);
    if (crmSvc != null & userID != null & userDescription != null & _orgService != null) {
        log.Info("CRM connected.....submitting case");
        //submitting case..........
        ......
        ......
    return caseCreated == false
        ? req.CreateResponse(HttpStatusCode.BadRequest, "Case submitted Fail - Invalid Info")
        : req.CreateResponse(HttpStatusCode.OK, "Case submitted successfully - " + userDescription);
}
```

![Screen shot of the Bot creating a new case to CRM ] ({{site.baseurl}}/images/CoreMinderImages/shippingProblemCaseRaise.JPG}})

Since CoreMinder CRM backend is capable to assign the Human Agent to follow up the new case created, we're not implementing the bot handover the Bot Framework don't have any official api but we found some [**sample code**](https://github.com/tompaana/intermediator-bot-sample) from GitHub, a bit raw but good for reference.  Ideally, we like the framework can official support it.

**FAQ Handling**

As mentioned due to overlapping of this client sample website FAQ and LUIS intent e.g. get order status.  We decide to separate the FAQ that use QnA Maker from the LUIS Bot and renew the FAQ tab with QnA Maker bot embedded.  

Using the QnA Maker is straight forward as you just need to import the Q&A pair with the following steps

1. FAQ input: can be URL or document in these format (.tsv, .pdf, .doc, .docx), into the [**QnA Maker portal - Create Service tab**](https://qnamaker.ai/Create), then click the create button at the bottom. Its will automatically generate the knowledge base for you to review it.

![Screen shot of FAQ page with QnA Maker ] ({{site.baseurl}}/images/CoreMinderImages/QnA_QnA_Azure.JPG}})

2. Review the Q&A pair and Test it

![Screen shot of test FAQ page with QnA Maker ] ({{site.baseurl}}/images/CoreMinderImages/QnA_Azure_TestEnv.JPG}})

3. Save and Retrain, if there's any additonal alternative pharse to the questions added during testing

4. Publish it and consume

![Screen shot of E-commerce test portal that consume the QnA Maker publish url ] ({{site.baseurl}}/images/CoreMinderImages/QnA_Portal.JPG}})



Conclusion
----------

This combined effort from Microsoft and CoreMinder has proven on how Microsoft Bot Framework, Cognitive Services and Azure Function can create an intelligent Bot service with human like conversational experience that can help sale agent to minimize thier time responding to most common customer enquires.

We've also invited CoreMinder to participate the MSX event with the early prototype and has attracted 12% of sale lead which rank at the 3rd among other solution show case.

![MSXEvent survey]({{site.baseurl}}/images/CoreMinderImages/MSXEvent.jpg)

CoreMinder is willing to commit to work with us to explore further Machine Learning capability and prepare to move their existing customer portal revamp and moving to hybrid cloud model instead on purely on premises deployment.

![CoreMinder team]({{site.baseurl}}/images/CoreMinderImages/team.JPG)

Here is a quote from Tom Mok, CoreMinder CTO:

“Our partnership with Microsoft on this CoreMinder CRM BOT project has bring us close relationship to work as partner. This new architecture significantly add intelligent to the CRM solution, while without significant architecture changes to our CRM platform. It brings performance and cost benefits to our client sale support and will definitively leverage more the Cognitive Service and Machine Learning capabilities in our upcoming client projects. This is what the market needs: solutions that add value while at the same time reducing the complexity of the integration to us platform would let us more focusing to deliver more customer value and feature delivery.”
