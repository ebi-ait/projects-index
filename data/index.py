#!/usr/bin/env python3
import requests, json, argparse

INDEXED_FIELDS = [
    {
        "field": "content.project_core.project_title",
        "type": "string"
    },
    {
        "field": "content.project_core.project_description",
        "type": "string"
    },
    {
        "field": "uuid",
        "type": "string"
    },
    {
        "field": "content.contributors.name",
        "type": "strings"
    },
    {
        "field": "content.contributors.institution",
        "type": "strings"
    },
     {
        "field": "content.contributors.laboratory",
        "type": "strings"
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
def flatten_json(y):
    out = {}

    def flatten(x, name=''):
        if type(x) is dict:
            for a in x:
                flatten(x[a], name + a + '.')
        else:
            out[name[:-1]] = x

    flatten(y)
    return out

def index_data(solr_url, core, data):
    required_fields = [x["field"] for x in INDEXED_FIELDS]
    split_on = "content.contributors"
    required_fields_formatted = []
    for field in required_fields:
        split = field.replace(f'{split_on}.', f'{split_on}/')
        required_fields_formatted.append(f'{field}:/{split}')
    print(required_fields_formatted)
    
    print(f"Indexing {len(data)} projects...")
    
    for data_point in data:
        flattened_json = flatten_json(data_point)
        print(flattened_json)
        res = requests.post(
            f"{solr_url}/{core}/update/json/docs",
            params={
                "split": f'/{split_on}',
                "f": required_fields_formatted,
            },
            json=flattened_json
        ).json()
        
        if 'errors' in res:
            raise Exception(res['errors'])


if __name__ == "__main__":
    description = "Index data in Solr for the projects index. This will also create the relevent schema. Make sure Solr is up and running before executing this."
    parser = argparse.ArgumentParser(description=description)

    parser.add_argument("-i", "--input", help="File containing JSON data to index", default="data.json")
    parser.add_argument("-s", "--url", help="URL to Solr instance", default="http://localhost:8983/solr")
    parser.add_argument("-x", "--core", help="Name of core/collection", default="projects")

    args = parser.parse_args()

    with open(args.input, 'r+') as infile:
        data = json.load(infile)
        if not data:
            raise IOError("Input file is empty")

        # create_schema(args.url, args.core, data)
        index_data(args.url, args.core, data[:10])

    print("Indexing complete. It will take a few minutes for Solr to complete searching.")