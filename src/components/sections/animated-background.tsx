'use client';

import UnicornScene from 'unicornstudio-react';

export function AnimatedBackground({ className, projectId }: { className: string, projectId: string }) {
  return (
    <div className={className}>
        <UnicornScene projectId={projectId} width="100%" height="100%"/>
    </div>
  );
}
