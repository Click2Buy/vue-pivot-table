<template>
  <div>
    <!-- Top row -->
    <div v-if="showSettings" class="d-flex flex-nowrap gutter mb-3">
      <div class="left-col">
        <button class="btn btn-primary" @click="toggleShowSettings">
          {{ hideSettingsText }}
        </button>
      </div>

      <!-- Available fields -->
      <div class="flex-fill drag-area" :class="dragAreaClass">
        <div class="drag-area-title mb-3">{{ availableFieldsLabelText }}</div>
        <draggable
          v-model="internal.availableFieldKeys"
          class="d-flex flex-row gutter-sm drag-area-zone"
          group="fields"
          @start="start"
          @end="end">
          <div v-for="key in internal.availableFieldKeys" :key="key" class="field">
            <field-label :field="fieldFromKey(key)" variant="secondary" />
          </div>
        </draggable>
      </div>
    </div>

    <div v-else class="mb-3">
      <button class="btn btn-primary" @click="toggleShowSettings">
        {{ showSettingsText }}
      </button>
    </div>

    <div class="d-flex gutter mb-3" v-if="showSettings">
      <!-- Top left zone - TODO: renderer select menu -->
      <div class="left-col"></div>

      <!-- Column fields -->
      <div class="flex-fill drag-area border-primary" :class="dragAreaClass">
        <div class="drag-area-title mb-3">{{ colsLabelText }}</div>
        <draggable
          v-model="internal.colFieldKeys"
          class="d-flex flex-row gutter-sm drag-area-zone"
          group="fields"
          @start="start"
          @end="end">
          <div v-for="key in internal.colFieldKeys" :key="key" class="field">
            <field-label :field="fieldFromKey(key)">
              <!-- pass down scoped slots -->
              <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope"><slot :name="slot" v-bind="scope"/></template>
            </field-label>
          </div>
        </draggable>
      </div>
    </div>

    <div class="d-flex flex-nowrap gutter">
      <!-- Row fields -->
      <div v-if="showSettings" class="left-col">
        <div class="drag-area border-primary" :class="dragAreaClass">
          <div class="drag-area-title mb-3">{{ rowsLabelText }}</div>
          <draggable
            v-model="internal.rowFieldKeys"
            class="d-flex flex-column align-items-start gutter-sm drag-area-zone"
            group="fields"
            @start="start"
            @end="end">
            <div v-for="key in internal.rowFieldKeys" :key="key" class="field">
              <field-label :field="fieldFromKey(key)">
                <!-- pass down scoped slots -->
                <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope"><slot :name="slot" v-bind="scope"/></template>
              </field-label>
            </div>
          </draggable>
        </div>
      </div>

      <!-- Table -->
      <div class="flex-fill" :style="tableWrapperStyle">
        <pivot-table :data="filteredData" :row-fields="rowFields" :col-fields="colFields" :reducer="reducer" :no-data-warning-text="noDataWarningText" :is-data-loading="isDataLoading">
          <!-- pass down scoped slots -->
          <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope"><slot :name="slot" v-bind="scope"/></template>
        </pivot-table>
      </div>
    </div>
  </div>
</template>

<script>
import FieldLabel from './FieldLabel.vue'
import PivotTable from './PivotTable.vue'
import Draggable from 'vuedraggable'
import naturalSort from 'javascript-natural-sort'

export default {
  name: 'vue-pivot',
  components: { FieldLabel, PivotTable, Draggable },
  props: {
    data: {
      type: Array,
      default: []
    },
    fields: {
      type: Array,
      default: []
    },
    availableFieldKeys: {
      type: Array,
      default: []
    },
    rowFieldKeys: {
      type: Array,
      default: []
    },
    colFieldKeys: {
      type: Array,
      default: []
    },
    reducer: {
      type: Function,
      default: (sum, item) => sum + 1
    },
    defaultShowSettings: {
      type: Boolean,
      default: true
    },
    availableFieldsLabelText: {
      type: String,
      default: 'Available fields'
    },
    colsLabelText: {
      type: String,
      default: 'Columns'
    },
    rowsLabelText: {
      type: String,
      default: 'Rows'
    },
    hideSettingsText: {
      type: String,
      default: 'Hide settings'
    },
    showSettingsText: {
      type: String,
      default: 'Show settings'
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
    const fields = this.fields
    const valueFilterableFields = fields.filter(field => field.valueFilter)

    // If at least one field has valueFilter, get values from data
    if (valueFilterableFields.length > 0) {
      // Create new set for each field with value filter
      valueFilterableFields.forEach(field => {
        field.valuesSet = new Set()
      })

      // Iterate on data once
      this.data.forEach(item => {
        valueFilterableFields.forEach(field => {
          field.valuesSet.add(field.getter(item))
        })
      })

      // Create object with checked boolean for each value
      valueFilterableFields.forEach(field => {
        const values = []
        Array.from(field.valuesSet).sort(field.sort || naturalSort).forEach(value => {
          values.push({ label: value, checked: true })
        })

        this.$set(field, 'values', values)
      })
    }

    return {
      internal: {
        fields,
        availableFieldKeys: this.availableFieldKeys,
        rowFieldKeys: this.rowFieldKeys,
        colFieldKeys: this.colFieldKeys
      },
      dragging: false,
      showSettings: true
    }
  },
  computed: {
    // Pivot table props from Pivot props & data
    rowFields: function() {
      const rowFields = []

      this.internal.rowFieldKeys.forEach(key => {
        const field = this.fields.find(field => field.key === key)

        if (field.headers) {
          field.headerSlotNames = field.headers
            .filter(header => header.checked)
            .map(header => header.slotName)
        }

        rowFields.push(field)
      })

      return rowFields
    },
    colFields: function() {
      const colFields = []

      this.internal.colFieldKeys.forEach(key => {
        const field = this.fields.find(field => field.key === key)

        if (field.headers) {
          field.headerSlotNames = field.headers
            .filter(header => header.checked)
            .map(header => header.slotName)
        }

        colFields.push(field)
      })

      return colFields
    },
    filteredData: function() {
      return this.data.filter(item => {
        // Remove items with unchecked values from value filters
        let remove = false

        // TODO: optimize this (stop loop when found? build shared Sets before?)
        this.internal.fields.forEach(field => {
          if (field.valueFilter) {
            const selectedValuesSet = new Set()
            field.values.forEach(value => {
              if (value.checked) {
                selectedValuesSet.add(value.label)
              }
            })
            if (!selectedValuesSet.has(field.getter(item))) {
              remove = true
            }
          }
        })

        return !remove
      })
    },
    // Drag area class
    dragAreaClass: function() {
      return this.dragging ? 'drag-area-highlight' : null
    },
    // Table wrapper style
    tableWrapperStyle: function() {
      const maxWidth = this.showSettings ? 'calc(100% - 200px - 2rem)' : '100%'
      return `max-width: ${maxWidth};`
    }
  },
  methods: {
    // Get a field from its key
    fieldFromKey: function(key) {
      return this.internal.fields.find(field => field.key === key)
    },
    // Toggle settings
    toggleShowSettings: function() {
      this.showSettings = !this.showSettings
    },
    // Update dragging boolean
    start: function() {
      this.dragging = true
    },
    end: function() {
      this.dragging = false
    }
  },
  created: function() {
    // TODO: check if field keys are correctly set/without duplicates
    this.showSettings = this.defaultShowSettings
  }
}
</script>

<style lang="scss" scoped>
/* Left column width */
.left-col {
  min-width: 200px;
  max-width: 200px;
}

/* Grid with gutter */
.gutter, .gutter-y {
  margin-top: -1rem;

  > * {
    margin-top: 1rem;
  }
}
.gutter-x, .gutter {
  margin-left: -1rem;
  > * {
    margin-left: 1rem;
  }
}

.gutter-sm, .gutter-y-sm {
  margin-top: -.5rem;

  > * {
    margin-top: .5rem;
  }
}
.gutter-x-sm, .gutter-sm {
  margin-left: -.5rem;
  > * {
    margin-left: .5rem;
  }
}

/* Drag & drop stuff */
.drag-area {
  border: 1px dashed #ccc;
  padding: 0.75rem;
  transition: background-color 0.4s;

  .drag-area-title {
    line-height: 1;
  }

  .drag-area-zone {
    min-width: 10rem;
    min-height: 46px;
  }
}

.drag-area-highlight {
  background-color: #f3f3f3;
}

.sortable-ghost {
  opacity: 0.4;
}

.field {
  position: relative;
}
</style>
