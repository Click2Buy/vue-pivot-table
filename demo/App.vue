<template>
  <div id="app" class="container mt-5">
    <h1 class="border-bottom pb-2 mb-4">Vue pivot table demo</h1>

    <h2 class="border-bottom pb-2 mb-4">Pivot
      <small>(drag & drop UI + PivotTable)</small>
    </h2>

    <button @click="changeData">Change Data</button>

    <div class="mb-5">
      <pivot :data="data"
             :fields="fields"
             :row-fields="rowFields"
             :value-fields="valueFields"
             :col-fields="colFields"
             :default-show-settings="defaultShowSettings"
             :hide-empty="hideEmpty"
      >
      </pivot>
    </div>
  </div>
</template>

<script>
  import Pivot from '../src/Pivot'
  import PivotTable from '../src/PivotTable'
  import data from './data'

  export default {
    name: 'app',
    components: {Pivot, PivotTable},
    data: () => {
      return {
        data: [],
        fields: [],
        rowFields: [],
        colFields: [],
        valueFields: [],
        defaultShowSettings: true,
        hideEmpty: true,
      }
    },
    methods: {
      changeData() {
        this.data = data,
          this.fields = [{
            getter: item => item.level0,
            label: 'Level0',
          }, {
            getter: item => item.level1,
            label: 'Level1',
          }, {
            getter: item => item.level2,
            label: 'Level2',
          }, {
            getter: item => item.level3,
            label: 'Level3',
          }, {
            getter: item => item.address,
            label: 'Address'
          }, {
            getter: item => item.rto,
            label: 'RTO'
          }, {
            getter: item => item.rpo,
            label: 'RPO'
          }];
        this.rowFields = [{
          getter: item => item.application,
          label: 'Application'
        }];
        this.colFields = [];
        this.valueFields = [
          {
            label: 'RTO',
            getter: item => item.rto,
            type: 'min',
            title: 'Min'
          },
          {
            label: 'RPO',
            getter: item => item.rpo,
            type: 'min',
            title: 'Min'
          }
        ];
      }
    },
    created: function () {
      this.isDataLoading = true
      setTimeout(() => {
        this.asyncData = data
        this.isDataLoading = false
      }, 3000)
    },
    filters: {
      number: function (value) {
        return value.toLocaleString()
      },
      capitalize: function (value) {
        return value.replace(/\b\w/g, l => l.toUpperCase())
      }
    },
  }
</script>

<style lang="scss">
  $enable-rounded: false;
  @import '~bootstrap/scss/bootstrap.scss';

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
