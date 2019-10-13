<template>
  <div>
    <!-- Top row -->
    <div v-if="showSettings" class="d-flex flex-nowrap gutter mb-3">
      <div class="left-col">
        <button class="btn btn-outline-primary" @click="toggleShowSettings">
          {{ hideSettingsText }}
        </button>
      </div>

      <!-- Available fields -->
      <div class="flex-fill drag-area" :class="dragAreaClass">
        <div class="mb-2">{{ availableFieldsLabelText }}</div>
        <draggable
          v-model="internal.fields"
          class="d-flex flex-row gutter-sm drag-area-zone"
          group="fields"
          @start="start"
          @end="end">
          <div v-for="field in internal.fields" :key="field.key">
            <div class="btn btn-draggable btn-secondary">
              <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 270 512" class="svg-inline--fa fa-grip-vertical fa-w-10"><path fill="currentColor" d="M64 208c26.5 0 48 21.5 48 48s-21.5 48-48 48-48-21.5-48-48 21.5-48 48-48zM16 104c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48zm0 304c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48z M204 208c26.5 0 48 21.5 48 48s-21.5 48 -48 48 -48 -21.5 -48 -48 21.5 -48 48 -48zM156 104c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48zm0 304c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48z" class=""></path></svg>
              {{ field.label }}
            </div>
          </div>
        </draggable>
      </div>
    </div>

    <div v-else class="mb-3">
      <button class="btn btn-outline-primary" @click="toggleShowSettings">
        {{ showSettingsText }}
      </button>
    </div>

    <div class="d-flex gutter mb-3" v-if="showSettings">
      <!-- Top left zone - TODO: renderer select menu -->
      <div class="left-col"></div>

      <!-- Column fields -->
      <div class="flex-fill drag-area border-primary" :class="dragAreaClass">
        <div class="mb-2">{{ colsLabelText }}</div>
        <draggable
          v-model="internal.colFields"
          class="d-flex flex-row gutter-sm drag-area-zone"
          group="fields"
          @start="start"
          @end="end">
          <div v-for="field in internal.colFields" :key="field.key">
            <div class="btn btn-draggable btn-primary">
              <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 270 512" class="svg-inline--fa fa-grip-vertical fa-w-10"><path fill="currentColor" d="M64 208c26.5 0 48 21.5 48 48s-21.5 48-48 48-48-21.5-48-48 21.5-48 48-48zM16 104c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48zm0 304c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48z M204 208c26.5 0 48 21.5 48 48s-21.5 48 -48 48 -48 -21.5 -48 -48 21.5 -48 48 -48zM156 104c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48zm0 304c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48z" class=""></path></svg>
              {{ field.label }}
            </div>
          </div>
        </draggable>
      </div>
    </div>

    <div class="d-flex flex-nowrap gutter">
      <!-- Row fields -->
      <div v-if="showSettings" class="left-col">
        <div class="drag-area border-primary" :class="dragAreaClass">
          <div class="mb-2">{{ rowsLabelText }}</div>
          <draggable
            v-model="internal.rowFields"
            class="d-flex flex-column align-items-start gutter-sm drag-area-zone"
            group="fields"
            @start="start"
            @end="end">
            <div v-for="field in internal.rowFields" :key="field.key">
              <div class="btn btn-draggable btn-primary">
                <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 270 512" class="svg-inline--fa fa-grip-vertical fa-w-10"><path fill="currentColor" d="M64 208c26.5 0 48 21.5 48 48s-21.5 48-48 48-48-21.5-48-48 21.5-48 48-48zM16 104c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48zm0 304c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48z M204 208c26.5 0 48 21.5 48 48s-21.5 48 -48 48 -48 -21.5 -48 -48 21.5 -48 48 -48zM156 104c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48zm0 304c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48z" class=""></path></svg>
                {{ field.label }}
              </div>
            </div>
          </draggable>
        </div>
      </div>

      <!-- Table -->
      <div class="flex-fill" :style="tableWrapperStyle">
        <pivot-table :data="data" :row-fields="internal.rowFields" :col-fields="internal.colFields" :reducer="reducer" :no-data-warning-text="noDataWarningText" :is-data-loading="isDataLoading">
          <!-- pass down scoped slots -->
          <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope"><slot :name="slot" v-bind="scope"/></template>
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
    },
    tableWrapperStyle: function() {
      const maxWidth = this.showSettings ? 'calc(100% - 200px - 2rem)' : '100%'
      return `max-width: ${maxWidth};`
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

  .drag-area-zone {
    min-width: 10rem;
    min-height: 3rem;
  }

  .btn-draggable {
    cursor: move !important;
  }
}

.drag-area-highlight {
  background-color: #f3f3f3;
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
