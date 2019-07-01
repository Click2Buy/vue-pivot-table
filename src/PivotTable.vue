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

      <!-- Table header -->
      <thead>
        <tr v-for="(colField, colFieldIndex) in allColumns"
            :key="`head-${JSON.stringify(colField)}`"
            v-if="colField.showHeader === undefined || colField.showHeader">

          <!-- Top left dead zone -->
          <th v-if="colFieldIndex === firstColFieldHeaderIndex && rowHeaderSize > 0"
              :colspan="rowHeaderSize"
              :rowspan="colHeaderSize">
          </th>
          <!-- Column headers -->
          <th v-for="(col, colIndex) in sortedCols"
              :key="JSON.stringify(col)"
              :colspan="spanSize('col', sortedCols, colIndex, colFieldIndex)"
              v-if="spanSize('col', sortedCols, colIndex, colFieldIndex) !== 0">

            <slot v-if="colField.headerSlotName" :name="colField.headerSlotName" v-bind:value="col[`col-${colFieldIndex}`]">
              Missing slot <code>{{ colField.headerSlotName }}</code>
            </slot>

            <template v-else>
              {{ col[`col-${colFieldIndex}`] }}
            </template>

          </th>
          <!-- Top right dead zone -->
          <th v-if="colFieldIndex === firstColFieldHeaderIndex && rowFooterSize > 0"
              :colspan="rowFooterSize"
              :rowspan="colFooterSize">
          </th>
        </tr>
      </thead>

      <!-- Table body -->
      <tbody>
        <tr v-for="(row, rowIndex) in sortedRows" :key="JSON.stringify(row)">
          <!-- Row headers -->
          <th v-for="(rowField, rowFieldIndex) in rowFields"
              :key="`head-${JSON.stringify(rowField)}`"
              :rowspan="spanSize('row', sortedRows, rowIndex, rowFieldIndex)"
              v-if="(rowField.showHeader === undefined || rowField.showHeader) && spanSize('row', sortedRows, rowIndex, rowFieldIndex) !== 0">

            <slot v-if="rowField.headerSlotName" :name="rowField.headerSlotName" v-bind:value="row[`row-${rowFieldIndex}`]">
              Missing slot <code>{{ rowField.headerSlotName }}</code>
            </slot>

            <template v-else>
              {{ row[`row-${rowFieldIndex}`] }}
            </template>

          </th>
          <!-- Values -->
          <td
            v-for="col in sortedCols"
            :key="JSON.stringify(col)"
            class="text-right"
          >
            <slot v-if="$scopedSlots.value" name="value" v-bind:value="value(row, col)"/>
            <template v-else>{{ value(row, col) }}</template>
          </td>
          <!-- Row footers (if slots are provided) -->
          <th
            v-for="(rowField, rowFieldIndex) in rowFieldsReverse"
            :key="`foot-${JSON.stringify(rowField)}`"
            :rowspan="spanSize('row', rows, rowIndex, rowFields.length - rowFieldIndex - 1)"
            v-if="rowField.showFooter && spanSize('row', rows, rowIndex, rowFields.length - rowFieldIndex - 1) !== 0"
          >
            <slot v-if="rowField.footerSlotName" :name="rowField.footerSlotName" v-bind:value="row[`row-${rowFields.length - rowFieldIndex - 1}`]">
              Missing slot <code>{{ rowField.footerSlotName }}</code>
            </slot>
            <template v-else>
              {{ row[`row-${rowFields.length - rowFieldIndex - 1}`] }}
            </template>
          </th>
        </tr>
      </tbody>

      <!-- Table footer -->
      <tfoot>
        <tr
          v-for="(colField, colFieldIndex) in colFieldsReverse"
          :key="`foot-${JSON.stringify(colField)}`"
          v-if="colField.showFooter">
          <!-- Bottom left dead zone -->
          <th
            v-if="colFieldIndex === firstColFieldFooterIndex && rowHeaderSize > 0"
            :colspan="rowHeaderSize"
            :rowspan="colHeaderSize"></th>
          <!-- Column footers -->
          <th
            v-for="(col, colIndex) in sortedCols"
            :key="JSON.stringify(col)"
            :colspan="spanSize('col', sortedCols, colIndex, colFields.length - colFieldIndex - 1)"
            v-if="spanSize('col', sortedCols, colIndex, colFields.length - colFieldIndex - 1) !== 0">
            <slot v-if="colField.footerSlotName" :name="colField.footerSlotName" v-bind:value="col[`col-${colFields.length - colFieldIndex - 1}`]">
              Missing slot <code>{{ colField.footerSlotName }}</code>
            </slot>
            <template v-else>
              {{ col[`col-${colFields.length - colFieldIndex - 1}`] }}
            </template>
          </th>
          <!-- Bottom right dead zone -->
          <th
            v-if="colFieldIndex === firstColFieldFooterIndex && rowFooterSize > 0"
            :colspan="rowFooterSize"
            :rowspan="colFooterSize"
          ></th>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import HashTable from './HashTable'
import {firstBy} from 'thenby'
import naturalSort from 'javascript-natural-sort'

export default {
  props: ['data', 'rowFields', 'colFields', 'valueFields', 'noDataWarningText', 'hideEmpty'],
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
    valueFields: {
      type: Array,
      default: () => [],
    },
    noDataWarningText: {
      type: String,
      default: 'No data to display.'
    },
    isDataLoading: {
      type: Boolean,
      default: false
    },
    hideEmpty: {
      type: Boolean,
      default: false
    },
  },
  data: function () {
    return {
      valuesHashTable: null,
      cols: null,
      rows: null
    }
  },
  computed: {
    allColumns: function () {
      return this.colFields.concat([{'reducer': 'reducer'}]);
    },
    // Sort cols/rows using a composed function built with thenBy.js
    sortedCols: function () {
      let composedSortFunction
      this.colFields.forEach((colField, colFieldIndex) => {
        if (colFieldIndex === 0) {
          composedSortFunction = firstBy('col-0', {cmp: colField.sort || naturalSort})
        } else {
          composedSortFunction = composedSortFunction.thenBy(`col-${colFieldIndex}`, {cmp: colField.sort || naturalSort})
        }
      })

      return [...this.cols].sort(composedSortFunction)
    },
    sortedRows: function () {
      let composedSortFunction
      this.rowFields.forEach((rowField, rowFieldIndex) => {
        if (rowFieldIndex === 0) {
          composedSortFunction = firstBy('row-0', {cmp: rowField.sort || naturalSort})
        } else {
          composedSortFunction = composedSortFunction.thenBy(`row-${rowFieldIndex}`, {cmp: rowField.sort || naturalSort})
        }
      })

      return [...this.rows].sort(composedSortFunction)
    },
    // Compound property for watch single callback
    fields: function () {
      return [this.colFields, this.rowFields]
    },
    // Reversed props for footer iterators
    colFieldsReverse: function () {
      return this.colFields.slice().reverse()
    },
    rowFieldsReverse: function () {
      return this.rowFields.slice().reverse()
    },
    // Number of col header rows (+1 for reducer title)
    colHeaderSize: function () {
      return this.colFields.filter(colField => colField.showHeader === undefined || colField.showHeader).length + 1
    },
    // Number of col footer rows
    colFooterSize: function () {
      return this.colFields.filter(colField => colField.showFooter).length
    },
    // Number of row header columns
    rowHeaderSize: function () {
      return this.rowFields.filter(rowField => rowField.showHeader === undefined || rowField.showHeader).length
    },
    // Number of row footer columns
    rowFooterSize: function () {
      return this.rowFields.filter(rowField => rowField.showFooter).length
    },
    // Index of the first column field header to show - used for table header dead zones
    firstColFieldHeaderIndex: function () {
      return 0;
      //return this.colFields.findIndex(colField => colField.showHeader === undefined || colField.showHeader)
    },
    // Index of the first column field footer to show - used for table footer dead zones
    firstColFieldFooterIndex: function () {
      return this.colFieldsReverse.findIndex(colField => colField.showFooter)
    }
  },
  methods: {
    // Get value from valuesHashTable
    value: function (row, col) {
      return this.valuesHashTable.get({...row, ...col}) || 0
    },
    // Get colspan/rowspan size
    spanSize: function (type, values, valueIndex, fieldIndex) {
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
    computeData: function () {
      const cols = [];
      const rows = [];
      const valuesHashTable = new HashTable();

      this.data.forEach(item => {
        this.valueFields.forEach(valueField => {
          // Update cols/rows
          let hide = false;

          const colKey = {};
          this.colFields.forEach((field, index) => {
            let i = field.getter(item);
            colKey[`col-${index}`] = i;
            if(i == null)
              hide = true;
          });

          if(hide && this.hideEmpty)
            return;

          const valueTitle = `${valueField.title}(${valueField.label})`;

          colKey[`col-${this.colFields.length}`] = valueTitle;

          if (!cols.some(col => {
            return this.colFields.every((colField, index) => col[`col-${index}`] === colKey[`col-${index}`]) && col[`col-${this.colFields.length}`] === valueTitle;
          })) {
            cols.push(colKey);
          }

          const rowKey = {};
          this.rowFields.forEach((field, index) => {
            let i = field.getter(item);
            rowKey[`row-${index}`] = i;
            if(i == null)
              hide = true;
          });
          if(hide && this.hideEmpty)
            return;


          if (!rows.some(row => {
            return this.rowFields.every((rowField, index) => row[`row-${index}`] === rowKey[`row-${index}`])
          })) {
            rows.push(rowKey)
          }

          // Update valuesHashTable
          const key = {...colKey, ...rowKey};

          const previousValue = valuesHashTable.get(key) || null;

          if (valueField.aggregate == null || valueField.aggregate.function == null) {
            if (valueField.type != null) {
              if (valueField.type === 'count') {
                if (valueField.aggregate == null)
                  valueField.aggregate = {};

                if (valueField.aggregate.function == null) {
                  valueField.aggregate.function = function (oldValue, item) {
                    if (item == null)
                      return oldValue;

                    return (oldValue || 0) + 1;
                  }
                }
              } else if (valueField.type === 'sum') {
                if (valueField.aggregate == null)
                  valueField.aggregate = {};

                if (valueField.aggregate.function == null) {
                  valueField.aggregate.function = function (oldValue, item) {
                    if (item == null)
                      return oldValue;

                    return (oldValue || 0) + valueField.getter(item);
                  }
                }
              } else if (valueField.type === 'min') {
                if (valueField.aggregate == null)
                  valueField.aggregate = {};

                if (valueField.aggregate.function == null) {
                  valueField.aggregate.function = function (oldValue, item) {
                    if (item == null)
                      return oldValue;

                    if (oldValue == null || oldValue > valueField.getter(item))
                      return valueField.getter(item);

                    return oldValue;
                  }
                }
              } else if (valueField.type === 'max') {
                if (valueField.aggregate == null)
                  valueField.aggregate = {};

                if (valueField.aggregate.function == null) {
                  valueField.aggregate.function = function (oldValue, item) {
                    if (item == null)
                      return oldValue;

                    if (oldValue == null || oldValue < valueField.getter(item))
                      return valueField.getter(item);

                    return oldValue;
                  }
                }
              }
            }
          }

          const value = valueField.aggregate.function(previousValue, item);
          if (value != null)
            valuesHashTable.set(key, value);
        });
      });

      this.cols = cols;
      this.rows = rows;
      this.valuesHashTable = valuesHashTable;
    }
  },
  watch: {
    fields: function () {
      this.computeData()
    },
    data: function () {
      this.computeData()
    },
    valueFields: function () {
      this.computeData();
    },
    hideEmpty(){
      this.computeData();
    }
  },
  created: function () {
    this.computeData()
  }
}
</script>

<style scoped>
td {
  min-width: 100px;
}
</style>
