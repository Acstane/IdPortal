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
        .filter((n: UiNode) => n.type === UiNodeTypeEnum.Input)
        .map((n: UiNode) => {
          const attrs = n.attributes as UiNodeInputAttributes;
          return [attrs.name, attrs.value ?? ''];
        }),
    ),
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
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
