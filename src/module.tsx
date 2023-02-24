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
    jp: string;
    indent: number;
}

const MyPanel: React.FC<PanelProps<RawDataConfig>> = ({ options, data, height }) => <CodeEditor height={height - 10} readOnly={true} showLineNumbers={true} value={JSON.stringify(pseudoJsonPath(data, options.jp ?? '*'), undefined, options.indent)} monacoOptions={{ tabSize: options.indent, detectIndentation: false }} language='json' />;

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
        path: 'jp',
        description: 'Set the output JSON path.',
        defaultValue: '*',
        settings: {
            placeholder: '*',
        }
    })
);