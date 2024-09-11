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
RUN apt-get install npm -y

# Make a Folder for the Bot and a Folder for the Orca Jobs to Run
<<<<<<< Updated upstream
RUN mkdir /OrcaJobs \
    mkdir /OrcaJobs/Jobs \
    mkdir /OrcaJobs/Archive
=======
RUN mkdir /OrcaJobs && mkdir /OrcaBot
RUN cd /OrcaJobs && mkdir Job && mkdir Archive
>>>>>>> Stashed changes

#RUN mkdir /OrcaBot \
#    mkdir /OrcaJobs 

#RUN mkdir /OrcaJobsArchive

#Changes the owner of the Orca Jobs folder to the orca user
RUN chown -R orca /OrcaJobs
#RUN chown -R orca /OrcaJobsArchive
RUN chown -R orca /OrcaBot

# Copy Bot Files into it's folder
COPY . /OrcaBot

# Set Work directory inside the bot folder
WORKDIR /OrcaBot

# Install the necessary packages
RUN npm install
RUN npm update

# Change to the orca user
USER orca

#Starts the Bot
CMD ["node", "/OrcaBot/index.js"]