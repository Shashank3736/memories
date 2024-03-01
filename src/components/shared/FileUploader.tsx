import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import { Button } from '../ui/button'

const FileUploader = () => {
  const [file, setFile] = useState([])
  const [fileUrl, setFileUrl] = useState('')
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
  }, [])
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
            <div>
                test1
            </div>
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