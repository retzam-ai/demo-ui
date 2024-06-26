import { ClickCounter } from '#/ui/click-counter';
import { TabGroup } from '#/ui/tab-group';
import React from 'react';

const title = 'Marketing';

export const metadata = {
  title,
  openGraph: {
    title,
    images: [`/api/og?title=${title}`],
  },
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-9">
      <div className="flex justify-between">
        <TabGroup
          path="/marketing"
          items={[
            {
              text: 'Marketing',
            },
          ]}
        />
      </div>

      <div>{children}</div>
    </div>
  );
}
