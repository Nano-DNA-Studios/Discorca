FROM mrdnalex/orca:latest

#Change to root user
USER root

# Update and install necessary packages
RUN apt-get update && apt-get upgrade -y && apt-get install -y curl xz-utils build-essential

# Set the Node.js version
ENV NODE_VERSION=20.11.1

# Download and install Node.js
RUN cd /tmp \
    && curl -O https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz \
    && tar -xJf node-v$NODE_VERSION-linux-x64.tar.xz -C /usr/local --strip-components=1 \
    && rm node-v$NODE_VERSION-linux-x64.tar.xz

# Install npm
RUN apt-get install npm -y

# Change working directory for npm to install properly
WORKDIR /home/orca/OrcaBot

# Copy Bot Files into it's folder
COPY . /home/orca/OrcaBot

# Install the necessary packages
RUN npm install

# Changes the owner of the bot files to the orca user
RUN chown -R orca /home/orca/OrcaBot

# Change to the orca user
USER orca

#Starts the Bot
CMD ["node", "index.js"]
