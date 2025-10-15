FROM node 

WORKDIR /front-end

COPY package*.json ./ 

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm", "run", "start"]

