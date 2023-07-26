# syntax=docker/dockerfile:1

# ---------- build ----------
FROM node:20-alpine AS build
WORKDIR /app

# Create React App inlines REACT_APP_* at build time, so the API URL is a build
# argument, not a runtime environment variable.
ARG REACT_APP_API_URL=/api
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV CI=true
ENV GENERATE_SOURCEMAP=false

# Dependencies first: this layer is reused until the lockfile changes.
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY tsconfig.json .eslintrc.js .prettierrc ./
COPY public ./public
COPY src ./src

RUN yarn lint && yarn build

# ---------- runtime ----------
FROM nginx:1.27-alpine AS runtime

# Static assets and a config with the SPA fallback client side routing needs.
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html

# Run unprivileged: nginx listens on 8080 and writes its temporary files and
# pid somewhere the nginx user owns.
RUN sed -i 's!^pid .*!pid /tmp/nginx.pid;!' /etc/nginx/nginx.conf \
  && mkdir -p /tmp/nginx-cache \
  && chown -R nginx:nginx /tmp/nginx-cache /usr/share/nginx/html

USER nginx
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --spider -q http://127.0.0.1:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
