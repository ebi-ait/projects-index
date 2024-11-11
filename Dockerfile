FROM quay.io/ebi-ait/ingest-base-images:trion_ng-cli-karma_12.0.0 as builder

ARG DEPLOYMENT_ENV
ENV DEPLOYMENT_ENV $DEPLOYMENT_ENV
RUN echo "Environment: ${DEPLOYMENT_ENV}"

WORKDIR /app
COPY . /app

RUN yarn global add @angular/cli@13.3.3
RUN yarn install && yarn test && yarn run build-${DEPLOYMENT_ENV} && rm -rf node_modules

FROM nginxinc/nginx-unprivileged:1.27-alpine

COPY docker-assets/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/projects-index /usr/share/nginx/html/humancellatlas/project-catalogue

USER 101
