import { atomWithStorage } from "jotai/utils";

export const currentProjectAtom = atomWithStorage("currentProject", ""); // an atom of currently selected project id
export const currentAnalysisWorkspaceAtom = atomWithStorage("currentAnalysisWorkspace", ""); // an atom of currently selected analysis workspace id