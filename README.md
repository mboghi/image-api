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

## Using instructions
The default source path for loadin the images is **_C:\images_**. It can be changed before running the app in /src/util/path.ts

For running the API, after cloning the repository, you can run these commands:
- npm run build
- npm run dev
