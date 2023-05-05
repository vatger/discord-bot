# VATGER Discord Bot

This discord bot handles administrative tasks of the official VATSIM Germany Discord.
It provides users with a selection of slash-commands and takes care of the data-management with the MongoDB backend.
Further, it provides a connection channel showing new and terminated ATC connections within VATSIM Germany. 

If you wish to contribute and/or make changes, please check out our contribution guide [here](CONTRIBUTING.md).

## Contact

|         Name         | Responsible for |             Contact             |
|:--------------------:|:---------------:|:-------------------------------:|
| Moritz F. - 1234027  |        *        |       `nav[at]vatger.de`        |
| Nikolas G. - 1373921 |        *        | `nikolas.goerlitz[at]vatger.de` |

## Prerequisites
- **Node.js** (https://nodejs.org/en)
  - Only required if you are planning on running the application locally (without Docker)

## Running the Application

Development:

1. Run `npm install`
2. Copy the `.env.example` to `.env`
3. Edit the values stored in the `.env` file
4. Run `npm run run`

Alternatively, you can build the project using Docker and the `docker-compose.yml`. 
Note that you will be required to add the environment variables to your development environment.
