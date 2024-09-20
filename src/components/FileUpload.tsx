'use client'
import { uploadToS3 } from '@/lib/s3';
import { Inbox } from 'lucide-react';
import React from 'react'
import { useDropzone } from 'react-dropzone'

export const FileUpload = () => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {"application/pdf" : [".pdf"]},
    maxFiles:1,
    onDrop: async (acceptedFiles) =>{
      console.log(acceptedFiles);
      const file = acceptedFiles[0]
      if (file.size > 10 *1024 *1024) {
        //bigger than 10mb!
        alert("please upload a smaller file")
        return
      }
      try {
        const data = await uploadToS3(file)
        console.log('data', data);
        
      } catch (error) {
        console.error(error);
      }
    }
  },
);

  return (
    <div className='p-2 bg-white rounded-xl'>
      <div
        {...getRootProps({
          className: `border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 flex items-center justify-center flex-col ${
            isDragActive ? 'border-blue-500' : 'border-gray-300'
          }`,
        })}
      >
        <input {...getInputProps()} />
        <Inbox className='w-10 h-10 text-blue-500'/>
        <p className="text-gray-600">
          {isDragActive ? "Drop the files here..." : "Drag 'n' drop some files here, or click to select files"}
        </p>
      </div>
    </div>
  );
};
