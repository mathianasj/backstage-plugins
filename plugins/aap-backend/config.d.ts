import { TaskScheduleDefinitionConfig } from '@backstage/backend-tasks';

export interface Config {
  aap?: {
    /**
     * AAP BaseURL
     * @visibility frontend
     */
    baseUrl: string;
  };
  catalog?: {
    providers?: {
      aap?: {
        [key: string]: {
          /**
           * AapConfig
           * @visibility frontend
           */
          baseUrl: string;
          /** @visibility secret */
          authorization: string;
          system?: string;
          owner?: string;
          schedule?: TaskScheduleDefinitionConfig;
        };
      };
    };
  };
}
