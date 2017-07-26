---
layout: post
title:  "A Cognitive-Service-powered intelligent house manager at your home"
author: "Warren Zhou"
author-link: "Add author's Twitter URL here"
#author-image: "{{ site.baseurl }}/images/authors/photo.jpg"
date:   2017-06-05
categories: [Cognitive Services]
color: "blue"
image: "images/Perspicace/Architecture.png" #should be ~350px tall
excerpt: The Smart Home vendor Perspicace leverages Microsoft Cognitive Services and develops its hardware and service to provide an intelligent house manager in your house. The house manager is able to see you, listen and talk to you. She can also understand your emotion, intents and provide assistance in every room in your house.
language: English
verticals: Consumer Products & Services
geolocation: China
#permalink: /<page-title>.html Use this section to set a custom URL for your page. The value set in this setting will be added to the base URL. For example if you set "/mycustomurl.html", your URL will be "https://microsoft.github.io/techcasestudies/mycustomurl.html"
---


**Solution overview**  

Consumers bear mixed moods nowadays towards the Smart Home products. On one hand they are excited about the experience some products bring them. On the other hand, they are also overwhelmed by the complexity of different devices from different vendors, with different apps/interfaces. 

An ambitious developer in China, Perspicace, plans to bring unprecedented Smart Home experience and aims to simplify user's life by providing a single voice activated interface to all their Smart Home devices. Just like the Jarvis to Tony Stark, a virtual house manager can see you, listen and talk to you. She can also understand your emotion, intents and provide assistance in any room you want in your house.     

Perspicace's intelligent house manager solution(a.k.a. SHD) consists of some hardware devices and backend services. The major subsystems and their functionalities are:
- Wall dock. Wall dock is a connected all-in-one embedded device with camera, microphone array and speaker. It also integrates infrared emitter to control those traditional home appliance such as TV and air conditioner. As the main interactive point for the user to the house manager system, every room or major activity areas in the house needs such a wall dock be installed. 
- Kitchen advisor. Kitchen advisor is an embedded device with camera and micro-projector. It captures and recognizes the ingredients, shows nutrition facts and suggests popular recipes according to what's recognized.  


**Key technologies used**  

- [Face API](https://azure.microsoft.com/en-us/services/cognitive-services/face/)
- [Emotion API](https://azure.microsoft.com/en-us/services/cognitive-services/emotion/)
- [Language Understanding Intelligent Service(LUIS)](https://www.luis.ai/home/index)
- [Custom Vision Service](https://azure.microsoft.com/en-us/services/cognitive-services/custom-vision-service/)
- [Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/)

**Core team**   

The team was comprised of members from Perspicace and Microsoft DX China:
- Ken Yip, General Manager, Perspicace
- Phil Fei, Vice General Manager, Perspicace
- Lucas Lu, AI Engineer, Perspicace
- Warren Zhou, Sr. Technical Evangelist, Microsoft 
- David Yan, Technical Evangelist, Microsoft
- Yingguang Mei, Technical Evangelist, Microsoft

*The team on a Cognitive Services Hackfest in China*

![Hackfest]({{ site.baseurl }}/images/Perspicace/Hackfest.jpg)


## Customer profile ##

[Perspicace Intelligence Technology](http://www.perspicace-china.com/) is a subsidiary owned by HuaYanFangMeng (NEEQ:831496), one of the top 3 real-estate sellers in Shanghai and top 100 in China. Perspicace makes significant investments in artificial intelligence and tries to bring brand new smart life experience to your whole house and to every aspect of your life.  

Perspicace's product SHD is an intelligent house manager system consists a bunch of hardware devices as well as backend services. These devices represent a virtual female house manager who is ubiquitous in the house and able to communicate with the family members and assistant them in their daily life.

 
## Problem statement ##

Perspicace believes the effective management of a smart home requires the ability to have a visual and emotional understanding of the environment. With this in mind, Perspicace's intelligent house manager required a way to understand inhabitants' presence and emotions through vision or voice, and recognize common items around the house such as food ingredients in the kitchen.  

The challenges Perspicace is facing are enormous that Perspicace would never compromise the sensing and understanding capabilities in its solution while the R&D team need to implement those artificial intelligence features all by themsleves.  

>"SHD is a very ambitious plan, as we want to create a real Jarvis "lives" at home. To achieve that goal, we need give our AI ability to look, to hear, to speak, to smell, and a brain to think. It is a real challenge that we set the fault-tolerance of the understanding lower and lower for better user experiences." — Ken Yip, General Manager, Perspicace

 
## Solution and steps ##

**Architecture diagram**

![Architecture]({{ site.baseurl }}/images/Perspicace/Architecture.png)

The diagram above shows the architecture of this house manager system:

- As the virtual intelligent house manager should be present at every activity area in the whole house, a bunch of physical devices (wall dock and kitchen advisor) need be installed in these areas. There are no master/slaves among these devices. Every device is equal and can be the contact point to this house manager. There is an awakening word "Xiaowei, Xiaowei!" to activate a wall dock from standby status. If multiple devices are qualified to response to the user at the same time, there's a conflict arbitration policy to select the best device to interact with the user. 
- Although all the sensing data (speech, face and emotion) is captured by the device, only the speech data would be processed locally by a 3rd party speech recognition and synthesis solution. Other data would be passed to the backend service. And the cognitive services are invoked in Node.js code from the service rather than the devices to simplify the hardware requirement. The service runs on some Linux virtual machines deployed on Azure. 
- Azure Blob Storage is used to store the sample data for Face, Custom Vision and Customer Speech services, as well as the logs from the virtual machines.  

**Hardware design**

Wall dock is the primary physical device in this house manager system. The structure of a wall dock is as below.

![WallDockStructure]({{ site.baseurl }}/images/Perspicace/WallDockArch.png)

Basically the wall dock is an Android device. It runs a 3rd party speech recognition and synthesis solution locally, while captures and sends images and sensor data to backend service. It also presents a simple UI on the round display and responses to user's operations such as press and spin. The picture below shows the form factor of a wall dock. The number of wall docks needed in a house varies depending on the layout of the house.

![WallDockFormFactor]({{ site.baseurl }}/images/Perspicace/WallDockFormFactor.png) 

The kitchen advisor is not mandatory as those wall docks to the house manager system. But if one such device is installed in the kitchen, it provides better experience when preparing a meal. The picture below demos the typical scenario that the kitchen advisor recognizes some cucumber on the table, lists its nutrition facts and recommends popular cucumber recipes if needed.

![KitchenAdvisorScenario]({{ site.baseurl }}/images/Perspicace/KitchenAdvisorScenario.jpg)   

The kitchen advisor is a connected Android device with microphone array and speaker to perform voice interaction. It uses a camera to capture the objects on the table, and a mini laser projector to present visual contents. As shown below, the kitchen advisor needs be installed in the bottom of a cupboard right above the table.

![KitchenAdvisorFormFactor]({{ site.baseurl }}/images/Perspicace/KitchenAdvisorFormFactor.jpg)    

**Demo video**

The video demonstrates most of the current features of Perspicace's intelligent house manager solution via its wall dock:
- Controlling lights, curtains and home appliance;
- Querying weather;
- Checking traffic status and suggesting routes;
- Giving horoscope suggestions;
- Chatting;
- Scenario-based compound controlling: sleeping and leaving. 

<iframe src="https://youtu.be/EezPZ7ykfNY" width="960" height="540" allowFullScreen frameBorder="0"></iframe>


>"With Microsoft’s Cognitive Services, the AI ability of our product gets improved quickly. We once met bottlenecks in optimizing semantic understanding. After trying LUIS, we have huge improvement that it can understand conversations quickly and accurately. The Cognitive Services not only improve the intelligent experience of our products but also shorten our developing period." — Lucas Lu, AI Engineer, Perspicace


## Technical delivery ##

**Prerequisite steps**

The project team prepared the following necessary resource to begin the development with Cognitve Services:
- Obtain [Azure Subscription](https://azure.microsoft.com/en-us/free/)
- Obtain [Cognitive Services Keys](https://azure.microsoft.com/en-us/services/cognitive-services/), in this project, the keys for Face API, Emotion API and LUIS
- Create trial account for [Custom Vision Service](https://www.customvision.ai/)


**Language Understanding Intelligent Service(LUIS)**

An active wall dock converts the user's speech to text locally but does not try to understand it. Rather it passes the text to the service. The service invokes the LUIS then to analyze the intents and entities in user's speech. Let's take a look at how the LUIS app is in such a virtual house manager scenario.

![AllIntents]({{ site.baseurl }}/images/Perspicace/AllIntents.jpg)   

As shown above, there are 21 intents defined in the house manager solution. The 'ControlDevice' intent is so fundamental to such a house manager that it helps to control all those controllable in the house, such as lights, curtains and home appliance. Some intents are responsible for searching information, such as 'Encyclopedias', ‘Shares’ 'QueryWeather' and 'Transportation'. Some provide handy help, e.g. placing quick orders('Shopping'), booking flight or railway tickets('Booking') or even doing arithmetic calculation('Calculate') for the user. A few intents try to add humanity to this virtual house manager. She may chat('Chat'), tell stories and jokes('Stories') and know a little about horoscope('Horoscope'). The picture below shows some sample utterance in the intent 'Calculate'.

![IntentCalculate]({{ site.baseurl }}/images/Perspicace/IntentCalculate.jpg)  

Let's take the weather query as an example. The code below shows how to understand user's query text and generate the response. The GetLUISData function invokes the LUIS service with a query text. If the understanding result is successfully retuned, the GetLUISIntent function parses the JSON object and extracts the main intent and all the entities to a local member.

```typescript
    private GetLUISData(_AIAgentData: IAIAgentData, callback: (LUISData: ILUISRes) => void): void {
        var Luisstime = new Date().getTime();
        var req: http.ClientRequest = https.get("some LUIS endpoint" + encodeURI(_AIAgentData.query), (res: http.ClientResponse) => {
            res.setEncoding('utf-8');
            var resdata = "";
            res.on('data', function (data) {
                resdata += data;
            });
            res.on('end', () => {
                Luisstime = Luisstime - new Date().getTime();
                _AIAgentData.logTime.push({ "Luisstime": Luisstime.toString(), 'luisres': JSON.parse(resdata) });
                callback(this.GetLUISIntent(resdata));
            });
        });
        req.on('error', (e) => {
            console.log("Agent error " + e.message);
        });
    }

    private GetLUISIntent(LUISJosn: string): ILUISRes {
        let LUISObject: IMLUISRes = JSON.parse(LUISJosn);
        let MainIntent: ILUISRes = new LUISRes();
        MainIntent.intent.MainIntent = LUISObject.topScoringIntent.intent;
        MainIntent.intent.score = LUISObject.topScoringIntent.score;
        if (null != LUISObject.entities) {
            for (let index in LUISObject.entities) {
                LUISObject.entities[index].isNew = 0;
                if (MainIntent.entities.hasOwnProperty(LUISObject.entities[index]["type"])) {
                    MainIntent.entities[LUISObject.entities[index]["type"]].push(LUISObject.entities[index]);
                }
                else {
                    MainIntent.entities[LUISObject.entities[index]["type"]] = [LUISObject.entities[index]];
                }
            }
        }
        if (MainIntent.entities.hasOwnProperty("builtin.number")) {
            for (let i in MainIntent.entities["builtin.number"]) {
                MainIntent.entities["builtin.number"][i]["resolution"] = { number: AIAgent.ParserNumber(MainIntent.entities["builtin.number"][i]["entity"]) }
            }
        }
        return this.IntentHanlder(MainIntent);
    }
```

The function contextHandler is responsible for updating the context. If there is a previous intent not long ago, the current intent needs to combine those previous entities and forms an updated context. 
```typescript
    private contextHandler(_AIAgentData: AIAgentData, _LUISRes: ILUISRes, callback: (LUISRes: ILUISRes) => void) {
        let redis2 = new redisHelper.Redis(enumclass.RedisCollection.UserIntents);
        redis2.GetItemFromHash(_AIAgentData.ID, _LUISRes.intent.MainIntent, (err, res) => {
            if (err) {
                console.error("上下文处理" + res);
                callback(_LUISRes)
            }
            else {
                if (res) {
                    let preIntent = JSON.parse(res) as INTENT.Iintent;
                    if (Date.now() - preIntent.creatTime < 30000) {
                        for (let key in preIntent.LUISRes.entities) {
                            if (!_LUISRes.entities.hasOwnProperty(key)) {
                                _LUISRes.entities[key] = preIntent.LUISRes.entities[key]
                            }
                        }
                    }
                    for (let key in _LUISRes.entities) {
                        for (let i = 0; i < (_LUISRes.entities[key] as Ientity[]).length; i++)
                            (_LUISRes.entities[key] as Ientity)[i].isNew++;
                    }
                    callback(_LUISRes);
                }
                else {
                    callback(_LUISRes);
                }
            }
        });
    }
```

After the context is updated, the PublishIntent function would broadcast the intent and entities to a series of task services which processes those 21 intents respectively. The relate task service would do the weather search and generate the response text, while the other task services just ignore the broadcast.
```typescript
    //接到的意图对象后做对应处理
    private OnGetIntentEnd(_AIAgentData, LUISData) {
        this.GetBZLDBpediaData(_AIAgentData, LUISData, (LUISRes: ILUISRes) => {
            this.noneIntentHandler(_AIAgentData, LUISRes, (_LUISRes) => {
                this.contextHandler(_AIAgentData, LUISRes, (_LUISRes) => {
                    action.PublishIntent(_AIAgentData, _LUISRes, (_ActionRes: action.IReply) => {
                        this.OnIntentCompleted(_ActionRes, _AIAgentData, _LUISRes);
                    });
                });
            });
        })
    }

    public OnIntentCompleted(SpeechResObject: action.IReply, _AIAgentData: IAIAgentData, _LUISRes: ILUISRes) {
        // SpeechResObject.speechID<0 代表错误
        if (SpeechResObject.speechID < 0) {
            return;
        }
        // 机器人请求的实体存入数据库
        //console.log("SpeechResObject.IsOver" + SpeechResObject.IsOver);
        if (SpeechResObject.IsOver) {
            let redis = new redisHelper.Redis(enumclass.RedisCollection.UserIntents);
            redis.DeleteItemFromHash(_AIAgentData.ID, _LUISRes.intent.MainIntent, (err, res) => { });
        } else {
            if ("None" != _LUISRes.intent.MainIntent) {
                let intent: INTENT.Iintent = new INTENT.intent(_LUISRes, SpeechResObject.RequestEntities);
                let redis = new redisHelper.Redis(enumclass.RedisCollection.UserIntents);
                redis.SetItemToHash(_AIAgentData.ID, _LUISRes.intent.MainIntent, JSON.stringify(intent), (err, res) => { });
            }
        }
        let mysqlstime = new Date().getTime();
        mysqlstime = mysqlstime - new Date().getTime();
        _AIAgentData.logTime.push({ "mysqlstime": mysqlstime.toString() });
        let testText: string = '{Text}';
        if (SpeechResObject.speechID == 5003) {
            //let index = Math.ceil(Math.random() * noneRes.length - 1)
            //testText = noneRes[index];
            testText = _AIAgentData.query;
        }
        if (null != SpeechResObject.SpeechPas) {
            for (var key in SpeechResObject.SpeechPas) {
                testText = testText.replace(`{${SpeechResObject.SpeechPas[key].name}}`, SpeechResObject.SpeechPas[key].content[0]);
            }
        }
        if (SpeechResObject.speechID == 2003) {
            this.AddSpeechToRedis(testText, 1, { intent: SpeechResObject.intentName, Entity: SpeechResObject.SpeechPas }, _AIAgentData)
        }
        else if (SpeechResObject.speechID == 3003) {
            this.AddSpeechToRedis(testText, 2, { intent: SpeechResObject.intentName, Entity: SpeechResObject.SpeechPas }, _AIAgentData)
        }
        else {
            this.AddSpeechToRedis(testText, 0, { intent: SpeechResObject.intentName, Entity: SpeechResObject.SpeechPas }, _AIAgentData)
        }

    }
```
The function OnIntentCompleted above would store the intent and entities to a log database, and call the AddSpeechToRedis to return the response text to a wall dock to do the text to speech conversion. 

**Face API**

While LUIS helps the virtual house manager know what the meaning a family member is talking, knowing who is talking enables more interesting features of the house manager system. Different communication patterns make the user feel respected and differentiated. Personalized preferences and scenario settings bring the users convenience. Multiple authorization levels in placing orders makes the system more secure.

The Face API is a popular and easy-to-use service when identifying persons. As shown in the below table, we create a face model for 2 persons with 30 face samples each. The recall and precision of the identification is quite promising after 50 to 60 tries.

![FaceTests]({{ site.baseurl }}/images/Perspicace/FaceTests.jpg)    

The code below shows how to create a person(PersonProxy::createPerson) and how to add a face for certain person(PersonProxy::addPersonFace).
```typescript
export interface IPersonData {
    personId: string;
    name: string;
    userData: string;
    persistedFaceIds: string[]
}

export interface IPersonsResponse {
    err: string;
    persons: IPersonData[];
}

export class PersonProxy
{
    private MicHeader =
    {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": "<Your Key>",
    }
    private MicHost = "api.cognitive.azure.cn"

    public async createPerson(_groupID: string, _person: IPersonData): Promise<IPersonResponse>
    {
        console.log("createPerson" + JSON.stringify(_person));
        let option: httpMgr.IhttpOption = new httpMgr.httpOption(
            this.MicHost,
            443,
            `/face/v1.0/persongroups/${_groupID}/persons`,
            httpMgr.httpMethod.POST,
            JSON.stringify({ name: _person.name, userData: _person.userData }),
            this.MicHeader,
        );
        let res: httpMgr.IhttpResponse = null;
        try {
            console.log("-2");
            res = await httpMgr.httpsRequst(option);
        }
        catch (e) {
            return { err: e, person: null };
        }
        if (2 == Math.floor(res.sCode / 100)) {
            console.log("createPerson" + res.res);
            try {
                let person: IPersonData = JSON.parse(res.res);
                return { err: null, person: new Person(person.personId, _person.name, _person.userData) };
            }
            catch(e){
                return { err: res.res, person: null };
            }
        }
        else {
            return { err: res.res, person: null };
        }
    }

    public async  addPersonFace(_groupID: string, _person: IPersonData, url: string): Promise<IPersonResponse> {
        let option: httpMgr.IhttpOption = new httpMgr.httpOption(
            this.MicHost,
            443,
            `/face/v1.0/persongroups/${_groupID}/persons/${_person.personId}/persistedFaces`,
            httpMgr.httpMethod.POST,
            JSON.stringify({ "url": url}),
            this.MicHeader,
        );
        let res: httpMgr.IhttpResponse = await httpMgr.httpsRequst(option);
        if (2 == Math.floor(res.sCode / 100)) {
            console.log("addPersonFace" + res.res);
            let face:any = JSON.parse(res.res)
            _person.persistedFaceIds.push(face.persistedFaceId)
            return { err: null, person: _person };
        }
        else {
            return { err: res.res, person: null };
        }
    }
}
```

Face Group is used to group related persons, e.g. those are authorized to place food orders. The code below exposes the class GroupProxy. Its functions createGroup and trainGroup do the things just as they are named. 
```typescript
class GroupsProxy implements IGroupsProxy
{
    private MicHeader =
    {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": "<Your Key>",
    }
    private MicHost = "api.cognitive.azure.cn"

    async createGroup(_group: IGroupData): Promise<IGroupResponse>{
        let option: httpMgr.IhttpOption = new httpMgr.httpOption(
            this.MicHost,
            443,
            `/face/v1.0/persongroups/${_group.personGroupId}`,
            httpMgr.httpMethod.PUT,
            JSON.stringify({ name: _group.name, userData: _group.userData }),
            this.MicHeader,
        );
        let res: httpMgr.IhttpResponse = await httpMgr.httpsRequst(option);
        if (2 == Math.floor(res.sCode / 100)) {
            return { err: null, group: new GroupData(_group.personGroupId, _group.name, _group.userData) };
        }
        else {
            return { err: res.res, group: null };
        }
    }

    async trainGroup(_groupID: string): Promise<IGroupResponse> {
        let option: httpMgr.IhttpOption = new httpMgr.httpOption(
            this.MicHost,
            443,
            `/face/v1.0/persongroups/${_groupID}/train`,
            httpMgr.httpMethod.POST,
            null,
            this.MicHeader,
        );
        let res: httpMgr.IhttpResponse = await httpMgr.httpsRequst(option);
        console.log("trianGroup" + JSON.stringify(res));
        if (2 == Math.floor(res.sCode / 100)) {
            return { err: null, group: null };
        }
        else {
            return { err: res.res, group: null };
        }
    }
}
```

The code below is so straightforward that it detects and identify faces.
```typescript
class face implements IFace
{
    private faceId_: string = null
    private faceRectangle_: IfaceRectangle = null

    public get faceId()
    {
        return this.faceId_;
    } 

    public get faceRectangle() {
        return this.faceRectangle_;
    } 
}

class faceProxy
{
    private MicHeader =
    {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": "<Your Key>",
    }

    private MicHost = "api.cognitive.azure.cn"
    public async detectFace(url: string): Promise<IFacesResponse> {
        let option: httpMgr.IhttpOption = new httpMgr.httpOption(
            this.MicHost,
            443,
            `/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false`,
            httpMgr.httpMethod.POST,
            JSON.stringify({ "url": url}),
            this.MicHeader,
        );
        let res: httpMgr.IhttpResponse = await httpMgr.httpsRequst(option);
        if (2 == Math.floor(res.sCode / 100)) {
            console.log("detectFace" + res.res);
            return { err: null, faces: JSON.parse(res.res) };
        }
        else {
            return { err: res.res, faces: null };
        }
    }


    public async identifyFace(groupID: string, faceids: string[]): Promise<IIdentifyFaces>
    {
        let option: httpMgr.IhttpOption = new httpMgr.httpOption(
            this.MicHost,
            443,
            `/face/v1.0/identify`,
            httpMgr.httpMethod.POST,
            JSON.stringify({
                "personGroupId": groupID,
                "faceIds": faceids,
                "maxNumOfCandidatesReturned": 1,
                "confidenceThreshold": 0.6
            }),
            this.MicHeader,
        );
        let res: httpMgr.IhttpResponse = await httpMgr.httpsRequst(option);
        if (2 == Math.floor(res.sCode / 100)) {
            console.log("identifyFace" + res.res);
            return { err: null, identifyFaces: JSON.parse(res.res) };
        }
        else {
            return { err: res.res, identifyFaces: null };
        }
    }
}
```

Identifying family members follows such a process: When activated by a family member's voice, a wall dock begins the image capture periodically with its camera to detect a face. Because the user may not always be perfectly opposite to the camera and in the right distance, the wall dock would not stop the face detection until a big enough face rectangle is detected. Only then the face would be sent for identification. The previous steps might be repeated for several times to calculate the overall identification result, so that a single mistake can be avoided.

**Emotion API**

The Emotion API in Cognitive Services returns an emotion distribution of 8 major emotions on a face: Anger, Contempt, Disgust, Fear, Happiness, Neutral, Sadness and Surprise. The house manager would actively initiate a conversation with the user When he/she is recognized as happy or sad via an active wall dock's camera. Encouraging the user to share his/her happiness or trying to comfort the user bring more humanity to the virtual house manager.

The code sample below shows how to response differently when happiness or sadness is the dominant emotion on a family member's face.

```typescript
wx.wxMgrInitance.replyImage = (message, callback) => {
    com.httpPostRequest('some address', '/Imgrec/api/v1/detectAndidentify', 9292, "POST", { "Content-Type": "application/json", "Content-Length": 0 } as any, JSON.stringify({ "groupId": "dev1", "url": message.picurl }), (data) => {
        let faces: IFaceRes = JSON.parse(data);
        if (null== faces.err) {
            for (let i = 0; i < faces.identifyFaces.length;i++)
            {
                if (faces.identifyFaces[i]["candidates"][0]["confidence"] > 0.7) {
                    let personId: string = faces.identifyFaces[i]["candidates"][0]["personId"]
                    com.httpGetRequest('some address',
                        '/Imgrec/api/v1/groups/dev1/persons/' + personId,
                        9292,
                        { "Content-Length": 0 },
                        (data1) => {
                            com.httpPostRequest('some address', '/Imgrec/api/v1/recognize', 9292, "POST", { "Content-Type": "application/json", "Content-Length": 0 } as any, JSON.stringify({ "url": message.picurl }), (data2) => {
                                    let person = JSON.parse(data1);
                                    let emotion = JSON.parse(data2);

                                    if ("happiness" == emotion["recognize"][0]["topEmotion"]["emotion"]) {
                                        let res = { ToUserName: message.fromusername, FromUserName: message.tousername, CreateTime: Date.now(), MsgType: "text", 'Content': person["person"]["name"] + "今天有什么开心的事情吗" };
                                        callback(res);
                                    }
                                    else if ("sadness" == emotion["recognize"][0]["topEmotion"]["emotion"])
                                    {
                                        let res = { ToUserName: message.fromusername, FromUserName: message.tousername, CreateTime: Date.now(), MsgType: "text", 'Content': person["person"]["name"] + "心情不好嘛，我会一直陪着你的" };
                                        callback(res);
                                    }
                                    else {
                                        let res = { ToUserName: message.fromusername, FromUserName: message.tousername, CreateTime: Date.now(), MsgType: "text", 'Content': person["person"]["name"] + "你好" };
                                        callback(res);
                                    }
                                });
                        });
                }
                else
                {
                    let res = { ToUserName: message.fromusername, FromUserName: message.tousername, CreateTime: Date.now(), MsgType: "text", 'Content': data };
                    callback(res);
                }

            }
        }
        else
        {
            let res = { ToUserName: message.fromusername, FromUserName: message.tousername, CreateTime: Date.now(), MsgType: "text", 'Content': data };
            callback(res);
        }

    });
}
``` 

**Custom Vision Service**

One key feature for the Kitchen Advisor device is that it can recognize those common ingredients, and give recipe recommendations. To recognize visual objects, the [Computer Vision API](https://azure.microsoft.com/en-us/services/cognitive-services/computer-vision/) might be the first to come in mind because it could tag the objects on an image and give a text description. But the limitation is that you will not always get the desired granularity of the concept. For example, Computer Vision API may return you "meat" but you need to know what it exactly is, pork, beef or lamb.  

We believe the more appropriate choice in this scenario is the Custom Vision Service, where you may upload your own image samples and train your own image classifier for a certain use case. With enough tags and training images, the classifier is theoretically able to tag all the things correctly among those ingredients it is taught. 

![CustomVisionSamples]({{ site.baseurl }}/images/Perspicace/CustomVisionSamples.jpg)  

The screenshot above shows the Custom Vision Service portal and a simple testing project. With 5 tags and less than 100 training images in total, the classifier shows quite satisfying overall precision and recall results, as below. The result for the lettuce is a bit lower than average, considering the least training samples. Using more training samples is an effective way to improve the model.

![CustomVisionTests]({{ site.baseurl }}/images/Perspicace/CustomVisionTests.jpg)  

**Azure Blob Storage**

Azure Blob Storage is designed to store multimedia data such as speech audio and training images during the development and large-scale beta testing stages. Some blob containers are used respectively, as shown in the below screenshot:
- ai-test-test, temporary testing data
- ai-test-sample, image samples for face identification and emotion analysis
- roo2-audio, speech samples
- roo2-audio-info, the recognized speech texts and logs
- roo2-log, the virtual machines' logs which run the backend services

![BlobUsed]({{ site.baseurl }}/images/Perspicace/BlobUsed.jpg)   

## Conclusion ##

Powering by Microsoft's Cognitive Services, the Shanghai-based startup Perspicace is implementing its bold ideas steadily in Smart Home. 

Perspicace aims to enable a whole set of sensing, understanding and decision-making capabilities in its virtual house manager solution. Leveraging the comprehensive artificial intelligence services offered in Cognitive Services, Perspicace manages to implement the face, emotion, voice and objects understanding capabilities in its solution with much less cost and time than expected. Moreover, richer choices in the Cognitive Services and Lab would also help Perspicace try new ideas and enrich the intelligent features in their solution.

Perspicace's implementation uses a bunch of custom devices to collect sensor data, control appliance and do the voice recognition/synthesis locally. The devices pass the images and speech texts to some backend services running on Linux virtual machines on Azure. One 'Understanding' service invokes those REST-ful Cognitive Services APIs to understand natural languages as well as faces, emotions and objects. The understanding results are used by another 'Decision-making' service to generate responses to the users. The responses then lead to some control activities or voice replies from the devices.

>"Microsoft Cognitive Services do an amazing job on Natural Language Processing and Vision-related artificial intelligence. We have more confidence to make our SHD more like a human being. The whole support from DX team was so important that it not only helps us break our developing limits to offer a full-function service to customers but also helps our development team grown up a lot." — Ken Yip, General Manager, Perspicace


**Future work**:

Besides the Face, Emotion, LUIS and Custom Vision services, a bunch of other artificial intelligence services are also on Perspicace's radar and to be evaluated in these use cases:
- [Speaker Recognition API](https://azure.microsoft.com/en-us/services/cognitive-services/speaker-recognition/)

Identifying family members relies on Face API at present. While it is straightforward, the process costs time to wait for a capture with the appropriate distance and angle. In some use cases there would not be a qualified face captured, e.g. sleeping on bed.

The Speaker Indentification now supports the Chinese Mandarin locale. With that a new identification mechanism might be Speaker + Face.

- [Custom Speech Service](https://azure.microsoft.com/en-us/services/cognitive-services/custom-speech-service/)

One challenge for the speech recognition solutions in China is that there are so many dialects of Mandarin. Some listen like just other languages. A speech recognition solution for standard Chinese Mandarin may work poorly in some regions. 

The Custom Speech Service supports custom acoustic model and language model for a language. It might be able to replace the built-in speech-to-text system in some dialects with better accuracy. Perspicace's house manager solution may have a variety of dialect versions to sell in target regions. 


## Additional resources ##

- [Github Repository for the related code](https://github.com/donnerz/Intelligenthouse manager)

- [Speaker Recognition API Reference](https://westus.dev.cognitive.microsoft.com/docs/services/563309b6778daf02acc0a508/operations/5645c068e597ed22ec38f42e)

