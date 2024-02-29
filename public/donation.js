// action="/donation" method="post" onsubmit="return false"
let form = document.querySelector('form')


form.addEventListener('submit', handleSubmit)

function handleSubmit(e){
    e.preventDefault();

    let formData = new FormData(e.target)
    let obj = {};
    for(let [key,value] of formData){
        obj[key] = value
    }
    console.log(obj)

    fetch('/donation',{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(obj)
    })
    .then(d=>d.json())
    .then(d=>alert(d.message))
    .catch(e=>console.log(e))
}