FROM node:22-bookworm-slim

# Prisma's engines link against OpenSSL.
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts --no-audit --no-fund

COPY . .
# Generate the client and fetch the migration engine at build time so the container needs no download at start.
RUN npx prisma generate && npx prisma -v >/dev/null && npm run build && chown -R node:node /app

USER node
ENV NODE_ENV=production HOST=0.0.0.0 PORT=8080
EXPOSE 8080
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/app.js"]
