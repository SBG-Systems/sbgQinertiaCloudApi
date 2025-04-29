import json
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

    def create_container(self, organization_id, region):
        """Create a container.

        Parameters
        ----------
        organization_id : str
            Organization ID. Can be found on My SBG.
        region : str
            Processing region.

        Returns
        -------
        Container
            Container object
        """
        api_headers = self._get_http_headers()
        url = self._qinertia_cloud_url + "/organizations/{0}/containers".format(organization_id)
        payload = {
            "region": region,
        }
        response = requests.request("POST", url, headers=api_headers, json=payload)
        self._handle_http_error(response)

        container = response.json()
        return container

    def add_container_files(self, container_id, files):
        """Add files to a container.

        Parameters
        ----------
        container_id : str
            Container id.
        files : list
            List of file objects with path, type, and size.

        Returns
        -------
        list
            List of ContainerFile objects with uploadInfo
        """
        if not files:
            raise ValueError("Files list is empty")

        api_headers = self._get_http_headers()
        url = self._qinertia_cloud_url + "/containers/{0}/files".format(container_id)
        payload = {
            "files": files
        }

        response = requests.request("POST", url, headers=api_headers, json=payload)
        self._handle_http_error(response)

        container_files = response.json()
        return container_files

    def upload_file(self, file_path, container_file):
        """Upload a file using container file upload info.

        Parameters
        ----------
        file_path : str
            Local file path.
        container_file : dict
            Container file object with uploadInfo.

        Returns
        -------
        None
        """

        upload_info = container_file["uploadInfo"]
        url = upload_info["url"]
        fields = upload_info["fields"]
        print(f"Uploading file {file_path}")

        #
        # Copy POST data to avoid modifying reference as it's being reused again.
        #
        data = copy.copy(fields)

        files = [
            ("file", ("", open(file_path, "rb"), "application/octet-stream"))
        ]

        response = requests.request("POST", url, data=data, files=files)
        self._handle_http_error(response)

    def upload_folder(self, folder_path, container_id, file_type="input"):
        """Recursively upload all files inside a folder to a container.

        Parameters
        ----------
        folder_path : str
            Local folder path.
        container_id : str
            Container ID.
        file_type : str
            Type of files ("input" or "resources").

        Returns
        -------
        None
        """
        files_to_upload = []
        folder_abs_path = posixpath.abspath(folder_path)

        for currentpath, folders, files in os.walk(folder_abs_path):
            for file in files:
                file_path = posixpath.join(currentpath, file)
                relative_path = file_path[(len(folder_abs_path) + 1):]
                file_size = posixpath.getsize(file_path)

                files_to_upload.append({
                    "localPath": file_path,
                    "relativePath": relative_path,
                    "size": file_size
                })

        container_files_data = [
            {
                "path": file["relativePath"],
                "type": file_type,
                "size": file["size"]
            } for file in files_to_upload
        ]

        container_files = self.add_container_files(container_id, container_files_data)

        for container_file in container_files:
            matching_file = next(
                (f for f in files_to_upload if f["relativePath"] == container_file["path"]),
                None
            )

            if matching_file:
                self.upload_file(matching_file["localPath"], container_file)

    def start_processing(self, organization_id, container_id, processing_json, name=None):
        """Start processing.

        Parameters
        ----------
        organization_id : str
            Organization ID.
        container_id : str
            Container ID.
        processing_json : dict
            Processing configuration JSON.

        Returns
        -------
        Processing
            Processing object
        """
        api_headers = self._get_http_headers()
        url = self._qinertia_cloud_url + "/organizations/{0}/processings".format(organization_id)

        payload = {
            "containerId": container_id,
            "processingJson": processing_json
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

    def get_processing_output_files(self, processing_id):
        """Get processing output files.

        Parameters
        ----------
        processing_id : str
            Processing ID.

        Returns
        -------
        OutputFiles
            List of output files
        """
        api_headers = self._get_http_headers()
        url = self._qinertia_cloud_url + "/processings/{0}/output".format(processing_id)
        response = requests.request("GET", url, headers=api_headers)
        self._handle_http_error(response)
        output_files = response.json()
        return output_files

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
            dir_path = posixpath.split(local_path)[0]
            if not posixpath.isdir(dir_path):
                os.makedirs(dir_path)
            response = requests.request("GET", file["url"])
            open(local_path, "wb").write(response.content)

    def delete_container(self, container_id):
        """Delete a container.

        Parameters
        ----------
        container_id : str
            Container ID.

        Returns
        -------
        None
        """
        api_headers = self._get_http_headers()
        url = self._qinertia_cloud_url + "/containers/{0}".format(container_id)
        response = requests.request("DELETE", url, headers=api_headers)
        self._handle_http_error(response)