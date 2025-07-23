# --------- Step 1: Build Vite App ---------
FROM node:18-alpine AS builder
WORKDIR /app

# Accept backend URL as build-time argument
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Inject VITE_BACKEND_URL into .env.production
RUN echo "VITE_BACKEND_URL=$VITE_BACKEND_URL" > .env.production

# Build the Vite app
RUN npm run build

# --------- Step 2: Serve with NGINX ---------
FROM nginx:stable-alpine AS production

# Copy the built app to NGINX web root
COPY --from=builder /app/dist /usr/share/nginx/html

# Use custom NGINX config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to host
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
