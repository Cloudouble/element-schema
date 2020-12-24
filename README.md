# element-schema
A set of custom html elements to render all schema.org datatypes, includes ability to define your own HTML rendering engines and themes.

## Installation
* install [element](https://github.com/Cloudouble/element) as a prerequisite
* needs to be loaded with ```window.Cloudouble.Element.load()``` as per the following example: 

```
return window.Cloudouble.Element.load(['schema'], `${baseUrl}/schema`, 'cloudouble-element-schema').then(() => {
	return window.Cloudouble.Element.elements.Schema.__initialise(
		`${baseUrl}/schema`, 'cloudouble-element-schema', [], 
		['Myrenderingengine', `${baseUrl}/schema/renders`, 'cloudouble-element-schema'], 
		['Mytheme', `${baseUrl}/mytheme`, 'mytheme'], ['mythemetext'], 
		{__useShadow: true, __markdownConverter: showdown ? new showdown.Converter() : undefined}
	)
})
```

* see the documentation for [element](https://github.com/Cloudouble/element) to understand the arguments for ```window.Cloudouble.Element.load()```


## Arguments for ```window.Cloudouble.Element.elements.Schema.__initialise(schemaBaseUrl, schemaPrefix, schemaCoreElements, renderingEngineOptions, themeOptions, themeElements, options)```

**schemaBaseUrl** => the path to the directory containing the core files plus the child ```types``` directory with the base type definitions and the ```properties.json``` file

**schemaPrefix** => the default prefix to use for the core class and base types

**schemaCoreElements** => any extra core elements you wish to load, maybe you have extended it in some way? Here's where to load your extension class

**renderingEngineOptions** => an array of rending engine name (the class name), the path of the directory to find it's definition file in, and it's prefix

**themeOptions** => an array of theme name (the class name), the path of the directory to find it's definition file in, and the prefix to use for theme-specific elements

**themeElements** => an array of element names to load from your theme directory (not including the theme definition itself which has already been loaded)

**options** => a map of properties to load up as static properties of the Schema class. ```useShadow``` is true to put all markup into elements shadowDom, ```__markdownConverter``` is an object to 
use to conversion of Markdown syntax found in schema.org property comments. You may put other properties here if you have extended the Schema class in some way.

Note that the ```__initialise``` method automatically loads the files ```schemadatatypes.html```, ```schemarender.html```, ```schematheme.html``` and ```schemavalidators.html```, 
so no need to load them manually


## Core emitted events from all elements

**attributeValidationError** => emitted when an invalid attribute value is set. The value remains but the error event is emitted with the following
```detail```: ```{attribute: 'the attribute name', value: 'the given value', element: 'the containing element', asType: 'the type being used for this attribute', validation: 'see below'}```

**attributeTypeError** => emitted when an the attribute value is the wrong type for the property. The value remains but the error event is emitted with the following
```detail```: ```{attribute: 'the attribute name', value: 'the given value', element: 'the containing element', asType: 'the type being used for this attribute', error: 'an error message containing a list of valid types for this property'}```

**attributeSet** => emitted when an attribute value is set. This is emitted even if the value is the wrong type or invalid. The following detail is included
```detail```: ```{attribute: 'the attribute name', value: 'the given value', element: 'the containing element', asType: 'the type being used for this attribute'}```

**modelLoadError** => emitted when an invalid model is attempted to be loaded into an element via the ```__load``` method. The ```detail``` object has the following structure: 
```{model: 'the model data', message: 'a message letting you know what a valid model might be', asAttribute: 'an object present if this is being loaded as an attribute value of a parent element', bottomUp: 'true if this has been triggered by propagation from a child element'}```

**modelLoad** => emitted when a model is loaded into an element via the ```__load``` method. The ```detail``` object has the following structure: 
```{model: 'the model data', message: 'a message letting you know what a valid model might be', asAttribute: 'an object present if this is being loaded as an attribute value of a parent element', bottomUp: 'true if this has been triggered by propagation from a child element'}```

Note: the ```validation``` property of any event ```detail``` object has the following structure: 
``` {attribute: 'the attribute name', 'the given value': value, coerced: 'a forced-valid value if possible, otherwise undefined', valid: 'true if valid as given', message: 'a message why it is invalid or undefined if valid'}```


## Creating rendering engines

* You can compare with the Microdata rendering engine available at ```renders/microdata.html```
* extend the ```Schemarender``` class
* A rendering engine should focus on HTML structure, not look and feel - if yours is getting too complicated, you're probably doing it wrong
* include a ```__editmode``` method which can customize how to shift to and from 'editmode' when the containing element's ```__editmode``` attribute is set. 
It takes arguments ```root```: the HTML node which is the root of the element's tree, and ```value``` which is the actual current value of ```__editmode```. Basically 
you want to take care that all child elements are also being toggled in/out of editmode when their parent is, the selector to do that is rendering engine dependent hence 
the need make it possible to override this.
* include a ```__matchAttributeElement``` method which takes care of how child elements rendering attribute values are handled, both finding existing attribute elements and creating new ones if not found.
If takes arguments ```attributeName, attributeValue, expectedAttributeTag, containerElement``` which should be self explanatory, and returns an array of matched / new elements for the attribute.
* include a Schema method which takes care of the base behaviour of all element rendering. It takes arguments of ```element``` (the live element object), 
* ```model``` (the data model of the element) and ```asAttribute``` (an object with properties showing if this element is an attribute element of a parent) and returns the element.


## Creating themes

* extend the ```Schematheme``` class
* include any helper functions specific to your theme as static methods
* for each datatype you wish to override the presentation of include a static property with it's value being the name of the overriding class e.g. 
```

static Text = 'Mythemetext'

```
Now whenever an element is being rendered that matches a datatype of ```Text``` your ```Mythemetext``` class with be used instead. ```Mythemetext``` should be a custom class which extends ```Text```


## Custom data validation

* in the ```schemavalidators``` class you can see an example of a custom validation there, you can create a custom class extending ```Schemavalidators``` to create your own validation functions. 
* set the name of your custom class as the static property of ```window.Cloudouble.Element.elements.Schema.__validatorName``` prior to called ```__activate```
* register the validator function for a property in the static ```_map``` property of your custom class. Each key of that map has as it's value a list of the properties that will 
use it as their validation function
* each validator function can be called whatever you like, as long as it takes the arguments ```attribute, value, allow=undefined```. 
```attribute``` is the name of the attribute being set, ```value``` is the value being set, ```allow``` is an optional list of allowed values
* it must return an object with the same structure as the ```validation``` property of emitted events (see above)
* the philosophy is to let the user know if the given value is invalid, and suggest a valid value if not, but leave the choice to change the given value up to the user


## Customing property labels
* the ```types/properties.json``` has a map of all available schema.org properties


## Edit mode
* all elements can be toggled in/out of editmode by setting their ```__editmode``` attribute accordingly
* actual behaviour is dependent on the rendering engine, but the base CSS includes a line to hide ```slot``` elements while editmode in on, and to show elements with a class of ```editmode``` 
when editmode is active (and hide them when editmode is inactive)
* to update the model of an object, call it's ```___load``` method with the new value, for example from within the ```connectedCallback``` method of a custom Text class: 
```
    var editmodeInput = $this.shadowRoot.querySelector('input.editmode')
    if (editmodeInput) {
        editmodeInput.addEventListener('change', event => {
            $this.__load(editmodeInput.value, true)
        })
    }
```

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
