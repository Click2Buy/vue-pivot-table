<template>
  <div id="app" class="container mt-5">
    <h1 class="border-bottom pb-2 mb-4">Vue pivot table demo</h1>

    <pivot :data="data" :fields="fields" :rows="rows" :cols="cols" :reducer="reducer" :value-filter="valueFilter" />
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
      rows: [{
        key: 'country',
        label: 'Country'
      }, {
        key: 'gender',
        label: 'Gender'
      }],
      cols: [{
        key: 'year',
        label: 'Year'
      }],
      reducer: function(sum, item) {
        return sum + item.count
      },
      valueFilter: function(value) {
        return value.toLocaleString()
      }
    }
  }
}
</script>

<style>
@import '~bootstrap/dist/css/bootstrap.min.css';
</style>
