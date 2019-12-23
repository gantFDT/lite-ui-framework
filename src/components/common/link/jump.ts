import { connect } from 'dva';
import { RouteData } from 'umi/router';
import { compose, withProps } from 'recompose'
import { Store } from '@/models/connect'
import { MenuTypes } from '@/models/menu'
import jumpWithoutFlatmenu from './utils'
import { getModelData } from '@/utils/utils'
/**
 * // 普通跳转，不带参数
router.push('list');

// 带参数
router.push('list?a=b');
router.push({
  pathname: 'list',
  query: {
    a: 'b',
  },
});
# 对象且不包含 pathname 会报错
router.push({
  query: {}
});
 */

export default function jump(param: string | RouteData) {
    const { flatmenu }: { flatmenu: MenuTypes.flatMenu } = getModelData('menu')
    jumpWithoutFlatmenu(param, flatmenu)
}


export const jumpCompose = compose(
    connect(({ menu }: Store) => ({
        flatmenu: menu.flatmenu
    })),
    withProps<{ jump: Function }, { flatmenu: MenuTypes.flatMenu }>(
        ({ flatmenu }) => ({
            jump: (param: string | RouteData) => jumpWithoutFlatmenu(param, flatmenu)
        })
    )
)