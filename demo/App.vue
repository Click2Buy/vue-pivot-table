<template>
  <div id="app" class="container mt-5">
    <h1 class="border-bottom pb-2 mb-4">Vue pivot table demo</h1>

    <h2 class="border-bottom pb-2 mb-4">Pivot <small>(drag & drop UI + PivotTable)</small></h2>

    <div class="mb-5">
      <pivot
        :data="data"
        :fields="fields"
        :row-fields="rowFields"
        :col-fields="colFields"
        :reducer="reducer"
        :default-show-settings="defaultShowSettings"
      >
        <template slot="value" slot-scope="{ value }">
          {{ value.toLocaleString() }}
        </template>
      </pivot>
    </div>

    <h2 class="border-bottom pb-2 mb-4">PivotTable <small>(standalone)</small></h2>
    
    <div class="mb-5">
      <pivot-table
        :data="asyncData"
        :row-fields="rowFields"
        :col-fields="colFields"
        :reducer="reducer"
        :default-show-settings="defaultShowSettings"
        :is-data-loading="isDataLoading"
      >
        <template slot="value" slot-scope="{ value }">
          {{ value.toLocaleString() }}
        </template>
        <template slot="loading">
          <div class="text-center">
            <svg aria-hidden="true" data-prefix="fas" data-icon="spinner" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-spinner fa-w-16 fa-pulse"><path fill="currentColor" d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z" class=""></path></svg>
            Loading...
          </div>
        </template>
      </pivot-table>
    </div>
  </div>
</template>

<script>
import Pivot from '../src/Pivot'
import PivotTable from '../src/PivotTable'
import data from './data'

export default {
  name: 'app',
  components: { Pivot, PivotTable },
  data: () => {
    return {
      data: data,
      asyncData: [],
      fields: [],
      rowFields: [{
        getter: item => item.country,
        label: 'Country'
      }, {
        getter: item => item.gender,
        label: 'Gender'
      }],
      colFields: [{
        getter: item => item.year,
        label: 'Year'
      }],
      reducer: (sum, item) => sum + item.count,
      defaultShowSettings: true,
      isDataLoading: false
    }
  },
  created: function() {
    this.isDataLoading = true
    setTimeout(() => {
      this.asyncData = data
      this.isDataLoading = false
    }, 3000)
  }
}
</script>

<style lang="scss">
$enable-rounded: false;
@import '~bootstrap/scss/bootstrap.scss';

/* Loading icon */
.svg-inline--fa.fa-w-16 {
  width: 1em;
}

.svg-inline--fa {
  display: inline-block;
  font-size: inherit;
  height: 1em;
  overflow: visible;
  vertical-align: -.125em;
}

.fa-pulse {
  animation: fa-spin 1s infinite steps(8);
}

@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(1turn);
  }
}
</style>
