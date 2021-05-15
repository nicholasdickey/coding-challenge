FROM nikolaik/python-nodejs:python3.9-nodejs12

#RUN mkdir /app
#WORKDIR /app
#COPY . .


#RUN apt-get update --fix-missing && \
#  apt-get -y --force-yes install emacs git
#ADD .env /home/app
#ADD . /home/app
#C#OPY . /app/
#COPY ./src /app/src/

#RUN git clone https://github.com/nicholasdickey/coding-challenge.git
WORKDIR /home/app/node-server
COPY node-server/package.json package.json
RUN yarn

#ENTRYPOINT /bin/bash
RUN yarn add ts-node typescript
RUN yarn global add ts-node

WORKDIR /home/app

COPY package.json package.json
RUN yarn
COPY . .
CMD ["yarn","start"]