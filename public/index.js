document.addEventListener('DOMContentLoaded', fetchAndDisplayNotes);

let markupContainer = document.querySelector('#markupContainer')
let add = document.querySelector('#add')
let notesContainer = document.querySelector('#notesContainer')
const defaultNote=`# Type down your feeling here ...`

function fetchAndDisplayNotes() {
    fetch('http://localhost:3000/note')
        .then(response => response.json())
        .then(data => {
            notesContainer.innerHTML = ''; // Clear existing notes
            data.forEach(note => {
                const noteElement = generateNote( note.note,note.id);
                notesContainer.append(noteElement);
            });
        })
        .catch(error => console.error('Error fetching notes:', error));
}



add.addEventListener('click', function() {
    const newNote = generateNote(); 
    saveNoteToBackend(newNote, defaultNote)
    notesContainer.append(newNote);
    // Optionally, immediately save the new note to the backend here
});


function generateNote(content = defaultNote, id){
    let note = document.createElement('div')
    note.classList.add('note');
    if(id){
        note.dataset.id = id;
    }
    
    let tools = document.createElement('div')
    tools.classList.add('tools');

    let markupContainer = document.createElement('div')
    markupContainer.innerHTML = marked.parse(content)
    
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


    editBtn.addEventListener('click', function(){
        let icon = editBtn.querySelector('i')
        if(icon.className=="fa-solid fa-floppy-disk"){
            //it means we should perform save action
            //and switch icon back to edit
            icon.className="fas fa-edit"
            markupContainer.classList.remove('hidden')
            textarea.classList.add('hidden')
            markupContainer.innerHTML =  marked.parse(textarea.value)
            updateNoteToBackend(note.dataset.id, textarea.value)
            //run create if we do not have id
            //run update if we have id
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
        deleteNote(note.dataset.id)
    })

    return note
}

function saveNoteToBackend(noteElement, content) {

    fetch('http://localhost:3000/note', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({content: content }),
    })
    .then(response => response.json())
    .then(data => {
        noteElement.dataset.id = data.id; 
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
function updateNoteToBackend(id, content) {

    fetch(`http://localhost:3000/note/${id}`, {
        method: 'PATCH', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({content: content }),
    })
    .then(response => response.json())
    .then(data => {
        return data
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function deleteNote(id) {

    fetch(`http://localhost:3000/note/${id}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        return data
        
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
