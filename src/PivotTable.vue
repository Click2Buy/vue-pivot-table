<template>
  <div class="table-responsive">
    <table class="table table-bordered">
      <thead>
        <tr v-for="(colField, colFieldIndex) in colFields" :key="colField.key">
          <th v-if="colFieldIndex === 0 && rowFields.length > 0" :colspan="rowFields.length" :rowspan="colFields.length"></th>
          <th v-for="(col, colIndex) in cols" :key="JSON.stringify(col)" :colspan="spanSize(cols, colFieldIndex, colIndex)" v-if="spanSize(cols, colFieldIndex, colIndex) !== 0">
            {{ format(colField.formatter, col[colFieldIndex]) }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in rows" :key="JSON.stringify(row)">
          <td v-for="(rowField, rowFieldIndex) in rowFields" :key="rowField.key" :rowspan="spanSize(rows, rowFieldIndex, rowIndex)" v-if="spanSize(rows, rowFieldIndex, rowIndex) !== 0" class="font-weight-bold">
            {{ format(rowField.formatter, row[rowFieldIndex]) }}
          </td>
          <td v-for="col in cols" :key="JSON.stringify(col)" class="text-right">
            {{ value(col, row) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import naturalSort from 'javascript-natural-sort'

export default {
  props: ['data', 'rowFields', 'colFields', 'reducer', 'valueFormatter'],
  computed: {
    cols: function() {
      const cols = []

      const extractColsRecursive = (depth, filters) => {
        const getter = this.colFields[depth].getter
        const sort = this.colFields[depth].sort || naturalSort
        const values = [...new Set(this.filteredData({ colFilters: filters }).map(item => getter(item)))].sort(sort)

        values.forEach(value => {
          // Build new filter hash
          const valueFilters = Object.assign({}, filters)
          valueFilters[depth] = value

          // Recursive call
          if (depth + 1 < this.colFields.length) {
            extractColsRecursive(depth + 1, valueFilters)
          } else {
            cols.push(valueFilters)
          }
        })
      }

      if (this.colFields.length > 0) {
        extractColsRecursive(0, {})
      } else {
        cols.push({})
      }

      return cols
    },
    rows: function() {
      const rows = []

      const extractRowsRecursive = (depth, filters) => {
        const getter = this.rowFields[depth].getter
        const sort = this.rowFields[depth].sort || naturalSort
        const values = [...new Set(this.filteredData({ rowFilters: filters }).map(item => getter(item)))].sort(sort)

        values.forEach(value => {
          // Build new filter hash
          const valueFilters = Object.assign({}, filters)
          valueFilters[depth] = value

          // Recursive call
          if (depth + 1 < this.rowFields.length) {
            extractRowsRecursive(depth + 1, valueFilters)
          } else {
            rows.push(valueFilters)
          }
        })
      }

      if (this.rowFields.length > 0) {
        extractRowsRecursive(0, {})
      } else {
        rows.push({})
      }

      return rows
    }
  },
  methods: {
    // Get data filtered
    filteredData: function({ colFilters = {}, rowFilters = {} }) {
      return this.data.filter(item => {
        let keep = true

        for (const [depth, value] of Object.entries(colFilters)) {
          const getter = this.colFields[depth].getter
          if (getter(item) !== value) {
            keep = false
          }
        }

        for (const [depth, value] of Object.entries(rowFilters)) {
          const getter = this.rowFields[depth].getter
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
    spanSize: function(values, fieldIndex, valueIndex) {      
      // If left value === current value
      // and top value === 0 (= still in the same top bracket)
      // The left td will take care of the display
      if (valueIndex > 0 &&
        values[valueIndex - 1][fieldIndex] === values[valueIndex][fieldIndex] &&
        (fieldIndex === 0 || (this.spanSize(values, fieldIndex - 1, valueIndex) === 0))) {
        return 0
      }

      // Otherwise, count entries on the right with the same value
      // But stop if the top value !== 0 (= the top bracket has changed)
      let size = 1
      let i = valueIndex
      while (i + 1 < values.length &&
        values[i + 1][fieldIndex] === values[i][fieldIndex] &&
        (fieldIndex === 0 || (i + 1 < values.length && this.spanSize(values, fieldIndex - 1, i + 1) === 0))) {
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