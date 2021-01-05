# Projects Index (name TBD)

## Updating Projects

Data for the UI is in `data/data.json` and is created/updated by running the `scraper.py` script. Please use the `data/published_uuids.txt` to run the scraper. Deleting a project UUID from `published_uuids.txt` will also remove the project from `data.json`.

**You will need Python3 to run the script**

1. `cd data`
2. Update `published_uuids.txt` as per requirements
3. `./scraper.py`
4. Commit and push the changes in git

_Note: Running `./scraper.py --help` will show other options available. In particular the `--clean` flag may be useful._
