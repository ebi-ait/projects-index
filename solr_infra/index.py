#!/usr/bin/env python3
import requests, json, argparse

INDEXED_FIELDS = [
    {
        "field": "content.project_core.project_title",
        "type": "text_general"
    },
    {
        "field": "content.project_core.project_description",
        "type": "text_general"
    },
    {
        "field": "uuid",
        "type": "string"
    },
    {
        "field": "content.contributors.names",
        "type": "text_general",
        "multivalued": "true"
    },
    {
        "field": "content.contributors.institutions",
        "type": "text_general",
        "multivalued": "true"
    },
     {
        "field": "content.contributors.laboratories",
        "type": "text_general",
        "multivalued": "true"
    },
    {
        "field": "content.array_express_accessions",
        "type": "strings"
    },
     {
        "field": "content.geo_series_accessions",
        "type": "strings"
    },
    {
        "field": "content.insdc_project_accessions",
        "type": "strings"
    },
]

def create_schema(solr_url, core, data):
    requests.post(
        f"{solr_url}/{core}/config",
        json={
            "set-user-property": {
                "update.autoCreateFields": "false"
            }
        }
    )

    for field in INDEXED_FIELDS:
        print(f"Adding {field['field']} to schema")
        res = requests.post(
            f"{solr_url}/{core}/schema",
            json={
                "add-field": {
                    "name": field["field"],
                    "type": field["type"],
                    "stored": "true"
                }
            }
        ).json()
        
        if 'errors' in res:
            raise Exception(res['errors'])

def flatten_json(data):
    out = {}

    data["content.contributors.names"] = set()
    data["content.contributors.institutions"] = set()
    data["content.contributors.laboratories"] = set()

    for contributor in data["content"]["contributors"]:
        if "name" in contributor:
            data["content.contributors.names"].add(contributor["name"])
        if "institution" in contributor:
            data["content.contributors.institutions"].add(contributor["institution"])
        if "laboratory" in contributor:
            data["content.contributors.laboratories"].add(contributor["laboratory"])
    
    del data["content"]["contributors"]
    data["content.contributors.names"] = list(data["content.contributors.names"])
    data["content.contributors.institutions"] = list(data["content.contributors.institutions"])
    data["content.contributors.laboratories"] = list(data["content.contributors.laboratories"])

    def flatten(x, name=''):
        if type(x) is dict:
            for a in x:
                flatten(x[a], name + a + '.')
        else:
            out[name[:-1]] = x

    flatten(data)
    return out

def index_data(solr_url, core, data):
    required_fields_formatted = [f"/{x['field']}" for x in INDEXED_FIELDS]
    
    print(f"Indexing {len(data)} projects...")
    
    for data_point in data:
        flattened_json = flatten_json(data_point)
        res = requests.post(
            f"{solr_url}/{core}/update/json/docs",
            params={
                "f": required_fields_formatted,
                "commit": "true"
            },
            json=flattened_json
        ).json()
        
        if 'errors' in res:
            raise Exception(res['errors'])


if __name__ == "__main__":
    description = "Index data in Solr for the projects index. This will also create the relevent schema. Make sure Solr is up and running before executing this."
    parser = argparse.ArgumentParser(description=description)

    parser.add_argument("-i", "--input", help="File containing JSON data to index")
    parser.add_argument("-s", "--url", help="URL to Solr instance", default="http://localhost:8983/solr")
    parser.add_argument("-x", "--core", help="Name of core/collection", default="projects")

    args = parser.parse_args()

    with open(args.input, 'r+') as infile:
        data = json.load(infile)
        if not data:
            raise IOError("Input file is empty")

        create_schema(args.url, args.core, data)
        index_data(args.url, args.core, data)

    print("Indexing complete. It will take a few minutes for Solr to complete searching.")