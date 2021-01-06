# Projects Index (name TBD)
[Web page here](https://ebi-ait.github.io/projects-index/)

## Updating Projects

Data for the UI is in `data/data.json` and is created/updated by running the `scraper.py` script. Please use the `data/published_uuids.txt` to run the scraper. Deleting a project UUID from `published_uuids.txt` will also remove the project from `data.json`.

**You will need Python3 to run the script**

1. `cd data`
2. Update `published_uuids.txt` as per requirements
3. `./scraper.py`
4. Commit and push the changes in git

_Note: Running `./scraper.py --help` will show other options available. In particular the `--clean` flag may be useful._

## Dev notes

### Tech used

- [Prettier](https://prettier.io/)
  - For code formatting
- Github pages
  - Static hosting
- GitHub actions
  - Continuous Integration/Deployment
- Python
  - For scraping data
- JSON
  - For serving data
- [Riot](https://riot.js.org/)
  - For view components
  - Chosen as very lightweight and has a similiar template syntax to Angular so should be easy to migrate
  - Shares a similiar design princible to React but without JSX/HTML in JS
- [Jest](https://jestjs.io/)
  - For unit tests

### Design

The current implementation of this project circumvents the need to create a new endpoint in Ingest API by using a Python scraper to gather data for projects. The `/projects/` endpoint in Ingest API is protected but the `projects/search/findByUuid` endpoint is not. The scraper uses a list of Project UUIDs and gathers required data from each project and collates the data into a JSON file that is served by GitHub pages.

A more robust approach would be to create a new `/projects/published` endpoint in Ingest API that is public. This endpoint would serve the same data that the JSON file contains. However, this requires further development and would also need the addition of a UI component to allow wranglers to flag a project as published. For now, this approach has not been done due to time requirements.

Since a new endpoint in Ingest API will eventually be created, the JSON file created by the scraper aims to be as close to the response created by the future endpoint as possible. This will mitigate the need for future changes on the client when a new endpoint is created. On the client, `js/resolver.js` requests data and transforms it to a format that is shown in the UI (i.e. transforms timestamps).

### Deployments

Deployments are done using GitHub actions on push to master. Two jobs are performed:

- Prettier
- Deployment
  - Runs unit tests
  - Runs build
  - Deploys to GitHub pages
    - `data.json` is copied to GitHub pages branch
      - If the build fails for some reason, live data will not be affected as this copy step won't be ran
    - `dist/` is copied to GitHub pages branch
