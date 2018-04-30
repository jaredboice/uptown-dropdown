import React from 'react';
import PropTypes from 'prop-types';
import './dropdownStyles.css';
import './expanderStyles.css';

const CLICK = 'click';
const HOVER = 'hover';
const CLICK_AND_HOVER = 'clickAndHover';
const CLICK_OR_HOVER = 'clickOrHover';

const HEADER = 'header';
const BODY = 'body';

const DROPDOWN = 'dropdown';
const EXPANDER = 'expander'; // eslint-disable-line no-unused-vars

const ANIME = '__anime';
const NO_ANIME = '__no-anime';

const MINIMUM_MOUSE_OUT_COLLAPSE_DELAY = 55;

const integrateArrayOfStyleObjects = (arrayOfStyleObjects, inlineStyles = {}) => {
    arrayOfStyleObjects.forEach((obj) => {
        inlineStyles = {
            ...inlineStyles,
            ...obj
        };
    });
    return inlineStyles;
};

/* eslint-disable */

/* 
    constant: MINIMUM_MOUSE_OUT_COLLAPSE_DELAY
    description: 
        wait at least this long before toggling the body on a onMouseOver/onMouseOut event in order to give another onMouseOut/onMouseOver event time to toggle tracking variables

        example: if an onMouseOut event is triggered from the header, it might not necessarily be an indicator to toggle the body.
            if, for example, the event coincides with an onMouseOver of the opened body, it is in reality and indicator that the user simply
            moved the mouse downard from the header into the open body and would therefore not be a toggle indicator.
            the same conditions apply in the reverse, moving the mouse up from the body into the header.
            if set high enough, the delay could also potentially act as a time buffer for the user, in case of accidental mouse moves beyond the edge of the dropdown container,
            thereby acheiving a better user experience with a stable dropdown event-toggling system.
*/

/* eslint-enable */

class UptownDropdown extends React.Component {
    constructor(props) {
        super(props);
        const { expanded, mouseOutCollapseDelay } = props;
        this.state = {
            expanded
        };
        this.renderCount = 0; // see "note on calculateDimension" (in componentDidUpdate) and "note on forceCalculateDimension"
        this.forceCalculateDimension = false; // see "note on forceCalculateDimension"
        this.handleExpand = this.handleExpand.bind(this);
        this.validateClick = this.validateClick.bind(this);
        this.mouseOverHeader = null;
        this.mouseOverBody = null;
        this.mouseOutCollapseDelay =
            mouseOutCollapseDelay < MINIMUM_MOUSE_OUT_COLLAPSE_DELAY
                ? MINIMUM_MOUSE_OUT_COLLAPSE_DELAY
                : mouseOutCollapseDelay;
        this.stopWatch = setTimeout(() => {}, this.mouseOutCollapseDelay);
    }

    componentWillMount() {
        const theseProps = this.props;
        const { flexBasis, maxWidth, border, borderRadius, boxShadow } = this.props;
        let quickStarterPresets;
        if (flexBasis || maxWidth || border || borderRadius || boxShadow) {
            quickStarterPresets = this.updateQuickStarterPresets(theseProps);
        }
        this.quickStarterPresets = { ...quickStarterPresets };
    }

    componentDidMount() {
        this.calculatedUptownBodyHeight = this.uptownBody.scrollHeight;
        if (this.renderCount === 1 && this.forceCalculateDimension) {
            this.forceUpdate();
        }
    }

    componentWillReceiveProps(nextProps) {
        // note on calculateDimension
        // eslint-disable-next-line max-len
        this.renderCount = 0; // when renderCount === 1 then the DOM has mounted the new body and we can calculate its height for animation purposes (for when props.calculateDimension is true)
        const { flexBasis, maxWidth, border, borderRadius, boxShadow } = this.props;
        let quickStarterPresets;
        if (
            (nextProps.flexBasis && flexBasis != nextProps.flexBasis) || // eslint-disable-line eqeqeq
            (nextProps.maxWidth && maxWidth != nextProps.maxWidth) || // eslint-disable-line eqeqeq
            (nextProps.border && border != nextProps.border) || // eslint-disable-line eqeqeq
            (nextProps.borderRadius && borderRadius != nextProps.borderRadius) || // eslint-disable-line eqeqeq
            (nextProps.boxShadow && boxShadow != nextProps.boxShadow) // eslint-disable-line eqeqeq
        ) {
            const nextPropsArray = {};
            if (nextProps.flexBasis) nextPropsArray.flexBasis = nextProps.flexBasis;
            if (nextProps.maxWidth) nextPropsArray.maxWidth = nextProps.maxWidth;
            if (nextProps.border) nextPropsArray.border = nextProps.border;
            if (nextProps.borderRadius) nextPropsArray.borderRadius = nextProps.borderRadius;
            if (nextProps.boxShadow) nextPropsArray.boxShadow = nextProps.boxShadow;
            quickStarterPresets = this.updateQuickStarterPresets(nextPropsArray);
            this.quickStarterPresets = { ...quickStarterPresets };
        }
        this.setState({ expanded: nextProps.expanded });
    }

    componentDidUpdate() {
        // note on calculateDimension
        if (this.renderCount === 1) {
            // eslint-disable-next-line max-len
            // when renderCount === 1 then the DOM has mounted the new body and we can calculate its dimension for animation purposes (for when props.calculateDimension is true)
            this.calculatedUptownBodyHeight = this.uptownBody.scrollHeight;
        }
    }

    updateQuickStarterPresets(that) {
        const { flexBasis, maxWidth, border, borderRadius, boxShadow } = that;
        const transientDimensionStyles = [];
        if (flexBasis) {
            transientDimensionStyles.push({ flexBasis: `${flexBasis}` });
        }
        if (maxWidth) {
            transientDimensionStyles.push({ maxWidth: `${maxWidth}` });
        }

        const dimensionStyles = integrateArrayOfStyleObjects(transientDimensionStyles);
        const transientInlineStyles = [...transientDimensionStyles];

        if (border) {
            transientInlineStyles.push({ border: `${border}` });
        }
        if (borderRadius) {
            transientInlineStyles.push({ borderRadius: `${borderRadius}` });
        }
        if (boxShadow) {
            transientInlineStyles.push({ boxShadow: `${boxShadow}` });
        }
        const bodyInlineStyles = integrateArrayOfStyleObjects(transientInlineStyles);
        const headerInlineStyles = integrateArrayOfStyleObjects(transientInlineStyles);
        return {
            containerInlineStyles: { ...dimensionStyles },
            headerInlineStyles,
            bodyInlineStyles
        };
    }

    handleExpand(handleClick, state) {
        const newExpandedState = state || !this.state.expanded;
        this.setState({ expanded: newExpandedState });
        handleClick(newExpandedState);
    }

    validateClick(state = null) {
        const { disabled, BodyComp, handleClick } = this.props;
        if (!disabled && BodyComp != null) {
            this.handleExpand(handleClick, state);
        }
    }

    validateMouseOver(triggerType, source) {
        if ((triggerType === HOVER || triggerType === CLICK_OR_HOVER) && !this.state.expanded) {
            this.validateClick(true);
        }
        if (triggerType === CLICK_AND_HOVER && source === BODY && this.state.expanded) {
            this.validateClick(true);
        }
    }

    validateMouseOut(triggerType) {
        if (triggerType === HOVER && this.state.expanded) {
            this.validateClick(false);
        }
        if ((triggerType === CLICK_AND_HOVER || triggerType === CLICK_OR_HOVER) && this.state.expanded) {
            clearTimeout(this.stopWatch);
            this.stopWatch = setTimeout(() => {
                if (!this.mouseOverHeader && !this.mouseOverBody) {
                    this.validateClick(false);
                }
            }, this.mouseOutCollapseDelay);
        }
    }

    render() {
        const {
            name,
            disabled,
            placeholder,
            centerPlaceholder,
            anime,
            prependIcon,
            hideHeader,
            HeaderComp,
            BodyComp,
            IconComp,
            headerCompProps,
            iconCompProps,
            bodyCompProps,
            triggerType,
            componentType
        } = this.props;
        const { expanded } = this.state;
        const containerInlineStyles = { ...this.quickStarterPresets.containerInlineStyles };
        let headerInlineStyles = {};
        let bodyInlineStyles = { ...this.quickStarterPresets.bodyInlineStyles };
        let placeholderInlineStyles = {};
        let iconInlineStyles = {};
        // build the header styles


        if (hideHeader) {
            headerInlineStyles = {
                visibility: 'hidden',
                position: 'absolute',
                zIndex: -999
            };
        } else {
            if (centerPlaceholder) {
                headerInlineStyles = {
                    ...headerInlineStyles,
                    textAlign: 'center'
                };
            }
            headerInlineStyles = {
                ...headerInlineStyles,
                ...this.quickStarterPresets.headerInlineStyles
            };
            if (prependIcon) {
                placeholderInlineStyles = {
                    order: 2
                };
                iconInlineStyles = {
                    order: 1
                };
            } else {
                placeholderInlineStyles = {
                    order: 1
                };
                iconInlineStyles = {
                    order: 2
                };
            }
        }
        const disabledStateClass = disabled ? '__uptown-disabled' : '__uptown-enabled';
        const headerExpandedStateClass = expanded
            ? `__uptown-${componentType}-header-on-expand`
            : `__uptown-${componentType}-header-on-collapse`;
        // build the body styles
        const bodyExpandedStateClass = expanded
            ? `__uptown-${componentType}-expand`
            : `__uptown-${componentType}-collapse`;

        let animeStateClass;
        if (!anime) {
            animeStateClass = NO_ANIME;
        } else if (anime === true) {
            animeStateClass = ANIME;
        } else {
            animeStateClass = anime;
        }
        // calculateDimension and calculateHeight are synonymous
        // eslint-disable-next-line eqeqeq
        if ((this.props.calculateDimension || this.props.calculateHeight) && (anime != false && anime != NO_ANIME)) {
            bodyInlineStyles = expanded
                ? { ...bodyInlineStyles, maxHeight: `${this.calculatedUptownBodyHeight}px` }
                : { ...bodyInlineStyles, maxHeight: 0 };
            this.forceCalculateDimension = true;
        }
        // class list integration
        const headerClassList = `${disabledStateClass} ${headerExpandedStateClass}`;
        const bodyClassList = `__uptown-${componentType}-body ${bodyExpandedStateClass} ${animeStateClass}`;
        // onFocus and onBlur events must accompany onMouseOver and onMouseOut events for accessibility
        const headerAttributes = {
            onClick: () => {
                if (triggerType !== HOVER) this.validateClick();
            },
            onMouseOver: () => {
                this.mouseOverHeader = true;
                this.validateMouseOver(triggerType, HEADER);
            },
            onFocus: () => {
                this.mouseOverHeader = true;
                this.validateMouseOver(triggerType, HEADER);
            },
            onMouseOut: () => {
                this.mouseOverHeader = false;
                this.validateMouseOut(triggerType);
            },
            onBlur: () => {
                this.mouseOverHeader = false;
                this.validateMouseOut(triggerType);
            },
            className: headerClassList,
            style: { ...headerInlineStyles }
        };
        let headerComponentProps = {};
        let iconComponentProps = {};
        if (HeaderComp) {
            headerComponentProps = {
                ...headerCompProps,
                expanded
            };
        }
        if (IconComp) {
            iconComponentProps = {
                ...iconCompProps,
                expanded
            };
        }

        /* eslint-disable */

        /*
            note on forceCalculateDimension:
                the forceCalculateDimension switch is set to true when => the body starts off as expanded while props for anime and calculateDimension are also true.
                in this scenario, the very first click event on the header would not trigger the calculateDimension value required for the animation (but it will for any following click event).
                this anomaly is resolved by forcing react to update and re-render this one time. so when renderCount === 1 (and all the preceding conditions are met),
                the component has mounted and we need to force the dimension calculation. when it is greater than 1, then we are in any other subsequent render and there is
                no longer a need to force the dimension calculation
        */

        /* eslint-enable */
        this.renderCount++;
        return (
            <section
                className={`uptown-${componentType}-container ${name}`}
                style={{ ...containerInlineStyles }}
                onMouseOut={() => {
                    this.mouseOverBody = false;
                    this.validateMouseOut(triggerType);
                }}
                onBlur={() => {
                    this.mouseOverBody = false;
                    this.validateMouseOut(triggerType);
                }}
            >
                <header {...headerAttributes}>
                    <span className={`__uptown-${componentType}-placeholder`} style={{ ...placeholderInlineStyles }}>
                        {HeaderComp != null && <HeaderComp {...headerComponentProps} />}
                        {HeaderComp == null && placeholder}
                    </span>
                    <span className={`__uptown-${componentType}-icon`} style={{ ...iconInlineStyles }} >
                        {IconComp && <IconComp {...iconComponentProps} />}
                    </span>
                </header>
                <div
                    ref={(element) => {
                        this.uptownBody = element;
                    }}
                    className={bodyClassList}
                    style={{ ...bodyInlineStyles }}
                    onMouseOver={() => {
                        this.mouseOverBody = true;
                        this.validateMouseOver(triggerType, BODY);
                    }}
                    onFocus={() => {
                        this.mouseOverBody = true;
                        this.validateMouseOver(triggerType, BODY);
                    }}
                >
                    {BodyComp != null && <BodyComp {...bodyCompProps} />}
                </div>
            </section>
        );
    }
}

UptownDropdown.propTypes = {
    name: PropTypes.string,
    expanded: PropTypes.bool,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    centerPlaceholder: PropTypes.bool,
    anime: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    calculateDimension: PropTypes.bool,
    calculateHeight: PropTypes.bool, // synonymous with calculateDimension
    prependIcon: PropTypes.bool,
    flexBasis: PropTypes.string,
    maxWidth: PropTypes.string,
    border: PropTypes.string,
    borderRadius: PropTypes.string,
    boxShadow: PropTypes.string,
    hideHeader: PropTypes.bool,
    HeaderComp: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    IconComp: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    BodyComp: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
    headerCompProps: PropTypes.object,
    iconCompProps: PropTypes.object,
    bodyCompProps: PropTypes.object,
    handleClick: PropTypes.func,
    triggerType: PropTypes.string,
    componentType: PropTypes.string,
    mouseOutCollapseDelay: PropTypes.number
};
UptownDropdown.defaultProps = {
    name: 'default-uptown-dropdown-name',
    expanded: false,
    disabled: false,
    placeholder: 'select',
    centerPlaceholder: false,
    anime: false,
    calculateDimension: false,
    calculateHeight: false,
    prependIcon: false,
    flexBasis: null,
    maxWidth: null,
    border: null,
    borderRadius: null,
    boxShadow: null,
    hideHeader: false,
    HeaderComp: null,
    IconComp: null,
    headerCompProps: {},
    iconCompProps: {},
    bodyCompProps: {},
    handleClick: () => {},
    triggerType: CLICK, // 'click' || 'hover' || 'clickAndHover' || 'clickOrHover'
    componentType: DROPDOWN, // 'dropdown' || 'expander'
    mouseOutCollapseDelay: MINIMUM_MOUSE_OUT_COLLAPSE_DELAY
};

// eslint-disable-next-line import/prefer-default-export
export { UptownDropdown };
