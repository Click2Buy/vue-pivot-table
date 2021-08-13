import Pivot from './components/Pivot.vue'
import PivotTable from './components/PivotTable.vue'

export default {
  install(Vue) {
    Vue.component("pivot", Pivot)
    Vue.component("pivot-table", PivotTable)
  }
}
