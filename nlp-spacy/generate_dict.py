import spacy
import pprint as pp

nlp = spacy.load("en_core_web_sm")
doc = nlp("Apple is looking at buying U.K. startup for $1 billion")

all_token = []
for token in doc:
    token_dict = {}
    token_dict["i"] = token.i
    token_dict["text"] = token.text
    token_dict["lemma_"] = token.lemma_
    token_dict["pos_"] = token.pos_
    token_dict["tag_"] = token.tag_
    token_dict["dep_"] = token.dep_
    token_dict["shape_"] = token.shape_
    token_dict["is_alpha"] = token.is_alpha
    token_dict["is_stop"] = token.is_stop
    token_dict["head"] = token.head.i
    
    all_token.append(token_dict)
    
doc_json = {"text": doc.text, "tokens": all_token}
pp.pprint(doc_json)