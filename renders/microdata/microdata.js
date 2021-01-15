window.LiveElement.Schema.Validators = {...window.LiveElement.Schema.Validators, ...{
    
}}

window.LiveElement.Schema.ValidatorMap = {...window.LiveElement.Schema.ValidatorMap, ...{
    
}}

window.LiveElement.Schema.ClassMap = {...window.LiveElement.Schema.ClassMap, ...{
    
}}

window.LiveElement.Schema.Renders = {...window.LiveElement.Schema.Renders, ...{
    schema: (element, asClass, style, template) => {
        if (element.__isConnected &&!element.hasAttribute('itemscope')) {
            element.setAttribute('itemscope', '')
        }
        if (element.__isConnected &&!!element.hasAttribute('itemtype')) {
            element.setAttribute('itemtype', `${element.constructor.__context}${element.constructor._rdfs_label}`)
        }
    }, 
    scalar: (element, asClass, style, template) => {
        var doLoad = function() {
            window.customElements.whenDefined(element.tagName.toLowerCase()).then(() => {
                if ((element.__input === undefined) || (element.__input != element.innerText)) {
                    element.__load(element.innerText)
                }
            })
        }
        var observer = new window.MutationObserver(record => { doLoad() })
        observer.observe(element, {subtree: true, characterData: true, characterDataOldValue: true})
        element.addEventListener('schema-load', event => {
            if (element.__input != element.innerText) {
                element.innerText = element.__input
            }
            if (element.__value != element.innerText) {
                element.setAttribute('content', element.__value === undefined ? '' : element.__value)
            }
        })
        if (!element.__propertyMap) {
            window.LiveElement.Schema.Renders.schema(element, asClass, style, template)
        }
    }, 
    time: {
        renderFunction: (element, asClass, style, template) => {
            window.LiveElement.Schema.Renders.scalar(element, asClass, style, template)
            if (!element.__isConnected) {
                var observer = new window.MutationObserver(record => { 
                    var contentValue = element.getAttribute('content')
                    if (contentValue != element.getAttribute('datetime')) {
                        element.setAttribute('datetime', contentValue)
                    }
                })
                observer.observe(element, {attributeFilter: ['content']})
            }
        }
    }, 
    object: (element, asClass, style, template) => {
        if (element.__isConnected && element.__map && typeof element.__map == 'object') {
            window.LiveElement.Schema.Renders.schema(element, asClass, style, template)
            Object.keys(element.__map).forEach(attributeName => {
                if (element.__map[attributeName] && typeof element.__map[attributeName].setAttribute == 'function') {
                    var attributeElement = element.shadowRoot.querySelector(`[itemprop="${attributeName}"]`)
                    if (!attributeElement) {
                        element.shadowRoot.append(element.__map[attributeName])
                        element.__map[attributeName].setAttribute('itemprop', attributeName)
                    } else {
                        attributeElement.replaceWith(element.__map[attributeName])
                    }
                }
            })
            
        }
    }
}}

window.LiveElement.Schema.RenderMap = {...window.LiveElement.Schema.RenderMap, ...{
    Text: 'scalar', 
    URL: 'scalar', 
    CssSelectorType: 'scalar', 
    XPathType: 'scalar', 
    Number: 'scalar', 
    Float: 'scalar', 
    Integer: 'scalar', 
    Time: 'time', 
    Date: 'time', 
    DateTime: 'time', 
    Boolean: 'scalar', 
    False: 'scalar', 
    True: 'scalar', 
    Thing: 'object'
}}

window.LiveElement.Schema.Errors = {...window.LiveElement.Schema.Errors, ...{
    
}}

window.LiveElement.Schema.Options = {...window.LiveElement.Schema.Options, ...{
    True: ['True', 'Yes'], 
    False: ['False', 'No'], 
    DefaultURLProtocol: 'https'
}}

