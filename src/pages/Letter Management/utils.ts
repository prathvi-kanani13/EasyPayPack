import type { ComponentNode } from './editor components/EditorContext';

export interface Template {
    id: string;
    name: string;
    category: string;
    description: string;
    createdAt: string;
    nodes: Record<string, ComponentNode>;
}

export const EMPLOYEES_DETAILS: Record<string, Record<string, string>> = {
    emp1: {
        'Employee Name': 'John Doe',
        'Employee Code': 'EMP001',
        'Designation': 'Software Engineer',
        'Department': 'Engineering',
        'Joining Date': '2023-11-01',
        'Salary': '$80,000',
    },
    emp2: {
        'Employee Name': 'Jane Smith',
        'Employee Code': 'EMP002',
        'Designation': 'Product Manager',
        'Department': 'Product Management',
        'Joining Date': '2024-02-15',
        'Salary': '$95,000',
    },
    emp3: {
        'Employee Name': 'Robert Johnson',
        'Employee Code': 'EMP003',
        'Designation': 'HR Executive',
        'Department': 'Human Resources',
        'Joining Date': '2022-05-10',
        'Salary': '$60,000',
    }
};

export const SIGNATURES_DETAILS: Record<string, { name: string; designation: string }> = {
    sig1: {
        name: 'Richard Branson',
        designation: 'Chief Executive Officer'
    },
    sig2: {
        name: 'Emma Watson',
        designation: 'Human Resources Director'
    },
    sig3: {
        name: 'Steve Jobs',
        designation: 'Managing Director'
    }
};

interface CompilationResult {
    html: string;
    text: string;
}

export function compileTemplate(
    template: Template,
    employeeId: string,
    signatureId: string
): CompilationResult {
    const employeeInfo = EMPLOYEES_DETAILS[employeeId] || {};
    const signatureInfo = signatureId === 'default' ? SIGNATURES_DETAILS['sig1'] : SIGNATURES_DETAILS[signatureId];

    const replacePlaceholders = (text: string): string => {
        let result = text;
        Object.entries(employeeInfo).forEach(([key, val]) => {
            const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
            result = result.replace(regex, val);
        });
        if (signatureInfo) {
            result = result.replace(/{{\s*Signature\s*}}/g, `${signatureInfo.name}\n${signatureInfo.designation}`);
        }
        return result;
    };

    let textContent = '';

    const renderNode = (nodeId: string): string => {
        const node = template.nodes[nodeId];
        if (!node) return '';

        const { type, props, children } = node;
        const childHtml = children.map(renderNode).join('');

        const getStyleString = (p: typeof props) => {
            let style = '';
            if (p.padding) style += `padding: ${p.padding}; `;
            if (p.margin) style += `margin: ${p.margin}; `;
            if (p.backgroundColor) style += `background-color: ${p.backgroundColor}; `;
            if (p.color) style += `color: ${p.color}; `;
            if (p.textAlign) style += `text-align: ${p.textAlign}; `;
            if (p.fontSize) style += `font-size: ${p.fontSize}; `;
            if (p.fontWeight) style += `font-weight: ${p.fontWeight}; `;
            return style;
        };

        const styleStr = getStyleString(props);

        switch (type) {
            case 'root':
                return `<div style="box-sizing: border-box; font-family: Arial, sans-serif; ${styleStr}">${childHtml}</div>`;
            case 'heading': {
                const H = props.level || 'h2';
                const headingText = replacePlaceholders(props.text || '');
                textContent += `\n\n${headingText.toUpperCase()}\n`;
                return `<${H} style="${styleStr}">${headingText}</${H}>`;
            }
            case 'text':
            case 'paragraph': {
                const paraText = replacePlaceholders(props.text || '');
                textContent += `\n${paraText}\n`;
                return `<p style="line-height: 1.6; ${styleStr}">${paraText}</p>`;
            }
            case 'block':
            case 'column':
                return `<div style="${styleStr}">${childHtml}</div>`;
            case 'row':
                return `<div style="display: flex; gap: ${props.gap || '0px'}; ${styleStr}">${childHtml}</div>`;
            case 'image':
                return `<div style="text-align: ${props.alignment || 'center'}; margin: ${props.margin || '0'}">
                    <img src="${props.src || ''}" alt="${props.alt || ''}" style="width: ${props.width || '100%'}; display: inline-block; ${styleStr}" />
                </div>`;
            case 'divider':
                textContent += '\n--------------------------------------------------\n';
                return `<hr style="border: none; border-top: ${props.thickness || '1px'} solid ${props.borderColor || '#e5e7eb'}; margin: ${props.marginY || '16px'} 0; ${styleStr}" />`;
            default:
                return '';
        }
    };

    const html = renderNode('root');
    return { html, text: textContent.trim() };
}
