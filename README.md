# Projects Index (name TBD)

[Production](http://www.ebi.ac.uk/humancellatlas/project-catalogue)

[Development](http://wwwdev.ebi.ac.uk/humancellatlas/project-catalogue)

## Updating Projects

Data for the UI is in `data/data.json` and is created/updated by running the `scraper.py` script. Please use the `data/published_uuids.txt` to run the scraper. Deleting a project UUID from `published_uuids.txt` will also remove the project from `data.json`.

**You will need Python3 to run the script**

1. Create a new branch
1. `cd data`
1. Update `published_uuids.txt` as per requirements
1. `./scraper.py`
1. Commit and push the changes in git
1. Create a pull request and merge once unit tests have passed
1. This will be automatically deployed

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
- [Parcel](https://parceljs.org/)
  - For building
- [Babel](https://babeljs.io/)
  - JS transpilation
  - Different config for building (with Parcel) and unit tests (with Jest)
- [Yarn](https://yarnpkg.com/)
  - Package manager (instead of npm)

### Design

The current implementation of this project circumvents the need to create a new endpoint in Ingest API by using a Python scraper to gather data for projects. The `/projects/` endpoint in Ingest API is protected but the `projects/search/findByUuid` endpoint is not. The scraper uses a list of Project UUIDs and gathers required data from each project and collates the data into a JSON file that is served by GitHub pages.

A more robust approach would be to create a new `/projects/published` endpoint in Ingest API that is public. This endpoint would serve the same data that the JSON file contains. However, this requires further development and would also need the addition of a UI component to allow wranglers to flag a project as published. For now, this approach has not been done due to time requirements.

Since a new endpoint in Ingest API will eventually be created, the JSON file created by the scraper aims to be as close to the response created by the future endpoint as possible. This will mitigate the need for future changes on the client when a new endpoint is created. On the client, `js/resolver.js` requests data and transforms it to a format that is shown in the UI (i.e. transforms timestamps).

### Deployments

All changed in `master` are automatically deployed to the dev environment. In order to deploy to the production environment, follow the below steps:

1. Make sure you have the [`git release`](https://github.com/rdgoite/hca-developer-tools/blob/master/gitconfig) command in your gitconfig.
2. `git checkout master`
3. `git log` -> check latest commit is the commit to be released
4. `git release`

The project catalogue is deployed to the `web-development` k8s cluster and the process is managed in the `ebiwd` namespace in [GitLab](http://gitlab.ebi.ac.uk/). If there are any problems with deployments, you can contact [www-dev@ebi.ac.uk](mailto:www-dev@ebi.ac.uk) and reference ticket `#473703`.

#### Continuous Integration

CI is done using GitHub actions (see `.github/workflows/ci.yml`) on every pull request. Two jobs are performed:

### Developing

- `yarn start`
  - Will spin up the dev server
- `yarn test:watch`
  - Run the unit tests in watch mode
