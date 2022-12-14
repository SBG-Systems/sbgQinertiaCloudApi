import axios, { AxiosRequestConfig } from 'axios';
import qs from 'qs';

interface Token {
    token: string;
    expiration: Date;
}

class AccessTokenInstance {
    private accessTokenUrl: string;
    private accessTokenKey: string;
    private accessTokenSecret: string;
    private accessToken: Token | undefined;

    /**
     * @param accessTokenUrl - OIDC token endpoint. For keycloak it must be like: "http(s)://KC-DOMAIN/realms/REALM/protocol/openid-connect/token"
     */
    constructor(accessTokenKey: string, accessTokenSecret: string, accessTokenUrl: string) {
        this.accessTokenUrl = accessTokenUrl;
        this.accessTokenKey = accessTokenKey;
        this.accessTokenSecret = accessTokenSecret;
    }

    async getToken(): Promise<string> {
        const currentDate = new Date();
        if (!this.accessToken || currentDate > this.accessToken.expiration) {
            this.accessToken = await this.createToken();
        }
        return this.accessToken.token;
    }

    private async createToken(): Promise<Token> {
        const data = qs.stringify({
            client_id: 'api-key',
            grant_type: 'password',
            username: this.accessTokenKey,
            password: this.accessTokenSecret,
        });
        const conf: AxiosRequestConfig = {
            method: "post",
            url: this.accessTokenUrl,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            data: data,
        };

        const { access_token, expires_in } = (await axios(conf)).data;
        if (typeof access_token !== "string" || typeof expires_in !== "number") {
            throw new Error(
                "Invalid response data. Missing/invalid access_token or expires_in"
            );
        }

        const currentDate = new Date();
        currentDate.setSeconds(currentDate.getSeconds() + expires_in);
        return {
            token: access_token,
            expiration: currentDate,
        };
    }
}

export default AccessTokenInstance;
