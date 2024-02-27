import React, { memo } from 'react';
import useAsync from 'react-use/lib/useAsync';
import ReactFlow, { Edge, Handle, Node, Position } from 'reactflow';

import {
  Progress,
  ResponseErrorPanel,
  Table,
  TableColumn,
} from '@backstage/core-components';

import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LaunchIcon from '@mui/icons-material/Launch';

import 'reactflow/dist/style.css';

import { useApi } from '@backstage/core-plugin-api';

import { aapApiRef, AapApiV2 } from '../../api';
import { WorkflowJobNode } from '../../types';

type DenseTableProps = {
  nodes: WorkflowJobNode[];
  aapClient: AapApiV2;
};

const openInNewTab = (url: string, quayClient: AapApiV2) => {
  const aapLink = quayClient.getAapBaseUrl(url);
  window.open(aapLink, '_blank');
};

const CustomNode = memo(({ data, isConnectable }: any) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <div className="flex">
        <div>
          {data.label}
          {data.status === 'pending' ? <span>&#10071;</span> : <></>}
          {data.type === 'job' ? (
            <IconButton
              onClick={() =>
                openInNewTab(`/#/jobs/${data.jobId}/details`, data.aapClient)
              }
            >
              <LaunchIcon />
            </IconButton>
          ) : (
            <IconButton
              onClick={() =>
                openInNewTab(
                  `/#/workflow_approvals/${data.jobId}/details`,
                  data.aapClient,
                )
              }
            >
              <LaunchIcon />
            </IconButton>
          )}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </>
  );
});

const nodeTypes = {
  custom: CustomNode,
};

export const DenseTable = ({ nodes, aapClient }: DenseTableProps) => {
  // const initialNodes = new Node[];
  // const initialEdges = [{ id: 'el1-2', source: '1', target: '2' }];
  const initialNodes: Node<any>[] = [
    {
      id: '0',
      position: { x: 0, y: 0 },
      data: { label: 'START' },
      style: { backgroundColor: '#0041d0' },
    },
  ];
  const initialEdges: Edge<any>[] = [];
  const startNode = new Map<number, boolean>();

  let ypos = 100;

  // add start node

  nodes.forEach(e => {
    const pos = ypos;
    ypos += 100;
    startNode.set(e.id, true);

    let bgcolor = '';

    if (
      e.summary_fields.job.status === 'successful' &&
      e.summary_fields.job.failed === false
    ) {
      bgcolor = 'green';
    }

    initialNodes.push({
      id: e.id.toString(),
      position: { x: 0, y: pos },
      data: {
        label: e.summary_fields.job.name,
        status: e.summary_fields.job.status,
        aapClient: aapClient,
        jobId: e.summary_fields.job.id,
        type: e.summary_fields.job.type,
      },
      type: 'custom',
      style: {
        border: '1px solid #777',
        padding: 10,
        backgroundColor: bgcolor,
      },
    });
  });

  nodes.forEach(e => {
    e.success_nodes.forEach(n => {
      startNode.set(n, false);
      initialEdges.push({
        id: 'el' + e.id + '-' + n,
        source: e.id.toString(),
        target: n.toString(),
      });
    });
  });

  startNode.forEach((v, k) => {
    if (v) {
      initialEdges.push({ id: '0-' + k, source: '0', target: k.toString() });
    }
  });

  return (
    <div style={{ width: '80vw', height: '70vh' }}>
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        nodeTypes={nodeTypes}
      />
      {/* <Table
        title="Example User List"
        options={{ search: false, paging: false }}
        columns={columns}
        data={data}
      /> */}
    </div>
  );
};

export const AnsibleJobFetchComponent = () => {
  const aapClient = useApi(aapApiRef);

  const { value, loading, error } = useAsync(async (): Promise<
    WorkflowJobNode[]
  > => {
    // Would use fetch in a real world example

    return (await aapClient.getWorkflowNodes('21')).results;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return <DenseTable nodes={value || []} aapClient={aapClient} />;
};
