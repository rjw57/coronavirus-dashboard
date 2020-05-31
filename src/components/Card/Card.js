// @flow

import React, { Fragment } from 'react';
import type { ComponentType } from 'react';
import { BackLink } from 'govuk-react-jsx';

import type { Props } from './Card.types';
import {
    CardDescription,
    CardBody
} from './Card.styles';
import numeral from 'numeral'


const VisualSection: ComponentType<Props> = ({ children }: Props) => {

    return <div className={ "govuk-grid-column-one-half container-map" }>
        { children }
        {/*<img src={ "/public/images/graph-tests.png" } width={ "100%" } alt={ "" }/>*/}
    </div>

}; // Visuals


const ValueItem: ComponentType<Props> = ({ label, value, description=null, descriptionValue=null, descriptionSign=null, colourName }: Props) => {

    return <Fragment>
        <div className={ "data-label" }>
            <p className={ "govuk-body govuk-!-margin-bottom-0" }>{ label }</p>
        </div>
        <div className={ `square-${ colourName }` }/>
        <div className={ "data-value" }>
            <h3 className={ "govuk-heading-m govuk-!-margin-bottom-2 govuk-!-padding-top-0" }>
                { numeral(value).format("0,0") }
                {
                    description
                        ? <CardDescription>{ description }:&nbsp;{ numeral(descriptionValue).format("0,0") }{descriptionSign}</CardDescription>
                        : null
                }
            </h3>
        </div>
    </Fragment>

}; // ValueItem


const ValueItemsSection: ComponentType<Props> = ({ children }: Props) => {

    return <div className={ "govuk-grid-column-one-half" }>
        { children }
        <div className={ "spacer" }/>
    </div>

}; // ValueItemContainer


const HalfWidthCard: ComponentType<Props> = ({ caption="Placeholder", backUrl=null, children }: Props) => {

    return <CardBody>
        <div className={ "govuk-grid-row govuk-!-margin-top-0 govuk-!-margin-bottom-0" }>
            <div className={ "govuk-grid-column-one-half" }>
                <h2 className={ "govuk-heading-m govuk-!-margin-bottom-1 govuk-!-margin-top-0" }>{ caption }</h2>
            </div>
            <div className={ "govuk-grid-column-one-half" }>
                    <span
                        className={ "govuk-caption-m govuk-body-s more-detail govuk-!-margin-bottom-0 govuk-!-margin-top-1" }>
                        <a className={ "govuk-link more-detail govuk-!-font-weight-bold govuk-link--no-visited-state govuk-!-margin-bottom-0" }
                           href={ "testing" }>More detail ►</a>
                    </span>
            </div>
        </div>

        <hr className={ "govuk-section-break govuk-section-break--m govuk-!-margin-top-0 govuk-section-break--visible" }/>

        <div className={ "govuk-grid-row govuk-!-margin-top-0 govuk-!-margin-bottom-0" }>
            { children }
        </div>

    </CardBody>

};


const FullWidthCard: ComponentType<Props> = ({ caption, title, subtitle, backUrl }: Props) => {

}

export {
    HalfWidthCard,
    FullWidthCard,
    VisualSection,
    ValueItem,
    ValueItemsSection
};