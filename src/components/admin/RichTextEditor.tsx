'use client';

import { useEffect, useState } from 'react';
import { View } from 'reshaped';
import styles from './RichTextEditor.module.css';

// Dynamic import to avoid SSR issues
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(
  () => import('react-quill'),
  { 
    ssr: false,
    loading: () => <div style={{ height: '200px', border: '1px solid #e5e5e5', borderRadius: '4px' }} />
  }
);

import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Start typing...", 
  disabled = false 
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link'],
      [{ 'align': [] }],
      ['clean']
    ],
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'align'
  ];

  if (!isMounted) {
    return <div style={{ height: '200px', border: '1px solid #e5e5e5', borderRadius: '4px' }} />;
  }

  return (
    <div className={styles.richTextEditor}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        readOnly={disabled}
        style={{
          backgroundColor: disabled ? '#f5f5f5' : '#fff'
        }}
      />
    </div>
  );
}