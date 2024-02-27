import {
  ConfigApi,
  createApiRef,
  DiscoveryApi,
  IdentityApi,
} from '@backstage/core-plugin-api';

import { WorkflowJobResponse } from '../types';

const DEFAULT_PROXY_PATH = '/aap/api';

export interface AapApiV2 {
  getWorkflowNodes(id: string): Promise<WorkflowJobResponse>;
  getAapBaseUrl(uri: string): string;
}

export const aapApiRef = createApiRef<AapApiV2>({
  id: 'plugin.aap.service',
});

export type Options = {
  discoveryApi: DiscoveryApi;
  configApi: ConfigApi;
  identityApi: IdentityApi;
};

export class AapApiClient implements AapApiV2 {
  // @ts-ignore
  private readonly discoveryApi: DiscoveryApi;

  private readonly configApi: ConfigApi;

  private readonly identityApi: IdentityApi;

  constructor(options: Options) {
    this.discoveryApi = options.discoveryApi;
    this.configApi = options.configApi;
    this.identityApi = options.identityApi;
  }

  private async getBaseUrl() {
    const proxyPath =
      this.configApi.getOptionalString('aap.proxyPath') || DEFAULT_PROXY_PATH;
    return `${await this.discoveryApi.getBaseUrl('proxy')}${proxyPath}`;
  }

  private async fetcher(url: string) {
    const { token: idToken } = await this.identityApi.getCredentials();
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(idToken && { Authorization: `Bearer ${idToken}` }),
      },
    });
    if (!response.ok) {
      throw new Error(
        `failed to fetch data, status ${response.status}: ${response.statusText}`,
      );
    }
    return await response.json();
  }

  getAapBaseUrl(uri: string) {
    const baseAap = this.configApi.getString('aap.baseUrl');

    return `${baseAap}/${uri}`;
  }

  async getWorkflowNodes(id: string) {
    const proxyUrl = await this.getBaseUrl();

    return (await this.fetcher(
      `${proxyUrl}/v2/workflow_jobs/${id}/workflow_nodes/`,
    )) as WorkflowJobResponse;
  }
}
