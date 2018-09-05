<template>
  <div class="table-responsive">
    <template v-if="isDataLoading">
      <slot name="loading">
        Loading...
      </slot>
    </template>
    <div v-else-if="data.length === 0" class="alert alert-warning" role="alert">
      {{ noDataWarningText }}
    </div>
    <table v-else class="table table-bordered">
      <thead>
        <tr v-for="(colField, colFieldIndex) in colFields" :key="colField.key">
          <th v-if="colFieldIndex === 0 && rowFields.length > 0" :colspan="rowFields.length" :rowspan="colFields.length"></th>
          <th v-for="(col, colIndex) in cols" :key="JSON.stringify(col)" :colspan="spanSize(cols, colFieldIndex, colIndex)" v-if="spanSize(cols, colFieldIndex, colIndex) !== 0">
            <slot v-if="colField.headerSlotName" :name="colField.headerSlotName" v-bind:value="col[colFieldIndex]">
              Undefined slot "{{ colField.headerSlotName }}"
            </slot>
            <template v-else>
              {{ col[colFieldIndex] }}
            </template>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in rows" :key="JSON.stringify(row)">
          <td v-for="(rowField, rowFieldIndex) in rowFields" :key="rowField.key" :rowspan="spanSize(rows, rowFieldIndex, rowIndex)" v-if="spanSize(rows, rowFieldIndex, rowIndex) !== 0" class="font-weight-bold">
            <slot v-if="rowField.headerSlotName" :name="rowField.headerSlotName" v-bind:value="row[rowFieldIndex]">
              Undefined slot "{{ rowField.headerSlotName }}"
            </slot>
            <template v-else>
              {{ row[rowFieldIndex] }}
            </template>
          </td>
          <td v-for="col in cols" :key="JSON.stringify(col)" class="text-right">
            <slot v-if="$scopedSlots.value" name="value" v-bind:value="values[JSON.stringify({ col, row })]" />
            <template v-else>{{ values[JSON.stringify({ col, row })] }}</template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import naturalSort from 'javascript-natural-sort'

export default {
  props: ['data', 'rowFields', 'colFields', 'reducer', 'noDataWarningText'],
  props: {
    data: {
      type: Array,
      default: []
    },
    rowFields: {
      type: Array,
      default: []
    },
    colFields: {
      type: Array,
      default: []
    },
    reducer: {
      type: Function,
      default: (sum, item) => sum + 1
    },
    noDataWarningText: {
      type: String,
      default: 'No data to display.'
    },
    isDataLoading: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      values: {} // Alas vue does not support js Map
    }
  },
  computed: {
    cols: function() {
      const cols = []

      const extractColsRecursive = (depth, filters) => {
        const getter = this.colFields[depth].getter
        const sort = this.colFields[depth].sort || naturalSort
        const values = [...new Set(this.filteredData({ data: this.data, colFilters: filters }).map(item => getter(item)))].sort(sort)

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
        const values = [...new Set(this.filteredData({ data: this.data, rowFilters: filters }).map(item => getter(item)))].sort(sort)

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
    },
    // Compound property for watch single callback
    colsAndRows: function() {
      return [this.cols, this.rows]
    }
  },
  methods: {
    // Get data filtered
    filteredData: function({ data = [], colFilters = {}, rowFilters = {} }) {
      // Prepare getters
      const colGetters = {}, rowGetters = {}

      for (const depth in colFilters) {
        colGetters[depth] = this.colFields[depth].getter
      }

      for (const depth in rowFilters) {
        rowGetters[depth] = this.rowFields[depth].getter
      }

      // Filter data with getters
      return data.filter(item => {
        let keep = true

        for (const depth in colFilters) {
          if (colGetters[depth](item) !== colFilters[depth]) {
            keep = false
            break
          }
        }

        if (keep) {
          for (const depth in rowFilters) {
            if (rowGetters[depth](item) !== rowFilters[depth]) {
              keep = false
              break
            }
          }
        }

        return keep
      })
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
    // Called when cols/rows have changed => recompute values
    computeValues: function() {
      // Remove old values
      this.values = {}

      // Compute new values
      this.rows.forEach(row => {
        const rowData = this.filteredData({ data: this.data, rowFilters: row })
        this.cols.forEach(col => {
          const data = this.filteredData({ data: rowData, colFilters: col })

          const key = JSON.stringify({ col, row })
          const value = data.reduce(this.reducer, 0)
          this.values[key] = value
        })
      })
    }
  },
  watch: {
    colsAndRows: function() {
      this.computeValues()
    }
  },
  created: function() {
    this.computeValues()
  }
}
</script>

<style scoped>
td {
  min-width: 100px;
}
</style>