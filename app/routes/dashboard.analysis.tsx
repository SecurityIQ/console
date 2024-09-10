import { css } from "styled-system/css";
import Button from "~/components/button";
import Graph2D from "~/components/graph2d";
import SelectBox from "~/components/selectbox";
import Textbox from "~/components/textbox";

export default function IOCAnalysis() {
    const graphData = {
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
    }
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
                    color: "white",
                    rounded: "xl",
                    height: 'full',
                    overflow: 'hidden',
                })}>
                    <Graph2D data={graphData} />
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
                <h2>IoCs Analysis</h2>
                <form id='analysis-form' className={css({
                    display: "flex",
                    gap: "8px",
                })}>
                    <Textbox placeholder='Enter IP, File Hash, Domain, or URL' />
                    <SelectBox options={['IP Address', 'File Hash', 'Domain', 'URL']} />
                    <Button value='Add' />
                </form>
            </div>
        </div>
    );
}