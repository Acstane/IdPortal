'use client';

import { FlowError } from '@ory/kratos-client';
import * as React from 'react';
import { getFlowError } from '@/lib/ory/kratos';

export default function ErrorPage() {
  const [error, setError] = React.useState<FlowError | null>(null);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    getFlowError(id || '')
      .then(setError)
      .catch(console.error);
  }, []);

  if (error) {
    return <pre>{JSON.stringify(error, null, 2)}</pre>;
  }

  return <div>Error Page</div>;
}
