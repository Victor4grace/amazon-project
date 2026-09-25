import {cart, removeFromCart, saveToStorage, updateQuantity, updateDeliveryOption} from '../../data/cart.js'
import { products,getProduct } from '../../data/products.js';
import { updateCartQuantity } from '../../data/cart.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOption , getDeliveryOption } from '../../data/deliveryOption.js';
import { renderPaymentSummary } from './paymentsummary.js';


// // console.log(dayjs())
// const today = new Date();
// //  const deliveryDate = today.add(7, 'days');
// today.setDate(today.getDate() + 7);

// //  console.log(today);
// //  console.log(today.toLocaleDateString ("en-GB"));
//  const formattedDate = today.toLocaleDateString("en-US", { 
//   weekday: "long",
//   month: "long",
//   day: "numeric"
//  });

//  console.log(formattedDate);

export function renderOrderSummary(){

let cartSummary = ''

cart.forEach((cartItem) =>{
  const productId = cartItem.productId;

  
  const matchingProduct = getProduct(productId);

  // console.log(matchingproduct);

  const deliveryOptionId = cartItem.deliveryOptionId;

  // let deliveyOptionId;

  const  deliveyOption = getDeliveryOption(deliveryOptionId)

  const today = dayjs();
    const deliveryDate = today.add(
      deliveyOption.deliveryDays, 'days'
    );
    const dateString = deliveryDate.format(
      'dddd, MMMM D'
    );

 cartSummary += `
  <div class="cart-item-container js-remove-order-${matchingProduct.id} js-cart-container-${matchingProduct.id} js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
      Delivery date: ${dateString};
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            $${(matchingProduct.priceCents / 100).toFixed(2)}
          </div>
          <div class="product-quantity">

            <span>
              Quantity: <span class="quantity-label js-quantity">${cartItem.quantity}</span>
            </span>

            <span class="update-quantity-link link-primary" data-product-id = "${matchingProduct.id}">
              Update
            </span>

            <input class ="quantity-input js-quantity-input">

            <span class = "link-primary new-quantity js-save-quantity-link " data-product-id = "${matchingProduct.id}">Save</span>
 
            <span class="delete-quantity-link link-primary js-delete-link" data-product-id = "${matchingProduct.id}"
            >Delete</span>

          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          ${deliveryOptionHTML(matchingProduct, cartItem)}
        </div>
      </div>
    </div>
 `;


});

function deliveryOptionHTML(matchingProduct, cartitem){

  let html = '';

  deliveryOption.forEach((deliveryOption, cartItem) =>{
    const today = dayjs();
    const deliveyDate = today.add(
      deliveryOption.deliveryDays, 'days'
    );
    const dateString = deliveyDate.format(
      'dddd, MMMM D'
    );

    const priceString = deliveryOption.priceCents === 0
    ? 'FREE'
    : `$${(deliveryOption.priceCents / 100)} -`;

    

    //  const deliveryOptionId = cartItem.deliveryOptionId;

    // console.log(cartitem)
    // console.log(deliveryOption.id);
    // console.log(cartitem.deliveryOptionId);



    const isChecked = deliveryOption.id === cartitem.deliveryOptionId

    // console.log(deliveryOption.id)
    // console.log(cartitem.deliveryOptionId)
    // console.log(isChecked)
    

    html += `
      <div class="delivery-option js-delivery-option" data-product-id = "${matchingProduct.id}"
      data-delivery-option-id = ${deliveryOption.id}>

            <input type="radio"
            ${isChecked ? 'checked' : ''}
              class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}" >
            <div>
              <div class="delivery-option-date">
                ${dateString}
              </div>
              <div class="delivery-option-price">
                ${priceString} Shipping
              </div>
            </div>
          </div>
    `
  });

  

  return html;
}



document.querySelector('.js-order-summary')
    .innerHTML = cartSummary;

  


document.querySelectorAll('.js-delete-link')
  .forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      // console.log('delete');

      removeFromCart(productId);

      renderPaymentSummary()

      const container =  document.querySelector(`.js-remove-order-${productId}`);

      // console.log(container);

    container.remove();

    updateCartQuantity();
      
    });

    // updateCartQuantity();
  });

  updateCartQuantity();

  
  

  document.querySelectorAll('.update-quantity-link')
    .forEach((link) =>{
      link.addEventListener('click', () =>{
        const productId = link.dataset.productId;

        const cartItemContainer = document.querySelector(`.js-cart-container-${productId}`

        );
        // console.log(productId);
        // console.log(cartItemContainer);

         cartItemContainer.classList.add('is-editing-quantity');

        

      });

      updateCartQuantity();

     
    });

    updateCartQuantity();


    document.querySelectorAll('.js-save-quantity-link').forEach((link) =>{
      link.addEventListener('click', () => {

          const productId = link.dataset.productId;

          const container = document.querySelector(`.js-cart-item-container-${productId}`);
          // console.log(container)

          container.classList.remove('is-editing-quantity');

          
      });
      
    });

    document.querySelectorAll('.js-save-quantity-link').forEach((link) =>{
      link.addEventListener('click', () => {

          const productId = link.dataset.productId;

          const container = document.querySelector(`.js-cart-item-container-${productId}`);
          // console.log(container)

          const quantityInput = container.querySelector('.js-quantity-input');

          const newQuantity = Number(quantityInput.value);

          

          // console.log(newQuantity);
          container.querySelector('.js-quantity').innerHTML = newQuantity;

           updateQuantity(productId, newQuantity,container);
          
          

          // if(newQuantity <= 0 ){
          //   alert('Quantity cannot be lessthan or equal to zero');
          // }

          saveToStorage();
          
          
          

      });

    });


    document.querySelectorAll('.js-delivery-option')
      .forEach((element) => {
        element.addEventListener('click', () => {
          const {productId, deliveryOptionId} = element.dataset;
          // console.log(cartItem);

          updateDeliveryOption(productId, deliveryOptionId);

          renderOrderSummary();
          renderPaymentSummary();
        })
      }) 

      // cart.forEach((cartItem) => {

      // })

  

}



    

    

  


 


