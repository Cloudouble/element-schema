# Schema
All 850+ [schema.org](https://schema.org) datatypes made into web components ready to react to your data.

## Installation
* install [element](https://github.com/Cloudouble/element) as a prerequisite
* include the script tag for the schema.js file, it creates a window.Schema object
```
<script src="https://cdn.jsdelivr.net/gh/cloudouble/schema@1.0.0/element.min.js"></script>
```
* as per Element documentation, load all core custom element classes with ```window.LiveElement.Element.load()``` something like the following example: 

```
return window.LiveElement.Element.load(['Schema'].concat(window.LiveElement.Schema.CoreTypes).concat(window.LiveElement.Schema.DataTypes)).then(() => {
    //do stuff...
})
```

* see the documentation for [element](https://github.com/Cloudouble/element) to fully understand the arguments for ```window.LiveElement.Element.load()``` and the load system


## Properties for ```window.LiveElement.Schema``` that can be customised

**CoreTypes** => an array of custom element class names for reference in the loading statement, can be added to if you wish. These should be the underlying classes that everything else is a sub-type of

**DataTypes** => an array of custom element class names for reference in the loading statement, can be added to if you wish. These should be all the datatypes you are using in your app.

**Options** => an map of any options you wish to set for reference in render or validation functions, for example see how this is set in the ```microdata.js``` renderer to allow-list string options for 
```true``` and ```false``` values in the ```True```, ```False``` and ```Boolean``` validators. 

**Validators** => a map of validator functions to be re-used. See below for details on how to build validator functions.

**ValidatorMap** => a map which assigns validator function to various datatypes and within the type hierarchy of your app. See below for how to organise this.

**ClassMap** => a map which assigns HTML custom classes to data and object types, is populated automatically but can be extended or customised.

**Renders** => a map of re-usable render objects or functions to use in element rendering based on datatype and position in the hierarchy.

**RenderMap** => a map of datatype and app hierarchy positions which defines which Renders to use for those contexts.

**Errors** => a map of re-usable error objects. Currently unused and may be removed from future versions of Schema.


## Core emitted events from all elements

**schema-input** => emitted when the input of a an element is set


## Using Validators




## Using ValidatorMap





## Using ClassMap




## Using Renders




## Using RenderMap





## Base types
* view the files in ```types``` to see all available data types ready to go!


## Auto-generating datatype classes from schema.org
* run the ```types/_crawler.py``` script to read and auto-generate all datatype definitions for a given schema.org release version. 
* change the ```types/_template.html``` file to generate different class structure


## Further Reading 

[Web Components at MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components)

[Schema.org](https://schema.org)

[Schema.org types list](https://schema.org/docs/full.html)


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
