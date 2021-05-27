FROM quay.io/ebi-ait/ingest-base-images:trion_ng-cli-karma_12.0.0 as builder

WORKDIR /app
COPY . /app
RUN npm install -g @angular/cli
RUN npm install && ng run test && npm run build

FROM nginxinc/nginx-unprivileged:1.17.2-alpine

COPY docker-assets/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/ /usr/share/nginx/html/humancellatlas/project-catalogue

USER 101
