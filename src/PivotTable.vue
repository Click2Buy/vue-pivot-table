<template>
  <div class="table-responsive">
    <table class="table table-bordered">
      <thead>
        <tr v-for="(col, colIndex) in cols" :key="col.key">
          <th v-if="colIndex === 0 && rows.length > 0" :colspan="rows.length" :rowspan="cols.length"></th>
          <th v-for="(colValue, colValueIndex) in colValues" :key="JSON.stringify(colValue)" :colspan="colspanSize(colValues, colIndex, colValueIndex)" v-if="colspanSize(colValues, colIndex, colValueIndex) !== 0">
            {{ colValue[col.key] }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(rowValue, rowValueIndex) in rowValues" :key="JSON.stringify(rowValue)">
          <td v-for="(row, rowIndex) in rows" :key="row.key" :rowspan="rowspanSize(rowValues, rowIndex, rowValueIndex)" v-if="rowspanSize(rowValues, rowIndex, rowValueIndex) !== 0" class="font-weight-bold">
            {{ rowValue[row.key] }}
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
  props: ['data', 'rows', 'cols', 'reducer', 'valueFilter'],
  computed: {
    colValues: function() {
      const colValues = []

      const extractColValuesRecursive = (depth, filters) => {
        const field = this.cols[depth].key
        const values = [...new Set(this.filteredData(filters).map(item => item[field]))].sort(naturalSort) // TODO: allow custom sort // Use item._id[field] ?

        values.forEach(value => {
          // Build new filter hash
          const valueFilters = Object.assign({}, filters)
          valueFilters[field] = value

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
        const field = this.rows[depth].key
        const values = [...new Set(this.filteredData(filters).map(item => item[field]))].sort(naturalSort) // TODO: allow custom sort // Use item._id[field] ?

        values.forEach(value => {
          // Build new filter hash
          const valueFilters = Object.assign({}, filters)
          valueFilters[field] = value

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
    // Get data filtered on _id by a key/value object
    filteredData: function(filters) {
      return this.data.filter(item => {
        let keep = true
        for (const [key, value] of Object.entries(filters)) {
          if (item[key] !== value) { // Use item._id[key] ?
            keep = false
          }
        }
        return keep
      })
    },
    // Get sum value for col/row filters
    value: function(colFilters, rowFilters) {
      const filters = { ...colFilters, ...rowFilters }
      const data = this.filteredData(filters)
      return this.valueFilter(data.reduce(this.reducer, 0))
    },
    // Get colspan size
    colspanSize: function(colValues, colIndex, colValueIndex) {
      const col = this.cols[colIndex].key
      
      // If left value === current value
      // and top value === 0 (= still in the same top bracket)
      // The left td will take care of the display
      if (colValueIndex > 0 &&
        colValues[colValueIndex - 1][col] === colValues[colValueIndex][col] &&
        (colIndex === 0 || (this.colspanSize(colValues, colIndex - 1, colValueIndex) === 0))) {
        return 0
      }

      // Otherwise, count entries on the right with the same value
      // But stop if the top value !== 0 (= the top bracket has changed)
      let size = 1
      let i = colValueIndex
      while (i + 1 < colValues.length &&
        colValues[i + 1][col] === colValues[i][col] &&
        (colIndex === 0 || (i + 1 < colValues.length && this.colspanSize(colValues, colIndex - 1, i + 1) === 0))) {
        i++
        size++
      }

      return size
    },
    // Get rowspan size
    rowspanSize: function(rowValues, rowIndex, rowValueIndex) {
      const row = this.rows[rowIndex].key
      
      // If left value === current value
      // and top value === 0 (= still in the same top bracket)
      // The left td will take care of the display
      if (rowValueIndex > 0 &&
        rowValues[rowValueIndex - 1][row] === rowValues[rowValueIndex][row] &&
        (rowIndex === 0 || (this.rowspanSize(rowValues, rowIndex - 1, rowValueIndex) === 0))) {
        return 0
      }

      // Otherwise, count entries on the right with the same value
      // But stop if the top value !== 0 (= the top bracket has changed)
      let size = 1
      let i = rowValueIndex
      while (i + 1 < rowValues.length &&
        rowValues[i + 1][row] === rowValues[i][row] &&
        (rowIndex === 0 || (i + 1 < rowValues.length && this.rowspanSize(rowValues, rowIndex - 1, i + 1) === 0))) {
        i++
        size++
      }

      return size
    }
  }
}
</script>

<style scoped>
td {
  min-width: 100px;
}
</style>