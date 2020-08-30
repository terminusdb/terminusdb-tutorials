# How-to: Loading RDF data from DBpedia

TerminusDB can be used both as a database enabling query but also as a content sharing platform. In this tutorial we'll show how you can load a relatively large RDF dataset and prepare it for distribution.

In order to set up the files for import etc, you can first run [the setup script](./setup.py). This uses a few utilties that are requirements: `wget`, `bzip2` and `split`.

This tutorial will use code examples which are drawn from the complete [dbpedia import script](./dbpedia.py).

## Ingesting Turtle


