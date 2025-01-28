# Discorca

A Discord Bot that runs Orca Quantum Chemistry software under the hood. By using `/orca` you can upload a .inp (Input) file describing the calculation and run it. Once complete the Bot returns the .out (Output) file through a message that can be downloaded. Bot hosts Archives, can perform parallel calculations and generates SCP commands if too large for Discord.

# About

The Discorca project is my implementation of a solution in automating and making it easier to run Orca calculations on powerful devices. A copy has been lent to the University of Waterloo Formula Nano Design Team, our goal is to design and build a Nanocar for the Nanocar Race. We’ve been given a Server in the ECE department and I have contributed my personal Linux server towards helping with calculations, but not many people were familiar with CLI’s. Therefor I proposed making this Discord Bot in a Docker container to ease the addition of new devices and make it easy to run calculations and receive their results. 

To make Discorca, I used my personal Discord Building framework [DNA-Discord-Framework](https://github.com/Nano-DNA-Studios/DNA-Discord-Framework), a TypeScript/JavaScript framework I developed to make Discord Bots faster.

This Discord Bot is *self-hosted,* you will need to host your own copy of the bot on a Server or in the Cloud. 

# Setup

This Section covers how to Setup and Run the Discord Bot

## Customizing Discorca

To create your own customized version of Discorca you can pull the repo and start coding. You will need Node and Docker to do so.

You can Clone Discorca to your own device using :

```bash
git clone https://github.com/Nano-DNA-Studios/Discorca
```

Start by updating NPM by using :

```bash
npm update
```

Now you can modify Discorca to your liking.

To build the new version of Discorca use the following command:

```bash
docker build -t container_name . 
```

And to upload to Docker use the following command :

```bash
docker push account_name/container_name
```

## Installing Discorca

The install and setup of Discorca was designed to be as simple as possible so that users can get to Calculations as fast as possible

Start by downloading the Discorca Image (replace mrdnalex/discorca with account_name/container_name if you customized Discorca) :

```bash
docker pull mrdnalex/discorca
```

Select a Folder to Host the Bot Mounts and then run the following command :

```bash
docker run -it --name discorca --restart=always --shm-size=100G -v path/to/settings:/OrcaBot/Resources -v path/to/job/archive:/OrcaJobs mrdnalex/discorca
```

Here is an example for my personal Server : 

```bash
docker run -it --name discorca --restart=always --shm-size=100G -v /home/mrdna/Projects/Discorca/Settings:/OrcaBot/Resources -v /home/mrdna/Projects/Discorca/OrcaJobs:/OrcaJobs mrdnalex/discorca
```

You will now be prompted for Discord Bot Token, the Bot Account and Token can be setup through the following tutorial : [Discord Bot Setup Tutorial](https://github.com/Nano-DNA-Studios/DNA-Discord-Framework)

## Setting Discorca Settings

Now that the Bot is Running, you can start using Discorca commands, but first you must setup some bot info and register users.

Use the /setup command to setup the bot, it will prompt for the following

- Hostname : Hostname of Device/Server (Often just IP Address)
- Mount Location : Paste in the path you selected for path/to/job/archive
- MaxZipFile : The maximum allowable Zip file size to send over Discord (Modified through server boosts)
- Port : The SSH Port to login to device (Set to 0 if you don’t need to specify ports for SSH)
- Calculation Channel : The Text/Chat Channel the Bot will send Calculation Results to

Once set, you will need to register yourself as a user by using /registersync, it will prompt for :

- User : The Username of the Server’s account (The user you SSH into)
- Download Location : The Absolute Path to the Folder you want to SCP copy files on your personal Device.

Other users will need to register themselves using /registersync, after this, Discorca can be used to it’s fullest. Happy Calculations!

# Commands

The Following section covers the Commands that can be run through the Orca Bot, it will go over what the Command does,  how to use it, the Options associated with the Command and it's results

All Commands can be Used by typing `/commandname`, you will need to make sure the Command Name is written in **Lower Case** and has **No Spaces**. Commands will appear through a Window above the Text Box and you can you Arrow Keys and Enter to Select a Command for Auto Completion

---

## Archive

Lists the Job Archive on the Device

### Options

None

![image](https://github.com/user-attachments/assets/e9e2c1c5-199e-4b9f-972a-215be491fffb)

## Download

Sends the Full Archive File as a Ephemeral Message, or returns the SCP Copy Command to Download to your Device

### Options *(Required)*

**Archive Name** : The Exact Name of the Archive you want to Download

![image](https://github.com/user-attachments/assets/c3af7945-3960-47c9-b910-670539b82c9d)

## Orca

Runs an Orca Calculation on the Server

### Options *(Required)*

**Input File** : Orca Input file to run

**XYZ File 1** : Additional XYZ File that can be referenced

**XYZ File 2** : Additional XYZ File that can be referenced

**XYZ File 3** : Additional XYZ File that can be referenced

**XYZ File 4** : Additional XYZ File that can be referenced

**XYZ File 5** : Additional XYZ File that can be referenced

![image](https://github.com/user-attachments/assets/c7c97d2d-7234-461c-b9d2-0554c3f000d5)

## Python

Runs a Python Job on the Server and returns the results

### Options *(Required)*

**Python Package** : The Python Package containing essential files and the code to run

## Purge

Allows the User to Purge the Jobs Directory or the Job Archive Directory

### Options *(Required)*

**Purge Type** : The type of Purge to run (Jobs or Archive)

![image](https://github.com/user-attachments/assets/bdbefd36-fc35-45a3-bc99-0295bc1d909a)

## Register Sync

Registers a new User for Syncing

### Options *(Required)*

**User** : The Username of the Server’s account (The user you SSH into)

**Download Location** : The Absolute Path to the Folder you want to SCP copy files on your personal Device.

![image](https://github.com/user-attachments/assets/397c5b61-a2d6-4324-a7df-cde7dff41fd5)

## Setup

Sets up Discorca for the first time by setting SSH info and preferences.

### Options *(Required)*

Hostname : Hostname of Device/Server (Often just IP Address)

Mount Location : Paste in the path you selected for path/to/job/archive

MaxZipFile : The maximum Zip file size to send over Discord (Modified through server boosts)

Port : The SSH Port to login to device (Set to 0 if you don’t need to specify ports for SSH)

Calculation Channel : The Text/Chat Channel the Bot will send Calculation Results to

![image](https://github.com/user-attachments/assets/a633085d-9ff6-434d-9e3c-eece2b483471)

## Status

Displays Discorca’s Status, Resource Usage and Current running jobs

### Options

None

![image](https://github.com/user-attachments/assets/903155ad-a052-4012-997a-db0eae1d8859)

## Sync

Syncs your Personal Device with the Archive on the Server

### Options

None

![image](https://github.com/user-attachments/assets/1f66c4c5-cc0d-4158-b7fc-e337727338fc)

---

## Developpers

Developer and Creator : [MrDNAlex](https://github.com/MrDNAlex)
