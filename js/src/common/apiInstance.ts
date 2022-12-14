import AccessTokenInstance from "./AccessTokenInstance";
import getEnvVariable from "./getEnvVariable";
import { QinertiaCloudApi } from "./QinertiaCloudApi";

const accessTokenInstance = new AccessTokenInstance(
    getEnvVariable('ACCESS_TOKEN_KEY'),
    getEnvVariable('ACCESS_TOKEN_SECRET'),
    getEnvVariable('ACCESS_TOKEN_URL'),
);
const apiInstance = new QinertiaCloudApi({
    getAccessToken: () => accessTokenInstance.getToken(),
    baseUrl: getEnvVariable('QINERTIA_CLOUD_API'),
});

export default apiInstance;