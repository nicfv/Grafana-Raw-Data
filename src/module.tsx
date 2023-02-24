import { PanelPlugin, PanelProps } from '@grafana/data';
import { CodeEditor } from '@grafana/ui';
import React from 'react';

const MyPanel: React.FC<PanelProps> = ({ data, height }) => <CodeEditor height={height - 10} readOnly={true} showLineNumbers={true} value={JSON.stringify(data, null, 2)} language='json' />;

export const plugin = new PanelPlugin(MyPanel);