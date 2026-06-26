const search = document.getElementById("projectSearch");

const cards = document.querySelectorAll(".project-card");

search.addEventListener("keyup", function () {

    const value = search.value.toLowerCase();

    cards.forEach(card => {

        const text = card.innerText.toLowerCase();

        if (text.includes(value)) {

            card.style.display = "block";

        } else {

            card.style.display = "none";

        }

    });

});