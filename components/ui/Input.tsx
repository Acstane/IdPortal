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

import { useEffect } from 'react';

type Props = {
  icon?: React.ReactNode;
  node: UiNode;
  value: string;
  customButtonClassName?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function Input({
  node,
  value,
  onChange,
  customButtonClassName,
  icon,
}: Props) {
  const {
    type,
    name,
    autocomplete,
    onclick,
    onclickTrigger,
    onload,
    onloadTrigger,
    ...rest
  } = node.attributes as UiNodeInputAttributes;

  const labelText = getFormLabel(node);

  useEffect(() => {
    const fnName = onloadTrigger || onload;
    if (fnName && typeof (window as any)[fnName] === 'function') {
      (window as any)[fnName]();
    }
  }, [onload, onloadTrigger]);

  const handleClick = () => {
    const fnName = onclickTrigger || onclick;
    if (fnName && typeof (window as any)[fnName] === 'function') {
      (window as any)[fnName]();
    }
  };

  const getElement = () => {
    console.log(type, name, value);
    switch (type) {
      case UiNodeInputAttributesTypeEnum.Hidden:
        return <input type={type} name={name} value={value || 'true'} />;
      case UiNodeInputAttributesTypeEnum.Checkbox:
        return (
          <div>
            <input
              type={type}
              name={name}
              id={name}
              value={value || 'true'}
              checked={value === 'true'}
              onChange={onChange}
              className="focus:ring-fuchsia-500 h-4 w-4 text-fuchsia-600 border-gray-300 rounded checkbox"
            />
            <label
              htmlFor={name}
              className="ml-3 text-sm font-medium text-gray-700"
            >
              {labelText}
            </label>
          </div>
        );
      case UiNodeInputAttributesTypeEnum.Submit:
      case UiNodeInputAttributesTypeEnum.Button:
        return customButtonClassName ? (
          <button
            name={name}
            className={customButtonClassName}
            value={value}
            onClick={handleClick}
          >
            {icon}
            {getFormLabel(node)}
          </button>
        ) : (
          <div className="flex items-center">
            <button
              type={type}
              name={name}
              className="w-full py-3 px-4 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-medium rounded-lg hover:opacity-90 transition shadow-md hover:shadow-lg cursor-pointer"
              value={value}
              onClick={handleClick}
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
              {getFormLabel(node)}
            </label>
            <a
              href="#"
              className="text-xs gradient-text text-transparent bg-clip-text"
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
