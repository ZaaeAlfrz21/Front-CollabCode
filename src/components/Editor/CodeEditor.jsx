import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ code, onChange }) => {
    
    const handleEditorChange = (value) => {
        onChange(value);
    };

    return (
        // Height 100% agar mengikuti wadah induknya
        <Editor
            height="100%"
            defaultLanguage="javascript"
            theme="vs-dark" // Tema bawaan Monaco yang gelap
            value={code}
            onChange={handleEditorChange}
            options={{
                minimap: { enabled: true }, // Minimap di kanan
                fontSize: 14,
                wordWrap: 'on',
                automaticLayout: true, // Penting agar tidak nge-bug saat resize
                padding: { top: 15 }
            }}
        />
    );
};

export default CodeEditor;