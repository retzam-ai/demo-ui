import { TabGroup } from '#/ui/tab-group';
import React from 'react';
import { Category } from '../api/categories/category';

const title = 'Supervised Learning';

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
  const categories: Category[] = [
    {
      name: 'Cars',
      slug: 'cars',
      parent: 'classification',
      count: 0,
    },
    {
      name: 'Injury',
      slug: 'injury',
      parent: 'classification',
      count: 0,
    },
  ];

  return (
    <div className="space-y-9">
      <div className="flex justify-between">
        <TabGroup
          path="/classification"
          items={[
            {
              text: 'Home',
            },
            ...categories.map((x) => ({
              text: x.name,
              slug: x.slug,
            })),
          ]}
        />
      </div>

      <div>{children}</div>
    </div>
  );
}
