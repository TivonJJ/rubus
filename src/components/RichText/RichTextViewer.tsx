import React, { useEffect, useRef, useState } from 'react';

export interface RichTextViewerProps{
    value?: string
    style?: React.CSSProperties
    className?: string
}

const RichTextViewer:React.FC<RichTextViewerProps> = (props) => {
    const {className,style,value=''} = props;
    const frameRef = useRef<HTMLIFrameElement>(null);
    const [height,setHeight] = useState<number>()
    useEffect(()=>{
        frameRef?.current?.contentDocument?.write(value);
        const h = frameRef?.current?.contentDocument?.body.scrollHeight
        setHeight(h)
    },[value])
    return (
        <iframe
            title={'rich-text-viewer'}
            className={className}
            style={{ ...style,height }}
            ref={frameRef}
            frameBorder={0}
            scrolling={'no'}
        />
    );
};

export default RichTextViewer
