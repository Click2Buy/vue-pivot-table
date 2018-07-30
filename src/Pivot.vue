<template>
  <div>
    <!-- Available fields -->
    <div class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">
          Available fields
        </h5>
        <draggable v-model="fields" class="d-inline-flex flex-row drag-area" :options="{ group: 'fields' }">
          <div v-for="field in fields" :key="field">
            <div class="btn btn-secondary">{{ field }}</div>
          </div>
        </draggable>
      </div>
    </div>

    <!-- Pivot zone -->
    <div class="row grid-x mb-4">
      <!-- Top left zone -->
      <div class="col left-col"></div>

      <!-- Horizontal fields -->
      <div class="col">
        <draggable v-model="cols" class="d-flex flex-row drag-area" :options="{ group: 'fields' }">
          <div v-for="field in cols" :key="field">
            <div class="btn btn-secondary">{{ field }}</div>
          </div>
        </draggable>
      </div>
    </div>

    <div class="row flex-nowrap grid-x">
      <!-- Vertical fields -->
      <div class="col left-col">
        <draggable v-model="rows" class="d-flex flex-column align-items-start drag-area" :options="{ group: 'fields' }">
          <div v-for="field in rows" :key="field">
            <div class="btn btn-secondary">{{ field }}</div>
          </div>
        </draggable>
      </div>

      <!-- Table zone -->
      <div class="col table-responsive">
        <pivot-table :data="data" :rows="rows" :cols="cols" :reducer="reducer" :value-filter="valueFilter" />
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
  props: ['data', 'fields', 'rows', 'cols', 'reducer', 'valueFilter']
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
}
</style>
