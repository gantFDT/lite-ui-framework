import {
  findAllParamsAPI,
  determineAPI,
  syncParamsAPI,
} from './service'

const allCatalog = (list) => {
  let _newList = []
  _.map(list, cata => {
    _newList.push(cata.catalog)
  })

  let newList = [...new Set(_newList)]
  return newList
}

const pos = (list, id) => {
  let _pos = -1;
  list.map(function (d, i) {
    if (d.id == id)
      _pos = i;
  });
  return _pos;
}

//扁平数据转化为树型结构
const toTree = (data) => {
  //   let data = ["1", "1-3-4", "1-2", "1-2"],
  let result = [];
  data.map(function (d) {
    let child = d.split("-"),
      temp = result;
    child.map(function (d2, i) {
      let _pos = pos(temp, d2);
      if (_pos != -1) {
        temp = temp[_pos]["children"];
      } else {
        temp.push({
          "title": child.slice(0, i + 1).join('-'),
          "key": child.slice(0, i + 1).join('-'),
          "name": d2,
          "id": d2,
          "children": []
        })
        temp = temp[temp.length - 1]["children"];
      }
    })
  })
  return result
}

//获取树结构扁平化数据 这里result 注释掉因为没有用 但是其他过滤参数要用
//arr扁平列表 result
const getTreeParams = (arr, expandedKeys, childrenkeys) => {

  arr.forEach((item) => {

    if (item.children.length) {
      expandedKeys.push(item.key)
      getTreeParams(item.children, expandedKeys, childrenkeys)
    } else {
      childrenkeys.push(item.key)
    }
  })

  return {
    expandedKeys,
    childrenkeys,
  }
}




//遍历循环找到tree的 key 某个children
const treeFindByKey = (tree, value) => {
  let returnedItem = []; //定义一个不不赋值的变量
  function find(arr, key) {
    arr.forEach((item) => { //利用foreach循环遍历
      //判断递归结束条件
      if (item.key == key) {
        returnedItem = item.children;
        return
      } else if (item.children.length > 0) {//判断chlidren是否有数据
        find(item.children, key);  //递归调用                      
      }
    })
  }

  find(tree, value)
  return returnedItem
}


export default {
  namespace: 'preferencesmanage',
  state: {
    allParams: [],//后台返回的所有值
    allTreeData: [],//树型结构值
    expandedKeys: [],//展开的key
    panelTitle:'',//右侧panel 的title
    panelData: [],//右侧面板显示的值
    isLastNode: false,//是否是最后一个子节点
    langChange:{},//语言编辑框的修改值
  },
  effects: {
    *getAllParams({ payload }, { call, put }) {
      let ret = yield call(findAllParamsAPI)

      ret.sort((a, b) => a.name - b.name);
      let newRet = allCatalog(ret)
      let res = toTree(newRet)

      const { expandedKeys, childrenkeys } = getTreeParams(res, [], [])
      yield put({ 
        type: 'filterParams', 
        payload: { 
          selectKey: childrenkeys[0], 
          isLastNode: childrenkeys.length ? true : false 
        } 
      })

      yield put({
        type: 'save',
        payload: {
          allParams: ret || [],
          allTreeData: res || [],
          expandedKeys
        }
      })
    },
    *filterParams({ payload }, { call, put, select }) {
      const { allParams, allTreeData } = yield select(state => state['preferencesmanage'])
      const { selectKey, isLastNode } = payload
      let panelShowData = []
      if (isLastNode) {
        _.map(allParams, item => {
          if (item.catalog.indexOf(selectKey) > -1) {
            panelShowData.push(item)
          }
        })
      } else {
        panelShowData = treeFindByKey(allTreeData, selectKey)
      }

      yield put({
        type: 'save',
        payload: {
          panelData: panelShowData || [],
          isLastNode,
          panelTitle:selectKey
        }
      })
    },
    *searchFilterParams({ payload }, { call, put, select }) {
      const { allParams } = yield select(state => state['preferencesmanage'])
      const { searchKey } = payload
      let panelShowData = []
      _.map(allParams, item => {
        let fuzzyMatching = item.catalog.indexOf(searchKey) > -1
          || item.description.indexOf(searchKey) > -1
          || item.name.indexOf(searchKey) > -1
          || ('' + item.value).indexOf(searchKey) > -1;
        if (fuzzyMatching) {
          panelShowData.push(item)
        }
      })

      yield put({
        type: 'save',
        payload: {
          panelData: panelShowData || [],
          isLastNode: true
        }
      })

    },
    *batchUpdate({ payload }, { call, put, select }) {
      const { parameters } = payload
      let ret = yield call(determineAPI ,{parameters})
      // yield put({ type:'getAllParams'})
      // yield put({ type : 'save' , payload:{langChange : []}})
    },
    *syncParams({ payload }, { call, put, select }) {
      yield call(syncParamsAPI)
      yield put({ type:'getAllParams'})
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },
  }
}