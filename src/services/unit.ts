import request from '../utils/request';
export function fetchUnit(data: any) {
	return request('/measureUnit/findUnit', {
		method: "POST",
		data
	})
}