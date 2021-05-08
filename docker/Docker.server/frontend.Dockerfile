FROM nikolaik/python-nodejs:python3.9-nodejs12

#RUN mkdir /app
#WORKDIR /app
#COPY . .

WORKDIR /home/app
COPY package.json package.json
RUN yarn
COPY . .
#RUN apt-get update --fix-missing && \
#  apt-get -y --force-yes install emacs git
#ADD .env /home/app
#ADD . /home/app
#C#OPY . /app/
#COPY ./src /app/src/

#RUN git clone https://github.com/nicholasdickey/coding-challenge.git
#RUN yarn

CMD ["yarn","start:js"]