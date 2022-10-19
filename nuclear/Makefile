
.PHONY: nuclear
nuclear:
	cat nuclear.md | sed -n '/^```python/,/^```/ p' | sed '/^```python/ d' | sed '/^```/ d' > nuclear.py
	TERMINUSDB_TEAM=${TERMINUSDB_TEAM} TERMINUSDB_ACCESS_TOKEN=${TERMINUSDB_ACCESS_TOKEN} python3 nuclear.py

.PHONY: enrichment
enrichment:
	cat enrichment.md | sed -n '/^```python/,/^```/ p' | sed '/^```python/ d' | sed '/^```/ d' > enrichment.py
	TERMINUSDB_TEAM=${TERMINUSDB_TEAM} TERMINUSDB_ACCESS_TOKEN=${TERMINUSDB_ACCESS_TOKEN} python3 enrichment.py


.PHONY: scraping
scraping:
	cat scraping.md | sed -n '/^```python/,/^```/ p' | sed '/^```python/ d' | sed '/^```/ d' > scraping.py
	TERMINUSDB_TEAM=${TERMINUSDB_TEAM} TERMINUSDB_ACCESS_TOKEN=${TERMINUSDB_ACCESS_TOKEN} python3 scraping.py
