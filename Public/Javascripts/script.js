const button = document.querySelectorAll('.blog-card');

button.forEach(card=>{
    card.addEventListener("click",(e)=>{
        const target=e.target
        console.log(target)
        window.location.href = `/read:${target}`;
    })

})

