# vue-pivot-table
A vue component for pivot table

![vue-pivot-table screenshot](https://raw.githubusercontent.com/MarketConnect/vue-pivot-table/master/screenshot.png)

TODO: codepen demo link

## Install

TODO: publish on npm & add `npm i --save` command

## Usage

### Javascript

```js
// Import the component
import Pivot from '@marketconnect/vue-pivot-table' // Not published yet!

export default {
  // Register the component
  components: { Pivot },
  
  // Basic data for component props
  data: () => {
    return {
      data: Object.freeze([{ x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }]),
      fields: [],
      colFields: [{
        getter: item => item.x,
        label: 'X'
      }],
      rowFields: [{
        getter: item => item.y,
        label: 'Y'
      }, {
        getter: item => item.z,
        label: 'Z'
      }],
      reducer: function(sum, item) {
        return sum + 1
      }
    }
  }
  ...
}
```

### HTML

```html
<pivot :data="data" :fields="fields" :row-fields="rowFields" :col-fields="colFields" :reducer="reducer">
  <!-- Optional slots can be used for formatting, see documentation below -->
</pivot>
```

## API

### Props

Prop | Type | Default | Description
-----|------|---------|------------
`data` | `Array` | `[]` | Dataset to use in the pivot ; each element should be an object
`fields` | `Array` | `[]` | Fields to display in the "Available fields" zone
`row-fields` | `Array` | `[]` | Fields to use as rows by default
`col-fields` | `Array` | `[]` | Fields to use as columns by default
`reducer` | `function` | `(sum, item) => sum + 1` | Function applied to reduce `data` in the pivot table
`hide-settings-text` | `String` | `'Hide settings'` | Text for the "hide settings" button
`show-settings-text` | `String` | `'Show settings'` | Text for the "show settings" button

#### Field format

Each element in the arrays `fields`, `rowFields` or `colFields` should be an Object with this format:
- `label` (`String`): text to display in the draggable button
- `getter` (`function`): Function to apply on an element of `data` to get the field value
- `sort` (`function`, optional): Function to order fields in the pivot table header ; if no value is provided, [javascript-natural-sort](https://github.com/Bill4Time/javascript-natural-sort) will be applied
- `headerSlotName` (`String`, optional): Name of the slot to use to format the header in the pivot table ; if no slot name is provided, the value will be displayed as found in data

### Slots

All the pivot table data display can be formatted with slots, configured in the `<pivot>` tag.

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

If you plan on using this component with large datasets, we strongly advise you to use `Object.freeze` on your `data` object.

See https://vuejs.org/v2/guide/instance.html#Data-and-Methods.

## Build

``` bash
# Install dependencies
npm install

# Serve with hot reload at localhost:8080
npm run dev

# Build js lib
npm run build

# Build js lib for browser usage
npm run build:browser
```

## Thanks

- https://github.com/plotly/react-pivottable
- https://github.com/nicolaskruchten/pivottable
- https://dhtmlx.com/docs/products/dhtmlxPivot/