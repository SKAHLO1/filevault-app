'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadToWeb3Storage } from '../lib/storage';
import { registerFileOnChain } from '../lib/contract';

export function FileUpload() {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('Drag and drop a file here, or click to select a file');

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) {
      return;
    }

    const file = acceptedFiles[0];
    setStatus('uploading');
    setMessage(`Uploading "${file.name}" to IPFS...`);

    try {
      // Step 1: Upload to web3.storage to get a CID
      const cid = await uploadToWeb3Storage(acceptedFiles);
      setMessage(`Upload successful! CID: ${cid}. Now registering on-chain...`);

      // Step 2: Register the file on the smart contract
      const result = await registerFileOnChain(
        cid,
        file.name,
        file.size,
        file.type
      );

      if (result.success) {
        setStatus('success');
        setMessage(`File registered on-chain! Transaction: ${result.transactionHash.substring(0, 10)}...`);
      } else {
        throw new Error(result.error || 'On-chain registration failed.');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
      setMessage(`Error: ${error.message}`);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
        ${status === 'success' && 'border-green-500 bg-green-50'}
        ${status === 'error' && 'border-red-500 bg-red-50'}`}
    >
      <input {...getInputProps()} />
      <p>{message}</p>
    </div>
  );
}

