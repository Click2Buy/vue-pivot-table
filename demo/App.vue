<template>
  <div id="app" class="container mt-5">
    <h1 class="border-bottom pb-2 mb-4">Vue pivot table demo</h1>


    <h2 class="border-bottom pb-2 mb-4">Pivot <small>(drag & drop UI + PivotTable)</small></h2>

    <div class="mb-5">
      <pivot
        :data="data"
        :fields="fields"
        :row-fields="rowFields"
        :col-fields="colFields"
        :reducer="reducer"
        :default-show-settings="defaultShowSettings"
      >
        <template slot="value" slot-scope="{ value }">
          {{ value.toLocaleString() }}
        </template>
      </pivot>
    </div>

    <h2 class="border-bottom pb-2 mb-4">PivotTable <small>(standalone)</small></h2>
    
    <div class="mb-5">
      <pivot-table
        :data="data"
        :row-fields="rowFields"
        :col-fields="colFields"
        :reducer="reducer"
        :default-show-settings="defaultShowSettings"
      >
        <template slot="value" slot-scope="{ value }">
          {{ value.toLocaleString() }}
        </template>
      </pivot-table>
    </div>
  </div>
</template>

<script>
import Pivot from '../src/Pivot'
import PivotTable from '../src/PivotTable'
import data from './data'

export default {
  name: 'app',
  components: { Pivot, PivotTable },
  data: () => {
    return {
      data: data,
      fields: [],
      rowFields: [{
        getter: item => item.country,
        label: 'Country'
      }, {
        getter: item => item.gender,
        label: 'Gender'
      }],
      colFields: [{
        getter: item => item.year,
        label: 'Year'
      }],
      reducer: (sum, item) => sum + item.count,
      defaultShowSettings: true
    }
  }
}
</script>

<style lang="scss">
$enable-rounded: false;
@import '~bootstrap/scss/bootstrap.scss';
</style>
