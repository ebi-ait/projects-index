import requests

def get_organs(project_uuid):
    try:
        organ_dict = {}
        proj_resp = requests.get("https://api.ingest.archive.data.humancellatlas.org/projects/search/findByUuid?uuid={}".format(project_uuid))
        sub_env_resp = requests.get(proj_resp.json()['_links']['submissionEnvelopes']['href'])
        for sub_env in sub_env_resp.json()['_embedded']['submissionEnvelopes']:
            biomaterials = requests.get(sub_env['_links']['biomaterials']['href']).json()['_embedded']['biomaterials'] 
            for bio in biomaterials:
                try: 
                    organ_dict[bio['content']['organ']['ontology_label']] = bio['content']['organ']['ontology']
                except KeyError:
                    pass
                try:
                    organ_dict[bio['content']['model_organ']['ontology_label']] = bio['content']['model_organ']['ontology']
                except:
                    pass
        return organ_dict
    except KeyError:
        return None

def get_organ_parts(project_uuid):
    try:
        organ_dict = {}
        proj_resp = requests.get("https://api.ingest.archive.data.humancellatlas.org/projects/search/findByUuid?uuid={}".format(project_uuid))
        sub_env_resp = requests.get(proj_resp.json()['_links']['submissionEnvelopes']['href'])
        for sub_env in sub_env_resp.json()['_embedded']['submissionEnvelopes']:
            biomaterials = requests.get(sub_env['_links']['biomaterials']['href']).json()['_embedded']['biomaterials']
            for bio in biomaterials:
                try: 
                    for part in bio['content']['organ_parts']:
                        organ_dict[part['ontology_label']] = part['ontology']
                except KeyError:
                    pass
                try:
                    for part in bio['content']['model_organ_parts']:
                        organ_dict[part['ontology_label']] = part['ontology']
                except:
                    pass
        return organ_dict
    except KeyError:
        return None

def make_ae_links(project_content):
    try:
        return ["https://identifiers.org/arrayexpress:{}".format(acc) for acc in project_content['array_express_accessions']]
    except KeyError:
        return None

def make_ena_links(project_content):
    try:
        return ["https://identifiers.org/ena.embl:{}".format(acc) for acc in project_content['insdc_project_accessions']]
    except KeyError:
        return None

def make_pub_links(project_content):
    try:
        doi_list = [x['doi'] for x in project_content['publications']]
        return ["https://doi.org/{}".format(doi) for doi in doi_list]
    except KeyError:
        return None