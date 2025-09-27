import { Configuration, OAuth2Api, JwkApi } from '@ory/hydra-client';
import { oryAxios } from './axios';

const baseUrl = process.env.HYDRA_ADMIN_URL;
const config = new Configuration({ basePath: baseUrl });
export const hydraOAuth2 = new OAuth2Api(config, undefined, oryAxios);
export const hydraJwk = new JwkApi(config, undefined, oryAxios);

export async function acceptLoginRequest(challenge: string, subject: string) {
  try {
    const { data } = await hydraOAuth2.acceptOAuth2LoginRequest({
      loginChallenge: challenge,
      acceptOAuth2LoginRequest: {
        subject,
        remember: true,
      },
    });
    return data;
  } catch (err) {
    console.error('Failed to accept login request:', err);
    throw err;
  }
}

export async function getConsentRequest(consentChallenge: string) {
  try {
    const { data } = await hydraOAuth2.getOAuth2ConsentRequest({
      consentChallenge,
    });
    return data;
  } catch (err) {
    console.error('Failed to get consent request:', err);
    throw err;
  }
}

export async function acceptConsentRequest(
  consentChallenge: string,
  grantScopes?: string[],
) {
  try {
    const { data } = await hydraOAuth2.acceptOAuth2ConsentRequest({
      consentChallenge,
      acceptOAuth2ConsentRequest: {
        grant_scope: grantScopes,
        remember: true,
      },
    });
    return data;
  } catch (err) {
    console.error('Failed to accept consent request:', err);
    throw err;
  }
}

export async function rejectConsentRequest(consentChallenge: string) {
  try {
    const { data } = await hydraOAuth2.rejectOAuth2ConsentRequest({
      consentChallenge,
      rejectOAuth2Request: {
        error: 'access_denied',
        error_description: 'User denied the consent',
      },
    });
    return data;
  } catch (err) {
    console.error('Failed to reject consent request:', err);
    throw err;
  }
}

export async function getOAuth2LoginRequest(loginChallenge: string) {
  try {
    const { data } = await hydraOAuth2.getOAuth2LoginRequest({
      loginChallenge,
    });
    return data;
  } catch (err) {
    console.error('Failed to get login request:', err);
    throw err;
  }
}
