FROM node

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --force

COPY . .

CMD [ "npm", "start" ]