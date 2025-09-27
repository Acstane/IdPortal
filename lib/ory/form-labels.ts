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
    ] as UiNodeInputAttributesTypeEnum[]
  ).includes((node.attributes as UiNodeInputAttributes).type);
}

export function getFormLabel(node: UiNode): string {
  const attrs = node.attributes as UiNodeInputAttributes;
  if (node.meta.label?.text === 'ID') return 'Username or Email';
  return node.meta.label?.text || attrs.name || 'Submit';
}

export function getFormPlaceholder(node: UiNode): string | undefined {
  const attrs = node.attributes as UiNodeInputAttributes;
  if (node.meta.label?.text === 'ID') return 'you@example.com';
  if (node.meta.label?.text === 'password') return '••••••••';
  return node.meta.label?.text || attrs.name;
}
