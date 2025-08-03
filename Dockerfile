# Use a lightweight Node image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci --no-audit

# Copy all source files
COPY . .

# ✅ TEMP DATABASE_URL to allow prisma generate during build
ENV DATABASE_URL="postgresql://user:password@localhost:5432/fake"

# Generate Prisma client (doesn't need to connect — just needs format)
RUN npx prisma generate

# Build your Next.js app
RUN npm run build

# Set production mode
ENV NODE_ENV=production

# Expose port (default for Next.js)
EXPOSE 3000

# ✅ REAL migrations run at runtime (will use DATABASE_URL from Fly secrets)
CMD npx prisma migrate deploy && npm start
