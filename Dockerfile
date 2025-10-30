FROM node:25-alpine
WORKDIR /usr/src/app
# Copy package files first for better caching
COPY package*.json ./
RUN npm ci && apk add --no-cache brotli
# Copy source code after dependencies
COPY . .
RUN npm run build


FROM alpine:3
# Install brotli module for nginx
RUN apk add --no-cache nginx nginx-mod-http-brotli
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY docker/default.conf /etc/nginx/conf.d/default.conf
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=0 /usr/src/app/dist-www /usr/share/nginx/html

# Expose port and start nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]