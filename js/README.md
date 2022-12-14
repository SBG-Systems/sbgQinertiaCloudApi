# Qinertia Cloud JS Sample

This is a sample app to run a processing on SBG Systems Qinertia Cloud using the API

## Requirements

To use this code sample, please meet the following requirements:
- Have node.js installed on your computer
- You need a MySBG account https://my.sbg-systems.com
- You must be admin of an organization on MySBG
- You need a valid Access Token on MySBG
- You need Qinertia Cloud INS prepaid credits

## Install dependencies

```bash
	npm install
```

## Prepare variables

1. Copy `.env.empty` file to `.env`
2. Get your organization id from MySBG organization detail page. (example: f4f6a6c6-3614-490d-b830-838d87b1f4e6)
3. Create an access token to consume Qinertia Cloud API https://my.sbg-systems.com/apikeys and note the key and secret
4. Edit your `.env` file and change every `CHANGE_ME` variables

Please find below an example value for each Postman variable to set:

| Variable             | Example value                        |
| -------------------- | ------------------------------------ |
| ORGANIZATION_ID      | f4f6a6c6-3614-490d-b8d0-838d87b1f4e6 |
| ACCESS_TOKEN_KEY     | api_kj67d3sj3du1                     |
| ACCESS_TOKEN_SECRET  | dqPC9hGq8aNLFSOloQYr                 |

## Run a processing

```bash
	npm start
```
