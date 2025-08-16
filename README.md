# Introduction

Hello, I started this project to play around with creating a telegram bot as well as finally making a dockerized application as I have been very into Docker and wanted to try to deploy my very own coded Docker container! This is just a fun project, if you wish to add on to the project or improve it feel free! 

## Motivations

I got this idea from browsing through [data.gov](https://data.gov.sg/) and came across 2 Apis related to obtaining HDB Carpark Information and Carpark Availability, I figured by combining these 2 it can create a cool idea of helping people navigate to the nearest car park from their destination

## Getting Started

This brief explainer assumes that you have a version of Node and a Node package manager (e.g., npm, Yarn, or pnpm) installed. There are 2 ways to run the bot, either locally or through docker

### Getting Started: Locally

1. To get started with the repository, first clone the repository and change your working directory:

   ```
   git clone https://github.com/warrenkenzie/JustParkLah.git && cd JustParkLah
   ```

2. Install the required dependencies.

   ```
   npm i
   ```

3. Contact [BotFather](http://t.me/BotFather) to create a bot and keep note of the key. Do not share this key, anyone who has access to this key has access to your telegram bot.

4. Create a MongoDB database and keep note of its address. Do not share this key as well.

   > Currently, I am utilising a MongoDB database with docker, you can do the same if you have docker engine installed and download the [MongoDB database community with docker](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-community-with-docker)   
   
5. Create an environment variable file (`.env`) and add your secrets inside, there are other environmental variables in the file, do note those are not required to be changed and just act as truths:

   ```
   TELEGRAM_BOT_TOKEN=enter the key provided by BotFather
   DB_CONN_STRING=enter MongoDB address here
   ```

   You may use the `.env.example` file as an example.

6. Compile the Typescript files into Javascript files.

   ```
   npm run build 
   ```

7. before running the bot, run 2 scripts to initialise the MongoDB database.
   ```
   node /app/build/script/UpdateCarParkAvailability.js
   node /app/build/script/UpdateHDBCarparkInformation.js
   ```

8. Then run the bot by the following command
   ```
   npm run start
   ```
There you go, now you can go and interact with your bot in telegram.
**Disclaimer**
Running through the above method will help start the bot, however it does not include the running of scripts at scheduled times which would run in start.sh file which is intended for Dockerfile, will attempt to remedy this in the future.

### Getting Started: Docker

This brief explanation assumes you have docker installed

1. you only need to run one command, replace the placeholders with < and > with their respective variables, do note if you are using a MongoDB on your laptop/pc, you would have to indicate the ip address of your machine and not localhost, example is instead of "mongodb://localhost:27017", you would need to insert "mongodb://yourMachineIP:27017"
   ```
   docker run -d --name justparklah -e TELEGRAM_BOT_TOKEN='<add token>' -e DB_CONN_STRING='<add mongodb url>' warken/justparklah:latest
   ```

## Contributing

If you’d like to dive into the source code, suggest improvements, or share feedback, your involvement is greatly appreciated.

Found an [issue](https://github.com/warrenkenzie/JustParkLah/issues/new) — whether it’s a typo, grammatical mistake, visual glitch, or any other odd behavior? Please don’t hesitate to open an issue.

If you’d like to leave comments on the source code — such as ideas for design improvements, code optimizations, or general feedback — feel free to create an [issue](https://github.com/warrenkenzie/JustParkLah/issues/new) as well. Any feedback received is valued and appreciated - whether big or small, it helps make the project better and me learning more!

## Licence

This repository is made open-source with the [MIT License](https://github.com/warrenkenzie/JustParkLah/blob/main/LICENSE.md), meaning that you are allowed to modify and distribute the source code as well as use it for private and commercial use provided that the licence and copyright notices are retained. For more information, visit the link above to learn what is permitted by the licence.
