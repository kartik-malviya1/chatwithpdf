'use client'
import React from 'react'
import axios from 'axios'
import { uploadToS3 } from '@/lib/s3';
import { Inbox, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone'
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const FileUpload = () => {
  const [uploading, setUploading] = React.useState(false)
  const {mutate} = useMutation({
    mutationFn: async ({   
          file_key,
          file_name
      } : {
          file_key: string;
          file_name: string; 
        }) => {
      const response = await axios.post('/api/create-chat', {
        file_key, 
        file_name,
      }); 
       return response.data;
    }
  }
)
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {"application/pdf" : [".pdf"]},
    maxFiles:1,
    onDrop: async (acceptedFiles) =>{
      const file = acceptedFiles[0]
      if (file.size > 10 *1024 *1024) {
        //bigger than 10mb!
        toast.error('file is too large')
        return
      }
      try {
        setUploading(true)
        const data = await uploadToS3(file)
        if (!data.file_key || !data.file_name) {
          toast.error("Something went wrong!")
        }
        mutate(data,{
          onSuccess: (data) => {
            console.log(data);
            
              // toast.success("success");
          },
          onError: (err) => {
            console.log(err);
            toast.error("Error creating chat");
          }
        })
      } catch (error) {
        console.error(error);
      } finally {
        setUploading(false)
      }
    }
  },
);
  return (
    <div className='p-2 bg-white rounded-xl'>
      <div
        {...getRootProps({
          className: `border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 flex items-center justify-center flex-col ${
            isDragActive ? 
            'border-blue-500' : 'border-gray-300'
          }`,
        })}
      >
        <input {...getInputProps()} />
        {uploading ? 
        (
        <Loader2/>
        ) : (
        <>
        <Inbox className='w-10 h-10 text-blue-500'/>
        <p className="text-gray-600">
          {isDragActive ? 
          "Drop the files here..." : "Drag 'n' drop some files here, or click to select files"
          }
        </p>
        </>
      )}
      </div>
    </div>
  );
};
