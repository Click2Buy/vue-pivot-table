import Pivot from './Pivot'
import PivotTable from './PivotTable'

export function install(Vue, options) {
  Vue.component('pivot', Pivot)
  Vue.component('pivot-table', PivotTable)
}