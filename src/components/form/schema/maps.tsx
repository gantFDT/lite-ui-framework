import { ImageUpload, FileUpload } from '../index'
import SelectEdit from '../selectedit'
import { setFields } from 'gantd/lib/schema-form'

export enum Fields {
    ImageUpload = "ImageUpload",
    FileUpload = "FileUpload",
    CodeList = "CodeList",
    UserSelector = "UserSelector",
    RoleSelector = "RoleSelector",
    GroupSelector = "GroupSelector",
    UserGroupSelector = "UserGroupSelector",
    SelectEdit = "SelectEdit"
}

let fields = {
    [Fields.ImageUpload]: ImageUpload,
    [Fields.FileUpload]: FileUpload,
    [Fields.SelectEdit]: SelectEdit
}

export const schemaFormInit = () => setFields(fields)
