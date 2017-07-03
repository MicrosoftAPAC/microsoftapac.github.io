---
layout: post
title:  "Building a pre-diagnosis and healthcare referral solution for Hue FMC"
author: "Alyssa Ong, Francis Tuan Anh Nguyen, Toan Nguyen"
author-link: "Add URL for author's Twitter account here"
#author-image: "{{ site.baseurl }}/images/authors/photo.jpg"
date: 2017-04-17
categories: [Bot Framework, Azure App Service]
color: "blue"
image: "images/CLAShealthcare/team.JPG" #should be ~350px tall
excerpt: CLAS Healthcare partnered with Microsoft to build a medical referral and appointment booking chatbot for Hue Family Medical Centre. This is one of the first chatbots of its kind and is a scalable solution for other clinics. 
language: English
verticals: [Healthcare]
geolocation: [Singapore]
---

CLAS Healthcare teamed up with Hue Family Medicine Center (Hue FMC, which is part of Hue University of Medicine & Pharmacy), Hue Industrial College (Hue IC), and Microsoft to build a medical expert search engine and appointment booking system for Hue FMC to increase their referral network to Community Health Centers (CHC). The solution is a user-friendly, multilingual chatbot that guides CHC staff in referring the patient to the right medical expert based on their symptoms, and streamlining the process of seeing a doctor by facilitating bookings. The solution is built using the Microsoft Bot Framework, integrated with CLAS Healthcare's Bacsi24x7 API which is tied to the Hue FMC booking system. 

**Key Technologies Used:**

- [Microsoft Bot Framework](https://dev.botframework.com)
- [Azure App Service](https://azure.microsoft.com/en-us/services/app-service/)
- [Azure SQL Database](https://azure.microsoft.com/en-us/services/sql-database/?v=16.50)

**The Core Team:**
- Hue FMC - Dr Tuan Duong, Dr Minh Nguyen
- CLAS Healthcare: Mr Duy Nguyen (CTO), Mr Ut Huynh (Senior Developer), Mr Khang Chung (Senior Developer)
- Hue IC: Mr Quoc Tran (Student Dev)
- Microsoft Vietnam: Francis Tuan Anh Nguyen (Senior Technical Evangelist), Toan Nguyen (Senior Technical Evangelist)
- Microsoft APAC: Alyssa Ong (Technical Evangelist)

![teamphoto]({{site.baseurl}}/images/CLAShealthcare/team.JPG)

## Customer profile ##

**I. CLAS Healthcare JSC**, http://clashealthcare.vn/en

CLAS Healthcare is a founding member of Microsoft Health Innovation Lab Vietnam, formed in partnership with the APAC PS Health team. CLAS Healthcare combines its own solutions with those of regional/global ISVs enteringr Vietnam to deliver individual or end-to-end solutions for engaging patients, empowring care teams, optimizing clinical/operational effectiveness, and transforming services like Family Doctor Service. CLAS Healthcare aims to be the Uber of healthcare, solving the inefficiencies in the health system and demand for higher quality care by the fast-pace rising middle-class.

CLAS Healthcare is located at 4 Ton Dat Tien Street, Garden Plaza 2,  District 7, Ho Chí Minh City, Vietnam.

CLAS Healthcare's product/service offerings include the following:
1. Engaging Patients: Bacsi24x7 Patient App, CHBase Patient Health Records (PHR), Bacsi24x7 Bot with Appointment, Bacsi24x7 Video Consultation (TBA after SFB SDK Application APIs are in production)
2. Empowering Care Teams: Bacsi24x7 Doctor App, CME Knowlege Hub
3. Optimizing Clinical/Operational Effectiveness: PK.Bacsi24x7 (Free HIS)
4. Transforming Services: Patient App + Online Appointment and Bot + PHR+ Free HIS + other 3rd-party integrated services (MedCubes RemoteCase, Lifetrack PACS, Roche LIS)

**II. Hue Family Medicine Center (Hue FMC)**, http://huemed-univ.edu.vn/en/family-medicine-center-scvtt

Hue FMC of Hue University of Medicine and Pharmacy (Hue UMP) was established on March 27th, 2015 and has officially came into operation on December 10th, 2015. Hue FMC is the only Family Medicine Center approved by Vietnam's Ministry of Health to be an independent clinic at 3rd level in referral system. The Center has 15,000 clients registered with Vietnam Social Medical Insurance, and has about 300,000 visits/year.

Hue FMC is located at 51 Nguyen Hue Street, Hue City, Vietnam.

Hue FMC's product/service offerings include the following:
1. Education: supporting the educational activities of Family Medicine at Hue University of Medicine and Pharmacy in undergraduate, graduate and CME training program.
2. Research: the Center has the function of researching of Family Medicine, Primary Care and Out-patient Care
3. Examination and Treatment: the Center is the first health facility to receive patients in the healthcare system and integrate in the clinic system of the Department of Examination, Hue University Hospital

## Problem statement ##

Community Health Centres (CHCs) often act as a first point of contact for people when they are sick. The CHC staff, who may or may not have medical knowledge, will help to refer the sick person to a clinic. However, as it is now, the referral method is a blind process - the CHC staff have no way of knowing whether the doctor they refer the patient to has the right expertise to help the patient with their sickness. If a patient sees a doctor that doesn't have the right expertise, treatment will be delayed as the doctor will then have to refer the patient to the right doctor. Worse still, the patient could receive the wrong treatment.

CLAS Healthcare and Hue FMC saw an opportunity to help CHC staff make more accurate referrals, extend their care and grow their patient numbers via CHCs. Hue FMC already has a knowledge base that matches symptoms to diseases, and matches diseases to a specialty required. Because many of the CHC staff are not very technology oriented, what is needed is a user-friendly, accessible solution that they can use to help do a prediagnosis of the patient's disease to refer them to the most suitable doctor for their symptoms. After identifying an appropriate doctor, CHC staff should also be able to book an appointment with the doctor on the spot, to make the referral system more streamlined for the patients. 

## Solution, steps and delivery ##

The solution was a bot for the CHC staff to search for a specialty required based on symptoms, and recommend doctors based on this. CHC staff will be able to book appointments as well via a bot and a web app. The overall flow of the bot's dialogs is as follows:

![techarchi]({{site.baseurl}}/images/CLAShealthcare/techarchi.PNG)

![botarchi]({{site.baseurl}}/images/CLAShealthcare/botarchi.PNG)

We foresee most CHC staff searching for a doctor based on symptoms, as most will not have sufficient medical knowledge or knowledge of Hue FMC's doctors to search by name or specialty. Searching a doctor based on symptoms is also the most complex. 

[Demo video](https://1drv.ms/v/s!AiedmuKgkivNgVxEShR1bnpHWdLq) (in Vietnamese)

## Symptoms to Diseases matching ##

Hue FMC's medical knowledge base consists of the following:
- Symptoms to diseases mapping
- Diseases to specialty mapping

Hue FMC provided these in CSV format. We loaded these into and Azure SQL database. The Bacsi24x7 API allows you to search doctors based on specialty. To obtain the specialty, the symptoms must be obtained from a user to identify a disease, then the disease must be mapped to a specialty.

The data is stored into SQL Azure as a table with the columns SymptomId, SymptomText, DiseaseId, DiseaseText 

The first time symptoms are input during a diagnostic, the bot will query the database based on current symptoms and return a set of suggested symptoms which helps point out what disease is. The CHC staff will be expected to tell the bot which of the suggested symptoms the patient has, and the process will reiterate until a specialty is found. 

The code to obtain the suggested list of symptoms is detailed below:

```sql
	CREATE PROCEDURE [dbo].[SuggestSymptoms] 
		-- Add the parameters for the stored procedure here
		@selectedSymptomIds nvarchar(1024),
		@unselectedSymptomIds  nvarchar(1024)
	AS
	BEGIN
		
		DECLARE @SelectedSymptomIdsTable TABLE (SymptomId nvarchar(10))
	  	INSERT INTO @SelectedSymptomIdsTable(SymptomId)
	  	SELECT Item
	  	FROM Split(@selectedSymptomIds,',')

	  	DECLARE @count int
	  	SET @count = (SELECT count(*) FROM @SelectedSymptomIdsTable)

	  	DECLARE @SelectedDiseaseIdsTable TABLE (DiseaseId nvarchar(10)) 

	  	INSERT INTO @SelectedDiseaseIdsTable
	  	SELECT s.diseaseid
			FROM [Symptoms] s
			INNER JOIN @SelectedSymptomIdsTable selectedIds ON s.SymptomId =  selectedIds.SymptomId
			GROUP BY diseaseid
			HAVING count(*) = @count

		
		DECLARE @unselectedSymptomIdsTable TABLE (SymptomId nvarchar(10))
	  	INSERT INTO @unselectedSymptomIdsTable(SymptomId)
	  	SELECT Item
	  		FROM Split(@unselectedSymptomIds,',')
	  
	  	SELECT TOP 5 fullSymptoms.symptomid, fullSymptoms.symptomtextvn, count(*)
			FROM [Symptoms] fullSymptoms INNER JOIN
			(SELECT diseaseIdTable.diseaseid
				FROM @SelectedDiseaseIdsTable diseaseIdTable 
					LEFT JOIN (SELECT distinct s.diseaseid FROM [Symptoms] s INNER JOIN @unselectedSymptomIdsTable unss
								ON s.SymptomId = unss.SymptomId) ss ON diseaseIdTable.diseaseid = ss.diseaseid 
						WHERE ss.diseaseid is null) final ON fullSymptoms.diseaseid = final.diseaseid
						LEFT JOIN @SelectedSymptomIdsTable selectedSymptom ON fullSymptoms.symptomid = selectedSymptom.symptomid
				WHERE selectedSymptom.symptomid IS NULL
			GROUP BY fullSymptoms.symptomid, fullSymptoms.symptomtextvn
			ORDER BY COUNT(*) desc

	END
```
After narrowing down the symptoms to identify the specialty needed to route the patient to that department, the system will retrieve the list of doctors that have the identified specialty.

```sql
	CREATE PROCEDURE [dbo].[GetSpecialtyFromSymptomsList] 
		@selectedSymptomIds nvarchar(1024)
	AS
	BEGIN
		
		DECLARE @SelectedSymptomIdsTable TABLE (SymptomId nvarchar(10))
		INSERT INTO @SelectedSymptomIdsTable(SymptomId)
	  	SELECT Item
	  		FROM Split(@selectedSymptomIds,',')

	  	DECLARE @count int
	  
	  	SET @count = (SELECT COUNT(*) FROM @SelectedSymptomIdsTable)
	  
	  	DECLARE @SelectedSpecialtyTable TABLE ([Specialty] nvarchar(100)) 
	  
	  	INSERT INTO @SelectedSpecialtyTable([Specialty])
	  	SELECT [Specialty]
	  	FROM (SELECT s.[Specialty], s.SymptomId
						FROM [Symptoms] s
						INNER JOIN @SelectedSymptomIdsTable selectedIds ON s.SymptomId =  selectedIds.SymptomId
						GROUP BY s.[Specialty], s.SymptomId) A
		GROUP BY [Specialty]
		HAVING COUNT(*) = @count

		SET @COUNT = (SELECT COUNT(*) 
						FROM @SelectedSpecialtyTable) 

		IF @count = 1 
		BEGIN
			
			SELECT TOP 5 s.diseaseid, s.[DiseaseTextVn], s.[Specialty]
			FROM [Symptoms] s
						INNER JOIN @SelectedSymptomIdsTable selectedIds ON s.SymptomId =  selectedIds.SymptomId
						LEFT JOIN @SelectedSpecialtyTable sspecialty ON s.[Specialty] = sspecialty.[Specialty]
						WHERE sspecialty.[Specialty] IS NOT NULL
						GROUP BY s.[Specialty], s.[DiseaseID], s.[DiseaseTextVn]
			HAVING count(*) > 1
			ORDER BY count(*) DESC
			
		END

	END 
```

Searching doctors by name and specialty was easier as the Bacsi24x7 API provides these searches directly. The bot just had to prompt the user for a name or specialty and we would pass the answer into the API to get the results. Fetching available appointment times and doing bookings is also done through the Bacsi24x7 API.

## Bot interaction design ## 

Because we want to restrict the actions to 3 different routes, advanced NLP like LUIS was not necessary. In addition, LUIS is not available for the Vietnamese language. A main menu with limited buttons and choices was enough for the bot to be useful and user friendly. 

When the user first enters the dialog to search by symptoms, the bot begins with an open ended question and asks the user to type symptoms separated by commas. In this way, there is a consistent comma separated format for the bot to reliably extract all typed symptoms. 

Once a specialty has been identified, we move into the specialty dialog. The same specialty dialog is reused if the user searches by symptoms or specialty. After the API completes the search, a list of doctors is printed on cards, along with their profile picture, name and a button that lets the CHC staff book an appointment with them on behalf of the patient. 

The specialty dialog is as follows: 

```js
bot.dialog('/specialty', [
    function (session, args, next) {
        if (args && args.specialty) {
            session.privateConversationData.specialty = args.specialty;
            next();
        } else {
            builder.Prompts.text(session, "Nhập chuyên khoa:");
        }
    },
    function (session, results) {
        var specialty = "";
        if (session.privateConversationData.specialty) {
            specialty = session.privateConversationData.specialty;
        } else {
            specialty = results.response;
        }

        bs24x7api.getDoctorBySpecialty(specialty, function (err, result) {
            if (err) {
                console.log(err);
                session.endDialog("Không tìm thấy Bác sĩ");//No matched doctor
            } else {
                var arrDoctors = result.data.doctors;

                var intMaxDisplayingDoctorCount = 5;
                if (arrDoctors.length < intMaxDisplayingDoctorCount) {
                    intMaxDisplayingDoctorCount = arrDoctors.length;
                }

                if (arrDoctors.length > 0) {
                    var arrDoctors = arrDoctors.slice(0, intMaxDisplayingDoctorCount);
                    var arrDoctorNames = arrDoctors.map(p => p.fullName);
                    session.privateConversationData.arrDoctorIds = arrDoctors.map(p => p.id);
                    var arrHeroCards = arrDoctors.map(p => new builder.HeroCard(session)
                        .title(p.fullName)
                        .text(p.checkupType ? (p.fullName + " có chuyên khoa là: " + p.checkupType.nameMap.vi) : "")
                        .images([
                            builder.CardImage.create(session, p.photo ? p.photo : "http://www.iconshock.com/img_vista/IPHONE/jobs/jpg/doctor_icon.jpg")
                        ]) // Use default photo if doctor has no profile photo link
                        .buttons([
                            builder.CardAction.postBack(session, p.fullName, "Select")
                        ]));

                    var msg = new builder.Message(session)
                        .textFormat(builder.TextFormat.xml)
                        .attachmentLayout(builder.AttachmentLayout.carousel)
                        .attachments(arrHeroCards);
                    console.log(arrDoctorNames);
                    builder.Prompts.choice(session, msg, arrDoctorNames);
                } else {
                    session.endDialog("Không tìm thấy Bác sĩ");//No matched doctor
                }
            }
        });
    },
    function (session, results) {
        var intSelectedDoctorIndex = results.response.index;
        var intSelectedDoctorId = session.privateConversationData.arrDoctorIds[intSelectedDoctorIndex];
        session.beginDialog('/booking', { intSelectedDoctorId: intSelectedDoctorId });
    }
]);
```

The booking dialog is as follows:

```js
bot.dialog('/booking', [
    function (session, args) {
        var intSelectedDoctorId = args.intSelectedDoctorId;
        var date = new Date();
        date.setDate(date.getDate() + 7);
        var endDate = common.convertToUnixTime(date);

        // Search for all booking times this week
        bs24x7api.getScheduleByDoctorId(intSelectedDoctorId, common.convertToUnixTime(new Date()), endDate, function (error, result) {
            var arrSchedules = result.data.schedules;
            var intMaxDisplayScheduleCount = 5;
            if (arrSchedules.length < intMaxDisplayScheduleCount) {
                intMaxDisplayScheduleCount = arrSchedules.length;
            }
            arrSchedules = arrSchedules.slice(0, intMaxDisplayScheduleCount);
            if (arrSchedules.length > 0) {
                var arrScheduleDisplayTexts = arrSchedules.map(p => common.convertUnitToTimeStringWithTimeZoneVN(p.startTime) + " - " + common.convertUnitToTimeStringWithTimeZoneVN(p.endTime));
                session.privateConversationData.arrScheduleIds = arrSchedules.map(p => p.id);
                // Display time choices for appointment booking
                builder.Prompts.choice(session, "Bạn muốn hẹn bác sĩ vào: ", arrScheduleDisplayTexts);
            } else {
                session.endDialog("Bác sĩ chưa có thiết lập lịch");
            }
        });
    },
    function (session, results) {
        var intSelectedScheduleIndex = results.response.index;
        var intSelectedScheduleId = session.privateConversationData.arrScheduleIds[intSelectedScheduleIndex];
        var currentHost = process.env.BS24x7_BOOKING_HOST;
        // Url to the web form to enter customer PII
        var strLink = currentHost + "/index.html?scheduleId=" + intSelectedScheduleId + "&symptom=" + "none";
        session.endDialog("Xin mời bấm vào [đây](" + strLink + ") sau để đặt lịch");
    }
]);
```

The Microsoft NodeJS botbuilder SDK was used to write the dialogs. The bot was deployed on Facebook Messenger and Skype using the Bot Framework connector. 

## Dealing with patient Personally Identifiable Information (PII) ##

When making a booking, we realised that the CHC staff would have to input PII about the patient, such as their full name, email and phone number. Using the bot connector also means that this PII would be passing through the bot connector in the cloud before being received by the bot, which may be a regulatory issue. To avoid this, we moved part of the booking process to a separate Azure web app owned by CLAS Healthcare. Upon clicking a booking time slot in the bot, a url will be presented to the CHC staff that links to an online form. The CHC staff then have to fill the form in with the patient's PII to complete the booking process.

Once the booking process is complete, the bot returns to the main menu, ready for the CHC staff to attend to their next patient. 

## Multilingual ##

Another requirement was for the bot to be multilingual, as the Bacsi24x7 API is available in both English and Vietnamese. Hue FMC also has an english version of the symptoms, diseases and specialties knowledge base. We used the middleware code documented [here](https://www.microsoft.com/reallifecode/2017/01/21/orchestrating-multiple-bots-with-multilingual-support/) to facilitate changing of languages. Language can be changed at the main menu. 

## Future work ##

- Improving the symptom to specialty search engine using Azure Search. This is so that the CHC staff don't have to spell the symptom exactly when talking to the bot, and to improve the symptom to specialty matching.
 
## Conclusion ##

Hue FMC and CLAS Healthcare were pleased with the result, which is a bot to assist with doing referrals for CHC staff. The bot was presented by Hue FMC at the Pre-Conference prior to the 2nd ASEAN Conference on Health Impact Assessment (http://hia2017.org), with over 60 medical practitioners from Vietnam and US attending. 

[Presentation video](https://1drv.ms/v/s!AiedmuKgkivNgV3pSYTAaPTGjYY6)

![presentation]({{site.baseurl}}/images/CLAShealthcare/presentation.JPG)

Following this, CLAS Healthcare will be making the bot publicly usable on Messenger and discoverable on the Skype bot directory. The bot is close to production-ready, and CLAS will be working closely with Hue FMC to make the finishing touches before trialing it in community health centres across Hue. 

This case study will be valuable for clinics looking to build a user friendly system that improves the quality of referrals for patients to doctors, and makes bookings with the doctors in the clinic. It is shown how to avoid PII passing through the bot connector, which may not be compliant to regulations in countries where patient data must not leave the country or region. It is also a good example for clinics in countries that don't have English available as the first language, or want a multilingual system. 

*"I feel honored to be here today as the representative of CLAS Healthcare to launch Bacsi24x7 Bot. We – Microsoft Vietnam, CLAS Healthcare, Hue FMC, and Hue IC cooperated to not only build Bacsi24x7 Bot but also to shine a light on applying technology to healthcare as part of Industry 4.0 in Vietnam. We can do more with applying modern technology to medical solutions which improves treatment quality that patients require and expect, provide medical professionals an easier access to health medical records for better diagnosis, and so on."*

Duy Nguyen, CTO CLAS Healthcare

## Press Coverage ##

- https://news.microsoft.com/vi-vn/2017/04/19/microsoft-health-innovation-labs-caap-hackfest-tai-hue/#sm.00016y7w742hvfbksm51rw7ka80r8#z0rtHp4LXLbFqEpB.97
- http://viettimes.vn/trinh-lang-cong-nghe-bacsi24x7-bot-ho-tro-nang-cao-chat-luong-kham-chua-benh-119519.html
- http://www.nss.vn/ca18-n37182-microsoft-to-chuc-health-innovation-labs-caap-hackfest-tai-hue.htm
- http://www.biztek.vn/ca125-n26375-microsoft-to-chuc-health-innovation-labs-caap-hackfest-tai-hue.htm
- http://www.hanoingaynay.vn/microsoft-to-chuc-health-innovation-lab%E2%80%99s-caap-hackfest-tai-hue/
- http://www.taichinhdientu.vn/nhip-song-cong-nghe/health-innovation-labs-caap-hackfest-dien-ra-tai-hue-156453.html
- http://vnnews247.com/song-khoe/microsoft-chuc-health-innovation-labs-caap-hackfest-tai-hue/
- http://nhadautu.org/doanh-nghiep/microsoft-chuc-health-innovation-labs-caap-hackfest-tai-hue/
- http://dientutieudung.vn/ca-fe/health-innovation-labs-caap-hackfest-duoc-to-chuc-tai-hue/
- http://tintuc.hues.vn/138237-2/
- http://www.dailypress.vn/2017/04/microsoft-to-chuc-health-innovation.html
- http://www.vnmedia.vn/cong-nghe/201704/ra-mat-cong-nghe-bacsi24x7-bot-giup-nang-cao-chat-luong-kham-chua-benh-564504/