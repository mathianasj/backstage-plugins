import React from 'react';

import { createDevApp } from '@backstage/dev-utils';

import { AapPage, aapPlugin } from '../src/plugin';

createDevApp()
  .registerPlugin(aapPlugin)
  .addPage({
    element: <AapPage />,
    title: 'Root Page',
    path: '/aap',
  })
  .render();
