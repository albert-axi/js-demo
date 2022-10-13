
fetch("https://pokeapi.co/api/v2/pokemon?limit=5")
    .then(res => res.json())
    .then(({ results }) => {
        const pokeList = document.querySelector('#poke-list')

        results.forEach(({ name }) => {

            fetch(`http://localhost:3000/favePokemons?name=${name}`)
                .then(res => res.json())
                .then(data => {
                    if (data.length) {
                        pokeList.innerHTML += `
                            <div data-id="${data[0].id}" data-pokemon="${name}" class="poke-card saved" onclick="toggleFavePokemon(event)">
                                <img data-id="${data[0].id}" data-pokemon="${name}" src="./images/default.jpeg" alt="default image" />
                                <h2 data-id="${data[0].id}" data-pokemon="${name}">${name}</h2>
                            </div>
                        `
                    } else {
                        pokeList.innerHTML += `
                            <div data-pokemon="${name}" class="poke-card" onclick="toggleFavePokemon(event)">
                                <img data-pokemon="${name}" src="./images/default.jpeg" alt="default image" />
                                <h2 data-pokemon="${name}">${name}</h2>
                            </div>
                        `
                    }
                })


        })
    })



function toggleFavePokemon(event) {
    console.log("Has Data-ID? ", event.target.dataset.id)
    if (event.target.dataset['id']) deleteFavePokemon(event.target)
    else addFavePokemon(event.target)

}

function deleteFavePokemon(elem) {
    const initObj = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Accepts": "application/json"
        },
    }

    fetch(`http://localhost:3000/favePokemons/${elem.dataset['id']}`, initObj)
        .then(res => res.json())
        .then(data => {
            if (elem.tagName !== "DIV") {
                delete elem.parentNode.dataset['id']
                elem.parentNode.classList.toggle("saved")
                elem.parentNode.childNodes.forEach(c => {
                    if (c.nodeName !== "#text") delete c.dataset['id']
                })
            } else {
                delete elem.dataset['id']
                elem.classList.toggle("saved")
                elem.childNodes.forEach(c => {
                    if (c.nodeName !== "#text") delete c.dataset['id']
                })
            }
        })
}

function addFavePokemon(elem) {
    const initObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accepts": "application/json"
        },
        body: JSON.stringify({
            name: event.target.dataset.pokemon
        })
    }

    fetch('http://localhost:3000/favePokemons', initObj)
        .then(res => res.json())
        .then(data => {
            elem.dataset['id'] = data.id

            if (elem.tagName !== "DIV") {
                elem.parentNode.dataset['id'] = data.id
                elem.parentNode.classList.toggle("saved")
                elem.parentNode.childNodes.forEach(c => {
                    console.log(c)
                    if (c.nodeName !== "#text") c.dataset['id'] = data.id
                })
            } else {
                elem.dataset['id'] = data.id
                elem.classList.toggle("saved")
                elem.childNodes.forEach(c => {
                    console.log(c)
                    if (c.nodeName !== "#text") c.dataset['id'] = data.id
                })
            }
        })
}