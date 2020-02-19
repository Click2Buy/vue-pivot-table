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
        <template v-slot:value="{ value }">
          {{ value | number }}
        </template>
        <template v-slot:countryFlagHeader="{ value }">
          <span :class="`flag-icon flag-icon-${countryCode(value)}`"></span>
        </template>
        <template v-slot:countryNameHeader="{ value }">
          {{ value | capitalize }}
        </template>
        <template v-slot:genderHeader="{ value }">
          <svg v-if="value == 'female'" aria-hidden="true" data-prefix="fas" data-icon="venus" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 288 512" class="svg-inline--fa fa-venus fa-fw"><path fill="currentColor" d="M288 176c0-79.5-64.5-144-144-144S0 96.5 0 176c0 68.5 47.9 125.9 112 140.4V368H76c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h36v36c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12v-36h36c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-36v-51.6c64.1-14.5 112-71.9 112-140.4zm-224 0c0-44.1 35.9-80 80-80s80 35.9 80 80-35.9 80-80 80-80-35.9-80-80z" class=""></path></svg>
          <svg v-else-if="value == 'male'" aria-hidden="true" data-prefix="fas" data-icon="mars" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="svg-inline--fa fa-mars fa-fw"><path fill="currentColor" d="M372 64h-79c-10.7 0-16 12.9-8.5 20.5l16.9 16.9-80.7 80.7c-22.2-14-48.5-22.1-76.7-22.1C64.5 160 0 224.5 0 304s64.5 144 144 144 144-64.5 144-144c0-28.2-8.1-54.5-22.1-76.7l80.7-80.7 16.9 16.9c7.6 7.6 20.5 2.2 20.5-8.5V76c0-6.6-5.4-12-12-12zM144 384c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z" class=""></path></svg>
          {{ value | capitalize }}
        </template>
        <template v-slot:computing>
          <div class="position-absolute w-100 h-100 text-center" style="z-index: 1;">
            <div class="position-sticky bg-white d-inline-block mt-5 p-3" style="top: 0;">
              <svg aria-hidden="true" data-prefix="fas" data-icon="spinner" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-spinner fa-fw fa-pulse"><path fill="currentColor" d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z" class=""></path></svg>
              Loading table values...
            </div>
          </div>
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
        <template v-slot:value="{ value }">
          {{ value | number }}
        </template>
        <template v-slot:countryFlagHeader="{ value }">
          <span :class="`flag-icon flag-icon-${countryCode(value)}`"></span>
        </template>
        <template v-slot:countryNameHeader="{ value }">
          {{ value | capitalize }}
        </template>
        <template v-slot:genderHeader="{ value }">
          <svg v-if="value == 'female'" aria-hidden="true" data-prefix="fas" data-icon="venus" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 288 512" class="svg-inline--fa fa-venus fa-fw"><path fill="currentColor" d="M288 176c0-79.5-64.5-144-144-144S0 96.5 0 176c0 68.5 47.9 125.9 112 140.4V368H76c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h36v36c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12v-36h36c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-36v-51.6c64.1-14.5 112-71.9 112-140.4zm-224 0c0-44.1 35.9-80 80-80s80 35.9 80 80-35.9 80-80 80-80-35.9-80-80z" class=""></path></svg>
          <svg v-else-if="value == 'male'" aria-hidden="true" data-prefix="fas" data-icon="mars" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="svg-inline--fa fa-mars fa-fw"><path fill="currentColor" d="M372 64h-79c-10.7 0-16 12.9-8.5 20.5l16.9 16.9-80.7 80.7c-22.2-14-48.5-22.1-76.7-22.1C64.5 160 0 224.5 0 304s64.5 144 144 144 144-64.5 144-144c0-28.2-8.1-54.5-22.1-76.7l80.7-80.7 16.9 16.9c7.6 7.6 20.5 2.2 20.5-8.5V76c0-6.6-5.4-12-12-12zM144 384c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z" class=""></path></svg>
          {{ value | capitalize }}
        </template>
        <template v-slot:loading>
          <div class="text-center">
            <svg aria-hidden="true" data-prefix="fas" data-icon="spinner" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-spinner fa-fw fa-pulse"><path fill="currentColor" d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z" class=""></path></svg>
            Loading...
          </div>
        </template>
        <template v-slot:computing>
          <div class="position-absolute w-100 h-100 text-center" style="z-index: 1;">
            <div class="position-sticky bg-white d-inline-block mt-5 p-3" style="top: 0;">
              <svg aria-hidden="true" data-prefix="fas" data-icon="spinner" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-spinner fa-fw fa-pulse"><path fill="currentColor" d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z" class=""></path></svg>
              Loading table values...
            </div>
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
import 'flag-icon-css/css/flag-icon.css'

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
        label: 'Country',
        headerSlotNames: ['countryFlagHeader', 'countryNameHeader']
      }, {
        getter: item => item.gender,
        label: 'Gender',
        headerSlotName: 'genderHeader'
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
  methods: {
    countryCode: function(country) {
      switch (country) {
        case 'China':
          return 'cn'
        case 'France':
          return 'fr'
        case 'India':
          return 'in'
        case 'United States':
          return 'us'
      }
    }
  },
  created: function() {
    // Simulate async data loading
    this.isDataLoading = true
    setTimeout(() => {
      this.asyncData = data
      this.isDataLoading = false
    }, 3000)
  },
  filters: {
    number: function(value) {
      return value.toLocaleString()
    },
    capitalize: function(value) {
      return value.replace(/\b\w/g, l => l.toUpperCase())
    }
  }
}
</script>

<style lang="scss">
$enable-rounded: false;
$table-cell-padding: .5rem; // default in bs5
$table-cell-padding-sm: .25rem; // default in bs5
@import '~bootstrap/scss/bootstrap.scss';

/* Table with aria-busy attribute */
table[aria-busy='true'] {
  opacity: 0.6;
}

/* FontAwesome icons */
.svg-inline--fa.fa-fw {
  width: 1.25em;
}

.svg-inline--fa {
  display: inline-block;
  font-size: inherit;
  height: 1em;
  overflow: visible;
  vertical-align: -.125em !important;
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
