import { Configuration, OAuth2Api } from '@ory/hydra-client';
import { oryAxios } from './axios';

const baseUrl = process.env.HYDRA_ADMIN_URL;

const config = new Configuration({ basePath: baseUrl });

export const hydraOAuth2 = new OAuth2Api(config, undefined, oryAxios);

export async function acceptLoginRequest(challenge: string, subject: string) {
  const acceptResponse = await hydraOAuth2.acceptOAuth2LoginRequest({
    loginChallenge: challenge,
    acceptOAuth2LoginRequest: {
      subject,
      remember: true,
    },
  });
  return acceptResponse.data;
}

export async function getConsentRequest(consentChallenge: string) {
  const consentRequest = await hydraOAuth2.getOAuth2ConsentRequest({
    consentChallenge,
  });
  return consentRequest.data;
}

export async function acceptConsentRequest(
  consentChallenge: string,
  grantScopes: string[] | undefined,
) {
  const acceptResponse = await hydraOAuth2.acceptOAuth2ConsentRequest({
    consentChallenge,
    acceptOAuth2ConsentRequest: {
      grant_scope: grantScopes,
      remember: true,
    },
  });
  return acceptResponse.data;
}

export async function rejectConsentRequest(consentChallenge: string) {
  const rejectResponse = await hydraOAuth2.rejectOAuth2ConsentRequest({
    consentChallenge,
    rejectOAuth2Request: {
      error: 'access_denied',
      error_description: 'User denied the consent',
    },
  });
  return rejectResponse.data;
}
