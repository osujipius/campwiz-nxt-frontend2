import { useContext } from "react";
import sessionContext from "@/contexts/SessionContext";
import type { SessionContextType } from "@/types/session";

const useSession = (): SessionContextType => {
    return useContext(sessionContext);
};

export default useSession;
