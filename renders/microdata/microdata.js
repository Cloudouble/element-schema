window.LiveElement.Schema.Validators = {...window.LiveElement.Schema.Validators, ...{
    
}}

window.LiveElement.Schema.ValidatorMap = {...window.LiveElement.Schema.ValidatorMap, ...{
    
}}

window.LiveElement.Schema.ClassMap = {...window.LiveElement.Schema.ClassMap, ...{
    
}}

window.LiveElement.Schema.Renders = {...window.LiveElement.Schema.Renders, ...{
    scalar: {
        renderFunction: (element, asClass, style, template) => {
            if (element && element.__isConnected) {
                element.__load(element.innerText)
            } else if (element) {
                var observer = new window.MutationObserver(record => element.__load(element.innerText))
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
    Time: 'scalar'
}}

window.LiveElement.Schema.Errors = {...window.LiveElement.Schema.Errors, ...{
    
}}

window.LiveElement.Schema.Options = {...window.LiveElement.Schema.Options, ...{
    
}}

