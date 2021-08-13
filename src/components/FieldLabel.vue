<template>
  <div>
    <!-- Label -->
    <div class="btn-group">
      <!-- Draggable button -->
      <button
        type="button"
        class="btn btn-draggable"
        :class="`btn-${variant}`">
        <div class="d-flex align-items-center">
          <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 270 512" class="svg-inline--fa fa-grip-vertical fa-w-10"><path fill="currentColor" d="M64 208c26.5 0 48 21.5 48 48s-21.5 48-48 48-48-21.5-48-48 21.5-48 48-48zM16 104c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48zm0 304c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48z M204 208c26.5 0 48 21.5 48 48s-21.5 48 -48 48 -48 -21.5 -48 -48 21.5 -48 48 -48zM156 104c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48zm0 304c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48z" class=""></path></svg>
          <span style="margin-left: 0.5rem; text-align: left;">
            <slot v-if="field.labelSlotName" :name="field.labelSlotName">
              Missing slot <code>{{ field.labelSlotName }}</code>
            </slot>
            <template v-else>
              {{ field.label }}
            </template>
          </span>
        </div>
      </button>

      <!-- Dropdown button -->
      <button
        type="button"
        class="btn dropdown-toggle-split"
        :class="`btn-${variant}`"
        v-if="hasDropdown"
        @click="toggleShowDropdown(field)">
        <svg v-if="!showDropdown" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="caret-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="svg-inline--fa fa-caret-down fa-w-10"><path fill="currentColor" d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z" class=""></path></svg>
        <svg v-else aria-hidden="true" focusable="false" data-prefix="fas" data-icon="caret-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="svg-inline--fa fa-caret-up fa-w-10"><path fill="currentColor" d="M288.662 352H31.338c-17.818 0-26.741-21.543-14.142-34.142l128.662-128.662c7.81-7.81 20.474-7.81 28.284 0l128.662 128.662c12.6 12.599 3.676 34.142-14.142 34.142z" class=""></path></svg>
      </button>
    </div>

    <!-- Settings dropdown -->
    <div
      class="field-dropdown-menu"
      v-if="hasDropdown"
      v-show="showDropdown">
      <!-- Headers filter -->
      <template v-if="field.headerAttributeFilter">
        <h6 class="dropdown-header">Attributes</h6>
        <div class="dropdown-list px-4 py-2">
          <div v-for="(header, index) in field.headers" class="mb-1">
            <div class="custom-control custom-checkbox">
              <input
                type="checkbox"
                class="custom-control-input"
                :id="`checkbox-${field.key}-header-${index}`"
                v-model="header.checked">
              <label class="custom-control-label" :for="`checkbox-${field.key}-header-${index}`">
                {{ header.label }}
              </label>
            </div>
          </div>
        </div>
      </template>

      <div class="dropdown-divider" v-if="field.headerAttributeFilter && field.valueFilter"></div>

      <!-- Values filter -->
      <template v-if="field.valueFilter">
        <h6 class="dropdown-header">Values</h6>
        <div class="dropdown-item" style="cursor: pointer;" @click="toggleAllValues(!allValuesSelected)">
          <template v-if="allValuesSelected">
            {{ unselectAllText }}
          </template>
          <template v-else>
            {{ selectAllText }}
          </template>
        </div>
        <div class="dropdown-list px-4 py-2">
          <div v-for="(item, index) in fieldValues" class="mb-1">
            <div class="custom-control custom-checkbox">
              <input
                type="checkbox"
                class="custom-control-input"
                :id="`checkbox-${field.key}-value-${index}`"
                v-model="item.checked">
              <label class="custom-control-label" :for="`checkbox-${field.key}-value-${index}`">
                <slot v-if="field.valueFilterSlotName" :name="field.valueFilterSlotName" v-bind:value="item.value">
                  Missing slot <code>{{ field.valueFilterSlotName }}</code>
                </slot>
                <template v-else>
                  {{ item.value }}
                </template>
              </label>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: 'fieldValues',
  },
  props: {
    fieldValues: {
      type: Array
    },
    field: {
      type: Object
    },
    variant: {
      type: String,
      default: 'primary'
    },
    selectAllText: {
      type: String
    },
    unselectAllText: {
      type: String
    }
  },
  data: function() {
    return {
      showDropdown: false
    }
  },
  computed: {
    hasDropdown: function() {
      return this.field.headerAttributeFilter && this.field.headers || this.field.valueFilter
    },
    allValuesSelected: function() {
      let allValuesSelected = true

      for (let valueObject of this.fieldValues) {
        if (!valueObject.checked) {
          allValuesSelected = false
          break
        }
      }

      return allValuesSelected
    }
  },
  methods: {
    toggleShowDropdown: function() {
      this.showDropdown = !this.showDropdown
    },
    toggleAllValues: function(target) {
      this.fieldValues.forEach(valueObject => {
        valueObject.checked = target
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/* Grid with gutter */
.gutter-x-sm, .gutter-sm {
  margin-left: -.5rem;
  > * {
    margin-left: .5rem;
  }
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

.btn-draggable {
  cursor: move !important;
  z-index: 999;
  padding-left: 0.5625rem;
}

.field-dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  float: left;
  min-width: 200px;
  padding: 0.5rem 0;
  margin: 0.125rem 0 0;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.15);
}

.dropdown-list {
  max-height: 175px;
  overflow: auto;
}
</style>
