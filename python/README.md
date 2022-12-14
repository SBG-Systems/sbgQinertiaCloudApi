# Qinertia Cloud Python Sample

This is a sample app to run a processing on SBG Systems Qinertia Cloud using the API

## Requirements

To use this code sample, please meet the following requirements:
- Python > 3.x
- pipenv must be installed
- You need a MySBG account https://my.sbg-systems.com
- You must be admin of an organization on MySBG
- You need a valid Access Token on MySBG
- You need Qinertia Cloud INS prepaid credits

## Install modules

Please type the following command to install the needed Python packages:

```bash
pipenv install
```

## Prepare variables

1. Get your organization id from MySBG organization detail page. (example: f4f6a6c6-3614-490d-b830-838d87b1f4e6)
2. Create an access token to consume Qinertia Cloud API https://my.sbg-systems.com/apikeys and note the key and secret
3. Edit `main.py` and change every `CHANGE_ME` variables

Please find below an example value for each Postman variable to set:

| Variable             | Example value                        |
| -------------------- | ------------------------------------ |
| organization_id      | f4f6a6c6-3614-490d-b8d0-838d87b1f4e6 |
| access_token_key     | api_kj67d3sj3du1                     |
| access_token_secret  | dqPC9hGq8aNLFSOloQYr                 |

## Run a processing

To start the upload, processing and download process, simply type the command below:

```bash
pipenv run python src/main.py
```

## Monitor progress

The processing can take a few minutes but the code sample continuously monitor the progression.  
For production environment, it is recommended to use web hooks to monitor progress/status.

Once the processing is done, you should get the results in `data/output` directory.

## API documentation

Please feel free to consult the online Qinertia Cloud API documentation: https://developer.sbg-systems.com/sbgQinertiaCloudApi/
