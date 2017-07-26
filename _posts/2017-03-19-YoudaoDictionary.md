---
layout: post
title:  "Youdao Dictionary brings their Win32-based application to the Windows Store"
author: "Zepeng She"
author-link: "https://twitter.com/shezepeng"
#author-image: "{{ site.baseurl }}/images/authors/photo.jpg"
date: 2017-04-27
categories: [Desktop Bridge]
color: "blue"
image: "images/2017-03-19-YoudaoDictionary/certificate.png" #should be ~350px tall
excerpt: Microsoft teamed up with NetEase Youdao to bring the popular dictionary app, Youdao Dictionary, to the Universal Windows Platform (UWP). 
language: [English]
verticals: [Communications/Media]
geolocation: China
---

Microsoft teamed up with NetEase Youdao to bring the popular dictionary app, Youdao Dictionary, to the Universal Windows Platform (UWP).  The dictionary has over 600 million users on several platforms.

### Core team
* Lanfang Chen – Marketing Director, NetEase Youdao
* Yazhi Zhao – Product Manager, NetEase Youdao
* Jun Xu – Senior Engineer, NetEase Youdao
* Lifeng Ge – Program Manager, Microsoft
* Yan Zhang – Audience Evangelism Manager, Microsoft DX
* Leon Liang – Senior Technical Evangelist, Microsoft DX
* Zepeng She – Technical Evangelist, Microsoft DX

## Customer profile
[NetEase Youdao](http://youdao.com/) is a subsidiary of NetEase, and develops mobile applications by using big data technology. Youdao has launched products such as Youdao Dictionary, Youdao Cloud Notes, and Hui Hui (Affordable) Assistant. Youdao uses search engine products as a starting point, going further in the areas of large-scale data storage. 

Youdao Dictionary is the number one dictionary software and has the biggest market share in China. As of the end of September 2016, the Youdao Dictionary had more than 600 million users globally, 60 million monthly active users (MAU), and 10+ million daily active users (DAU). Over 400 million words are checked per day.

The Youdao Dictionary includes more than 650,000 English-Chinese words, more than 590,000 Chinese-English words, and 23 million example sentences, including the entire Longman Dictionary of Contemporary English and many other authoritative dictionaries. Their unique “online definitions” feature gathers new and hot words on the Internet.

## Problem statement

Based on their platform strategy, Youdao would like to reach more platforms. Currently, they have both Win32-based applications and a very simple Universal Windows Platform (UWP) app. Previously, by using native UWP development mode, they only migrated 30% of the functions to the UWP app. 

Going forward, with users’ feedback, they’re still looking to provide the same features as the Win32-based application and a better experience for Windows 10 users. However, due to limitations of the development resource, they really don’t want to rewrite all the code that they have invested in the Windows desktop app for the new UWP app. In addition, the Youdao Dictionary team would like to integrate some Windows 10 features to provide a better user experience. 

## Solution, steps, and delivery

#### System requirements
- Operating system：Windows 10 Pro or Windows 10 Enterprise Anniversary Update (10.0.14393.0 and later)

#### Hardware configuration
- 64-bit (x64) processor
- Hardware-assisted virtualization
- Second Level Address Translation (SLAT)

#### Set up the Desktop App Converter
1. Download and install the Desktop App Converter (DAC) from the [Windows Store](https://www.microsoft.com/store/apps/9nblggh4skzw).
2. Download the [wim file](https://www.microsoft.com/en-us/download/details.aspx?id=54852) that matches your system (`BaseImage-14393.wim`). Make sure that the file is the same version as your system, or you will get an error:

```html
    error 'E_NO_COMPATIBLE_EXPANDED_BASE_IMAGE'
```
3. Run the Desktop App Converter as an administrator. You can do this from the Start menu by right-clicking the app icon and selecting **Run as administrator** from under **More**, or from the taskbar by right-clicking the app icon, right-clicking a second time on the app name that pops up, and then selecting **Run as administrator**.

4. From the app console window, run `Set-ExecutionPolicy bypass`.

    *Figure 1. Set-ExecutionPolicy bypass*
    ![Set-ExecutionPolicy bypass](/images/2017-03-19-YoudaoDictionary/set-exepolicy.png)

5. Install the wim file. 

```ps
    PS C:\> .\DesktopAppConverter.ps1 -Setup -BaseImage BaseImage-12345.wim Verbose
```

>> ***Note**: BaseImage-12345.wim should use the physical path, such as c:\..\desktop\BaseImage-12345.wim.*

#### Run the Desktop App Converter
After setting up the Desktop App Converter, you can convert the desktop app.

Run `DesktopAppConverter.exe` as administrator.

  *Figure 2. Run DesktopAppConverter.exe as administrator*
  ![Run the Desktop App Converter](/images/2017-03-19-YoudaoDictionary/run-convertor.png)

```ps
    PS C:\WINDOWS\System32> DesktopAppConverter.exe -Installer D:\Installer\YoudaoDictplaysound.exe -InstallerArguments "/S" -Destination D:\Output\MyApp -PackageName "NeteaseYoudao.18692F27B7C6F" -AppId "YoudaoDict" -Publisher "CN=32BFB0D9-A91E-42AA-822C-E041AFDECC36" Version 0.0.0.0 -MakeAppx -Verbose -InstallerValidExitCodes -0 –Sign
```

<br/>

```cmd
    DesktopAppConverter.exe
    -Installer //the installer you would like to convert
    -Destination //the file path of your app after converted
    -PackageName //Please find the package name from dev center
    -Publisher //Please find this from the dev center
    -Version //Youdao use 0.0.0.0 for this app
    -InstallerValidExitCodes //You have to set this code to 0
    [-ExpandedBaseImage <String>]
    [-AppExecutable <String>]
    [-AppFileTypes <String>]
    -AppId //You should add this or the convertor will use PackageName for this value
    -AppDisplayName //For displayname
    [-AppDescription <String>]
    [-PackageDisplayName <String>]
    [-PackagePublisherDisplayName <String>]
    [-MakeAppx]
    [-LogFile <String>]
    [<CommonParameters>]
```

Microsoft helped Youdao Dictionary solve the follow issues:

- If we didn't set the `InstallerValidExitCodes` to 0, an `E_BAD_INSTALLER_EXIT_CODE` error message that resembles the following string appears.

    *Figure 3. E_BAD_INSTALLER_EXIT_CODE*
    ![E_BAD_INSTALLER_EXIT_CODE](/images/2017-03-19-YoudaoDictionary/bad-exit-code.png)

- If we didn't set the `AppId`, the Desktop App Converter used the `PackageName` for `AppId`, but the `AppId` can't include a dot symbol, so an `E_MANIFEST_USE_DEFAULT_VALUE_FAILED` error message that resembles the following string appears.

    *Figure 4. E_MANIFEST_USE_DEFAULT_VALUE_FAILED*
    ![E_MANIFEST_USE_DEFAULT_VALUE_FAILED](/images/2017-03-19-YoudaoDictionary/error-appid-value.jpg) 

#### Deploy the app on a local device

After converting the app, you will see the following file directory.

  *Figure 5. FILE DIRECTORY*
  ![FILE DIRECTORY](/images/2017-03-19-YoudaoDictionary/file-directory.png)

The file `NeteaseYoudao.18692F27B7C6F.appx` is exactly the UWP app that you want.

Add the certificate to a local device:
1. Double-click the .pfx file, and the Certificate Import Wizard opens. Add your .pfx file to **Trusted Root Certification Authorities**. 

    *Figure 6. Certificate Import Wizard Welcome page*
    ![Certificate](/images/2017-03-19-YoudaoDictionary/certificate.png)

    *Figure 7. Certificate Import Wizard Certificate Store page*
    ![Certificate](/images/2017-03-19-YoudaoDictionary/certificate2.png)

2. Double-click the .appx file, and you will see the following. Please click 'Run anyway'.

    *Figure 8. "Windows protected your PC" message*
    ![Certificate](/images/2017-03-19-YoudaoDictionary/deploy1.png)

#### Replace the file in the .appx file
If you make any changes to your converted app, you don't need to run the converter again; you can manually repackage your app by using the MakeAppx tool and the appxmanifest.xml file that the DAC generates for your app.

1. Replace the file, such as you would replace the icon for the app. Replace any graphics (such as AppMedTile310150.png or Square44x44Logo) in the Assets folder. 

2. Repackage the app.

```ps
    C:\Program Files (x86)\Windows Kits\10\bin\x86 MakeAppx pack /d "D:\Output\MyApp\MyApp\PackageFiles" /p youdaodict.appx 
```

3. Sign your app.

```ps
signtool sign /a /v /fd SHA256 /p 123456 /f D:\Output\MyApp\MyApp\autogenerated.pfx "C:\Program Files (x86)\Windows Kits\10\bin\x86\youdaodict.appx" 
```

Now you can find the new app at `C:\Program Files (x86)\Windows Kits\10\bin\x86\youdaodict.appx`.


## Conclusion

We published the app successfully to the [Windows Store](https://www.microsoft.com/store/apps/9wzdncrfhvzz).

To see a sample of the finished product, [view this video](https://1drv.ms/v/s!AnQVdunaQKStifRUF6EjYK4xaxda1w).

### Learnings
Microsoft worked with NetEase Youdao to solve the following issues:

- HTML5 Audio failed to play in Chromium Embedded Framework (CEF). The Youdao Dictionary team was using CEF and failed to play HTML5 Audio with the following HTML content after conversion (worked well before conversion).

    *Reason:* A system bug (Bug ID: 8984845)

    *Solution:* Windows and Devices Group (WDG) team fixed this.
  
```HTML
  <!DOCTYPE HTML>
  <html>
  <body>
  <audio src="http://www.w3school.com.cn/i/horse.ogg" controls="controls"> Your browser does not support the audio element.</audio>
  </body>
  </html>
```
 
- The converted UWP app couldn't support capturing words from other app UI with a mouse.

    *Reason:* Desktop App Convertor doesn't currently support UIAccess.

    *Solution:* Remove the "capture word" features until a future release supports UIAccess.

- The name and icons of the converted app do not match those of the previous app.

    *Reason:* Didn't change anything to convert.

    *Solution:* Change the name in the appxmanifest.xml file and replace the icons in the Assets folder.

- The converted app doesn't support a high-resolution screen.

    *Reason:* Youdao used `GetVersionEx`.

    *Solution:* Use `GetVersionEx2`.

- The centennial app and the win32 app have conflict bugs if install both them at the same time.

    *Reason:* The Youdao Dictionary app instance running is checked through the app windows name, but the windows name of the Win32 app and the centennial app is the same, so they may call each other at some time.

    *Solution:* Make the windows name of the Win32 app and the centennial app different.

### Opportunities going forward

  - Add UWP features such as Cortana and live tile in the next version.
  - Add screen word-capturing features when Project bridge is ready for that.
  - Youdao Cloud Notes may use the tool to migrate.

### Customer quote
*"We’re very excited to bring our brand-new Youdao Dictionary app to the Windows Store. The Desktop Bridge is quite easy to use and it takes us little time to convert. And having the nearly full-featured Youdao Dictionary app in the Windows Store means future improvements will reach users faster." — Lanfang Chen, Marketing Director, NetEase Youdao* 

