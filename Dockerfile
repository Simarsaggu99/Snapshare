FROM node

WORKDIR /app 

COPY package*.json ./

RUN npm install 

WORKDIR /app/frontend-user

COPY frontend-user/package*.json ./

RUN npm install 

WORKDIR /app 

COPY . .1

EXPOSE 5000 

CMD ["npm","run","dev"]