---
layout: post
title:  "How TechnologyOne built a bot translation system to help international students talk to universities"
author: "Jordan Knight"
author-link: "https://twitter.com/jakkaj"
#author-image: "{{ site.baseurl }}/images/authors/photo.jpg"
date: 2017-06-13
categories: [Bot Framework, Cognitive Services]
color: "blue"
image: "images/2017-04-20-TechnologyOne/UniBot.PNG"
excerpt: TechnologyOne teamed up with Microsoft to create a universal language bot to make university enrollment and daily university life easier for international students.  
language: [English]
verticals: [Education, Hospitality & Travel]
geolocation: [Oceania]
---

In this article we talk through how TechnologyOne and Microsoft collaborated to build a university bot that allows people to converse in their native language by using terminology they are comfortable with to help make enrollment and university life better. The bot achieves this by using modern conversational platforms coupled with intelligent systems. 

Every year, thousands of potential international university students reach out and engage with universities all over the world to try and find the course of study that is right for them. The problem they face is that it can be difficult to find clear and concise information about the courses the universities offer without having to rely on a third-party agency. They struggle with language barriers as well as nomenclature differences. It can be difficult for them to navigate the often very detailed course catalogs that universities offer, and it can be hard for them to know how to begin the enrollment process. 

New students of non-English speaking backgrounds starting at a university might also struggle with finding their way around the university facilities or finding information about their new courses.

To help combat this, TechnologyOne with help from Microsoft has built a new university bot, dubbed UniBot. UniBot integrates with the TechnologyOne Student Management system. TechnologyOne Student Management features a self-service portal for students to manage their courses and subjects, class timetable, and the like. It also enables students to make payments to the university.  

UniBot is a user interface enhancement to this portal, providing students with an alternative to clicking through a web page.  Furthermore, UniBot leverages the Microsoft Translator API to deliver chat functionality in over 60 languages, with no changes to the Student Management software.

Prospective students can do the following:

- Enquire about courses (shows schools and courses allowing drill down)
- Ask if there are courses specific to a discipline
- Begin the enrollment process (which kicks off an enrollment wizard)

Already enrolled students can ask questions such as:

- Can I make it to the library after my last lesson today?
- Where is my next lesson?
- Do I have lessons this Thursday morning?
- When is the aquatic center open?
- What is the final date for withdrawing from a class?
- When is the library open?

UniBot can help students find the information they need including timetables, fees, results, sanctions, and more. 

### Translation capability

The main technology focus for this article is UniBot's translation capability. This article is an end-to-end guide on how to integrate language translation to new and existing bots with minimal fuss. 

A core tenet for the translation system was that it must put the developer experience first. This means that it must be easy to integrate and work with and not require heavy and "smelly" modification of code to implement. To this end, after the translation system is installed, developers can write the bot code as usual in their primary language (in this case English). The bot system will then do the heavy lifting so that the developer can get on with the job of making an awesome bot. 

### Video demonstration

This in-depth video demonstration runs through some of the main features of UniBot. It shows contextually-aware questions, typical questions and answers (using QnA Maker), as well as language translation. To view the video, click the image (length: 58 seconds).

[![TechnologyOne University Quick Plug](https://img.youtube.com/vi/FMU4Tnr_QFs/0.jpg)](https://www.youtube.com/watch?v=FMU4Tnr_QFs)

<br/>

### Key technologies

- [ASP.NET](https://www.asp.net/)
- [Bot Builder NuGet package](https://www.nuget.org/packages/Microsoft.Bot.Builder/)
- [Bot Builder SDK for .NET](https://docs.botframework.com/en-us/csharp/builder/sdkreference/) 
- [Cognitive Services Translator Speech API](https://www.microsoft.com/cognitive-services/en-us/translator-api)
- [Language Understanding Intelligent Service (LUIS)](https://www.luis.ai/)
- [Microsoft Translator API](https://docs.microsoft.com/en-us/azure/cognitive-services/Translator/translator-info-overview)
- [QnA Maker](https://qnamaker.ai/)
- [Simple Bot Translator NuGet package](https://www.nuget.org/packages/SimpleBotTranslator/)
- [TechnologyOne Student Management System](https://www.technologyonecorp.com/education)

### Core team

- [Jordan Knight](https://twitter.com/jakkaj) – Senior Technical Evangelist, Microsoft
- Scott Smith – Senior Partner Business Evangelist, Microsoft
- Matthew Deshon – Research and Development Evangelist, TechnologyOne
- Brad Ackerman – Research and Development Director, TechnologyOne
- Declan Vong – Developer Intern, TechnologyOne
- Joshua O'Brien – Developer, TechnologyOne

## Customer profile

[TechnologyOne](https://www.technologyonecorp.com/home), one of Australia's largest publicly listed software companies (listed 1999), is based in Fortitude Valley, Brisbane. 

TechnologyOne is an independent software vendor who creates a range of enterprise management software packages for a number of verticals including local government, financial services, health, education, and corporate. They have a large in-house development team that is continuously building and improving their products. They have specialized products for education, which is where this bot will be integrated initially. 

Matthew Deshon, R&D Evangelist at TechnologyOne, had the opportunity to present the bot at the [Global Education Partner Summit 2017](https://www.youtube.com/watch?v=JUf2QNiFpSw) held in Seattle: 

> "GEPS was a great opportunity for us to showcase UniBot to an international audience. I presented the Asia-Pacific keynote, running through a demonstration of UniBot and its integration to TechnologyOne Student Management. Our second scenario was definitely the highlight, where we assumed the persona of a German-speaking student applying for a course. The Translator API was the 'killer app' for this demonstration: UniBot conducted the chat in German, and translated all of the back-end queries and responses from German to English and back again."

> "The Translator API turns the English-only chat bot into an enabler for stakeholders who do not speak English, allowing them to participate in online communities that were previously closed to them. This will be a game-changer for all of our customers, not just those in the Higher Education vertical."

## Problem statement

The aim of this project is to make university content and information more accessible to everyone, with a particular focus on students for whom English is not their first language—something that intelligent conversational systems can really help with. 

Students researching courses or looking to enroll may find it difficult to find the information they are looking for because of language and nomenclature problems. An entire industry is built around helping international students find and enroll in courses; it can become an expensive exercise. 

Difficulties navigating university content may continue after new students begin their studies. Campuses are large and have many facilities and programs, making it a daunting experience for any student, especially international students who have the added language barrier to deal with. 

The typical Enterprise Content Management System (ECMS) contains an absolute wealth of useful data. The trouble is that it may not always be easily available to users for a number of reasons, including language barriers, lack of domain knowledge, and nomenclature. 

To fix this, systems might: 

- Be manually curated, which is time-consuming, expensive, and limited in scope by resource availability.

- Force the user to assume some responsibility for domain knowledge, become aware of *how* to search and navigate the system for the data locked away therein. 

This is compounded when users are not using the same native language as the university system, for example, a Chinese student working with a university system written in English. 

Even with best efforts, only a small portion of content may really be made available across the spectrum of languages and cultures.

## Solution and steps

For the packages and services used by the solution, see [Key technologies](#key-technologies). 

During our initial investigations, we set out to define the main areas of functionality for the bot. We quickly discovered that the bot could operate in a range of different *modes* such as basic query, prospective student, and student/teacher. 

Discovery also quickly revealed that this system was going to need some *smart systems* in place to make the content truly accessible.

### Bot modes

The bot can be used by a range of users; however, most user types can be grouped into just a few main areas of functionality: 

- **Basic query**. This is an unauthenticated mode that allows any user of the system to ask basic, non-contextual questions of the bot such as "When is the library open today?" and "Where is the aquatic center?" 

- **Prospective student**. Students can walk through the university course offerings by using natural language queries in their own native language. When they are ready to start an enrollment application, the system will begin a chat-based wizard.

- **Student/teacher**. The bot will allow enrolled students and teachers to sign in and gain contextual information. They can ask when their next lesson is or even perhaps ask for a map to the location of the room (especially handy for new students!).

### Smart systems

- **Intelligence to the rescue**. Intelligent systems are able to make content more available without having to do a lot of extra manual work because of the way they act as an intermediary layer between the free flowing intellect of a human and the hard binary data of a traditional computer system. Their inherent intelligent nature enables them to work easily with both non-intelligent systems as well as other intelligent services to create a great mix of information and user experience. 

    <img alt="System Overview" src="{{ site.baseurl }}/images/2017-04-20-TechnologyOne/overview.png" width="720"></img>

    <br/>

- **High level flow**. The basic user flow of the app is shown in the following code (the `"Services"` are the intelligent systems including LUIS and the Microsoft Translator API/Bing Translator):

     ```
        User Client (e.g. Skype) -> Bot Connector -> Web API -> "Services" -> ECM system
     ```

- **Translation**. If the system has detected that a user is speaking a language other than English, the translation system will engage. 

    The deep neural net AI-based systems are able to automatically translate all content in and out in as many as 60 different languages thanks to the Cognitive Services Translator Speech API. This means that the user can converse in their native language and the system will translate in and out for them automatically. The added benefit is that all CMS-managed content sits in a single language while at rest; it does not need to be translated up front to become available via search systems and the like. This keeps the system simple and elegant and always current. 

    Imagine a foreign student experiencing their first day at a large university and being able to query information about the university grounds, where things are, and where their next class is—all via a bot that sits in their pocket by using the language they were born into. It will make their first impressions of the university that much more pleasant.  

- **Language understanding**. A user's chat message will enter the system and be translated from their native language back into English. 

    After the language has been translated, it still needs to be understood by the bot system. That's where the Language Understanding Intelligent Service (LUIS) steps in. It's a natural language intent processing system that is based on Machine Learning, which is able to take what the user is asking in their own particular flavor of language and figure out what their intention is. This means that while there may be many variations in the way a question can be asked (even after translation back to the core system language), LUIS is able to figure out what they want. Over time the system improves as more and more questions are asked of it. This removes problems around nomenclature and the vast array of differing languages and cultures that the users may be coming from. 

    These two systems (the Translator Speech API and LUIS) together go a long way to making the large volume of content in the Enterprise Content Management (ECM) system available to users the world over via the conversational bot platform. 

    As mentioned earlier, this document focuses on the translation aspect of the project. 

    For a detailed introduction to LUIS, see the [LUIS Overview](https://docs.microsoft.com/en-us/azure/cognitive-services/LUIS/Home) document. For information about how to make the most out of the LUIS AI/Machine Learning aspects, see this document about [active learning](https://docs.microsoft.com/en-us/azure/cognitive-services/LUIS/label-suggested-utterances). 


### Translation system flow

By default, when a new user starts talking to the bot, the translation system is inactive. New conversations are assumed to be in English. The user's chat language is not checked until there is a reason to suspect that the user may not be speaking English.

Following are the steps in the translation system flow:

1. The system calls out to LUIS with the user's chat. 
2. If LUIS doesn't return any results, it goes off to the [QnA Maker](https://qnamaker.ai/Documentation) to check for any question and answer results. 
3. If that fails, the translation service (`TranslatorService`) engages. 
4. The translation system [checks](https://github.com/MSFTAuDX/BotTranslator/blob/master/BotTranslator/Services/CognitiveServicesTranslator.cs#L73) the user's chat language by using the translation service. 
5. If the detected language is not English, it asks the user (in the detected language) if they would like the bot to translate for them by using a `PromptDialog` ([sample](https://github.com/MSFTAuDX/BotTranslator/blob/master/Samples/PizzaBot/PizzaOrderDialog.cs#L36)). 
6. If the user responds in the affirmative, the bot system stores the user's language setting in the user's bot state (a session state variable) for detection the next time ([sample](https://github.com/MSFTAuDX/BotTranslator/blob/master/Samples/PizzaBot/PizzaOrderDialog.cs#L71)).
7. On the next message from the user, it checks session state for the variable and if it's present, starts translating in and out automatically. 

<img alt="Would you like me to translate for you?" src="{{ site.baseurl }}/images/2017-04-20-TechnologyOne/ask_translate.gif" width="720"></img>

<br/>

## Technical delivery ##

### Setting up the bot project

Getting started is simple. Follow these steps to set up a basic bot project. 

1. Install Visual Studio.

    [Grab a copy of Visual Studio](https://www.visualstudio.com/downloads/) and install it. Make sure you include the **ASP.NET and web development** workload in the install feature option dialog. If you've already installed Visual Studio and cannot see the **Web** tab in the **Create New Project** dialog box, scroll to the bottom of the left pane and select **Open Visual Studio Installer** and proceed to add the workload. 

    <img alt="Visual Studio Workloads step 1" src="{{ site.baseurl }}/images/2017-04-20-TechnologyOne/VisualStudioWorkloads.png" width="320"></img>

    <br/>

2. Create your new project.

    Create a new ASP.NET Web API project. Select **Create New Project** from the Visual Studio 2017 launch screen, select **Web**, and then select **ASP.NET Web Application (.NET Framework)**. Choose a folder for your new project, and then click **OK**. On the next screen, select **Web API**, and then click **OK**. 

    <img alt="Visual Studio Workloads step 2" src="{{ site.baseurl }}/images/2017-04-20-TechnologyOne/WebAPICreate.png" width="320"></img>

    <br/>

3. Install the Bot Builder NuGet package.

    The base classes and boilerplate code we used to build this bot are part of the [Bot Builder NuGet package](https://www.nuget.org/packages/Microsoft.Bot.Builder/), which includes the capability to work with bot sessions, respond to user events, and easily call LUIS services, among other things. 

    You can install this from the Package Manager console by typing `Install-Package Microsoft.Bot.Builder`.

    You can also use the Package Manager GUI and search for Bot Builder. 

    Alternatively, you can base your new bot on one of the [Bot Builder samples on GitHub](https://github.com/Microsoft/BotBuilder-Samples). For example, see the [LUIS-based bots](https://github.com/Microsoft/BotBuilder-Samples/tree/master/CSharp/intelligence-LUIS) sample or the [SimpleIgniteBot](https://github.com/MSFTAuDX/SimpleBot) sample. 

    See also some great simple examples in the [Bot Framework documentation](https://docs.microsoft.com/en-us/bot-framework/cognitive-services-bot-intelligence-overview). 

> **Special note about Node.js** –
>  Even though we're dealing with C#-based bots in this document, for Node you can install the Bot Builder npm package to get started,  although this language translation system will not work without being ported. For more information, see the [full Node.js Bot Builder documentation](https://docs.microsoft.com/en-us/bot-framework/nodejs/bot-builder-nodejs-quickstart).

<br/>

### Getting started with translation

There are two ways to get set up for translation using this guide:
- [Install the Simple Bot Translator NuGet package](#method-1-use-the-simple-bot-translator-nuget-package).
- [Integrate the Cognitive Services Translator Speech API manually](#method-2-integrate-the-translation-service-manually), which is more involved, but perhaps more flexible given your requirements. 

Please note that this article assumes that you've set up a basic LUIS-based bot. If you'd like a running start, see the [Simple Bot sample code](https://github.com/MSFTAuDX/SimpleBot). 

#### Set up a Cognitive Services account

Before you can begin, you need to create a new Text Translator Cognitive Services account in your Azure portal. 

1. Sign in to the [Azure portal](https://portal.azure.com/). 
2. At the bottom of your services list on the left of your screen, click **More services**.
3. Search for **Cognitive Services** and select it. 
4. Click the large + sign to add a new service, selecting **Translator Text API** from the **API type** list. 
5. After that is created, you can navigate to the new service, and select **Keys** to see your keys. 

    <img alt="Create new Text Translator service" src="{{ site.baseurl }}/images/2017-04-20-TechnologyOne/translator_setup_small.gif"></img>

    <br/>

To service the translation requirements of this scenario, we built the [Simple Bot Translator](https://github.com/MSFTAuDX/BotTranslator). This is a system that bolts on around your bot code and allows translation without each developer having to translate every action manually; that is, it's transparent and super simple to use. The framework will handle the translation for you. 

Using the Bot Translator is simple, but there are some steps to go through to get it set up. 

### Method 1: Use the Simple Bot Translator NuGet package

Before you can begin, you must [set up a Cognitive Services account](#set-up-a-cognitive-services-account).

1. Add the [Simple Bot Translator NuGet Package](https://www.nuget.org/packages/SimpleBotTranslator/).

    `Install-Package SimpleBotTranslator`

2. Edit your Web.config file and add in the service model configuration. Add the following code just before the last `</configuration>` element; this is required because the Translator uses an older style SOAP XML end point. 

    ```xml
    <system.serviceModel>
        <bindings>
            <basicHttpBinding>
            <binding name="BasicHttpBinding_LanguageService" />
            </basicHttpBinding>
        </bindings>
        <client>
            <endpoint address="http://api.microsofttranslator.com/V2/soap.svc" binding="basicHttpBinding" bindingConfiguration="BasicHttpBinding_LanguageService" contract="MicrosoftTranslator.LanguageService" name="BasicHttpBinding_LanguageService" />
        </client>
    </system.serviceModel>
    ```
    
    <br/>
    
3. Ask the user if they would like to start translating. This is done in the `NoIntent` method for when LUIS calls through after checks for LUIS and QnA Maker; that is, none of the other systems detected a hit. Basically, put the check language code where you would normally return a message such as "sorry, I didn't understand what you meant."

    ```csharp
    if (!sentReply)
    {
        if (TranslatorService.Instance.GetLanguage(context) != "en")
        {
            var checkLanguage = await TranslatorService.Instance.Detect(result.Query);
            if (checkLanguage != "en")
            {
                context.UserData.SetValue("checkLanguage", checkLanguage);

                EditablePromptDialog.Choice(context,
                        LanuageSelectionChoicesAsync,
                            new List<string> { "Yes", "No" },
                            await TranslatorService.Instance.Translate("You are not speaking English! Would you like me to translate for you?", "en", checkLanguage),
                            await TranslatorService.Instance.Translate("I didn't understand that. Please choose one of the options", "en", checkLanguage),
                        2);

                return;}
        }

        await context.PostAsync("I'm sorry. I didn't understand you.");
        context.Wait(MessageReceived);
    ```

    ([See the full listing](https://github.com/MSFTAuDX/BotTranslator/blob/master/Samples/PizzaBot/PizzaOrderDialog.cs))
    
     <br/>

4. Start by intercepting the incoming bot call and performing some checks to see if the user has opted into translation, which is all handled by the Bot Translator for you. Add the following line to initialize the translator in `MessagesController.cs`.

    ```csharp
    [ResponseType(typeof(void))]
    public virtual async Task<HttpResponseMessage> Post([FromBody] Activity activity)
    {
        TranslatorService.Instance.SetKey("[Your key here]");
    ```

<br/>

**Base class**

You need to base your `LuisModel<object>` on `TranslatingLuisDialog` as per [this example](https://github.com/MSFTAuDX/BotTranslator/blob/97c4ad757bfbfe0714c6c7e3b7098082fa635052/Samples/PizzaBot/PizzaOrderDialog.cs#L20). This is what allows the Simple Translator to intercept your bot responses and translate them. More information about why this is later.

Note that the Pizza example is based on this [Bot Builder sample code](https://github.com/Microsoft/BotBuilder/blob/master/CSharp/Samples/PizzaBot/PizzaOrderDialog.cs) and has been extended to add translation.  

```csharp
[LuisModel("<subs>", "<luis id>", LuisApiVersion.V2)]
[Serializable]
class PizzaOrderDialog : TranslatingLuisDialog
{
```

<br/>

After that is done, you can begin to use the translator. 

Before the user's message is sent off to LUIS for processing, you must ask the translation service to intercept and translate the call. 

```csharp
await TranslatorService.Instance.TranslateIn(activity, true);
// one of these will have an interface and process it
switch (activity.GetActivityType())
{
    case ActivityTypes.Message:
        await Conversation.SendAsync(activity, () => new PizzaOrderDialog());
        break;
```

([See the full listing](https://github.com/MSFTAuDX/BotTranslator/blob/master/Samples/PizzaBot/Controllers/MessagesController.cs))

<br/>

Under the covers, it is checking the user state to see if translation has been enabled. 

**Your code - how to translate**

After translation has been set up, it's easy to start translating in and out of your own custom bot code. 

Any time you write plain text back to the user with `context.PostAsync` you don't need to do anything because the Bot Translator code will translate for you.

Where you do need to make considerations is around dialogs; you'll have to use the special `EditablePromptDialog` to have translatable dialogs in the system. 

```csharp
EditablePromptDialog.Choice(context,
    PizzaFormComplete,
    topicChoices,
    "Which toppings?",
    "I didn't understand that. Please choose one of the toppings",
    2);

...

private async Task PizzaFormComplete(IDialogContext context, IAwaitable<string> result)
{

```

<br/>

This will allow your system to create translatable dialogs without you having to manage the actual translation code throughout the app (which can get large and unmanageable over time).

For full instructions, see the [Bot Translator GitHub repo](https://github.com/MSFTAuDX/BotTranslator).

#### How does it work?

One of the core tenets of this translation system is that it should be easy to use and work transparently so bot developers can concentrate on building the best bot they can. 

To achieve this, we went through the [Bot Builder Source Code](https://github.com/Microsoft/BotBuilder/tree/master/CSharp/Library) looking for points that we can integrate. 

Being able to read through the Bot Builder source code made the translation system development a lot easier; it's a great example of why open source software is so important. 

**Regular responses**

The process follows this basic path:

1. Base your `LuisDialog` model class on `Translathttps://github.com/Microsoft/Bot Builder/blob/master/CSharp/Library/Microsoft.Bot.Builder/Dialogs/DialogContext.cs#L44ingLuisDialog`.
2. Intercept start events and message received events to ensure that the `IDialogContext` is wrapped in `TranslatingDialogContext`.
3. Intercept calls to the base Bot Builder code to perform translation.

The first target for translation was regular text responses (that is, no special dialogs). Figuring out how the dialog system worked involved stepping through the Bot Builder source code plugged into the samples to see how the system handled the various dialog responses. You can debug the samples and step through the [Bot Builder code](https://github.com/Microsoft/BotBuilder/tree/master/CSharp/Library) at runtime, which was hugely beneficial to figuring out how we needed to integrate.

The classes we wanted to add functionality to were mostly sealed or internal, so we decided on the decorator pattern to add the required functionality. A case in point is the [`DialogContext`](https://github.com/Microsoft/BotBuilder/blob/master/CSharp/Library/Microsoft.Bot.Builder/Dialogs/DialogContext.cs#L44), which is sealed, so we wrapped it in a decorator called [`TranslatingDialogContext.cs`](https://github.com/MSFTAuDX/BotTranslator/blob/cada179b6c3fd9fba285ce83c405ddbf2bb4dd50/BotTranslator/Bot/TranslatingDialogContext.cs), which intercepts the message posts and translates them if needed. 

```csharp
if (!string.IsNullOrWhiteSpace(message.Text))
{
    translateTasks.Add(_translate(message.Text, language, (s) => message.Text = s));
}
```

([See TranslatingDialogContext.cs line 49](https://github.com/MSFTAuDX/BotTranslator/blob/cada179b6c3fd9fba285ce83c405ddbf2bb4dd50/BotTranslator/Bot/TranslatingDialogContext.cs#L49))

<br/>

The next part of the puzzle was making sure that the system used the `TranslatingDialogContext` rather than the regular version, even after a dialog had been serialized and rehydrated later. If you're not aware, the bot system will serialize the `LuisDialog` between calls, so object setup becomes very important. 

This serialization meant the addition of another base class, [`TranslatingLuisDialog`](https://github.com/MSFTAuDX/BotTranslator/blob/97c4ad757bfbfe0714c6c7e3b7098082fa635052/BotTranslator/Bot/TranslatingLuisDialog.cs), which is based on `LuisDialog<object>`. 

This class intercepts the message received event and ensures that the dialog is wrapped in the [`TranslatingDialogContext.cs`](https://github.com/MSFTAuDX/BotTranslator/blob/cada179b6c3fd9fba285ce83c405ddbf2bb4dd50/BotTranslator/Bot/TranslatingDialogContext.cs) type.

It also overrides the start method from the `IDialog<object>` interface, which is called whenever the `LuisDialog` is started.

This is super easy for a developer to use; just base the `LuisDialog` class on [`TranslatingLuisDialog`](https://github.com/MSFTAuDX/BotTranslator/blob/97c4ad757bfbfe0714c6c7e3b7098082fa635052/Samples/PizzaBot/PizzaOrderDialog.cs#L20).

Translating basic text is now very easy for the developer; the following is translated automatically if translation is enabled. It's familiar to bot developers. 

```csharp
await context.PostAsync("I'm sorry. I didn't understand you."); 
```

<br/>

**HeroCards**

[`TranslatingDialogContext.cs`](https://github.com/MSFTAuDX/BotTranslator/blob/cada179b6c3fd9fba285ce83c405ddbf2bb4dd50/BotTranslator/Bot/TranslatingDialogContext.cs) is also able to translate message attachments such as action cards, handling `Subtitle`, `Text`, and `Title` so that the developer can just create and return cards as normal attachments. 

```csharp
if (message.Attachments != null)
{
    foreach (var a in message.Attachments)
    {
        if (a.Content is HeroCard h)
        {
            var closure = h;
            translateTasks.Add(_translate(h.Subtitle, language, (s) => closure.Subtitle = s));
            translateTasks.Add(_translate(h.Text, language, (s) => closure.Text = s));
            translateTasks.Add(_translate(h.Title, language, (s) => closure.Title = s));
            translateTasks.AddRange(
                from b in h.Buttons
                let closureB = b
                select _translate(b.Title, language,
                (s) => closureB.Title = s));
        }
    }
}
``` 

([See TranslatingDialogContext.cs line 37](https://github.com/MSFTAuDX/BotTranslator/blob/97c4ad757bfbfe0714c6c7e3b7098082fa635052/BotTranslator/Bot/TranslatingDialogContext.cs#L37))

<br/>

**Dialogs** 

Enabling prompts to be translated involved adding a new class [`EditablePromptChoice.cs`](https://github.com/MSFTAuDX/BotTranslator/blob/97c4ad757bfbfe0714c6c7e3b7098082fa635052/BotTranslator/Bot/EditablePromptChoice.cs#L37). This is a decorator that intercepts the `Choice` method of the `PromptDialog` and ensures that the context is again wrapped in the `TranslatingDialogContext` before forcing the system to continue on by calling `Call<T>` on the main context to force in a new instance of `EditablePromptChoice`. This ensures that the prompt context is rewrapped in the `EditablePromptChoice` after the response comes back from the user and everything is rehydrated.

It needs to be wrapped because the `PromptDialog` class is for all intents and purposes immutable, and thus cannot be altered by the translation system. It also has some internal properties that make it hard to read. 

The final part of the dialog translation puzzle was the actual translation of the dialog, which happens in the [`Call<T>` method](https://github.com/MSFTAuDX/BotTranslator/blob/97c4ad757bfbfe0714c6c7e3b7098082fa635052/BotTranslator/Bot/TranslatingDialogContext.cs#L84). `Call` is able to check for the `EditablePromptChoice` and extract the options, translate them, and recreate a new `PromptOptions` object (because `PromptOptions` is immutable) and reconstruct the translated dialog.

Now the developer creates an `EditablePromptDialog` instead of a regular `PromptDialog`. This is the largest difference in the main code to accommodate the Bot Translator: 

```csharp
EditablePromptDialog.Choice(context,
    PizzaFormComplete,
    topicChoices,
    "Which toppings?",
    "I didn't understand that. Please choose one of the toppings",
    2);
```

([See PizzaOrderDialog.cs line 36](https://github.com/MSFTAuDX/BotTranslator/blob/97c4ad757bfbfe0714c6c7e3b7098082fa635052/Samples/PizzaBot/PizzaOrderDialog.cs#L36))

<br/>

### Method 2: Integrate the translation service manually

If your project requires more control over the translation process than is afforded by the Simple Bot Translator NuGet package, you can always integrate the translation services directly. 

1. Add the Translation SOAP service.
2. Use Cognitive Services token generation.
3. Import the class library (if used).
4. Go!

If you get stuck, you can always follow along with these [Bot Translator samples](https://github.com/MSFTAuDX/BotTranslator/tree/master/BotTranslator). 

> **Note** – This will only work on projects that use the full .NET Framework; that is, this will not work on a .NET Core-based project due to it using older SOAP style services that are not supported on newer project types. 

<br/>

#### Authentication

Before you can use the Cognitive Services Translator Speech API, you must convert your subscription key into a bearer token. This token will have a lifespan of under ten minutes. You will want to cache the bearer token result so the app is not constantly requesting bearer tokens when it doesn't have to. 

The gist is that you need to send the subscription key from the Azure portal; see the section [Set up a Cognitive Services account](#set-up-a-cognitive-services-account). 
 
1. Check the cache, and return the cached value if age is < 10 minutes (in this case we set to < 5 minutes to be safe).
2. Send the subscription key in the `Ocp-Apim-Subscription-Key` header to [https://api.cognitive.microsoft.com/sts/v1.0/issueToken](https://api.cognitive.microsoft.com/sts/v1.0/issueToken).
3. Read the result and add `bearer` on the front.
4. Update the cache, and return the result.

[This class](https://github.com/MSFTAuDX/BotTranslator/blob/master/BotTranslator/Azure/AzureAuthToken.cs) demonstrates the process end-to-end.  

#### Adding the SOAP end point

The next step is to add the SOAP-based service reference. We chose to do this in a class library, which can then be added to other projects. Note that if you do add this in a class library, you will have to copy the `system.serviceModel` configuration between projects manually (see the steps under [Method 1: Use the Simple Bot Translator NuGet package](#method-1-use-the-simple-bot-translator-nuget-package) earlier in this document). 

1. In Solution Explorer, right-click **References**, and then select **Add Service Reference**.
2. In the dialog that appears, enter `http://api.microsofttranslator.com/v2/soap.svc` in the **Address** field, and then click **Go**.
3. In the **Namespace** field, enter `MicrosoftTranslator`, and then click **OK**.

<img alt="Add the SOAP end point" src="{{ site.baseurl }}/images/2017-04-20-TechnologyOne/soap_endpoint.png" width="720"></img>

<br/>

You are now ready to begin experimentation. This simple console app demonstrates how to get a basic translate up and running. 

```csharp
using BotTranslator.Azure;
using ConsoleApp4.MicrosoftTranslator;

namespace ConsoleApp4
{
    class Program
    {
        static void Main(string[] args)
        {
            var authTokenGetter = new AzureAuthToken("<token from the Azure Portal>");
            var token = authTokenGetter.GetAccessToken();
            var translator = new LanguageServiceClient();
            var result = translator.Translate(token, "this here is a test", "en", "it", "text/plain", "general", string.Empty);
        }
    }
}
```

<br/>

You should be able to take this example and integrate it with your bot project. 

## Conclusion

Natural language is an entirely new UI paradigm that offers a range of capabilities that were not available until recently thanks to advances in Machine Learning and AI-based platforms. 

We found that adding features such as multi-lingual support to existing apps and systems was easy after the content was exposed via a conversational UI. 

The first step was the creation of a LUIS model to suit the needs of our bot as defined during the project discovery. This model was backed by the QnA Maker to provide depth to regular question and answer style queries. 

We were then able to pull contextual information about the user from the back-end systems so they could ask up-to-the-minute questions about their day at the university. 

Up to this point, UniBot was operating solely in English. 

We implemented the Cognitive Services Translator Speech API as a NuGet package that can easily be installed in any C#-based bot project.

The end result is a bot that can translate to and from up to 60 languages, all based on back-end systems written entirely in English. This allows prospective students to browse university systems, and enables enrolled students to use it as a personal assistant for day-to-day university life.  

### Learnings

We've used the Simple Bot Translator across a number of projects now including the TechnologyOne Education Bot and the Ignite Australia 2017 Conference Bot. 

#### Intelligent services structure ###

With so many intelligent systems working together, it's important to have them work together in the right way. For example, there is no point going to LUIS before the translation is performed.

We found the best way to maximize the user experience is to start the bot with language translation turned off and assume the user is speaking English, which is our natural language; you can of course substitute this default with another language. Only after all checks have failed (LUIS, QnA Maker, other systems, etc.) will we check the language and ask the user if they would like to start translating. 

There is no need for the translation system to be in operation for a fair percentage of conversations, so it's a fallback feature that is only enabled when it's needed. 

#### Alternative to automatic translation ###

Bots can work with traditional resource-based translation, so manual translation the traditional way is possible; for more information, see [demo-ContosoFlowers](https://github.com/Microsoft/BotBuilder-Samples/tree/master/CSharp/demo-ContosoFlowers). 

Keep in mind that if you do this, you will have to maintain a LUIS model for each language, including keeping it up to date with real work data/retrain, whereas automatic translation gives you access to up to 60 languages without the extra burden. 

#### LUIS needs time ###

Machine learning-based systems get better over time as you feed in more and more real data from real-world usage. This data helps tune the system based on how users go about interacting with the system. This is especially true with LUIS; language is very complex and there are so many ways to ask the same questions. 

The main learning we'd like to pass on here is to set expectations with the project stakeholders. The LUIS models are good at the start, but they will be awesome a few months down the track as you feed in more real data. 

Remember to give the [active learning](https://www.microsoft.com/cognitive-services/en-us/LUIS-api/documentation/Label-Suggested-Utterances) component the time it needs to really shine. 

#### Do not translate dialog buttons

We played around with translating dialog buttons. For example, "please select a cheese type: Cheddar, Camembert, Feta" where the cheese types would become buttons. Translating out and back from these button types was troublesome as the responses would sometimes not translate back in to the same English word, so the bot would not know which option the user had selected, effectively making the dialog unusable. It would be possible to do this button translation by storing the original values in a hash map in the chat state and matching them back up later, something we didn't have time to complete. 
 
## Additional resources

- [Bot Builder Framework code](https://github.com/Microsoft/BotBuilder/tree/master/CSharp/Library)
- [Bot Framework](https://dev.botframework.com/)
- [Bot Translator sample code](https://github.com/MSFTAuDX/BotTranslator)
- [LUIS Active Learning Label Suggested Utterances]( https://docs.microsoft.com/en-us/azure/cognitive-services/luis/label-suggested-utterances)
- [LUIS documentation]( https://docs.microsoft.com/en-us/azure/cognitive-services/LUIS/Home)
- [Sample LUIS Project for Ignite Australia 2017](https://gist.github.com/jakkaj/02f8f7d2152c0e9403342be608e05754)
- [Simple Ignite Bot sample code - MessagesController.cs](https://github.com/MSFTAuDX/SimpleBot/blob/master/SimpleIgniteBot/SimpleIgniteBot/Controllers/MessagesController.cs)
- [Simple Ignite Bot sample code](https://github.com/MSFTAuDX/SimpleBot)
- [Simple LUIS bot examples in the Bot Framework documentation](https://docs.botframework.com/en-us/bot-intelligence/language/)

### Videos

- [TechnologyOne Education Bot Sizzle Video](https://www.youtube.com/watch?v=FMU4Tnr_QFs)
- [Full overview video of the TechnologyOne Education Bot solution](https://www.youtube.com/watch?v=HZe1vQKWofU)
- [Video demonstrating translation system in the Bot Emulator](https://1drv.ms/u/s!ArAmvv688GNakp08UACZ0PXIQp_tOw)
