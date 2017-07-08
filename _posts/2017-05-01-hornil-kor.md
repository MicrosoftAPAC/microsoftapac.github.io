---
layout: post
title: "마이크로소프트 Desktop Bridge를 이용한 훠닐의 StylePix 앱 개발"
author: "김대우, 류혜원"
author-link: "# add twitter link here"
#author-image: "{{ site.baseurl }}/images/authors/photo.jpg"
date: 2017-05-01
categories: [Desktop Bridge]
color: "blue"
image: "images/2017-05-01-hornil/hackfest.png" #should be ~350px tall
excerpt: Hornil brings their graphic software technology, which is used by more than 400 million worldwide, to the Windows Store.
language: [Korean]
verticals: [Cross-Industry]
permalink: /hornil-kor.html
---

- Solution overview
훠닐은 그래픽 소프트웨어 기술을 연구하고 어플리케이션을 제작, 판매하는 소프트웨어 전문 기업입니다. 4억대 이상의 전세계 사용자가 이용하고, 단일화된 스토어 배포 환경을 제공하며, 다양한 비즈니스 모델을 제공하는 마이크로소프트 스토어에 출시를 준비 하기 위해 마이크로소프트와 함께 Hackfest를 진행 후, 여러 기술 검토를 거쳐 StylePix 제품을 Desktop Bridge 기술을 이용해 마이크로소프트 스토어에 출시 하였습니다.  

### Hackfest 팀:  
- 구연일 - 대표, 훠닐  
- 김대우 – 마이크로소프트, 부장  
- 류혜원 – 마이크로소프트, 과장  

## 고객 정보 ##
![Hornil logo]({{site.baseurl}}/images/2017-05-01-hornil/logo.png)  
훠닐은 서울에 위치한 소프트웨어 개발사로 지난 2009년 6월에 구연일 대표가 설립했습니다. 훠닐은 다양한 그래픽 소프트웨어를 개발하고 있트며, 특히 이미지와 그래픽 편집 소프트웨어인 [StylePix](http://hornil.com/products/stylepixpro/), [Photo viewer](http://hornil.com/products/photoviewer/), [Photo Resizer](http://hornil.com/products/photoresizer/)를 출시했습니다. StylePix는 사용하기 100개 이상의 기능을 제공하는 쉽고 강력한 이미지 편집 소프트웨어이자 훠닐의 대표 그래픽 편집 도구이고, 전세계 202개 국가에 출시되어 100만건 이상 다운로드 된 인기있는 소프트웨어입니다.  

![Hornil StylePixPro]({{site.baseurl}}/images/2017-05-01-hornil/StylePixPro.png)  

스타일픽스 프로 제품이 [마이크로소프트 스토어로 출시](https://www.microsoft.com/en-us/store/p/hornil-stylepix-pro/9p820tz13sxj) 되었고, Win32로 개발된 100여가지의 모든 StylePix의 기능을 그대로, UWP로 변환 완료했으며 UWP의 [Live Tile](https://docs.microsoft.com/en-us/windows/uwp/controls-and-patterns/tiles-and-notifications-creating-tiles)과 같은 확장 기능을 추가로 제공하고 있습니다.  

## 고객의 난제 ##
훠닐은 StylePix 및 Photo 뷰어 소프트웨어를 다양한 웹 사이트에서 다운로드 할 수 있도록 홍보했습니다. 그러나 기존 다운로드 방식에는 분명한 한계가 있었고 더 많은 사용자 홍보와 다운로드를 위한 새로운 소프트웨어 시장 진출을 고려하고있었습니다. 오늘날 Windows 10은 OS 시장에서 높은 시장 점유율을 차지하고 있으며 마이크로소프트 스토어는 Windows 10에서 가장 많은 사용자가 이용할 수있는 시장입니다. 그래서 훠닐은 마이크로소프트 스토어에 소프트웨어를 출시하기 위해 준비했습니다. 이를 위해 훠닐은 기존의 win32 소프트웨어를 UWP로 전환하기를 원했습니다. 그러나, 새로운 UWP 앱을 개발하는 것은 두 명의 개발자로 구성된 팀에게 크나큰 부담이었고 개발을 위한 준비기간도 만만치 않게 소요되었습니다.  

[![Hackfest video link]({{site.baseurl}}/images/2017-05-01-hornil/hackmember.jpg)](https://www.youtube.com/watch?v=AEDOiWSSReQ)  
[훠닐 hackfest 인터뷰 영상 링크](https://www.youtube.com/watch?v=AEDOiWSSReQ)  

## 해결 방안 및 절차
훠닐과 Hackfest 팀은 UWP로 출시하기 위해 기본부터 검토했습니다. Desktop Bridge 기술은 Win32로 개발된 소프트웨어를 UWP로 변환하기 위한 최적의 플랫폼입니다. 기본적인 지식 습득을 위해 hackfest 기간 동안 [Microsoft의 Desktop Bridge 공식 웹사이트](https://developer.microsoft.com/en-us/windows/bridges/desktop)와 [Microsoft Virtual Academy - Desktop Bridge](https://mva.microsoft.com/en-us/training-courses/developers-guide-to-the-desktop-bridge-17373?l=3d78c6WhD_9506218965)를 연구했습니다. 특히, MVA 사이트의 콘텐트는 처음 Desktop Bridge로 기존 어플리케이션을 변환하기 희망하는 개발자들에게 단계별로 정보를 제공하는 웹캐스트가 서비스되고 있어서 이 과정을 연구하면서 전반적인 UWP 변환 과정에 대한 이해와 어떤 절차로 변환을 해야할지 검토할 수 있었습니다.  

일반적인 변환 과정은 아래의 절차로 진행됩니다.  
1. UWP로 변환
2. UWP 기능 추가
3. 스토어 출시

### UWP로 변환 작업
UWP로 변환하기 위한 방안들을 검토했습니다. 훠닐의 StylePix는 다양하고 강력한 이미지 편집 기능을 제공하는 소프트웨어이고 이 기능들을 구현하기 위해 내부적으로 레스지스트리 접근과 같은 리소스를 사용하고 있습니다. 변환 과정을 위해 현재 소프트웨어가 어떤 기능들을 사용하는지 준비 및 검토할 필요가 있었고, [Prepare to package an app](https://docs.microsoft.com/en-us/windows/uwp/porting/desktop-to-uwp-prepare) 문서를 통해 변환에 필요한 절차를 검토할 수 있었습니다. 훠닐의 StylePix는 C++로 개발되었고, Desktop Bridge의 요구사항을 충족했습니다.  

변환 과정을 수행해 [Windows app 패키지로 구성](https://docs.microsoft.com/en-us/windows/uwp/porting/desktop-to-uwp-root#convert)하는 과정을 진행했습니다. 훠닐은 DAC(Desktop App Converter)를 이용하는 방법으로 패키징을 진행했으며 이 과정에서 인증서 관련 오류를 만났습니다.  

처음으로 DAC로 변환된 appx 패키지를 설치할 때 출력된 오류 메시지는 아래와 같습니다.  

```
"0x800B0109, A certificate chain processed, but terminated in a root certificate which isn't trusted by the trust provider."  
```

인증서 등록 방법은 다음과 같습니다. 자동 생성된 .cer 파일을 더블클릭하고 Install Certificate를 하여 Current User, Local Machine에 모두 설치하는 것입니다. 인증서가 제대로 등록된 것을 확인하려면 커맨드 창에 certmgr 를 입력하여 Certificate를 실행하여 확인할 수 있습니다. 이것으로 DAC 변환은 정상적으로 되는 것을 확인하였고, 변환된 앱이 제대로 구동되는지 테스트를 했으며 실행에 문제가 없음을 확인 했습니다.  

### UWP 기능 추가
Hackfest 팀 모두 깜짝 놀랄 정도로 빠른 변환이 진행되었습니다.  

앱을 패키징 한 후에는 Live Tile 및 푸시 알림과 같은 기능을 사용하여 앱을 확장 할 수 있습니다. 이러한 기능 중 일부는 앱의 기능을 크게 향상시킬 수 있으며 추가하는 데 드는 비용이 거의 들지 않습니다. 일부 향상된 기능은 코드 추가가 필요합니다.  

이어서, 훠닐은 UWP의 기능 중 업데이트 자동 알림 기능을 Live Tile으로 추가하기 위해 UWP 기능 추가(Enhance)를 준비했습니다. UWP API에 접근하기 위해서는 기존 어플리케이션에 API를 추가하기 위한 약간의 코드 추가가 필요합니다.  

이 과정을 수행하기 위해 여러 검토를 진행했습니다. 훠닐의 StylePix는 C++로 개발된 Win32 어플리케이션이기 때문에 이를 진행하기 위한 과정을 리뷰했으며, 특히, MVA 과정에서 상세한 절차를 볼 수 있었습니다.  

[MVA - Enhancing Desktop Applications with UWP Features - Demo Use UWP API in Your Code](https://mva.microsoft.com/en-us/training-courses/developers-guide-to-the-desktop-bridge-17373?l=3d78c6WhD_9506218965)  

```
  <Dependencies>
    <TargetDeviceFamily Name="Windows.Desktop" MinVersion="10.0.14393.0" MaxVersionTested="10.0.15063.0" />
  </Dependencies>
  <Capabilities>
    <rescap:Capability Name="runFullTrust" />
  </Capabilities>
```

스타일픽스는 복잡한 어플리케이션입니다.  
MVA의 내용을 참조해 UWP의 타일 기능을 활용하여 필요한 알림이나 공지, 업데이트 등의 다양한 용도로 활용할 수 있었습니다.  

Live Tile의 기능은 [Microsoft Desktop Bridge예제 코드](https://github.com/Microsoft/DesktopBridgeToUWP-Samples/tree/master/Samples/VB6withXaml/UWPWrappers)를 참조했습니다.  

```
String ^xml = "<toast><visual><binding template='ToastGeneric'><image src='Assets/" + file + "'/><text hint-maxLines='1'>New Landmark</text><text>" + text + "</text></binding></visual></toast>";
try
{
    if (notifier == nullptr)
    {
        notifier = ToastNotificationManager::CreateToastNotifier();
    }
    else
    {
        notifier->Hide(toast);
    }
    XmlDocument^ toastXml = ref new XmlDocument();
    toastXml->LoadXml(xml);

    toast = ref new ToastNotification(toastXml);
    notifier->Show(toast);
}
catch (Exception^ ex) { return false; }
return true;
```

이 코드를 이용해 Toast 기능을 구현했으며 향후 UWP의 push 알림 기능등을 추가로 개발해 차기 버전에 출시 예정입니다.  

### 스토어 출시
스토어 출시 전에, 스타일픽스에서 동작하지 않거나 문제가 있는 기능이 있는지 체크했습니다. 스토어 검증 과정에서 받은 관련 내용으로, 자체 업데이트 기능을 제거하고 출시할 필요가 있었습니다. 마이크로소프트 스토어를 이용할 경우에는 스토어를 통한 업데이트만 가능하기 때문에 이 기능을 제거하고 스토어 검증을 통과했습니다. Hackfest 팀은 아래와 같은 가이드를 얻어서 WACK 를 실행해 최종 스토어 제출 전 검사를 진행했습니다.  

[Windows App Certification Kit](https://developer.microsoft.com/en-us/windows/develop/app-certification-kit)

스타일픽스를 이미 다양한 다운로드 사이트에서 출시해 본 경험이 있기 때문에 출시 했던 경험을 십분 활용했습니다. 그러나, Desktop Bridge를 위한 권한을 얻기 위해 권한 요청 및 승인을 받아야 했습니다. Desktop Bridge를 위한 권한 승인을 받아야만 마이크로소프트 스토어에 출시가 가능합니다.  

추가적으로 스토어 출판 과정에서 이런 오류가 있었고, 다음 절차를 통해 해결할 수 있었습니다.  

```
•	Package acceptance validation error: You don't have permissions to specify the following namespaces in the appx manifest file of the package Hornil.23E9620B19.appx: http://schemas.microsoft.com/appx/manifest/foundation/windows10/restrictedcapabilities
•	Package acceptance validation error: Your developer account doesn’t have permission to submit apps converted with the Desktop Bridge at this time. https://aka.ms/desktopbridgeforwindowsstore
```

Desktop bridge에서 사용되는 "runFullTrust" permission 이 없기 때문입니다. 이 권한을 얻기 위해서는 
관련 내용을 [App capability declarations](https://docs.microsoft.com/en-us/windows/uwp/packaging/app-capability-declarations)에서 보실 수 있으며, 아래 링크에서 요청을 하시면 됩니다.  
[How to publish your desktop app or game to Windows Store](https://developer.microsoft.com/en-us/windows/projects/campaigns/desktop-bridge)  

![Hornil hackfest image]({{site.baseurl}}/images/2017-05-01-hornil/hackfest.png)  

 
## 결론 ##

Quote
> 마이크로소프트 스토어에 훠닐의 대표 그래픽 편집 소프트웨어인 StylePix 앱을 등록하기 위해서는 UWP 앱이 필요했습니다. 그러나, 훠닐의 앱들은 모두 Win32용 앱이었기 때문에 스토어 등재를 위해서는 UWP 앱을 새롭게 개발해야 하는 상황에 놓여있었습니다. 훠닐 스타일필스는 이미지 프로세싱을 하는 엔진부가 있고 사용자와 커뮤니케이션을 하는 UI부가 있는데 UWP로 제공되려면 적어도 UI 부분을 모두 재개발 해야하는 난감한 상황이었습니다. 사실상, 새로운 앱을 하나 더 개발해야되는 큰 부담이 있었습니다. 그러던 중 Hackfest를 통해 마이크로소프트 Desktop Bridge 기술을 사용할 수 있었고 아주 손쉽게 Win32앱을 UWP앱으로 변환 후 마이크로소프트 스토어에 출시할 수 있었습니다. 실제 앱 변환 과정은 DAC 설치 후 몇 가지 설정만 제대로 해 주면 별다른 문제 없이 진행되었습니다. 훠닐은 향후 다양한 그래픽 소프트웨어들을 차례대로 UWP 앱으로 변환해 글로벌 출시할 예정이며 더 손쉽게 사용자에게 다가갈 수 있을 것으로 기대합니다. 또한, 저희와 함께 더 많은 개발사가 Desktop Bridge 기술을 통해 마이크로소프트 스토어에 진출하여 더욱 풍성한 앱 환경이 구현되기를 기대해 봅니다.  

마이크로소프트의 Desktop Bridge 기술은 기존의 Win32앱으로 만들어진, 예를 들면 WPF나 Winform, 심지어는 15년 전에 만들어졌던 기술인 Visual Basic 6.0 기술이나 C++까지 이런 기술들로 만들어진 기존 win32 응용 프로그램을, 쉽게 최신의 마이크로소프트 스토어 App, 즉 UWP 앱으로 만들 수 있는 기술입니다. 아시는 것처럼 UWP앱을 만들기 위해서는 사실상 거의 재개발에 가까운 정도의 노력은 물론 UI 디자인과 설계까지도 많은 부분을 변경해야 하는 것이 수많은 win32 어플리케이션 개발자들의 큰 고민이었습니다. 그러나, Desktop Bridge 기술과 DAC(Desktop App Converter) 기술이 이러한 개발자의 난제를 풀어주고 있습니다. 기존에 있던 Win32앱을 거의 코드의 변환없이 손쉽게 변환 가능했고, 실제로 훠닐 도 Desktop Bridge 기술을 이용해서 거의 며칠만에 쉽게 Win32 앱들을 마이크로소프트 스토어 앱으로 변환 하실 수 있었습니다. 이제 그만큼 쉽고 편하게 기존의 어플리케이션에 대한 코드 변경없이 갈 수 있다는 새로운 길이 마련되었고, 이 기술들이 개발자들에게 큰 혜택이 될 것입니다.  
