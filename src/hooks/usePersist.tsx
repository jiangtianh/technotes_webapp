import { useState, useEffect } from "react";

const usePersist = () => {
    const [persist, setPersist] = useState<boolean>(() => {
        const storedValue = localStorage.getItem("persist");
        return storedValue ? JSON.parse(storedValue) : false;
    });

    useEffect(() => {
        localStorage.setItem("persist", JSON.stringify(persist));
    }, [persist]);

    return [persist, setPersist] as const;
};

export default usePersist;