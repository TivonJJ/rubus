import React from 'react';
import Editor, { JSONEditorOptions } from 'jsoneditor';
import 'jsoneditor/dist/jsoneditor.min.css';
import ace from 'brace';
import 'brace/mode/json';
import { getLocale } from 'umi';
import df from 'deep-diff';

export type JSONEditorInstance = Editor;

export interface JSONEditorProps extends Omit<JSONEditorOptions, 'onChange'> {
    value?: any
    disabled?: boolean
    onChange?: (value?:object|null)=>void
}

class JSONEditor extends React.Component<JSONEditorProps>{
    static defaultProps = {
        mode: 'code',
        value: '',
    }

    containerRef = React.createRef<HTMLDivElement>()

    editor:Editor|null = null

    componentDidMount() {
        const local = getLocale();
        if(this.containerRef && this.containerRef.current){
            const editor = this.editor = new Editor(this.containerRef.current, {
                modes: ['code', 'form', 'text', 'tree', 'view'],
                language: local === 'zh-CN' ? 'zh-CN' : 'en',
                ...this.props,
                ace: ace as any,
                onEditable: (node: any) => {
                    if (this.props.onEditable) return this.props.onEditable(node);
                    if (this.props.disabled) return false;
                    return node;
                },
                onChange:()=>{
                    if (this.props.onChange) {
                        try {
                            const text = editor.getText();
                            if (text === '') {
                                this.props.onChange(null);
                            }

                            const currentJson = editor.get();
                            if (this.props.value !== currentJson) {
                                this.props.onChange(currentJson);
                            }
                        } catch (err) {
                            // do nothing
                        }
                    }
                },
            }, this.props.value);
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps: Readonly<JSONEditorProps>) {
        if(this.editor){
            if(this.props.value !== nextProps.value){
                try{
                    const json = this.editor.get()
                    if(df.diff(json,nextProps.value)){
                        this.editor.update(nextProps.value)
                    }
                }catch (e){
                    // do nothing
                }
            }
            if(this.props.mode !== nextProps.mode && nextProps.mode){
                this.editor.setMode(nextProps.mode);
            }
            if(this.props.mode !== nextProps.schema && nextProps.schema){
                this.editor.setSchema(nextProps.schema);
            }
        }
    }

    componentWillUnmount() {
        this.editor?.destroy();
    }

    render() {
        return (
            <div
                ref={this.containerRef}
            />
        );
    }
}

export default JSONEditor;
