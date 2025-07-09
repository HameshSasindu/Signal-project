import { useState, useCallback, useEffect } from "react";

export function useHashHandler(hashActionMap) {
    const [currentHash, setCurrentHash] = useState(window.location.hash);

    const handleHashChange = useCallback(() => {
        setCurrentHash(window.location.hash);
    }, []);

    useEffect(() => {
        window.addEventListener('hashchange', handleHashChange);
        handleHashChange();

        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, [currentHash]);

    useEffect(() => {
        if (hashActionMap[currentHash]) {
            hashActionMap[currentHash]();
        } else if (hashActionMap['']) {
            hashActionMap['']();
        }
    }, [currentHash, hashActionMap]);

    return currentHash;
}
