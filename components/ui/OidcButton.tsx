import { UiNode, UiNodeInputAttributes } from '@ory/kratos-client';
import { BsDiscord, BsGoogle } from 'react-icons/bs';

interface OidcButtonProps {
  node: UiNode;
}

function getIcon(value: string) {
  switch (value) {
    case 'discord':
      return <BsDiscord className="w-6 h-6 mr-2" />;
    case 'google':
      return <BsGoogle className="w-6 h-6 mr-2" />;
    default:
      return null;
  }
}

export default function OidcButton({ node }: OidcButtonProps) {
  const { name, type, value, disabled } =
    node.attributes as UiNodeInputAttributes;

  return (
    <button
      name={name}
      value={value}
      disabled={disabled}
      className="cursor-pointer"
    >
      {getIcon(value)}
    </button>
  );
}
