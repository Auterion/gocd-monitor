# GoCD monitor

![screenshot](screenshot.png)

This project is a really simple but opinionated monitor for [GoCD](https://go.cd)
with the main idea of representing active pipelines first so it is usable
in a TV screen when you have dozens of pipelines.

The project has been tested against GoCD version 19.3.0.

## Getting started

Install dependencies:
```
yarn install
```

Have following environment in either `.env` file or in environment:

```
GO_URL=https://gocd.example.com
GO_TOKEN=<an auth token>
PORT=12333
```

Run `yarn serve` and navigate to [http://localhost:12333](http://localhost:12333).

## Using Docker

You can run the prebuilt docker container [auterion/gocd-monitor](https://hub.docker.com/r/auterion/gocd-monitor)
by running `docker run --rm -e GO_URL=https://gocd.example.com GO_TOKEN=your_token -p "12333:12333" auterion/gocd-monitor`.

## Optional Configuration

All configuration happens with setting the corresponding environment variable.

### PIPELINE_GROUP_FILTER

A regular expression filter that matches pipeline groups.
For example `PIPELINE_GROUP_FILTER='^web_.*'`.

