# pull the base image
FROM node:22.16

# set the working direction
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./

COPY package-lock.json ./

# fix .cache dir error
RUN mkdir -p /app/node_modules
RUN chown node:node /app/node_modules

RUN npm install

# add app
# -> docker-compose.yml
COPY . ./

# start app
CMD ["npm", "start"]