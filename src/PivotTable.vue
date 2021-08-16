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
          <div
            class="position-absolute w-100 h-100 text-center"
            style="z-index: 1;"
          >
            <div
              class="position-sticky d-inline-block mt-5 p-3"
              style="top: 0;"
            >
              Loading table values...
            </div>
          </div>
        </slot>
      </template>

      <div
        v-if="data.length === 0 || (rows.length === 0 && cols.length === 0)"
        class="alert alert-warning"
        role="alert"
      >
        {{ noDataWarningText }}
      </div>

      <div v-else-if="cols.length && rows.length" class="table-responsive">
        <table
          class="table table-bordered"
          :aria-busy="isDataLoading || isDataComputing"
        >
          <!-- Table header -->
          <thead>
            <template
              v-for="(colField, colFieldIndex) in internalColFields"
              v-if="colField.showHeader === undefined || colField.showHeader"
            >
              <!-- Multiple slots -->
              <template v-if="colField.headerSlotNames">
                <tr
                  v-for="(headerSlotName,
                  headerSlotNameIndex) in colField.headerSlotNames"
                >
                  <!-- Top left dead zone -->
                  <th
                    v-if="
                      colFieldIndex === firstColFieldHeaderIndex &&
                        rowHeaderSize > 0 &&
                        headerSlotNameIndex === 0
                    "
                    :colspan="rowHeaderSize"
                    :rowspan="colHeaderSize"
                  ></th>
                  <!-- Column headers -->
                  <th
                    v-for="(col, colIndex) in sortedCols"
                    :key="JSON.stringify(col)"
                    :colspan="spanSize(sortedCols, colIndex, colFieldIndex)"
                    v-if="spanSize(sortedCols, colIndex, colFieldIndex) !== 0"
                  >
                    <slot
                      :name="headerSlotName"
                      v-bind:value="col[colFieldIndex]"
                    >
                      Missing slot <code>{{ headerSlotName }}</code>
                    </slot>
                  </th>
                  <!-- Top right dead zone -->
                  <th
                    v-if="
                      colFieldIndex === firstColFieldHeaderIndex &&
                        rowFooterSize > 0 &&
                        headerSlotNameIndex === 0
                    "
                    :colspan="rowFooterSize"
                    :rowspan="colFooterSize"
                  ></th>
                  <td v-if="colFieldIndex === internalColFields.length - 1">
                    Total
                  </td>
                </tr>
              </template>
              <!-- Single slot/no slot -->
              <tr v-else>
                <!-- Top left dead zone -->
                <th
                  v-if="
                    colFieldIndex === firstColFieldHeaderIndex &&
                      rowHeaderSize > 0
                  "
                  :colspan="rowHeaderSize"
                  :rowspan="colHeaderSize"
                ></th>
                <!-- Column headers -->
                <th
                  v-for="(col, colIndex) in sortedCols"
                  :key="JSON.stringify(col)"
                  :colspan="spanSize(sortedCols, colIndex, colFieldIndex)"
                  v-if="spanSize(sortedCols, colIndex, colFieldIndex) !== 0"
                >
                  <slot
                    v-if="colField.headerSlotName"
                    :name="colField.headerSlotName"
                    v-bind:value="col[colFieldIndex]"
                  >
                    Missing slot <code>{{ colField.headerSlotName }}</code>
                  </slot>
                  <template v-else>
                    {{ col[colFieldIndex] }}
                  </template>
                </th>
                <!-- Top right dead zone -->
                <th
                  v-if="
                    colFieldIndex === firstColFieldHeaderIndex &&
                      rowFooterSize > 0
                  "
                  :colspan="rowFooterSize"
                  :rowspan="colFooterSize"
                ></th>
                <td v-if="colFieldIndex === internalColFields.length - 1">
                  Total
                </td>
              </tr>
            </template>
          </thead>

          <!-- Table body -->
          <tbody>
            <tr
              v-for="(row, rowIndex) in sortedRows"
              :key="JSON.stringify(row)"
            >
              <!-- Row headers -->
              <template
                v-for="(rowField, rowFieldIndex) in internalRowFields"
                v-if="
                  (rowField.showHeader === undefined || rowField.showHeader) &&
                    spanSize(sortedRows, rowIndex, rowFieldIndex) !== 0
                "
              >
                <!-- Multiple slots -->
                <template v-if="rowField.headerSlotNames">
                  <th
                    v-for="headerSlotName in rowField.headerSlotNames"
                    :rowspan="spanSize(sortedRows, rowIndex, rowFieldIndex)"
                  >
                    <slot
                      :name="headerSlotName"
                      v-bind:value="row[rowFieldIndex]"
                    >
                      Missing slot <code>{{ headerSlotName }}</code>
                    </slot>
                  </th>
                </template>
                <!-- Single slot/no slot -->
                <th
                  v-else
                  :rowspan="spanSize(sortedRows, rowIndex, rowFieldIndex)"
                >
                  <slot
                    v-if="rowField.headerSlotName"
                    :name="rowField.headerSlotName"
                    v-bind:value="row[rowFieldIndex]"
                  >
                    Missing slot <code>{{ rowField.headerSlotName }}</code>
                  </slot>
                  <template v-else>
                    {{ row[rowFieldIndex] }}
                  </template>
                </th>
              </template>
              <!-- Values -->
              <td
                v-for="col in sortedCols"
                :key="JSON.stringify(col)"
                class="text-right"
              >
                <slot
                  v-if="$scopedSlots.value"
                  name="value"
                  :value="value(row, col)"
                  :row="Object.values(row)"
                  :col="Object.values(col)"
                />
                <template v-else>{{ value(row, col) }}</template>
              </td>
              <td v-if="internalColFields.length != 0" class="text-right">
                {{ rowSum(row) }}
              </td>
              <!-- Row footers (if slots are provided) -->
              <template
                v-for="(rowField, rowFieldIndex) in internalRowFieldsReverse"
                v-if="
                  rowField.showFooter &&
                    spanSize(
                      rows,
                      rowIndex,
                      internalRowFields.length - rowFieldIndex - 1
                    ) !== 0
                "
              >
                <!-- Multiple slots -->
                <template v-if="rowField.footerSlotNames">
                  <th
                    v-for="footerSlotName in rowField.footerSlotNames"
                    :rowspan="
                      spanSize(
                        rows,
                        rowIndex,
                        internalRowFields.length - rowFieldIndex - 1
                      )
                    "
                  >
                    <slot
                      :name="footerSlotName"
                      v-bind:value="
                        row[internalRowFields.length - rowFieldIndex - 1]
                      "
                    >
                      Missing slot <code>{{ footerSlotName }}</code>
                    </slot>
                  </th>
                </template>
                <!-- Single slot/no slot -->
                <th
                  v-else
                  :rowspan="
                    spanSize(
                      rows,
                      rowIndex,
                      internalRowFields.length - rowFieldIndex - 1
                    )
                  "
                >
                  <slot
                    v-if="rowField.footerSlotName"
                    :name="rowField.footerSlotName"
                    v-bind:value="
                      row[internalRowFields.length - rowFieldIndex - 1]
                    "
                  >
                    Missing slot <code>{{ rowField.footerSlotName }}</code>
                  </slot>
                  <template v-else>
                    {{ row[internalRowFields.length - rowFieldIndex - 1] }}
                  </template>
                </th>
              </template>
            </tr>
            <!-- Modification: Adding total for each column -->
            <tr v-if="internalRowFields.length != 0">
              <td
                v-for="(rowField, rowFieldIndex) in internalRowFields"
                v-if="
                  (rowField.showHeader === undefined || rowField.showHeader) &&
                    spanSize(sortedRows, rowIndex, rowFieldIndex) !== 0 &&
                    rowFieldIndex != internalRowFields.length - 1
                "
              ></td>
              <td v-if="internalRowFields.length != 0">Total</td>
              <td
                v-for="col in sortedCols"
                :key="`${JSON.stringify(col)}total`"
                class="text-right"
              >
                {{ colSum(col) }}
              </td>
              <td
                v-if="
                  internalRowFields.length != 0 && internalColFields.length != 0
                "
                class="text-right"
              >
                {{ totalSum() }}
              </td>
            </tr>
          </tbody>

          <!-- Table footer -->
          <tfoot>
            <template
              v-for="(colField, colFieldIndex) in internalColFieldsReverse"
              v-if="colField.showFooter"
            >
              <!-- Multiple slots -->
              <template v-if="colField.footerSlotNames">
                <tr
                  v-for="(footerSlotName,
                  footerSlotNameIndex) in colField.footerSlotNames"
                >
                  <!-- Bottom left dead zone -->
                  <th
                    v-if="
                      colFieldIndex === firstColFieldFooterIndex &&
                        rowHeaderSize > 0 &&
                        footerSlotNameIndex === 0
                    "
                    :colspan="rowHeaderSize"
                    :rowspan="colHeaderSize"
                  ></th>
                  <!-- Column footers -->
                  <th
                    v-for="(col, colIndex) in sortedCols"
                    :key="JSON.stringify(col)"
                    :colspan="
                      spanSize(
                        sortedCols,
                        colIndex,
                        internalColFields.length - colFieldIndex - 1
                      )
                    "
                    v-if="
                      spanSize(
                        sortedCols,
                        colIndex,
                        internalColFields.length - colFieldIndex - 1
                      ) !== 0
                    "
                  >
                    <slot
                      :name="footerSlotName"
                      v-bind:value="
                        col[internalColFields.length - colFieldIndex - 1]
                      "
                    >
                      Missing slot <code>{{ footerSlotName }}</code>
                    </slot>
                  </th>
                  <!-- Bottom right dead zone -->
                  <th
                    v-if="
                      colFieldIndex === firstColFieldFooterIndex &&
                        rowFooterSize > 0 &&
                        footerSlotNameIndex === 0
                    "
                    :colspan="rowFooterSize"
                    :rowspan="colFooterSize"
                  ></th>
                </tr>
              </template>
              <!-- Single slot/no slot -->
              <tr v-else>
                <!-- Bottom left dead zone -->
                <th
                  v-if="
                    colFieldIndex === firstColFieldFooterIndex &&
                      rowHeaderSize > 0
                  "
                  :colspan="rowHeaderSize"
                  :rowspan="colHeaderSize"
                ></th>
                <!-- Column footers -->
                <th
                  v-for="(col, colIndex) in sortedCols"
                  :key="JSON.stringify(col)"
                  :colspan="
                    spanSize(
                      sortedCols,
                      colIndex,
                      internalColFields.length - colFieldIndex - 1
                    )
                  "
                  v-if="
                    spanSize(
                      sortedCols,
                      colIndex,
                      internalColFields.length - colFieldIndex - 1
                    ) !== 0
                  "
                >
                  <slot
                    v-if="colField.footerSlotName"
                    :name="colField.footerSlotName"
                    v-bind:value="
                      col[internalColFields.length - colFieldIndex - 1]
                    "
                  >
                    Missing slot <code>{{ colField.footerSlotName }}</code>
                  </slot>
                  <template v-else>
                    {{ col[internalColFields.length - colFieldIndex - 1] }}
                  </template>
                </th>
                <!-- Bottom right dead zone -->
                <th
                  v-if="
                    colFieldIndex === firstColFieldFooterIndex &&
                      rowFooterSize > 0
                  "
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
import HashTable from "./HashTable";
import { firstBy } from "thenby";
import naturalSort from "javascript-natural-sort";
import { cloneDeep, isEqual } from "lodash";

export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    rowFields: {
      type: Array,
      default: () => []
    },
    colFields: {
      type: Array,
      default: () => []
    },
    reducer: {
      type: Function,
      default: (sum, item) => sum + 1
    },
    noDataWarningText: {
      type: String,
      default: "No data to display."
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
      // Note: we don't use directly rowFields/colFields props to trigger table render when `updateValues` has finished
      internalRowFields: [],
      internalColFields: [],
      isDataComputing: false,
      computingInterval: null,
      columnTotals: [],
      rowTotals: [],
      grandTotal: 0
    };
  },
  computed: {
    // Sort rows/cols using a composed function built with thenBy.js
    sortedRows: function() {
      let composedSortFunction;
      this.internalRowFields.forEach((rowField, rowFieldIndex) => {
        if (rowFieldIndex === 0) {
          composedSortFunction = firstBy(0, {
            cmp: rowField.sort || naturalSort
          });
        } else {
          composedSortFunction = composedSortFunction.thenBy(rowFieldIndex, {
            cmp: rowField.sort || naturalSort
          });
        }
      });

      return [...this.rows].sort(composedSortFunction);
    },
    sortedCols: function() {
      let composedSortFunction;
      this.internalColFields.forEach((colField, colFieldIndex) => {
        if (colFieldIndex === 0) {
          composedSortFunction = firstBy(0, {
            cmp: colField.sort || naturalSort
          });
        } else {
          composedSortFunction = composedSortFunction.thenBy(colFieldIndex, {
            cmp: colField.sort || naturalSort
          });
        }
      });

      return [...this.cols].sort(composedSortFunction);
    },
    // Property to watch specific field changes
    fields: function() {
      return [
        [this.colFields, this.rowFields],
        [
          this.colFields.map(field => field.headerSlotNames),
          this.rowFields.map(field => field.headerSlotNames)
        ],
        [
          this.colFields.map(field => field.valuesFiltered),
          this.rowFields.map(field => field.valuesFiltered)
        ]
      ];
    },
    // Reversed props for footer iterators
    internalRowFieldsReverse: function() {
      return this.internalRowFields.slice().reverse();
    },
    internalColFieldsReverse: function() {
      return this.internalColFields.slice().reverse();
    },
    // Number of row header columns
    rowHeaderSize: function() {
      return this.internalRowFields.reduce((acc, rowField) => {
        if (rowField.showHeader === undefined || rowField.showHeader) {
          if (rowField.headerSlotNames)
            return acc + rowField.headerSlotNames.length;
          else return acc + 1;
        } else return acc;
      }, 0);
    },
    // Number of row footer columns
    rowFooterSize: function() {
      return this.internalRowFields.reduce((acc, rowField) => {
        if (rowField.showFooter) {
          if (rowField.footerSlotNames)
            return acc + rowField.footerSlotNames.length;
          else return acc + 1;
        } else return acc;
      }, 0);
    },
    // Number of col header rows
    colHeaderSize: function() {
      return this.internalColFields.reduce((acc, colField) => {
        if (colField.showHeader === undefined || colField.showHeader) {
          if (colField.headerSlotNames)
            return acc + colField.headerSlotNames.length;
          else return acc + 1;
        } else return acc;
      }, 0);
    },
    // Number of col footer rows
    colFooterSize: function() {
      return this.internalColFields.reduce((acc, colField) => {
        if (colField.showFooter) {
          if (colField.footerSlotNames)
            return acc + colField.footerSlotNames.length;
          else return acc + 1;
        } else return acc;
      }, 0);
    },
    // Index of the first column field header to show - used for table header dead zones
    firstColFieldHeaderIndex: function() {
      return this.internalColFields.findIndex(
        colField => colField.showHeader === undefined || colField.showHeader
      );
    },
    // Index of the first column field footer to show - used for table footer dead zones
    firstColFieldFooterIndex: function() {
      return this.internalColFieldsReverse.findIndex(
        colField => colField.showFooter
      );
    }
  },
  methods: {
    // Get column sum from valuesHashTable
    colSum: function(col) {
      var sum = 0;
      this.sortedRows.map(row => {
        sum += this.value(Object.values(row), Object.values(col));
      });

      return this.numberWithCommas(sum);
    },
    // Get row sum from valuesHashTable
    rowSum: function(row) {
      var sum = 0;
      this.sortedCols.map(col => {
        sum += this.value(Object.values(row), Object.values(col));
      });

      return this.numberWithCommas(sum);
    },
    totalSum: function() {
      var sum = 0;
      this.sortedCols.map(col => {
        this.sortedRows.map(row => {
          sum += this.value(Object.values(row), Object.values(col));
        });
      });

      return this.numberWithCommas(sum);
    },
    numberWithCommas: function(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    // Get value from valuesHashTable
    value: function(row, col) {
      return this.valuesHashTable.get([...row, ...col]) || 0;
    },
    // Get colspan/rowspan size
    spanSize: function(values, valueIndex, fieldIndex) {
      // If left value === current value
      // and top value === 0 (= still in the same top bracket)
      // The left td will take care of the display
      if (
        valueIndex > 0 &&
        values[valueIndex - 1][fieldIndex] === values[valueIndex][fieldIndex] &&
        (fieldIndex === 0 ||
          this.spanSize(values, valueIndex, fieldIndex - 1) === 0)
      ) {
        return 0;
      }

      // Otherwise, count entries on the right with the same value
      // But stop if the top value !== 0 (= the top bracket has changed)
      let size = 1;
      let i = valueIndex;
      while (
        i + 1 < values.length &&
        values[i + 1][fieldIndex] === values[i][fieldIndex] &&
        (fieldIndex === 0 ||
          (i + 1 < values.length &&
            this.spanSize(values, i + 1, fieldIndex - 1) === 0))
      ) {
        i++;
        size++;
      }

      return size;
    },
    // Update rows/cols/valuesHashTable (optional)
    // @param {boolean} updateValuesHashTable
    updateValues: function(updateValuesHashTable = true) {
      this.isDataComputing = true;

      // Start a task to avoid blocking the page
      clearInterval(this.computingInterval);
      this.computingInterval = setTimeout(() => {
        const rows = [];
        const cols = [];
        const valuesHashTable = new HashTable();

        const fields = [...this.rowFields, ...this.colFields];

        this.data.forEach(item => {
          const rowKey = [];
          const colKey = [];
          let filtered = false;

          // Check if item passes fields value filters
          for (let field of fields) {
            if (
              field.valuesFiltered &&
              !field.valuesFiltered.has(field.getter(item))
            ) {
              filtered = true;
              break;
            }
          }

          // Build item rowKey/colKey if necessary
          if (!filtered || updateValuesHashTable) {
            this.rowFields.forEach(field => {
              rowKey.push(field.getter(item));
            });

            this.colFields.forEach(field => {
              colKey.push(field.getter(item));
            });
          }

          // Update rows/cols
          if (!filtered) {
            if (
              !rows.some(row => {
                return this.rowFields.every(
                  (rowField, index) => row[index] === rowKey[index]
                );
              })
            ) {
              rows.push(rowKey);
            }

            if (
              !cols.some(col => {
                return this.colFields.every(
                  (colField, index) => col[index] === colKey[index]
                );
              })
            ) {
              cols.push(colKey);
            }
          }

          // Update valuesHashTable
          if (updateValuesHashTable) {
            const key = [...rowKey, ...colKey];

            const previousValue = valuesHashTable.get(key) || 0;

            valuesHashTable.set(key, this.reducer(previousValue, item));
          }
        });

        this.rows = rows;
        this.cols = cols;
        if (updateValuesHashTable) this.valuesHashTable = valuesHashTable;
        this.isDataComputing = false;
        this.updateInternalFields();
        console.log(this.valuesHashTable);
      }, 0);
    },
    // Update internal fields only
    updateInternalFields: function() {
      this.internalRowFields = cloneDeep(this.rowFields);
      this.internalColFields = cloneDeep(this.colFields);
    }
  },
  watch: {
    // Check if fields changed
    fields: function(val, oldVal) {
      if (!isEqual(val[0], oldVal[0])) {
        // Fields were moved
        this.updateValues();
      } else if (!isEqual(val[1], oldVal[1])) {
        // Field header value filters changed
        this.updateInternalFields();
      } else if (!isEqual(val[2], oldVal[2])) {
        // Field header slot names changed
        this.updateValues(false);
      }
    },
    data: function() {
      this.updateValues();
    }
  },
  created: function() {
    this.updateValues();
  }
};
</script>

<style scoped>
td {
  min-width: 100px;
}
</style>
