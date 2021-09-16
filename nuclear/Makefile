
.PHONY: nuclear
nuclear:
	cat nuclear.md | sed -n '/^```python/,/^```/ p' | sed '/^```python/ d' | sed '/^```/ d' > nuclear.py
	TERMINUSDB_TEAM=${TERMINUSDB_TEAM} TERMINUSDB_ACCESS_TOKEN=${TERMINUSDB_ACCESS_TOKEN} python nuclear.py

.PHONY: enrichment
enrichment:
	cat enrichment.md | sed -n '/^```python/,/^```/ p' | sed '/^```python/ d' | sed '/^```/ d' > enrichment.py
	TERMINUSDB_TEAM=${TERMINUSDB_TEAM} TERMINUSDB_ACCESS_TOKEN=${TERMINUSDB_ACCESS_TOKEN} python enrichment.py
