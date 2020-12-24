import * as React from 'react';
import { makeObservable, makeAutoObservable, observable, action } from "mobx"
import { observer } from "mobx-react-lite"
import Button from '@material-ui/core/Button';

// TODO see if I ca useActiveNote and get the one from the list ot items and that it won't update until the value is
// added back in


// TODO: how do I create a value that is readonly externally but I can mutate internally?

interface INoteViewProps {
    readonly note: Note;
}

const NoteView = observer((props: INoteViewProps) => {
    const {note} = props;
    return (
        <div>

            <Button onClick={() => note.setText('this is changed')} variant="contained">
                Update it
            </Button>

            {note.id}: {note.text}
        </div>
    );
});

let seq = 0

const Root = observer(() => {

    const store = useMyStoreContext();

    const createNote = React.useCallback(() => {

        const id = seq++;

        store.addNote(new Note(
          `${id}`,
          'asdf: ' + id
        ));

    }, [store]);

    return (
        <div>

            <p>
                <Button onClick={createNote} variant="contained">
                    create a note
                </Button>
            </p>


            notes:
            {store.notes.map(current => <NoteView key={current.id} note={current}/>)}
        </div>
    );

});

export const MobXStory = () => {

    return (
        <MyStoreContextProvider>
            <Root/>
        </MyStoreContextProvider>
    );

}

class Note {

    @observable public id: string;
    @observable public text: string;

    constructor(id: string, text: string) {
        this.id = id;
        this.text = text;
        makeObservable(this)
    }

    @action setText(text: string) {
        this.text = text;
    }

}

class MyStore {

    @observable readonly notes: Note[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    @action addNote(note: Note) {
        this.notes.push(note);
    }

}

const MyStoreContext = React.createContext(new MyStore());

interface IMyStoreContextProviderProps {
    readonly children: JSX.Element;
}

const MyStoreContextProvider = React.memo((props: IMyStoreContextProviderProps) => {
    return (
        <MyStoreContext.Provider value={new MyStore()}>
            {props.children}
        </MyStoreContext.Provider>
    );
});

function useMyStoreContext() {
    return React.useContext(MyStoreContext);
}
