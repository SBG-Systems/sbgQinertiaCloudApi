import json

class SbgError(Exception):
    def __init__(self, response, custom_message=None):
        """Create SbgError

        Parameters
        ----------
        response : requests.Response
            Service HTTP response.
        custom_message : str, optional
            Optional custom error custom_message, written at the beginning for the error.

        Returns
        -------
        SbgError
        """

        self.status_code = response.status_code
        response_str = None
        try:
            self.response = response.json()
            response_str = json.dumps(self.response, indent=2)
        except:
            response_str = "Failed to parse JSON response - {0}".format(response.text)

        custom_error = '''{0} - {1}
        {2}'''.format(
            custom_message or "SBG API error",
            self.status_code,
            response_str,
        )

        super().__init__(custom_error)