FROM mrdnalex/orca:latest

#Change to root user
USER root

# Set the Node.js version
ENV NODE_VERSION=20.11.1

# Download and install Node.js
RUN cd /tmp \
    && curl -O https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz \
    && tar -xJf node-v$NODE_VERSION-linux-x64.tar.xz -C /usr/local --strip-components=1 \
    && rm node-v$NODE_VERSION-linux-x64.tar.xz

# Install npm
RUN apt-get update && apt-get install -y npm python3 python3-pip
#RUN apt-get install npm -y
#RUN apt-get install python3 -y
#RUN apt-get update && apt-get install --fix-missing python3-pip -y

# Make a Folder for the Bot and a Folder for the Orca Jobs to Run
RUN mkdir /OrcaBot && \
    mkdir /DiscorcaJobs
#RUN mkdir /DiscorcaJobs

#Changes the owner of the Orca Jobs folder to the orca user
RUN sudo chmod -R 775 /DiscorcaJobs && \
    sudo chown -R orca:orca /DiscorcaJobs && \
    sudo chown -R orca:orca /OrcaBot && \
    sudo chmod -R 775 /OrcaBot

#RUN sudo chmod -R 775 /OrcaBot
#RUN sudo chown -R orca:orca /OrcaBot
#RUN sudo chown -R orca:orca /DiscorcaJobs

# Copy Bot Files into it's folder
COPY . /OrcaBot

# Set Work directory inside the bot folder
WORKDIR /OrcaBot

# Install the necessary packages
#RUN npm install
#RUN npm update

# Change to the orca user
USER orca

#Starts the Bot
CMD ["node", "/OrcaBot/index.js"]