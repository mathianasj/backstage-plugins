import { Entity } from '@backstage/catalog-model';
import {
  configApiRef,
  createApiFactory,
  createPlugin,
  createRoutableExtension,
  discoveryApiRef,
  identityApiRef,
} from '@backstage/core-plugin-api';

import { AapApiClient, aapApiRef } from './api';
import { rootRouteRef } from './routes';

export const aapPlugin = createPlugin({
  id: 'aap',
  routes: {
    root: rootRouteRef,
  },
  apis: [
    createApiFactory({
      api: aapApiRef,
      deps: {
        discoveryApi: discoveryApiRef,
        configApi: configApiRef,
        identityApi: identityApiRef,
      },
      factory: ({ discoveryApi, configApi, identityApi }) =>
        new AapApiClient({ discoveryApi, configApi, identityApi }),
    }),
  ],
});

export const AapPage = aapPlugin.provide(
  createRoutableExtension({
    name: 'AapPage',
    component: () =>
      import('./components/AnsibleJobComponent').then(
        m => m.AnsibleJobComponent,
      ),
    mountPoint: rootRouteRef,
  }),
);

export const isAnsibleJob = (entity: Entity) =>
  entity?.spec?.type === 'ansible_job';
