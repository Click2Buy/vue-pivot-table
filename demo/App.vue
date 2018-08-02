<template>
  <div id="app" class="container mt-5">
    <h1 class="border-bottom pb-2 mb-4">Vue pivot table demo</h1>

    <div class="mb-5">
      <pivot :data="data" :fields="fields" :rows="rows" :cols="cols" :reducer="reducer" :value-formatter="valueFormatter" />
    </div>
  </div>
</template>

<script>
import Pivot from '../src/Pivot'
import data from './data'

export default {
  name: 'app',
  components: { Pivot },
  data: () => {
    return {
      data: data,
      fields: [],
      cols: [{
        getter: item => item.year,
        label: 'Year'
      }],
      rows: [{
        getter: item => item.country,
        label: 'Country'
      }, {
        getter: item => item.gender,
        label: 'Gender'
      }],
      reducer: function(sum, item) {
        return sum + item.count
      },
      valueFormatter: function(value) {
        return value.toLocaleString()
      }
    }
  }
}
</script>

<style lang="scss">
$enable-rounded: false;
@import '~bootstrap/scss/bootstrap.scss';
</style>
