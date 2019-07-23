# Copyright 2018 Jared Boice (MIT License / Open Source)

# Uptown-Dropdown - Summarized Documentation

get the [full documentation](https://github.com/jaredboice/uptown-dropdown) at gitHub.

![List-Runner](screenshots/uptown-dropdown-logo.png 'uptown-dropdown')

## Donations - Bitcoin: 19XgiRojJnv9VDhyW9HmF6oKQeVc7k9McU 
(use this address until 2022)

## Description

**Uptown-Dropdown** is a fully customizable _react_ _dropdown_ implementation that doubles as an _expander_. It accepts a header component or a placeholder, an optional icon, and a single component for the expandable body which decouples the dropdown from a list. Uptown-Dropdown offers adjustable orientation, optional built-in animation, applied css class names for each state of the component, switches for disabling the component and externally toggling expand/collapse states, multiple trigger types including click and hover, the ability to pass custom props to custom components, and parameter injection of the expansion state to the click handler and to optional header/icon components as a key/value of props.

**Select-Inject Integration:** _(click [here](https://www.npmjs.com/package/select-inject "Select-Inject") to navigate to the select-inject npm page)_  
if you need a customizable react multi-select system, Uptown-Dropdown can be used with Select-Inject.

## Install, Import & Instantiate

**Install**

`npm install --save uptown-dropdown`

**Import**

```javascript  
import UptownDropdown from 'uptown-dropdown';

```
**Instantiation Example: Dropdown**

```javascript
// the message prop will be passed along via bodyCompProps = { message: 'hello world'}
render(){
    const BodyComp = (props) => (
            <div className="example-expander">
                <div>{props.message}</div>
                <div>stuff</div>
                <div>stuff</div>
                <div>stuff</div>
                <div>stuff</div>
                <div>stuff</div>
                <div>stuff</div>
            </div>
        );

    const IconComp = (props) => {
        if (props.expanded) {
            return <span>^</span>;
        }
        return <span>v</span>;
    };

    const bodyCompProps = { message: 'hello world' }; // strange example but you get the point
    // add calculateDimension={true} to apply height animation instead of a scale transformation - if you are applying borders set maintainOpacityOnAnime={false} 
    return (
        <section>
            <div>dude, that dropdown is so uptown</div>
            <UptownDropdown
                name="my-uptown-component"
                uid={Symbol('uptown-dropdown-render-id')}
                expanded={false} // track in your app's state as needed
                placeholder="what is thy bidding?" // start with something simple like "select"
                centerPlaceholder={true}
                linkStyles={true}
                anime={true}
                flexBasis="200px"
                maxWidth="600px"
                border="1px solid dimgray"
                borderRadius="3px"
                BodyComp={BodyComp}
                IconComp={IconComp}
                bodyCompProps={bodyCompProps}
                triggerType="clickAndHover"
            />
        </section>
    );
}
```

**Instantiation Example: Expander**

```javascript
    return (
        <section>
            <div>dude, that dropdown is so uptown</div>
            <UptownDropdown
                name="my-uptown-component"
                uid={Symbol('uptown-dropdown-render-id')}
                expanded={false} // track in your app's state as needed
                placeholder="what is thy bidding?" // start with something simple like "select"
                centerPlaceholder={true}
                linkStyles={true}
                anime={true}
                calculateDimension={true} // required for built-in animation for componentType={expander}
                flexBasis="200px"
                maxWidth="600px"
                border="1px solid dimgray"
                borderRadius="3px"
                BodyComp={BodyComp}
                IconComp={IconComp}
                bodyCompProps={bodyCompProps}
                triggerType="click"
                componentType="expander"
            />
        </section>
    );
}
```

**Props**

```javascript
UptownDropdown.propTypes = {
    name: PropTypes.string, // becomes the name for the css pivot class,
    uid: PropTypes.oneOfType([PropTypes.symbol, PropTypes.string, PropTypes.number]), // unique identifier: passing a unique id on each render ensures accurate real-time rendering when props update
    expanded: PropTypes.bool, // toggle the state externally or merely provide a default initial state
    disabled: PropTypes.bool, // when true, the body will not be expandable
    placeholder: PropTypes.oneOfType([PropTypes.element, PropTypes.string]), // text || <span>some jsx</span> that will be used if HeaderComp is not provided
    centerPlaceholder: PropTypes.bool, // center aligns the placeholder text
    linkStyles: PropTypes.bool, // applies link-appropriate styles to the header: eg. { cursor: 'pointer', userSelect: 'none'}
    customController: PropTypes.bool, // disables click events, allowing you to use your own custom click events; triggerType still applies but surrenders click events to your custom controller
    anime: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]), // (true || 'uptown-anime') || (false || 'uptown-no-anime') || 'any-custom-css-class' (css class will be dynamically applied)
    orientation: PropTypes.string, // 'vertical' || 'vertical-reverse' || 'horizontal' || 'horizontal-reverse'
    calculateDimension: PropTypes.bool, // when true (and when anime has a truthy/custom value), uptown-dropdown will calculate and apply the body max-height/max-width (vertical/horizontal) when expanded and apply 0 on collapse
    maintainOpacityOnAnime: PropTypes.bool, // when false, opacity will fade on collapse - when true, opacity will not fade on collapse
    prependIcon: PropTypes.bool, // prepends the optionally provided icon before the placeholder (it is appended after the placeholder by default)
    flexBasis: PropTypes.string, // eg. '200px' - quick-starter setting for synchronizing the flex-basis of the container, the header, and the body 
    minWidth: PropTypes.string, // eg. '200px' - quick-starter setting for synchronizing the min-width of the container, the header, and the body 
    minHeight: PropTypes.string, // eg. '200px' - quick-starter setting for synchronizing the min-height of the container, the header, and the body 
    maxWidth: PropTypes.string, // eg. '500px' - quick-starter setting for synchronizing the max-width of the container, the header, and the body (on vertical orientations)
    maxHeight: PropTypes.string, // eg. '500px' - quick-starter setting for synchronizing the max-height of the container, the header, and the body (on horizontal orientations)
    border: PropTypes.string, // eg. '1px solid dimgray' - quick-starter setting for synchronizing the border of the header and the body 
    borderRadius: PropTypes.string, eg. // '3px' - quick-starter setting for synchronizing the border-radius of the header and the body 
    boxShadow: PropTypes.string, // eg. '3px 3px 3px 3px black' - quick-starter setting for synchronizing the box-shadow of the header and the body
    hideHeader: PropTypes.bool, // hides the header from view so you can use the expanded prop to control the expansion/collapse state of the component without the header being rendered
    HeaderComp: PropTypes.oneOfType([PropTypes.element, PropTypes.func]), // custom header component - receives expanded and headerCompProps via props
    IconComp: PropTypes.oneOfType([PropTypes.element, PropTypes.func]), // custom icon component - receives expanded and iconCompProps via props
    BodyComp: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired, // the expandable body component - receives bodyCompProps via props
    headerCompProps: PropTypes.object, // optional props object passed to the optional HeaderComp
    iconCompProps: PropTypes.object, // optional props object passed to the optional IconComp
    bodyCompProps: PropTypes.object, // optional props object passed to the required BodyComp
    handleClick: PropTypes.func, // the click handler callback function - receives expanded as a parameter
    triggerType: PropTypes.string, // the different types of expansion triggers - my favorite is 'clickOrHover' (see defaultProps below)
    componentType: PropTypes.string, // 'dropdown' || 'expander' - for absolute || relative positioning of the expanded body (respectively)
    mouseOutCollapseDelay: PropTypes.number // the amount of time in milliseconds to wait prior to collapsing the body on mouseOut - eg. 1000
};
UptownDropdown.defaultProps = {
    name: 'default-uptown-dropdown-name',
    uid: null,
    expanded: false,
    disabled: false,
    placeholder: 'select',
    centerPlaceholder: false,
    linkStyles: false,
    customController: false,
    anime: false, // when true, uptown-dropdown provides built-in animation (calculateDimension is required for componentType = "expander")
    orientation: VERTICAL, // 'vertical' || 'vertical-reverse' || 'horizontal' || 'horizontal-reverse'
    calculateDimension: false, // required to be true for built-in animation of componentType = 'expander' (anime needs to be true as well)
    maintainOpacityOnAnime: null,
    prependIcon: false,
    flexBasis: null, 
    minWidth: null, // note: you will want to manually add border and (minWidth || maxWidth || minHeight || maxHeight) in your css when applying these styles together (due to dimension added by borders)
    minHeight: null,
    maxWidth: null, // note: you will want to manually add border and (minWidth || maxWidth || minHeight || maxHeight) in your css when applying these styles together (due to dimension added by borders)
    maxHeight: null,
    border: null, // note: you will want to manually add border and (minWidth || maxWidth || minHeight || maxHeight) in your css when applying these styles together (due to dimension added by borders)
    borderRadius: null,
    boxShadow: null,
    hideHeader: false,
    HeaderComp: null,
    IconComp: null,
    headerCompProps: {},
    iconCompProps: {},
    bodyCompProps: {},
    handleClick: (expanded) => {},
    triggerType: CLICK, // 'click' || 'hover' || 'clickAndHover' || 'clickOrHover' - (the preset for 'clickAndHover' basically provides an auto collapse on mouseOut)
    componentType: DROPDOWN, // 'dropdown' || 'expander'
    mouseOutCollapseDelay: MINIMUM_MOUSE_OUT_COLLAPSE_DELAY // if your provided delay time is less than the minimum (55) it will fallback to the default setting
};
```