import Pivot from './components/Pivot.vue'
import PivotTable from './components/PivotTable.vue'

export function install(Vue) {
  Vue.component("Pivot", Pivot)
  Vue.component("PivotTable", PivotTable)
}
