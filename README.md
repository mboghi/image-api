# Resize Images API

This application has the scope of serving images with the option of resizing.
The API has two endpoints.

## Resize Image Endpoint

Endpoint relative path is **_/image/image_name.extension?size=(width)x(height)_**
It can be called without the size query option.

Images are taken from a pre-defined folder on the disk and can be added during aplication execution.
There is a cache mechanism that will keep on disk each resized image and serve it when required a second time. The cache cleans up automatically each 60 seconds, by deleting the resized images that have not been called since the last cleanup.

## Statistics Endpoint

Endpoint relative path is **_/stats_**
Endpoint will return this info about the cache:
- number of hits vs misses (hits/misses)
- number of original images
- number of resized images

## Running instructions
The default source path for loadin the images is **_\images_**, relative to the root path. It can be changed before running the app in /src/util/path.ts

For running the API, after cloning the repository, you can run these commands:
- npm run build
- npm run dev

The application will be runing at this link **_http://localhost:3000_**

## Docker instructions
To build the docker image use command: **_docker build -t image-api ._**

To run the docker image use command: **_docker run -d --name image-api -p 8080:3000 image-api_**
Service will be available at link **_http://localhost:8080/_**

To stop the container run command: **_docker stop image-api_**
To delete the container run command: **_docker rm image-api_**
