import { useAtom, useSetAtom } from 'jotai'
import { currentAnalysisWorkspaceAtom, currentProjectAtom } from "~/state";
import { useFetcher } from '@remix-run/react'

export function useSelectedAnalysisWorkspace() {
    const [selectedAnalysisWorkspaceId, setSelectedAnalysisWorkspaceId] = useAtom(currentAnalysisWorkspaceAtom);
    const fetcher = useFetcher()

    const setSelectedAnalysisWorkspace = (analysis_workspace_id: string) => {
        setSelectedAnalysisWorkspaceId(analysis_workspace_id);
        fetcher.submit(
            { analysis_workspace_id: analysis_workspace_id || '' },
            { method: "post", action: "/api/set-analysis-workspace" }
        )
    }

    return {selectedAnalysisWorkspaceId, setSelectedAnalysisWorkspace}
}