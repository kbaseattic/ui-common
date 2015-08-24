# Data Visualization Widgets

Goal -- need to ingest new data viz widget into system --

what goes with showing a new type, data of a new type in the system?

## Background

Any workspace object may be visualized by invoking a widget with the object id

(TODO:provide section on identifying an object).

There are several contexts for visualizing an object.

- overview widget
- provenance widget
- vis widget

The overview and provenance widgets are generic. They show standard object information in the same format for each object.

The vis widgets, though, are not. Each data object which can be "visualized" must have one or more vis widgets. 

Vis widgets are registered with the runtime via the plugin mechanism.




### Identifying an Object