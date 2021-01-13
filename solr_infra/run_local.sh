#! /usr/bin/bash
docker rm solr_infra_solr_1 -f
docker volume rm solr_infra_data -f
docker-compose up -d
sleep 10;