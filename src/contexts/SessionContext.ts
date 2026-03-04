import { createContext } from "react";
import type { SessionContextType } from "../types/session";

const sessionContext = createContext<SessionContextType>({
    session: null,
    setSession: () => {},
    isExpired: false,
    setIsExpired: () => {},
});
export default sessionContext;