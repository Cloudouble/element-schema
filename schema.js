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
    Validators: {configurable: false, enumerable: true, writable: true, value: Object.defineProperties({}, {
            True: {configurable: false, enumerable: true, writable: false, value: function(input, propertyMap={}) {
                var result = window.LiveElement.Schema.Validators.Schema(input, propertyMap)
                result.valid = window.LiveElement.Schema.Options.True && typeof window.LiveElement.Schema.Options.True == 'object' 
                    && window.LiveElement.Schema.Options.True.constructor.name == 'Array' ? window.LiveElement.Schema.Options.True.includes(input) : !!input
                result.value = true
                if (!result.valid) {
                    result.error = `True values with an allow list must have an input matching an option in the allow list`
                }
                return result
            }}, 
            False: {configurable: false, enumerable: true, writable: false, value: function(input, propertyMap={}) {
                var result = window.LiveElement.Schema.Validators.Schema(input, propertyMap)
                result.valid = window.LiveElement.Schema.Options.False && typeof window.LiveElement.Schema.Options.False == 'object' 
                    && window.LiveElement.Schema.Options.False.constructor.name == 'Array' ? window.LiveElement.Schema.Options.False.includes(input) : !!input
                result.value = false
                if (!result.valid) {
                    result.error = `False values with an allow list must have an input matching an option in the allow list`
                }
                return result
            }}, 
            Boolean: {configurable: false, enumerable: true, writable: false, value: function(input, propertyMap={}) {
                var result = window.LiveElement.Schema.Validators.Schema(input, propertyMap)
                var trueList = window.LiveElement.Schema.Options.True || []
                var falseList = window.LiveElement.Schema.Options.False || []
                var allowList = trueList.concat(falseList)
                result.valid = allowList.length ? allowList.includes(input) : !!input
                result.value = allowList.length && result.valid ? trueList.includes(input) : !!input
                if (!result.valid) {
                    result.error = `Boolean values with an allow list must have an input matching an option in the allow list`
                }
                return result
            }}, 
            DateTime: {configurable: false, enumerable: true, writable: false, value: function(input, propertyMap={}) {
                var result = window.LiveElement.Schema.Validators.Schema(input, propertyMap)
                var regex = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(\.[0-9]{3})?(Z)?$/
                result.valid = regex.test(String(input))
                result.value = (new Date(Date.parse(String(input)))).toJSON() || undefined
                if (!result.valid) {
                    result.error = `DateTime input must be a parseable date string ideally in ISO8601 DateTime format [-]CCYY-MM-DDThh:mm:ss[Z|(+|-)hh:mm]`
                }
                return result
            }}, 
            Date: {configurable: false, enumerable: true, writable: false, value: function(input, propertyMap={}) {
                var result = window.LiveElement.Schema.Validators.Schema(input, propertyMap)
                var regex = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])$/
                result.valid = regex.test(String(input))
                result.value = (new Date(Date.parse(String(input)))).toJSON() || undefined
                if (result.value) {
                    result.value = result.value.split('T').shift()
                }
                if (!result.valid) {
                    result.error = `Date input must be a parseable date string ideally in ISO8601 DateTime format [-]CCYY-MM-DD`
                }
                return result
            }}, 
            Time: {configurable: false, enumerable: true, writable: false, value: function(input, propertyMap={}) {
                var result = window.LiveElement.Schema.Validators.Schema(input, propertyMap)
                var regex = /^(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(\.[0-9]{3})?(Z)?$/
                result.valid = regex.test(String(input))
                result.value = result.valid ? input : String(input).toLowerCase().replace(/[^0-9\:apmz]/g, '')
                if (!result.valid) {
                    var d = new Date()
                    var valueSplit = result.value.split(':')
                    var hours = valueSplit.shift()
                    hours = result.value.indexOf('pm') > -1 ? hours + 12 : hours + 0
                    hours = hours > 23 ? 0 : hours
                    d.setHours(hours)
                    var minutes = valueSplit.shift()
                    d.setMinutes(minutes ? parseInt(minutes, 10) || 0 : 0)
                    var seconds = valueSplit.shift()
                    d.setMinutes(seconds ? parseInt(seconds, 10) || 0 : 0)
                    var millseconds = parseInt(result.value.split(':').pop(), 10) || 0
                    d.setMilliseconds(millseconds ? parseInt(millseconds, 10) || 0 : 0)
                    result.value = d.toJSON().split('T').pop() 
                    result.error = `Time input must be a parseable time string ideally in ISO8601 DateTime format hh:mm:ss[Z|(+|-)hh:mm]`
                }
                return result
            }}, 
            Integer: {configurable: false, enumerable: true, writable: false, value: function(input, propertyMap={}) {
                var result = window.LiveElement.Schema.Validators.Schema(input, propertyMap)
                var floatVal = parseFloat(input)
                var intVal = parseInt(input, 10)
                result.valid = !Number.isNaN(floatVal) && (intVal == floatVal)
                if (result.valid) {
                    result.value = intVal
                } else {
                    result.error = `Integer input must be able to be cast to a Integer without a change in their value`
                }
                return result
            }}, 
            Float: {configurable: false, enumerable: true, writable: false, value: function(input, propertyMap={}) {
                var result = window.LiveElement.Schema.Validators.Schema(input, propertyMap)
                var floatVal = parseFloat(input)
                result.valid = !Number.isNaN(floatVal)
                if (result.valid) {
                    result.value = floatVal
                } else {
                    result.error = `Float input must be able to be cast to a Float`
                }
                return result
            }}, 
            Number: {configurable: false, enumerable: true, writable: false, value: function(input, propertyMap={}) {
                var result = window.LiveElement.Schema.Validators.Schema(input, propertyMap)
                var floatVal = parseFloat(input)
                result.valid = !Number.isNaN(floatVal)
                if (result.valid) {
                    var intVal = parseInt(input, 10)
                    result.value = floatVal == intVal ? intVal : floatVal
                } else {
                    result.error = `Number input must be able to be cast to a Float or Integer number`
                }
                return result
            }}, 
            XPathType: {configurable: false, enumerable: true, writable: false, value: function(input, propertyMap={}) {
                var result = window.LiveElement.Schema.Validators.Schema(input, propertyMap)
                result.value = String(input)
                result.valid = typeof value == 'string'
                if (!result.valid) {
                    result.error = `XPathType input must be strings not ${typeof input}`
                }
                return result
            }}, 
            CssSelectorType: {configurable: false, enumerable: true, writable: false, value: function(input, propertyMap={}) {
                var result = window.LiveElement.Schema.Validators.Schema(input, propertyMap)
                result.value = String(input)
                result.valid = typeof value == 'string'
                if (!result.valid) {
                    result.error = `CssSelectorType input must be strings not ${typeof input}`
                }
                return result
            }}, 
            URL: {configurable: false, enumerable: true, writable: false, value: function(input, propertyMap={}) {
                var result = window.LiveElement.Schema.Validators.Schema(input, propertyMap)
                var string_input = String(input)
                result.valid = (new RegExp('^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?')).test(string_input)
                result.value = result.valid ? string_input : `https:\/\/${string_input.replace('https:\/\/', '').replace('http:\/\/', '')}`
                if (!result.valid) {
                    result.error = `URL input should conform to the Regular Expression ${'^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?'}`
                }
                return result
            }}, 
            Text: {configurable: false, enumerable: true, writable: false, value: function(input, propertyMap={}) {
                var result = window.LiveElement.Schema.Validators.Schema(input, propertyMap)
                result.value = String(input)
                result.valid = typeof value == 'string'
                if (!result.valid) {
                    result.error = `Text input must be strings not ${typeof input}`
                }
                return result
            }},         
            Schema: {configurable: false, enumerable: true, writable: false, value: function(input, propertyMap={}) {
                return {input: input, value: input, valid: true, error: undefined}
            }}
        })
    }, 
    ValidatorMap: {configurable: false, enumerable: true, writable: true, value: Object.defineProperties({}, {
            Schema: {configurable: false, enumerable: true, writable: false, value: 'Schema'}
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
        if (propertyMap && typeof propertyMap == 'object' && typeof propertyMap.container == 'object' && propertyMap.container.constructor._rdfs_label && typeof propertyMap.types == 'object' && typeof propertyMap.types.some == 'function') {
            var containerInheritance = window.LiveElement.Element.getInheritance(propertyMap.container.constructor)
            var typeSpecificity = window.LiveElement.Element.getTypeSpecificity(propertyMap.types)
            var validators = Object.assign({}, propertyMap.types.map(t => ({[t]: window.LiveElement.Schema.getValidator(
                propertyMap.propertyName, window.LiveElement.Element.getInheritance(window.LiveElement.Element.elements[t]), containerInheritance, propertyMap
            )})))
            var thisType = 'Schema'
            var validationResults = {}
            var validationResult = {}
            typeSpecificity.some(t => {
                if (typeof validators[t] == 'function') {
                    validationResults[t] = validators[t](propertyMap.value, propertyMap)
                    validationResult = validationResults[t]
                    if (validationResults[t] && validationResults[t].valid) {
                        thisType = t
                        return true
                    }
                }
            })
            var renderer = window.LiveElement.Schema.getRenderer(propertyMap.propertyName, window.LiveElement.Element.getInheritance(window.LiveElement.Element.elements[thisType]), containerInheritance, propertyMap)
            var propertyTag = window.LiveElement.Element.tags[renderer] || window.LiveElement.Element.tags[thisType] || window.LiveElement.Element.tags.Schema
            var propertyElement = propertyTag && window.LiveElement.Element.classes[propertyTag] ? document.createElement(propertyTag) : undefined
            if (propertyMap.container) {
                propertyMap.container.__input = propertyMap.container.__input || {}
                propertyMap.container.__input[propertyMap.propertyName] = propertyMap.value
                propertyMap.container.__map[propertyMap.propertyName] = propertyElement
                var eventPropertyMap = {...propertyMap, ...{validation: validationResult, thisType: thisType}}
                propertyMap.container.dispatchEvent(new window.CustomEvent('schema-setproperty', {detail: eventPropertyMap}))
                if (validationResult.error) {
                    propertyMap.container.dispatchEvent(new window.CustomEvent('schema-setproperty-error', {detail: eventPropertyMap}))
                }
            }
            if (propertyElement) {
                propertyElement.__load(propertyMap.value, thisType, propertyMap, validationResults)
                if (propertyMap.container && typeof propertyMap.container.__renderProperty == 'function') {
                    propertyMap.container.__renderProperty(propertyElement, propertyMap.propertyName, propertyMap.container, propertyMap)
                }
            } 
        }
    }}
})

