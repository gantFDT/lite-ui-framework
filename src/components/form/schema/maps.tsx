import { ImageUpload, FileUpload, CodeList } from '../index'
import { UserSelector, RoleSelector, GroupSelector, UserGroupSelector } from '@/components/specific'
import SelectEdit from '../selectedit'
import { setFields } from 'schema-form-g/lib/maps'

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
    [Fields.CodeList]: CodeList,
    [Fields.UserSelector]: UserSelector,
    [Fields.RoleSelector]: RoleSelector,
    [Fields.GroupSelector]: GroupSelector,
    [Fields.UserGroupSelector]: UserGroupSelector,
    [Fields.SelectEdit]: SelectEdit
}

export const schemaFormInit = () => setFields(fields)
