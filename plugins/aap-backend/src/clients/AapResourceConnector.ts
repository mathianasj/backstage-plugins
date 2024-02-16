import { Jobs, JobTemplates } from './types';

export function listJobs(
  baseUrl: string,
  access_token: string,
): Promise<Jobs> {
  return fetch(`${baseUrl}/api/v2/workflow_jobs`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: access_token,
    },
    method: 'GET',
  }).then(async response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const resData = await response.json();
    return resData.results as Promise<Jobs>;
  });
}

export function listJobTemplates(
  baseUrl: string,
  access_token: string,
): Promise<JobTemplates> {
  return fetch(`${baseUrl}/api/v2/job_templates`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: access_token,
    },
    method: 'GET',
  }).then(async response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const resData = await response.json();
    return resData.results as Promise<JobTemplates>;
  });
}

export function listWorkflowJobTemplates(
  baseUrl: string,
  access_token: string,
): Promise<JobTemplates> {
  return fetch(`${baseUrl}/api/v2/workflow_job_templates`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: access_token,
    },
    method: 'GET',
  }).then(async response => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const resData = await response.json();
    return resData.results as Promise<JobTemplates>;
  });
}
