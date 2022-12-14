import requests
import copy
import os
import posixpath

import sbg_error

class Api():
    def __init__(self, auth_url, qinertia_cloud_url):
        """Create Qinetia Cloud Api

        Parameters
        ----------
        access_token_key : str
            Access token key, generated on My SBG.
        access_token_secret : str
            Access token secret, generated on My SBG.

        Returns
        -------
        Api
        """
        self._auth_url = auth_url
        self._qinertia_cloud_url = qinertia_cloud_url

    def authenticate(self, access_token_key, access_token_secret):
        """Authenticate using SBG OpenID Connect.

        Parameters
        ----------
        access_token_key : str
            Access token key, generated on My SBG.
        access_token_secret : str
            Access token secret, generated on My SBG.

        Returns
        -------
        None
        """

        payload = {
            "username": access_token_key,
            "password": access_token_secret,
            "grant_type": "password",
            "client_id": "api-key",
        }
        headers = {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
        }
        response = requests.request("POST", self._auth_url, headers=headers, data=payload)
        self._handle_http_error(response)

        access_token = response.json()["access_token"]
        self._access_token = access_token

    def _get_http_headers(self):
        """Returns an image tile, vector tile, or UTFGrid
        in the specified file format.
        Parameters
        ----------
        access_token_key : str
            Access token key, generated on My SBG.
        access_token_secret : str
            Access token secret, generated on My SBG.
        """

        api_headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer {0}".format(self._access_token),
        }
        return api_headers

    def _handle_http_error(self, response):
        """Raise an error if the response status code isn't 2XX.

        Parameters
        ----------
        response : requests.Response
            Service HTTP response.

        Returns
        -------
        None
        """

        if not (response.status_code >= 200 and response.status_code <= 299):
            raise sbg_error.SbgError(response)

    def create_project(self, organization_id, region):
        """Create a project.

        Parameters
        ----------
        organization_id : str
            Organization ID. Can be found on My SBG.
        region : str
            Processing region.

        Returns
        -------
        Project
        """

        api_headers = self._get_http_headers()
        url = self._qinertia_cloud_url + "/organizations/{0}/projects".format(organization_id)
        payload = {
            "region": region,
        }
        response = requests.request("POST", url, headers=api_headers, json=payload)
        self._handle_http_error(response)

        project = response.json()
        return project

    def _get_upload_post_data(self, project_id, type):
        """Get upload POST data.

        Parameters
        ----------
        project_id : str
            Project id.
        type : str
            Data type - "input" or "resources".

        Returns
        -------
        UploadPostData
        """

        api_headers = self._get_http_headers()
        url = self._qinertia_cloud_url + "/projects/{0}/{1}".format(project_id, type)
        response = requests.request("GET", url, headers=api_headers)
        self._handle_http_error(response)

        presigned_post = response.json()
        return presigned_post

    def get_input_post_data(self, project_id):
        """Get input POST data.

        Parameters
        ----------
        project_id : str
            Project id.

        Returns
        -------
        UploadPostData
        """

        return self._get_upload_post_data(project_id, "input")

    def get_resources_post_data(self, project_id):
        """Get resources POST data.

        Parameters
        ----------
        project_id : str
            Project id.

        Returns
        -------
        UploadPostData
        """

        return self._get_upload_post_data(project_id, "resources")

    def upload_file(self, file_path, target_path, upload_post_data):
        """Upload a file using upload POST data.

        Parameters
        ----------
        file_path : str
            Local file path.
        target_path : str
            Relative path where to store the file.
        upload_post_data : UploadPostData
            Upload POST data.

        Returns
        -------
        None
        """

        url = upload_post_data["url"]
        fields = upload_post_data["fields"]
        print("Uploading file {0}".format(file_path))

        #
        # Copy POST data to avoid modifying reference as it's being reused again.
        #
        data = copy.copy(fields)
        data["key"] = data["key"].replace("${filename}", target_path)
        files=[
            ("file", ("", open(file_path, "rb"), "application/octet-stream"))
        ]

        response = requests.request("POST", url, data=data, files=files)
        self._handle_http_error(response)

    def upload_folder(self, folder_path, upload_post_data):
        """Recursivly upload all files inside a folder using upload POST data.

        Parameters
        ----------
        folder_path : str
            Local folder path.
        upload_post_data : UploadPostData
            Upload POST data.

        Returns
        -------
        None
        """

        folder_abs_path = posixpath.abspath(folder_path)
        for currentpath, folders, files in os.walk(folder_abs_path):
            for file in files:
                file_path = posixpath.join(currentpath, file)
                relative_path = file_path[(len(folder_abs_path) + 1):]
                self.upload_file(file_path, relative_path, upload_post_data)

    def start_processing(self, project_id, processing_json):
        """Start processing.

        Parameters
        ----------
        project_id : str
            Project ID.
        processing_json : ProcessingJson
            Processing region.

        Returns
        -------
        Processing
        """

        api_headers = self._get_http_headers()
        url = self._qinertia_cloud_url + "/projects/{0}/processings".format(project_id)
        payload = {
            "processingJson": processing_json,
        }
        response = requests.request("POST", url, headers=api_headers, json=payload)
        self._handle_http_error(response)
        processing = response.json()
        return processing

    def get_processing(self, processing_id):
        """Get processing info.

        Parameters
        ----------
        processing_id : str
            Processing ID.

        Returns
        -------
        Processing
        """

        api_headers = self._get_http_headers()
        url = self._qinertia_cloud_url + "/processings/{0}".format(processing_id)
        response = requests.request("GET", url, headers=api_headers)
        self._handle_http_error(response)
        processing = response.json()
        return processing

    def get_output_files(self, project_id):
        """Get processing output files.

        Parameters
        ----------
        project_id : str
            Project ID.

        Returns
        -------
        OutputFiles
        """

        api_headers = self._get_http_headers()
        url = self._qinertia_cloud_url + "/projects/{0}/output".format(project_id)
        response = requests.request("GET", url, headers=api_headers)
        self._handle_http_error(response)
        processing = response.json()
        return processing

    def download_output_files(self, folder_path, output_files):
        """Download all output files.

        Parameters
        ----------
        folder_path : str
            Local path where to download files.
        output_files : OutputFiles
            Project output files.

        Returns
        -------
        None
        """

        folder_abs_path = posixpath.abspath(folder_path)
        for file in output_files:
            local_path = posixpath.join(folder_abs_path, file["path"])
            print("Downloading output file to {0}".format(local_path))
            dir_path = os.path.split(local_path)[0]
            if not os.path.isdir(dir_path):
                os.makedirs(dir_path)
            response = requests.request("GET", file["url"])
            open(local_path, "wb").write(response.content)