import extruct
import requests
import pprint
from w3lib.html import get_base_url

pp = pprint.PrettyPrinter(indent=2)
r = requests.get("https://events.terminusdb.com/london/2020/02/11/london-1st-graph.html")
base_url = get_base_url(r.text, r.url)
data = extruct.extract(r.text, base_url, syntaxes=['microdata'])
pp.pprint(data)
