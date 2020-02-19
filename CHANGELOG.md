# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.0] - 2020-02-19
### Added
- This CHANGELOG file to help keeping up with latest updates
- `headerSlotsNames` and `footerSlotsNames` props on `fields` definition. This allows to generate multiple levels of header/footer for a single field. For example, for a "Country" field you can generate a header with the name, and a second header with the flag of the country.

## [0.2.1] - 2019-10-13
### Added
- `col` and `row` params to the `value` slot to allow value customization based on specific column/row

## [0.1.0] - 2019-10-13
### Added
- `computing` slot to display user feedback while the aggregations for table values are running

### Changed
- Previous implementation was iterating over data multiple times, cols and rows are now computed at the same time as values (therefore iterating over data only once)
- Values hash now uses a HashTable (class defined in a separate file), and the table keys are objects without required order
- Cols and rows are now sorted in computed properties, and use [thenBy.js](https://github.com/Teun/thenBy.js) which improves readability
- Computations are done in a task created with `setTimeout` (kind of dirty but no alternative) which avoids blocking js execution and allows user feedback

## [0.0.1] - 2018-09-06
First release
