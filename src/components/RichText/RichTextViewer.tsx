import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './RichTextViewer.less';

export type RichTextViewerProps = {
    style?: React.CSSProperties
    className?: string
    /**
     * HTML 内容
     */
    value?: string
    /**
     * 滚动条配置 默认"auto"
     */
    scrolling?: 'auto' | 'yes' | 'no'
    /**
     * 自动高度,在元素渲染后自动调整iframe的高度（默认 false）
     * 如果配置为true, scrolling会自动设置成'no'
     */
    autoHeight?: boolean
    /**
     * 高度，设置后autoHeight会失效
     */
    height?: string | number
    /**
     * 高度自动刷新频率，autoHeight为true才生效
     */
    heightRefreshFrequency?: boolean | number
    title?: string
};

const RichTextViewer: React.FC<RichTextViewerProps> = (props) => {
    const {className,style,value='',height:propHeight,heightRefreshFrequency,title='rich-text-viewer'} = props;
    let {scrolling='auto',autoHeight} = props;
    if(propHeight!=null)autoHeight = false;
    if(autoHeight)scrolling = 'no';
    const frameRef = useRef<HTMLIFrameElement>(null);
    const [height,setHeight] = useState<number|string|undefined>(propHeight);
    useEffect(()=>{
        if(frameRef.current){
            frameRef.current.contentDocument?.write(value);
            if(autoHeight){
                const h = frameRef.current.contentDocument?.body.scrollHeight;
                setHeight(h);
            }
        }
    },[value]);
    useEffect(()=>{
        let interval: NodeJS.Timeout;
        if(heightRefreshFrequency!==undefined && (heightRefreshFrequency === true || heightRefreshFrequency > 0)){
            const frequency = typeof heightRefreshFrequency === 'number' ? heightRefreshFrequency : 500;
            interval = setInterval(() => {
                if (frameRef.current?.contentDocument?.body) {
                    const h = frameRef.current.contentDocument.body.scrollHeight;
                    if(h !== height){
                        setHeight(h);
                    }
                }
            }, frequency);
        }
        return ()=>{
            interval && clearInterval(interval);
        };
    },[height]);
    return (
        <iframe
            title={title}
            className={classNames(styles.iframe,className)}
            style={{ ...style,height }}
            ref={frameRef}
            frameBorder={0}
            scrolling={scrolling}
        />
    );
};

export default RichTextViewer;
