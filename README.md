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
  
  // Configure pivot
  data: () => {
    return {
      data: [{ x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }],
      fields: [],
      cols: [{
        getter: item => item.x,
        label: 'X'
      }],
      rows: [{
        getter: item => item.y,
        label: 'Y'
      }, {
        getter: item => item.z,
        label: 'Z'
      }],
      reducer: function(sum, item) {
        return sum + 1
      },
      valueFilter: function(value) {
        return value.toLocaleString()
      }
    }
  }
  ...
}
```

### HTML

```html
<pivot :data="data" :fields="fields" :rows="rows" :cols="cols" :reducer="reducer" :value-filter="valueFilter" />
```

## API

### Props

Prop | Type | Default | Description
-----|------|---------|------------
`data` | `Array` | `[]` | Dataset to use in the pivot ; each element should be an object
`fields` | `Array` | `[]` | Fields to display in the "Available fields" zone
`rows` | `Array` | `[]` | Fields to use as rows by default
`cols` | `Array` | `[]` | Fields to use as columns by default
`reducer` | `function` | `(sum, item) => sum + 1` | Function applied to reduce `data` in the pivot table
`value-formatter` | `function` | `value => value.toLocaleString()` | Function to format values in the pivot table
`hide-settings-text` | `String` | 'Hide settings` | Text for the "hide settings" button
`show-settings-text` | `String` | 'Show settings` | Text for the "show settings" button

#### Field format

Each element in the arrays `fields`, `rows` or `cols` should be an Object with this format:
- `label` (`String`): text to display in the draggable button
- `getter` (`function`): Function to apply on an element of `data` to get the field value
- `sort` (`function`, optional): Function to order fields in the pivot table header ; if no value is provided, [javascript-natural-sort](https://github.com/Bill4Time/javascript-natural-sort) will be applied
- `formatter` (`function`, optional): Function to format headers ; the function has a value argument ; if no function is provided, the value will be displayed as found in data

## Build

``` bash
# Install dependencies
npm install

# Serve with hot reload at localhost:8080
npm run dev

# Build js lib
npm run build
```

## Thanks

- https://github.com/plotly/react-pivottable
- https://github.com/nicolaskruchten/pivottable
- https://dhtmlx.com/docs/products/dhtmlxPivot/