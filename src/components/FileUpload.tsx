'use client';
import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { Inbox, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { uploadToS3 } from '@/lib/s3';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const FileUpload = () => {
  const router = useRouter();
  const [uploading, setUploading] = React.useState(false);

  const { mutate, isLoading } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      const response = await axios.post('/api/create-chat', {
        file_key,
        file_name,
      });
      return response.data;
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      // console.log(acceptedFiles);
      const file = acceptedFiles[0];
      if (file.size > 30 * 1024 * 1024) {
        // greater than 30MB
        toast.error('File is too large. Please upload a file less than 30MB.');
        // alert('File is too large. Please upload a file less than 30MB.');
        return;
      }
      try {
        setUploading(true);
        const data = await uploadToS3(file);
        if (!data?.file_key || !data.file_name) {
          toast.error('Something went wrong.');
          // alert('Something went wrong.');
          return;
        }
        mutate(data, {
          onSuccess: ({ chat_id }) => {
            toast.success("Chat created successfully. Let's go!");
            // console.log(data);
            router.push(`/chat/${chat_id}`);
          },
          onError: (error) => {
            toast.error('Error creating chat. Please try again.');
            // console.log('error', error);
            console.error(error);
          },
        });
        // console.log('data', data);
      } catch (error) {
        console.log(error);
      } finally {
        setUploading(false);
      }
    },
  });
  return (
    <div className='p-2 bg-white rounded-xl'>
      <div
        {...getRootProps({
          className:
            'border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col',
        })}
      >
        <input {...getInputProps()} />
        {uploading || isLoading ? (
          <>
            {/* loading state */}
            <Loader2 className='w-8 h-8 text-blue-500 animate-spin' />
            <p className='mt-2 text-sm text-slate-400'>Uploading...</p>
          </>
        ) : (
          <>
            <Inbox className='w-8 h-8 text-blue-500' />
            <p className='mt-2 text-sm text-slate-400'>Drop PDF Here</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
