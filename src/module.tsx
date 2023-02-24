import { PanelPlugin, PanelProps } from '@grafana/data';
import { CodeEditor } from '@grafana/ui';
import React from 'react';

/**
 * Compute a pseudo-JSON path on an object.
 */
function pseudoJsonPath(obj: any, path: string): any {
    /**
     * Escape `.` using `%.`
     */
    const parts = path.split(/(?<=[^%])\./).map(part => part.replace('%.', '.'));
    /**
     * This object is what is returned from the pseudo-JSON path.
     */
    let extracted = [obj];
    for (let part of parts) {
        if (part === '*') {
            // Pass-through for readability
            continue;
        }
        /**
         * Match `key[index]` (always matches)
         */
        const match = part.match(/(.+)(\[([0-9]+|\*)\])|(.+)/),
            key = match![1] ?? match![4],
            index = match![3];
        // Map keys for each object
        extracted = extracted.map(x => x[key]).flat();
        if (!Number.isNaN(+index)) {
            // Return that specific item in the array
            extracted = [extracted[+index]];
        }
        // Return undefined if that's all that's left
        if (extracted.length === 1 && extracted[0] === undefined) {
            return undefined;
        }
    }
    // Return the object if it's an array of 1 object
    if (extracted.length === 1) {
        return extracted[0]
    }
    // Return the extracted object
    return extracted;
}

interface RawDataConfig {
    path: string;
    indent: number;
    meta: string;
}

const MyPanel: React.FC<PanelProps<RawDataConfig>> = panelProps => {
    try {
        return (<CodeEditor height={panelProps.height - 10} readOnly={true} showLineNumbers={true} value={JSON.stringify(pseudoJsonPath(panelProps[panelProps.options.meta], panelProps.options.path ?? '*'), undefined, panelProps.options.indent)} monacoOptions={{ tabSize: panelProps.options.indent, detectIndentation: false }} language='json' />);
    }
    catch (e) {
        return (<div className='panel-empty'>{e}</div>);
    }
};

export const plugin = new PanelPlugin<RawDataConfig>(MyPanel).setPanelOptions(builder => builder
    .addSliderInput({
        name: 'Indentation',
        path: 'indent',
        description: 'Set the number of spaces to indent.',
        defaultValue: 2,
        settings: {
            min: 1,
            max: 8,
            step: 1
        }
    })
    .addTextInput({
        name: 'JSON Path',
        path: 'path',
        description: 'Set the output JSON path. Use `.` to separate fields, `%.` to escape periods, `[i]` where `i` is an integer to select a single item in an array, and `.*` and `[*]` are wildcards that will select all items in an array.',
        defaultValue: '*',
        settings: {
            placeholder: '*',
        }
    })
    .addSelect({
        name: 'Metadata Selector',
        path: 'meta',
        description: 'Select which panel metadata to display.',
        defaultValue: 'data',
        settings: {
            allowCustomValue: false,
            isClearable: false,
            options: [
                {
                    label: 'Data',
                    value: 'data',
                    description: 'Result set of panel queries',
                },
                {
                    label: 'ID',
                    value: 'id',
                    description: 'ID of the panel within the current dashboard',
                },
                {
                    label: 'Time Range',
                    value: 'timeRange',
                    description: 'Time range of the current dashboard',
                },
                {
                    label: 'Time Zone',
                    value: 'timeZone',
                    description: 'Time zone of the current dashboard',
                },
                {
                    label: 'Options',
                    value: 'options',
                    description: 'User selected panel options',
                },
                {
                    label: 'Transparent',
                    value: 'transparent',
                    description: 'Indicates whether or not panel should be rendered transparent',
                },
                {
                    label: 'Width',
                    value: 'width',
                    description: 'Current width of the panel',
                },
                {
                    label: 'Height',
                    value: 'height',
                    description: 'Current height of the panel',
                },
                {
                    label: 'Field Configuration Source',
                    value: 'fieldConfig',
                    description: 'Field options configuration',
                },
                {
                    label: 'Title',
                    value: 'title',
                    description: 'Panel title',
                },
            ]
        }
    })
);