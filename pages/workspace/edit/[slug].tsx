import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const EditWorkspaceArticle = () => {
    const router = useRouter();
    const [ test, setTest ] = useState("loading...");

    useEffect(() => {
        if (!router.isReady) return;
        const slug = router.query.slug as string;
        setTest(slug);
        
    }, [router])

    return <div style={{textAlign:"center", paddingTop: "70px"}}>{test}</div>
}

export default EditWorkspaceArticle;