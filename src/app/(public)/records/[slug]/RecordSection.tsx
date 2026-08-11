/**
 * RecordSection — accessible section wrapper for innovation record content sections.
 *
 * Omits rendering entirely when there are no children with content,
 * preventing empty sections with raw 'null' text from appearing.
 */

import React from 'react';

interface Props {
  id: string;
  title: string;
  children: React.ReactNode;
}

export function RecordSection({ id, title, children }: Props) {
  // Check if any child has content (filter null/undefined/empty fragments)
  const hasContent = React.Children.toArray(children).some(child => !!child);
  if (!hasContent) return null;

  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="mt-8">
      <h2 id={`${id}-heading`} className="text-xl font-bold border-b border-gray-200 pb-2 mb-4">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
