<template>
  <div class="table-responsive">
    <table class="table table-bordered">
      <thead>
        <tr v-for="(col, colIndex) in cols" :key="col.key">
          <th v-if="colIndex === 0 && rows.length > 0" :colspan="rows.length" :rowspan="cols.length"></th>
          <th v-for="(colValue, colValueIndex) in colValues" :key="JSON.stringify(colValue)" :colspan="spanSize(colValues, colIndex, colValueIndex)" v-if="spanSize(colValues, colIndex, colValueIndex) !== 0">
            {{ format(col.formatter, colValue[colIndex]) }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(rowValue, rowValueIndex) in rowValues" :key="JSON.stringify(rowValue)">
          <td v-for="(row, rowIndex) in rows" :key="row.key" :rowspan="spanSize(rowValues, rowIndex, rowValueIndex)" v-if="spanSize(rowValues, rowIndex, rowValueIndex) !== 0" class="font-weight-bold">
            {{ format(row.formatter, rowValue[rowIndex]) }}
          </td>
          <td v-for="colValue in colValues" :key="JSON.stringify(colValue)" class="text-right">
            {{ value(colValue, rowValue) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import naturalSort from 'javascript-natural-sort'

export default {
  props: ['data', 'rows', 'cols', 'reducer', 'valueFormatter'],
  computed: {
    colValues: function() {
      const colValues = []

      const extractColValuesRecursive = (depth, filters) => {
        const getter = this.cols[depth].getter
        const sort = this.cols[depth].sort || naturalSort
        const values = [...new Set(this.filteredData({ colFilters: filters }).map(item => getter(item)))].sort(sort)

        values.forEach(value => {
          // Build new filter hash
          const valueFilters = Object.assign({}, filters)
          valueFilters[depth] = value

          // Recursive call
          if (depth + 1 < this.cols.length) {
            extractColValuesRecursive(depth + 1, valueFilters)
          } else {
            colValues.push(valueFilters)
          }
        })
      }

      if (this.cols.length > 0) {
        extractColValuesRecursive(0, {})
      } else {
        colValues.push({})
      }

      return colValues
    },
    rowValues: function() {
      const rowValues = []

      const extractRowValuesRecursive = (depth, filters) => {
        const getter = this.rows[depth].getter
        const sort = this.rows[depth].sort || naturalSort
        const values = [...new Set(this.filteredData({ rowFilters: filters }).map(item => getter(item)))].sort(sort)

        values.forEach(value => {
          // Build new filter hash
          const valueFilters = Object.assign({}, filters)
          valueFilters[depth] = value

          // Recursive call
          if (depth + 1 < this.rows.length) {
            extractRowValuesRecursive(depth + 1, valueFilters)
          } else {
            rowValues.push(valueFilters)
          }
        })
      }

      if (this.rows.length > 0) {
        extractRowValuesRecursive(0, {})
      } else {
        rowValues.push({})
      }

      return rowValues
    }
  },
  methods: {
    // Get data filtered
    filteredData: function({ colFilters = {}, rowFilters = {} }) {
      return this.data.filter(item => {
        let keep = true

        for (const [depth, value] of Object.entries(colFilters)) {
          const getter = this.cols[depth].getter
          if (getter(item) !== value) {
            keep = false
          }
        }

        for (const [depth, value] of Object.entries(rowFilters)) {
          const getter = this.rows[depth].getter
          if (getter(item) !== value) {
            keep = false
          }
        }

        return keep
      })
    },
    // Get sum value for col/row filters
    value: function(colFilters, rowFilters) {
      return this.valueFormatter(this.filteredData({ colFilters: colFilters, rowFilters: rowFilters }).reduce(this.reducer, 0))
    },
    // Get colspan/rowspan size
    spanSize: function(values, index, valueIndex) {      
      // If left value === current value
      // and top value === 0 (= still in the same top bracket)
      // The left td will take care of the display
      if (valueIndex > 0 &&
        values[valueIndex - 1][index] === values[valueIndex][index] &&
        (index === 0 || (this.spanSize(values, index - 1, valueIndex) === 0))) {
        return 0
      }

      // Otherwise, count entries on the right with the same value
      // But stop if the top value !== 0 (= the top bracket has changed)
      let size = 1
      let i = valueIndex
      while (i + 1 < values.length &&
        values[i + 1][index] === values[i][index] &&
        (index === 0 || (i + 1 < values.length && this.spanSize(values, index - 1, i + 1) === 0))) {
        i++
        size++
      }

      return size
    },
    // Format with an optional function
    format: function(formatter, value) {
      return formatter ? formatter(value) : value
    }
  }
}
</script>

<style scoped>
td {
  min-width: 100px;
}
</style>