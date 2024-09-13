import { atomWithStorage } from "jotai/utils";

export const currentProjectAtom = atomWithStorage("currentProject", ""); // an atom of currently selected project id
