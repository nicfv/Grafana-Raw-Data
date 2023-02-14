import { PanelPlugin, PanelProps } from "@grafana/data";
import React from 'react';

const MyPanel: React.FC<PanelProps> = ({ data }) => <pre style={{ height: '100%' }}>{JSON.stringify(data, null, 2)}</pre>;

export const plugin = new PanelPlugin(MyPanel);