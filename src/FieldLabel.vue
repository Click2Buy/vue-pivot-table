<template>
  <div>
    <div class="btn btn-draggable" :class="`btn-outline-${variant}`">
      <div class="d-flex align-items-center gutter-x-sm">
        <svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 270 512" class="svg-inline--fa fa-grip-vertical fa-w-10"><path fill="currentColor" d="M64 208c26.5 0 48 21.5 48 48s-21.5 48-48 48-48-21.5-48-48 21.5-48 48-48zM16 104c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48zm0 304c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48z M204 208c26.5 0 48 21.5 48 48s-21.5 48 -48 48 -48 -21.5 -48 -48 21.5 -48 48 -48zM156 104c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48zm0 304c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48z" class=""></path></svg>
        <span>{{ field.label }}</span>
        <div
          class="field-tooltip-btn"
          v-if="field.headers"
          @click="toggleShowSettings(field)">
          <svg v-if="!showSettings" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="caret-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="svg-inline--fa fa-caret-down fa-w-10"><path fill="currentColor" d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z" class=""></path></svg>
          <svg v-else aria-hidden="true" focusable="false" data-prefix="fas" data-icon="caret-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="svg-inline--fa fa-caret-up fa-w-10"><path fill="currentColor" d="M288.662 352H31.338c-17.818 0-26.741-21.543-14.142-34.142l128.662-128.662c7.81-7.81 20.474-7.81 28.284 0l128.662 128.662c12.6 12.599 3.676 34.142-14.142 34.142z" class=""></path></svg>
        </div>
      </div>
    </div>
    <div
      class="field-tooltip"
      v-if="field.headers"
      v-show="showSettings">
      <h6>Headers</h6>
      <div v-for="header in field.headers">
        <div class="custom-control custom-checkbox">
          <input
            type="checkbox"
            class="custom-control-input"
            :id="`checkbox-header-${header.slotName}`"
            v-model="header.checked">
          <label class="custom-control-label" :for="`checkbox-header-${header.slotName}`" style="cursor: pointer;">
            {{ header.label }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    field: {
      type: Object
    },
    variant: {
      type: String,
      default: 'primary'
    }
  },
  data: function() {
    return {
      showSettings: false
    }
  },
  methods: {
    toggleShowSettings: function() {
      this.showSettings = !this.showSettings
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
}

.field-tooltip-btn {
  cursor: pointer;
}

.field-tooltip {
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  width: 175px;
  border: 1px solid #dee2e6;
  background-color: #fff;
  z-index: 1000;
  padding: 0.75rem;
}
</style>
