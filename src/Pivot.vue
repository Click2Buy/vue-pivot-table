<template>
  <div>
    <!-- Available fields -->
    <div class="card mb-4" v-if="showSettings">
      <div class="card-body">
        <div class="row grid-x justify-content-between align-items-start">
          <div>
            <draggable v-model="internal.fields" class="d-inline-flex flex-row drag-area" :options="{ group: 'fields' }">
              <div v-for="field in internal.fields" :key="field.key">
                <div class="btn btn-secondary">{{ field.label }}</div>
              </div>
            </draggable>
          </div>
          <div>
            <button class="btn btn-outline-primary" @click="toggleShowSettings">
              {{ hideSettingsText }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-4 text-right" v-else>
      <button class="btn btn-outline-primary" @click="toggleShowSettings">
        {{ showSettingsText }}
      </button>
    </div>

    <!-- Pivot zone -->
    <div class="row grid-x mb-4" v-if="showSettings">
      <!-- Top left zone -->
      <div class="col left-col"></div>

      <!-- Horizontal fields -->
      <div class="col">
        <draggable v-model="internal.colFields" class="d-flex flex-row drag-area" :options="{ group: 'fields' }">
          <div v-for="field in internal.colFields" :key="field.key">
            <div class="btn btn-primary">{{ field.label }}</div>
          </div>
        </draggable>
      </div>
    </div>

    <div class="row flex-nowrap grid-x">
      <!-- Vertical fields -->
      <div class="col left-col" v-if="showSettings">
        <draggable v-model="internal.rowFields" class="d-flex flex-column align-items-start drag-area" :options="{ group: 'fields' }">
          <div v-for="field in internal.rowFields" :key="field.key">
            <div class="btn btn-primary">{{ field.label }}</div>
          </div>
        </draggable>
      </div>

      <!-- Table zone -->
      <div class="col table-responsive">
        <pivot-table :data="data" :rowFields="internal.rowFields" :colFields="internal.colFields" :reducer="reducer" :value-formatter="valueFormatter" />
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
    valueFormatter: {
      type: Function,
      default: value => value.toLocaleString()
    },
    hideSettingsText: {
      type: String,
      default: 'Hide settings'
    },
    showSettingsText: {
      type: String,
      default: 'Show settings'
    }
  },
  data: function() {
    return {
      internal: {
        fields: this.fields,
        rowFields: this.rowFields,
        colFields: this.colFields
      },
      showSettings: true
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

/* Drag area */
.drag-area {
  min-width: 10rem;
  min-height: 4.5rem;
  border: 1px dashed #ccc;
  padding: 0.75rem;

  > div {
    margin: 0.25rem;
  }

  * {
    cursor: move !important;
  }
}
</style>
