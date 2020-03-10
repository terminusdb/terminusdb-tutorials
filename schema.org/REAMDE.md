# Creating Schema.org schema in TerminusDB

Using Python, 2 csvs that descript the [Schema.org](https://schema.org/) schema is read into a [Pandas](https://pandas.pydata.org/) DataFrame. Using the TerminusDB Python client [terminus-client-python](https://github.com/terminusdb/terminus-client-python) we recreate this schema in a TerminusDB graph. Using this schema, you can store contents and validate structure of websites that is compatible with this schema using [TerminusDB](https://terminusdb.com/).

# About Schema.org

[Schema.org](https://schema.org/) is a collaborative, community activity with a mission to create, maintain, and promote schemas for structured data on the Internet, on web pages, in email messages, and beyond.

Schema.org vocabulary can be used with many different encodings, including RDFa, Microdata and JSON-LD. These vocabularies cover entities, relationships between entities and actions, and can easily be extended through a well-documented extension model. Over 10 million sites use Schema.org to markup their web pages and email messages. Many applications from Google, Microsoft, Pinterest, Yandex and others already use these vocabularies to power rich, extensible experiences.

Founded by Google, Microsoft, Yahoo and Yandex, Schema.org vocabularies are developed by an open [community](https://www.w3.org/community/schemaorg) process, using the [public-schemaorg@w3.org](http://lists.w3.org/Archives/Public/public-schemaorg) mailing list and through [GitHub](http://github.com/schemaorg/schemaorg).

A shared vocabulary makes it easier for webmasters and developers to decide on a schema and get the maximum benefit for their efforts. It is in this spirit that the founders, together with the larger community have come together - to provide a shared collection of schemas.

-- [Schema.org](https://schema.org/)
