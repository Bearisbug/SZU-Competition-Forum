'use client'; 

import "@wangeditor/editor/dist/css/style.css";
import dynamic from "next/dynamic";
import React, { useState, useEffect, useRef } from "react";
import { IDomEditor, IEditorConfig, IToolbarConfig } from "@wangeditor/editor";
import { API_BASE_URL } from "@/CONFIG";

const Editor = dynamic(
  () => import("@wangeditor/editor-for-react").then(mod => mod.Editor),
  { ssr: false }
);
const Toolbar = dynamic(
  () => import("@wangeditor/editor-for-react").then(mod => mod.Toolbar),
  { ssr: false }
);

interface IOEditorProps {
  initialValue: string;
  onChange: (html: string) => void;
}

function MyEditor({ initialValue, onChange }: IOEditorProps) {
  const editorRef = useRef<IDomEditor | null>(null);
  const [html, setHtml] = useState(initialValue);

  const toolbarConfig: Partial<IToolbarConfig> = {};

  const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入内容...',
    MENU_CONF: {
      uploadImage: {
        server: '${API_BASE_URL}/upload_image',
        fieldName: 'image',
      },
      uploadVideo: {
        server: '${API_BASE_URL}/upload_video',
        fieldName: 'video',
      },
    },
  };

  useEffect(() => {
    setHtml(initialValue);
  }, [initialValue]);

  const handleChange = () => {
    if (editorRef.current) {
      const html = editorRef.current.getHtml();
      setHtml(html);
      onChange(html);
    }
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setHtml(initialValue);
    }
  }, [editorRef.current]);

  return (
    <div className="text-xl">
      <div style={{ border: "1px solid #ccc", zIndex: 100 }}>
        <Toolbar
          editor={editorRef.current}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: "1px solid #ccc" }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={html}
          onCreated={(editor) => {
            editorRef.current = editor;
            editor.setHtml(html);
          }}
          onChange={handleChange}
          mode="default"
          style={{ height: "500px", overflowY: "hidden" }}
        />
      </div>
    </div>
  );
}

export default MyEditor;
