# Qinertia Cloud Postman Sample

This Postman collection let you easily access and test Qinertia Cloud API with no code.

## Requirements

You must have Postman installed, a my SBG account https://my.sbg-systems.com and be admin of an organization.
Your organization should have enough Qinertia Cloud API (INS) credits to process the sample.

## Prepare processing data

Copy processing data (everything inside the `processing_data` folder) inside your Postman working directory.
Check [this link](https://learning.postman.com/docs/getting-started/settings/#working-directory) if you need help to find your Postman working directory.

If your working directory is `~/Postman/files` then you should have a subfolder `~/Postman/files/qinertia_cloud`

## Import collection

Import `Qinertia Cloud Example.postman_collection.json` in Postman.

## Prepare variables

1. Get your organization id from MySBG organization detail page. (example: f4f6a6c6-3614-490d-b830-838d87b1f4e6)
2. Create an access token to consume Qinertia Cloud API https://my.sbg-systems.com/apikeys and note the key and secret
3. Edit your collection variables to set all the `CHANGE_ME` variables.

Please find below an example value for each Postman variable to set:

| Variable             | Example value                        |
| -------------------- | ------------------------------------ |
| organization_id      | f4f6a6c6-3614-490d-b8d0-838d87b1f4e6 |
| access_token_key     | api_kj67d3sj3du1                     |
| access_token_secret  | dqPC9hGq8aNLFSOloQYr                 |

## Authenticate using access token

Edit collection -> Authorization -> `Get New Access Token` button -> `Use Token` button.

## Run a processing

Execute every requests starting with [STEP..] in order.