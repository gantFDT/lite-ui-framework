export default {
	namespace: "testDemo",
	state: {
		text: `{"zh_CN":"中文","en":"en"}`,
		data: [{
			title: 1111,
			key: 1
		}],
		selectedRowKeys: []
	},
	reducers: {
		save(state, { payload }) {
			return {
				...state,
				...payload,

			}
		}
	}
}