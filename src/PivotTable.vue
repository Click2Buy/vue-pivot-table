<template>
  <div class="position-relative">
    <template v-if="isDataLoading">
      <slot name="loading">
        Loading...
      </slot>
    </template>
    <template v-else>
      <template v-if="isDataComputing">
        <slot name="computing">
          <div class="position-absolute w-100 h-100 text-center" style="z-index: 1;">
            <div class="position-sticky d-inline-block mt-5 p-3" style="top: 0;">
              Loading table values...
            </div>
          </div>
        </slot>
      </template>

      <div v-if="data.length === 0" class="alert alert-warning" role="alert">
        {{ noDataWarningText }}
      </div>

      <div v-else-if="cols.length && rows.length" class="table-responsive">
        <table class="table table-bordered" :aria-busy="isDataLoading || isDataComputing">

          <!-- Table header -->
          <thead>
            <template
              v-for="(colField, colFieldIndex) in internalColFields"
              v-if="colField.showHeader === undefined || colField.showHeader"
              >
              <!-- Multiple slots -->
              <template v-if="colField.headerSlotNames">
                <tr v-for="(headerSlotName, headerSlotNameIndex) in colField.headerSlotNames">
                  <!-- Top left dead zone -->
                  <th
                    v-if="colFieldIndex === firstColFieldHeaderIndex && rowHeaderSize > 0 && headerSlotNameIndex === 0"
                    :colspan="rowHeaderSize"
                    :rowspan="colHeaderSize"
                    ></th>
                  <!-- Column headers -->
                  <th
                    v-for="(col, colIndex) in sortedCols"
                    :key="JSON.stringify(col)"
                    :colspan="spanSize('col', sortedCols, colIndex, colFieldIndex)"
                    v-if="spanSize('col', sortedCols, colIndex, colFieldIndex) !== 0"
                    >
                    <slot :name="headerSlotName" v-bind:value="col[`col-${colFieldIndex}`]">
                      Missing slot <code>{{ headerSlotName }}</code>
                    </slot>
                  </th>
                  <!-- Top right dead zone -->
                  <th
                    v-if="colFieldIndex === firstColFieldHeaderIndex && rowFooterSize > 0 && headerSlotNameIndex === 0"
                    :colspan="rowFooterSize"
                    :rowspan="colFooterSize"
                    ></th>
                </tr>
              </template>
              <!-- Single slot/no slot -->
              <tr v-else>
                <!-- Top left dead zone -->
                <th
                  v-if="colFieldIndex === firstColFieldHeaderIndex && rowHeaderSize > 0"
                  :colspan="rowHeaderSize"
                  :rowspan="colHeaderSize"
                  ></th>
                <!-- Column headers -->
                <th
                  v-for="(col, colIndex) in sortedCols"
                  :key="JSON.stringify(col)"
                  :colspan="spanSize('col', sortedCols, colIndex, colFieldIndex)"
                  v-if="spanSize('col', sortedCols, colIndex, colFieldIndex) !== 0"
                  >
                  <slot v-if="colField.headerSlotName" :name="colField.headerSlotName" v-bind:value="col[`col-${colFieldIndex}`]">
                    Missing slot <code>{{ colField.headerSlotName }}</code>
                  </slot>
                  <template v-else>
                    {{ col[`col-${colFieldIndex}`] }}
                  </template>
                </th>
                <!-- Top right dead zone -->
                <th
                  v-if="colFieldIndex === firstColFieldHeaderIndex && rowFooterSize > 0"
                  :colspan="rowFooterSize"
                  :rowspan="colFooterSize"
                  ></th>
              </tr>
            </template>
          </thead>

          <!-- Table body -->
          <tbody>
            <tr v-for="(row, rowIndex) in sortedRows" :key="JSON.stringify(row)">
              <!-- Row headers -->
              <template
                v-for="(rowField, rowFieldIndex) in internalRowFields"
                v-if="(rowField.showHeader === undefined || rowField.showHeader) && spanSize('row', sortedRows, rowIndex, rowFieldIndex) !== 0"
                >
                <!-- Multiple slots -->
                <template v-if="rowField.headerSlotNames">
                  <th
                    v-for="headerSlotName in rowField.headerSlotNames"
                    :rowspan="spanSize('row', sortedRows, rowIndex, rowFieldIndex)">
                    <slot :name="headerSlotName" v-bind:value="row[`row-${rowFieldIndex}`]">
                      Missing slot <code>{{ headerSlotName }}</code>
                    </slot>
                  </th>
                </template>
                <!-- Single slot/no slot -->
                <th v-else :rowspan="spanSize('row', sortedRows, rowIndex, rowFieldIndex)">
                  <slot v-if="rowField.headerSlotName" :name="rowField.headerSlotName" v-bind:value="row[`row-${rowFieldIndex}`]">
                    Missing slot <code>{{ rowField.headerSlotName }}</code>
                  </slot>
                  <template v-else>
                    {{ row[`row-${rowFieldIndex}`] }}
                  </template>
                </th>
              </template>
              <!-- Values -->
              <td
                v-for="col in sortedCols"
                :key="JSON.stringify(col)"
                class="text-right"
                >
                <slot v-if="$scopedSlots.value" name="value" :value="value(row, col)" :row="Object.values(row)" :col="Object.values(col)" />
                <template v-else>{{ value(row, col) }}</template>
              </td>
              <!-- Row footers (if slots are provided) -->
              <template
                v-for="(rowField, rowFieldIndex) in internalRowFieldsReverse"
                v-if="rowField.showFooter && spanSize('row', rows, rowIndex, internalRowFields.length - rowFieldIndex - 1) !== 0"
                >
                <!-- Multiple slots -->
                <template v-if="rowField.footerSlotNames">
                  <th
                    v-for="footerSlotName in rowField.footerSlotNames"
                    :rowspan="spanSize('row', rows, rowIndex, internalRowFields.length - rowFieldIndex - 1)">
                    <slot :name="footerSlotName" v-bind:value="row[`row-${internalRowFields.length - rowFieldIndex - 1}`]">
                      Missing slot <code>{{ footerSlotName }}</code>
                    </slot>
                  </th>
                </template>
                <!-- Single slot/no slot -->
                <th v-else :rowspan="spanSize('row', rows, rowIndex, internalRowFields.length - rowFieldIndex - 1)">
                  <slot v-if="rowField.footerSlotName" :name="rowField.footerSlotName" v-bind:value="row[`row-${internalRowFields.length - rowFieldIndex - 1}`]">
                    Missing slot <code>{{ rowField.footerSlotName }}</code>
                  </slot>
                  <template v-else>
                    {{ row[`row-${internalRowFields.length - rowFieldIndex - 1}`] }}
                  </template>
                </th>
              </template>
            </tr>
          </tbody>

          <!-- Table footer -->
          <tfoot>
            <template
              v-for="(colField, colFieldIndex) in internalColFieldsReverse"
              v-if="colField.showFooter">
              <!-- Multiple slots -->
              <template v-if="colField.footerSlotNames">
                <tr v-for="(footerSlotName, footerSlotNameIndex) in colField.footerSlotNames">
                  <!-- Bottom left dead zone -->
                  <th
                    v-if="colFieldIndex === firstColFieldFooterIndex && rowHeaderSize > 0 && footerSlotNameIndex === 0"
                    :colspan="rowHeaderSize"
                    :rowspan="colHeaderSize"></th>
                  <!-- Column footers -->
                  <th
                    v-for="(col, colIndex) in sortedCols"
                    :key="JSON.stringify(col)"
                    :colspan="spanSize('col', sortedCols, colIndex, internalColFields.length - colFieldIndex - 1)"
                    v-if="spanSize('col', sortedCols, colIndex, internalColFields.length - colFieldIndex - 1) !== 0">
                    <slot :name="footerSlotName" v-bind:value="col[`col-${internalColFields.length - colFieldIndex - 1}`]">
                      Missing slot <code>{{ footerSlotName }}</code>
                    </slot>
                  </th>
                  <!-- Bottom right dead zone -->
                  <th
                    v-if="colFieldIndex === firstColFieldFooterIndex && rowFooterSize > 0 && footerSlotNameIndex === 0"
                    :colspan="rowFooterSize"
                    :rowspan="colFooterSize"
                    ></th>
                </tr>
              </template>
              <!-- Single slot/no slot -->
              <tr v-else>
                <!-- Bottom left dead zone -->
                <th
                  v-if="colFieldIndex === firstColFieldFooterIndex && rowHeaderSize > 0"
                  :colspan="rowHeaderSize"
                  :rowspan="colHeaderSize"></th>
                <!-- Column footers -->
                <th
                  v-for="(col, colIndex) in sortedCols"
                  :key="JSON.stringify(col)"
                  :colspan="spanSize('col', sortedCols, colIndex, internalColFields.length - colFieldIndex - 1)"
                  v-if="spanSize('col', sortedCols, colIndex, internalColFields.length - colFieldIndex - 1) !== 0">
                  <slot v-if="colField.footerSlotName" :name="colField.footerSlotName" v-bind:value="col[`col-${internalColFields.length - colFieldIndex - 1}`]">
                    Missing slot <code>{{ colField.footerSlotName }}</code>
                  </slot>
                  <template v-else>
                    {{ col[`col-${internalColFields.length - colFieldIndex - 1}`] }}
                  </template>
                </th>
                <!-- Bottom right dead zone -->
                <th
                  v-if="colFieldIndex === firstColFieldFooterIndex && rowFooterSize > 0"
                  :colspan="rowFooterSize"
                  :rowspan="colFooterSize"
                  ></th>
              </tr>
            </template>
          </tfoot>
        </table>
      </div>
    </template>
  </div>
</template>

<script>
import HashTable from './HashTable'
import { firstBy } from 'thenby'
import naturalSort from 'javascript-natural-sort'

export default {
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
      valuesHashTable: null,
      rows: [],
      cols: [],
      // Note: we don't use the rowFields/colFields props directly to trigger table render when `computeData` has finished
      internalRowFields: this.rowFields,
      internalColFields: this.colFields,
      isDataComputing: false,
      computeDataInterval: null
    }
  },
  computed: {
    // Sort rows/cols using a composed function built with thenBy.js
    sortedRows: function() {
      let composedSortFunction
      this.internalRowFields.forEach((rowField, rowFieldIndex) => {
        if (rowFieldIndex === 0) {
          composedSortFunction = firstBy('row-0', { cmp: rowField.sort || naturalSort })
        } else {
          composedSortFunction = composedSortFunction.thenBy(`row-${rowFieldIndex}`, { cmp: rowField.sort || naturalSort })
        }
      })

      return [...this.rows].sort(composedSortFunction)
    },
    sortedCols: function() {
      let composedSortFunction
      this.internalColFields.forEach((colField, colFieldIndex) => {
        if (colFieldIndex === 0) {
          composedSortFunction = firstBy('col-0', { cmp: colField.sort || naturalSort })
        } else {
          composedSortFunction = composedSortFunction.thenBy(`col-${colFieldIndex}`, { cmp: colField.sort || naturalSort })
        }
      })

      return [...this.cols].sort(composedSortFunction)
    },
    // Compound property for watch single callback
    fields: function() {
      return [this.colFields, this.rowFields]
    },
    // Reversed props for footer iterators
    internalRowFieldsReverse: function() {
      return this.internalRowFields.slice().reverse()
    },
    internalColFieldsReverse: function() {
      return this.internalColFields.slice().reverse()
    },
    // Number of row header columns
    rowHeaderSize: function() {
      return this.internalRowFields.reduce((acc, rowField) => {
        if (rowField.showHeader === undefined || rowField.showHeader) {
          if (rowField.headerSlotNames) return acc + rowField.headerSlotNames.length
          else return acc + 1
        }
        else return acc
      }, 0)
    },
    // Number of row footer columns
    rowFooterSize: function() {
      return this.internalRowFields.reduce((acc, rowField) => {
        if (rowField.showFooter) {
          if (rowField.footerSlotNames) return acc + rowField.footerSlotNames.length
          else return acc + 1
        }
        else return acc
      }, 0)
    },
    // Number of col header rows
    colHeaderSize: function() {
      return this.internalColFields.reduce((acc, colField) => {
        if (colField.showHeader === undefined || colField.showHeader) {
          if (colField.headerSlotNames) return acc + colField.headerSlotNames.length
          else return acc + 1
        }
        else return acc
      }, 0)
    },
    // Number of col footer rows
    colFooterSize: function() {
      return this.internalColFields.reduce((acc, colField) => {
        if (colField.showFooter) {
          if (colField.footerSlotNames) return acc + colField.footerSlotNames.length
          else return acc + 1
        }
        else return acc
      }, 0)
    },
    // Index of the first column field header to show - used for table header dead zones
    firstColFieldHeaderIndex: function() {
      return this.internalColFields.findIndex(colField => colField.showHeader === undefined || colField.showHeader)
    },
    // Index of the first column field footer to show - used for table footer dead zones
    firstColFieldFooterIndex: function() {
      return this.internalColFieldsReverse.findIndex(colField => colField.showFooter)
    }
  },
  methods: {
    // Get value from valuesHashTable
    value: function(row, col) {
      return this.valuesHashTable.get({...row, ...col}) || 0
    },
    // Get colspan/rowspan size
    spanSize: function(type, values, valueIndex, fieldIndex) {
      // If left value === current value
      // and top value === 0 (= still in the same top bracket)
      // The left td will take care of the display
      if (valueIndex > 0 &&
        values[valueIndex - 1][`${type}-${fieldIndex}`] === values[valueIndex][`${type}-${fieldIndex}`] &&
        (fieldIndex === 0 || (this.spanSize(type, values, valueIndex, fieldIndex - 1) === 0))) {
        return 0
      }

      // Otherwise, count entries on the right with the same value
      // But stop if the top value !== 0 (= the top bracket has changed)
      let size = 1
      let i = valueIndex
      while (i + 1 < values.length &&
        values[i + 1][`${type}-${fieldIndex}`] === values[i][`${type}-${fieldIndex}`] &&
        (fieldIndex === 0 || (i + 1 < values.length && this.spanSize(type, values, i + 1, fieldIndex - 1) === 0))) {
        i++
        size++
      }

      return size
    },
    // Called when fields have changed => recompute cols/rows/values
    computeData: function() {
      this.isDataComputing = true

      // Start a task to avoid blocking the page
      clearInterval(this.computeDataInterval)
      this.computeDataInterval = setTimeout(() => {
        const rows = []
        const cols = []
        const valuesHashTable = new HashTable()

        this.data.forEach(item => {
          // Update rows/cols
          const rowKey = {}
          this.rowFields.forEach((field, index) => {
            rowKey[`row-${index}`] = field.getter(item)
          })

          if (!rows.some(row => {
            return this.rowFields.every((rowField, index) => row[`row-${index}`] === rowKey[`row-${index}`])
          })) {
            rows.push(rowKey)
          }

          const colKey = {}
          this.colFields.forEach((field, index) => {
            colKey[`col-${index}`] = field.getter(item)
          })

          if (!cols.some(col => {
            return this.colFields.every((colField, index) => col[`col-${index}`] === colKey[`col-${index}`])
          })) {
            cols.push(colKey)
          }

          // Update valuesHashTable
          const key = { ...rowKey, ...colKey }

          const previousValue = valuesHashTable.get(key) || 0

          valuesHashTable.set(key, this.reducer(previousValue, item))
        })

        this.internalRowFields = this.rowFields
        this.internalColFields = this.colFields
        this.rows = rows
        this.cols = cols
        this.valuesHashTable = valuesHashTable
        this.isDataComputing = false
      }, 0)
    }
  },
  watch: {
    fields: function() {
      this.computeData()
    },
    data: function() {
      this.computeData()
    }
  },
  created: function() {
    this.computeData()
  }
}
</script>

<style scoped>
td {
  min-width: 100px;
}
</style>