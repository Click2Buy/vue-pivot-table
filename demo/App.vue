<template>
  <div id="app" class="container mt-5">
    <pivot :data="data" :fields="fields" :rows="rows" :cols="cols" />
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
      fields: ['Name'],
      rows: ['Province', 'Party'],
      cols: ['Age', 'Gender']
    }
  }
}
</script>

<style>
@import '~bootstrap/dist/css/bootstrap.min.css';
</style>
