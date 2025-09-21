import { UiNode, UiNodeInputAttributes } from '@ory/kratos-client';

type Props = {
  node: UiNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function Input({ node, value, onChange }: Props) {
  const { type, name, autocomplete, ...rest } =
    node.attributes as UiNodeInputAttributes;

  const isCheckbox = type === 'checkbox';

  return (
    <div>
      <input
        {...rest}
        type={type}
        name={name}
        autoComplete={autocomplete || 'off'}
        value={value}
        checked={isCheckbox && value === 'true'}
        onChange={onChange}
      />
    </div>
  );
}
