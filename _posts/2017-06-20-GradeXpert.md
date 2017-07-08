---
layout: post
title: "GradeXpert converted their GradeXpert application to a UWP app using the Desktop Bridge."
author: "Dave Glover, Jordan Knight"
author-link: "https://about.me/glovebox, http://www.github.com/jakkaj"
author-image: "https://aboutme.imgix.net/background/users/g/l/o/glovebox_1497494482_205.jpg"
date: 2017-06-10
categories: [Desktop Bridge]
color: "blue"
image: "images/2017-06-20-GradeXpert/gradexpert-logo.png" #should be ~350px tall
excerpt: 
GradeXpert is a Student Information System, including data management, analytics and reporting, that is an affordable, flexible and fully customizable solution for K-12 schools. Centralize and manage all student data, including any type of assessment & outcome, individual learning plans, student medical details and welfare & behavior notes, attendance, semester reports, digital portfolios, parent communications and much, much more.

As Windows clients are a major part of the user base, GradeXpert wanted a better way to deploy their windows desktop application to schools. The impending release of Windows S has made the potential for running their application as a Windows Store app an attractive proposition. Microsoft was engaged to help GradeXpert to convert their application and aid in submitting it to the Windows Store.
language: English
verticals: ["Education"]
geolocation: [Australia]
---

<img alt="GradeXpert" src="{{ site.baseurl }}/images/2017-06-20-GradeXpert/gradexpert-logo.png">

GradeXpert is a customisable Student Information System for K-12 schools that includes data management, analytics and reporting. The applications allows customers to centralise and manage all student data including assessment and outcomes, individual learning plans, student medical details, welfare and behavior notes, attendance, semester reports, digital portfolios, parent communications and more.

The GradeXpert app is based on work that was started in 1999. Over the years it has evolved to fulfill a range of customer requirements. In its current form, the app represents many years of engineering, refinement and testing. 

Since GradeXpert was first founded new development platforms have come about - including the Universal Windows Platform. UWP is attractive to the developers of GradeXpert as it allows easy deployment, upgrade and management options from the Windows Store as well as allowing delivery to the new Windows 10 S platform which will be popular amongst schools. 

This article reviews how Microsoft and GradeXpert worked together to create a solution that can deliver the GradeXpert product via the Windows Store whilst retaining the capability to develiver the application via conventional desktop means.

**The core team:**

- Anthony Sacker  – Technical Director, GradeXpert
- Dave Glover – Technical Evangelist, Microsoft Australia
- Jordan Knight - Technical Evangelist, Microsoft Australia
 
## Customer profile

GradeXpert was founded in 2004 with a goal of developing flexible and powerful student assessment tracking software to meet the demanding needs of teachers, schools, principals and state education departments across Australia.

The very first version was called *Grades* and was developed in 1999 for a school that simply wanted an easy way of centrally tracking and reporting on student assessment results from year to year. At the time they were using a combination of spreadsheets and many other different programs, which was all too cumbersome with no central repository of information.

Over the years GradeXpert has evolved into a sophisticated student data management, analytics and reporting application. 

GradeXpert is based in Melbourne, Australia.

## Problem statement

GradeXpert is a Windows desktop application developed in Visual Basic 6 and installed via an .exe installer package. This build and deployment of this is a well oiled process, and works very well when targeting classic Windows desktop scenarios - and this scenario will be carried forward where it makes sense. 

With the uptake over the last couple of years of the Windows Store, customers are requesting support for UWP apps, and it's estimated that requests will increase with the incoming Windows 10 S edition. Going forward however,  GradeXpert would like to support both existing classic desktop and also be able to deliver software from the Windows Store. 

The simplified deployment and update flows that Windows Store Apps afford is also attractive.

## Solution, steps, and delivery ##

Given the amount of years of development that makes up the GradeXpert product today, a re-write of the software to target the Universal Windows Platform would be non-trivial and could be expensive and this is where the Desktop Bridge (previously known as Project Centennial) comes in. 

The Windows Universal App [Desktop Bridge](https://developer.microsoft.com/en-us/windows/bridges/desktop) allows an existing non-UWP Windows application to be converted in to a UWP application that can be deployed from the Windows Store. 

There are two mechanisms for converting and app:

    a) Creating a UWP from an installer (such as a .msi)

    b) Manually building a UWP app in Visual Studio and importing the existing desktop binaries

This solution uses the first version where we build the UWP from the existing GradeXpert .exe installer. 

Above and beyond the actual packaging of an existing app fo The UWP platform also provides some interesting features via [Desktop to UWP Extensions](https://docs.microsoft.com/en-us/windows/uwp/porting/desktop-to-uwp-extensions) including toast notifications, tiles and Cortana integration. These features have not been integrated in the first iteration of this project - these integations are planned for a future release of GradeXpert. 

The Desktop Bridge was a natural choice when looking at the amount of effort that was required to convert their application versus developing a new UWP app.

### System requirements

Before you get started you have need to ensure you have the following things installed and enabled. 

- [Windows 10 Anniversary or Creators Update](https://support.microsoft.com/en-au/instantanswers/d4efb316-79f0-1aa1-9ef3-dcada78f3fa0/get-the-windows-10-creators-update) (10.0.14393.0 and later) Pro or Enterprise edition.
- [The Desktop App Converter](https://www.microsoft.com/en-us/store/p/desktopappconverter/9nblggh4skzw)
- [Windows 10 SDK](https://go.microsoft.com/fwlink/p/?LinkId=619296)
- 64 bit (x64) processor
- Hardware-assisted virtualization
- Second Level Address Translation (SLAT)

You may note that SLAT and Hardware-assisted virtualization are required - this is because the [DesktopAppConverter](https://docs.microsoft.com/en-us/windows/uwp/porting/desktop-to-uwp-run-desktop-app-converter) tool (which forms a main component of the Desktop Bridge) will use a virtual machine to help "see" the result of the .msi installer so it may then replicate that process without the need to actually run a .msi file. 

## Installing the Desktop App Converter

The actual tool - [DesktopAppConverter.exe](https://www.microsoft.com/en-us/store/p/desktopappconverter/9nblggh4skzw) is installed as an app from the Windows Store. This app is the available from the command line via an elevated PowerShell prompt. 

There are a number of great resources that you should familiarize yourself before you start using ```DesktopAppConverter.exe```. 

1. The [Desktop Bridge Announcement](https://blogs.windows.com/buildingapps/2016/09/14/apps-built-using-the-desktop-bridge-now-available-in-the-windows-store/#YTtqSQ3sxu7OIRei.97), it’s short video and well worth watching.
2. [Desktop Bridge Overview](https://docs.microsoft.com/en-au/windows/uwp/porting/desktop-to-uwp-root)
3. The [Desktop App Converter](https://docs.microsoft.com/en-au/windows/uwp/porting/desktop-to-uwp-run-desktop-app-converter#optional-parameters)  process documentation. 
4. [A base image](https://aka.ms/converterimages) that matches the build version of your Windows Install (run winver.exe to find this out)


Start by grabbing the [DesktopAppConverter.exe](https://www.microsoft.com/en-us/store/p/desktopappconverter/9nblggh4skzw) from the Windows Store. Once this is installed it will be available from the Start menu as well via an elevated console such as PowerShell. 

You also need to grab a [base image](https://aka.ms/converterimages). Check the version of your Windows install by finding ```winver``` on the Start menu and find the matching base image to install. 

<img src="{{ site.baseurl }}/images/2017-06-20-GradeXpert/winver.jpg" alt="Find the Windows Version"/>

**Please Note:** You may like to disable your virus software before setting up (expanding) the base image otherwise the image may not expand correctly. If the image does not install correctly you may see the following error when you run the Desktop Bridge Converter. Disable your virus detection software and rerun the Image setup.

````PS
Attempting to determine Windows version for expanded base image at C:\ProgramData\Microsoft\Windows\Images\BaseImage-14393
[2017-01-13T14:22:28] Attempting to determine version from version file C:\ProgramData\Microsoft\Windows\Images\BaseImage-14393\version.json if it exists
[2017-01-13T14:22:28] Version file C:\ProgramData\Microsoft\Windows\Images\BaseImage-14393\version.json not found
[2017-01-13T14:22:28] Attempting to determine version from the expanded base image's file system
[2017-01-13T14:22:28] C:\ProgramData\Microsoft\Windows\Images\BaseImage-14393 is of windows version 10.0.14393.0
[2017-01-13T14:22:28] The expanded base image version was determined to be 10.0.14393.0
[2017-01-13T14:22:28] Ignoring revision numbers
[2017-01-13T14:22:28] Expanded base image at C:\ProgramData\Microsoft\Windows\Images\BaseImage-14393 IS compatible with your OS
````


The base image file will be around 3 gigabytes in size. Once it has been downloaded, you need to install the image by opening the downloaded file. This process will take 15 to 20 minutes to complete depending on your system so keep this in mind. 

## Converting GradeXpert Step by Step

Once you've installed the prerequisites the next step is packaging your application. 

```
DesktopAppConverter.exe -Installer .\binsetup\GradeXpert_Demo_Setup.exe -InstallerArguments "/verysilent" -Destination .\output -PackageName "GradeXpert" -Publisher "CN=GradeXpert" -Version 0.0.0.1 -MakeAppx -Sign -Verbose -Verify -AppExecutable "GradeXpert.exe"
```

Take your .msi or .exe file an pass it in to the ```-Installer``` argument. Your setup .exe or .msi needs to run unattended. You can pass in arguments to your setup application using the ```-InstallerArguments``` flag, in our example here we used ```-InstallerArguments "/verysilent"```.

The other setting that is important ```-AppExecutable "GradeXpert.exe"``` which you'll need to change to the file that the system should launch when it boots (i.e. someone runs the app!). 

Review the other settings and modify them as required. 

**Note:** If you have multiple applications in your existing setup file you can specify which app is the startup app for your Windows Store app with the ```-PackageName``` flag.

**Note:** Your Desktop Bridge app cannot install out of process services such as MySQL. Please see some mitigation steps below for errors that are raised during the conversion process. 

### Run your new app

Before you can run the app you need to install the ```auto-generated.cer``` file. The basic process is to double click the .cer file, select "Local Machine" and installed it in the "Trusted Root Certification Authority" section.

 See the "Run the packaged app" section in the [Package an app using the Desktop App Converter](https://docs.microsoft.com/en-au/windows/uwp/porting/desktop-to-uwp-run-desktop-app-converter) for more information.  

**Note:** If you rebuild the app using the ```DesktopAppConverter.exe``` you'll need to re-install the certificate as it may change!

## App Verification Failures

Part of any UWP app submission process is verifying the new package with the Windows App Certification Kit (or WACK). The desktop app conversion process will kick off a WACK check for you automatically.

Most of the time the process will work smoothly - producing a viable .appx file for store submission, however sometimes some manual intervention may be required as was the case here.   

#### Check for Failures

The GradeXpert application did not pass automatically after the ```DesktopAppConverter``` ran the WACK tool, as evidenced by the output in the console window. This meant further investigation and adjustment of the package was required before the application would be ready to submit to the store. 

The ```DesktopAppConverter``` tool will output any failures in the console window as well as write a detailed report in to ```output\\VerifyReport.xml```.

<img src="{{ site.baseurl }}/images/2017-06-20-GradeXpert/failures.PNG" alt="WACK Error Outputs"/>

When examining the detailed error xml from ```VerifyReport.xml``` the first thing of note is that even tests thave have passed are listed - so don't be confused and scared off by all the entries. You're looking for items that have ```<Passed>false</Passed>``` listed. 

Another important aspect is that most, but **not all** the tests that are run are actually mandatory, although they may appear so according to the report. 

Tests that are performed but optional are:

1. Digitally signed file test
2. File association verbs
3. Debug configuration test

For a full listing of these tests and detailed information on each see [Windows Desktop Bridge app tests](https://docs.microsoft.com/en-us/windows/uwp/debug-test-perf/windows-desktop-bridge-app-tests). 

### PE Checker Failure

The first test that was failing was the ```PEChecker``` which dictates that all executable files be digitally signed. PE Files are normally .exe files that contain some extra information to tell windows how to run them. You can find more information about PE files [here on Wikipedia](https://en.wikipedia.org/wiki/Portable_Executable). 

Interestingly [.OCA and .OCX](https://en.wikipedia.org/wiki/Object_Linking_and_Embedding) dependency files from the package were being flagged as unsigned by the WACK tool. 

```xml
<ServiceType>PEChecker</ServiceType>
<RuleDesc>PE Files must contain valid signature</RuleDesc>
<RuleValue />
<RuleViolationType>SignatureIntegrity</RuleViolationType>
<RuleSeverity>Failure</RuleSeverity>
<Mitigation>&lt;a href="https://go.microsoft.com/fwlink/?linkid=836888"&gt;click here for mitigation details&lt;/a&gt;</Mitigation>
<Result>
<Passed>false</Passed>
<Value>Found problem in PEFile files/graph.oca
Found problem in PEFile files/PicFormat32.oca
```

The work around in this case was to ignore the result - and indeed when we re-run WACK on the re-built .appx (see below) we do so without this optional test selected. 

### ExeChecker Failure

The next test that was failing was the ```ExeChecker``` which performs a few different types of checks, in this case specifically an EXE file in the original GradeXpert installer package was attempting to gain elevated rights via Windows UAC - which is definitely denied in UWP apps. We were not able to simply ignore this test result. 

```xml
<ServiceType>ExeChecker</ServiceType>
<RuleDesc>EXE cannot request admin elevation</RuleDesc>
<RuleValue>requestedExecutionLevel level=\"requireAdministrator\"</RuleValue>
<RuleViolationType>AdminElevation</RuleViolationType>
<RuleSeverity>Failure</RuleSeverity>
<Mitigation>UWP apps must run as interactive user - elevated security permissions are not supported.
&lt;a href="https://go.microsoft.com/fwlink/?linkid=836886"&gt;click here for mitigation details&lt;/a&gt;</Mitigation>
<Result>
<Passed>false</Passed>
<Value>
MySQL%20Install%20Files/vcredist_x86.exe</Value>
</Result>
```
Investigation of the error details showed that the mysql ODBC driver which GradeXpert depends upon itself has a dependency on the Visual C++ 2010 package and so calls upon a dependency installer ```vcredist_x86.exe```.

Visual C++ dependencies are not uncommon and UWP itself has a built in mechanism for taking a dependency on these libraries. These dependencies will then be automatically installed as the user downloads the app from the Windows Store. 

Adding a dependency itself is easy enough - just edit the ```AppxManifest.xml``` file... however this necessitates a rebuild and re-sign of the .appx package - which is more involved. There is more information on rebuilding the .appx below.  

To add a VC++ depdencency, locate the ```AppxManifest.xml``` file, locate the ```<Dependencies>``` section and add the dependency.

```xml
<Dependencies>
  ...
  <PackageDependency Name="Microsoft.VCLibs.140.00.UWPDesktop" MinVersion="12.0.40652.5" Publisher="CN=Microsoft Corporation, O=Microsoft Corporation, L=Redmond, S=Washington, C=US" />
</Dependencies>
```
Full documentation of this process can be found [here](https://blogs.msdn.microsoft.com/appconsult/2016/10/20/desktop-bridge-how-to-handle-c-and-c-dependencies-with-the-desktop-app-converter/).

With this dependency added we were able to simply delete ```vcredist_x86.exe```
and allow the package to take the dependency from the UWP download and install process. 

### Image file too large 

The final problem we needed to fix before the WACK tests would pass is that it was reporting one of .png images in the Assets folder was too large. Maximum image size is 200kb, this one was a whopping 400kb. The size blowout was due to the .png file being in 32bit colour, when in reality it only needed 8bit colour. 

To shrink the image we wrote a small console program that used ```WuQuantizer``` from Nuget to quantize the image to 8bit, reducing the size to 51kb in the process. 

```csharp
static void Main(string[] args)
{
    if (args.Length == 0)
    {
        return;
    }
    var f = args[0];
    var p = Path.GetFullPath(f);
    var bytes = File.ReadAllBytes(p);
    var ms = new MemoryStream(bytes);
    var bmp = (Bitmap)Bitmap.FromStream(ms);
    var quantizer = new WuQuantizer();
    using (var quantized = quantizer.QuantizeImage(bmp))
    {
        quantized.Save(p, ImageFormat.Png);
    }
}
```
You will need to add the ```WuQuantizer``` Nuget package before this will compile. 

The app is callable from the command line by passing in the image (offset path) to fix (see below). 

One final thing you may need to do is increment the build number in ```AppxManifest.xml``` so that you can install over the top of an already installed older version of the UWP app. Locate the ```<Identity``` tag and increment the version number as required. 

```xml
 <Identity Name="GradeXpert" ProcessorArchitecture="x86" Publisher="CN=GradeXpert" Version="0.0.0.1" />
``` 
### Allowing .appx Package Modifications

All in all the testing revealed three changes needed in the .appx file and thus requiring a manual .appx rebuild:

- Delete the VC++ redist dependency installer
- Add the VC depdency to the ```AppxManifest.xml``` file
- Resize the large image
- (optional) increment the version

When ```DesktopAppConverter.exe``` runs it not only builds an .appx, but it also outputs all the files that it used to the ```PackageFiles``` subfolder. This is where the edits are performed. 

Once the edits are made, rebuilding .appx is performed using the ```makeappx.exe``` tool which is available as part of the [Windows 10 SDK](https://go.microsoft.com/fwlink/p/?LinkId=619296) which you will need to install separately (even if you already have Visual Studio 2017 installed!)

```
"C:\Program Files (x86)\Windows Kits\10\bin\10.0.15063.0\x86\makeappx.exe" pack /l /d "output\GradeXpert\PackageFiles" /p rebuild.appx
```

The next step is to sign the file using a certificate and ```signtool.exe``` which is also in the [Windows 10 SDK](https://go.microsoft.com/fwlink/p/?LinkId=619296). In this example we use the certificate that the ```DesktopAppConverter.exe``` tool produces.

**Note:** The default certificate .pfx that is produced has a password of 123456 if you need it for any reason. 

```
"C:\Program Files (x86)\Windows Kits\10\bin\10.0.15063.0\x86\signtool.exe" sign /fd SHA256 /a /f output\GradeXpert\auto-generated.pfx /p 123456 rebuild.appx
```

To make this rebudiling process easy and repeatable we grouped all this up in to a nice neat .bat file:

```
del "output\GradeXpert\PackageFiles\MySQL Install Files\vcredist_x86.exe"
"imagereudcer\reducer\bin\Debug\reducer.exe" "output\GradeXpert\PackageFiles\assets\AppLargeTile.scale-400.png"
"C:\Program Files (x86)\Windows Kits\10\bin\10.0.15063.0\x86\makeappx.exe" pack /l /d "output\GradeXpert\PackageFiles" /p rebuild.appx
"C:\Program Files (x86)\Windows Kits\10\bin\10.0.15063.0\x86\signtool.exe" sign /fd SHA256 /a /f output\GradeXpert\auto-generated.pfx /p 123456 rebuild.appx
```

The rebuilt .appx file should be ready for testing!

### Manually Runnig the Windows App Cert Kit

Once our .appx is rebuilt, it needs to be re-tested before we can be confident that a store submission will be successful. The ```Windows App Cert Kit``` is installed with the [Windows 10 SDK](https://go.microsoft.com/fwlink/p/?LinkId=619296), you can run it by searching for it on the Start menu. 

Once the app is running, select your .appx file and choose the following options:

<img src="{{ site.baseurl }}/images/2017-06-20-GradeXpert/appxselections.png" alt="appx testing selections"/>

The test will take some time - once it ends you'll see a new report on the status of the .appx. 

Once this was ready, we could attempt to boot the app. 

<img src="{{ site.baseurl }}/images/2017-06-20-GradeXpert/pass.png" alt="Pass!"/>

## Debugging problems

The first run of the newly converted UWP app resulted in a crash!

<img src="{{ site.baseurl }}/images/2017-06-20-GradeXpert/errorboot.jpg" alt="Crash"/>

The error "Path not found" indicated there was some problem with writing or reading a file. We used [Process Monitor](https://technet.microsoft.com/en-us/sysinternals/processmonitor.aspx) which is a tool that lets you see all the reads and writes an app makes to the registry, files and more. 

Running perfmon we can quickly see the system attempt to write a log file in to ```Logs\ErrorLog Jun 2017.csv``` which isn’t allowed in UWP (one of the few restrictions!)

<img src="{{ site.baseurl }}/images/2017-06-20-GradeXpert/processmon.jpg" alt="Process Monitor in action"/>

```
1:39:28.6654366 PM     GradeXpert.exe 11444   CreateFile            C:\Program Files\WindowsApps\GradeXpert_0.0.0.1_x86__658jqmtxa81ga\Logs\ErrorLog Jun 2017.csv     ACCESS DENIED           Desired Access: Generic Write, Read Attributes, Disposition: OpenIf, Options: Synchronous IO Non-Alert, Non-Directory File, Attributes: N, ShareMode: Read, Write, AllocationSize: 0
```
As per [this guide](https://blogs.msdn.microsoft.com/appconsult/2016/10/17/desktop-bridge-converting-an-installer/): *(the UWP install folder) ... is a read-only folder and it’s the consequence of one of the requirements that a converted app has to deal with: the application can only read data from this folder, but it can’t write any file.*

Fixing this issue required a small change from the GradeXpert team to adjust where the system saved configuration, backup and log files from the app install directory to the app data directory. 


## Windows Store Requirements

To publish Desktop Bridge app you need to do perform the following steps. Actual store deployment is outside the scope of this document. 

1. [Register as Windows Store app developer](https://developer.microsoft.com/en-us/store/register)
    - [Account types, locations, and fees](https://docs.microsoft.com/en-us/windows/uwp/publish/account-types-locations-and-fees)
2. Complete the [How to publish your desktop app or game to Windows Store](https://developer.microsoft.com/en-us/windows/projects/campaigns/desktop-bridge) form.


## Conclusion ##

With the Desktop App Converter, GradeXpert was able to provide a more advanced deployment method utilising the Windows Store as well as maintaing backwards compatibility for their existing customers with classic Windows desktop envionments. An added benefit of the Windows Store deployment model increased trust that comes with installations via the Windows Store as the app as certified safe by Microsoft via the Store submission process. 

A large benefit to GradeXpert and their customers is they can now ensure that their application can be installed on Windows S which will be used predominantly in their education vertical.

In the future the GradeXpert developers are looking to enable the use of new features made available by the UWP platform over time. The great thing here is that they can gradually add these features over time with new releases. 

## Links
- [Desktop Bridge](https://developer.microsoft.com/en-us/windows/bridges/desktop)
- [Desktop App Converter Documentation](https://docs.microsoft.com/en-us/windows/uwp/porting/desktop-to-uwp-run-desktop-app-converter)
- [Desktop App Converter Installation](https://www.microsoft.com/en-us/store/p/desktopappconverter/9nblggh4skzw)
- [Windows 10 SDK](https://go.microsoft.com/fwlink/p/?LinkId=619296)
- [Converting an installer with DestopApplicationConverter](https://blogs.msdn.microsoft.com/appconsult/2016/10/17/desktop-bridge-converting-an-installer/)
- [Windows Desktop Bridge app test details](https://docs.microsoft.com/en-us/windows/uwp/debug-test-perf/windows-desktop-bridge-app-tests)
- [UWP Desktop App Extensions](https://docs.microsoft.com/en-us/windows/uwp/porting/desktop-to-uwp-extensions)
- [Platform Executable Files on Wikipedia](https://en.wikipedia.org/wiki/Portable_Executable)
- [Desktop Bridge – How to handle C and C++ dependencies with the Desktop App Converter](https://blogs.msdn.microsoft.com/appconsult/2016/10/20/desktop-bridge-how-to-handle-c-and-c-dependencies-with-the-desktop-app-converter/)
