import Pivot from './Pivot'
import PivotTable from './PivotTable'
import PivotNoBootstrap from './PivotNoBootstrap/PivotNoBootstrap'
import PivotTableNoBootstrap from './PivotNoBootstrap/PivotTableNoBootstrap'

export function install(Vue, options) {
  Vue.component('pivot', Pivot)
  Vue.component('pivot-table', PivotTable)
  Vue.component('pivot-no-bootstrap', PivotNoBootstrap)
  Vue.component('pivot-table-no-bootstrap', PivotTableNoBootstrap)
}
