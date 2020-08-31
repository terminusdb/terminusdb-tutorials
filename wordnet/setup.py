#!/usr/bin/python3

import os
import sys
import re

# If you are on Mac OSX you may need to use 50000
# the larger you can manage the better!
lines = 200000
end_of_sentence_pattern = re.compile('.*\.\s*$')
prefix_pattern = re.compile('^\s*@prefix.*\.\s*$')

def extract_header(path):
    istream = open(f"{path}","r")
    header = ""
    for line in istream:
        if re.match(prefix_pattern,line):
            header += line
        else:
            break
    istream.close()
    return header

def split_ttl(name, path):
    os.system(f"mkdir -p {name}")
    os.system(f"rm -f {name}/*")

    header = extract_header(path)

    lines_so_far = 0
    iterations = 0
    istream = open(f"{path}","r")
    ostream = open(f"{name}/{path}.{iterations}","w")
    for line in istream:
        ostream.write(line)
        lines_so_far += 1
        if lines_so_far > lines:
            if re.match(end_of_sentence_pattern,line):
                iterations += 1
                lines_so_far = 0
                ostream.close()
                ostream = open(f"{name}/{path}.{iterations}","w")
                ostream.write(header)

    istream.close()
    ostream.close()

if __name__ == "__main__":
    wordnet_file = "english-wordnet-3.3.ttl"
    split_ttl("wordnet_chunks",wordnet_file)
