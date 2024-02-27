export interface Config {
  /** Configurations for the AAP plugin */
  aap?: {
    /**
     * The base url of the AAP instance.
     * @visibility frontend
     */
    baseUrl: string;
  };
}
