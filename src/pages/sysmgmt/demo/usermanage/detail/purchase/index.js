import React from 'react'
import { BlockHeader } from 'gantd'
function Purchase (){

    return(
      <>
        <BlockHeader
            id="partone"
            color="theme"
            title={tr("PartOne")}
            type="num"
            num="1"
            size="big"
            bottomLine
          />
        <div style={{padding:'10px'}}>
          {tr('基本信息')}
        </div>
      </>
    )
}
export default Purchase