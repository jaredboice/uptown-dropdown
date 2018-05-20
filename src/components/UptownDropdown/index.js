import React from 'react';
import PropTypes from 'prop-types';
import './dropdownStyles.css';
import './expanderStyles.css';

const CLICK = 'click';
const HOVER = 'hover';
const CLICK_AND_HOVER = 'clickAndHover';
const CLICK_OR_HOVER = 'clickOrHover';
const MOUSE_OVER = 'mouseOver';
const MOUSE_OUT = 'mouseOut';
const FOCUS = 'focus';
const BLUR = 'blur';

const HEADER = 'header';
const BODY = 'body';

const DROPDOWN = 'dropdown';
const EXPANDER = 'expander'; // eslint-disable-line no-unused-vars

const ANIME = '__uptown-anime';
const NO_ANIME = '__uptown-no-anime';
const CALCULATED_DIMENSION_ANIME = '__uptown-calculated-dimension-anime';
const NON_CALCULATED_DIMENSION_ANIME = '__uptown-non-calculated-dimension-anime';
const MAINTAIN_OPACITY = '__uptown-maintain-opacity';
const FADE_OPACITY = '__uptown-fade-opacity';

const VERTICAL = 'vertical';
const VERTICAL_REVERSE = 'vertical-reverse';
const HORIZONTAL = 'horizontal';
const HORIZONTAL_REVERSE = 'horizontal-reverse';

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
        this.nextUid = null; // uid ensures accurate real-time rendering when props update
        this.divergentUids = false; // this switch alerts the component that the next uid is not the same as the prev uid and documentation
        this.triggerSource = null; // real time tracking of clicks, mouseOvers, mouseOuts, focuses, and blurs
        this.delayRender = false; // when in customController mode, delayRender will become true if a collapse event occurs while mouseOverHeader = true; after a short delay it will become false
        this.toggleExpandedState = this.toggleExpandedState.bind(this);
        this.validateToggle = this.validateToggle.bind(this);
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
        const { flexBasis, minWidth, minHeight, maxWidth, maxHeight, border, borderRadius, boxShadow } = this.props;
        let quickStarterPresets = {};
        if (flexBasis || minWidth || minHeight || maxWidth || maxHeight || border || borderRadius || boxShadow) {
            quickStarterPresets = this.updateQuickStarterPresets(theseProps);
        }
        this.quickStarterPresets = { ...quickStarterPresets };
    }

    componentDidMount() {
        this.calculatedUptownBodyHeight = this.uptownBody.scrollHeight;
        this.calculatedUptownBodyWidth = this.uptownBody.scrollWidth;
        if (this.renderCount === 1 && this.forceCalculateDimension) {
            this.forceUpdate();
        }
    }

    componentWillReceiveProps(nextProps) {
        this.divergentUids = false;
        // note on calculateDimension
        // eslint-disable-next-line max-len
        this.renderCount = 0; // when renderCount === 1 then the DOM has mounted the new body and we can calculate its height for animation purposes (for when props.calculateDimension is true)
        const {
            flexBasis,
            minWidth,
            minHeight,
            maxWidth,
            maxHeight,
            border,
            borderRadius,
            boxShadow,
            orientation
        } = this.props;
        let quickStarterPresets = {};
        if (
            (nextProps.flexBasis && flexBasis != nextProps.flexBasis) || // eslint-disable-line eqeqeq
            (nextProps.minWidth && minWidth != nextProps.minWidth) || // eslint-disable-line eqeqeq
            (nextProps.minHeight && minHeight != nextProps.minHeight) || // eslint-disable-line eqeqeq
            (nextProps.maxWidth && maxWidth != nextProps.maxWidth) || // eslint-disable-line eqeqeq
            (nextProps.maxHeight && maxHeight != nextProps.maxHeight) || // eslint-disable-line eqeqeq
            (nextProps.border && border != nextProps.border) || // eslint-disable-line eqeqeq
            (nextProps.borderRadius && borderRadius != nextProps.borderRadius) || // eslint-disable-line eqeqeq
            (nextProps.boxShadow && boxShadow != nextProps.boxShadow) // eslint-disable-line eqeqeq
        ) {
            const nextPropsObj = {};
            if (nextProps.flexBasis) nextPropsObj.flexBasis = nextProps.flexBasis;
            if (nextProps.minWidth) nextPropsObj.minWidth = nextProps.minWidth;
            if (nextProps.minHeight) nextPropsObj.minHeight = nextProps.minHeight;
            if (nextProps.maxWidth) nextPropsObj.maxWidth = nextProps.maxWidth;
            if (nextProps.maxHeight) nextPropsObj.maxHeight = nextProps.maxHeight;
            if (nextProps.border) nextPropsObj.border = nextProps.border;
            if (nextProps.borderRadius) nextPropsObj.borderRadius = nextProps.borderRadius;
            if (nextProps.boxShadow) nextPropsObj.boxShadow = nextProps.boxShadow;
            nextPropsObj.orientation = orientation;
            quickStarterPresets = this.updateQuickStarterPresets(nextPropsObj);
            this.quickStarterPresets = { ...quickStarterPresets };
        }
        const prevUid = this.props.uid || null;
        const nextUid = nextProps.uid || null;
        // eslint-disable-next-line eqeqeq
        if (nextUid && nextUid != prevUid) {
            this.nextUid = nextProps.uid;
            this.divergentUids = true;
        } else {
            this.setState({ expanded: nextProps.expanded }, () => {
                // when in customController mode, if there is a custom click event INSIDE the header that causes a collapse, we do not want to immediately allow a mouseOver expansion
                if (!this.state.expanded && nextProps.customController && this.mouseOverHeader) {
                    this.delayRender = true;
                    setTimeout(() => {
                        this.delayRender = false;
                    }, 2000);
                }
            });
        }
    }

    componentDidUpdate() {
        if (this.divergentUids) this.forceUpdate(); // eslint-disable-line react/no-did-update-set-state
        // note on calculateDimension
        if (this.renderCount === 1) {
            // eslint-disable-next-line max-len
            // when renderCount === 1 then the DOM has mounted the new body and we can calculate its dimension for animation purposes (for when props.calculateDimension is true)
            this.calculatedUptownBodyHeight = this.uptownBody.scrollHeight;
            this.calculatedUptownBodyWidth = this.uptownBody.scrollWidth;
        }
        this.divergentUids = false;
    }

    updateQuickStarterPresets(that) {
        const {
            flexBasis,
            minWidth,
            minHeight,
            maxWidth,
            maxHeight,
            border,
            borderRadius,
            boxShadow,
            orientation
        } = that;
        const dimensionStyleCollection = [];
        if (flexBasis) {
            dimensionStyleCollection.push({ flexBasis: `${flexBasis}` });
        }
        if (minWidth && (orientation === VERTICAL || orientation === VERTICAL_REVERSE)) {
            dimensionStyleCollection.push({ minWidth: `${minWidth}` });
        }
        if (minHeight && (orientation === HORIZONTAL || orientation === HORIZONTAL_REVERSE)) {
            dimensionStyleCollection.push({ minHeight: `${minHeight}` });
        }
        if (maxWidth && (orientation === VERTICAL || orientation === VERTICAL_REVERSE)) {
            dimensionStyleCollection.push({ maxWidth: `${maxWidth}` });
        }
        if (maxHeight && (orientation === HORIZONTAL || orientation === HORIZONTAL_REVERSE)) {
            dimensionStyleCollection.push({ maxHeight: `${maxHeight}` });
        }

        const dimensionStyles = integrateArrayOfStyleObjects(dimensionStyleCollection);
        const inlineStyleCollection = [...dimensionStyleCollection];

        if (border) {
            inlineStyleCollection.push({ border: `${border}` });
        }
        if (borderRadius) {
            inlineStyleCollection.push({ borderRadius: `${borderRadius}` });
        }
        if (boxShadow) {
            inlineStyleCollection.push({ boxShadow: `${boxShadow}` });
        }
        const bodyInlineStyles = integrateArrayOfStyleObjects(inlineStyleCollection);
        const headerInlineStyles = integrateArrayOfStyleObjects(inlineStyleCollection);
        return {
            containerInlineStyles: { ...dimensionStyles },
            headerInlineStyles,
            bodyInlineStyles
        };
    }

    toggleExpandedState(handleClick, toggleState) {
        const newExpandedState = toggleState || !this.state.expanded;
        this.setState({ expanded: newExpandedState });
        handleClick(newExpandedState);
    }

    validateToggle(toggleState = null) {
        const { disabled, BodyComp, handleClick } = this.props;
        if (!disabled && BodyComp != null) {
            this.toggleExpandedState(handleClick, toggleState);
        }
    }

    validateMouseOver(triggerType, source) {
        const { expanded } = this.state;
        const { customController } = this.props;
        if (!customController) {
            if (this.triggerSource === FOCUS && source === HEADER && !expanded) {
                this.validateToggle(true);
            }
            if (this.triggerSource === FOCUS && source === BODY && expanded) {
                this.validateToggle(true);
            }
            if ((triggerType === HOVER || triggerType === CLICK_OR_HOVER) && !expanded) {
                this.validateToggle(true);
            }
            if (triggerType === CLICK_AND_HOVER && source === BODY && expanded) {
                this.validateToggle(true);
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (
                (this.triggerSource === MOUSE_OVER || this.triggerSource === FOCUS) &&
                (triggerType === HOVER || triggerType === CLICK_OR_HOVER) &&
                !expanded &&
                !this.delayRender
            ) {
                this.validateToggle(true);
            }
        }
    }

    validateMouseOut(triggerType, source) {
        const { expanded } = this.state;
        const { customController } = this.props;
        const validateOnTimer = (toggleState) => {
            clearTimeout(this.stopWatch);
            this.stopWatch = setTimeout(() => {
                if (!this.mouseOverHeader && !this.mouseOverBody) {
                    this.validateToggle(toggleState);
                }
            }, this.mouseOutCollapseDelay);
        };
        if (!customController) {
            if (this.triggerSource === BLUR && source === HEADER && expanded) {
                this.validateToggle(true);
            }
            if ((this.triggerSource === BLUR || triggerType === CLICK_OR_HOVER) && expanded) {
                validateOnTimer(false);
            }
            if (triggerType === HOVER && expanded) {
                validateOnTimer(false);
            }
            if ((triggerType === CLICK_AND_HOVER || triggerType === CLICK_OR_HOVER) && expanded) {
                validateOnTimer(false);
            }
        } else {
            // eslint-disable-next-line no-lonely-if
            if (
                (this.triggerSource === MOUSE_OUT || this.triggerSource === BLUR) &&
                triggerType !== CLICK &&
                expanded
            ) {
                validateOnTimer(false);
            }
        }
    }

    renderBody(bodyClassList, bodyInlineStyles, triggerType, BodyComp, bodyCompProps) {
        return (
            <div
                ref={(element) => {
                    this.uptownBody = element;
                }}
                className={bodyClassList}
                style={{ ...bodyInlineStyles }}
                onMouseOver={() => {
                    this.triggerSource = MOUSE_OVER;
                    this.mouseOverBody = true;
                    this.validateMouseOver(triggerType, BODY);
                }}
                onFocus={() => {
                    this.triggerSource = FOCUS;
                    this.mouseOverBody = true;
                    this.validateMouseOver(triggerType, BODY);
                }}
            >
                {BodyComp != null && <BodyComp {...bodyCompProps} />}
            </div>
        );
    }

    render() {
        const {
            name,
            disabled,
            placeholder,
            centerPlaceholder,
            linkStyles,
            anime,
            orientation,
            calculateDimension,
            calculateHeight,
            maintainOpacityOnAnime,
            prependIcon,
            border,
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
        let headerInlineStyles = {};
        let bodyInlineStyles = { ...this.quickStarterPresets.bodyInlineStyles };
        let placeholderInlineStyles = {};
        let iconInlineStyles = {};

        // build the header styles

        if (hideHeader) {
            headerInlineStyles = {
                visibility: 'hidden',
                position: 'relative',
                height: 0,
                width: 0,
                margin: 0,
                padding: 0,
                border: 0,
                zIndex: -999
            };
        } else {
            const auxHeadingStyleCollection = [];
            if (centerPlaceholder) {
                auxHeadingStyleCollection.push({ textAlign: 'center' });
            }
            if (linkStyles) {
                if (!disabled) {
                    auxHeadingStyleCollection.push({ cursor: 'pointer', userSelect: 'none' });
                } else {
                    auxHeadingStyleCollection.push({ cursor: 'not-allowed', userSelect: 'none' });
                }
            }
            const auxHeadingInlineStyles = integrateArrayOfStyleObjects(auxHeadingStyleCollection, headerInlineStyles);
            headerInlineStyles = {
                ...auxHeadingInlineStyles,
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
        } else if (anime === true || anime === ANIME) {
            animeStateClass = ANIME;
            if (calculateDimension || calculateHeight) {
                animeStateClass = `${animeStateClass} ${CALCULATED_DIMENSION_ANIME}`;
            } else {
                animeStateClass = `${animeStateClass} ${NON_CALCULATED_DIMENSION_ANIME}`;
            } // the conditional below defaults the default built-in animation for DROPDOWN to maintainOpacityOnAnime = true
            if (
                maintainOpacityOnAnime === true ||
                (maintainOpacityOnAnime == null && componentType === DROPDOWN && !calculateDimension)
            ) {
                animeStateClass = `${animeStateClass} ${MAINTAIN_OPACITY}`;
            } else if (maintainOpacityOnAnime === false || (maintainOpacityOnAnime == null && border && calculateDimension)) {
                animeStateClass = `${animeStateClass} ${FADE_OPACITY}`;
            }
        } else {
            animeStateClass = anime;
            if (calculateDimension || calculateHeight) {
                animeStateClass = `${animeStateClass} ${CALCULATED_DIMENSION_ANIME}`;
            } else {
                animeStateClass = `${animeStateClass} ${NON_CALCULATED_DIMENSION_ANIME}`;
            }
            if (maintainOpacityOnAnime === true) {
                animeStateClass = `${animeStateClass} ${MAINTAIN_OPACITY}`;
            } else if (maintainOpacityOnAnime === false) {
                animeStateClass = `${animeStateClass} ${FADE_OPACITY}`;
            }
        }
        // calculateDimension and calculateHeight are synonymous
        // eslint-disable-next-line eqeqeq
        if ((calculateDimension || calculateHeight) && (anime != false && anime != NO_ANIME)) {
            if (orientation === VERTICAL || orientation === VERTICAL_REVERSE) {
                bodyInlineStyles = expanded
                    ? { ...bodyInlineStyles, maxHeight: `${this.calculatedUptownBodyHeight}px` }
                    : { ...bodyInlineStyles, maxHeight: 0 };
            } else {
                bodyInlineStyles = expanded
                    ? { ...bodyInlineStyles, maxWidth: `${this.calculatedUptownBodyWidth}px` }
                    : { ...bodyInlineStyles, maxWidth: 0 };
            }
            this.forceCalculateDimension = true;
        }
        // class list integration
        const headerClassList = `${disabledStateClass} ${headerExpandedStateClass}`;
        const bodyClassList = `__uptown-${componentType}-body ${bodyExpandedStateClass} ${animeStateClass}`;
        // onFocus and onBlur events must accompany onMouseOver and onMouseOut events for accessibility
        const headerAttributes = {
            onClick: () => {
                this.triggerSource = CLICK;
                if (triggerType !== HOVER && !this.props.customController) this.validateToggle();
            },
            onMouseOver: () => {
                this.triggerSource = MOUSE_OVER;
                this.mouseOverHeader = true;
                this.validateMouseOver(triggerType, HEADER);
            },
            onFocus: () => {
                this.triggerSource = FOCUS;
                this.mouseOverHeader = true;
                this.validateMouseOver(triggerType, HEADER);
            },
            onMouseOut: () => {
                this.triggerSource = MOUSE_OUT;
                this.mouseOverHeader = false;
                this.validateMouseOut(triggerType, HEADER);
            },
            onBlur: () => {
                this.triggerSource = BLUR;
                this.mouseOverHeader = false;
                this.validateMouseOut(triggerType, HEADER);
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
                className={`uptown-${componentType}-container __uptown-orientation-${orientation} ${name} `}
                style={{ ...this.quickStarterPresets.containerInlineStyles }}
                onMouseOut={() => {
                    this.triggerSource = MOUSE_OUT;
                    this.mouseOverBody = false;
                    this.validateMouseOut(triggerType, HEADER);
                }}
                onBlur={() => {
                    this.triggerSource = BLUR;
                    this.mouseOverBody = false;
                    this.validateMouseOut(triggerType, HEADER);
                }}
            >
                {(orientation === VERTICAL_REVERSE || orientation === HORIZONTAL_REVERSE) &&
                    this.renderBody(bodyClassList, bodyInlineStyles, triggerType, BodyComp, bodyCompProps)}
                <header {...headerAttributes}>
                    <span className={`__uptown-${componentType}-placeholder`} style={{ ...placeholderInlineStyles }}>
                        {HeaderComp != null && <HeaderComp {...headerComponentProps} />}
                        {HeaderComp == null && placeholder}
                    </span>
                    <span className={`__uptown-${componentType}-icon`} style={{ ...iconInlineStyles }}>
                        {IconComp && <IconComp {...iconComponentProps} />}
                    </span>
                </header>
                {(orientation === VERTICAL || orientation === HORIZONTAL) &&
                    this.renderBody(bodyClassList, bodyInlineStyles, triggerType, BodyComp, bodyCompProps)}
            </section>
        );
    }
}

UptownDropdown.propTypes = {
    name: PropTypes.string,
    uid: PropTypes.oneOfType([PropTypes.symbol, PropTypes.string, PropTypes.number]),
    expanded: PropTypes.bool,
    disabled: PropTypes.bool,
    placeholder: PropTypes.string,
    centerPlaceholder: PropTypes.bool,
    linkStyles: PropTypes.bool,
    customController: PropTypes.bool,
    anime: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    orientation: PropTypes.string,
    calculateDimension: PropTypes.bool,
    calculateHeight: PropTypes.bool, // synonymous with calculateDimension
    maintainOpacityOnAnime: PropTypes.bool,
    prependIcon: PropTypes.bool,
    flexBasis: PropTypes.string,
    minWidth: PropTypes.string,
    minHeight: PropTypes.string,
    maxWidth: PropTypes.string,
    maxHeight: PropTypes.string,
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
    uid: null,
    expanded: false,
    disabled: false,
    placeholder: 'select',
    centerPlaceholder: false,
    linkStyles: false,
    customController: false,
    anime: false,
    orientation: VERTICAL,
    calculateDimension: false,
    calculateHeight: false,
    maintainOpacityOnAnime: null,
    prependIcon: false,
    flexBasis: null,
    minWidth: null,
    minHeight: null,
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
    triggerType: CLICK, // 'click' || 'hover' || 'clickAndHover' || 'clickOrHover'
    componentType: DROPDOWN, // 'dropdown' || 'expander'
    mouseOutCollapseDelay: MINIMUM_MOUSE_OUT_COLLAPSE_DELAY
};

// eslint-disable-next-line import/prefer-default-export
export { UptownDropdown };
