TAG = $(shell git rev-parse --short HEAD)
PROJECT=entranic-bus
IMAGE=gcr.io/$(PROJECT)/mock-server


build:
	docker build -t $(IMAGE):latest -t $(IMAGE):$(TAG) .

push: build
	gcloud docker -- push $(IMAGE):$(TAG)
	gcloud docker -- push $(IMAGE):latest

deploy: push
	kubectl set image deployment/mock-server mock=$(IMAGE):latest


