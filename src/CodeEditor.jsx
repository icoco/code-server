import { useRef, useLayoutEffect } from 'react';
import { EditorView, basicSetup } from "codemirror"
import { EditorState } from "@codemirror/state"
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { oneDark } from '@codemirror/theme-one-dark';

// Keys are file ids
// Values are CodeMirror instances
const editorCache = new Map();


// Gets or creates a CodeMirror editor for the given file id.
const getOrCreateEditor = (fileId, data) => {

    const fileExtension = data[fileId].name.split('.').pop();

    const extensions = [
        // json1Sync({ shareDBDoc, path, debug }),
        // vizhubHighlightStyle,
        ///...(fileExtension && fileExtension in langByFileExtension
        ///  ? [langByFileExtension[fileExtension]()]
        ///  : []),
        basicSetup,
        oneDark
    ];

    if (fileExtension === 'js') {
        extensions.push(javascript())
    } else if (fileExtension === 'html') {
        extensions.push(html())
    }


    let editor = editorCache.get(fileId);
    if (!editor) {
        // Cache miss --> mint a new editor.
        editor = new EditorView({
            state: EditorState.create({
                doc: data[fileId].text,
                extensions
            }),
        });

        // Populate the cache.
        editorCache.set(fileId, editor);

    }
    return editor;
};

export const CodeEditor = ({
    activeFileId,
    data
}) => {
    const ref = useRef();

    // useEffect was buggy in that sometimes ref.current was undefined.
    // useLayoutEffect seems to solve that issue.
    useLayoutEffect(() => {
        const editor = getOrCreateEditor(activeFileId, data);
        ref.current.appendChild(editor.dom);

        return () => {
            // if (debug) {
            console.log('Switching to file ' + activeFileId);
            // }
            ref.current.removeChild(editor.dom);
        };
    }, [data, activeFileId]);

    return <div className="Editor" ref={ref} />;
};