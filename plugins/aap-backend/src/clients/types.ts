export type JobTemplate = {
  id: number;
  url: string;
  name: string;
  description: string;
  type: string;
  [key: string]: any;
};

export type Jobs = any[];

export type Job = {
  id: number;
  url: string;
  name: string;
}

export type JobTemplates = any[];
