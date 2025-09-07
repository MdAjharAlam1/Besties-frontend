import {CKEditor} from '@ckeditor/ckeditor5-react'
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import type { FC } from 'react'

interface EditorInterface {
    value:string
    onChange: (v:any)=> void
}

const Editor : FC<EditorInterface> = ({value, onChange}) => {

    const handleOnChange= (_:any, editor:any) =>{
        const v = editor.getData()
        onChange(v)
    }

    const toolbars : string[] = [
        'heading',
        '|',
        'bold',
        'italic',
        '|',
        'numberedList',
        'bulletList',
        '|',
        'undo',
        'redo'
    ]
  return (
    <CKEditor
        data={value}
        editor ={ClassicEditor as any}
        config ={{toolbar : toolbars}}
        onChange={handleOnChange}
    />
  )
}

export default Editor
