window.LiveElement = window.LiveElement || {}
window.LiveElement.Schema = window.LiveElement.Schema || Object.defineProperties({}, {
    CoreTypes: {configurable: false, enumerable: true, writable: true, value: ['Thing', 'Intangible', 'Class', 'DataType', 'PronounceableText']}, 
    DataTypes: {configurable: false, enumerable: true, writable: true, value: ['True', 'False', 'Boolean', 'DateTime', 'Date', 'Time', 'Integer', 'Float', 'Number', 'XPathType', 'CssSelectorType', 'URL']}, 
    ThemeName: {configurable: false, enumerable: true, writable: true, value: 'Theme'}, 
    RenderName: {configurable: false, enumerable: true, writable: true, value: 'Render'}, 
    Options: {configurable: false, enumerable: true, writable: true, value: {UseShadow: false, MarkDownConvert: undefined}}
})


document.body.addEventListener('attributeSet', event => {
	if (event.detail && event.detail.element && event.detail.asType) {
	    var expectedAttributeTag = window.Cloudouble.Element.elements[window.LiveElement.Schema.ThemeName] && window.Cloudouble.Element.elements[window.LiveElement.Schema.ThemeName][event.detail.asType]
	            && window.Cloudouble.Element.elements[window.Cloudouble.Element.elements[window.LiveElement.Schema.ThemeName][event.detail.asType]]
	        ? `${window.Cloudouble.Element.elements[window.Cloudouble.Element.elements[window.LiveElement.Schema.ThemeName][event.detail.asType]].__prefix}-${window.Cloudouble.Element.elements[window.LiveElement.Schema.ThemeName][event.detail.asType].toLowerCase()}`
	        : `${this.__prefix}-${event.detail.asType.toLowerCase()}`
	    var attributeElements = []
        if (window.Cloudouble.Element.elements[window.LiveElement.Schema.RenderName] && typeof window.Cloudouble.Element.elements[window.LiveElement.Schema.RenderName].__matchAttributeElement == 'function') {
            attributeElements = window.Cloudouble.Element.elements[window.LiveElement.Schema.RenderName].__matchAttributeElement(event.detail.attribute, event.detail.value, expectedAttributeTag, event.detail.element)
        }
        attributeElements.forEach((attributeElement, index) => {
	        var editmodeValue = event.detail.element.getAttribute('__editmode')
	        if (editmodeValue) {
		        attributeElement.setAttribute('__editmode', editmodeValue)
                attributeElement.__helperSetEditMode(editmodeValue)
	        }
	        var indexValue = event.detail.value && typeof event.detail.value == 'object' && event.detail.value.constructor.name == 'Array' && attributeElements.length == event.detail.value 
	            ? event.detail.value[index] : event.detail.value
            if (attributeElement.__model != indexValue) {
    		    attributeElement.__load(indexValue, {asAttributeName: event.detail.attribute, asAttributeOf: event.detail.element})
            }
		    attributeElement.addEventListener('modelLoad', loadEvent => {
		        if (event.detail.element.__model && typeof event.detail.element.__model == 'object') {
		            if (JSON.stringify(event.detail.element.__model[event.detail.attribute]) != JSON.stringify(loadEvent.detail.model)) {
    		            event.detail.element.__model[event.detail.attribute] = loadEvent.detail.model
    		            event.detail.element.__load(event.detail.element.__model, true)
		            }
		        }
		    })
        })
	}
})
document.body.addEventListener('modelLoad', event => {
	if (event.detail && event.detail.element && typeof event.detail.element.__renderer == 'object' && event.detail.element.__renderer.constructor && event.detail.element.__renderer.constructor.name == 'Array') {
        event.detail.element.__renderer.forEach(renderFunction => typeof renderFunction == 'function' ? renderFunction(event.detail.element, event.detail.element.__model, event.detail.asAttribute) : null)
	}
})
document.body.addEventListener('attributeTypeError', event => {
})
document.body.addEventListener('attributeValidationError', event => {
})


/*
window.LiveElement.Schema.DataTypes = window.LiveElement.Schema.DataTypes || Object.defineProperties({}, {
    True: {configurable: false, enumerable: true, writable: false, value: class True extends window.LiveElement.Schema.DataType {
        constructor(input, allow) {
            super(input, allow)
            this.valid = allow && typeof allow == 'object' && allow.constructor.name == 'Array' ? allow.includes(input) : !!input
            this.value = true
            if (!this.valid) {
                this.message = `True values with an allow list must have an input matching an option in the allow list`
            }
            Object.freeze(this)
        }
    }}, 
    False: {configurable: false, enumerable: true, writable: false, value: class False extends window.LiveElement.Schema.DataType {
        constructor(input, allow) {
            super(input, allow)
            this.valid = allow && typeof allow == 'object' && allow.constructor.name == 'Array' ? allow.includes(input) : !input
            this.value = false
            if (!this.valid) {
                this.message = `False values with an allow list must have an input matching an option in the allow list`
            }
            Object.freeze(this)
        }
    }}, 
    Boolean: {configurable: false, enumerable: true, writable: false, value: class Boolean extends window.LiveElement.Schema.DataType {
        constructor(input, allow) {
            super(input, allow)
            this.valid = allow && typeof allow == 'object' && allow.constructor.name == 'Array' ? allow.includes(this) : true
            this.value = !!input
            if (!this.valid) {
                this.message = `Boolean values with an allow list must have an input matching an option in the allow list`
            }
            Object.freeze(this)
        }
    }}, 
    DateTime: {configurable: false, enumerable: true, writable: false, value: class DateTime extends window.LiveElement.Schema.DataType {
        constructor(input, allow) {
            super(input, allow)
            var regex = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(\.[0-9]{3})?(Z)?$/
            this.valid = regex.test(String(input))
            this.value = (new Date(Date.parse(String(input)))).toJSON() || undefined
            if (!this.valid) {
                this.message = `DateTime input must be a parseable date string ideally in ISO8601 DateTime format [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]`
            }
            Object.freeze(this)
        }
    }}, 
    Date: {configurable: false, enumerable: true, writable: false, value: class Date extends window.LiveElement.Schema.DataType {
        constructor(input, allow) {
            super(input, allow)
            var regex = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])$/
            this.valid = regex.test(String(input))
            this.value = (new Date(Date.parse(String(input)))).toJSON() || undefined
            if (this.value) {
                this.value = this.value.split('T').shift()
            }
            if (!this.valid) {
                this.message = `Date input must be a parseable date string ideally in ISO8601 DateTime format [-]CCYY-MM-DD`
            }
            Object.freeze(this)
        }
    }}, 
    Time: {configurable: false, enumerable: true, writable: false, value: class Time extends window.LiveElement.Schema.DataType {
        constructor(input, allow) {
            super(input, allow)
            var regex = /^(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(\.[0-9]{3})?(Z)?$/
            this.valid = regex.test(String(input))
            this.value = this.valid ? input : String(input).toLowerCase().replace(/[^0-9\:apmz]/g, '')
            if (!this.valid) {
                var d = new Date()
                var valueSplit = this.value.split(':')
                var hours = valueSplit.shift()
                hours = this.value.indexOf('pm') > -1 ? hours + 12 : hours + 0
                hours = hours > 23 ? 0 : hours
                d.setHours(hours)
                var minutes = valueSplit.shift()
                d.setMinutes(minutes ? parseInt(minutes, 10) || 0 : 0)
                var seconds = valueSplit.shift()
                d.setMinutes(seconds ? parseInt(seconds, 10) || 0 : 0)
                var millseconds = parseInt(this.value.split(':').pop()) || 0
                d.setMilliseconds(millseconds ? parseInt(millseconds, 10) || 0 : 0)
                this.value = d.toJSON().split('T').pop() 
                this.message = `Time input must be a parseable time string ideally in ISO8601 DateTime format hh:mm:ss[Z|(+|-)hh:mm]`
            }
            Object.freeze(this)
        }
    }}, 
    Integer: {configurable: false, enumerable: true, writable: false, value: class Integer extends window.LiveElement.Schema.DataType {
        constructor(input, allow) {
            super(input, allow)
            var floatVal = parseFloat(input)
            var intVal = parseInt(input)
            this.valid = !Number.isNaN(floatVal) && (intVal == floatVal)
            if (this.valid) {
                this.value = intVal
            } else {
                this.message = `Integer input must be able to be cast to a Integer without a change in their value`
            }
            Object.freeze(this)
        }
    }}, 
    Float: {configurable: false, enumerable: true, writable: false, value: class Float extends window.LiveElement.Schema.DataType {
        constructor(input, allow) {
            super(input, allow)
            var floatVal = parseFloat(input)
            this.valid = !Number.isNaN(floatVal)
            if (this.valid) {
                this.value = floatVal
            } else {
                this.message = `Float input must be able to be cast to a Float`
            }
            Object.freeze(this)
        }
    }}, 
    Number: {configurable: false, enumerable: true, writable: false, value: class Number extends window.LiveElement.Schema.DataType {
        constructor(input, allow) {
            super(input, allow)
            var floatVal = parseFloat(input)
            this.valid = !Number.isNaN(floatVal)
            if (this.valid) {
                var intVal = parseInt(input)
                this.value = floatVal == intVal ? intVal : floatVal
            } else {
                this.message = `Number input must be able to be cast to a Float or Integer number`
            }
            Object.freeze(this)
        }
    }}, 
    XPathType: {configurable: false, enumerable: true, writable: false, value: class XPathType extends window.LiveElement.Schema.DataType {
        constructor(input, allow) {
            super(input, allow)
            this.value = String(input)
            this.valid = typeof value == 'string'
            if (!this.valid) {
                this.message = `XPathType input must be strings not ${typeof input}`
            }
            Object.freeze(this)
        }
    }}, 
    CssSelectorType: {configurable: false, enumerable: true, writable: false, value: class CssSelectorType extends window.LiveElement.Schema.DataType {
        constructor(input, allow) {
            super(input, allow)
            this.value = String(input)
            this.valid = typeof value == 'string'
            if (!this.valid) {
                this.message = `CssSelectorType input must be strings not ${typeof input}`
            }
            Object.freeze(this)
        }
    }}, 
    URL: {configurable: false, enumerable: true, writable: false, value: class URL extends window.LiveElement.Schema.DataType {
        constructor(input, allow) {
            super(input, allow)
            var string_input = String(input)
            this.valid = (new RegExp('^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?')).test(string_input)
            this.value = this.valid ? string_input : `https:\/\/${string_input.replace('https:\/\/', '').replace('http:\/\/', '')}`
            if (!this.valid) {
                this.message = `URL input should conform to the Regular Expression ${'^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?'}`
            }
            Object.freeze(this)
        }
    }}, 
    CssSelectorType: {configurable: false, enumerable: true, writable: false, value: class CssSelectorType extends window.LiveElement.Schema.DataType {
        constructor(input, allow) {
            super(input, allow)
            this.value = String(input)
            this.valid = typeof value == 'string'
            if (!this.valid) {
                this.message = `Text input must be strings not ${typeof input}`
            }
            Object.freeze(this)
        }
    }}
})*/