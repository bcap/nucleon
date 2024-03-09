#!/bin/bash

set -e

cd $(dirname $0)

docker run \
    --rm \
    --detach \
    --name nucleon-jupyter \
    -p 8888:8888 \
    -v $(pwd):/home/jovyan/nucleon \
    -e NOTEBOOK_ARGS=$'--ip=\* --NotebookApp.token="" --NotebookApp.password=""' \
    jupyter/scipy-notebook

trap "docker stop nucleon-jupyter > /dev/null" EXIT

echo "access the jupyter notebook at http://127.0.0.1:8888/lab/tree/nucleon. Press Ctrl+C to stop the server."

sleep inf