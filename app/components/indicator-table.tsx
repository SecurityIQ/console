import { Clipboard } from "lucide-react";
import { css } from "styled-system/css";
import ClickToCopy from "./click-to-copy";

interface Props {
    indicators: { value: string, type: 'ip' | 'domain' | 'hash' | 'url' }[];
}

export default function IndicatorTable({ indicators }: Props) {
    const tableHeader = css({
        padding: '12px',
        textAlign: 'left',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#f9fafb',
        fontWeight: '600',
        color: 'primary',
    })

    const tableData = css({
        padding: '12px',
        textAlign: 'left',
        borderBottom: '1px solid #e5e7eb',
        maxW: 0,
        width: '100%',
    })

    const clickToCopyWrapper = css({
        display: 'block',
        width: '100%',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    })

    return (
        <table className={
            css({
                width: '100%',
                borderCollapse: 'separate',
                borderSpacing: '0',
                tableLayout: 'fixed',
            })
        }>
            <thead>
                <tr>
                    <th className={tableHeader}>Indicator</th>
                    <th className={tableHeader}>Type</th>
                    <th className={tableHeader}>Action</th>
                </tr>
            </thead>
            <tbody>
                {indicators.map((indicator, index) => (
                    <tr key={index}>
                        <td className={tableData}>
                            <div className={clickToCopyWrapper}>
                               <ClickToCopy text={indicator.value} />
                            </div>
                        </td>
                        <td className={tableData}>{indicator.type}</td>
                        <td className={tableData}><button className={
                            css({
                                backgroundColor: 'primary',
                                color: 'white',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s',
                                _hover: {
                                    backgroundColor: 'primary',
                                    color: 'white',
                                },
                            })
                        } type="submit">Remove</button></td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}