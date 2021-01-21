FROM ebiwd/node-bower-gulp:12 as builder

WORKDIR /app
COPY . /app
ENV NODE_ENV production
RUN yarn global add parcel-bundler
RUN yarn install --frozen-lockfile && yarn build && yarn test
RUN cp data/data.json dist/data.json

FROM nginxinc/nginx-unprivileged:1.17.2-alpine

COPY docker-assets/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/ /usr/share/nginx/html/humancellatlas/project-catalogue

USER 101
