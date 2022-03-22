import numpy as np
import pandas as pd
from collections import defaultdict,Counter
from elasticsearch_dsl.connections import connections
from elasticsearch_dsl.query import Match, MultiMatch
from elasticsearch_dsl import Index, Document, Text, analyzer, tokenizer, Keyword
import uvicorn
from fastapi import FastAPI
from fastapi.responses import FileResponse, HTMLResponse
from typing import Optional
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware


# get data from annotated corpus, convert to dictionary
def get_data():
    path = 'corpus.tsv'
    final_corpus = pd.read_csv(path,  delimiter='\t', encoding = 'utf-8')
    final_corpus_dict = final_corpus.T.to_dict()
    return final_corpus_dict

# connect to elasticsearch
connections.create_connection(hosts=['localhost'])

while True:
    try:
        print(connections.get_connection().info())
        break
    except Exception:
        pass
    
# define Elasticsearch Document
text_title_entity_analyser = analyzer('text_subject', tokenizer="classic", filter=["lowercase", "stemmer"]) # keep stop words? 'stop'

class FilmArticle(Document):
    title = Text(analyzer=text_title_entity_analyser)
    text = Text(analyzer=text_title_entity_analyser)
    central_entity = Text(analyzer=text_title_entity_analyser)
    types = Text(analyzer=text_title_entity_analyser)

final_corpus_dict = get_data()
# create index and object
try:
    filmartcle_index = Index("filmartcle")
    filmartcle_index.document(FilmArticle)
    filmartcle_index.create()
    for ind, item in final_corpus_dict.items():
        article = FilmArticle(title = item['Title'], 
                             text = item['Text'],
                             central_entity = item['central_entity'],
                             types = item['type'])
        article.meta.id = ind
        article.save()
except Exception as e:
    print(e)


middleware = [
    Middleware(
        CORSMiddleware,
        allow_origins=['*'],
        allow_credentials=True,
        allow_methods=['*'],
        allow_headers=['*']
    )

]


app = FastAPI(middleware=middleware)



@app.get("/{querys}")

async def display_text(querys: str):
    s = filmartcle_index.search()
    query_text = dict([(i.split('=')[0],i.split('=')[1]) for i in querys.split('&')])
    field_list = ['central_entity', 'text']
    types_list = ['PERFORMER', 'FILM', 'OTHERS', 'FILM-CREW']
    search_field = [i for i in field_list if query_text[i] == 'true']
    if query_text['textALL'] == 'true':
        search_field = field_list
    types_str = '|'.join([i for i in types_list if query_text[i] == 'true'])
    if query_text['typeALL'] == 'true':
        types_str = '|'.join(types_list)
    if query_text['textValue'] == '':
        s = s.query()
    else:
        s = s.query("multi_match", query=query_text['textValue'], fields=search_field).query("multi_match", query=types_str, fields=['types'])
    total = s.count()
    s = s[:total]
    response = s.execute()
    final_list = [dict([('title', i.title), ('text',i.text),
                       ('entity', i.central_entity), ('type', i.types)]) for i in response]   
    return (final_list)


if __name__ == "__main__":
    uvicorn.run(app, host='0.0.0.0', port=9999, debug=True)