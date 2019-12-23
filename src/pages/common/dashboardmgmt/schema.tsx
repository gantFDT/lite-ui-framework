import React from 'react'
import { Icon } from 'gantd'



export const modalCreateSchema = {
  type: "object",
  required: ["name"],
  propertyType: {
    id: {
      title: tr('序号'),
      type: "string",
    },
    name: {
      title: tr('名称'),
      type: "string",
      required: true
    },
    // icon: {
    //   title: tr('图标'),
    //   type: "string",
    //   required: true
    // },
    description: {
      title: tr('描述'),
      type: "string",
      componentType: 'TextArea',
      props: {
        autoSize: { minRows: 6, maxRows: 10 }
      }
    }

  }
}

export const uiSchema = {
  id: {
    "ui:col": 0
  }
}

export const modalEditSchema = {
  type: "object",
  required: ["name"],
  propertyType: {
    id: {
      title: tr('序号'),
      type: "string",
    },
    name: {
      title: tr('名称'),
      type: "string",
      required: true
    },
    description: {
      title: tr('描述'),
      type: "string",
      componentType: 'TextArea',
      props: {
        autoSize: { minRows: 6, maxRows: 10 }
      }
    }
  }
}



export const modalCopySchema = {
  type: "object",
  required: ["name"],
  propertyType: {
    id: {
      title: tr('序号'),
      type: "string",
    },
    name: {
      title: tr('名称'),
      type: "string",
      required: true
    },
    description: {
      title: tr('描述'),
      type: "string",
      componentType: 'TextArea',
      props: {
        autoSize: { minRows: 6, maxRows: 10 }
      }
    }
  }
}

