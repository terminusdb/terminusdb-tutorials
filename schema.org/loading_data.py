import extruct
import requests
import pprint
from w3lib.html import get_base_url

from woqlclient import WOQLClient, WOQLQuery
from dateutil.parser import *

server_url = "http://localhost:6363"
key = "root"
dbId = "schema_dot_org"

pp = pprint.PrettyPrinter(indent=2)
r = requests.get("https://events.terminusdb.com/london/2020/02/11/london-1st-graph.html")
base_url = get_base_url(r.text, r.url)
data = extruct.extract(r.text, base_url, syntaxes=['microdata'])

execution_queue=[]
#execution_queue.append(WOQLQuery().typecast('doc:'+id,'owl:Thing','v:'+id))

#date = str(parse("2020-02-11T18:30").dateTime())
#print(date)

def extract_data(data, id='event/'):
    if type(data) == dict:
        data_type = data['type']
        WOQLObj = WOQLQuery().insert('doc:'+id, data_type)
        if data_type == 'https://schema.org/DateTime':
            date_value = {"@value" : data['value'], "@type" : "xsd:sting"}
            #type_casting = [WOQLQuery().eq('v:date_value', date_value), WOQLQuery().typecast('v:date_value', 'xsd:dateTime', 'v:eventDate')]
            #execution_queue.append(WOQLQuery().woql_and(*type_casting))
            execution_queue.append(WOQLObj.property('dateTimeValue', date_value))
            return
        for prop in data['properties']:
            extract_data(data['properties'][prop], id+prop+'/')
            WOQLObj = WOQLObj.property('http://schema.org/'+prop, 'doc:'+id+prop+'/')
        execution_queue.append(WOQLObj)
    else:
        if '://' in data:
            WOQLObj = WOQLQuery().insert('doc:'+id, 'http://schema.org/URL')
        else:
            WOQLObj = WOQLQuery().insert('doc:'+id, 'http://schema.org/Text')
        data_obj = {"@value" : data, "@type" : "xsd:string"}
        execution_queue.append(WOQLObj.property('stringValue',data_obj))

extract_data(data['microdata'][0])

#for item in execution_queue[0:]:
#    print(item.json())
#    print()

pp.pprint(WOQLQuery().when(True).woql_and(*execution_queue).json())

client = WOQLClient()
client.connect(server_url, key)
#for item in execution_queue[0:]:
    #print(item.json())
client.update(WOQLQuery().when(True).woql_and(*execution_queue).json(), dbId)
#WOQLQuery().when(True).woql_and(*execution_queue).execute(client)
