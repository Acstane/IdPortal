'use client';

import { FlowError } from '@ory/kratos-client';
import * as React from 'react';
import { getFlowError } from '@/lib/ory/kratos';
import Loading from '@/components/ui/Loading';

import { Error } from '@/components/ui/Error';

export default function ErrorPage() {
  const [error, setError] = React.useState<FlowError | null>(null);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id) {
      getFlowError(id || '')
        .then(setError)
        .catch(console.error);
    } else {
      const errorId = params.get('error');
      const errorDescription = params.get('error_description');
      if (errorId && errorDescription) {
        setError({
          error: {
            code: 400,
            message: errorId,
            reason: errorDescription,
          },
        } as FlowError);
      }
    }
  }, []);

  if (error) return <Error flowError={error} />;

  return <Loading />;
}
