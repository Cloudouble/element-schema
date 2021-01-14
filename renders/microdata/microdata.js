window.LiveElement.Schema.Validators = {...window.LiveElement.Schema.Validators, ...{
    
}}

window.LiveElement.Schema.ValidatorMap = {...window.LiveElement.Schema.ValidatorMap, ...{
    
}}

window.LiveElement.Schema.ClassMap = {...window.LiveElement.Schema.ClassMap, ...{
    
}}

window.LiveElement.Schema.Renders = {...window.LiveElement.Schema.Renders, ...{
    scalar: {
        renderFunction: (element, asClass, style, template) => {
            var doLoad = function() {
                element.__load(element.innerText)
                if (element.__value != element.__input) {
                    element.setAttribute('content', element.__value || '')
                }
            }
            if (element && element.__isConnected) {
                doLoad()
            } else if (element) {
                var observer = new window.MutationObserver(record => { doLoad() })
                observer.observe(element, {subtree: true, characterData: true, characterDataOldValue: true});
            }
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
    Time: 'scalar', 
    Date: 'scalar', 
    DateTime: 'scalar', 
    Boolean: 'scalar', 
    False: 'scalar', 
    True: 'scalar'
}}

window.LiveElement.Schema.Errors = {...window.LiveElement.Schema.Errors, ...{
    
}}

window.LiveElement.Schema.Options = {...window.LiveElement.Schema.Options, ...{
    True: ['True', 'Yes'], 
    False: ['Faluse', 'No'], 
    DefaultURLProtocol: 'https'
}}

