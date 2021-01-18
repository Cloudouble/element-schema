# Schema
All 850+ [schema.org](https://schema.org) datatypes made into web components ready to render your data into HTML.

This library makes every one of the hundreds of data types described over at [schema.org](https://schema.org) available as custom HTML elements. 

For example: 

```
<element-person name="John Doe" email="john@example.com"></element-person>
```

can be created with: 

```
var person = document.createElement('element-person')
window.LiveElement.Schema.setElementInput(person, {name: "John Doe", email: "john@example.com"})

//and later update the name (which will update the HTML display): 
person.name = "James Bond"

//get the value of person as a live object {name: "James Bond", email: "john@example.com"}
person.valueOf() 

//get the JSON string directly
String(person) // or JSON.stringify(person)

//see the available properties of the person type
Object.keys(person)

//see which properties have currently been set
Object.keys(person.valueOf())

//get the validation result, will show the validity of each property that has been set
person.__validation

```

And, with the optional ```microdata.js``` renderer, it will render HTML (in the shadowDOM) as:

```
<element-person name="John Doe" email="john@example.com" itemtype="https://schema.org/Person" itemscope>
    <element-text itemprop="name">John Doe</element-text>
    <element-text itemprop="email">john@example.com</element-text>
</element-person>
```

It can then be further styled, templated and have it's behaviour customised with the rendering system (see below). 


## Installation
* install [element](https://github.com/Cloudouble/element) as a prerequisite
* include the script tag for the ```schema.js``` file, it creates a ```window.LiveElement.Schema``` object
```
<script src="https://cdn.jsdelivr.net/gh/cloudouble/schema@1.0.2/schema.min.js"></script>
```
* as per Element documentation, load all core custom element classes (including the ```Schema``` element class) with ```window.LiveElement.Element.load()``` something like the following example: 

```
return window.LiveElement.Element.load(['Schema'].concat(window.LiveElement.Schema.CoreTypes).concat(window.LiveElement.Schema.DataTypes)).then(() => {
    //do stuff...
})
```

* see the documentation for [element](https://github.com/Cloudouble/element) to fully understand the arguments for ```window.LiveElement.Element.load()``` and the load system


## Properties for ```window.LiveElement.Schema``` that can be customised

**CoreTypes** => an array of custom element class names for reference in the loading statement, can be extended. These should be the underlying classes that everything else is a sub-type of.

**DataTypes** => an array of custom element class names for reference in the loading statement, can be extended. These should be all the datatypes you are using in your app.

**Options** => an map of any options you wish to set for reference in render or validation functions, for example see how this is set in the ```microdata.js``` renderer to allow-list string options for 
```true``` and ```false``` values in the ```True```, ```False``` and ```Boolean``` validators. 

**Validators** => a map of validator functions to be re-used. See below for details on how to build validator functions.

**ValidatorMap** => a map which assigns validator function to various datatypes and within the type hierarchy of your app. See below for how to organise this.

**ClassMap** => a map which assigns HTML custom classes to data and object types, is populated automatically but can be extended or customised.

**Renders** => a map of re-usable render objects or functions to use in element rendering based on datatype and position in the hierarchy.

**RenderMap** => a map of datatype and app hierarchy positions which defines which Renders to use for those contexts.

**Errors** => a map of re-usable error objects. Currently unused and may be removed from future versions of Schema.

There is also a ```version``` property which is a read-only string of the current version of this library, which may be different to the version of the [schema.org](https://schema.org) definitions used.

## Core emitted events from all elements

**schema-input** => emitted when the input of a an element is set, no event detail is provided.


## Methods of ```window.LiveElement.Schema```
**runRender** => given a single element as it's argument, it will find and run the the relevant render based on it's datatype and context.

**setElementInput** => given an element and an input value as arguments, it will set the ```__input``` of the element to the given value, plus do validation, and propagate to child elements as required. 


**Note that best practice is to set the data properties of parent elements and let them propagate down, setting the values of child elements within a shadowDOM directly may not always propagate up to the parent 
container element's value. Setting the element attributes in HTML works just as well (with scalar values) as using ```setElementInput```** 


## Using ```Validators```
The first step in validating your data is to define a number of re-usable validator functions. Each function can be used for multiple data types and contexts. Give each one a key and 
put it's function definition in the ```window.LiveElement.Schema.Validators``` object. All core data types already have built in validators which you can use or override. A validator function
take the following arguments: 

**input** => the value of the property you are validating

**propertyMap** => the map describing the atttribute as passed to ```window.LiveElement.Schema.setProperty``` in the attribute setter within the containing datatype definition class.  

The ```propertyMap``` object contains the following properties: 

**comment** => the description of the property taken verbatum from the [schema.org](https://schema.org/) definition

**container** => a reference to the live HTML element that the property is a member of

**propertyName** => the name of the property according to the [schema.org](https://schema.org/) definition

**release** => the version number of the [schema.org](https://schema.org/) definition that was used to generate the element definition

**source** => where the definition came from, always ```'schema.org'``` for the generated types included here

**types** => the list of valid datatypes for this property

**value** => the raw input value to be assigned to this property


Look up any type definition file for many examples of this object being passed to ```setProperty```, for example see ```types/Thing.html```

A validator has to return an object with the following properties: 

**input** => the input that was validated, passed through without change

**value** => the validated value, this value needs to be either a valid value for the property / datatype or ```undefined``` if the input can not be coerced into a valid value.

**valid** => true/false if the given input is valid

**error** => an error message if the input is invalid


The philosophy behind validators is to: 
* pass through the given ```input``` value and that is assigned to the property whether valid or not
* suggest a valid value if possible via the ```value``` property
* let the user know why the given input was invalid via the ```error``` property
* leave it up to them to suggest another input value or leave as-is
				
				
## Using ```ValidatorMap```
The purpose of the ```ValidatorMap``` is to allow re-use of validator functions across datatypes and contexts.

Let's say you have three validators defined: ```a```, ```b``` and ```c```. Each will have a key in ```Validators``` with the value being the validator function itself.

Consider the following ```ValidatorMap```: 

```
{
    Person: 'a', 
    Car: 'b', 
    Movie: {
        actor: 'c'
    }
}

```
The value of ```Movie -> actor``` is a ```Person``` datatype, however it will use the ```c``` validator instead of the ```a``` validator. All other Person instances will use the ```a``` validator.
Descendant types also match, so for example ```Patient``` is a sub-type of ```Person``` so any ```Patient``` instances will also use validator ```a```.

## Using ```ClassMap```
You can use this to assign which class to use for a given datatype / context. This will be especially useful if you have defined a custom element that you wish to override a pre-defined type with.
```
{
    Person: 'Person', 
    Car: 'Car', 
    Movie: {
        actor: 'MyCustomMovieActorElement'
    }
}

```
In the above example, the value of the ```Movie -> actor``` property will be rendered as a ```MyCustomMovieActorElement``` (```<element-mycustommovieactorelement></element-mycustommovieactorelement>```) instead of 
the default Person (```<element-person></element-person>```) element. As such, it can have completely different behaviour and look and feel to the default. 



## Using ```Renders```
As per the render feature of the [Element](https://live-element.net/element.html) library, you can mix and match different datatypes - their CSS, HTML and overlay behaviour with rendering functions.
Similarly to ```Validators```, you can directly define re-usable render definition objects in the ```Renders``` object, and then specify exactly where they are used with the ```RenderMap```.
See the example for microdata rendering in ```renders/microdata/microdata.js``` to get an idea.

A ```Render``` value can be either a function - in which case this function only will be called as the renderer, and no other CSS or HTML is injected - or an object with the following properties: 

**asClass** => the loaded class to use as a base if the other properties are not set

**renderFunction** => the function definition to use, if omitted the static ```__render``` function of ```asClass``` (```window.LiveElement.Element.elements[asClass].__render```) will be used (if present). If boolean ```false``` no 
function will be called even if otherwise specified. Default is ```true```, which means to use the ```__render``` function of ```asClass``` if present.

**style** => ```false``` to not inject any CSS, ```true``` (the default if omitted) to use the compiled CSS from ```asClass```, a string name of a different class to use its compiled CSS, or a string CSS code to 
directly specify the CSS to inject. The injected CSS is appended to the element's existing CSS to override.

**template** => ```false``` to not replace any HTML, ```true``` (the default if omitted) to use the compiled HTML from ```asClass```, a string name of a different class to use its compiled HTML, or a string HTML 
code to  directly specify the HTML to replace the element's existing HTML with.


Renders do not change the datatype, however they are not reversible. To reverse the effect of a render, you would need to create another one and apply it when you needed to have the first one reversed. 
Alternatively, you can re-create the element without the render from the ```valueOf``` output of the existing element.

```
var newElement = document.createElement('element-person')
window.LiveElement.Schema.setElementInput(oldElement.valueOf())
oldElement.replaceWith(newElement)
```

```renderFunction``` definitions take the following arguments: 

**element** => the element to be rendered, typically that is all you want

**asClass**, **style** and **template** => these arguments as just the values from the ```Render``` definition, maybe they are useful sometime...


## Using ```RenderMap```
The same logic as ```ValidatorMap``` and ```ClassMap```, string values can either be named renders in ```Render```, or direct loaded class names to use as if only ```asClass```  was set.


## Special properties of Schema elements
Elements that inherit from the base Schema class have the following properties: 

### ```static``` properties (use ```.constructor```)

**__release** => the [schema.org](https://schema.org/) release that was used to generate the datatype definition

**__prefix** => the Element prefix that was present when this class was loaded with ```window.LiveElement.Element.load()```

**__context** => generally just ```'https://schema.org/'```

**__properties** => the list of properties that may be attached to this element. These become settable attributes in your HTML, or you can assign directly in your Javascript to the 
live element object. 

**_rdfs_label** => the shortname of the datatype, generally the same as the class name

### Regular non-static properties

**__input** => the current input for this element, may be invalid

**__value** => the current valid result of ```__input```, invalid properties will be ```undefined``` here, and itself will be ```undefined``` if the whole of ```__input``` is invalid or the dataype is a scalar type and ```__input``` is invalid

**__validation** => all validation results. If ```__input``` is an object, this will have a key for each property, with the validation for that property, and then a special ```__``` key with the validation for the 
whole object. If this is a scalar type, then the result of the validator is directly set as the value

**__map** => for non-scalar types, a map of each property value with a reference to it live element instance (even if not currently present in your HTML)

**__container** => if this element is a property of a parent element, a reference to the containing element

**__containerPropertyName** => if this element is a property of a parent element, the name of the property that this element is for, kind of the inverse of ```__map```

**__propertyMap** => if this element is a property of a parent element, then the propertyMap as passed to ```setProperty``` in the type definition

**__isConnected** => true if the element has been connected to the HTML document, set as part of the ```connectedCallback``` function in the Schema class


## Define New Rendering Engines
You can define completely different ways to render the look, feel and behaviour of these elements by creating a 
rendering file and including it after you include the Schema library itself. It is just a combination of all the 
features documented above. The example in ```renders/microdata/microdata.js``` is a fully functional rendering into 
[Microdata](https://en.wikipedia.org/wiki/Microdata_(HTML)) format.


## Base types
* view the files in ```types``` to see all available data types ready to go! It is strongly recommended that you don't alter these files, 
rather create separate definition classes of your own and then use the rendering system to override the provided types.
 

## Putting it all together
```
<body>

  <element-thing id="test" alternatename="The thing" description="the description" additionalType="myAdditionalType">Thing</element-thing>
  
  <script src="https://cdn.jsdelivr.net/gh/cloudouble/element@1.7.5/element.min.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/cloudouble/schema@1.0.0/schema.min.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/cloudouble/schema@1.0.0/renders/microdata/microdata.min.js"></script>
  <script>
          window.LiveElement.Element.load( window.LiveElement.Schema.CoreTypes.concat(window.LiveElement.Schema.DataTypes), `https://cdn.jsdelivr.net/gh/cloudouble/schema@1.0.0/types`).then(() => {
              
            console.log(`Loaded! \n\nCustom tags available are: \n${Object.keys(window.LiveElement.Element.classes).join(', ')}`)
            
            window.test = document.getElementById('test')
            window.test.addEventListener('schema-input', event => {
              console.log(event)
            })
            
          })
  </script>
</body>

```


## Auto-generating datatype classes from [schema.org](https://schema.org/)
* run the ```types/_crawler.py``` script to read and auto-generate all datatype definitions for a given [schema.org](https://schema.org/) release version. 
* change the ```types/_template.html``` file to generate different class structure


## Further Reading 

[Web Components at MDN](https://developer.mozilla.org/en-US/docs/Web/Web_Components)

[Schema.org](https://schema.org)

[Schema.org types list](https://schema.org/docs/full.html)


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)
