---
layout: post
title:  "Recruit Communications transform their asset management with Cognitive Service"
author: "Masayuki Ota"
author-link: "https://twitter.com/masota0517"
#author-image: "{{ site.baseurl }}/images/authors/photo.jpg"
date:   2017-02-14
categories: [Cognitive Services]
color: "blue"
image: "images/RcoAssetManagement/Architecture.png" #should be ~350px tall
excerpt: Recruit Communications uses 10M$/year for making advertisement asset like phots and movies. Because the amount of assets are huge, it is difficult for employees to find expected one and they will make similar assets by each projects. For reducing cost and easy access, we developed asset management system with Cognitive Service. When users upload assets, the system automaticaly tagging with Cognitive Service and store data in Cosmos DB. With this solution users can find their expected asset easily and it expect reducing next year cost.
language: [English]
verticals: [Media & Cable]
geolocation: [Japan]
---

Marketing company has huge amount of assets like product photos, promotion movies. Recurit Communications costs 10M$/year for making such kind of assets. It's actually huge costs and their exmployee has 2 problems. One problem is users save files in each project's file storage and can't find by others. Another one is hard to find expected asset from these big data. Recruit Communications want to solve this problem and started ***Creative Asset Management project***. In this project we tagged each data with Cognitive Service Computer Vision API and search tagged assets from web application. It makes easy access for users and may reduce costs in next year.

Technologies Used:
- [Cognitive Services Computer Vision API](https://docs.microsoft.com/en-us/azure/cognitive-services/computer-vision/home)
- [Azure Functions](https://docs.microsoft.com/en-us/azure/azure-functions/)
- [Azure Blob storage](https://docs.microsoft.com/en-us/azure/storage/storage-dotnet-how-to-use-blobs)
- [Azure Queue storage](https://docs.microsoft.com/en-us/azure/storage/storage-dotnet-how-to-use-queues)
- [Cosmos DB](https://docs.microsoft.com/en-us/azure/cosmos-db/) with Azure Functions and 
- [Azure Web Apps](https://docs.microsoft.com/en-us/azure/app-service-web/app-service-web-overview)

Core Team:
- Yoshiko Ida, Value design group, Recruit Communications
- Kojiro Morita: Senior Manager, accenture
- Takumi Kariwano: Consultant, avanade
- Yohei Takano: Account Executive, EPG, Microsoft Japan 
- Mitsuhiro Takagi: Solution Architect, EPG, Microsoft Japan
- [Masayuki Ota](https://twitter.com/masota0517): Technical Evangelist, DX, Microsoft Japan


## Customer profile ##
[Recruit Communications Co., Ltd.](https://www.rco.recruit.co.jp/) owns the functions of Web marketing, Media creation and advertisement, customer support, and other marketing relating businesses of [Recruit Holdings](http://www.recruit-rgf.com/), creating and designing all sorts of communication businesses. They are headquared in Tokyo, Japan.

 
## Problem statement ##
Recurit Communications costs 10M$/year for making advertisement assets like product photos and promotion movies. It's actually huge costs and their exmployee has 2 problems. 
1. Employees save their assets in each project's file storage and can't find by others.
2. It is hard for employees to find expected assets from these big data.
Because users can't find expected images by these problems, they make new assets in each project and it makes costs every year.

 
## Solution and steps ##
### Architecture
![Architecture](/images/RcoAssetManagement/Architecture.png)
We started ***Creative Asset Management project*** for making intelligent centralized asset management system. Our goal is users always upload assets to it and anyone can search and get assets. e.g. Users will search images by "sea" and find exptected images.
To achieve this goal, we need tagging images and saving these meta data in data store. For tagging each images, we used Computer Vision API and Azure Functions. When users upload images through application, Azure Functions will be kicked and start tagging with Computer Vision API. When tagging is completed, Azure Functions send tag information and file location as queue message to Azure Queue Storage. Second Azure Functions detect it with Queues trigger and save it to Document DB.

## Technical delivery ##
### Prerequisite steps
- Obtain [Azure Subscription](https://azure.microsoft.com/en-us/free/)
- Get Computer Vision API Key in Azure Portal. You can get it with [New]->[AI + Cognitive Services]->[Computer Vision API]
- Create Azure Cosmos DB with [this step](https://docs.microsoft.com/en-us/azure/cosmos-db/tutorial-develop-documentdb-dotnet).
- Create function in the Azuer portal with [this step](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-first-azure-function)
- Download & Install [Microsoft Azure Storage Explorer](http://storageexplorer.com/) and sign-in with your Azure Account.

### How to use
#### CallComputerVisionAPI
1. Go to Azure Functions window.
2. Create "BlobTrigger-CSharp" function.
3. Copy Functions\CallComputerVisionAPI\run.csx in this repo and paste it in Azure Functions window.
4. Find <Insert your key here> in run.csx and replace with your Computer Vision API key.
5. Go to [Integrate] menu in Azure Functions window.
6. In a [Outputs] menu, add [Azure Queue Storage].
7. With Azure Storage Explorer, create "samples-workitems" container.
8. With Azure Storage Explorer, create "outqueue" queue.

Then upload file to [samples-workitems] container. It will kick this function and you can see the log below in Azure Functions [Logs]window.
```
2017-05-19T00:14:18.268 Function started (Id=5035c525-b39d-4f94-99a1-74c8402329d1)
2017-05-19T00:14:18.268 Started process with untitled.png
2017-05-19T00:14:20.419 {"categories":[{"name":"building_","score":0.6015625},{"name":"outdoor_house","score":0.3515625}],"tags":[{"name":"grass","confidence":0.9999995231628418},{"name":"outdoor","confidence":0.99992108345031738},{"name":"house","confidence":0.99685388803482056},{"name":"sky","confidence":0.99532157182693481},{"name":"building","confidence":0.99436837434768677},{"name":"tree","confidence":0.98880356550216675},{"name":"lawn","confidence":0.788884699344635},{"name":"green","confidence":0.71250593662261963},{"name":"residential","confidence":0.70859086513519287},{"name":"grassy","confidence":0.46624681353569031}],"description":{"tags":["grass","outdoor","house","building","yard","lawn","home","front","green","residential","small","field","sitting","grassy","red","farm","brick","large","old","white","sheep","grazing","wooden","standing","garden","parked","hydrant","ball","clock","motorcycle","sign"],"captions":[{"text":"a large lawn in front of a house","confidence":0.96706087734170854}]},"requestId":"4066f03c-fdfa-4a5c-87c3-b20177c571cb","metadata":{"width":300,"height":200,"format":"Png"},"faces":[],"color":{"dominantColorForeground":"Green","dominantColorBackground":"Green","dominantColors":["Green"],"accentColor":"448215","isBWImg":false},"imageType":{"clipArtType":0,"lineDrawingType":0}}
2017-05-19T00:14:20.450 {"filename":"untitled.png","categories":[{"name":"building_","score":0.6015625},{"name":"outdoor_house","score":0.3515625}],"tags":[{"name":"grass","confidence":0.9999995},{"name":"outdoor","confidence":0.9999211},{"name":"house","confidence":0.9968539},{"name":"sky","confidence":0.9953216},{"name":"building","confidence":0.9943684},{"name":"tree","confidence":0.988803566},{"name":"lawn","confidence":0.7888847},{"name":"green","confidence":0.712505937},{"name":"residential","confidence":0.708590865},{"name":"grassy","confidence":0.4662468}],"description":{"tags":["grass","outdoor","house","building","yard","lawn","home","front","green","residential","small","field","sitting","grassy","red","farm","brick","large","old","white","sheep","grazing","wooden","standing","garden","parked","hydrant","ball","clock","motorcycle","sign"],"captions":[{"text":"a large lawn in front of a house","confidence":0.967060864}]},"requestId":"4066f03c-fdfa-4a5c-87c3-b20177c571cb","metadata":{"width":300,"height":200,"format":"Png"},"faces":[],"color":{"dominantColorForeground":"Green","dominantColorBackground":"Green","dominantColors":["Green"],"accentColor":"448215","isBWImg":false},"imageType":{"clipArtType":0,"lineDrawingType":0},"id":null}
2017-05-19T00:14:20.481 Function completed (Success, Id=5035c525-b39d-4f94-99a1-74c8402329d1, Duration=2216ms)
```

You can also see the message like below in the [outqueue] with Azure Storage Explorer.
```json
{
    "filename": "untitled.png",
    "categories": [
        {
            "name": "building_",
            "score": 0.6015625
        },
        {
            "name": "outdoor_house",
            "score": 0.3515625
        }
    ],
    "tags": [
        {
            "name": "grass",
            "confidence": 0.9999995
        },
        {
            "name": "outdoor",
            "confidence": 0.9999211
        },
        {
            "name": "house",
            "confidence": 0.9968539
        },
        {
            "name": "sky",
            "confidence": 0.9953216
        },
        {
            "name": "building",
            "confidence": 0.9943684
        },
        {
            "name": "tree",
            "confidence": 0.988803566
        },
        {
            "name": "lawn",
            "confidence": 0.7888847
        },
        {
            "name": "green",
            "confidence": 0.712505937
        },
        {
            "name": "residential",
            "confidence": 0.708590865
        },
        {
            "name": "grassy",
            "confidence": 0.4662468
        }
    ],
    "description": {
        "tags": [
            "grass",
            "outdoor",
            "house",
            "building",
            "yard",
            "lawn",
            "home",
            "front",
            "green",
            "residential",
            "small",
            "field",
            "sitting",
            "grassy",
            "red",
            "farm",
            "brick",
            "large",
            "old",
            "white",
            "sheep",
            "grazing",
            "wooden",
            "standing",
            "garden",
            "parked",
            "hydrant",
            "ball",
            "clock",
            "motorcycle",
            "sign"
        ],
        "captions": [
            {
                "text": "a large lawn in front of a house",
                "confidence": 0.967060864
            }
        ]
    },
    "requestId": "2f80b291-cada-4871-901a-95d0a6804830",
    "metadata": {
        "width": 300,
        "height": 200,
        "format": "Png"
    },
    "faces": [],
    "color": {
        "dominantColorForeground": "Green",
        "dominantColorBackground": "Green",
        "dominantColors": [
            "Green"
        ],
        "accentColor": "448215",
        "isBWImg": false
    },
    "imageType": {
        "clipArtType": 0,
        "lineDrawingType": 0
    },
    "id": null
}
```

#### CallComputerVisionAPI
1. Go to Azure Functions window.
2. Create "QueueTriggerCSharp" function. Please change [Queue name] from default one to "outqueue".
3. Copy Functions\SaveDataToDocumentDB\run.csx in this repo and paste it in Azure Functions window.
4. Go to [Integrate] menu in Azure Functions window.
5. In a [Outputs] menu, add [Azure DocumentDB Document].
6. Input [Database name] and [Collection Name]. It should be same name you created in Cosmos DB window.
7. You need [DocumentDB account connection], so click [new] to create it.

Then upload file again to the "samples-workitems" container. It will kick 1st functions and send message to "outqueue" queue. This queue message will let 2nd function start and show logs like below in the [Logs]window.
```
2017-05-19T00:37:07.418 Function started (Id=a75c48e9-4d5b-4ea5-b9c2-d8bb5436f829)
2017-05-19T00:37:07.418 C# Queue trigger function processed: {"filename":"untitled.png","categories":[{"name":"building_","score":0.6015625},{"name":"outdoor_house","score":0.3515625}],"tags":[{"name":"grass","confidence":0.9999995},{"name":"outdoor","confidence":0.9999211},{"name":"house","confidence":0.9968539},{"name":"sky","confidence":0.9953216},{"name":"building","confidence":0.9943684},{"name":"tree","confidence":0.988803566},{"name":"lawn","confidence":0.7888847},{"name":"green","confidence":0.712505937},{"name":"residential","confidence":0.708590865},{"name":"grassy","confidence":0.4662468}],"description":{"tags":["grass","outdoor","house","building","yard","lawn","home","front","green","residential","small","field","sitting","grassy","red","farm","brick","large","old","white","sheep","grazing","wooden","standing","garden","parked","hydrant","ball","clock","motorcycle","sign"],"captions":[{"text":"a large lawn in front of a house","confidence":0.967060864}]},"requestId":"5e2bdc65-b058-464f-ae57-972e2dcbd409","metadata":{"width":300,"height":200,"format":"Png"},"faces":[],"color":{"dominantColorForeground":"Green","dominantColorBackground":"Green","dominantColors":["Green"],"accentColor":"448215","isBWImg":false},"imageType":{"clipArtType":0,"lineDrawingType":0},"id":null}
2017-05-19T00:37:07.418 Function completed (Success, Id=a75c48e9-4d5b-4ea5-b9c2-d8bb5436f829, Duration=1ms)
```

Go to Cosmos DB window and you can see stored data with [Document Explorer] like below.
![DocumentExplorer](/Images/RcoAssetManagement/DocumentExplorer.PNG)

## Conclusion ##
Marketing company makes a lot of amout of assets with huge cost. Users save assets in each project's file storage and can't find by others. In addition to it, it's hard to find expected asset from huge amount of data. Recruit Communications want to solve this problem and started ***Creative Asset Management project***. Computer Vision API tags each images and users can search and find tagged assets from web application. It makes easy access for users and will reduce costs in next year.


## Additional resources ##
- If you want to make intelligent app, you can use [Video Indexer](https://azure.microsoft.com/en-us/services/cognitive-services/video-indexer/)
- You can downloads sample codes from [this repo](https://github.com/NT-D/TagAssets).