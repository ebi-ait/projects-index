#!/usr/bin/env python3
import getopt, argparse, json, requests, time

def get_data(uuid):
    try:
        proj_url = f"https://api.ingest.archive.data.humancellatlas.org/projects/search/findByUuid?uuid={uuid}"
        print(f"Getting project from {proj_url}")
        proj = requests.get(proj_url).json()
    
        # TODO When retrieving this info in the UI make sure that it is agnostic to thet data format as this just pulls info but when switching to using API will use schema
        desired_content_keys = ["project_core", "contributors", "array_express_accessions", "insdc_project_accessions"]
        
        return {
            "added_to_index": int(time.time()),
            "content": {k: proj["content"].get(k, None) for k in desired_content_keys},
            "uuid": uuid,
            "dcp_url": make_dcp_link(uuid),
            "publications": get_publications_journal(proj["content"]["publications"]) if "publications" in proj["content"] else None
        }
    except:
        raise Exception("Something went wrong. Is this a valid project UUID?")

def get_uuids(input_file):
    with open(input_file, "r") as file:
        return file.read().splitlines()

def make_dcp_link(prj_uuid):
    # TODO This should probably be replicated in the ingest API once we move there
    catalog = "dcp2"
    azul_proj_url = "https://service.azul.data.humancellatlas.org/index/projects/{}?catalog={}".format(prj_uuid, catalog)
    if requests.get(azul_proj_url):
        return "https://data.humancellatlas.org/explore/projects/{}?catalog={}".format(prj_uuid, catalog)
    else:
        return None

def get_publications_journal(publications):
    # Use crossref API to get extra meta info
    # This should be replicated in ingest API endpoint when we have one
    # Not done on client side for speed
    results = []
    for publication in publications:
        try:
            crossref = requests.get(f"https://api.crossref.org/works/{publication['doi']}").json()['message']
            if len(crossref['container-title']) > 0:
                journal_title = crossref['container-title'][0]
            elif "name" in crossref['institution']:
                journal_title = crossref['institution']['name']
            else:
                journal_title = crossref['publisher']

            results.append({
                "doi": publication['doi'],
                "url": crossref['URL'],
                "journal_title": journal_title,
                "title": publication['title'],
                "authors": publication['authors']
            })
        except:
            print(f"Something went wrong retrieving metainformation for publication {publication['doi']}")
    return results

if __name__ == "__main__":
    description = "Scrape Ingest API for published projects data."
    parser = argparse.ArgumentParser(description=description)

    parser.add_argument("-i", "--input", help="File containing a list of UUIDs to scrape. Each UUID must be on a new line.", default="published_uuids.txt")
    parser.add_argument("-o", "--output", help="Output JSON file", default="data.json")
    parser.add_argument("-c", "--clean", help="Do a clean run. Will update all timestamps.", action="store_true")

    args = parser.parse_args()

    uuids = get_uuids(args.input)

    if args.clean:
        print("Running with clean option. This will update preexisting timestamps.")

    with open(args.output, 'r+') as out:
        existing_data = json.load(out) or []
        # Use a hashmap to ensure no duplicates but allow updates
        hashmap = { x["uuid"] : x for x in existing_data}
        out.seek(0)
        
        for uuid in uuids:
            old_timestamp = None
            if uuid in hashmap and "added_to_index" in hashmap[uuid] and not args.clean:
                print(f"{uuid} already in data, updating...")
                old_timestamp = hashmap[uuid]["added_to_index"]

            hashmap[uuid] = get_data(uuid)

            if old_timestamp:
                hashmap[uuid]["added_to_index"] = old_timestamp

        for uuid in list(hashmap.keys()):
            if uuid not in uuids:
                print(f"Removing {uuid} from data...")
                del hashmap[uuid]
        
        json.dump(list(hashmap.values()), out, indent=4)
        out.truncate()