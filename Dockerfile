FROM node:16-buster-slim

#Set the working directory
WORKDIR  /usr/src/app
# Copy all other source code to work directory
COPY . /usr/src/app

COPY package*.json ./

RUN apt-get update && \
    apt-get install -y build-essential \
    wget \
    python3 \
    make \
    gcc \
    libc6-dev

# Install dependencies
RUN cd /usr/src/app; \
    yarn
#build prodject
ENV NODE_ENV=production


RUN yarn build

# expose port and define CMD

# USER node

EXPOSE 3040 80


CMD [ "yarn", "start" ]

