# Data Visualization Widgets

Goal -- need to ingest new data viz widget into system --

what goes with showing a new type, data of a new type in the system?

## Background

Any workspace object may be visualized by invoking a widget with a reference to that object. Since KBase is a strongly typed system, each workspace object implements a specific type. When the KBase App needs to display a widget for an object, it looks up the set of available widgets for that type, and selects the default widget. Since an object may have more than one available widget, the user interface will present a control to select a different widget. 

## Adding New Widgets




### Object Types

### Widget API

### Data Vis Widget API

A Data Vis (datavis) widget is just a standard widget which specifies some optional and required configuration and parameters.

#### Configuration

The constructor and ```init``` methods for a widget allows the calling environment to pass in a configuration object. The widget configuration is meant to be persistent over the lifetime of the widget. That is, once the widget is built, the configuration will not change. This allows the widget to build and interface and generally set itself up without worry that it will need to reconfigure again.

The datavis configuration properties are:

Property    | Required | Default |Description
----------- | -------- | ------- | ----------
need_panel  | no       | false   | If true, will cause a bootstrap panel to be built, and the body of the panel to be the container for the widget.
title       | no       | ''      | If a panel is to be built, this will be used for the panel title.


#### Parameters

The ```start``` widget method takes a parameters argument. The parameters, or params for short, represents 



### Object References

(TODO:provide section on identifying an object).

There are several contexts for visualizing an object.

- overview widget
- provenance widget
- vis widget

The overview and provenance widgets are generic. They show standard object information in the same format for each object.

The vis widgets, though, are not. Each data object which can be "visualized" must have one or more vis widgets. 

Vis widgets are registered with the runtime via the plugin mechanism.




### Identifying an Object



### Sample Widgets


#### widget 1


#### widget 2


#### widget 3


#### widget 4