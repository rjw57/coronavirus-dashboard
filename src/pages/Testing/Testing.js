// @flow

import React, { Fragment } from 'react';
import type { ComponentType } from 'react';

import { withRouter } from 'react-router';

import { Card, CardHeader, NumericReports, ValueBox } from 'components/Card';
import type {
    Props,
    TabContentProps,
    TabContentType
} from './Testing.types';
import {
    getParams,
    groupBy,
    dropLeadingZeros,
    getPlotData,
    colours
} from "common/utils";
import useApi from "hooks/useApi";
import { TabLink, TabLinkContainer } from "components/TabLink";
import { Plotter } from "components/Plotter";
import usePageLayout from "hooks/usePageLayout";
import URLs from "common/urls";
import { MainLoading } from "components/Loading";
import { DataTable } from "components/GovUk";


const
    DefaultParams = [
        { key: 'areaName', sign: '=', value: 'United Kingdom' },
        { key: 'areaType', sign: '=', value: 'overview' }
    ];


const NationsDaily = () => {

    // newTestsByPublishDate
    const
        data = useApi({
            conjunctiveFilters: [
                { key: "areaType", sign: "=", value: "nation" }
            ],
            structure: {
                value: "newPillarOneTestsByPublishDate",
                date: "date",
                name: "areaName"
            },
            defaultResponse: []
        }),
        groups = groupBy(dropLeadingZeros(data,"value"), item => item.name);

    return <Plotter
        data={
            Object.keys(groups).map((areaName, index) => {

                const
                    yData = groups[areaName].map(item => item.value),
                    xData = groups[areaName].map(item => item.date);

                return {
                    name: areaName,
                    x: xData,
                    y: yData,
                    hovertemplate: "%{y}",
                    fill: 'tozeroy',
                    type: "bar",
                    marker: {
                        color: colours[index]
                    }
                }

            })
        }
        layout={{ barmode: "stack" }}
    />

}; // TotalPlot


const NationsCumulative = () => {

    // cumTestsByPublishDate
    const
        data = useApi({
            conjunctiveFilters: [
                { key: "areaType", sign: "=", value: "nation" }
            ],
            structure: {
                value: "cumPillarOneTestsByPublishDate",
                date: "date",
                name: "areaName"
            },
            defaultResponse: []
        }),
        groups = groupBy(dropLeadingZeros(data, "value"), item => item.name);

    return <Plotter
        data={
            Object.keys(groups).map((areaName, index) => {

                const
                    yData = groups[areaName].map(item => item.value),
                    xData = groups[areaName].map(item => item.date);

                return {
                    name: areaName,
                    x: xData,
                    y: yData,
                    hovertemplate: "%{y}",
                    fill: 'tozeroy',
                    type: "bar",
                    marker: {
                        color: colours[index]
                    }
                }

            })
        }
        layout={{ barmode: "stack" }}
    />

}; // TotalPlot


const TabContent: TabContentType<TabContentProps> = ({ fields, params, tabType, barType=null }: TabContentProps): React$Component => {

    const  structure = { date: "date" };

    for ( const { value } of fields )
        structure[value] = value;

    const data = useApi({
        conjunctiveFilters: params,
        structure: structure,
        defaultResponse: []
    });

    switch ( tabType ) {

        case "chart":
            const layout = {};
            if ( barType ) layout["barmode"] = barType;

            return <Plotter data={ getPlotData(fields, data) } layout={ layout }/>;

        case "table":
            return <DataTable fields={ fields } data={ data }/>;

        default:
            return null;

    }

};  // TabContent


const TestingCard = ({ tabs, tabs: { heading }, cardType, params, ...props }) => {

    switch ( cardType ) {

        case "chart":
            return <Card heading={ heading } { ...props }>
                <CardHeader heading={ heading } { ...props }/>
                <TabLinkContainer>{
                    tabs.map(({ heading: tabHeading, ...rest }) =>
                        <TabLink key={ `tab-${ tabHeading }` } label={ tabHeading }>
                            <TabContent params={ params } { ...props } { ...rest }/>
                        </TabLink>
                    )
                }</TabLinkContainer>
            </Card>

        case "map":
            return <Card heading={ heading }{ ...props }>
                <CardHeader heading={ heading } { ...props }/>
                <TabLinkContainer>{
                    tabs.map(({ heading: tabHeading, fields }) =>
                        <TabLink key={ `tab-${ tabHeading }` }
                                 label={ tabHeading }>
                            <p>Not implemented.</p>
                        </TabLink>
                    )
                }</TabLinkContainer>
            </Card>

        default:
            return <p>Invalid chart type</p>;

    }

};  // TestingCard


const HeadlineNumbers = ({ params, headlineNumbers=[] }) => {

    return headlineNumbers?.map((item, index) =>
        <ValueBox params={ params }
                  key={ `headline-number-${index}` }
                  { ...item }/>
    ) ?? null

} // HeadlineNumbers


const Testing: ComponentType<Props> = ({ location: { search: query }}: Props) => {

    const
        urlParams = getParams(query),
        layout = usePageLayout(URLs.pageLayouts.testing,  null),
        params = urlParams.length ? urlParams : DefaultParams;

    if ( !layout ) return <MainLoading/>;

    return <Fragment>
        <NumericReports horizontal={ true }>
            <HeadlineNumbers params={ params } { ...layout }/>
        </NumericReports>
        {
            layout?.cards.map(( { ...card }, index ) =>
                <TestingCard key={ `card-${ index }` }
                             params={ params }
                             { ...card }/> ?? null
            )
        }
        <Card fullWidth>
            <CardHeader heading={ "NHS and PHE tests by nation" } fullWidth={ true }/>
            <TabLinkContainer>
                <TabLink label={ "Daily" }>
                    <NationsDaily/>
                </TabLink>
                <TabLink label={ "Cumulative" }>
                    <NationsCumulative/>
                </TabLink>
                <TabLink label={ "Data" }>
                     Placeholder
                </TabLink>

            </TabLinkContainer>
        </Card>
    </Fragment>
};

export default withRouter(Testing);
