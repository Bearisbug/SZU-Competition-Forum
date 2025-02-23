"use client";
import "@wangeditor/editor/dist/css/style.css";

import React, { useState, useEffect, useRef } from "react";
import { Editor, Toolbar } from "@wangeditor/editor-for-react";
import { IDomEditor, IEditorConfig, IToolbarConfig } from "@wangeditor/editor";

interface IOEditorProps {
  initialValue: string; // 接收父组件传来的初始值
  onChange: (html: string) => void; // 回调函数传递内容
}

function MyEditor({ initialValue, onChange }: IOEditorProps) {
  const editorRef = useRef<IDomEditor | null>(null); // 用 ref 保持 editor 实例
  const [html, setHtml] = useState(initialValue); // 保存编辑器的内容

  const toolbarConfig: Partial<IToolbarConfig> = {};
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入内容...',
    MENU_CONF: {
      "uploadImage" : {
        server: 'http://127.0.0.1:8000/upload_image',  // 修改为你的后端接口
        fieldName: 'image',  // 确保与后端一致
      },
      "uploadVideo" : {
        server: 'http://localhost:8000/upload_video',
        fieldName: 'video',  // 确保与后端一致
      }
    },
  }

  // 在 `initialValue` 变化时更新 `html` 状态
  useEffect(() => {
    setHtml(initialValue);
  }, [initialValue]);

  // 每次内容变化时，调用 onChange 传递 html 内容
  const handleChange = () => {
    if (editorRef.current) {
      const html = editorRef.current.getHtml();
      setHtml(html); // 更新 html 状态
      onChange(html); // 通过回调将编辑器内容传递给父组件
    }
  };

  // 初始化 editor 实例
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setHtml(initialValue); // 设置初始值
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
          value={html} // 保持编辑器内容同步
          onCreated={(editor) => {
            editorRef.current = editor; // 保存 editor 实例
            editor.setHtml(html); // 设置初始值
          }}
          onChange={handleChange} // 每次编辑器内容变化时调用
          mode="default"
          style={{ height: "500px", overflowY: "hidden" }}
        />
        {/* <div dangerouslySetInnerHTML={{ __html: html }} /> */}
      </div>
    </div>
  );
}

export default MyEditor;
