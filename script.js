document.addEventListener("DOMContentLoaded", function () {
    fetch("products.json")
        .then(response => response.json())
        .then(products => {
            const productsDiv = document.getElementById("products");
            products.forEach(product => {
                const productDiv = document.createElement("div");
                productDiv.classList.add("product");
                productDiv.innerHTML = `
                    <h2>${product.name}</h2>
                    <img src="${product.image}" alt="${product.name}" width="100">
                    <p>${product.description}</p>
                    <p><strong>€${product.price}</strong></p>
                    <button onclick="addToCart(${product.id}, '${product.name}', ${product.price})">Toevoegen aan winkelwagen</button>
                `;
                productsDiv.appendChild(productDiv);
            });
        });

    loadReviews();
    loadQuestions();
});

function addToCart(id, name, price) {
    const cart = document.getElementById("cart");
    const item = document.createElement("li");
    item.textContent = `${name} - €${price}`;
    cart.appendChild(item);
}

document.getElementById("reviewForm").addEventListener("submit", function (e) {
    e.preventDefault();
    let reviewText = document.getElementById("reviewText").value;
    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    reviews.push({ text: reviewText, approved: false });
    localStorage.setItem("reviews", JSON.stringify(reviews));
    alert("Review verzonden! Wacht op goedkeuring.");
    document.getElementById("reviewText").value = "";
});

function loadReviews() {
    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    let reviewsList = document.getElementById("reviews");
    reviewsList.innerHTML = "";
    reviews.forEach(review => {
        if (review.approved) {
            let li = document.createElement("li");
            li.textContent = review.text;
            reviewsList.appendChild(li);
        }
    });
}

document.getElementById("questionForm").addEventListener("submit", function (e) {
    e.preventDefault();
    let questionText = document.getElementById("questionText").value;
    let email = document.getElementById("email").value;
    let questions = JSON.parse(localStorage.getItem("questions")) || [];
    questions.push({ email, text: questionText, answer: null });
    localStorage.setItem("questions", JSON.stringify(questions));
    alert("Vraag verzonden!");
    document.getElementById("questionText").value = "";
});

function loadQuestions() {
    let questions = JSON.parse(localStorage.getItem("questions")) || [];
    let questionsList = document.getElementById("questions");
    questionsList.innerHTML = "";
    questions.forEach(q => {
        let li = document.createElement("li");
        li.innerHTML = `${q.text} <br> <strong>Antwoord:</strong> ${q.answer || "Nog niet beantwoord"}`;
        questionsList.appendChild(li);
    });
}
