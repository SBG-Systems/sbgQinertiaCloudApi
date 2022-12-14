import 'dotenv/config';

export default function getEnvVariable(varName: string) {
    const variable = process.env[varName];
    if (!variable) throw new Error(`Missing env var ${varName}`);
    return variable;
}