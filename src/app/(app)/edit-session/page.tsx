import { Suspense } from 'react';
import EditSessionClient from './EditSessionClient';

export default function EditSessionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditSessionClient />
    </Suspense>
  );
}