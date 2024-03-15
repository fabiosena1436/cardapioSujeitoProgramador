const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItensContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const adderessInput = document.getElementById("address");
const paymentInput = document.getElementById("payment");
const addressWarn = document.getElementById("address-warn");
const paymentWarn = document.getElementById("payment-warn");


let cart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function () {
    cartModal.style.display = "flex";
});

// Fechar o modal quando clicar fora
cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none";
    }
});

// Fechar o modal quando clicar no button fechar

closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none";
});

//Adicionando itens com o button do carrinho

menu.addEventListener("click", function (event) {
    let parentButton = event.target.closest(".add-to-cart-btn");

    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parentButton.getAttribute("data-price");

        addToCart(name, price);
    }
});

//Função para adicionar no carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        //Se o item ja existe, aumenta apenas a quantidade + 1
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        });
    }
    updateCartModal();
}

//Atualiza o carrinho

function updateCartModal() {
    cartItensContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")


        cartItemElement.innerHTML = `
     <div class="flex items-center justify-between">
        <div>
                <p class="font-medium">${item.name}</p>
                <p>${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price}</p>
        </div>

        <div>
            <button class="remove-from-cart-btn" data-name="${item.name}">
            Remover
            </button>
        </div>
     </div>   
        `

        total += item.price * item.quantity;
        cartItensContainer.appendChild(cartItemElement);
    });

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })
    cartCounter.innerHTML = cart.length;

}

//Funçao para remover o intem do carrrinho
cartItensContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);

    }
})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);


    if (index !== -1) {
        const item = cart[index];


        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}


// Colhendo informação do que foi digitado no unput
adderessInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        adderessInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }

})

checkoutBtn.addEventListener("click", function () {
    if (cart.length === 0) return;
    if (adderessInput.value === "") {
        addressWarn.classList.remove("hidden")
        adderessInput.classList.add("border-red-500")
    }
})




paymentInput.addEventListener("input", function (event) {
    let paymentValue = event.target.value;

    if (paymentValue !== "") {
        paymentInput.classList.remove("border-red-500")
        paymentWarn.classList.add("hidden")
    }

})

// Finalizar pedido

checkoutBtn.addEventListener("click", function () {

    const isOpen = checkREstauranteOpen();
    if (!isOpen) {
        Toastify({
            text: "Estamos fechados no momento!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
        }).showToast();
        return;
    }


    if (cart.length === 0) return;
    if (adderessInput.value === "") {
        paymentWarn.classList.remove("hidden")
        paymentInput.classList.add("border-red-500")
        return;
    }

    // Enviar o pedido para a api do whats
    const cartItems = cart.map((item) => {
        return (
            `
            ${item.name} Quantidade: (${item.quantity}) Preço: R$:${item.price}  |  `
        )
    }).join("\n")
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const paymentValue = paymentInput.value;
    const message = encodeURIComponent(cartItems)
    const phone = "18981579318"

    window.open(`https://wa.me/${phone}\n\n?text=${message}\n\n Endereço: ${adderessInput.value} \n\n Forma de pagamento: ${paymentValue}  \n\n | Total: R$ ${total.toFixed(2)}`, "_blank")

    cart = []
    updateCartModal()
})


// Verificar a hora e manipular o card do horario

function checkREstauranteOpen() {
    const data = new Date()
    const hora = data.getHours();
    return hora >= 6 && hora < 22;
    //true restaurante esta aaberto
}

const spanItem = document.getElementById("date-span")
const isOpen = checkREstauranteOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")

} else {
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}