# Copyright 2018 Jared Boice (MIT License / Open Source)

# Uptown-Dropdown - Summarized Documentation

get the [full documentation](https://github.com/jaredboice/uptown-dropdown) at gitHub.

## Description

**Uptown-Dropdown** is a fully customizable _react_ _dropdown_ implementation that doubles as an _expander_. It accepts a header component or a placeholder, an optional icon, and a single component for the expandable body which decouples the dropdown from a list. Uptown-Dropdown offers optional built-in animation, applied css class names for each state of the component, switches for disabling the component and externally toggling expand/collapse states, multiple trigger types including click and hover, the ability to pass custom props to custom components, and parameter injection of the expansion state to the click handler and to optional header/icon components as a key/value of props.

## Install, Import & Instantiate

**Install**

`npm install --save uptown-dropdown`

**Import**

_importing the commonly needed classes_
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
    return (
        <section>
            <div>dude, that dropdown is so uptown</div>
            <UptownDropdown
                name="my-uptown-component"
                expanded={false} // track in your app's state as needed
                placeholder="uptown dropdown" // start with something simple like "select"
                centerPlaceholder={true}
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
                expanded={false} // track in your app's state as needed
                placeholder="uptown dropdown" // start with something simple like "select"
                centerPlaceholder={true}
                anime={true}
                calculateDimension={true}
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
    expanded: PropTypes.bool, // toggle the state externally or merely provide a default initial state
    disabled: PropTypes.bool, // when false, the body will not be expandable
    placeholder: PropTypes.string, // text that will be used if HeaderComp is not provided
    centerPlaceholder: PropTypes.bool, // center aligns the placeholder text
    anime: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]), // (true || '__anime') || (false || '__no-anime') || 'any-custom-css-class' (css class will be dynamically applied)
    calculateDimension: PropTypes.bool, // when true (and when anime is true), during animations uptown-dropdown will calculate and apply the body height (or width with a future update) when expanded and apply 0 on collapse
    flexBasis: PropTypes.string, // eg. '200px' - quick-starter setting for synchronizing the flex-basis of the container, the header, and the body 
    maxWidth: PropTypes.string, // eg. '600px' - quick-starter setting for synchronizing the max-width of the container, the header, and the body 
    border: PropTypes.string, // eg. '1px solid dimgray' - quick-starter setting for synchronizing the border of the header and the body 
    borderRadius: PropTypes.string, eg. // '3px' - quick-starter setting for synchronizing the border-radius of the header and the body 
    boxShadow: PropTypes.string, // eg. '3px 3px 3px 3px black' - quick-starter setting for synchronizing the box-shadow of the header and the body
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
    expanded: false,
    disabled: false,
    placeholder: 'select',
    centerPlaceholder: false,
    anime: false, // when true, uptown-dropdown provides built-in animation (calculateDimension is required for componentType = "expander")
    calculateDimension: false, // required to be true for built-in animation of componentType = 'expander' (anime needs to be true as well)
    flexBasis: null,
    maxWidth: null,
    border: null,
    borderRadius: null,
    boxShadow: null,
    HeaderComp: null,
    IconComp: null,
    headerCompProps: {},
    iconCompProps: {},
    bodyCompProps: {},
    handleClick: () => {},
    triggerType: CLICK, // 'click' || 'hover' || 'clickAndHover' || 'clickOrHover' - (the preset for 'clickAndHover' basically provides an auto collapse on mouseOut)
    componentType: DROPDOWN, // 'dropdown' || 'expander'
    mouseOutCollapseDelay: MINIMUM_MOUSE_OUT_COLLAPSE_DELAY // if your provided delay time is less than the minimum (55) it will fallback to the default setting
};
```