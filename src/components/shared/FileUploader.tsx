import React, {useCallback, useState} from 'react'
import {useDropzone, FileWithPath} from 'react-dropzone'
import { Button } from '../ui/button'

type FileUploaderProps = {
  fieldChange: (file: File[]) => void
  mediaUrl: string
}

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  const [file, setFile] = useState([])
  const [fileUrl, setFileUrl] = useState(mediaUrl)
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setFile(acceptedFiles)
    fieldChange(acceptedFiles)
    setFileUrl(URL.createObjectURL(acceptedFiles[0]))
  }, [file])
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
        'image/*': ['.png', '.jpg', '.jpeg', '.svg']
    }})

  return (
    <div {...getRootProps()} className='flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer'>
      <input {...getInputProps()} className='cursor-pointer' />
      {
        fileUrl ? (
          <>
          <div className='flex flex-1 justify-center w-full p-5 lg:p-10'>
            <img src={fileUrl} alt="uploaded file" className='file_uploader-img' />
          </div>
            <p className='file_uploader-label'>Click or drag photo to replace</p>  
          </>
           ): (
            <div className='file_uploader-box'>
                <img src="/assets/icons/file-upload.svg" alt="upload file" width={96} height={77} />
                <h2 className="base-medium text-light-2 mb-2 mt-6">Drop Photo Here</h2>
                <h3 className="text-light-4 small-regular mb-6">
                    SVG, PNG, JPG
                </h3>
                <Button className='shad-button_dark_4'>Select From Computer</Button>
            </div>
        )
      }
    </div>
  )
}

export default FileUploader