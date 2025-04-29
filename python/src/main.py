import json
import time

import api
import processing_progress_bar

#
# General processing settings and credentials from MySBG
#
access_token_key    = "CHANGE_ME"	# example: api_pw6rgoqgn6vn
access_token_secret = "CHANGE_ME"	# example: NyoFFWu6b2ZrYkmFu3Kj
organization_id     = "CHANGE_ME"	# example: a5a2356a-ae1f-43f3-9f4a-ec035d9c5032
region              = "eu-west-3"	# Select the AWS processing cluster: eu-west-3, us-west-1, ap-northeast-1, ap-southeast-2

#
# Input/output files and json processing file selection
#
input_dir = "data/input"
output_dir = "data/output"
processing_json = json.load(open("data/processing.json"))

#
# Qinertia Cloud API service urls (don't edit)
#
auth_url = "https://account.sbg-systems.com/realms/sbg/protocol/openid-connect/token"
qinertia_cloud_url = "https://qinertia-api.sbg-systems.com/api/v2"

qinertia_cloud_api = api.Api(auth_url, qinertia_cloud_url)

progress_bar = processing_progress_bar.ProcessingProgressBar()

#
# Authenticate
#
qinertia_cloud_api.authenticate(access_token_key, access_token_secret)
print("Authentication successful")

#
# Create container
#
container = qinertia_cloud_api.create_container(organization_id, region)
container_id = container["id"]
print("Container created")
print(json.dumps(container, indent=2))

#
# Upload input files
#
print(f"Uploading files from {input_dir} to container")
qinertia_cloud_api.upload_folder(input_dir, container_id, "input")
print("Upload input files completed")

#
# Start processing
#
processing = qinertia_cloud_api.start_processing(
    organization_id,
    container_id,
    processing_json,
)
processing_id = processing["id"]
print("Processing started")
print(json.dumps(processing, indent=2))

#
# Wait for processing to be over
# Pooling is easier to set up than webhooks. But you should use webhooks in production
#
end_statuses = ["processed", "canceled"]
processing_is_over = False
while not processing_is_over:
    processing = qinertia_cloud_api.get_processing(processing_id)
    progress_bar.print_processing_status(processing)
    processing_status = processing["status"]
    processing_is_over = processing_status in end_statuses
    if not processing_is_over:
        time.sleep(2)
print("\nProcessing is over")

#
# Download output files
#
output_files = qinertia_cloud_api.get_processing_output_files(processing_id)
qinertia_cloud_api.download_output_files(output_dir, output_files)
print("Download output files completed")

#
# Delete container
#
print(f"Deleting container {container_id}")
qinertia_cloud_api.delete_container(container_id)
print("Container deleted successfully")