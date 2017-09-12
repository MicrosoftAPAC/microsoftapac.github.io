---
layout: post
title: "Building a cross-platform bot app for Powerupcloud with Xamarin and Cognitive Services"
author: "Alyssa Ong, James Lee, and Ujjwal Kumar"
#author-link: "#"
#author-image: "{{site.baseurl}}/images/authors/Ujjwal.jpg"
date: 2017-05-24
categories: [Mobile Application Development with Xamarin]
color: "blue"
image: "images/Powerupcloud_Xamarin/feat_XamarinReceptionist.png" 
excerpt: This article and project is about building a Xamarin-based cross-platform app and integrating it with Cognitive Services and a bot developed by using the Direct Line API from the Microsoft Bot Framework.
language: [English]
verticals: [Facility Management]
geolocation: [Singapore]
---

In this solution we focused on building a Xamarin-based Universal Windows Platform (UWP) receptionist bot for identity, authentication, and response by using the Microsoft Bot Framework, custom NLP (IRA.AI), and Cognitive Services Computer Vision API. This article showcases the creation and integration of this solution with an existing bot.

The receptionist bot can do the following:

- Chat with visitors and guide them to the respective office floor or help them with directions to a nearby train, bus, or taxi. 
- Verify visitors using facial recognition, check the calendar for an invite, and print a visitor pass.
- Register new users with facial recognition and ID proof.
- Talk to visitors by using Cognitive Services Speech if they don't prefer typing.

![Receptionist Xamarin app use case scenario diagram]({{site.baseurl}}/images/Powerupcloud_Xamarin/XamarinReceptionist.png)

### Key technologies used

- [Web Apps feature of Microsoft Azure App Service](https://azure.microsoft.com/en-us/services/app-service/web/)
- [Xamarin for UWP app](https://msdn.microsoft.com/en-us/magazine/mt790185.aspx)
- [Cognitive Services: Computer Vision API](https://azure.microsoft.com/en-us/services/cognitive-services/computer-vision/)
- [Cognitive Services: Face API](https://azure.microsoft.com/en-us/services/cognitive-services/face/)
- [Cognitive Services: Language Understanding Intelligent Service (LUIS)](https://azure.microsoft.com/en-us/services/cognitive-services/language-understanding-intelligent-service/)
- [SQL Server 2016](https://www.microsoft.com/en-us/sql-server/sql-server-2016)
- Azure virtual machine to host IRA.AI 
 
### Core team

- Arun Britto – Head of Business, APAC, Powerupcloud
- Ram Kumar – CTO, Powerupcloud
- Ranjeeth Kruppala – Developer, Powerupcloud
- Alyssa Ong – Technical Evangelist, Microsoft
- James Lee – Technical Evangelist Intern, Microsoft
- [Ujjwal Kumar](https://twitter.com/ujjwalkr) – Senior Technical Evangelist, Microsoft  
 
## Customer profile

[Powerupcloud Pvt Ltd](https://powerupcloud.com/), located in India and Singapore, is a Microsoft partner whose product/service offerings focus on big data platform and artificial intelligence (AI)-based bots. One of their core internal products is a custom language understanding solution known as [IRA.AI](http://ira.ai/). Their receptionist bot solution based on IRA.AI is being used by multiple customers in Singapore and India. Powerupcloud also focuses on developing data analytics-based custom solutions by using SQL Server 2016.

![Receptionist Xamarin app internal architecture diagram]({{site.baseurl}}/images/Powerupcloud_Xamarin/InternalArchitecture.png)

<br/>

## Problem statement

The main challenge for Powerupcloud has been to continuously develop and maintain various native cross-platform apps targeting Android, iOS, and Windows to offer their receptionist and other bot solutions. By using Xamarin, they planned to streamline their mobile app development strategy and optimize cost on app development and maintenance. 

From a solution perspective, this application intends to solve the visitor queue challenges at any office reception by providing a Xamarin-based bot running on a Surface or Windows device. Depending on the customer's organization needs, a receptionist bot can also be provided through respective app stores. The app connects to Azure App Service, data, and Cognitive Services to provide the complete solution.
 
 
## Solution, steps, and delivery

We worked on the Xamarin app integration using a Direct Line channel provided by the Microsoft Bot Framework. On the UI front, we used list control. In this scenario, the bot app is hosted on the Web Apps feature of Azure App Service. The application connects to Cognitive Services to identify and detect the visitor.
 
A major challenge was that the Powerupcloud dev team had no experience with Xamarin development prior to this engagement. The following details helped them implement their bot integration with a Xamarin mobile app.

Following are the technical details for:
- Creating a bot using the Bot Framework
- Integrating the bot with a cross-platform Xamarin app
- Adding Cognitive Services to make the app smart

### Creating a bot using the Bot Framework
The following two NuGet packages were added to the Xamarin.Forms shared project:

- [Microsoft.Bot.Connector.DirectLine](https://www.nuget.org/packages/Microsoft.Bot.Connector.DirectLine/3.0.0)
- [Microsoft.Rest.ClientRuntime](https://www.nuget.org/packages/Microsoft.Rest.ClientRuntime/)

These NuGet packages allow communication with the bot by using pre-defined methods and classes without the need for manually writing HTTP calls. 

The bot was published online by using Web Apps. It was also registered on the [Bot Framework developer portal](https://dev.botframework.com/bots/new).

### Integrating the bot with a cross-platform Xamarin app
To integrate the bot with a Xamarin app, we had to use a Direct Line channel. The Direct Line NuGet package published by Microsoft was used to abstract the REST API calls. The Xamarin application for bot scenarios is required to communicate with the bot by sending and receiving messages. We needed to use methods to send messages to the bot and receive messages from the bot; the Direct Line NuGet package we installed earlier allowed us to easily implement this within the application without having to write any HTTP calls manually.

#### To integrate the bot with a Xamarin app

1. We created the class `BotConnection.cs`.
2. We imported the following namespace from the Direct Line NuGet package to use its classes and methods.

   ```cs
   using Microsoft.Bot.Connector.DirectLine;
   ```

3. We added the following variables.

   ```cs
   class BotConnection
   {
       public DirectLineClient Client = new DirectLineClient("xxxxx"); //DirectLine key
       public Conversation MainConversation;
       public ChannelAccount Account;
   }
   ```

4. We created a new `DirectLineClient` object using the Direct Line key. 
5. We added two variables for storing the current conversation as well as the user's account.
6. We used the constructor to initialize the `MainConversation` and `Account` fields, which store the information about the current conversation and the user. 

   ```cs
   class BotConnection
   {
       public BotConnection(string accountName)
       {
           MainConversation = Client.Conversations.StartConversation();
           Account = new ChannelAccount { Id = accountName, Name = accountName };
       }
   }
   ```
   
7.  We can take in a parameter with the user's name to create an account object. To begin a new conversation by using the client, we added a method that allows us to send messages to the bot. This method takes in a parameter with a simple text message and uses that to create an `Activity` that will be sent to the conversation we initialized.

    ```cs
    public void SendMessage(string message)
    {
        Activity activity = new Activity
        {
            From = Account,
            Text = message,
            Type = ActivityTypes.Message
        };
        Client.Conversations.PostActivity(MainConversation.ConversationId, activity);
    }
    ```

8. We created a `MessageListItem` class to store the messages in an `ObservableCollection`. This class is used for data binding in the UI. 

   ```cs
   class MessageListItem
   {
       public string Text { get; set; }
       public string Sender { get; set; }

       public MessageListItem(string text, string sender)
       {
           Text = text;
           Sender = sender;
       }
   }
   ```

9. We added another method that continuously checks the conversation on the server for new messages from the bot. This method takes in an `ObservableCollection` typed parameter. This collection is also binded to the UI in Xamarin so that we can push new messages into this collection. This method checks for new messages every 3 seconds, establishing a watermark every iteration to ensure that we do not retrieve old messages. Whenever we retrieve a new message, we create a new `MessageListItem` from it and push it into the collection.

   ```cs
   public async Task GetMessagesAsync(ObservableCollection<MessageListItem> collection)
   {
       string watermark = null;

       //Loop retrieval
       while(true)
       {
           Debug.WriteLine("Reading message every 3 seconds");

           //Get activities (messages) after the watermark
           var activitySet = await Client.Conversations.GetActivitiesAsync(MainConversation.ConversationId, watermark);

           //Set new watermark
           watermark = activitySet?.Watermark;

           //Loop through the activities and add them to the list
           foreach(Activity activity in activitySet.Activities)
           {
               if (activity.From.Name == "MarsBot")
               {
                   collection.Add(new MessageListItem(activity.Text, activity.From.Name));
               }             
           }

           //Wait 3 seconds
           await Task.Delay(3000);
       }
   }
   ```

<br/>

#### To create an interface to interact with the bot

1. We created a new application page with these components:

   - `ListView` to display the messages between the user and the bot
   - `Entry` to send messages to the bot
   - `BotConnection` with the UI through data binding

2. We used XAML to define the visual contents of the application page. It allowed us to define the page's elements, including its position, color, text, and other relevant properties. 

3. For the chat application, we added two items:

   - `ListView` to show the messages in the conversation
   - `Entry` (text box) to enter the text to be sent to the bot

4. We used `StackLayout` to position elements in our XAML, setting horizontal and vertical properties.

5. We replaced the `Label` element with the `StackLayout` element. `StackLayout` fills the whole page, with some padding on the edges. It also defines a spacing of 10 between the elements in a vertical order.

    ```xml
      <StackLayout Spacing="10" Padding="10" HorizontalOptions="Fill" VerticalOptions="Fill" Orientation="Vertical">
      </StackLayout>
    ```

6. In `StackLayout`, we added `ListView` and `Entry` elements.

    ```xml
    <StackLayout Spacing="10" Padding="10" HorizontalOptions="Fill" VerticalOptions="Fill" Orientation="Vertical">
            <ListView x:Name="MessageListView"
                            VerticalOptions="StartAndExpand"
                            HorizontalOptions="Fill"
                            >
            </ListView>

            <Entry Placeholder="Message"
                    VerticalOptions="End"
                    HorizontalOptions="Fill"
                    HorizontalTextAlignment="End"
                    />
    </StackLayout>
    ```

7. We used `TextCell`, a pre-defined cell type provided by Xamarin. It's a simple cell that has text and detail properties.

    ```xml
    <ListView x:Name="MessageListView"
                    VerticalOptions="StartAndExpand"
                    HorizontalOptions="Fill"
                    >
            <ListView.ItemTemplate>
                    <DataTemplate>
                    <TextCell Text="{Binding Text}" Detail="{Binding Sender}" />
                    </DataTemplate>
            </ListView.ItemTemplate>
    </ListView>
    ```
    
<br/>

#### To connect the bot to the XAML page of the Xamarin app

1. Because we've already abstracted all the connection logic into a different class, we created the following object to connect to the bot in the code. This page in the application allows us to access the bot through code.

   ```cs
   //Initialize a connection with ID and Name
   BotConnection connection = new BotConnection("Ujjwal");
   ```

2. In our case, `ListView` was used to display messages to and from the bot. We used `ObservableCollection` to bind data with `ListView`.

   ```cs
   ObservableCollection<MessageListItem> messageList = new ObservableCollection<MessageListItem>();
   ```

3. We created and used a custom `MessageListItem` class with the properties `Text` and `Sender` to bind the properties to the cells in the list. The binding in XAML code is as follows.

   ```xml
   <TextCell Text="{Binding Text}" Detail="{Binding Sender}" />
   ```

4. Previously in our XAML, we named `ListView` as `MessageListView`. Assigning a name to the element in XAML allowed us to access it as a variable in the code-behind file of the XAML. New additions to the `messageList` collection will be reflected in the UI in the `MessageListView`.

   ```cs
   //Initialize a connection with ID and Name
   BotConnection connection = new BotConnection("Ujjwal");

   //ObservableCollection to store the messages to be displayed
   ObservableCollection<MessageListItem> messageList = new ObservableCollection<MessageListItem>();

   public MainPage()
   {
       InitializeComponent();

       //Bind the ListView to the ObservableCollection
       MessageListView.ItemsSource = messageList;
   }
   ```

5. Every `MessageListItem` object added to the collection will also get its own cell with the message data in the `ListView`. After the binding setup, we just needed to let the new messages that came in be added to the `ObservableCollection`.

   ```cs
   //Initialize a connection with ID and Name
   BotConnection connection = new BotConnection("Ujjwal");

   //ObservableCollection to store the messages to be displayed
   ObservableCollection<MessageListItem> messageList = new ObservableCollection<MessageListItem>();

   public MainPage()
   {
       InitializeComponent();

       //Bind the ListView to the ObservableCollection
       MessageListView.ItemsSource = messageList;

       //Start listening to messages and add any new ones to the collection
       var messageTask = connection.GetMessagesAsync(messageList);
   }
   ```

6. We needed to update the `Entry` box so that it allows the user to enter messages when Enter is pressed and send the message to the bot. To do that, we linked the UI with the code. This code tells the program, "Hey, when the user presses Enter, run the Send() method."

   ```xml
   <Entry Placeholder="Message"
           VerticalOptions="End"
           HorizontalOptions="Fill"
           HorizontalTextAlignment="End"
           Completed="Send"
           />
   ```

7. After we declared this in the XAML, we also needed to define the method in the code-behind file. In `MainPage.xaml.cs`, we defined a new method named `Send()`, which will be executed whenever someone presses Enter on the `Entry` box.

   ```cs
   public void Send(object sender, EventArgs args)
   {
           //Get text in entry
           var message = ((Entry)sender).Text;

           if(message.Length > 0)
           {
               //Clear entry
               ((Entry)sender).Text = "";

               //Make object to be placed in ListView
               var messageListItem = new MessageListItem(message, connection.Account.Name);
               messageList.Add(messageListItem);

               //Send the message to the bot
               connection.SendMessage(message);
           }
   }
   ```

   It will help with the following:

   - Getting the user's message
   - Clearing the `Entry` box
   - Adding messages into the collection for display
   - Sending messages to the bot

   We tried asking it a few questions to test it:

   - Is there a cafe?
   - Do you have guest Wi-Fi?
   - Where can I find the restroom?
   - Is there parking?


8. We noticed that there was an issue with the UI when we ran this test on Android. The message was cut short when it was too long and the cells didn't seem to be suitable for messages. The issue was with the default `TextCell` in the `ListView`; it cuts off text that is too long by default.

    ```xml
    <ListView x:Name="MessageListView"
                    VerticalOptions="StartAndExpand"
                    HorizontalOptions="Fill"
                    >
            <ListView.ItemTemplate>
                    <DataTemplate>
                    <TextCell Text="{Binding Text}" Detail="{Binding Sender}" />
                    </DataTemplate>
            </ListView.ItemTemplate>
    </ListView>
    ```

9. Instead, we used a custom cell for the template by using the method defined at [Cell Appearance: Custom Cells](https://developer.xamarin.com/guides/xamarin-forms/user-interface/listview/customizing-cell-appearance/). Additionally, we needed to configure `ListView` to allow uneven rows. Customizing the cell appearance allowed the cells in the `ListView` to be flexible and adapt size according to the content.

The next step was to add the Cognitive Services API to the Xamarin application to make it smarter, a requirement for the receptionist bot scenario.

### Adding Cognitive Services API to the Xamarin bot app

We needed to do two things to the code:
  - Add the Camera function
  - Send the captured image to the Computer Vision API and get a result

#### To add the Camera function

1. We added these two NuGet packages to the project:

   - Xamarin Media plug-in, for camera controls
   - Computer Vision client library, to work with the Computer Vision API

2. Xamarin.Forms doesn't natively provide the ability to access camera APIs, but the `Xam.Plugin.Media` plug-in helped us access the camera APIs on each native platform in shared code.

3. We enabled the webcam permission on the UWP project for testing and then initialized the plug-in in the code.

   ```cs
   using Plugin.Media;

   public MainPage()
   {
       InitializeComponent();

       //Bind the ListView to the ObservableCollection
       MessageListView.ItemsSource = messageList;

       //Start listening to messages
       Task.Run(() => connection.GetMessagesAsync(messageList));

       //Initialize camera plugin
       CrossMedia.Current.Initialize();
   }
   ```

4. The following code was used for triggering the camera.

   ```xml
   <StackLayout Spacing="10" Padding="10" HorizontalOptions="Fill" VerticalOptions="Fill" Orientation="Vertical">
           <ListView x:Name="MessageListView"
                           VerticalOptions="StartAndExpand"
                           HorizontalOptions="Fill"
                           >
               <ListView.ItemTemplate>
                 <DataTemplate>
                   <TextCell Text="{Binding Text}" Detail="{Binding Sender}" />
                 </DataTemplate>
               </ListView.ItemTemplate>
           </ListView>

           <Entry Placeholder="Message"
                   VerticalOptions="End"
                   HorizontalOptions="Fill"
                   HorizontalTextAlignment="End"
                   />

           <Button Text="Take Picture"
             VerticalOptions="End"
             HorizontalOptions="Fill"
             Clicked="TakePic"
             />
   </StackLayout>
   ```

5. In the XAML, we defined that when we click the button, the `TakePic()` method was executed.

   ```cs
   public async void TakePic(object sender, EventArgs args)
   {
       //Check if camera is available
       if (CrossMedia.Current.IsCameraAvailable && CrossMedia.Current.IsTakePhotoSupported)
       {
           //Supply media options for saving our photo after it's taken.
           var mediaOptions = new Plugin.Media.Abstractions.StoreCameraMediaOptions
           {
               Directory = "Receipts",
               Name = $"{DateTime.UtcNow}.jpg"
           };

           //Get taken picture
           var file = await CrossMedia.Current.TakePhotoAsync(mediaOptions);
       }
   }
   ```

<br/>

#### To send the captured image to the Computer Vision API and get a result

1. This method takes in a stream, passes it into the API, and returns the result.

   ```cs
   using Microsoft.ProjectOxford.Vision;
   using Microsoft.ProjectOxford.Vision.Contract;

   //Computer Vision client
   VisionServiceClient visionClient = new VisionServiceClient("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"); //replace with Computer Vision API key
   ```

   <br/>

   ```cs
   public async Task<AnalysisResult> GetImageDescriptionAsync(Stream imageStream)
   {
       VisualFeature[] features = { VisualFeature.Tags, VisualFeature.Categories, VisualFeature.Description };
       var result = await visionClient.AnalyzeImageAsync(imageStream, features.ToList(), null);
       return result;
   }
   ```

2. We then called this method in the `TakePic()` function.

   ```cs
   public async void TakePic(object sender, EventArgs args)
   {
       if (CrossMedia.Current.IsCameraAvailable && CrossMedia.Current.IsTakePhotoSupported)
       {
           //Supply media options for saving our photo after it's taken.
           var mediaOptions = new Plugin.Media.Abstractions.StoreCameraMediaOptions
           {
               Directory = "Receipts",
               Name = $"{DateTime.UtcNow}.jpg"
           };

           //Get taken picture
           var file = await CrossMedia.Current.TakePhotoAsync(mediaOptions);
           var fileStream = file.GetStream();

           //Display loading
           await DisplayAlert("Loading Result", "Please wait", "OK");

           //Send file to ComputerVision
           var result = await GetImageDescriptionAsync(fileStream);
           await DisplayAlert("Detection Result", "I think it's " + result.Description.Captions[0].Text, "OK");
       }
   }
   ```

3. After getting the file from the camera, we converted it into a stream and passed it into the Computer Vision API and displayed the result in an alert window. 

This completed the required tasks of connecting the existing bot with the cross-platform Xamarin app and adding the Cognitive Services API to the Xamarin app for the receptionist bot application. 


### Workflow diagrams

![Receptionist Xamarin app workflow diagram]({{site.baseurl}}/images/Powerupcloud_Xamarin/PowerupcloudReceptionistWorkflow.jpg)

<br/>

![Receptionist Xamarin app functional workflow diagram]({{site.baseurl}}/images/Powerupcloud_Xamarin/FunctionalWorkflow.png)


### Learnings from the Microsoft and Powerupcloud teams

- Use the stable, latest release builds of Xamarin to create cross-platform apps.
- Use the stable, latest release builds of relevant SDKs for Windows, iOS, or Android, and allow time for fixing issues caused by outdated or mismatched APIs from old or deprecated SDKs. 
- While implementing data binding, we noticed issues in the UI for the Android platform: cells had to be customized to handle messages of different lengths for the Android platform (as mentioned earlier). 


## Conclusion

Measurable impact/benefits:
- Powerupcloud integrated their receptionist bot solution with the Xamarin app in only a few weeks.
- They are streamlining their mobile app dev strategy by adopting Xamarin to create cross-platform apps. This will help them to optimize the cost of development and maintenance for multiple versions of bot apps targeting Windows, iOS, and Android.
- Additionally, they can deliver a UWP receptionist bot app running on Windows devices, or cross-platform apps for iOS/Android platforms through respective app stores or by sideloading.

### General lessons

- The Xamarin app can be integrated with the Bot Framework-based applications by using Direct Line, which enables developers to build cross-platform chat apps seamlessly.
- Cognitive Services can make an existing app smarter and enable developers to create smarter apps in days or weeks.  
- Xamarin integration with bots can be re-applied to any cross-platform bot applications targeting UWP, iOS, and Android.


### Opportunities going forward

The work we did with Powerupcloud for the receptionist bot gave them an understanding of how to integrate their bot solutions with Xamarin to create UWP and cross-platform apps. This has led to additional, potential win opportunities for their current and future customers.

Customer testimonial for Powerupcloud's Sparkle bot application:

*“We chose IRA.AI for Singapore's first experimental shopping mall chatbot concierge, primarily because of the flexibility and high customizability of the IRA.AI engine. This is critical for the complex and ever-changing use cases needed to enhance shopper experience at our malls.”* — Ervin Yeo, AVP at Office of President, CapitaLand

- [Sparkle in action (YouTube video)](https://www.youtube.com/watch?v=SVRiuPk3kzc)
 
- [IRA.AI powers virtual concierge chatbot Sparkle for CapitaLand](https://news.microsoft.com/en-sg/2016/11/15/ira-ai-powers-virtual-concierge-chatbot-sparkle-for-capitaland/#5kmII4pcJxOdAa4s.99http://news.microsoft.com/en-sg/2016/11/15/ira-ai-powers-virtual-concierge-chatbot-sparkle-for-capitaland/#sm.00000akm8y7jye5ctuo26pxyj33r1)


## Additional resources

-	[Completed GitHub repo of the given challenge](https://github.com/ujjwalmsft/XamarinMarsBuddyComplete)
- [Additional Xamarin GitHub repo for reference using web control](https://github.com/ujjwalmsft/XamarinBotWebView)
