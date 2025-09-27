import {
  LoginFlow,
  RegistrationFlow,
  UiNode,
  UiNodeInputAttributes,
  UiNodeScriptAttributes,
  UiNodeTypeEnum,
} from '@ory/kratos-client';
import { useState, useEffect } from 'react';
import { Input } from './Input';
import OidcButton from './OidcButton';
import Link from 'next/link';
import { OAuth2Client } from '@ory/hydra-client';
import { GoPasskeyFill } from 'react-icons/go';
import { IoMail } from 'react-icons/io5';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 'true' : 'false') : value,
    }));
  };

  return (
    <>
      <form
        method={flow.ui.method}
        action={flow.ui.action}
        className="space-y-4"
      >
        {flow.ui.nodes
          .filter(
            node =>
              node.group !== 'code' &&
              node.group !== 'passkey' &&
              node.group !== 'oidc' &&
              node.type !== UiNodeTypeEnum.Script,
          )
          .map((node: UiNode) => {
            if (node.type === UiNodeTypeEnum.Input) {
              const attrs = node.attributes as UiNodeInputAttributes;

              return (
                <div
                  key={
                    attrs.name +
                    attrs.type +
                    node.group +
                    node.type +
                    node.meta.label?.text
                  }
                >
                  <Input
                    node={node}
                    value={form[attrs.name]}
                    onChange={handleChange}
                  />
                </div>
              );
            }
            return null;
          })}

        <div className="flex justify-center space-x-4 mt-6">
          {flow.ui.nodes
            .filter(
              node =>
                (node.group === 'code' || node.group === 'passkey') &&
                node.type !== UiNodeTypeEnum.Script,
            )
            .map((node: UiNode) => {
              console.log(node);
              const attrs = node.attributes as UiNodeInputAttributes;

              return (
                <Input
                  icon={
                    node.group === 'passkey' ? (
                      <GoPasskeyFill className="w-4 h-4 mr-2" />
                    ) : (
                      <IoMail className="w-4 h-4 mr-2" />
                    )
                  }
                  customButtonClassName="text-sm text-fuchsia-600 hover:text-fuchsia-700 flex items-center cursor-pointer"
                  key={
                    attrs.name +
                    attrs.type +
                    node.group +
                    node.type +
                    node.meta.label?.text
                  }
                  node={node}
                  value={form[attrs.name]}
                  onChange={handleChange}
                />
              );
            })}
        </div>

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
          {flow?.ui.nodes
            .filter(node => node.group === 'oidc')
            .map((node, index) => (
              <div key={index} className="text-gray-600 hover:text-gray-800">
                <OidcButton node={node} />
              </div>
            ))}
        </div>
      </form>

      <div className="mt-4 text-center text-sm text-gray-500">
        {type === 'login'
          ? "Don't have an account?"
          : 'Already have an account?'}{' '}
        <Link
          href={`/${type === 'login' ? 'register' : 'login'}${flow.oauth2_login_challenge ? `?login_challenge=${flow.oauth2_login_challenge}` : ''}`}
          className="font-medium gradient-text text-transparent bg-clip-text"
        >
          {type === 'login' ? 'Create one' : 'Sign in'}
        </Link>
      </div>

      {flow.ui.nodes
        .filter(node => node.type === UiNodeTypeEnum.Script)
        .map((node: UiNode) => {
          const attrs = node.attributes as UiNodeScriptAttributes;

          return (
            <script
              key={attrs.id}
              src={attrs.src}
              async={attrs.async}
              crossOrigin={attrs.crossorigin as CrossOrigin}
              integrity={attrs.integrity}
              nonce={attrs.nonce}
              referrerPolicy={
                attrs.referrerpolicy as HTMLAttributeReferrerPolicy
              }
            ></script>
          );
        })}
    </>
  );
}
