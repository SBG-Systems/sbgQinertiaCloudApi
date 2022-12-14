# Qinertia Cloud API
Qinertia Cloud API is a professional GNSS/INS post processing SaaS solution.

This modern GNSS/INS Post Processing Software can be used with any RTK capable GNSS receivers to deliver centimeter-level Post Processed Kinematic solution (PPK).\
Qinertia can also accepts Inertial Measurement Unit (IMU) data to provide a highly accurate and robust tightly coupled GNSS/INS solution.

Please visit the following links to acess full Qinertia documentations:
 - [Qinertia General Information](https://www.sbg-systems.com/products/qinertia-ins-gnss-post-processing-software/)
 - [Qinertia User Manual](https://support.sbg-systems.com/sc/qd/latest)
 - [Qinertia Cloud API](https://developer.sbg-systems.com/sbgQinertiaCloudApi/)

# GNSS modes
Qinertia has been designed from the ground up to support latest GNSS technologies and signals to deliver the most reliable, robust and accurate solution on the market.

It offers unique features such as Precise Point Positioning and Virtual Base Station (VBS) GNSS augmentation.\
Qinertia comes with a built in world-wide CORS (Continuously Operated Reference Stations) GNSS reference stations to offer centimeter-level accuracy.
A high accuracy and reliable PPP (Precise Point Position) positionning engine is also available when no nearby CORS base station is available.

# Photogrammetry & DJI
Qinertia includes a dedicated module for photogrammetry. Qinertia can post process GNSS and, if available, IMU data to output a highly accurate orientation and position of each picture.

Qinertia can also update pictures EXIF/XMP metadata with this highly accurate camera orientation (roll, pitch, yaw) and position to enable high quality and reliable 3D photogrammetry reconstructions.

Qinertia has a specific support for DJI UAV such as the Phantom 4 RTK, the Matrice 300 RTK with Zenmuse P1 payloads and latest DJI Mavic 3 Enterprise (M3E).\
Qinertia directly reads DJI acquisitions data to compute an accurate Post Processed Kinematic solution (PPK).\
The GNSS antenna to CMS lever arm offsets  are taken into account to update each picture with an accurate position.

With Qinertia Cloud API, you get a turnkey solution to enable professional and reliable photogrammetry workflow for any platform and ideal for DJI solutions.

# Code Sample
Qinertia Cloud API is rather simple to use with standard JSON based REST API interface.
It is based on Qinertia Command Line Interface [(CLI)](https://support.sbg-systems.com/sc/qd/latest/reference-manual/command-line) JSON processing file format.

SBG Systems has designed three code samples to ease as much as possible evaluation:
 - `js` is a node.js code sample written in TypeScript that is perfect for Cloud to Cloud integration.
 - `postman` is a Postman collection that let you evaluate Qinertia Cloud API without any line of code.
 - `python` is a simple Python code sample targeting computer to cloud workflows.
 
Each code sample execute the following steps:
 - Create a new project
 - Upload data to Amazon S3
 - Start processing job
 - Poll processing job status
 - Get download link results
