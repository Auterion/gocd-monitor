# GoCD monitor

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

