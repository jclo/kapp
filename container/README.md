# README

This folder contains the files to create a docker image of kapp and to run it in a Kubernetes Node.

This `README` doesn't aim to explain what is `Docker` and `Kubernetes`. It assumes the reader knows.


## Docker

### Create the image

Create a project with this `Dockerfile` in the root directory and `Kapp` into the `app` subfolder like this:
```bash
  myproject
    |__ Dockerfile
    |__ app
         |__ kapp
```

Then run the following command:
```bash
docker build -t kapp:<version> .
```

### Create a container

```bash
docker run -d -p 8080:1080 -e KAPP_HTTP_PORT='1080' -e KAPP_HTTPS='false' -e KAPP_NETWORK='0.0.0.0'  --name my-kapp kapp:<version>
```

### Save the image

```bash
docker save kapp:<version> | gzip > kapp-<version>.tar.gz
```

## Load the saved image

```bash
dev$ docker load < kapp-<version>.tar.gz
```

## Minikube / Kubernetes

### Start Minikube

First, you need to start `minikube`.

```bash
minikube start --driver=hyperkit
```

### Load the image

```bash
minikube image load kapp-<version>.tar.gz
```

### Deploy the image

```bash
kubectl apply -f kapp.yaml
```

That's all!

-- oOo --
