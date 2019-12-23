import { setCompanyData, getCompanyData, delCompanyData } from '@/services/api';
import { Model } from './connect'
import zh from '@/locales/zh-CN';
import en from '@/locales/en-US';
// import jp from '@/locales/ja-JP';

interface LanguageItem {
  key: string,
  name: string,
  data: object
}

type Languages = Array<LanguageItem>

interface LocaleLanguageItem {
  key: string, keyword: string, value: string
}
type LocaleLanguage = Array<LocaleLanguageItem>
type LocaleLanguagesObj = {
  'zh-CN': LocaleLanguage,
  'en-US': LocaleLanguage
}

const langulages: Languages = [{
  key: 'zh-CN',
  name: tr('中文'),
  data: zh
}, {
  key: 'en-US',
  name: tr('英文'),
  data: en
},
  // {
  //   key: 'ja-JP',
  //   name: '日文',
  //   data: jp
  // }
];

const localeLangulagesObj = {}

langulages.forEach((item) => {
  localeLangulagesObj[item.key] = [];
  const langulage = item.data;
  localeLangulagesObj[item.key] = Object.keys(langulage).map((keyword) => ({
    key: keyword,
    keyword,
    value: langulage[keyword]
  }))
})

const initialState = {
  langulages: langulages as Languages,
  LocaleLangulages: localeLangulagesObj as LocaleLanguagesObj,
  remoteLangulages: {} as LocaleLanguagesObj,
  mergeLangulage: localeLangulagesObj as LocaleLanguagesObj
}

export type LocaleState = Readonly<typeof initialState>

interface Locale extends Model {
  state: LocaleState
}

export default {
  namespace: 'locale',
  state: initialState,
  effects: {
    * getCustomLocale({ payload }, { call, put, select }) {
      const { localeKey } = payload;
      try {
        const response = yield call(getCompanyData, {
          dataType: 'REACT_LOCALE',
          dataId: localeKey
        })
        const { remoteLangulages, LocaleLangulages, mergeLangulage: { ...mergeLangulage } } = yield select(state => state.locale)

        if (response.bigData) {
          remoteLangulages[localeKey] = JSON.parse(response.bigData).langulage;
          let remoteData = _.cloneDeep(remoteLangulages[localeKey]);
          let localeData = LocaleLangulages[localeKey];
          mergeLangulage[localeKey] = _.unionWith(remoteData, localeData, function (arrVal: LocaleLanguageItem, othVal: LocaleLanguageItem) {
            return arrVal.key == othVal.key
          });
          yield put({
            type: 'save',
            payload: { remoteLangulages, mergeLangulage },
          });
        }
      } catch (error) {

      }
    },
    * modifyCustomLocale({ payload }, { call, put, select }) {
      const { localeKey, localeData } = payload;
      try {
        const response = yield call(setCompanyData, {
          dataType: 'REACT_LOCALE',
          dataId: localeKey,
          bigData: JSON.stringify({ langulage: localeData })
        })
        const { remoteLangulages, LocaleLangulages, mergeLangulage } = yield select(state => state.locale.remoteLangulages)
        if (response) {
          remoteLangulages[localeKey] = localeData;
          mergeLangulage[localeKey] = _.defaults(remoteLangulages[localeKey], LocaleLangulages[localeKey])
          yield put({
            type: 'save',
            payload: { remoteLangulages, mergeLangulage },
          });
        }
      } catch (error) {

      }
    }
  },
  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    }
  }
} as Locale;
