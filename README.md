# Copyright 2018 Jared Boice (MIT License / Open Source)

# Uptown-Dropdown - Documentation

![List-Runner](screenshots/uptown-dropdown-logo.png 'uptown-dropdown')

## Description

**Uptown-Dropdown** is a fully customizable _react_ _dropdown_ implementation that doubles as an _expander_. It accepts a header component or a placeholder, an optional icon, and a single component for the expandable body which decouples the dropdown from a list. Uptown-Dropdown offers adjustable orientation, optional built-in animation, applied css class names for each state of the component, switches for disabling the component and externally toggling expand/collapse states, multiple trigger types including click and hover, the ability to pass custom props to custom components, and parameter injection of the expansion state to the click handler and to optional header/icon components as a key/value of props.

## Install, Import & Instantiate

**Install**

`npm install --save uptown-dropdown`

**Import**

```javascript  
import UptownDropdown from 'uptown-dropdown';

```
_instantiation example: dropdown_

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
                uid={Symbol('uptown-dropdown-render-id')}
                expanded={false} // track in your app's state as needed
                placeholder="what is thy bidding?" // start with something simple like "select"
                centerPlaceholder={true}
                linkStyles={true}
                anime={true}
                maxWidth="600px"
                border="1px solid dimgray"
                borderRadius="3px"
                BodyComp={BodyComp}
                IconComp={IconComp}
                bodyCompProps={bodyCompProps}
                triggerType="clickOrHover"
            />
        </section>
    );
}
```

_instantiation example: expander_

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
                calculateDimension={true}
                maxWidth="600px"
                border="1px solid dimgray"
                borderRadius="3px"
                BodyComp={BodyComp}
                IconComp={IconComp}
                bodyCompProps={bodyCompProps}
                triggerType="clickOrHover"
                componentType="expander"
            />
        </section>
    );
}
```

_props_

```javascript
UptownDropdown.propTypes = {
    name: PropTypes.string, // becomes the name for the css pivot class,
    uid: PropTypes.oneOfType([PropTypes.symbol, PropTypes.string, PropTypes.number]), // unique identifier: passing a unique id on each render ensures accurate real-time rendering when props update
    expanded: PropTypes.bool, // toggle the state externally or merely provide a default initial state
    disabled: PropTypes.bool, // when false, the body will not be expandable
    placeholder: PropTypes.string, // text that will be used if HeaderComp is not provided
    centerPlaceholder: PropTypes.bool, // center aligns the placeholder text
    linkStyles: PropTypes.bool, // applies link-appropriate styles to the header: eg. { cursor: 'pointer', userSelect: 'none'}
    customController: PropTypes.bool, // disables click events, allowing you to use your own custom click events; triggerType still applies but surrenders click events to your custom controller
    anime: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]), // (true || '__anime') || (false || '__no-anime') || 'any-custom-css-class' (css class will be dynamically applied)
    orientation: PropTypes.string, // 'vertical' || 'vertical-reverse' || 'horizontal' || 'horizontal-reverse'
    calculateDimension: PropTypes.bool, // when true (and when anime is true), during animations uptown-dropdown will calculate and apply the body max-height when expanded and apply 0 on collapse
    prependIcon: PropTypes.bool, // prepends the optionally provided icon before the placeholder (it is appended after the placeholder by default)
    flexBasis: PropTypes.string, // eg. '200px' - quick-starter setting for synchronizing the flex-basis of the container, the header, and the body 
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
    prependIcon: false, 
    flexBasis: null,
    maxWidth: null,
    maxHeight: null,
    border: null,
    borderRadius: null,
    boxShadow: null,
    hideHeader: false,
    HeaderComp: null,
    IconComp: null,
    headerCompProps: {},
    iconCompProps: {},
    bodyCompProps: {},
    handleClick: (expandedState) => {},
    triggerType: CLICK, // 'click' || 'hover' || 'clickAndHover' || 'clickOrHover' - (the preset for 'clickAndHover' basically provides an auto collapse on mouseOut)
    componentType: DROPDOWN, // 'dropdown' || 'expander'
    mouseOutCollapseDelay: MINIMUM_MOUSE_OUT_COLLAPSE_DELAY // if your provided delay time is less than the minimum (55) it will fallback to the default setting
};
```

## CSS ClassNames Applied by State

**container**

*   `uptown-${componentType} ${name}`

**HeaderComp/placeholder**

*   `__uptown-${componentType}-placeholder`

**icon**

*   `__uptown-${componentType}-icon`

**disabledStateClass** _applied on the header_

*   '\_\_uptown-disabled'
*   '\_\_uptown-enabled'

\*\*headerExpandedStateClass

*   `__uptown-${componentType}-header-on-expand`
*   `__uptown-${componentType}-header-on-collapse`

**bodyExpandedStateClass** _(applied on the body)_

*   `__uptown-${componentType}-expand`
*   `__uptown-${componentType}-collapse`

**animeStateClass** _(applied on the body)_

*   '\_\_anime'
*   '\_\_no-anime'
*   'any-custom-class-name'

**class list integration**

*   const headerClassList = `${disabledStateClass} ${headerExpandedStateClass}`;
*   const bodyClassList = `__uptown-${componentType}-body ${bodyExpandedStateClass} ${animeStateClass}`;

## Quick Starter Presets

_when provided, the following props will be applied to both the header and the body. they can then be overridden with !important styles in your css_

**flexBasis** - _also gets applied to the container_  
**maxWidth** - _also gets applied to the container_  
**border**  
**borderRadius**  
**boxShadow**  

## CSS Modification Example

**Right Aligning the Placeholder with _prependIcon_ set to true and _centerPlaceholder_ set to false**

```css
/* right-aligning the placeholder with a very large flex-grow setting */
.uptown-dropdown-container.value-of-name-prop .__uptown-dropdown-icon {
    flex: 100 0;
}
```

_note_: to apply the type of css modification above to componentType = "expander", simply replace all the instances of "dropdown" in the class lists with "expander"

## CSS Files

**dropdown css**

```css
section.uptown-dropdown-container {
    position: relative;
}

section.uptown-dropdown-container header {
    display: flex;
}

section.uptown-dropdown-container header span.__uptown-dropdown-placeholder {
    flex: 1 1;
}

section.uptown-dropdown-container header span.__uptown-dropdown-icon {
    align-self: flex-end;
    align-content: right;
}

/* expander styles and toggle animation */

/* orientation: vertical */

section.uptown-dropdown-container.uptown-orientation-vertical .__uptown-dropdown-body {
    position: absolute;
    top: 100%;
    width: 100%;
    z-index: 20;
    box-sizing: border-box;
    overflow: hidden;
}

section.uptown-dropdown-container.uptown-orientation-vertical .__uptown-dropdown-expand.__anime {
    transform: scaleY(1);
    transform-origin: center top;
    transition: all .22s ease-out;
}

section.uptown-dropdown-container.uptown-orientation-vertical .__uptown-dropdown-collapse.__anime {
    transform: scaleY(0);
    transform-origin: center top;
    transition: all .22s ease-out;
}

/* orientation: vertical-reverse */

section.uptown-dropdown-container.uptown-orientation-vertical-reverse .__uptown-dropdown-body {
    position: absolute;
    bottom: 100%;
    width: 100%;
    z-index: 20;
    box-sizing: border-box;
    overflow: hidden;
}

section.uptown-dropdown-container.uptown-orientation-vertical-reverse .__uptown-dropdown-expand.__anime {
    transform: scaleY(1);
    transform-origin: center bottom;
    transition: all .22s ease-out;
}

section.uptown-dropdown-container.uptown-orientation-vertical-reverse .__uptown-dropdown-collapse.__anime {
    transform: scaleY(0);
    transform-origin: center bottom;
    transition: all .22s ease-out;
}

/* orientation: horizontal */

section.uptown-dropdown-container.uptown-orientation-horizontal .__uptown-dropdown-body {
    position: absolute;
    left: 100%;
    top: 0%;
    z-index: 20;
    box-sizing: border-box;
    overflow: hidden;
    white-space: nowrap;
}

section.uptown-dropdown-container.uptown-orientation-horizontal .__uptown-dropdown-expand.__anime {
    transform: scaleX(1);
    transform-origin: left center;
    transition: all .22s ease-out;
}

section.uptown-dropdown-container.uptown-orientation-horizontal .__uptown-dropdown-collapse.__anime {
    transform: scaleX(0);
    transform-origin: left center;
    transition: all .22s ease-out;
}

/* orientation: horizontal-reverse */

section.uptown-dropdown-container.uptown-orientation-horizontal-reverse .__uptown-dropdown-body {
    position: absolute;
    right: 100%;
    top: 0%;
    z-index: 20;
    box-sizing: border-box;
    overflow: hidden;
    white-space: nowrap;
}

section.uptown-dropdown-container.uptown-orientation-horizontal-reverse .__uptown-dropdown-expand.__anime {
    transform: scaleX(1);
    transform-origin: right center;
    transition: all .22s ease-out;
}

section.uptown-dropdown-container.uptown-orientation-horizontal-reverse .__uptown-dropdown-collapse.__anime {
    transform: scaleX(0);
    transform-origin: right center;
    transition: all .22s ease-out;
}

/* no anime */

section.uptown-dropdown-container .__uptown-dropdown-expand.__no-anime {
    display: flex;
}

section.uptown-dropdown-container .__uptown-dropdown-collapse.__no-anime {
    display: none;
}
```

## Expander CSS

```css
/* begin container orientation styles */

section.uptown-expander-container.uptown-orientation-horizontal {
    display: flex;
}

section.uptown-expander-container.uptown-orientation-horizontal-reverse {
    display: flex;
}
/* end container orientation styles */

section.uptown-expander-container header {
    display: flex;
}

section.uptown-expander-container header span.__uptown-expander-placeholder {
    flex: 1 1;
}

section.uptown-expander-container header span.__uptown-expander-icon {
    align-self: flex-end;
    align-content: right;
}

/* expander styles and toggle animation */

/* orientation: vertical */

section.uptown-expander-container.uptown-orientation-vertical .__uptown-expander-body {
    overflow: hidden;
}

section.uptown-expander-container.uptown-orientation-vertical .__uptown-expander-expand.__anime {
    opacity: 1;
    transform-origin: center top;
    transition: all 0.22s ease-out;
}

section.uptown-expander-container.uptown-orientation-vertical .__uptown-expander-collapse.__anime {
    opacity: 0;
    transform-origin: center top;
    transition: all 0.22s ease-out;
}

/* orientation: vertical-reverse */

section.uptown-expander-container.uptown-orientation-vertical-reverse .__uptown-expander-body {
    overflow: hidden;
}

section.uptown-expander-container.uptown-orientation-vertical-reverse .__uptown-expander-expand.__anime {
    opacity: 1;
    transform-origin: center bottom;
    transition: all 0.22s ease-out;
}

section.uptown-expander-container.uptown-orientation-vertical-reverse .__uptown-expander-collapse.__anime {
    opacity: 0;
    transform-origin: center bottom;
    transition: all 0.22s ease-out;
}

/* orientation: horizontal */
section.uptown-expander-container.uptown-orientation-horizontal .__uptown-expander-body {
    overflow: hidden;
    white-space: nowrap;
}

section.uptown-expander-container.uptown-orientation-horizontal .__uptown-expander-expand.__anime {
    opacity: 1;
    transform-origin: left center;
    transition: all 0.22s ease-out;
}

section.uptown-expander-container.uptown-orientation-horizontal .__uptown-expander-collapse.__anime {
    opacity: 0;
    transform-origin: left center;
    transition: all 0.22s ease-out;
}

/* orientation: horizontal-reverse */
section.uptown-expander-container.uptown-orientation-horizontal-reverse .__uptown-expander-body {
    overflow: hidden;
    white-space: nowrap;
}

section.uptown-expander-container.uptown-orientation-horizontal-reverse .__uptown-expander-expand.__anime {
    opacity: 1;
    transform-origin: right center;
    transition: all 0.22s ease-out;
}

section.uptown-expander-container.uptown-orientation-horizontal-reverse .__uptown-expander-collapse.__anime {
    opacity: 0;
    transform-origin: right center;
    transition: all 0.22s ease-out;
}
/* no anime */

section.uptown-expander-container .__uptown-expander-expand.__no-anime {
    display: flex;
}

section.uptown-expander-container .__uptown-expander-collapse.__no-anime {
    display: none;
}
```

**jsx structure**

```javascript
<section className={`uptown-${componentType}-container ${name} uptown-orientation-${orientation}`}>
    {(orientation === VERTICAL_REVERSE || orientation === HORIZONTAL_REVERSE) && <div className={bodyClassList}>}
    <header className={headerClassList}>
        <span className={`__uptown-${componentType}-placeholder`}>
            {HeaderComp != null && <HeaderComp {...headerComponentProps} />}
            {HeaderComp == null && placeholder}
        </span>
        <span className={`__uptown-${componentType}-icon`}>
            {IconComp && <IconComp {...iconComponentProps} />}
        </span>
    </header>
    {(orientation === VERTICAL || orientation === HORIZONTAL) && <div className={bodyClassList}>}
</section>
```