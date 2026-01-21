import { games } from "./games.js";

const grid = document.getElementById("games-grid");
const cartButton = document.getElementById("cart-button");

// Cart 

const getCart = () =>
  JSON.parse(localStorage.getItem("cart")) || [];

const saveCart = (cart) =>
  localStorage.setItem("cart", JSON.stringify(cart));

const addToCart = (game) => {
  const cart = getCart();

  if (!cart.find((item) => item.id === game.id)) {
    cart.push(game);
    saveCart(cart);
  }
};

// Card Rendering

const createGameCard = (game) => {
  const article = document.createElement("article");
  article.className = "game-card";

  article.innerHTML = `
    <figure class="game-image">
      <img src="${game.image}" alt="${game.alt}">
    </figure>
    <section class="game-info">
      <h3>${game.title}</h3>
      <span class="price">$${game.price}</span>
      <p>${game.description}</p>
      <button class="add-button">Add to Cart</button>
    </section>
  `;

  article
    .querySelector(".add-button")
    .addEventListener("click", () => addToCart(game));

  return article;
};

const renderGames = () => {
  const fragment = document.createDocumentFragment();
  games.forEach((game) =>
    fragment.appendChild(createGameCard(game))
  );
  grid.appendChild(fragment);
};

// Cart Modal

const showCart = () => {
  const cart = getCart();

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  const modal = document.createElement("div");
  modal.className = "cart-modal";

  const total = cart.reduce((sum, g) => sum + g.price, 0);

  modal.innerHTML = `
    <h2>Shopping Cart</h2>
    <button class="close-btn">×</button>

    ${
      cart.length === 0
        ? "<p>Your cart is empty.</p>"
        : cart
            .map(
              (g) => `
                <p>${g.title} — $${g.price}</p>
              `
            )
            .join("") +
          `<hr>
           <strong>Total: $${total.toFixed(2)}</strong>
           <button class="clear-btn">Clear Cart</button>`
    }
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  modal.querySelector(".close-btn").onclick = () =>
    overlay.remove();

  const clearBtn = modal.querySelector(".clear-btn");
  if (clearBtn) {
    clearBtn.onclick = () => {
      localStorage.removeItem("cart");
      overlay.remove();
    };
  }
};


cartButton.addEventListener("click", showCart);
renderGames();
