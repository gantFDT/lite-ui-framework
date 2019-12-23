import {
	Input, InputNumber, InputLang, InputMoney,
	Select, Selector, Email, Location, TelePhone, DatePicker, ColorPicker,
	Url,
	TextArea,
	CellPhone,
} from 'gantd';
import { ImageUpload, FileUpload, CodeList,LanguageInput } from '../index'
const { RangePicker } = DatePicker;
import { UserSelector, RoleSelector, GroupSelector, UserGroupSelector } from '@/components/specific'
import IconHouse from '@/components/common/iconhouse';
let fields = {
	"Input": Input,
	"InputNumber": InputNumber,
	"LanguageInput": LanguageInput,
	"InputMoney": InputMoney,
	"DatePicker":DatePicker,
	"Select": Select,
	"Selector": Selector,
	"Email": Email,
	"Location": Location,
	"TelePhone": TelePhone,
	"ColorPicker": ColorPicker,
	"TextArea": TextArea,
	"Url": Url,
	"CellPhone": CellPhone,
	"ImageUpload": ImageUpload,
	"FileUpload": FileUpload,
	"CodeList": CodeList,
	"UserSelector": UserSelector,
	"RoleSelector": RoleSelector,
	"GroupSelector": GroupSelector,
	"UserGroupSelector": UserGroupSelector,
	"RangePicker": RangePicker,
	"IconHouse": IconHouse
}
export function getFields() {
	return {
		...fields
	}
}

export function setFields(field: any) {
	fields = { ...fields, ...field }
}