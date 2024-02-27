document.addEventListener('DOMContentLoaded', fetchAndDisplayNotes);

let markupContainer = document.querySelector('#markupContainer')
let add = document.querySelector('#add')
let notesContainer = document.querySelector('#notesContainer')
let globalIdCounter = 1;

function fetchAndDisplayNotes() {
    fetch('http://localhost:3000/note')
        .then(response => response.json())
        .then(data => {
            notesContainer.innerHTML = ''; // Clear existing notes
            data.forEach(note => {
                const noteElement = generateNote(note.id, note.note);
                notesContainer.append(noteElement);
            });
        })
        .catch(error => console.error('Error fetching notes:', error));
}


// add.addEventListener('click', function(){
//     let newNote = generateNote()
//     notesContainer.append(newNote)
// })

add.addEventListener('click', function() {
    const newNote = generateNote(globalIdCounter++, ''); // Use and increment the global ID counter
    notesContainer.append(newNote);
    // Optionally, immediately save the new note to the backend here
});


function generateNote(id,content){
    let note = document.createElement('div')
    note.classList.add('note');
    note.dataset.id = id;
    
    let tools = document.createElement('div')
    tools.classList.add('tools');

    let markupContainer = document.createElement('div')
    markupContainer.innerHTML = marked.parse(`## Type down your feeling here ...`)
    
    let editBtn = document.createElement('button')
    editBtn.classList.add('edit');
    editBtn.innerHTML = '<i class="fas fa-edit"></i>'
    
    let removebtn = document.createElement('button')
    removebtn.classList.add('delete');
    removebtn.innerHTML = '<i class="fas fa-trash-alt"></i>'
    
    let textarea = document.createElement('textarea')
    textarea.classList.add('hidden')
    textarea.value = content;

    note.append(tools,markupContainer,textarea)
    tools.append(editBtn,removebtn)

    globalIdCounter++;

    editBtn.addEventListener('click', function(){
        let icon = editBtn.querySelector('i')
        if(icon.className=="fa-solid fa-floppy-disk"){
            //it means we should perform save action
            //and switch icon back to edit
            icon.className="fas fa-edit"
            markupContainer.classList.remove('hidden')
            textarea.classList.add('hidden')
            markupContainer.innerHTML =  marked.parse(textarea.value)
        }else{
            //it means we should perform edit action
            //and switch icon  to save
            icon.className="fa-solid fa-floppy-disk"
            markupContainer.classList.add('hidden')
            textarea.classList.remove('hidden')
        }
    })
    
    removebtn.addEventListener('click', function(){
        note.remove()
    })

    return note
}

function saveNoteToBackend(noteElement, content) {
    const noteId = noteElement.dataset.id; // Temporary or permanent ID

    fetch('http://localhost:3000/note', {
        method: 'POST', // Or 'PATCH' if updating an existing note
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: noteId, content: content }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.id && data.id !== noteId) {
            // Update the note element with the permanent ID returned by the backend
            noteElement.dataset.id = data.id;
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
