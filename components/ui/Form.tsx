import {
  LoginFlow,
  RegistrationFlow,
  UiNode,
  UiNodeGroupEnum,
  UiNodeInputAttributes,
  UiNodeScriptAttributes,
  UiNodeTypeEnum,
} from '@ory/kratos-client';
import { useState } from 'react';
import { Input } from './Input';
import OidcButton from './OidcButton';
import Link from 'next/link';
import { GoPasskeyFill } from 'react-icons/go';

type CrossOrigin = 'anonymous' | 'use-credentials' | undefined;
type HTMLAttributeReferrerPolicy =
  | 'no-referrer'
  | 'no-referrer-when-downgrade'
  | 'origin'
  | 'origin-when-cross-origin'
  | 'same-origin'
  | 'strict-origin'
  | 'strict-origin-when-cross-origin'
  | 'unsafe-url';

export function Form({ flow }: { flow: LoginFlow | RegistrationFlow }) {
  const initialFormState = Object.fromEntries(
    flow.ui.nodes
      .filter(n => n.type === UiNodeTypeEnum.Input)
      .map(n => {
        const attrs = n.attributes as UiNodeInputAttributes;
        const val =
          attrs.type === 'checkbox'
            ? attrs.value
              ? 'true'
              : 'false'
            : (attrs.value ?? '');
        return [attrs.name, val];
      }),
  );

  const type = flow.request_url.includes('registration')
    ? 'registration'
    : 'login';
  const [form, setForm] = useState<Record<string, string>>(initialFormState);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    node: UiNode,
  ) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? (checked ? 'true' : 'false') : value;

    setForm(prev => ({ ...prev, [name]: newValue }));

    node.messages = [];
  };

  const nodesByGroup = {
    default: flow.ui.nodes.filter(n => n.group === UiNodeGroupEnum.Default),
    password: flow.ui.nodes.filter(n => n.group === UiNodeGroupEnum.Password),
    profile: flow.ui.nodes.filter(n => n.group === UiNodeGroupEnum.Profile),
    passkey: flow.ui.nodes.filter(n => n.group === UiNodeGroupEnum.Passkey),
    webauthn: flow.ui.nodes.filter(n => n.group === UiNodeGroupEnum.Webauthn),
    oidc: flow.ui.nodes.filter(n => n.group === UiNodeGroupEnum.Oidc),
    scripts: flow.ui.nodes.filter(n => n.type === UiNodeTypeEnum.Script),
  };

  const renderNode = (node: UiNode) => {
    const attrs = node.attributes;

    if (node.type === UiNodeTypeEnum.Script) {
      const scriptAttrs = attrs as UiNodeScriptAttributes;
      return (
        <script
          key={scriptAttrs.id}
          src={scriptAttrs.src}
          async={scriptAttrs.async}
          crossOrigin={scriptAttrs.crossorigin as CrossOrigin}
          integrity={scriptAttrs.integrity}
          nonce={scriptAttrs.nonce}
          referrerPolicy={
            scriptAttrs.referrerpolicy as HTMLAttributeReferrerPolicy
          }
        />
      );
    }

    if (node.type === UiNodeTypeEnum.Input) {
      const inputAttrs = attrs as UiNodeInputAttributes;

      if (node.group === UiNodeGroupEnum.Oidc) {
        return <OidcButton key={inputAttrs.name} node={node} />;
      }

      if (node.group === UiNodeGroupEnum.Passkey) {
        return (
          <Input
            key={inputAttrs.name}
            node={node}
            value={form[inputAttrs.name] || inputAttrs.value}
            onChange={e => handleChange(e, node)}
            icon={<GoPasskeyFill className="w-4 h-4 mr-2 text-gray-600" />}
            customButtonClassName="text-sm font-medium text-fuchsia-600 hover:text-fuchsia-700 flex items-center cursor-pointer"
          />
        );
      }

      return (
        <Input
          key={inputAttrs.name}
          node={node}
          value={form[inputAttrs.name]}
          onChange={e => handleChange(e, node)}
        />
      );
    }

    return null;
  };

  return (
    <>
      <form
        method={flow.ui.method}
        action={flow.ui.action}
        className="space-y-4"
      >
        {nodesByGroup.default.map(renderNode)}

        {nodesByGroup.password.map(renderNode)}

        {nodesByGroup.profile.map(renderNode)}

        {(flow.ui.messages || []).length > 0 && (
          <div className="mb-4">
            {flow.ui.messages!.map(m => (
              <div
                key={m.id}
                className="p-3 mb-2 text-sm text-red-700 bg-red-100 rounded border border-red-400"
              >
                {m.text}
              </div>
            ))}
          </div>
        )}

        {nodesByGroup.passkey.length > 0 && (
          <div className="flex justify-center space-x-4">
            {nodesByGroup.passkey.map(renderNode)}
          </div>
        )}

        {nodesByGroup.webauthn.map(renderNode)}
      </form>

      <form method={flow.ui.method} action={flow.ui.action}>
        {nodesByGroup.oidc.length > 0 && (
          <>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-500 card-background">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="flex justify-center space-x-4">
              {nodesByGroup.oidc.map(renderNode)}
            </div>
          </>
        )}
      </form>

      <div className="mt-4 text-center text-sm text-gray-500">
        {type === 'login'
          ? "Don't have an account?"
          : 'Already have an account?'}{' '}
        <Link
          href={`/${type === 'login' ? 'register' : 'login'}${
            flow.oauth2_login_challenge
              ? `?login_challenge=${flow.oauth2_login_challenge}`
              : ''
          }`}
          className="font-medium text-fuchsia-600 hover:text-fuchsia-700"
        >
          {type === 'login' ? 'Create one' : 'Sign in'}
        </Link>
      </div>

      {nodesByGroup.scripts.map(renderNode)}
    </>
  );
}
