import React, { Component } from 'react'
import { Col, Row, Button, Tooltip, Modal, Empty, Icon } from 'antd'
import {
	Table, BlockHeader, EditStatus, Input, TextArea, Generator
} from 'gantd'
import { SmartTable } from '@/components/specific'
import { FormSchema, LanguageInput } from '@/components/form'
import Title from '@/components/common/title'
import { NameInput } from './ModalForm'
import { get, isEmpty, findIndex, isEqual } from 'lodash'
import { codeTypeSchema } from './schema'
import { BindAll, Debounce } from 'lodash-decorators'
import styles from './style.less'
import moment from 'moment'
export const currentLangulage = window.localStorage.getItem('umi_locale') || 'zh-CN';
export const langulageTypes = {
	"en-US": "en",
	"zh-CN": "zh_CN"
}

const colLayout = {
	span: 24,
	md: {
		span: 12
	}
}

let DscFormSchema = {
	type: "object",
	propertyType: {}
};

@BindAll()
export default class CodeListRight extends Component {
	@Debounce(200)
	onSelectChange(keys, rows) {
		const { dispatch } = this.props;
		dispatch({
			type: "codelist/save", payload: {
				codeselectedRowKeys: keys,
				codeselectedRows: rows
			}
		})
	}
	onHandlerCreate() {
		const { dispatch, list, selectContent } = this.props;
		dispatch({
			type: "codelist/save", payload: {
				editSelectData: [{ status: "add", id: moment().format("YYYY-MM-DD HH:MM:SS"), codeTypeId: selectContent.id }, ...list],
			}
		})
	}
	onDelete() {
		const { dispatch, codeselectedRows, list } = this.props;
		const seletedContent = codeselectedRows[0];
		const index = findIndex(list, { id: seletedContent.id });
		Modal.confirm({
			title: tr("提示"),
			content: tr("确认删除选中编码") + "?",
			okText: tr("删除"),
			cancelText: tr("取消"),
			onOk: () => {
				if (seletedContent.status == "add") dispatch({
					type: "codelist/save", payload: {
						editSelectData: [...list.slice(0, index), ...list.slice(index + 1)]
					}
				})
				else dispatch({
					type: "codelist/save", payload: {
						editSelectData: [...list.slice(0, index), { ...list[index], status: "remove" }, ...list.slice(index + 1)]
					}
				})
				dispatch({
					type: "codelist/save", payload: {
						codeselectedRowKeys: [],
						codeselectedRows: []
					}
				})
			},
			okButtonProps: {
				size: "small"
			},
			cancelButtonProps: {
				size: "small"
			},
			okType: 'danger'
		})
	}
	resetHandler() {
		const { dispatch, selectData } = this.props;
		Modal.confirm({
			title: tr("提示"),
			content: tr("确认恢复编码列表") + "?",
			onOk: () => {
				dispatch({
					type: "codelist/save", payload: {
						editSelectData: selectData
					}
				})
			},
			okText: tr("恢复"),
			cancelText: tr("取消"),
			okButtonProps: {
				size: "small"
			},
			cancelButtonProps: {
				size: "small"
			},
		})
	}
	getList() {
		const { list } = this.props;
		const newList = [];
		list.map((item, index) => {
			item.status !== "remove" && newList.push({ ...item });
		})
		return newList.map((item, index) => {
			return { ...item, order: index }
		});
	}
	save() {
		const { list, selectContent, dispatch } = this.props;
		console.log(list)
		const addedData = [], modifiedData = [], removedData = [];
		for (let item of list) {
			const index = findIndex(list, { id: item.id });
			if (!item.name) return Modal.warning({
				title: tr("错误"),
				content: `${tr("第")}${index}${tr("行")}"${tr("名称")}"${tr("不能为空")}`,
				okButtonProps: {
					size: "small"
				}
			});
			try {
				const itemName = JSON.parse(item.name)
				if (!itemName.zh_CN) return Modal.warning({
					title: tr("错误"),
					content: `${tr("第")}${index}${tr("行")}"${tr("中文名称")}"${tr("不能为空")}`,
					okButtonProps: {
						size: "small"
					}
				});

			} catch (error) {
				return Modal.warning({
					title: tr("错误"),
					content: `${tr("第")}${index}${tr("行")}"${tr("名称")}"${tr("不能为空")}`,
					okButtonProps: {
						size: "small"
					}
				});
			}
			if (!item.value) return Modal.warning({
				title: tr("错误"),
				content: `${tr("第")}${index}${tr("行")}"${tr("值")}"${tr("不能为空")}`,
				okButtonProps: {
					size: "small"
				}
			});
			if (item.status === "add") {
				addedData.push(item)
			} else if (item.status === "modify") {
				modifiedData.push(item)
			} else if (item.status === "remove") {
				removedData.push(item)
			}
		}
		const data = { addedData, modifiedData, removedData };
		Modal.confirm({
			title: tr("保存"),
			content: tr("确认保存编码") + "?",
			okText: tr("保存"),
			cancelText: tr("取消"),
			onOk: () => {
				dispatch({
					type: "codelist/codeBatchSave", payload: {
						data: data,
						type: selectContent.type
					}
				})
			},
			okButtonProps: {
				size: "small"
			},
			cancelButtonProps: {
				size: "small"
			},
		})
	}
	changeListItem(index, name, value) {
		const { dispatch, list, selectData } = this.props;
		const item = list[index];
		if (isEmpty(item)) return;
		const dataItemIndex = findIndex(selectData, { id: item.id });
		const newItem = { ...item, [name]: value }
		if (dataItemIndex < 0) {
			return dispatch({
				type: "codelist/save", payload: {
					editSelectData: [...list.slice(0, index), newItem, ...list.slice(index + 1)]
				}
			})
		}
		const dataItem = selectData[dataItemIndex];
		if (isEqual(dataItem, newItem)) {
			const { status, ..._newItem } = newItem;
			return dispatch({
				type: "codelist/save", payload: {
					editSelectData: [...list.slice(0, index), _newItem, ...list.slice(index + 1)]
				}
			})
		}
		return dispatch({
			type: "codelist/save", payload: {
				editSelectData: [...list.slice(0, index), { ...newItem, status: "modify" }, ...list.slice(index + 1)]
			}
		})
	}
	changeOrder(index, order) {
		const { list, dispatch } = this.props;
		if (order === "up") {
			if (index === 0) return;
			dispatch({
				type: "codelist/save", payload: {
					editSelectData: [...list.slice(0, index - 1), list[index], list[index - 1], ...list.slice(index + 1)]
				}
			})
		} else {
			if (index === list.length - 1) return
			dispatch({
				type: "codelist/save", payload: {
					editSelectData: [...list.slice(0, index), list[index + 1], list[index], ...list.slice(index + 2)]
				}
			})
		}
	}
	changeEidtStatus(status) {
		const { dispatch, disabledSave, selectData } = this.props;
		if (status || disabledSave) return dispatch({ type: "codelist/save", payload: { editting: status } })

		return Modal.confirm({
			title: tr("提示"),
			content: tr("编码列表修改内容未保存确认结束编辑") + "?",
			onOk: () => {
				dispatch({
					type: "codelist/save", payload: {
						editSelectData: selectData,
						editting: status
					}
				})
			},
			okText: tr("确认"),
			cancelText: tr("取消"),
			okButtonProps: {
				size: "small"
			},
			cancelButtonProps: {
				size: "small"
			},
		})
	}
	render() {
		const {
			selectContent,
			codeselectedRowKeys,
			codeselectedRows,
			listLoding,
			disabledSave,
			tableHeight,
			list,
			dispatch,
			editting
		} = this.props;
		const { type, desc, name, category } = selectContent;
		const formData = { type, desc, name, category }
		const rowSelection = {
			selectedRowKeys: codeselectedRowKeys,
			onChange: this.onSelectChange,
			type: 'radio',
			clickable: true,
			columnWidth: 40
		};
		const disabled = codeselectedRowKeys.length <= 0;
		const dataSource = this.getList(list)
		const columns = [
			{
				title: tr("顺序"),
				fieldName: "order",
				width: 100,
				render: (order) => <div className={styles.codeOrder} >
					<div className={styles.codeOrderNum} >
						{order}
					</div>
					{editting && <div className={styles.codeOrderIcon}  >
						<p className={styles.codeOrderUp} onClick={this.changeOrder.bind(null, order, "up")} ><Icon type="caret-up" /></p>
						<p className={styles.codeOrderDown} onClick={this.changeOrder.bind(null, order, "down")} ><Icon type="caret-down" /></p>
					</div>}
				</div>
			},
			{
				title: tr("编码名称"),
				fieldName: "name",
				width: 200,
				render: (text) => {
					if (!text) return "";
					const nameObj = JSON.parse(text);
					return nameObj[langulageTypes[currentLangulage]]
				},
				editConfig: {
					render: (text, record, index) => {
						return <LanguageInput
							value={text}
							onChange={
								val => this.changeListItem(index, "name", val)
							} />
						// return <NameInput
						// 	onChange={
						// 		val => this.changeListItem(index, "name", val)
						// 	} />
					},
				}
			},
			{
				title: tr("值"),
				width: 100,
				fieldName: "value",
				editConfig: category !== "SYSTEM" ? {
					render: (text, record, index) => {
						return <Generator type='input'
							onChange={val => this.changeListItem(index, "value", val)}
						/>
					},
				} : {}
			},
			{
				title: tr("描述"),
				fieldName: "desc",
				width: 200,
				editConfig: {
					render: (text, record, index) => {
						return <Generator type='textarea' edit={EditStatus.EDIT} onChange={
							val => this.changeListItem(index, "desc", val)
						} />
					},
				},
			}]
		return <>
			<div className={styles.rightHeader} >
				<BlockHeader title={tr("选中类型")} type='line' />
				<FormSchema schema={codeTypeSchema}
					edit={EditStatus.CANCEL}
					uiSchema={{
						"ui:col": {
							xs: 24,//578
							sm: 24,//578
							md: 24,//786
							lg: 12,//992
							xl: 8,//1200
							xxl: 8,//1600
						}
					}}

					data={formData} />
			</div>
			<SmartTable
				schema={columns}
				dataSource={dataSource}
				rowSelection={rowSelection}
				loading={listLoding}
				editable={editting ? EditStatus.EDIT : EditStatus.CANCEL}
				bodyHeight={tableHeight}
				headerRight={
					(!isEmpty(selectContent)) ? (editting ? <>
						<Button size="small" className="marginH5" onClick={this.changeEidtStatus.bind(null, false)} >
							{tr("结束编辑")}
						</Button>
						{category !== "SYSTEM" && <Tooltip title={tr("添加")} placement="bottom" >
							<Button size="small" className="marginH5" icon='plus' onClick={this.onHandlerCreate} />
						</Tooltip>}
						{
							category !== "SYSTEM" && <Tooltip title={tr("删除")} placement="bottom"  >
								<Button size="small" className="marginH5" icon='delete' type='danger' onClick={this.onDelete}
									disabled={disabled}
								>
								</Button>
							</Tooltip>
						}
						<Tooltip title={tr("恢复")} placement="bottom"  >
							<Button size="small" className="marginH5"
								icon='undo'
								disabled={disabledSave}
								onClick={this.resetHandler} ></Button>
						</Tooltip>
						<Tooltip title={tr("保存")} placement="bottom"  >
							<Button size="small" className="marginH5"
								disabled={disabledSave}
								icon='save' onClick={this.save}   >
							</Button>
						</Tooltip>
					</> : <Button size="small" className="marginH5"
						onClick={this.changeEidtStatus.bind(null, true)}   >
							{tr("进入编辑")}
						</Button>) : null
				}
				title={<Title title={tr("编码列表")} showSplitLine showShortLine />}
				rowKey="id"
				emptyDescription={<><div>{tr('暂无数据')}</div><div>{tr('请选择编码类型')}</div></>}
			/>
		</>
	}
}
