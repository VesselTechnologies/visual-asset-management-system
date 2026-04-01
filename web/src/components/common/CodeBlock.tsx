import React, { useState } from "react";
import { Button } from "@cloudscape-design/components";

interface CodeBlockProps {
    children: string;
    multiline?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ children, multiline = false }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(children);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    return (
        <div style={{ 
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#232f3e', 
            border: '1px solid #414d5c', 
            borderRadius: '8px', 
            padding: multiline ? '16px' : '12px 16px',
            marginTop: '8px',
            fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
            fontSize: '14px',
            color: '#ffffff',
            overflow: 'auto',
            cursor: 'pointer'
        }} onClick={handleCopy}>
            {/* Tooltip */}
            {copied && (
                <div style={{
                    position: 'absolute',
                    top: '-35px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#1f2937',
                    color: '#ffffff',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    zIndex: 1000,
                    border: '1px solid #374151',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
                }}>
                    ✓ Copied!
                    {/* Arrow */}
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 0,
                        height: 0,
                        borderLeft: '6px solid transparent',
                        borderRight: '6px solid transparent',
                        borderTop: '6px solid #1f2937'
                    }} />
                </div>
            )}
            <pre style={{ 
                margin: 0, 
                marginRight: '12px',
                flex: 1,
                whiteSpace: multiline ? 'pre-wrap' : 'nowrap',
                wordBreak: multiline ? 'break-word' : 'normal'
            }}>
                {children}
            </pre>
            <div style={{
                backgroundColor: copied ? '#16a34a' : '#6b7280',
                border: '1px solid #374151',
                borderRadius: '4px',
                padding: '4px',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer'
            }} onClick={handleCopy}>
                <Button
                    variant="icon"
                    iconName={copied ? "check" : "copy"}
                    onClick={handleCopy}
                    ariaLabel={copied ? "Copied!" : "Copy to clipboard"}
                />
            </div>
        </div>
    );
};