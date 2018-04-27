# Copyright 2018 Jared Boice (MIT License / Open Source)

# Uptown-Dropdown - Documentation

![List-Runner](screenshots/uptown-dropdown-logo.png "uptown-dropdown")

## Description

**Uptown-Dropdown** is a fully customizable _react_ _dropdown_ implementation that doubles as an _expander_. It accepts a header component or a placeholder, an optional icon, and a single component for the body which decouples the dropdown from a list and opens the door for expandable components that do not apply a list. Uptown-Dropdown offers optional built-in animation, applied css class names for each state of the component, switches for disabling the component and externally toggling expand/collapse states, multiple trigger types including click and hover, and the expansion state is passed as a parameter to the click handler and to the optional header/icon components when provided.

## Install, Import & Instantiate

**Install**

`npm install --save uptown-dropdown`

**Import**

_importing the commonly needed classes_
```javascript  
import UptownDropdown from 'list-runner';

```
_instantiation: dropdown_

```javascript
// the message prop will be passed along via bodyCompProps = { message: 'hello world'}
render(){
    const BodyComp = (props) => (
            <div className="example-expander">
                <div>expanded: {props.expanded}</div>
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
            <div>that dropdown is so uptown</div>
            <UptownDropdown
                name="my-uptown-component"
                expanded={expanded} // track in your app's state as needed
                placeholder={placeholder} // start with something simple like "select"
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

_instantiation example: expander

```javascript
    return (
        <section>
            <div>dude, that dropdown is so uptown</div>
            <UptownDropdown
                name="my-uptown-component"
                expanded={expanded} // track in your app's state as needed
                placeholder={placeholder} // start with something simple like "select"
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

_props_

```javascript
UptownDropdown.propTypes = {
    name: PropTypes.string, // becomes the name for the css pivot class,
    expanded: PropTypes.bool, // toggle the state externally or merely provide a default initial state
    disabled: PropTypes.bool, // when false, the body will not be expandable
    placeholder: PropTypes.string, // text that will be used if HeaderComp is not provided
    centerPlaceholder: PropTypes.bool, // center aligns the placeholder text
    anime: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]), // (true || '__anime') || (false || '__no-anime') || 'any-custom-css-class' (css class will be dynamically applied)
    calculateDimension: PropTypes.bool, // when true (and when anime is true), during animations uptown-dropdown will calculate and apply the body height (or width with future orientation update) when expanded and apply 0 on collapse
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

## CSS ClassNames Applied by State

**container**
+ `uptown-${componentType} ${name}`

**HeaderComp/placeholder**
+ `__uptown-${componentType}-placeholder`

**icon**
+ `__uptown-${componentType}-icon`

**disabledStateClass** _applied on the header_
+ '__uptown-disabled'
+ '__uptown-enabled'

**headerExpandedStateClass
+ `__uptown-${componentType}-header-on-expand`
+ `__uptown-${componentType}-header-on-collapse`

**bodyExpandedStateClass** _(applied on the body)_
+ `__uptown-${componentType}-expand`
+ `__uptown-${componentType}-collapse`

**animeStateClass** _(applied on the body)_ 
+ '__anime'
+ '__no-anime'
+ 'any-custom-class-name'

**class list integration** 
+ const headerClassList = `${disabledStateClass} ${headerExpandedStateClass}`;
+ const bodyClassList = `__uptown-${componentType}-body ${bodyExpandedStateClass} ${animeStateClass}`;

## Quick Starter Presets

_when provided, the following props will be applied to both the header and the body. they can then be overridden with !important styles in your css_

**flexBasis** - _also gets applied to the container_
**maxWidth** - _also gets applied to the container_
**border**
**borderRadius**
**boxShadow**



## CSS Modification Example

**Changing the Order of the Icon and Placeholder

```css
section.uptown-dropdown.value-of-name-prop header span.__uptown-dropdown-placeholder {
    flex: 1 0;
    order: 2;
}

section.uptown-dropdown header span.__uptown-dropdown-icon {
    align-self: flex-end;
    align-content: right;
    order: 1; 
    /* optionally right-align the placeholder with something like a very large flex-grow setting */
    flex: 100 0;
}
```

_note_: to apply the types of css modifications above to componentType = "expander", simply replace all the instances of "dropdown" in the class lists with "expander"

## CSS Files

**dropdown css**

```css
section.uptown-dropdown {
    position: relative;
}

section.uptown-dropdown header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
    user-select: none;
}

section.uptown-dropdown header span.__uptown-dropdown-placeholder {
    flex: 1 0;
}

section.uptown-dropdown header span.__uptown-dropdown-icon {
    align-self: flex-end;
    align-content: right;
}

/* expander styles and toggle animation */

section.uptown-dropdown .__uptown-dropdown-body {
    position: absolute;
    top: 100%;
    width: 100%;
    z-index: 20;
    box-sizing: border-box;
}

section.uptown-dropdown .__uptown-dropdown-expand.__anime {
    transform: scaleY(1);
    transition: all .22s ease-out;
    transform-origin: left top;
    overflow: hidden;
}

section.uptown-dropdown .__uptown-dropdown-collapse.__anime {
    transform: scaleY(0);
    transition: all .22s ease-out;
    transform-origin: left top;
    overflow: hidden;
}

section.uptown-dropdown .__uptown-dropdown-expand.__no-anime {
    display: flex;
}

section.uptown-dropdown .__uptown-dropdown-collapse.__no-anime {
    display: none;
}
```

## Expander CSS

```css
section.uptown-expander {
    position: relative;
}

section.uptown-expander header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    cursor: pointer;
    user-select: none;
}

section.uptown-expander header span.__uptown-expander-placeholder {
    flex: 1 0;
}

section.uptown-expander header span.__uptown-expander-icon {
    align-self: flex-end;
    align-content: right;
}

/* expander styles and toggle animation */

section.uptown-expander .__uptown-expander-body {
    position: relative;
}

section.uptown-expander .__uptown-expander-expand.__anime {
    opacity: 1;
    transform-origin: left top;
    transition: all 0.22s ease-out;
    overflow: hidden;
}

section.uptown-expander .__uptown-expander-collapse.__anime {
    opacity: 0;
    transform-origin: left top;
    transition: all 0.22s ease-out;
    overflow: hidden;
}

section.uptown-expander .__uptown-expander-expand.__no-anime {
    display: flex;
}

section.uptown-expander .__uptown-expander-collapse.__no-anime {
    display: none;
}
```

**jsx structure**

```javascript
<section
    className={`uptown-${componentType} ${name}`}
    style={{ ...this.quickStarterPresets.containerInlineStyles }}
    onMouseOut={() => {
        this.mouseOverBody = false;
        this.validateMouseOut(triggerType);
    }}
    onBlur={() => {
        this.mouseOverBody = false;
        this.validateMouseOut(triggerType);
    }}>

    <header {...headerAttributes}>
        <span className={`__uptown-${componentType}-placeholder`}>
            {HeaderComp != null && <HeaderComp {...headerComponentProps} />}
            {HeaderComp == null && placeholder}
        </span>
        <span className={`__uptown-${componentType}-icon`}>
            {IconComp && <IconComp {...iconComponentProps} />}
        </span>
    </header>

    <div
        ref={(element) => {
            this.uptownBody = element;
        }}
        className={bodyClassList}
        style={{ ...adjustedBodyInlineStyles }}
        onMouseOver={() => {
            this.mouseOverBody = true;
            this.validateMouseOver(triggerType, BODY);
        }}
        onFocus={() => {
            this.mouseOverBody = true;
            this.validateMouseOver(triggerType, BODY);
        }}>
        {BodyComp != null && <BodyComp {...bodyCompProps} />}
    </div>

</section>
```