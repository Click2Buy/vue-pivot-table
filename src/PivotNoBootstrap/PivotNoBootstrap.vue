<template>
  <div class="pivot-no-bootstrap">
    <!-- Top row -->
    <div v-if="showSettings" class="layout nowrap-row mb-4">
      <div class="layout flex align-start hide-settings">
        <button class="btn-no-bootstrap btn-no-bootstrap-primary" @click="toggleShowSettings">
          {{ hideSettingsText }}
        </button>
      </div>

      <!-- Disabled fields -->
      <div class="layout flex available-fields">
        <div class="drag-area-label">{{ availableFieldsLabelText }}</div>
        <draggable v-model="internal.fields" class="layout wrap-row drag-area" :class="dragAreaClass" :options="{ group: 'fields' }" @start="start" @end="end">
          <div v-for="field in internal.fields" :key="field.key">
            <div class="btn-no-bootstrap btn-draggable btn-no-bootstrap-secondary">
              <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 270 512" class="svg-inline--fa fa-grip-vertical fa-w-10"><path fill="currentColor" d="M64 208c26.5 0 48 21.5 48 48s-21.5 48-48 48-48-21.5-48-48 21.5-48 48-48zM16 104c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48zm0 304c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48z M204 208c26.5 0 48 21.5 48 48s-21.5 48 -48 48 -48 -21.5 -48 -48 21.5 -48 48 -48zM156 104c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48zm0 304c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48z" class=""></path></svg>
              {{ field.label }}
            </div>
          </div>
        </draggable>
      </div>
    </div>

    <div class="mb-4" v-else>
      <button class="btn-no-bootstrap btn-no-bootstrap-primary" @click="toggleShowSettings">
        {{ showSettingsText }}
      </button>
    </div>

    <div class="layout nowrap-row mb-4" v-if="showSettings">
      <!-- Top left zone - TODO: renderer select menu -->
      <div class="layout flex"></div>

      <!-- Horizontal fields -->
      <div class="layout flex columns">
        <div class="drag-area-label">{{ colsLabelText }}</div>
        <draggable v-model="internal.colFields" :options="{ group: 'fields' }" @start="start" @end="end" class="layout wrap-row drag-area border-primary" :class="dragAreaClass">
          <div v-for="field in internal.colFields" :key="field.key">
            <div class="btn-no-bootstrap btn-draggable btn-no-bootstrap-secondary">
              <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 270 512" class="svg-inline--fa fa-grip-vertical fa-w-10"><path fill="currentColor" d="M64 208c26.5 0 48 21.5 48 48s-21.5 48-48 48-48-21.5-48-48 21.5-48 48-48zM16 104c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48zm0 304c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48z M204 208c26.5 0 48 21.5 48 48s-21.5 48 -48 48 -48 -21.5 -48 -48 21.5 -48 48 -48zM156 104c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48zm0 304c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48z" class=""></path></svg>
              {{ field.label }}
            </div>
          </div>
        </draggable>
      </div>
    </div>

    <div class="layout nowrap-row">
      <!-- Vertical fields -->
      <div class="rows" v-if="showSettings">
        <div class="drag-area-label">{{ rowsLabelText }}</div>
        <draggable v-model="internal.rowFields" :options="{ group: 'fields' }" @start="start" @end="end" class="layout wrap-column align-start drag-area border-primary" :class="dragAreaClass">
          <div v-for="field in internal.rowFields" :key="field.key">
            <div class="btn-no-bootstrap btn-draggable btn-no-bootstrap-secondary">
              <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 270 512" class="svg-inline--fa fa-grip-vertical fa-w-10"><path fill="currentColor" d="M64 208c26.5 0 48 21.5 48 48s-21.5 48-48 48-48-21.5-48-48 21.5-48 48-48zM16 104c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48zm0 304c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48z M204 208c26.5 0 48 21.5 48 48s-21.5 48 -48 48 -48 -21.5 -48 -48 21.5 -48 48 -48zM156 104c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48zm0 304c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48z" class=""></path></svg>
              {{ field.label }}
            </div>
          </div>
        </draggable>
      </div>

      <!-- Table -->
      <div class="table">
        <pivot-table-no-bootstrap :data="data" :row-fields="internal.rowFields" :col-fields="internal.colFields" :reducer="reducer" :no-data-warning-text="noDataWarningText" :is-data-loading="isDataLoading">
          <!-- pass down scoped slots -->
          <template v-for="(slot, slotName) in $scopedSlots" :slot="slotName" slot-scope="{ value }">
            <slot :name="slotName" v-bind="{ value }"></slot>
          </template>
          <template slot="loading">
            <slot name="loading"></slot>
          </template>
        </pivot-table-no-bootstrap>
      </div>
    </div>
  </div>
</template>

<script>
import PivotTableNoBootstrap from './PivotTableNoBootstrap'
import Draggable from 'vuedraggable'

export default {
  name: 'vue-pivot',
  components: { PivotTableNoBootstrap, Draggable },
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
@import url('https://fonts.googleapis.com/css?family=Segoe UI');
@import url('https://fonts.googleapis.com/css?family=Roboto');
@import url('https://fonts.googleapis.com/css?family=Helvetica');
//main
.pivot-no-bootstrap {
  font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

//spacing
.mb-4 {
  margin-bottom: 16px * 1.5;
}

//flex
.layout {
  display: flex;
  flex-direction: row;
  flex: 1 1 auto;
  min-width: 0;
}

.flex {
  flex: 1 1 auto;
  @media screen and (min-width: 0) {
    flex-basis: 100%;
    flex-grow: 0;
    max-width: 100%;
  }
  @media screen and (min-width: 600px) {
    flex-basis: 50%;
    flex-grow: 0;
    max-width: 50%;
  }
  @media screen and (min-width: 960px) {
    flex-basis: 33.33333333333333%;
    flex-grow: 0;
    max-width: 33.33333333333333%;
  }
  @media screen and (min-width: 1264px) {
    flex-basis: 25%;
    flex-grow: 0;
    max-width: 25%;
  }
}

.column {
  flex-direction: column;
}

.wrap {
  flex-direction: wrap;
}

.no-wrap {
  flex-direction: nowrap;
}

.wrap-row {
  flex-flow: row wrap;
}

.nowrap-row {
  flex-flow: row nowrap;
}

.nowrap-column {
  flex-flow: column nowrap;
}

.wrap-column {
  flex-flow: column wrap;
}

.align-center {
  align-items: center;
}

.align-baseline {
  align-items: baseline;
}

.justify-center {
  justify-content: center;
}

.justify-end {
  justify-content: flex-end;
}

.text-center {
  text-align: center;
}

.content-center {
  align-content: center;
}

.text-left {
  text-align: left;
}

.align-start {
  align-items: flex-start;
}

.align-end {
  align-items: flex-end;
}

.spacer {
  flex-grow: 1;
}

.self-end {
  align-self: flex-end;
}

.no-border {
  border: 0 !important;
}

.pointer {
  cursor: pointer;
}

.space-between {
  justify-content: space-between;
}

.space-around {
  justify-content: space-around;
}

//others
.available-fields, .columns {
  flex-basis: 100%;
  max-width: 100%;
  width: 100%;
}

.rows {
  min-width: 200px;
  max-width: 200px;
  margin-right: 1.37rem;
}

.table {
  margin-top: -2.5px;
  min-width: calc(100% - 13.7rem);
}

.btn-no-bootstrap-primary, .btn-no-bootstrap-secondary {
  background-image: none;
  background-color: #fff;
  border-color: transparent;
  color: #0052cc;
  text-decoration: none;
  font-weight: 600;
  transition: all .2s ease-out;
  border: 1px solid #0052cc;
}

.btn-no-bootstrap-primary:hover, .btn-no-bootstrap-secondary:hover {
  background-color: #0052cc;
  color: #fff;
}

.btn-no-bootstrap-secondary {
  background-color: #0052cc;
  color: #fff;
  will-change: opacity !important;
  transition: all .2s ease-out !important
}

.btn-no-bootstrap-secondary:hover {
  background-color: #0052cc;
  color: #fff;
  opacity: .7;
}

.btn-no-bootstrap {
  box-sizing: border-box;
  transition: background-color .1s ease-out;
  border-radius: 3.01px;
  border-style: solid;
  border-width: 1px;
  cursor: pointer;
  font-family: inherit;
  font-size: 16px;
  font-variant: normal;
  display: inline-block;
  height: 2.14285714em;
  line-height: 1.42857143em;
  margin: 0;
  padding: 6px 16px;
  vertical-align: baseline;
  white-space: nowrap;
}

.w200 {
  min-width: 200px;
  max-width: 200px;
}

.border-primary {
  border-color: #007bff !important;
}

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
