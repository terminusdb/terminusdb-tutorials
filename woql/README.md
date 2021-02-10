# WOQL in WOQL

You can store WOQL objects as objects in a database, retrieve them and use them as queries!

Run `python woql_schema.py` and you will have a database with the WOQL schema installed.

You can see how this might be used by looking at the file `woql.py`
which contains some examples.

You may then store your queries. To name them, simply ad an `'@id'` field to
the query. Shared subqueries will reuse the same objects.

This works from at least commit b844c59.
