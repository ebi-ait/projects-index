#!/usr/bin/env python3
import getopt, argparse, json, requests

def get_data(uuid):
    try:
        proj_url = f"https://api.ingest.archive.data.humancellatlas.org/projects/search/findByUuid?uuid={uuid}"
        print(f"Getting project from {proj_url}")
        proj = requests.get(proj_url).json()
    
        # TODO When retrieving this info in the UI make sure that it is agnostic to thet data format as this just pulls info but when switching to using API will use schema
        return {
            "project_uuid": uuid,
            "project_core": proj["content"]["project_core"],
            "contributors": proj["content"]["contributors"],
            "accession_links": {
                "ena": make_ena_links(proj),
                "ae": make_ae_links(proj)
            },
            "publication_links": make_pub_links(proj)
        }
    except:
        raise Exception("Something went wrong. Is this a valid project UUID?")

def get_uuids(input_file):
    with open(input_file, "r") as file:
        return file.read().splitlines()

def make_ae_links(proj):
    try:
        return [f"https://identifiers.org/arrayexpress:{acc}" for acc in proj["content"]['array_express_accessions']]
    except KeyError:
        return []

def make_ena_links(proj):
    try:
        return [f"https://identifiers.org/ena.embl:{acc}" for acc in proj["content"]['insdc_project_accessions']]
    except KeyError:
        return []

def make_pub_links(proj):
    try:
        doi_list = [x['doi'] for x in proj["content"]['publications']]
        return [f"https://doi.org/{doi}" for doi in doi_list]
    except KeyError:
        return []

if __name__ == "__main__":
    description = "Scrape Ingest API for published projects data."
    parser = argparse.ArgumentParser(description=description)

    parser.add_argument("-i", "--input", help="File containing a list of UUIDs to scrape. Each UUID must be on a new line.", default="published_uuids.txt")
    parser.add_argument("-o", "--output", help="Output JSON file", default="data.json")

    args = parser.parse_args()

    uuids = get_uuids(args.input)

    with open(args.output, 'r+') as out:
        existing_data = json.load(out) or []
        # Use a hashmap to ensure no duplicates but allow updates
        hashmap = { x["project_uuid"] : x for x in existing_data}
        out.seek(0)
        
        for uuid in uuids:
            hashmap[uuid] = get_data(uuid)

        for uuid in list(hashmap.keys()):
            if uuid not in uuids:
                print(f"Removing {uuid} from data...")
                del hashmap[uuid]
        
        json.dump(list(hashmap.values()), out)    
        out.truncate()