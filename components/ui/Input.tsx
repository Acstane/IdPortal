import {
  getFormLabel,
  getFormPlaceholder,
  shouldDisplayLabel,
} from '@/lib/ory/form-labels';
import {
  UiNode,
  UiNodeInputAttributes,
  UiNodeInputAttributesTypeEnum,
} from '@ory/kratos-client';
import { get } from 'http';

type Props = {
  node: UiNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function Input({ node, value, onChange }: Props) {
  const { type, name, autocomplete, ...rest } =
    node.attributes as UiNodeInputAttributes;

  const labelText = getFormLabel(node);

  const getElement = () => {
    switch (type) {
      case UiNodeInputAttributesTypeEnum.Hidden:
        return <input type={type} name={name} value={value || 'true'} />;
      case UiNodeInputAttributesTypeEnum.Checkbox:
        return (
          <div className="flex items-center">
            <input
              type={type}
              name={name}
              value={value || 'true'}
              checked={value === 'true'}
              onChange={onChange}
              className="mr-2"
            />
            <label htmlFor={name} className="text-sm font-medium text-gray-700">
              {labelText}
            </label>
          </div>
        );
      case UiNodeInputAttributesTypeEnum.Submit:
      case UiNodeInputAttributesTypeEnum.Button:
        return (
          <div className="flex items-center">
            <button
              type={type}
              name={name}
              className="w-full py-3 px-4 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-medium rounded-lg hover:opacity-90 transition shadow-md hover:shadow-lg cursor-pointer"
              value={value}
            >
              {getFormLabel(node)}
            </button>
          </div>
        );
      case UiNodeInputAttributesTypeEnum.Password:
      case UiNodeInputAttributesTypeEnum.Text:
      case UiNodeInputAttributesTypeEnum.Email:
        return (
          <input
            type={type}
            name={name}
            autoComplete={autocomplete}
            value={value}
            onChange={onChange}
            placeholder={getFormPlaceholder(node)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 input-field focus:outline-none focus:border-fuchsia-500 transition"
          />
        );
    }
  };

  return (
    <div>
      {shouldDisplayLabel(node) &&
        (node.meta.label?.text === 'Password' ? (
          <div className="flex justify-between items-center mb-1">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              {getFormPlaceholder(node)}
            </label>
            <a
              href="#"
              className="text-xs text-fuchsia-600 hover:text-fuchsia-700"
            >
              Forgot password?
            </a>
          </div>
        ) : (
          <label
            htmlFor={name}
            className="block text-sm font-medium text-gray-700 mb-1"
            id={node.meta.label?.id ? `label-${node.meta.label.id}` : undefined}
          >
            {labelText}
          </label>
        ))}
      <div className="relative">{getElement()}</div>
    </div>
  );
}
