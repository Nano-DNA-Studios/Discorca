FROM mrdnalex/orca:latest

USER root

# Update and install necessary packages
RUN apt-get update && apt-get upgrade -y && apt-get install -y curl xz-utils build-essential && apt-get install -y sudo


# Set the Node.js version
ENV NODE_VERSION=20.11.1

# Download and install Node.js
RUN cd /tmp \
    && curl -O https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz \
    && tar -xJf node-v$NODE_VERSION-linux-x64.tar.xz -C /usr/local --strip-components=1 \
    && rm node-v$NODE_VERSION-linux-x64.tar.xz

RUN apt-get install npm -y

WORKDIR /home/orca/OrcaBot

COPY . /home/orca/OrcaBot

RUN npm install

#RUN adduser orca sudo

#RUN echo 'orca ALL=(ALL) NOPASSWD: ALL' >> /etc/sudoers

#RUN chmod -R u+w /home/orca/OrcaBot

RUN chown -R orca /home/orca/OrcaBot

USER orca

CMD ["node", "index.js"]



