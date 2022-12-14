import os

loading_spinner_chars = "|/-\\"

class ProcessingProgressBar():
    def __init__(self):
        """Create processing progress bar helper

        Returns
        -------
        ProcessingProgressBar
        """
        self._last_status = None
        self._last_step = None
        self._ls_iterator = 0

    def print_processing_status(self, processing):
        """Print processing status

        Parameters
        ----------
        processing : Processing
            Up to date processing.

        Returns
        -------
        None
        """
        status = processing["status"]
        step = processing["processingStep"]
        progress = processing["processingProgress"]
        prefix = "Processing status: {0} - step: {1}"

        print(f'\r{" " * (os.get_terminal_size().columns - 1)}', end = "\r") # Clear to the end of line

        if self._last_status is not None and (self._last_status != status or self._last_step != step):
            suffix = self._get_step_change(status)
            print(f'\r{prefix.format(self._last_status, self._last_step)} {suffix}')

        if progress is not None:
            suffix = self._get_progress_bar(progress)
        else:
            suffix = self._get_spin_loader()
        print(f'\r{prefix.format(status, step)} {suffix}', end = "\r")
        self._last_status = status
        self._last_step = step

    def _get_spin_loader(self):
        """Get spin loader

        Returns
        -------
        str
        """

        self._ls_iterator = (self._ls_iterator + 1) % len(loading_spinner_chars)

        return "[{0}]".format(loading_spinner_chars[self._ls_iterator])

    def _get_progress_bar(self, progress):
        """Get progress bar

        Parameters
        ----------
        progress : Float
            Progress between 0 and 1.

        Returns
        -------
        str
        """
        length = 50
        percentage = progress * 100
        filledLength = round(length * min(progress, 1.0))
        bar = '█' * filledLength + '-' * (length - filledLength)
        return "|{0}| {1:.1f}%".format(bar, percentage)

    def _get_step_change(self, status):
        """Get last step result (success/fail)

        Parameters
        ----------
        status : str
            Current processing status.

        Returns
        -------
        str
        """

        if status == "failed" or status == "canceled":
            return "[!] {0}".format(status)
        return "[√] completed"