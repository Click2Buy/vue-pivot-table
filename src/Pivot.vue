<template>
  <div>
    <!-- Top row -->
    <div v-if="showSettings" class="row grid-x flex-nowrap mb-4">
      <div class="col left-col">
        <button class="btn btn-outline-primary" @click="toggleShowSettings">
          {{ hideSettingsText }}
        </button>
      </div>

      <!-- Disabled fields -->
      <div class="col">
        <div class="drag-area-label">{{ availableFieldsLabelText }}</div>
        <draggable v-model="internal.fields" class="d-flex flex-row drag-area flex-wrap" :class="dragAreaClass" :options="{ group: 'fields' }" @start="start" @end="end">
          <div v-for="field in internal.fields" :key="field.key">
            <div class="btn btn-draggable btn-secondary">
              <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 270 512" class="svg-inline--fa fa-grip-vertical fa-w-10"><path fill="currentColor" d="M64 208c26.5 0 48 21.5 48 48s-21.5 48-48 48-48-21.5-48-48 21.5-48 48-48zM16 104c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48zm0 304c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48z M204 208c26.5 0 48 21.5 48 48s-21.5 48 -48 48 -48 -21.5 -48 -48 21.5 -48 48 -48zM156 104c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48zm0 304c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48z" class=""></path></svg>
              {{ field.label }}
            </div>
          </div>
        </draggable>
      </div>
    </div>

    <div class="mb-4" v-else>
      <button class="btn btn-outline-primary" @click="toggleShowSettings">
        {{ showSettingsText }}
      </button>
    </div>

    <div class="row grid-x mb-4" v-if="showSettings">
      <!-- Top left zone - TODO: renderer select menu -->
      <div class="col left-col"></div>

      <!-- Horizontal fields -->
      <div class="col">
        <div class="drag-area-label">{{ colsLabelText }}</div>
        <draggable v-model="internal.colFields" :options="{ group: 'fields' }" @start="start" @end="end" class="d-flex flex-row drag-area border-primary" :class="dragAreaClass">
          <div v-for="field in internal.colFields" :key="field.key">
            <div class="btn btn-draggable btn-primary">
              <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 270 512" class="svg-inline--fa fa-grip-vertical fa-w-10"><path fill="currentColor" d="M64 208c26.5 0 48 21.5 48 48s-21.5 48-48 48-48-21.5-48-48 21.5-48 48-48zM16 104c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48zm0 304c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48z M204 208c26.5 0 48 21.5 48 48s-21.5 48 -48 48 -48 -21.5 -48 -48 21.5 -48 48 -48zM156 104c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48zm0 304c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48z" class=""></path></svg>
              {{ field.label }}
            </div>
          </div>
        </draggable>
      </div>
    </div>

    <div class="row flex-nowrap grid-x">
      <!-- Vertical fields -->
      <div class="col left-col" v-if="showSettings">
        <div class="drag-area-label">{{ rowsLabelText }}</div>
        <draggable v-model="internal.rowFields" :options="{ group: 'fields' }" @start="start" @end="end" class="d-flex flex-column align-items-start drag-area border-primary" :class="dragAreaClass">
          <div v-for="field in internal.rowFields" :key="field.key">
            <div class="btn btn-draggable btn-primary">
              <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 270 512" class="svg-inline--fa fa-grip-vertical fa-w-10"><path fill="currentColor" d="M64 208c26.5 0 48 21.5 48 48s-21.5 48-48 48-48-21.5-48-48 21.5-48 48-48zM16 104c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48zm0 304c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48z M204 208c26.5 0 48 21.5 48 48s-21.5 48 -48 48 -48 -21.5 -48 -48 21.5 -48 48 -48zM156 104c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48zm0 304c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48z" class=""></path></svg>
              {{ field.label }}
            </div>
          </div>
        </draggable>
      </div>

      <!-- Table -->
      <div class="col table-responsive">
        <pivot-table :data="data" :row-fields="internal.rowFields" :col-fields="internal.colFields" :reducer="reducer" :no-data-warning-text="noDataWarningText" :is-data-loading="isDataLoading">
          <!-- pass down scoped slots -->
          <template v-for="(slot, slotName) in $scopedSlots" :slot="slotName" slot-scope="{ value }">
            <slot :name="slotName" v-bind="{ value }"></slot>
          </template>
          <template slot="loading">
            <slot name="loading"></slot>
          </template>
        </pivot-table>
      </div>
    </div>
  </div>
</template>

<script>
import PivotTable from './PivotTable'
import Draggable from 'vuedraggable'

export default {
  name: 'vue-pivot',
  components: { PivotTable, Draggable },
  props: {
    data: {
      type: Array,
      default: []
    },
    fields: {
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
    return {
      internal: {
        fields: this.fields,
        rowFields: this.rowFields,
        colFields: this.colFields
      },
      dragging: false,
      showSettings: true
    }
  },
  computed: {
    dragAreaClass: function() {
      return this.dragging ? 'drag-area-highlight' : null
    }
  },
  methods: {
    toggleShowSettings: function() {
      this.showSettings = !this.showSettings
    },
    start: function() {
      this.dragging = true
    },
    end: function() {
      this.dragging = false
    }
  },
  created: function() {
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

/* Grid with even gutters */
.grid-x {
  margin: 0 -0.75rem;
  > * {
    padding: 0 0.75rem;
  }
}

/* Drag & drop stuff */
.drag-area {
  min-width: 10rem;
  min-height: 6.5rem;
  border: 1px dashed #ccc;
  padding: 0.5rem;
  transition: background-color 0.4s;

  > div {
    margin: 0.5rem;
  }

  * {
    cursor: move !important;
  }

  padding-top: 2.5rem;
}

.drag-area-highlight {
  background-color: #f3f3f3;
}

.drag-area-label {
  position: absolute;
  padding: 0.75rem 1rem;
}

.sortable-ghost {
  opacity: 0.4;
}

/* Handle icon (mix of grip-vertical & ellipsis-v) */
.svg-inline--fa.fa-w-10 {
  width: 0.625em;
}

.svg-inline--fa {
  display: inline-block;
  font-size: inherit;
  height: 1em;
  overflow: visible;
  vertical-align: -.125em;
}

.btn-draggable .fa-grip-vertical {
  margin-left: -0.375rem;
  margin-right: 0.375rem;
}

/* Draggable buttons */
.btn-draggable {
  white-space: normal;
  text-align: left;
}
</style>
