<template>
  <div>
    <div v-if="hasCount">{{ value.count || 0 | number }}</div>
    <div v-if="hasGdp">{{ value.gdp || 0 | amount }}</div>
  </div>
</template>

<script>
export default {
  name: 'MixedDataValue',
  props: {
    value: {},
    labels: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    typeLabel: function() {
      return this.labels.find(label => label.field.key === 'type')
    },
    hasCount: function() {
      return !this.typeLabel || this.typeLabel.value === 'count'
    },
    hasGdp: function() {
      return !this.typeLabel || this.typeLabel.value === 'gdp'
    }
  },
  created: function() {},
  filters: {
    number: function(value) {
      return value.toLocaleString()
    },
    amount: function(value) {
      return value.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2
      })
    }
  }
}
</script>
