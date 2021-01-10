window.LiveElement = window.LiveElement || {}
window.LiveElement.Schema = window.LiveElement.Schema || Object.defineProperties({}, {
    CoreTypes: {configurable: false, enumerable: true, writable: true, value: ['Thing', 'Intangible', 'Class', 'DataType', 'PronounceableText']}, 
    DataTypes: {configurable: false, enumerable: true, writable: true, value: ['True', 'False', 'Boolean', 'DateTime', 'Date', 'Time', 'Integer', 'Float', 'Number', 'XPathType', 'CssSelectorType', 'URL']}, 
    Options: {configurable: false, enumerable: true, writable: true, value: {UseShadow: false, MarkDownConvert: undefined}}, 
    parseMap: {configurable: false, enumerable: true, writable: true, value: function(mapObject, ownPropertyName, ownInheritance, containerInheritance, propertyMap){
        var t
        var target = mapObject.Schema
        if (containerInheritance && containerInheritance.some(containerClassName => {
            t = containerClassName
            return mapObject[containerClassName] && typeof mapObject[containerClassName] == 'object' && mapObject[containerClassName][ownPropertyName]
        })) {
            // this propertyName can be found as a propertyName in any ancestor container class
            target = mapObject[t][ownPropertyName]
        } else if (ownInheritance && containerInheritance) {
            ownInheritance.some(ot => {
                return containerInheritance.some(ct => {
                    if (mapObject[ct] && typeof mapObject[ct] == 'object' && mapObject[ct][ot]) {
                        // this type or one of it's ancestors can be found in any ancestor container class
                        target = mapObject[ct][ot]
                        return true
                    }
                })
            })
        }
        if (!target && mapObject[ownPropertyName]) {
            // the propertyName is directly under the root
            target = mapObject[ownPropertyName]
        } else if (!target && ownInheritance && ownInheritance.some(ot => { 
            t = ot
            return mapObject[ot]
        })) {
            // the type or one of it's ancestors is directly under the root
            target = mapObject[t]
        }
        return target || mapObject.Schema
    }}, 
    getValidator: {configurable: false, enumerable: true, writable: true, value: function(ownPropertyName, ownInheritance, containerInheritance, propertyMap){
        var validatorName = window.LiveElement.Schema.parseMap(window.LiveElement.Schema.ValidatorMap, ownPropertyName, ownInheritance, containerInheritance, propertyMap)
        return validatorName ? window.LiveElement.Schema.Validators[validatorName] : window.LiveElement.Schema.Validators.Schema
    }}, 
    getRenderer: {configurable: false, enumerable: true, writable: true, value: function(ownPropertyName, ownInheritance, containerInheritance, propertyMap){
        window.LiveElement.Schema.parseMap(window.LiveElement.Schema.RenderMap, ownPropertyName, ownInheritance, containerInheritance, propertyMap)
    }}, 
    getError: {configurable: false, enumerable: true, writable: true, value: function(ownPropertyName, ownInheritance, containerInheritance, propertyMap){
        window.LiveElement.Schema.parseMap(window.LiveElement.Schema.Errors, ownPropertyName, ownInheritance, containerInheritance, propertyMap)
    }}, 
    ValidatorMap: {configurable: false, enumerable: true, writable: true, value: Object.defineProperties({}, {
            Schema: {configurable: false, enumerable: true, writable: false, value: 'Schema'}
        })
    }, 
    Validators: {configurable: false, enumerable: true, writable: true, value: Object.defineProperties({}, {
            Schema: {configurable: false, enumerable: true, writable: false, value: function(value, propertyMap={}) {
                return true
            }}
        })
    }, 
    RenderMap: {configurable: false, enumerable: true, writable: true, value: Object.defineProperties({}, {
            Schema: {configurable: false, enumerable: true, writable: false, value: 'Schema'}
        })
    }, 
    Errors: {configurable: false, enumerable: true, writable: true, value: Object.defineProperties({}, {
            Schema: {configurable: false, enumerable: true, writable: false, value: function(value) {
                return true
            }}
        })
    }, 
    renderProperty: {configurable: false, enumerable: false, writable: false, value: function(propertyMap) {
        if (propertyMap && typeof propertyMap == 'object' && typeof propertyMap.parent == 'object' && propertyMap.parent._rdfs_label && typeof propertyMap.types == 'object' && typeof propertyMap.types.some == 'function') {
            var containerInheritance = window.LiveElement.Element.getInheritance(propertyMap.container.constructor)
            var typeSpecificity = window.LiveElement.Element.getTypeSpecificity(propertyMap.types)
            var validators = Object.assign({}, propertyMap.types.map(t => ({[t]: window.LiveElement.Schema.getValidator(
                propertyMap.propertyName, window.LiveElement.Element.getInheritance(window.LiveElement.Element.elements[t]), containerInheritance, propertyMap
            )})))
            var thisType = 'Schema'
            var validationResults = {}
            typeSpecificity.some(t => {
                if (typeof validators[t] == 'function') {
                    validationResults[t] = validators[t](propertyMap.value, propertyMap)
                    if (validationResults[t] && validationResults[t].valid) {
                        thisType = t
                        return true
                    }
                }
            })
            var renderer = window.LiveElement.Schema.getRenderer(propertyMap.propertyName, window.LiveElement.Element.getInheritance(window.LiveElement.Element.elements[thisType]), containerInheritance, propertyMap)
            var propertyTag = window.LiveElement.Element.tags[renderer]
            var propertyElement = propertyTag && window.LiveElement.Element.tags[propertyTag] ? document.createElement(window.LiveElement.Element.tags[propertyTag]) : undefined
            propertyElement.__load(propertyMap.value, thisType, propertyMap, validationResults)
            if (propertyMap.parent && typeof propertyMap.parent.__renderProperty == 'function') {
                propertyMap.parent.__renderProperty(propertyElement, propertyMap.propertyName, propertyMap)
            }
        }
    }}
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