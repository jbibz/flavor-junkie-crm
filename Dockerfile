# --- STAGE 1: BUILD THE APPLICATION ---
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# --- STAGE 2: SERVE THE FINAL ARTIFACTS WITH NGINX ---
FROM nginx:stable-alpine AS production

# Copy the optimized build from the 'builder' stage into Nginx's web root
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration to handle Vite/SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the standard HTTP port 80
EXPOSE 80

# Command to start Nginx
CMD ["nginx", "-g", "daemon off;"]
