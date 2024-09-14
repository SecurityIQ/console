import { useAtom, useSetAtom } from 'jotai'
import { currentProjectAtom } from "~/state";
import { useFetcher } from '@remix-run/react'

export function useSelectedProject() {
    const [selectedProjectId, setSelectedProjectId] = useAtom(currentProjectAtom);
    const fetcher = useFetcher()

    const setSelectedProject = (project_id: string) => {
        setSelectedProjectId(project_id);
        fetcher.submit(
            { project_id: project_id || '' },
            { method: "post", action: "/api/set-project" }
        )
    }

    return {selectedProjectId, setSelectedProject}
}