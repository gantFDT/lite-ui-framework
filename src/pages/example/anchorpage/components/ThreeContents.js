import React from 'react'
import { BlockHeader } from 'gantd'
function ThreeContents (){

    return(
      <>
        <BlockHeader
            id="partthree"
            color="theme"
            title={tr("PartThree")}
            type="num"
            num="3"
            size="big"
            bottomLine
          />
        <div style={{padding:'10px'}}>
          <p>黑夜是个精灵</p>
          <p>有人说，</p>
          黑夜是一个精灵能诱惑人心幽暗的深蓝色<br/>
          吞噬着天与地把一切都掌控在手中<br/>
          它能把忧伤的心渲染得更加悲伤<br/>
          它能让快乐的人变得更加快乐<br/>
          它能把万物的色彩抹掉它<br/>
          又能让世间鸦雀无声<br/>
          但是<br/>
          它控制不了我的思念<br/>
          抹不掉你带给我丰富艳丽的色彩<br/>
          它的黑藏不住我遇见你的喜悦<br/>
          也盖不住你转身离去的忧伤<br/>
          虽然<br/>
          它在黑暗中把我孤独成一幅剪影<br/>
          但当你的相思而至<br/>
          就会闪电般撕破这黑幕<br/>
          打破它的魔法瞬间天光地阔
        </div>
      </>
    )
}
export default ThreeContents