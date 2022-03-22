FROM elasticsearch:7.16.3
# ENV ELASTIC_USERNAME=elastic
# ENV ELASTIC_PASSWORD=changeme
RUN apt-get update
RUN apt-get install -y tzdata
RUN apt-get install -y python3
RUN apt-get install -y python3-venv python3-pip
USER elasticsearch
ENV node.name=node-1
ENV cluster.initial_master_nodes=node-1
WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN pip3 install -r requirements.txt
EXPOSE 9999
CMD /usr/share/elasticsearch/bin/elasticsearch & python3 backend.py