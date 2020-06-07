// using javascript since the prism doesn't seem to be working with typescript
import React from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';

export const CodeEditor = ({ value, setValue, index }) => {
  return (
    <div>
      <Editor
        value={value}
        onValueChange={(code) => setalue(code, index)}
        highlight={(code) => highlight(code, languages.js)}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
        }}
      />
    </div>
  );
};
