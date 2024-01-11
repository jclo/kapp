#!/bin/bash

echo 'Creating the docker container my-phplite-kapp-server';
CONTAINER_ID=$(docker run -d -p 8888:80 -v $PWD/db:/var/www/html/db --name my-phplite-kapp-server phplite)
echo "container id: ${CONTAINER_ID}";

# echo "save container id in ./db/container_id.txt"
# cat << EOF >> ./db/container_id.txt
# ${CONTAINER_ID}
# EOF

echo 'done!';
