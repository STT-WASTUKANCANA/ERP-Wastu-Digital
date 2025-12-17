"use client";

import React, { useCallback, useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { FiUploadCloud, FiFile, FiX } from 'react-icons/fi';
import { Button } from './button';

interface FileDropzoneProps {
        label?: string;
        name?: string;
        onFilesAccepted: (files: File[]) => void;
        className?: string;
        maxFiles?: number;
        error?: string;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
        label,
        onFilesAccepted,
        className = '',
        maxFiles = 1,
        error
}) => {
        const [files, setFiles] = useState<File[]>([]);

        const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
                const newFiles = [...files, ...acceptedFiles].slice(0, maxFiles);
                setFiles(newFiles);
                onFilesAccepted(newFiles);

                if (fileRejections.length > 0) {
                        alert(`File '${fileRejections[0].file.name}' was rejected.`);
                }
        }, [files, maxFiles, onFilesAccepted]);

        const { getRootProps, getInputProps, isDragActive } = useDropzone({
                onDrop,
                maxFiles: maxFiles,
                accept: {
                        'application/pdf': ['.pdf'],
                        'image/png': ['.png'],
                        'image/jpeg': ['.jpg', '.jpeg'],
                },
        });

        const removeFile = (fileName: string, e: React.MouseEvent) => {
                e.stopPropagation();
                const newFiles = files.filter(file => file.name !== fileName);
                setFiles(newFiles);
                onFilesAccepted(newFiles);
        };

        return (
                <div className={`flex flex-col gap-2 ${className}`}>
                        {label && <label className="text-sm font-medium text-foreground">{label}</label>}

                        {files.length === 0 ? (
                                <div
                                        {...getRootProps()}
                                        className={`p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${error ? 'border-red-500' : isDragActive ? 'border-primary bg-primary/10' : 'border-secondary/20 hover:border-primary/50'}`}
                                >
                                        <input {...getInputProps()} />
                                        <div className="flex flex-col items-center justify-center text-center">
                                                <FiUploadCloud className={`w-12 h-12 mb-4 ${isDragActive ? 'text-primary' : 'text-secondary'}`} />
                                                <p className="text-foreground/80">
                                                        <span className="font-semibold text-primary">Click to upload</span> or drag files here
                                                </p>
                                                <p className="text-xs text-secondary mt-2">PDF, PNG, JPG (Max. {maxFiles} file{maxFiles > 1 ? 's' : ''})</p>
                                        </div>
                                </div>
                        ) : (
                                <div className="mt-2 space-y-2">
                                        {files.map(file => (
                                                <div key={file.name} className="flex items-center justify-between p-2 bg-accent rounded-md text-sm">
                                                        <div className="flex items-center gap-2">
                                                                <FiFile className="w-5 h-5 text-secondary" />
                                                                <span className="truncate">{file.name}</span>
                                                        </div>
                                                        <Button onClick={(e) => removeFile(file.name, e)} className="p-1 h-auto bg-transparent hover:bg-secondary/20">
                                                                <FiX className="w-4 h-4 text-red-500" />
                                                        </Button>
                                                </div>
                                        ))}
                                </div>
                        )}

                        {error && (
                                <span className="text-xs text-red-500">{error}</span>
                        )}
                </div>
        );
};

