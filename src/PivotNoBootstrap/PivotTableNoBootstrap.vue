<template>
  <div class="table-responsive-no-bootstrap">
    <template v-if="isDataLoading">
      <slot name="loading">
        Loading...
      </slot>
    </template>
    <div v-else-if="data.length === 0" class="alert alert-warning" role="alert">
      {{ noDataWarningText }}
    </div>
    <table v-else class="table table-bordered-no-bootstrap">

      <!-- Table header -->
      <thead>
        <tr v-for="(colField, colFieldIndex) in colFields" :key="colField.key" v-if="colField.showHeader === undefined || colField.showHeader">
          <!-- Top left dead zone -->
          <th v-if="colFieldIndex === firstColFieldHeaderIndex && rowHeaderSize > 0" :colspan="rowHeaderSize" :rowspan="colHeaderSize"></th>
          <!-- Column headers -->
          <th v-for="(col, colIndex) in cols" :key="JSON.stringify(col)" :colspan="spanSize(cols, colFieldIndex, colIndex)" v-if="spanSize(cols, colFieldIndex, colIndex) !== 0">
            <slot v-if="colField.headerSlotName" :name="colField.headerSlotName" v-bind:value="col[colFieldIndex]">
              Missing slot <code>{{ colField.headerSlotName }}</code>
            </slot>
            <template v-else>
              {{ col[colFieldIndex] }}
            </template>
          </th>
          <!-- Top right dead zone -->
          <th v-if="colFieldIndex === firstColFieldHeaderIndex && rowFooterSize > 0" :colspan="rowFooterSize" :rowspan="colFooterSize"></th>
        </tr>
      </thead>

      <!-- Table body -->
      <tbody>
        <tr v-for="(row, rowIndex) in rows" :key="JSON.stringify(row)">
          <!-- Row headers -->
          <th v-for="(rowField, rowFieldIndex) in rowFields" :key="rowField.key" :rowspan="spanSize(rows, rowFieldIndex, rowIndex)"  v-if="(rowField.showHeader === undefined || rowField.showHeader) && spanSize(rows, rowFieldIndex, rowIndex) !== 0">
            <slot v-if="rowField.headerSlotName" :name="rowField.headerSlotName" v-bind:value="row[rowFieldIndex]">
              Missing slot <code>{{ rowField.headerSlotName }}</code>
            </slot>
            <template v-else>
              {{ row[rowFieldIndex] }}
            </template>
          </th>
          <!-- Values -->
          <td v-for="col in cols" :key="JSON.stringify(col)" class="text-right">
            <slot v-if="$scopedSlots.value" name="value" v-bind:value="values[JSON.stringify({ col, row })]" />
            <template v-else>{{ values[JSON.stringify({ col, row })] }}</template>
          </td>
          <!-- Row footers (if slots are provided) -->
          <th v-for="(rowField, rowFieldIndex) in rowFieldsReverse" :key="rowField.key" :rowspan="spanSize(rows, rowFields.length - rowFieldIndex - 1, rowIndex)" v-if="rowField.showFooter && spanSize(rows, rowFields.length - 1 - rowFieldIndex, rowIndex) !== 0">
            <slot v-if="rowField.footerSlotName" :name="rowField.footerSlotName" v-bind:value="row[rowFields.length - rowFieldIndex - 1]">
              Missing slot <code>{{ rowField.footerSlotName }}</code>
            </slot>
            <template v-else>
              {{ row[rowFields.length - rowFieldIndex - 1] }}
            </template>
          </th>
        </tr>
      </tbody>

      <!-- Table footer -->
      <tfoot>
        <tr v-for="(colField, colFieldIndex) in colFieldsReverse" :key="colField.key" v-if="colField.showFooter">
          <!-- Bottom left dead zone -->
          <th v-if="colFieldIndex === firstColFieldFooterIndex && rowHeaderSize > 0" :colspan="rowHeaderSize" :rowspan="colHeaderSize"></th>
          <!-- Column footers -->
          <th v-for="(col, colIndex) in cols" :key="JSON.stringify(col)" :colspan="spanSize(cols, colFields.length - colFieldIndex - 1, colIndex)" v-if="spanSize(cols, colFields.length - colFieldIndex - 1, colIndex) !== 0">
            <slot v-if="colField.footerSlotName" :name="colField.footerSlotName" v-bind:value="col[colFields.length - colFieldIndex - 1]">
              Missing slot <code>{{ colField.footerSlotName }}</code>
            </slot>
            <template v-else>
              {{ col[colFields.length - colFieldIndex - 1] }}
            </template>
          </th>
          <!-- Bottom right dead zone -->
          <th v-if="colFieldIndex === firstColFieldFooterIndex && rowFooterSize > 0" :colspan="rowFooterSize" :rowspan="colFooterSize"></th>
        </tr>
      </tfoot>
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
    },
    // Reversed props for footer iterators
    colFieldsReverse: function() {
      return this.colFields.slice().reverse()
    },
    rowFieldsReverse: function() {
      return this.rowFields.slice().reverse()
    },
    // Number of col header rows
    colHeaderSize: function() {
      return this.colFields.filter(colField => colField.showHeader === undefined || colField.showHeader).length
    },
    // Number of col footer rows
    colFooterSize: function() {
      return this.colFields.filter(colField => colField.showFooter).length
    },
    // Number of row header columns
    rowHeaderSize: function() {
      return this.rowFields.filter(rowField => rowField.showHeader === undefined || rowField.showHeader).length
    },
    // Number of row footer columns
    rowFooterSize: function() {
      return this.rowFields.filter(rowField => rowField.showFooter).length
    },
    // Index of the first column field header to show - used for table header dead zones
    firstColFieldHeaderIndex: function() {
      return this.colFields.findIndex(colField => colField.showHeader === undefined || colField.showHeader)
    },
    // Index of the first column field footer to show - used for table footer dead zones
    firstColFieldFooterIndex: function() {
      return this.colFieldsReverse.findIndex(colField => colField.showFooter)
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
.table-responsive-no-bootstrap th {
  color: #7a869a;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.66666667;
  letter-spacing: 0;
  text-transform: none;
  padding: 7px 10px;
  text-align: center;
  vertical-align: top;
  min-width: 100%;
}

.table-responsive-no-bootstrap td {
  border-top: 1px solid #dfe1e6;
  padding: 7px 10px;
  text-align: right;
  vertical-align: top;
  min-width: 100%;
}

.table-responsive-no-bootstrap tr {
  background: #fff;
  color: #172b4d;
}

.table-bordered-no-bootstrap, .table-responsive-no-bootstrap {
  width: inherit;
  max-width: inherit;
  min-width: inherit;
}

.table-bordered-no-bootstrap td, .table-bordered-no-bootstrap th {
  border: 1px solid #dee2e6;
}
</style>
