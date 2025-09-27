import { AxiosError } from 'axios';
import Link from 'next/link';

import { BiSolidError } from 'react-icons/bi';

import { ErrorGeneric, FlowError } from '@ory/kratos-client';
import { useEffect, useState } from 'react';

export function Error({
  error,
  flowError,
}: {
  error?: AxiosError<ErrorGeneric>;
  flowError?: FlowError;
}) {
  const reason =
    new URLSearchParams(window.location.search).get('error_reason') ||
    error?.response?.data?.error?.reason ||
    'An unexpected error occurred.';
  const status =
    new URLSearchParams(window.location.search).get('error') ||
    error?.response?.data?.error?.code ||
    '400';
  const message =
    (new URLSearchParams(window.location.search).get(
      'error_description',
    ) as string) ||
    error?.response?.data?.error?.message ||
    'Error';

  const supportBody = encodeURIComponent(`
Error Details:
---------------
- Status: ${status}
- Reason: ${reason}
- Message: ${message}
- URL: ${document.location.href}
- Requested URL: ${error?.config?.url || 'N/A'}
- Method: ${error?.config?.method || 'N/A'}
- Headers: ${JSON.stringify(error?.config?.headers, null, 2)}
- Request Data: ${JSON.stringify(error?.config?.data, null, 2)}

Please investigate this issue.
  `);

  const mailtoLink = `mailto:support@acstane.com?subject=${encodeURIComponent(
    'Acstane Identity Error Report',
  )}&body=${supportBody}`;

  return (
    <>
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <BiSolidError className="text-red-600 w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Something went wrong
        </h1>
        <p className="text-gray-600 text-sm">{reason}</p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <i data-feather="alert-circle" className="h-5 w-5 text-red-600"></i>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">{status}</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{message}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Link
          href="/"
          className="w-full block py-3 px-4 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white font-medium rounded-lg hover:opacity-90 transition shadow-lg text-center"
        >
          Return to Home
        </Link>
        <a
          href={mailtoLink}
          className="block w-full block py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition text-center"
        >
          Contact Support
        </a>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        Need help?{' '}
        <a
          href="https://discord.gg/6Yv5U9V3ux"
          target="_blank"
          className="font-medium text-fuchsia-600 hover:text-fuchsia-700"
        >
          Visit our help center
        </a>
      </div>
    </>
  );
}
