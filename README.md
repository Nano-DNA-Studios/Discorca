# Discorca
 A Discord Bot that Controls the Orca Quantum Chemistry Software. Using ```/orca``` it will prompt to input a file and this will be sent to the machine hosting the bot and will eventually spit back the resulting output file created from the Orca Calculation. The Bot also hosts an Archive of Previous Calculations in a Compressed Manner and can be Downloaded

The first thing that should be done upon cloning the repository is
```
npm update
```

## Commands
The Following section covers the Commands that can be run through the Orca Bot, it will go over what the Command does,  how to use it, the Options associated with the Command and it's results

All Commands can be Used by typing ```/commandname```, you will need to make sure the Command Name is written in **Lower Case** and has **No Spaces**. Commands will appear through a Window above the Text Box and you can you Arrow Keys and Enter to Select a Command for Auto Completion

---
### **SetMountLocation**
Sets the Mount Location Variable of the Bot to the Folder on the Host Device that is Mounted to the Archive Folder in the Container. This tells the Bot where on the Host Device the "Mirrored" Folder is. It also sets the Host Name of the Device.

This is meant to only be set once when the bot Starts. It is used to Create the SCP Copy Commands for Users to easily copy Archive Files that Are too large to send through Discord.

#### Options
**filepath** *(REQUIRED)*
Sets the Mount Path Variable, this is the Path on the Host Device that is connected to the Job Archive

**hostname** *(REQUIRED)*
Sets the Host Name Variable, this is the Name of the Host Device

![setmountlocation](https://github.com/MrDNAlex/Orca-Discord-Bot/assets/93613553/5bf68537-eb9c-4fcb-8291-40e4a5b7e0b1)

### AddUser
Adds your User Account to the Bot with a Mapped Download Location on your Personal Device. This helps the Bot recognize you and create a Download Command that is unique to your device for a quick Download through the Command Line.

This is meant to be Used by a new User the Moment they join the Discord Server. This allows them to quickly "create an account" the Discord Bot will recognize and allow them to quickly Download Archive Files to their Personal Device. This Command can be Overwritten if you change devices, usernames or want to change the Download Location

#### Options
**user** *(REQUIRED)*
The Name of the Server User or Account.

**downloadlocation** *(REQUIRED)*
Sets the Path to the Download Location for the User running the Command. This is a Path on your Personal Device, where you would like to Download any archive Files.

![adduser](https://github.com/MrDNAlex/Orca-Discord-Bot/assets/93613553/18f93e1e-deb7-458a-912c-97e4644c6e1e)

### Download
Allows the User to Download an Archive File. A Archive Name must be provided to receive a File. This File will be sent through Discord, if it is too big it will return a Download Link to run through the Command Prompt.

This is meant to be used to Download Previously Run Orca Jobs or create your own Download Commands for your Personal Device.

#### Options
**archivename** *(REQUIRED)*
The Name of the Job that was Run And Archived, this is the Name of the Orca Input file that provided when ```/orca``` was ran.

![download](https://github.com/MrDNAlex/Orca-Discord-Bot/assets/93613553/56fedb42-2453-49fc-b7bc-84172d9c7c9a)


### ListArchive
Returns an Ephemeral Message with a List of all the Archives that are Available to Download through the Bot, there are the Archive Names you will need to provide for ```/download```

This is meant to list out and observe all the Archived Jobs that have been run through the Bot.

![listarchive](https://github.com/MrDNAlex/Orca-Discord-Bot/assets/93613553/55ff789b-47bb-4a7a-a651-3927f2df0b85)


### Orca
Allows the User to Run an Orca Calculation by providing an Input File. Once typed, a Panel opens that allows you to Click or Drag And Drop a File into it. Upload a Orca .inp File to Run an Orca Calculation. Once the Calculation is Complete it will Upload and Return the Output (.out), XYZ (.xyz), Trajectory XYZ (_trj.xyz) and the Full Compressed Archive File. If the files weren't created during the calculation it will not be uploaded. And if Any of the Files are too Large (5 MB for regular files, 80 MB for Archive File) it will return a Download Command in it's place.

This is meant to be Used to Run an Orca Calculation through the Server just by "Texting" it the Input File.

#### Options
**orcafile** *(REQUIRED)*
The Orca Input (.inp) File that is Configured to Run an Orca Calculation.

![orca](https://github.com/MrDNAlex/Orca-Discord-Bot/assets/93613553/d0dc97d8-9b77-4442-a6ad-6e975d0c78ae)


### PurgeArchives
Allows the User to Clear Or Purge the Archive Folder of all Previous Calculations. This wipes the Bot and Server Clean of all Files Created from previous Orca Calculations. This Command cannot be undone.

This is meant to Clean Up the Bot from previous Calculations and Data that is taking too much space or is no longer needed.

![purgearchives](https://github.com/MrDNAlex/Orca-Discord-Bot/assets/93613553/dca42e09-f491-4070-a8a2-1e39a4ff6610)


### PurgeJobs
Allows the User to Clear Or Purge the Jobs Folder of all Previous Calculations. This wipes the Bot Clean from the Files and Jobs Created from Previous Calculations. Archives will not be Affected.

This is meant to Clean Up the Bot from previous Calculations and Data that is taking too much space. The Files Erased are the Uncompressed Job files that May take up a lot more Space on the Server.

![purgejobs](https://github.com/MrDNAlex/Orca-Discord-Bot/assets/93613553/12dbc707-2c06-461f-b937-097679a6f1f6)


### RunBashCommand
Allows the User to Run a Single Lined Bash Command through the Server. The result is an Ephemeral Message of what would be Displayed if the Command was Run on a Console. If the Result Exceeds 1900 Characters the Bot will Send a Text (.txt) File of the Results instead of Messaging it.

This is meant to be used in emergencies and will probably never be used. It is mostly for Debug purposes and I would not Recommend using it unless you know what you are doing.

#### Options
**command** *(REQUIRED)*
The Bash Command that will be Run by the Discord Bot in the Container.

![runbashcommand](https://github.com/MrDNAlex/Orca-Discord-Bot/assets/93613553/e71e3af2-c901-4a34-8551-4967c20ed47e)


