FROM node

RUN npm install -g serve

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --force

COPY . .

RUN npm run build

CMD [ "serve", "-s", "build"]