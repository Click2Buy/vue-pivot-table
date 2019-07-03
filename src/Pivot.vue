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
        <draggable id="disabledFields"
                   v-model="internal.fields"
                   class="d-flex flex-row drag-area flex-wrap"
                   :class="dragAreaClass"
                   :group="{name: 'fields', pull: pullFunction}"
                   :clone="clone"
                   @start="start"
                   @end="end"
                   :key="getId">

          <div v-for="field in internal.fields" :key="field.key">
            <div class="btn btn-draggable btn-secondary">
              <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 270 512" class="svg-inline--fa fa-grip-vertical fa-w-10">
                <path fill="currentColor"
                      d="M64 208c26.5 0 48 21.5 48 48s-21.5 48-48 48-48-21.5-48-48 21.5-48 48-48zM16 104c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48zm0 304c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48z M204 208c26.5 0 48 21.5 48 48s-21.5 48 -48 48 -48 -21.5 -48 -48 21.5 -48 48 -48zM156 104c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48zm0 304c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48z"
                      class=""></path>
              </svg>
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

    <!-- Column Fields -->
    <div class="row grid-x mb-4" v-if="showSettings">
      <!-- Top left zone - TODO: renderer select menu -->
      <div class="col left-col"></div>

      <!-- Horizontal fields -->
      <div class="col">
        <div class="drag-area-label">{{ colsLabelText }}</div>
        <draggable id="colFields"
                   v-model="internal.colFields"
                   :group="{name: 'fields', pull: pullFunction}"
                   :clone="clone"
                   :move="moveCheck"
                   class="d-flex flex-row drag-area border-primary"
                   :class="dragAreaClass"
                   @start="start"
                   @end="end">
          <div v-for="field in internal.colFields" :key="field.key">
            <div class="btn btn-draggable btn-primary">
              <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 270 512" class="svg-inline--fa fa-grip-vertical fa-w-10">
                <path fill="currentColor"
                      d="M64 208c26.5 0 48 21.5 48 48s-21.5 48-48 48-48-21.5-48-48 21.5-48 48-48zM16 104c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48zm0 304c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48z M204 208c26.5 0 48 21.5 48 48s-21.5 48 -48 48 -48 -21.5 -48 -48 21.5 -48 48 -48zM156 104c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48zm0 304c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48z"
                      class=""></path>
              </svg>
              {{ field.label }}
              <svg @click="fieldClose('colFields', field)" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-times-circle fa-w-16" style="transform-origin: 0.625em 0.5625em;">
                <g transform="translate(256 256)" class="">
                  <g transform="translate(64, 32)  scale(1, 1)  rotate(0 0 0)" class="">
                    <path fill="currentColor"
                          d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"
                          transform="translate(-256 -256)" class=""></path>
                  </g>
                </g>
              </svg>
            </div>
          </div>
        </draggable>
      </div>
    </div>

    <!-- Value Fields -->
    <div class="row grid-x mb-4" v-if="showSettings">
      <!-- Top left zone - TODO: renderer select menu -->
      <div class="col left-col">
        <label class="form-check-label">
          <input type="checkbox" v-model="internal.hideEmpty">
          Hide Empty
        </label>
      </div>
      <!-- Horizontal Value fields -->
      <div class="col">
        <div class="drag-area-label">{{ valuesLabelText }}</div>
        <draggable id="valueFields"
                   v-model="internal.valueFields"
                   :group="{name: 'fields', pull: pullFunction}"
                   :move="moveCheck"
                   class="d-flex flex-row drag-area border-primary"
                   :class="dragAreaClass">
          <div v-for="field in valueFieldsWithTitles" :key="field.key">
            <div class="btn btn-draggable btn-primary">
              <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 270 512" class="svg-inline--fa fa-grip-vertical fa-w-10">
                <path fill="currentColor"
                      d="M64 208c26.5 0 48 21.5 48 48s-21.5 48-48 48-48-21.5-48-48 21.5-48 48-48zM16 104c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48zm0 304c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48z M204 208c26.5 0 48 21.5 48 48s-21.5 48 -48 48 -48 -21.5 -48 -48 21.5 -48 48 -48zM156 104c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48zm0 304c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48z"
                      class=""></path>
              </svg>
              <dropdown class="dropdown-inline"
                        :close-on-click="true">
                <template slot="btn">{{ field.title }}</template>
                <template slot="body">
                  <ul class="dropdown-list">
                    <li v-for="aggregate in availableFunctions(field)" :key="aggregate.function" @click="changeFunction(field, aggregate)">
                      {{ aggregate.title }}
                    </li>
                  </ul>
                </template>
              </dropdown>
              ({{ field.label }})
              <svg @click="fieldClose('valueFields', field)" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-times-circle fa-w-16" style="transform-origin: 0.625em 0.5625em;">
                <g transform="translate(256 256)" class="">
                  <g transform="translate(64, 32)  scale(1, 1)  rotate(0 0 0)" class="">
                    <path fill="currentColor"
                          d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"
                          transform="translate(-256 -256)" class=""></path>
                  </g>
                </g>
              </svg>
            </div>
          </div>
        </draggable>
      </div>
    </div>

    <div class="row flex-nowrap grid-x">
      <!-- Vertical fields -->
      <div class="col left-col" v-if="showSettings">
        <div class="drag-area-label">{{ rowsLabelText }}</div>
        <draggable id="rowFields"
                   v-model="internal.rowFields"
                   :group="{name: 'fields', pull: pullFunction}"
                   class="d-flex flex-column align-items-start drag-area border-primary"
                   :class="dragAreaClass"
                   :clone="clone"
                   :move="moveCheck"
                   @start="start"
                   @end="end">
          <div v-for="field in internal.rowFields" :key="field.key">
            <div class="btn btn-draggable btn-primary">
              <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 270 512" class="svg-inline--fa fa-grip-vertical fa-w-10">
                <path fill="currentColor"
                      d="M64 208c26.5 0 48 21.5 48 48s-21.5 48-48 48-48-21.5-48-48 21.5-48 48-48zM16 104c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48zm0 304c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48z M204 208c26.5 0 48 21.5 48 48s-21.5 48 -48 48 -48 -21.5 -48 -48 21.5 -48 48 -48zM156 104c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48zm0 304c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48z"
                      class=""></path>
              </svg>
              {{ field.label }}
              <svg @click="fieldClose('rowFields', field)" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-times-circle fa-w-16" style="transform-origin: 0.625em 0.5625em;">
                <g transform="translate(256 256)" class="">
                  <g transform="translate(64, 32)  scale(1, 1)  rotate(0 0 0)" class="">
                    <path fill="currentColor"
                          d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"
                          transform="translate(-256 -256)" class=""></path>
                  </g>
                </g>
              </svg>
            </div>
          </div>
        </draggable>
      </div>

      <!-- Table -->
      <div class="col table-responsive">
        <pivot-table :data="data"
                     :row-fields="internal.rowFields"
                     :col-fields="internal.colFields"
                     :value-fields="internal.valueFields"
                     :no-data-warning-text="noDataWarningText"
                     :is-data-loading="isDataLoading"
                     :hide-empty="internal.hideEmpty"
                     ref="pivotTable">
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
  import Dropdown from 'bp-vuejs-dropdown';

  export default {
  name: 'vue-pivot',
  components: {PivotTable, Draggable, Dropdown},
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
    valueFields: {
      type: Array,
      default: () => [],
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
    valuesLabelText: {
      type: String,
      default: 'Values'
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
    },
    hideEmpty: {
      type: Boolean,
      default: false,
    }
  },
  data: function () {
    return {
      internal: {
        fields: this.fields,
        rowFields: this.rowFields,
        colFields: this.colFields,
        valueFields: this.valueFields,
        hideEmpty: this.hideEmpty,
      },
      allFunctions: [
        {title: 'Count', function: 'count'},
        {title: 'Sum', function: 'sum'},
        {title: 'Min', function: 'min'},
        {title: 'Max', function: 'max'},
      ],
      dragging: false,
      showSettings: true,
      ids: 0,
    }
  },
  computed: {
    getId() {
      return this.ids;
    },
    dragAreaClass: function () {
      return this.dragging ? 'drag-area-highlight' : null
    },
    valueFieldsWithTitles: function () {
      for (let i = 0; i < this.internal.valueFields.length; ++i) {
        if (this.internal.valueFields[i].title == null) {
          if (this.internal.valueFields[i].aggregate != null)
            this.internal.valueFields[i].title = this.internal.valueFields[i].aggregate.title || 'Empty';
          else if (this.internal.valueFields[i].type === 'count')
            this.internal.valueFields[i].title = 'Count';
          else if (this.internal.valueFields[i].type === 'sum')
            this.internal.valueFields[i].title = 'Sum';
          else if (this.internal.valueFields[i].type === 'min')
            this.internal.valueFields[i].title = 'Min';
          else if (this.internal.valueFields[i].type === 'max')
            this.internal.valueFields[i].title = 'Max';
        }
      }

      return this.internal.valueFields;
    }
  },
  watch: {
    hideEmpty() {
      this.internal.hideEmpty = this.hideEmpty;
    },
    fields(){
      this.internal.fields = this.fields;
    },
    rowFields(){
      this.internal.rowFields = this.rowFields;
    },
    colFields(){
      this.internal.colFields = this.colFields;
    },
    valueFields(){
      this.internal.valueFields = this.valueFields;
    },
  },
  methods: {
    toggleShowSettings: function () {
      this.showSettings = !this.showSettings
    },
    start() {
      this.dragging = true;
    },
    end() {
      this.dragging = false;
    },
    moveCheck: function (evt) {
      if (evt.from.id === 'valueFields' && evt.to.id !== 'valueFields')
        return false;
    },
    fieldClose: function (source, field) {
      let array;
      if (source === 'colFields') {
        array = this.internal.colFields;
      } else if (source === 'rowFields') {
        array = this.internal.rowFields;
      } else if (source === 'valueFields') {
        array = this.internal.valueFields;
      }

      for (let i = 0; i < array.length; ++i) {
        if (array[i] === field) {
          array.splice(i, 1);
          break;
        }
      }

      if (source !== 'valueFields') {
        this.internal.fields.push(field);
      }
    },
    pullFunction: function (target, source) {
      if (target.el.id === 'valueFields')
        return 'clone';

      return true;
    },
    clone: function (item) {
      let newItem = {
        label: item.label,
        getter: item.getter,
      };

      const func = this.availableFunctions(newItem)[0];

      if (func == null)
        return null;
      else
        newItem.type = func.function;

      return newItem;
    },
    changeFunction: function (field, aggregate) {
      field.type = aggregate.function;
      field.title = aggregate.title;
      this.ids++;
      delete field.aggregate;
      // call computeData
      // watch does not catch nested changes
      this.$refs.pivotTable.computeData();
    },
    availableFunctions(field) {
      // deep copy
      let funcs = JSON.parse(JSON.stringify(this.allFunctions));

      for (let i = 0; i < this.internal.valueFields.length; ++i) {
        if (this.internal.valueFields[i].label !== field.label)
          continue;

        for (let j = 0; j < funcs.length; ++j) {
          if (funcs[j].title === this.internal.valueFields[i].title) {
            funcs.splice(j, 1);
            --j;
          }
        }
      }

      return funcs;
    },
    log: function (evt) {
      window.console.log(evt);
    },
  },
  created: function () {
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

.dropdown-inline {
  cursor: pointer;
  display: inline-block;
}

.dropdown-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.dropdown-list:active {
  color: black;
  list-style: none;
  padding: 0;
  margin: 0;
}

.dropdown-list > li {
  cursor: pointer !important;
  color: black;
}

.dropdown-list > li:hover {
  background-color: #f0f0f0;
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
