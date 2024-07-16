document.addEventListener('DOMContentLoaded', () => {
  const toyCollection = document.getElementById('toy-collection');
  const addToyForm = document.getElementById('add-toy-form');
  const toysUrl = 'http://localhost:3000/toys';

  // Fetch and display toys
  fetch(toysUrl)
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => {
        renderToy(toy);
      });
    });

  // Add toy info to the card
  function renderToy(toy) {
    const toyCard = document.createElement('div');
    toyCard.className = 'card';
    toyCard.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like </button>
    `;
    toyCollection.appendChild(toyCard);

    // Add event listener to the like button
    const likeBtn = toyCard.querySelector('.like-btn');
    likeBtn.addEventListener('click', () => {
      increaseLikes(toy);
    });
  }

  // Add a new toy
  addToyForm.addEventListener('submit', event => {
    event.preventDefault();
    const toyName = event.target.name.value;
    const toyImage = event.target.image.value;
    const newToy = { name: toyName, image: toyImage, likes: 0 };

    fetch(toysUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(newToy)
    })
    .then(response => response.json())
    .then(toy => {
      renderToy(toy);
      addToyForm.reset();
    });
  });

  // Increase a toy's likes
  function increaseLikes(toy) {
    toy.likes += 1;

    fetch(`${toysUrl}/${toy.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ likes: toy.likes })
    })
    .then(response => response.json())
    .then(updatedToy => {
      const toyCard = document.getElementById(updatedToy.id).parentNode;
      const likesP = toyCard.querySelector('p');
      likesP.textContent = `${updatedToy.likes} Likes`;
    });
  }
});

