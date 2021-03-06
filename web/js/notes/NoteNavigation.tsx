import * as React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import {NoteIDStr, useNotesStore} from "./store/NotesStore";
import { observer } from "mobx-react-lite"

interface IProps {
    readonly parent: NoteIDStr | undefined;
    readonly id: NoteIDStr;
    readonly children: JSX.Element;
}

export const NoteNavigation = observer(function NoteNavigation(props: IProps) {

    const store = useNotesStore();

    const [ref, setRef] = React.useState<HTMLDivElement | null>(null);

    const handleClickAway = React.useCallback(() => {
        // noop for now
    }, []);


    const handleClick = React.useCallback(() => {
        store.setActiveWithPosition(props.id, undefined);
    }, [props.id, store]);

    return (
        <>
            <ClickAwayListener onClickAway={handleClickAway}>
                <div style={{flexGrow: 1}}
                     ref={setRef}
                     onClick={handleClick}>

                    {ref !== null && props.children}

                </div>
            </ClickAwayListener>
        </>
    );

});
