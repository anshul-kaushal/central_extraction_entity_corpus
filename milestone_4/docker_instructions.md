# Load Docker Image
Grab `group_9_corpus.tar` from Google Drive. Navigate to the download location and run
```shell
docker load < group_9_corpus.tar
```
# Run Docker Image
```shell
docker run -it --rm -p 8080:8080 -p 9999:9999 group_9_corpus
```

# Open URL in Browser

http://localhost:8080

# Testing Guidelines
1. Wait 1 minute after running the docker image before tesing in the browser
2. Check that the "about" and "analysis" pages load sucessfully and the the "analysis" page should display 3 graphs.
3. In the corpus page, every page shows 10 documents. The entire corpus contains 500 documents and should have 50 pages.
4. Search a few keywords that might appear in news articles about films.
Select "Text", "Central Entity" or "All" to search keywords only within these sections (make sure to deselect the previous one before selecting a new option)
5. Filter annotated central entities types by selecting the types under "Select Entity Type". Make sure only documents of the selected types appear in the results.
6. Click "download corpus" and the entire corpus in tsv format should be downloaded.