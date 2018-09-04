# vue-pivot-table
A vue component for pivot table

![vue-pivot-table screenshot](https://raw.githubusercontent.com/MarketConnect/vue-pivot-table/master/screenshot.png)

TODO: jsfiddle demo link

## Install

TODO: publish on npm & add `npm i --save` command

## Usage

This project includes 2 components:
- `PivotTable`: a component creating an aggregation table from data & specific rows/columns
- `Pivot` : a drag & drop user interface to configure rows/columns of a `PivotTable`

While the `Pivot` component provides the full experience, the `PivotTable` can be used standalone.

### Javascript

#### Webpack

```js
// Import the needed component - not published yet on npm!
import Pivot from '@marketconnect/vue-pivot-table'
import PivotTable from '@marketconnect/vue-pivot-table'

export default {
  // Register the needed component
  components: { Pivot, PivotTable },
  
  // Basic data for component props
  data: () => {
    return {
      data: Object.freeze([{ x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }]),
      fields: [],
      rowFields: [{
        getter: item => item.y,
        label: 'Y'
      }, {
        getter: item => item.z,
        label: 'Z'
      }],
      colFields: [{
        getter: item => item.x,
        label: 'X'
      }],
      reducer: (sum, item) => sum + 1
    }
  }
  ...
}
```

#### Browser

```js
Vue.use(VuePivot)
```

### HTML

```html
<pivot :data="data" :fields="fields" :row-fields="rowFields" :col-fields="colFields" :reducer="reducer">
  <!-- Optional slots can be used for formatting table headers and values, see documentation below -->
</pivot>
```

Or

```html
<pivot-table :data="data" :fields="fields" :row-fields="rowFields" :col-fields="colFields" :reducer="reducer">
  <!-- Optional slots can be used for formatting table headers and values, see documentation below -->
</pivot-table>
```

## API

### Props

#### `Pivot` & `PivotTable`

Prop | Type | Default | Description
-----|------|---------|------------
`data` | `Array` | `[]` | Dataset to use in the pivot ; each element should be an object
`fields` | `Array` | `[]` | Fields to display in the "Available fields" zone
`row-fields` | `Array` | `[]` | Fields to use as rows by default
`col-fields` | `Array` | `[]` | Fields to use as columns by default
`reducer` | `function` | `(sum, item) => sum + 1` | Function applied to reduce `data` in the pivot table
`no-data-warning-text` | `String` | `'No data to display.'` | Text to display when `data` is empty

#### `Pivot` only

Prop | Type | Default | Description
-----|------|---------|------------
`default-show-settings` | `boolean` | `true` | Show settings at component creation
`available-fields-label-text` | `String` | `'Available fields'` | Text for available fields drag area
`rows-label-text` | `String` | `'Rows'` | Text for the rows drag area
`cols-label-text` | `String` | `'Columns'` | Text for the columns drag area
`hide-settings-text` | `String` | `'Hide settings'` | Text for the "hide settings" button
`show-settings-text` | `String` | `'Show settings'` | Text for the "show settings" button

#### Field format

Each element in the arrays `fields`, `colFields` or `rowFields` should be an Object with this format:
- `label` (`String`): text to display in the draggable button
- `getter` (`function`): Function to apply on an element of `data` to get the field value
- `sort` (`function`, optional): Function to order fields in the pivot table header ; if no value is provided, [javascript-natural-sort](https://github.com/Bill4Time/javascript-natural-sort) will be applied
- `headerSlotName` (`String`, optional): Name of the slot to use to format the header in the pivot table ; if no slot name is provided, the value will be displayed as found in data

### Slots

All the pivot table data display can be formatted with slots, configured in the `<pivot>` or `<pivot-table>` tag.

#### Field headers

```html
<template slot="my-field-header-slot-name" slot-scope="{ value }">{{ value }}</template>
```

The `slot` attribute must match the `slotName` previously set on your field prop.

The `slot-scope` should not be changed in order to access the `value` in the template.

#### Values

```html
<template slot="value" slot-scope="{ value }">{{ value.toLocaleString }}</template>
```

The `slot` attribute must be set to `value`.

The `slot-scope` should not be changed in order to access the `value` in the template.

### Large datasets

If you plan on using this component with large datasets, we strongly advise you to apply `Object.freeze` on your `data` object.

See https://vuejs.org/v2/guide/instance.html#Data-and-Methods.

## Build

``` bash
# Install dependencies
npm install

# Serve with hot reload at localhost:8080
npm run dev

# Build js libraries in dist folder
npm run build
```

## Thanks

- https://github.com/plotly/react-pivottable
- https://github.com/nicolaskruchten/pivottable
- https://dhtmlx.com/docs/products/dhtmlxPivot/
- https://www.fontawesome.com/