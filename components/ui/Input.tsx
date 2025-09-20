import { UiNode, UiNodeInputAttributes } from '@ory/kratos-client';

type Props = {
  node: UiNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function Input({ node, value, onChange }: Props) {
  const {
    value: _value,
    autocomplete,
    ...rest
  } = node.attributes as UiNodeInputAttributes;

  return (
    <div>
      <input
        {...rest}
        autoComplete={autocomplete || 'off'}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
