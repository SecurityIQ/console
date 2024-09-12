import { ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { withZod } from "@rvf/zod";
import { useEffect, useState } from "react";
import { GraphData, LinkObject, NodeObject } from "react-force-graph-2d";
import { toast } from "sonner";
import { css } from "styled-system/css";
import { z } from "zod";
import Button from "~/components/button";
import Graph2D from "~/components/graph2d";
import IndicatorTable from "~/components/indicator-table";
import SelectBox from "~/components/selectbox";
import Textbox from "~/components/textbox";

// construct the following format when the data is ready

/* const graphData = {
    nodes: [
        { id: 'IP1', group: 1 },
        { id: 'Domain1', group: 2 },
        { id: 'Hash1', group: 3 },
        { id: 'IP2', group: 1 },
   ],
    links: [
        { source: 'IP1', target: 'Domain1', value: 3 },
        { source: 'Domain1', target: 'Hash1', value: 5 },
        { source: 'IP2', target: 'Domain1', value: 1 },
    ]
} */

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const formIndicator = formData.get("indicator");
    let formType = formData.get("type");

    let indicator: Indicator = { value: '', type: 'ip' };

    const errors: { type: string, value: string } = { type: '', value: '' };

    if (formType && !['ip', 'domain', 'hash', 'url'].includes(formType as string)) {
        errors.type = 'Invalid Indicator Type';
    }

    if (formIndicator && formType) {
        indicator = {
            value: formIndicator as string,
            type: formType as 'ip' | 'domain' | 'hash' | 'url'
        }
    } 

    // regex matching for ip, domain, hash, url
    switch (indicator.type) {
        case 'ip':
            if (!/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(indicator.value) || indicator.value === '0.0.0.0') {
                errors.value = 'Invalid IP Address';
            }
            break;
        case 'domain':
            if(!/^((?!-))(xn--)?[a-z0-9][a-z0-9-_]{0,61}[a-z0-9]{0,1}\.(xn--)?([a-z0-9\-]{1,61}|[a-z0-9-]{1,30}\.[a-z]{2,})$/.test(indicator.value)) {
                errors.value = 'Invalid Domain';
            }
            break;
        case 'hash':
            if (!/\b[a-fA-F0-9]{32,128}\b/.test(indicator.value)) {
                errors.value = 'Invalid Hash';
            }
            break;
        case 'url':
            if (!/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi.test(indicator.value)) {
                errors.value = 'Invalid URL';
            }
            break;
        default:
            break;
    }

    console.log(errors)

    return { errors, indicator };
};

export default function IOCAnalysis() {
    const actionData = useActionData<typeof action>();

    const [graphData, setGraphData] = useState<GraphData>({
        nodes: [],
        links: []
    });
    const [indicators, setIndicators] = useState<Indicator[]>([]);

    useEffect(() => {
        if (actionData) {
            if (actionData?.errors.type !== '') {
                toast(actionData?.errors.type);
            }
            if (actionData?.errors.value !== '') {
                toast(actionData?.errors.value);
            }
            if (actionData?.indicator.value && actionData?.indicator.type && actionData?.errors.type === '' && actionData?.errors.value === '') {
                setIndicators(prevIndicators => [...prevIndicators, actionData.indicator]);
            }
        }
    }, [actionData]);


    const addNode = (newNode: NodeObject) => {
        setGraphData(prevData => ({
            ...prevData,
            nodes: [...prevData.nodes, newNode] // Add new node
        }));
    };

    const addLink = (newLink: LinkObject) => {
        setGraphData(prevData => ({
            ...prevData,
            links: [...prevData.links, newLink] // Add new link
        }));
    };

    return (
        <div className={css({
            display: "flex",
            height: 'full',
            maxWidth: '100%',
        })}>
            <div className={css({
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                width: '50%',
                maxWidth: '50%',
            })}>
                <div className={css({
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "black",
                    rounded: "xl",
                    height: 'full',
                    overflow: 'hidden',
                })}>
                    {/* only render Graph2D when graphData nodes is not empty, otherwise show "No data panel" */}
                    {graphData.nodes.length > 0 ? <Graph2D data={graphData} /> : <div>No Data</div>}

                </div>
                <div className={css({
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    bgColor: "primary",
                    rounded: "xl",
                    height: 'full'
                })}>
                    <span>No Data</span>
                </div>
            </div>
            <div className={css({
                paddingX: "24px",
                width: '50%'
            })}>
                <div className={css({
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: '24px',
                })}>
                    <h2 className={css({
                        marginBottom: '0',
                    })}>IoCs Analysis</h2>
                    <SelectBox name='workspace' options={{ 'ws1': 'Workspace 1', 'ws2': 'Workspace 2' }} />
                </div>
                <Form className={css({
                    display: "flex",
                    gap: "8px",
                    marginBottom: '24px',
                })} method="post">
                    <Textbox name='indicator' placeholder='Enter IP, File Hash, Domain, or URL' />
                    <SelectBox name='type' options={{ 'ip': 'IP Address', 'hash': 'File Hash', 'domain': 'Domain', 'url': 'URL' }} />
                    <Button value='Add' />
                </Form>
                <IndicatorTable indicators={indicators} />
            </div>
        </div>
    );
}