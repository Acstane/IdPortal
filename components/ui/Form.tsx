import {
  LoginFlow,
  RegistrationFlow,
  UiNode,
  UiNodeInputAttributes,
  UiNodeTypeEnum,
} from '@ory/kratos-client';
import { useState } from 'react';
import { Input } from './Input';

export function Form({ flow }: { flow: LoginFlow | RegistrationFlow }) {
  const [form, setForm] = useState<Record<string, string>>(
    Object.fromEntries(
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
    ),
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 'true' : 'false') : value,
    }));
  };

  return (
    <form method={flow.ui.method} action={flow.ui.action}>
      <pre>{JSON.stringify(form, null, 2)}</pre>
      {flow.ui.nodes.map((node: UiNode) => {
        if (node.type === UiNodeTypeEnum.Input) {
          const attrs = node.attributes as UiNodeInputAttributes;
          return (
            <div key={attrs.name}>
              <Input
                key={attrs.name}
                node={node}
                value={form[attrs.name] ?? ''}
                onChange={handleChange}
              />
            </div>
          );
        }
        return null;
      })}
    </form>
  );
}
