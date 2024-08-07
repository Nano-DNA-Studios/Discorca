# Discorca
 A Discord Bot that Controls the Orca Quantum Chemistry Software. Using ```/orca``` it will prompt to input a file and this will be sent to the machine hosting the bot and will eventually spit back the resulting output file created from the Orca Calculation. The Bot also hosts an Archive of Previous Calculations in a Compressed Manner and can be Downloaded

## About
This Repo and Project was created to ease the use of Orca, the Quantum Chemistry Software for the University of Waterloo Formula Nano Club, a Nano Car Design team. The Goal of the Project was to allow for Running Orca Calculation wihtout needing to connect to the University VPN Server or Runnning Commands on the ECE Server Provided. This Project has been successful and allows it's users to Run Orca Calculations from anywhere by "Texting" and providing an Orca Input (.inp) File. This has allowed it's Users to Run Quatum Chemistry Simulations and Calculations while at Work for example.

This Project has been Built off [DNA-Discord-Framework](https://github.com/Nano-DNA-Studios/DNA-Discord-Framework), a Typescript Framework that allows for quick and easy developement of Discord Bots

This is a Self Hosted Discord Bot, meaning that to use it you will need to Host it yourself on your own Device, Server or Cloud.

## Setup
This Section covers how to Setup and Run the Discord Bot
### Dependencies
You will need to have NPM and Docker installed on your Personal Device to Edit the Code
You Will only need Docker on your device to Run or Host a Bot

The first thing that should be done upon cloning the repository is
```
npm update
```

To set the Discord Bot up, you can follow the tutorial provided in this Repository. 

[Discord Bot Setup Tutorial](https://github.com/Nano-DNA-Studios/DNA-Discord-Framework)


Once Completed you will need to build a Docker Image. To Built it use the Following Command in the Terminal/Command Prompt, where name is the name of the Image.

```
docker build -t orcabot .
```

Once built you can Start the Bot using the Following Command. Where 100G can be replaced with any Number (This acts like a max memory size for calculations), path/on/server/or/device can be replaced with a Path on your Server or Device that you want to "Mirror" / always have a copy of the outputted files without needing to interact with Docker, and name is the name previously used for the image
```
docker run -it --name orcabot --restart=always --shm-size=100G -v path/to/settings:/OrcaBot/Resources -v path/to/job/archive:/OrcaJobsArchive mrdnalex/orcabot
```

Once The Container has started Running it will prompt you for the Discord Token. This can be Acquired by your Discord Application and is covered in [DNA-Discord-Framework](https://github.com/Nano-DNA-Studios/DNA-Discord-Framework).

Once Started you are free to Close the Command Prompt or Terminal and it should keep running in the Background

The next thing that should be done is setting up the Mount Location and Adding a User

Run the Following Command through Discord
```
/setmountlocation
```

Set the FilePath Option to be the same File Path provided earlier (path/on/server/or/device), and Set the HostName to your IP, Device Name, or whatever appears after you Username in the Terminal (In this case it would be MrDNA-PC, if being hosted on a Server it will most likely be it's IP Address)
![image](https://github.com/Nano-DNA-Studios/Discorca/assets/93613553/884f2107-7654-4cf5-85a8-c1d1bb41d952)

Once Set Add youself as A User and Set your Download Path, use 
```
/adduser
```

And set the User Option as your Username or Account name on your Device or Server (In this case it would be MrDNA, on a Server it would be the Account Name hosting the Bot)
![image](https://github.com/Nano-DNA-Studios/Discorca/assets/93613553/884f2107-7654-4cf5-85a8-c1d1bb41d952)

Set the Download Location option to be where yopu want to Download it on your Personal Device. Paste the Entire Path. Example :
```
C:\Users\MrDNA\Downloads\OrcaDownload
```

If Done correctly, when large calculation files cannot be sent through Discord the Bot will send an SCP Copy Command and you should be able to copy it directly into your Terminal or Command Prompt to Download the files quickly

## Commands
The Following section covers the Commands that can be run through the Orca Bot, it will go over what the Command does,  how to use it, the Options associated with the Command and it's results

All Commands can be Used by typing ```/commandname```, you will need to make sure the Command Name is written in **Lower Case** and has **No Spaces**. Commands will appear through a Window above the Text Box and you can you Arrow Keys and Enter to Select a Command for Auto Completion

---
### **SetMountLocation**
Sets the Mount Location Variable of the Bot to the Folder on the Host Device that is Mounted to the Archive Folder in the Container. This tells the Bot where on the Host Device the "Mirrored" Folder is.

This is meant to only be set once when the bot Starts. It is used to Create the SCP Copy Commands for Users to easily copy Archive Files that Are too large to send through Discord.

#### Options
**filepath** *(REQUIRED)*
Sets the Mount Path Variable, this is the Path on the Host Device that is connected to the Job Archive

![image](https://github.com/Nano-DNA-Studios/Discorca/assets/93613553/aca320b4-8cbe-46b1-b27c-5c2e1a910ec0)

---

### SetHostName
Sets the Host Name of the Host Device that is running the Container holding the Bot.

This is meant to only be set once when the bot Starts. It is used to Create the SCP Copy Commands for Users to easily copy Archive Files that Are too large to send through Discord.

#### Options
**hostname** *(REQUIRED)*
Sets the Host Name Variable, this is the Name of the Host Device

![image](https://github.com/Nano-DNA-Studios/Discorca/assets/93613553/5c3645f9-1d19-4395-9a91-8b411841c949)

---

### AddUser
Adds your User Account to the Bot. This helps the Bot recognize you and create a Download Command that is unique to your device for a quick Download through the Command Line.

This is meant to be Used by a new User the Moment they join the Discord Server. This allows them to quickly "create an account" the Discord Bot will recognize and allow them to quickly Download Archive Files to their Personal Device. This Command can be Overwritten if you change devices or usernames.

#### Options
**user** *(REQUIRED)*
The Name of the Server User or Account.

![image](https://github.com/Nano-DNA-Studios/Discorca/assets/93613553/92b67782-65e4-41a8-bd14-b090f581446d)

---

### SetDownloadLocation
Sets the Download Location on your Personal device to send the SCP Copied files.

This is meant to be Used by a new User the Moment they join the Discord Server. This allows them to quickly "create an account" the Discord Bot will recognize and allow them to quickly Download Archive Files to their Personal Device. This Command can be Overwritten if you change devices, usernames or want to change the Download Location.

#### Options
**downloadlocation** *(REQUIRED)*
Sets the Path to the Download Location for the User running the Command. This is a Path on your Personal Device, where you would like to Download any archive Files.

![image](https://github.com/Nano-DNA-Studios/Discorca/assets/93613553/a11ef7e6-816e-438c-92c1-77c3c6f7652a)

---

### SetPort
Sets the Port that the Host Device is Port Forwarded to. If Left as 0 or set to 0 it means no Port is being used and will not include the Port in the SCP Command, any other value and it will be included in the command.

Meant to be set immediately once the Bot is launched

#### Options
**port** *(REQUIRED)*
The Port number the Host Device is Port Forwarded on.

![image](https://github.com/Nano-DNA-Studios/Discorca/assets/93613553/f8ad9567-fb18-4e0e-acdb-8c21a51558e3)

---

### Download
Allows the User to Download an Archive File. A Archive Name must be provided to receive a File. This File will be sent through Discord, if it is too big it will return a Download Link to run through the Command Prompt.

This is meant to be used to Download Previously Run Orca Jobs or create your own Download Commands for your Personal Device.

#### Options
**archivename** *(REQUIRED)*

The Name of the Job that was Run And Archived, this is the Name of the Orca Input file that provided when ```/orca``` was ran.

![download](https://github.com/MrDNAlex/Orca-Discord-Bot/assets/93613553/56fedb42-2453-49fc-b7bc-84172d9c7c9a)

---

### ListArchive
Returns an Ephemeral Message with a List of all the Archives that are Available to Download through the Bot, there are the Archive Names you will need to provide for ```/download```

This is meant to list out and observe all the Archived Jobs that have been run through the Bot.

![listarchive](https://github.com/MrDNAlex/Orca-Discord-Bot/assets/93613553/55ff789b-47bb-4a7a-a651-3927f2df0b85)

---

### Orca
Allows the User to Run an Orca Calculation by providing an Input File. Once typed, a Panel opens that allows you to Click or Drag And Drop a File into it. Upload a Orca .inp File to Run an Orca Calculation. Once the Calculation is Complete it will Upload and Return the Output (.out), XYZ (.xyz), Trajectory XYZ (_trj.xyz) and the Full Compressed Archive File. If the files weren't created during the calculation it will not be uploaded. And if Any of the Files are too Large (5 MB for regular files, 80 MB for Archive File) it will return a Download Command in it's place.

This is meant to be Used to Run an Orca Calculation through the Server just by "Texting" it the Input File.

#### Options
**orcafile** *(REQUIRED)*

The Orca Input (.inp) File that is Configured to Run an Orca Calculation.

![orca](https://github.com/MrDNAlex/Orca-Discord-Bot/assets/93613553/d0dc97d8-9b77-4442-a6ad-6e975d0c78ae)

---

### PurgeArchives
Allows the User to Clear Or Purge the Archive Folder of all Previous Calculations. This wipes the Bot and Server Clean of all Files Created from previous Orca Calculations. This Command cannot be undone.

This is meant to Clean Up the Bot from previous Calculations and Data that is taking too much space or is no longer needed.

![purgearchives](https://github.com/MrDNAlex/Orca-Discord-Bot/assets/93613553/dca42e09-f491-4070-a8a2-1e39a4ff6610)

---

### PurgeJobs
Allows the User to Clear Or Purge the Jobs Folder of all Previous Calculations. This wipes the Bot Clean from the Files and Jobs Created from Previous Calculations. Archives will not be Affected.

This is meant to Clean Up the Bot from previous Calculations and Data that is taking too much space. The Files Erased are the Uncompressed Job files that May take up a lot more Space on the Server.

![purgejobs](https://github.com/MrDNAlex/Orca-Discord-Bot/assets/93613553/12dbc707-2c06-461f-b937-097679a6f1f6)

---

### SetMaxZipSize
Sets the Maximum size the ZIP Archive File can be in order to be sent through Discord, if the file is larger than the set size it will return a SCP Copy command.

This is meant to be set once the bot launches but can also be changed whenever

#### Options
**maxsize** *(REQUIRED)*
The Max Size the File can be, there are multiple options to choose from. The Absolute Maximum is 100 MB, but we suggest a max of 80 to leave some wiggle room.

![image](https://github.com/Nano-DNA-Studios/Discorca/assets/93613553/1f686f89-17a5-4ce3-aedb-8f9149c72c03)

---

### RunBashCommand
Allows the User to Run a Single Lined Bash Command through the Server. The result is an Ephemeral Message of what would be Displayed if the Command was Run on a Console. If the Result Exceeds 1900 Characters the Bot will Send a Text (.txt) File of the Results instead of Messaging it.

This is meant to be used in emergencies and will probably never be used. It is mostly for Debug purposes and I would not Recommend using it unless you know what you are doing.

#### Options
**command** *(REQUIRED)*

The Bash Command that will be Run by the Discord Bot in the Container.

![runbashcommand](https://github.com/MrDNAlex/Orca-Discord-Bot/assets/93613553/e71e3af2-c901-4a34-8551-4967c20ed47e)

---

### Resources
Displays in an Ephemeral Message the Resources Currently being used by the Discorca Bot. This includes the Number of Cores and the RAM. It also lists all the current Active Jobs that are being run.

![image](https://github.com/Nano-DNA-Studios/Discorca/assets/93613553/fd23996f-b138-4a43-bc9d-77b6df6d1a9a)

---

### GetErrorLogs
Sends the Error Logs File to the User who requested it through Direct Messages.

![image](https://github.com/Nano-DNA-Studios/Discorca/assets/93613553/934eb809-bbcc-4d9b-ba9e-6c46afa04289)

## Developpers
Developer and Creator :
[MrDNAlex](https://github.com/MrDNAlex)


