import {
  UiNode,
  UiNodeInputAttributes,
  UiNodeInputAttributesTypeEnum,
} from '@ory/kratos-client';

export function shouldDisplayLabel(node: UiNode): boolean {
  return !(
    [
      UiNodeInputAttributesTypeEnum.Hidden,
      UiNodeInputAttributesTypeEnum.Submit,
      UiNodeInputAttributesTypeEnum.Button,
      UiNodeInputAttributesTypeEnum.Checkbox,
    ] as UiNodeInputAttributesTypeEnum[]
  ).includes((node.attributes as UiNodeInputAttributes).type);
}

export function getFormLabel(node: UiNode): string {
  const attrs = node.attributes as UiNodeInputAttributes;
  if (node.meta.label?.text === 'ID') return 'Username or Email';
  if (node.meta.label?.text === 'Newsletter subscription')
    return 'I want to receive the newsletter';
  if (node.meta.label?.text === 'Terms of Service acceptance')
    return 'I agree to the Terms of Service and Privacy Policy';
  if (node.meta.label?.text === 'Password') return 'Password';

  return node.meta.label?.text || attrs.name || 'Submit';
}

export function getFormPlaceholder(node: UiNode): string | undefined {
  const attrs = node.attributes as UiNodeInputAttributes;
  if (node.meta.label?.text === 'ID') return 'you@example.com';
  if (node.meta.label?.text === 'Password') return '••••••••';
  return node.meta.label?.text || attrs.name;
}

export function getRequestDomain(urlString?: string): string | undefined {
  if (!urlString) return;
  try {
    const parsedUrl = new URL(urlString);
    const redirectUri = parsedUrl.searchParams.get('redirect_uri');
    if (!redirectUri) return undefined;
    return new URL(redirectUri).host;
  } catch (e) {
    console.error('Invalid URL:', e);
  }
}
