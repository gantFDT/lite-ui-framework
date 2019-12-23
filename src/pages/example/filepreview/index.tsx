
import React from 'react'
import { FilePreview } from '@/components/specific'
import { Card } from 'gantd'

export default () => {
  const file = {
    id: "1eb76d3d9024baf87960c93bfa87b980c8242299f2e14e167d46ae3435cbac2f",
    name: "小狗钱钱套装全2册.pdf",
  }
  const file1 = {
    id: "379c02cfa6e89d33266eedcbf2eae7c50ae3edc19efc3cdad2a00546b7e68b1d",
    name: "007P0Nbsgy1g7h8vshywqj30j60aemyh.jpg",

  }
  const file2 = {
    id: "a2e00d8dafdd4bc10786cda50caea614273fb0a7b41e3e71d92fb150f2f5ff5b",
    name: "1.txt",
  }
  const file3 = {
    content: "<p>aaaaaaaaaaaaaaa</p>",
    name:'html'
  }
  const file4 = {
    content: "<a>看看几点结束</a>",
    name:'直接渲染'
  }
  return (
    <>
      <Card
        bodyHeight={'100vh'}
      >
        <div style={{ margin: '20px' }}>
          PDF文件 -- 通过请求ID来转换
          <FilePreview file={file} />
        </div>
        <div style={{ margin: '20px' }}>
          txt -- 通过请求ID来转换
          <FilePreview file={file2} />
        </div>
        <div style={{ margin: '20px' }}>
          图片 -- 通过请求ID来转换
          <FilePreview file={file1} icon='read'/>
        </div>
        <div style={{ margin: '20px' }}>
          传入 -- content直接渲染
          <FilePreview file={file3} directShow={true} />
        </div>
        <div style={{ margin: '20px' }}>
          传入 -- 文本按钮 渲染
          <FilePreview file={file4} noIcon={true} showText='采用文本显示' directShow={true} />
        </div>
      </Card>
    </>
  )
}