import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import type { UploadProps } from 'antd/lib/upload';
import type { RcFile, UploadChangeParam, UploadFile } from 'antd/lib/upload/interface';
import { Button, Upload } from 'antd';
import { getRequestUrl } from '@/utils/request';
import { PlusOutlined } from '@ant-design/icons';
import Viewer from 'react-viewer';
import type { ImageDecorator } from 'react-viewer/lib/ViewerProps';
import { useIntl } from 'umi';

export type UploaderProps = {
    children?: React.ReactNode;
    value?: string | string[];
    defaultValue?: string | string[];
    maxQuantity?: number;
    onChange?: (value: string | string[] | undefined) => void;
    onUploadChange?: (info: UploadChangeParam) => void;
    onUploadFinish?: (files: UploadFile[]) => void;
    onGetFileKey?: (response: UploadFile) => string;
    downloadPrefix?: string;
} & Omit<UploadProps, 'onChange' | 'fileList' | 'defaultFileList'>;

/**
 * 上传组件
 * 基于内部业务包装的上传组件
 */
const Uploader = React.forwardRef((props: UploaderProps, ref) => {
    const { formatMessage } = useIntl();
    const renderDefaultChildren = () => (
        <Button>{formatMessage({ id: 'components.uploader.upload' })}</Button>
    );
    const {
        children = renderDefaultChildren(),
        value,
        defaultValue,
        onChange,
        onUploadChange,
        onRemove,
        onUploadFinish,
        action: act,
        downloadPrefix,
        multiple,
        maxQuantity,
        onGetFileKey = (file) => file.response?.data?.[0]?.file_key || file.uid,
        ...rest
    } = props;
    let { action } = props;
    if (typeof action === 'string') action = getRequestUrl(action);
    const [fileList, setFileList] = React.useState<UploadFile[]>([]);
    const syncValue2FileList = (val?: string | string[]) => {
        if (multiple && val && !Array.isArray(val)) {
            throw new TypeError('The value must be an array when multiple is true');
        }
        let fileKeys: string[];
        if (!val) {
            fileKeys = [];
        } else if (multiple) {
            fileKeys = val as string[];
        } else {
            fileKeys = [val] as string[];
        }
        setFileList(
            fileKeys.map((v) => ({
                size: -1,
                type: '',
                uid: v,
                url: getRequestUrl(downloadPrefix || '', v),
                thumbUrl: getRequestUrl(downloadPrefix || '', v),
                name: v,
                status: 'success',
            })),
        );
    };
    useEffect(() => {
        syncValue2FileList(value);
    }, [value]);
    useEffect(() => {
        if (defaultValue !== undefined) {
            syncValue2FileList(defaultValue);
        }
    }, []);
    const onChangeEvent = (info: UploadChangeParam) => {
        const extFileProps = (file: UploadFile) => {
            file.uid = file.name = onGetFileKey(file);
            file.thumbUrl = file.url = getRequestUrl(downloadPrefix || '', file.uid);
        };
        onUploadChange?.(info);
        info.fileList.forEach((file) => {
            if (file.response && file.status === 'done') extFileProps(file);
        });
        setFileList(info.fileList);
        if (info.file.status === 'done') {
            extFileProps(info.file);
            if (multiple) {
                if (
                    !info.fileList.find(
                        (item) => item.status !== 'done' && item.status !== 'success',
                    )
                ) {
                    onChange?.(info.fileList.map((f) => f.uid));
                    onUploadFinish?.(info.fileList);
                }
            } else {
                onChange?.(info.file.uid);
                onUploadFinish?.(info.fileList);
            }
        }
    };
    const onRemoveEvent = (file: UploadFile) => {
        if (fileList) {
            const newList = fileList.filter((item) => item.uid !== file.uid);
            setFileList(newList);
            onChange?.(newList.map((a) => a.uid));
        }
    };
    return (
        <Upload
            onChange={onChangeEvent}
            onRemove={onRemoveEvent}
            fileList={fileList}
            action={action}
            multiple={multiple}
            {...rest}
            ref={ref}
        >
            {children}
        </Upload>
    );
}) as UploaderType;

export type ImageUploaderProps = {
    viewerClassName?: string;
} & Omit<UploaderProps, 'listType' | 'showUploadList'>;

/**
 * 上传组件图片上传
 */
const ImageUploader = React.forwardRef((props: ImageUploaderProps, ref) => {
    const { value, accept, viewerClassName, children, ...rest } = props;
    const [loading, setLoading] = useState<boolean>(false);
    const [preview, setPreview] = useState<{ index?: number; images: ImageDecorator[] }>();
    const uploadRef = useRef<any>(null);
    const { formatMessage } = useIntl();
    useImperativeHandle(ref, () => uploadRef.current, [uploadRef.current]);
    const renderUploadButton = () => {
        if (loading) return null;
        if (props.multiple) {
            if (props.maxQuantity && value?.length && value?.length >= props.maxQuantity) {
                return null;
            }
        } else if (value) {
            return null;
        }
        return (
            children || (
                <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>
                        {formatMessage({ id: 'components.uploader.upload' })}
                    </div>
                </div>
            )
        );
    };
    const beforeUpload = (file: RcFile, FileList: RcFile[]) => {
        setLoading(true);
        return props.beforeUpload?.(file, FileList) || true;
    };
    const onUploadFinish = (files: UploadFile[]) => {
        setLoading(false);
        props.onUploadFinish?.(files);
    };
    const onPreview = (file: UploadFile) => {
        const images: ImageDecorator[] =
            uploadRef.current?.fileList?.map((f: UploadFile) => ({
                src: f.url,
                alt: f.uid,
            })) || [];
        const index = images.findIndex((img) => img.alt === file.uid);
        setPreview({ index: Math.max(0, index), images });
    };
    return (
        <>
            <Uploader
                accept={accept}
                value={value}
                {...rest}
                listType={'picture-card'}
                beforeUpload={beforeUpload}
                onUploadFinish={onUploadFinish}
                onPreview={onPreview}
                ref={uploadRef}
            >
                {renderUploadButton()}
            </Uploader>
            {preview && (
                <Viewer
                    visible
                    onClose={() => {
                        setPreview(undefined);
                    }}
                    images={preview.images}
                    activeIndex={preview.index}
                    className={viewerClassName}
                />
            )}
        </>
    );
});

export type UploaderType = {
    ImageUploader: typeof ImageUploader;
} & React.ForwardRefExoticComponent<any>;

Uploader.defaultProps = {
    action: 'basis/file/upload/',
    downloadPrefix: 'basis/file/download/',
};

ImageUploader.defaultProps = {
    accept: 'image/*',
};

Uploader.ImageUploader = ImageUploader;

export default Uploader;
