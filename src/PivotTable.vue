<template>
  <div class="table-responsive">
    <h2>Table here</h2>
    {{ rows }}
    {{ cols }}
  </div>
</template>

<script>
export default {
  props: ['data', 'rows', 'cols'],
  data: () => {
    return {}
  },
  computed: {},
  methods: {}
}
</script>

<style scoped>
</style>