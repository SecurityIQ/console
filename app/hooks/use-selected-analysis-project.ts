import { useAtom, useSetAtom } from 'jotai'
import { currentAnalysisWorkspaceAtom, currentProjectAtom } from "~/state";
import { useFetcher } from '@remix-run/react'

export function useSelectedAnalysisWorkspace() {
    const [selectedAnalysisWorkspaceId, setSelectedAnalysisWorkspaceId] = useAtom(currentAnalysisWorkspaceAtom);
    const fetcher = useFetcher()

    const setSelectedAnalysisWorkspace = (project_id: string) => {
        setSelectedAnalysisWorkspaceId(project_id);
        fetcher.submit(
            { project_id: project_id || '' },
            { method: "post", action: "/api/set-analysis-workspace" }
        )
    }

    return {selectedAnalysisWorkspaceId, setSelectedAnalysisWorkspace}
}