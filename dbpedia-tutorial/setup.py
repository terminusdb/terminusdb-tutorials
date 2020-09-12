#!/usr/bin/python3

import os
import sys
import time
import math

# If you are on Mac OSX you may need to use 50000
# the larger you can manage the better!
lines = 200000

def add_ttl(name, uri):
    os.system(f"mkdir -p {name}")
    os.system(f"rm -f {name}/*")
    os.system(f"wget {uri} -O {name}.bz2")
    os.system(f"bunzip2 -c {name}.bz2 > {name}.ttl")
    os.chdir(f"{name}")
    os.system(f"split -l {lines} ../{name}.ttl")
    os.chdir(f"..")

if __name__ == "__main__":
    type_uri = "https://downloads.dbpedia.org/repo/dbpedia/mappings/instance-types/2020.08.01/instance-types_lang=en_specific.ttl.bz2"
    literal_uri = "https://downloads.dbpedia.org/repo/dbpedia/mappings/mappingbased-literals/2020.08.01/mappingbased-literals_lang=en.ttl.bz2"
    object_uri = "https://downloads.dbpedia.org/repo/dbpedia/mappings/mappingbased-objects-uncleaned/2020.08.01/mappingbased-objects-uncleaned_lang=en.ttl.bz2"
    add_ttl("types",type_uri)
    time.sleep(1)
    add_ttl("literals",literal_uri)
    time.sleep(1)
    add_ttl("objects",object_uri)
