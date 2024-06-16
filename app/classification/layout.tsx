import { TabGroup } from '#/ui/tab-group';
import React from 'react';
import { Category } from '#/app/api/categories/category';

const title = 'Classification - Supervised Learning';

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
    {
      name: 'Machines',
      slug: 'machines',
      parent: 'classification',
      count: 0,
    },
    {
      name: 'Marketing',
      slug: 'marketing',
      parent: 'classification',
      count: 0,
    },
    {
      name: 'Diabetes',
      slug: 'diabetes',
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
