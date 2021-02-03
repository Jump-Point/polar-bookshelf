import React from "react";
import {NoteEditor} from "./NoteEditor";
import {NoteItems} from "./NoteItems";
import {NoteBulletButton} from "./NoteBulletButton";
import {useLifecycleTracer} from "../hooks/ReactHooks";
import {NoteOverflowButton} from "./NoteOverflowButton";
import {createContextMenu} from "../../../apps/repository/js/doc_repo/MUIContextMenu2";
import {IDocViewerContextMenuOrigin} from "../../../apps/doc/src/DocViewerMenu";
import {NoteContextMenuItems} from "./NoteContextMenuItems";
import useTheme from "@material-ui/core/styles/useTheme";
import { NoteExpandToggleButton } from "./NoteExpandToggleButton";
import { NoteIDStr, useNotesStore } from "./store/NotesStore";
import {isObservable, isObservableProp} from 'mobx';
import { observer,  } from "mobx-react-lite"
import makeStyles from "@material-ui/core/styles/makeStyles";
import createStyles from "@material-ui/core/styles/createStyles";
import clsx from "clsx";

const useStyles = makeStyles((theme) =>
    createStyles({
        selected: {
            background: theme.palette.primary.main
        },
    }),
);

interface IProps {
    readonly parent: NoteIDStr | undefined;
    readonly id: NoteIDStr;
}

export interface INoteContextMenuOrigin {

}

export const [NoteContextMenu, useNoteContextMenu]
    = createContextMenu<IDocViewerContextMenuOrigin>(NoteContextMenuItems, {name: 'notes'});

export const NoteInner = observer((props: IProps) => {

    useLifecycleTracer('NoteInner', {id: props.id});

    const {id} = props;

    const store = useNotesStore();
    const classes = useStyles();

    const theme = useTheme();
    const contextMenuHandlers = useNoteContextMenu();

    const expanded = store.isExpanded(props.id);
    const selected = store.isSelected(props.id);
    const note = store.getNote(id);

    const root = store.root;

    if (! note) {
        return null;
    }

    const items = store.lookup(note.items || []);

    const hasItems = items.length > 0;

    return (
        <div className={clsx(['Note', selected ? classes.selected : undefined])}>
            <div {...contextMenuHandlers}
                 style={{
                     display: 'flex',
                     alignItems: 'flex-start',
                     marginTop: theme.spacing(0.5),
                     marginBottom: theme.spacing(0.5)
                 }}>

                <div style={{
                         display: 'flex',
                         alignItems: 'center',
                         width: '3em',
                         justifyContent: 'flex-end',
                         marginRight: theme.spacing(0.5)
                     }}>

                    <NoteOverflowButton id={props.id}/>

                    {hasItems && id !== root && (
                        <NoteExpandToggleButton id={props.id}/>
                    )}

                    <NoteBulletButton target={props.id}/>

                </div>

                <NoteEditor parent={props.parent} id={props.id} />

            </div>

            {(expanded || id === root) && (
                <NoteItems parent={props.id} notes={items}/>
            )}
        </div>
    );
});

export const Note = observer(function Note(props: IProps) {

    useLifecycleTracer('Note');

    return (
        <NoteContextMenu>
            <NoteInner {...props}/>
        </NoteContextMenu>
    );

});

