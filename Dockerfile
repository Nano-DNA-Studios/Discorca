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



# Make a Folder for the Bot
RUN mkdir OrcaBot

# Copy Bot Files into it's folder
COPY . /OrcaBot

# CD into the bot folder
RUN cd /OrcaBot

# Set Work directory inside the bot folder
WORKDIR /OrcaBot

# Install the necessary packages
RUN npm install

# Go back to root
RUN cd ..

# Changes the owner of the bot files to the orca user
RUN chown -R orca /OrcaBot

# Change to the orca user
USER orca

#Starts the Bot
CMD ["node", "/OrcaBot/index.js"]
