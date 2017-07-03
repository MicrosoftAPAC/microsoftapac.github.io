---
layout: post
title:  "Building a Voice-controlled Intelligent Resident Monitoring Solution for Older Adults with ConnectedLife"
author: "Alyssa Ong"
author-link: "https://twitter.com/alyssaong1337"
#author-image: "{{ site.baseurl }}/images/authors/photo.jpg"
date:   2017-05-16
categories: [Cognitive Services, Azure Virtual Machine]
color: "blue"
image: "images/connectedlife/SIParchi.PNG" #should be ~350px tall
excerpt: Connecting a VoIP capable device via SIP to a voice-controlled intelligent agent using Microsoft Cognitive Services.
language: [English]
verticals: [Healthcare]
geolocation: [Singapore]
---

[ConnectedLife](https://connectedlife.io) partners with Microsoft to integrate a voice-controlled intelligent agent into a resident monitoring system, with the purpose of helping older adults stay connected to the real world. The resident monitoring system communicates with the voice-controlled agent through VoIP, and through this the user is able to access information like the weather and news headlines. The solution uses Microsoft Cognitive Services such as the Bing Speech API and the Lanugage Understanding Intelligent Service to translate the user's voice input into text to be analysed and understanding natural language to predict the user's intent based on their voice input. 
 
**Key Technologies Used:**
- [Bing Speech API](https://azure.microsoft.com/en-us/services/cognitive-services/speech/)
- [Language Understanding Intelligent Service (LUIS) API](https://www.luis.ai/)
- [Azure Virtual Machine (Both Ubuntu and Windows)](https://azure.microsoft.com/en-us/services/virtual-machines/)
 
**Core Team:**
- Daryl Arnold - Chairman, ConnectedLife
- Naing Maw - Project Director, ConnectedLife
- Junichi Ninomiya - Software Engineer, Fujitsu
- [Alyssa Ong](https://twitter.com/alyssaong1337) - Technical Evangelist, Microsoft APAC

## Customer profile ##

[ConnectedLife Pte Ltd](http://connectedlife.io/) is a Wellness and Healthcare Technology company based in Singapore that has developed a proprietary technology stack that actively engages with a full range of sensors including wearables, cloud systems, data analytics, algorithms and predictive modelling platforms. They specialize in creating home care solutions to address the needs of the global aging population. Their smart home care solution consists of a wide array of customized sensors and devices that analyzes a user's daily living patterns, sends intelligent alerts to their family and approved caregivers, and gives the user a comprehensive picture of their daily overall health and wellness through a mobile application and dashboard. 
 
## Problem statement ##

Older adults can often feel isolated from the real world due to a number of reasons, such as lack of human company or lack of mobility. A way to stay connected is via the internet, however the problem with using a laptop or cellphone to access these services is that older adults often misplace these around the house. Moreover, older adults tend to be less tech savvy and more averse to using cellphones or laptops due to reasons such as lack of user friendliness and fear of technology. They have no straightforward way of tapping into the power of the internet to get information and perform tasks. 

ConnectedLife saw an opportunity to address this problem through Fujitsu's powerful and comprehensive Resident Monitoring Solution (RMS). They have already integrated their sleep wellness and bedroom safety module into the RMS to enhance its intelligent independent living service. However, they had not yet tapped into the Real Time Protocol (RTP) client running on the Fujitsu device. Currently, the purpose of the RTP client on the Fujitsu RMS is to make VoIP calls to a loved one, but ConnectedLife saw an opportunity to add voice-controlled intelligent capabilities to the RMS through the RTP client of the RMS to help residents stay connected to the real world. This would provide a very user friendly way for the resident to access information, and would be a huge value proposition add to ConnectedLife's home care solution.

The scope of this project is to use the RTP capability of the RMS to enable the user to talk to a bot that can deliver them information. In this way, the user will have a constant place where they can give natural voice commands to get information or perform actions. The scenario they envisioned was one where the resident can tap into services on the internet from the RMS, such as having weather forecasts and news headlines read to them, or being able to issue a command to call their loved ones. For instance, the resident can push the call button on the RMS, and say commands like "Call dad", "What's the weather tomorrow?" or "Read me the news headlines" in natural language. 

Note that none of the scenarios requested by ConnectedLife contain the transmission of any personally identifiable information (PII).

## Solution, steps and delivery ##

**Call orchestration with the RMS and mobile phone**

The RMS device uses the Session Initiation Protocol (SIP) to establish and manage a call with another device. Once this call is established, it uses RTP to exchange voice packets. Below is an architecture diagram to illustrate the orchestration of the voice exchange between clients and server. 

![SIParchi]({{ site.baseurl }}/images/connectedlife/SIParchi.PNG)

ConnectedLife plans to integrate SIP calling in their mobile app in future, so that the RMS will be able to call a user and vice versa without the user having to download an additional 3rd party app. 

**Prerequisites**

- **[Obtain an Azure Subscription](https://azure.com)**
- **Set up an SIP server.** The Fujitsu engineers recommended using [Brekeke](http://wiki.brekeke.com/wiki/Brekeke-SIP-Server-v3-Quickstart) in a Windows VM. Instructions to set up a Windows VM are [here](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/quick-create-portal) Note that there also exist open source SIP server solutions that you can explore, such as [OverSIP](http://oversip.net/).
- **Set up an SIP client, which will be your bot.** We used the [Python wrapper for pjsip](https://trac.pjsip.org/repos/wiki/Python_SIP_Tutorial), which is an open source library. The scripts were run in an Ubuntu VM, setup instructions [here](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/quick-create-portal).
- **Obtain Cognitive Services keys.** Keys can be obtained directly from the Azure Portal or Cognitive Services website, instructions [here](http://www.icomedias.com/support/microsoft-cognitive-services-key/). You will need to generate Bing Speech and Language Understanding Intelligent Service (LUIS) API keys. 

Note that for the purposes of this project, we used Windows Server version xx and Ubuntu version xx with Python 2.7.12.

A more detailed architecture of our implementation approach is as follows:
![Detailedarchi]({{ site.baseurl }}/images/connectedlife/detailedarchi.png)

### 1. Setting up the SIP server

After installing Brekeke in the Windows VM, we must make some configuration changes. In the Brekeke admin portal, the interface IP address shown will be your local IP address. 

![daship]({{ site.baseurl }}/images/connectedlife/brekekedash.PNG)

We need to add the public facing IP address by going to the 'Configuration' page, then filling in the "Interface address 1" field with the public facing IP address of the VM. We also need to go into the Azure Portal and configure the security rules for the VM as well to allow traffic from the IP address of the SIP clients. 

![ipconfig]({{ site.baseurl }}/images/connectedlife/ipconfig.jpg)

Next, we need to add user accounts so that the RMS and our bot can identify themselves with the SIP server for communication. The usernames should all be in numbers, but the password can be anything. To test that the server is working, we found it useful to install an SIP client app (e.g. [CSipSimple]()) on 2 different phones. In each phone, we put in the user credentials and IP address of the VM, and if calling works through the app, the server is functional. 

### 2. Setting up the SIP client

There are 2 steps to this: 1. Building pjsip libraries (this has to be done in a unix based environment) and 2. Running the python modules for the SIP client. 

**Building pjsip libraries**
To build the pjsip libraries, ssh into the Ubuntu VM and run the following to download and build both pjsip and its python modules (thanks to [this](http://stackoverflow.com/a/30768314) helpful stack overflow answer):

```bash
wget "http://www.pjsip.org/release/2.6/pjproject-2.6.tar.bz2"
sudo apt-get install build-essential python-dev
tar -xf pjproject-2.6.tar.bz2 && cd pjproject-2.6/
export CFLAGS="$CFLAGS -fPIC"
./configure && make dep && make
cd pjsip-apps/src/python/
sudo python setup.py install
```

**Running SIP client python modules**

The complete source code for all the python modules is in the src folder of [this Github Repository](https://github.com/alyssaong1/VoIPBot). We will be continually referencing the python modules in this writeup.

We will require the following parts for the bot SIP client:
- PJSIP call module - runclient.py
- File converter module (Will explain later) - convertwav.py
- Silence removal module - clipaudiomodule.py
- Speech to text (STT) module - runspeechrec.py
- Language Understanding (LUIS) module - luismodule.py
- Text to speech (TTS) module - bingttsmodule.py

To do a quick run, copy the files from the src folder in the Github repo into your VM filesystem (using `scp`). Be sure to enter your API keys and SIP credentials first. Then run:

```bash
python runclient.py
```

After this, the bot is registered with the SIP server and is ready to take calls. Try using an SIP client app to ring the bot. Remember it only listens for the first 10 seconds, so speak the command as soon as the call connects.

**[Video demo](https://1drv.ms/v/s!AiedmuKgkivNgVq9uZAFujfeGWg3)**

### Detailed explanation of SIP client modules 

#### PJSIP call module

In here, we start by registering the SIP client with the server. If a call is received, the callback is triggered. The client then waits for 3 seconds before answering the call and starting the wav recorder. The wav recorder listens for 10 seconds before closing the recorder. This is because the rest API for Bing STT takes 10 seconds max. 

Method to listen then respond:
```python
def listen_and_respond():
    recorderid = lib.create_recorder("YOUR_FOLDER_STRUCTURE/input.wav")
    recorderslot = lib.recorder_get_slot(recorderid)

    # Connect sound device to wav record file
    lib.conf_connect(0, recorderslot)
    lib.conf_connect(callslot, recorderslot)

    # Listen for 8 seconds, naive implementation
    time.sleep(8)

    lib.recorder_destroy(recorderid)
    mybot = bot.BotHelper()
    mybot.generate_response()

    # Play wav file back to user
    playerid = lib.create_player('botresponse.wav',loop=False)
    playerslot = lib.player_get_slot(playerid)
    # Connect the audio player to the call
    lib.conf_connect(playerslot,callslot)

    # Wait for the thing to be read for a few seconds then hang up
    time.sleep(13)
    current_call.hangup()
```


#### File converter module

Although pjsip produces a wav file, the properties of the wav file aren't actually properly constructed. Hence, we will need to reconstruct it with the correct properties (PCM, sampling rate of 16000 with wav file type). The soundfile python library was used to stream in the raw audio and reconstruct the wav file. 

Method for reconstruction is as follows:

```python
import soundfile as sf

myfile = sf.SoundFile('input.wav',mode='r',format='RAW',samplerate=16000,channels=1,subtype='PCM_16')

# Reconstruct wav file
sf.write('output.wav',myfile.read(),16000,subtype='PCM_16',format='WAV')
```

#### Trimming silence from audio

This part is required because we are doing the naive implementation of STT, where we use the rest API instead of websockets where silence detection is already taken care of. Trimming silence from the audio reduces latency and also reduces the risk of us sending more than 10 seconds of audio. Be sure to install the pydub package (using `pip install pydub`)

Method for trimming silence (cheers to [this stack overflow answer](http://stackoverflow.com/a/29550200)):
```python
from pydub import AudioSegment

class AudioTrimmer:

	def detect_leading_silence(self, sound, silence_threshold=-50.0, chunk_size=10):
    		'''
    		sound is a pydub.AudioSegment
    		silence_threshold in dB
    		chunk_size in ms
		
    		iterate over chunks until you find the first one with sound
    		'''
    		trim_ms = 0 # ms
    		while sound[trim_ms:trim_ms+chunk_size].dBFS < silence_threshold:
        		trim_ms += chunk_size
		
    		return trim_ms

	def trim_audio(self,speech_file):
		
		sound = AudioSegment.from_file(speech_file, format="wav")
		
		start_trim = self.detect_leading_silence(sound)
		end_trim = self.detect_leading_silence(sound.reverse())
		
		duration = len(sound)    
		trimmed_sound = sound[start_trim:duration-end_trim]
		
		file_handle = trimmed_sound.export("trimmed.wav", format="wav")
```

#### Speech to text, LUIS and Text to speech modules

We used the Bing Speech API to convert the user's utterance into text, LUIS to perform natural language processing on the user's utterance, and then text to speech (from Bing Speech API) to generate a spoken response to be played back to the user. A key in the authorization header is required when making calls to the speech API. Refer to bingspeech.py for the code to make calls to the speech API for speech to text - a specific set of parameters is needed when making the call. The format of the wav file needs to be PCM. Also, because we are using the REST API for Bing Speech, the maximum phrase length is 10 seconds. If you wish to have a phrase length of over 10 seconds, you will need to use the websocket API for Bing Speech.

The module to make a speech to text conversion with Bing Speech is as follows:

```python
import requests
import httplib
import uuid
import json
from urllib import urlencode
from urllib2 import Request,urlopen,URLError,HTTPError
import wave, struct, math

class BingSpeech():
    def __init__(self, secret):
        self.sub_key = secret
        self.token = None
        pass

    # A token is required to make calls to bing speech API - this method obtains that token
    def get_speech_token(self):
        FetchTokenURI = "/sts/v1.0/issueToken"
        header = {'Ocp-Apim-Subscription-Key': self.sub_key}
        conn = httplib.HTTPSConnection('api.cognitive.microsoft.com')
        body = ""
        conn.request("POST", FetchTokenURI, body, header)
        response = conn.getresponse()
        str_data = response.read()
        conn.close()
        self.token = str_data
        print "Got Token: ", self.token
        return True

    def transcribe(self,speech_file):

        # Grab the token if we need it
        if self.token is None:
            print "No Token... Getting one"
            self.get_speech_token()
		
        # Specify your audio format here
        content_type = 'audio/wav; codec="audio/pcm"; samplerate=16000'
	
        def stream_audio_file(speech_file,chunk_size=1024):
            with open(speech_file, 'r') as f:
		while 1:
                    data = f.read(1024)
                    if not data:
			f.close()
                        break
                    yield data

        endpoint = "https://speech.platform.bing.com/recognize/query?{0}".format(urlencode({
                "version": "3.0",
                "requestid": uuid.uuid4(),
                "appID": "D4D52672-91D7-4C74-8AD8-42B1D98141A5", # You MUST use this appID for Bing Speech to text
                "format": "json",
                "locale": "en-US",
                "device.os": "linux",
                "scenarios": "ulm",
                "instanceid": uuid.uuid4(),
                "result.profanitymarkup": "0"
            }))

        headers = {'Authorization': 'Bearer ' + self.token,
        'Content-Type': content_type}

        # Make the post request to the Bing Speech API
        resp = requests.post(endpoint,
                            data=stream_audio_file(speech_file),
                            stream=True,
                            headers=headers)

        val = json.loads(resp.text)
        # Return user utterance in text
        return val["results"][0]["name"]

```

There is an official [Python SDK for LUIS](https://github.com/Microsoft/Cognitive-LUIS-Python) by Microsoft, which we used to handle the LUIS intents in our code. Just run the following to install it:

```bash
sudo pip install git+https://github.com/Microsoft/Cognitive-LUIS-Python.git
```

Go into the LUIS portal to configure the intents that the bot will understand. Our bot only has the 'GetWeather', 'GetNews' and 'Call' intents for now. The 'none' intent is when the bot does not understand what the user is saying.

![luisdash]({{ site.baseurl }}/images/connectedlife/luisdash.PNG)

Luismodule.py shows how to make calls to LUIS, and then handle the intent result from LUIS to generate the bot response to the user. This is how we use the LUIS python SDK to handle the responses:

```python
from luis_sdk import LUISClient

def process_res(res):
    '''
    A function that processes the luis_response object and prints info from it.
    :param res: A LUISResponse object containing the response data.
    '''
    intent = res.get_top_intent().get_name()
    if intent == 'GetWeather':
	    reply = 'The weather today is sunny in the morning, cloudy in the afternoon and some light showers in the evening at 5pm' # Replace this with anything you would like, like a call to a weather API
    elif intent == 'Call':
	    reply = 'Unfortunately I am not able to help you make calls yet, sorry!'
    elif intent == 'GetNews':
	    reply = "Make news API call" # Replace this with anything you would like, like a call to any news API
    else:
	    reply = "Sorry, I didn't understand your request."
    print(u'Top Scoring Intent: ' + res.get_top_intent().get_name())
    return reply

def get_luis_response(text):
    try:
        # Replace APPID and APPKEY with your own values
        APPID = 'YOUR_LUIS_APP_ID'
        APPKEY = 'YOUR_LUIS_APP_KEY'
        CLIENT = LUISClient(APPID, APPKEY, True)
        res = CLIENT.predict(text)
        while res.get_dialog() is not None and not res.get_dialog().is_finished():
                TEXT = raw_input(u'%s\n'%res.get_dialog().get_prompt())
                res = CLIENT.reply(TEXT, res)
        reply = process_res(res)
        return reply
    except Exception, exc:
        print(exc)
        return "Sorry, something went wrong."
```

Finally, we will need to convert our response text into speech to play back to the user. The code is quite lengthy, so please refer to [this link](https://github.com/alyssaong1/VoIPBot/blob/master/src/bingttsmodule.py) for the full code. 

You will need to retrieve a token to make calls to the API. The Bing text to speech comes in many different voice configurations (e.g. you can pick the gender of the voice and country that the speaker is from for different accents). The following module is a snippet for doing text to speech with Bing Speech:

```python
class Translator(object):
    """
    Implements API for the Microsoft Translator service
    """
    auth_host = 'api.cognitive.microsoft.com'
    auth_path = '/sts/v1.0/issueToken'
    base_host = 'speech.platform.bing.com'
    base_path = ''
    def __init__(self, client_secret, debug=False):
        """
        :param clien_secret: The API key provided by Azure
        :param debug: If true, the logging level will be set to debug
        """
        self.client_secret = client_secret
        self.debug = debug
        self.logger = logging.getLogger("bingtts")
        self.access_token = None
        if self.debug:
            self.logger.setLevel(level=logging.DEBUG)
        
    def get_access_token(self):
        """
        Retrieve access token from Azure.
        
        :return: Text of the access token to be used with requests
        """
        headers={'Ocp-Apim-Subscription-Key' : self.client_secret}
        conn = httplib.HTTPSConnection(self.auth_host)
        conn.request(method="POST", url=self.auth_path, headers=headers, body="")
        response = conn.getresponse()    
        if int(response.status) != 200:
            raise AuthException(response)
        return response.read()
        
    def call(self, headerfields, path, body):
        """
        Calls Bing API and retrieved audio
        
        :param headerfields: Dictionary of all headers to be sent
        :param path: URL path to be appended to requests
        :param body: Content body to be posted
        """
        
        # If we don't have an access token, get one
        if not self.access_token:
            self.access_token = self.get_access_token()
        
        # Set authorization header to token we just retrieved
        try:
            headerfields["Authorization"] = "Bearer " + self.access_token
        except:
            headerfields["Authorization"] = "Bearer " + self.access_token.decode('utf-8')
        # Post to Bing API
        urlpath = "/".join([self.base_path, path])
        conn = httplib.HTTPSConnection(self.base_host)
        conn.request(method="POST", url=urlpath, headers=headerfields, body=body)
        resp = conn.getresponse()
        # If token was expired, get a new one and try again
        if int(resp.status) == 401:
            self.access_token = None
            return self.call(headerfields, path, body)
        
        # Bad data or problem, raise exception    
        if int(resp.status) != 200:
            raise BadRequestException(resp)
            
        return resp.read()
```

### Limitations and Future Work

A limitation of using the Bing Speech Rest API is that we can only issue one command in each call. A future implementation is to use the Bing Speech websocket API instead so that phrase and silence detection is handled and back and forth can be handled.

The current implementation only allows for single question and answer, as we are merely handling the intent of individual utterances that are received. A future improvement is to use the bot framework to manage a multi step dialog. This will pave the way for better conversations. The bot could ask the user clarifying questions, or make additional suggestions.

The bot SIP client only handles 1 RMS device at a time. Future work includes figuring out scalability and how to handle multiple RMS devices at once. This could be done by opening a new SIP bot client instance in the VM everytime a call is received from a user, and destroying it upon end of call.
 
## Conclusion ##

ConnectedLife showcased the solution at the Fujitsu Executive Forum, which is Fujitsu's largest annual event with top executives attending. The demo was a huge hit as it is something that has never been done before, and ConnectedLife are now moving towards taking the solution from prototype to production. 

Overall, this serves as a great technical case study for those looking to use VoIP enabled devices and apps to communicate with a bot, via the Session Initiation Protocol. While there are still some limitations in the current implementation, the proof of concept shows communicating to a bot via SIP is feasible. 

Other features that ConnectedLife would like to implement via the bot is to allow the resident to receive proactive messages from the RMS for situations like reminders or alerts. For instance, if they have a hospital visit the next day or the weather is bad that evening, the RMS device will call the resident, and tell them "Reminder about your hospital visit tomorrow", or "it is going to be cold tonight, please remember to turn the heater on". 

## Customer Quote ##

"We are making it easier and safer for Older Adults to age in place, maintain their independence and enjoy life with family and friends. What sets us apart is an obsession for making our solutions as affordable and available as possible and Microsoft has been critical in helping us on this journey.

Microsoft Azure and Cognitive Services enables us with the capabilities and ability to deploy applications and services that, in the past,  would have cost us tens of millions of dollars. At ConnectedLife we can just focus on applying our unique know how, creativity and passion to improving lives and reducing cost of care (including social) at an individual, family, community and national level. It is huge.

Microsoft’s scale gives us the assurance that we can easily comply with local and global IoT security and personal data protection standards, provide best in class service availability and disaster recovery and integrate with the numerous systems deployed by our MNC customers and partners as we scale worldwide.  
  
Finally Microsoft just wanted to work with us, help us, support us to achieve our social and business purpose. It has been a joy and we will succeed together."

- Daryl Arnold, Chairman, ConnectedLife

