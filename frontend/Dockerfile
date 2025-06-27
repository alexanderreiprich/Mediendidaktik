# Build Stage
FROM node:22.16-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

# Production Stage – Serve static build via `serve`
FROM node:22.16-alpine

WORKDIR /app

# Install `serve` globally to host the build folder
RUN npm install -g serve

# Copy built app from previous stage
COPY --from=build /app/build /app/build

# Expose default serve port
EXPOSE 3000

# Run the static site
CMD ["serve", "-s", "build", "-l", "3000"]