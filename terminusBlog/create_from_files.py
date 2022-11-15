import os
import json
import re
from datetime import datetime

blogs = []
for entry in os.scandir('./entries'):
    with open(f"./entries/{entry.name}", 'r') as file:
        content = file.read()
    match = re.match('^(# .*)\n',content)

    if match:
        name = re.sub('^# ','',match[0])
        name = re.sub('\[([^\]]*)\]\([^\)]*\)', '\\1', name)
        name = re.sub('\n.*','',name)
        content = re.sub(match[0],'',content)
    else:
        name = entry.name
    print(f"Processing title: {name}")
    image_re = re.compile(r'!\[([^\]]*)\]\(([^\)]*)\)', re.MULTILINE)
    image_matches = image_re.findall(content)
    if image_matches != []:
        (alt_text,pre_location) = image_matches[0]
        location = re.sub('\.\./','http://localhost:3000/', pre_location)
        image = { "@type" : "Image",
                  "location" : location,
                  "alt": alt_text }
    else:
        image = None
    info = entry.stat()
    timestamp = info.st_mtime
    datetimeobj = datetime.fromtimestamp(timestamp)
    iso_date = datetimeobj.isoformat()
    blog = { "@type" : "Post",
             "title" : name,
             "content" : content,
             "date" : iso_date,
             "feature" : image
            }
    blogs.append(blog)

with open('blogs.json', 'w') as f:
    json.dump(blogs, f)
