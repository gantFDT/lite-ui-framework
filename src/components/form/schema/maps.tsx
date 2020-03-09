import { ImageUpload, FileUpload, CodeList } from '../index'
import { UserSelector, RoleSelector, GroupSelector, UserGroupSelector } from '@/components/specific'
import {
    CodeListSelector, UnitDomanSelector,
    UnitSelector, MetadataSelector,
    Objectselector, Fieldselector
} from '@/components/specific/selectors'
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
    SelectEdit = "SelectEdit",
    CodeListSelector = "CodeListSelector",
    UnitSelector = "UnitSelector",
    UnitDomanSelector = "UnitDomanSelector",
    MetadataSelector = "MetadataSelector",
    Objectselector = "Objectselector",
    Fieldselector = "Fieldselector",
}

let fields = {
    [Fields.ImageUpload]: ImageUpload,
    [Fields.FileUpload]: FileUpload,
    [Fields.CodeList]: CodeList,
    [Fields.UserSelector]: UserSelector,
    [Fields.RoleSelector]: RoleSelector,
    [Fields.GroupSelector]: GroupSelector,
    [Fields.UserGroupSelector]: UserGroupSelector,
    [Fields.SelectEdit]: SelectEdit,
    [Fields.CodeListSelector]: CodeListSelector,
    [Fields.UnitDomanSelector]: UnitDomanSelector,
    [Fields.UnitSelector]: UnitSelector,
    [Fields.MetadataSelector]: MetadataSelector,
    [Fields.Objectselector]: Objectselector,
    [Fields.Fieldselector]: Fieldselector,
}

export const schemaFormInit = () => setFields(fields)
