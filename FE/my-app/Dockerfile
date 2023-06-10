FROM node

RUN npm install -g serve

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --force

COPY . .

CMD [ "npm", "start"]
