FROM node:25-alpine
WORKDIR /usr/src/app
# Copy package files first for better caching
COPY package*.json ./
RUN npm ci
# Install brotli for compression
RUN apk add --no-cache brotli
# Copy source code after dependencies
COPY . .
RUN npm run build


FROM nginx:1-alpine
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY docker/default.conf /etc/nginx/conf.d/default.conf
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=0 /usr/src/app/dist /usr/share/nginx/html