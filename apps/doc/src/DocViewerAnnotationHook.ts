import {useLocation} from "react-router-dom";
import {useDocViewerCallbacks} from "./DocViewerStore";
import {AnnotationLinks} from "../../../web/js/annotation_sidebar/AnnotationLinks";
import {ILocation} from "../../../web/js/react/router/ReactRouters";
import React from 'react';
import {useDocViewerContext} from "./renderers/DocRenderer";
import {DocViewerAppURLs} from "./DocViewerAppURLs";

export type DocViewerJumpCause = 'init' | 'history';

export function useDocViewerJumpToPageLoader(): (location: ILocation, cause: DocViewerJumpCause) => boolean {

    const {onPageJump} = useDocViewerCallbacks();
    const prevPageRef = React.useRef<number | undefined>();
    const currentDocumentLocationPredicate = useCurrentDocumentLocationPredicate();

    return (location, cause) => {

        if (currentDocumentLocationPredicate(location)) {

            const annotationLink = AnnotationLinks.parse(location.hash);

            if (annotationLink) {

                try {

                    if (prevPageRef.current !== annotationLink.page) {

                        console.log(`Jumping to page ${annotationLink.page} due to '${cause}'`);
                        onPageJump(annotationLink.page);
                        return true;

                    }

                } finally {
                    prevPageRef.current = annotationLink.page;
                }

            }


        }

        return false;

    }

}


/**
 * Only return true if the URL we're on is for the current doc.  For anything without sidenav
 * this will just return true.
 */
function useCurrentDocumentLocationPredicate() {

    const {docID} = useDocViewerContext();

    return React.useCallback((location: ILocation): boolean => {

        const parsedURL = DocViewerAppURLs.parse(`${location.pathname}${location.search}${location.hash}`);

        return docID === parsedURL?.id;

    }, [docID]);

}

export function useDocViewerPageJumpListener() {
    const location = useLocation();
    const docViewerJumpToPageLoader = useDocViewerJumpToPageLoader();
    docViewerJumpToPageLoader(location, 'history');
}
