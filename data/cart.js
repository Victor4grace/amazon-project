import { renderOrderSummary } from "../scripts/checkouts/ordersummary.js";
import { renderPaymentSummary } from "../scripts/checkouts/paymentsummary.js";

export let cart = JSON.parse(localStorage.getItem('cart')) 

if(!cart){
  cart = [{
  productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
  quantity: 2,
  deliveryOptionId : '1'
},
{
  productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
  quantity: 1,
  deliveryOptionId : '2'
}];

}


export function saveToStorage(){
  localStorage.setItem('cart', JSON.stringify(cart));

}



export function addToCart(productId){
  

   let matchingitem;

      cart.forEach((cartItem) => {
        
        if(productId === cartItem.productId){
          matchingitem = cartItem;
        } 
        
      });

      

      const select = document.querySelector(`.js-quantity-selector-${productId}`);
        
        
        const selectOutput = Number(select.value);
        
        // console.log(selectOutput);


      if(matchingitem){
          matchingitem.quantity += selectOutput;
          
        }else {
        cart.push({
        productId: productId,
        quantity: selectOutput,
        deliveryOptionId: '1'
      });
          
        }

      

        let total = 0;

        cart.forEach((cartItem) => {
          return total += cartItem.quantity;
          
        });


        document.querySelector(`.js-added-${productId}`).classList.add('added-new')

        let timeId;

        clearTimeout(timeId);

        timeId = setTimeout(() => {
          document.querySelector(`.js-added-${productId}`).classList.remove('added-new')

        }, 2000);


        document.querySelector('.js-cart-quantity').innerHTML = total;
        

        // console.log(cart);
        // console.log(total);

    saveToStorage();
         
   
} ;



export function removeFromCart(productId){
  let newCart = [];

  cart.forEach((cartItem) => {
    if(cartItem.productId !== productId){
      newCart.push(cartItem)
    }
  })

  cart = newCart

  saveToStorage();
}



export function updateCartQuantity(){
    let quantity = 0;

    cart.forEach((cartItem) =>{
      quantity += cartItem.quantity;

      // console.log(quantity);
    });

    document.querySelector('.checkout-count').innerHTML = `${quantity} Items`;

    // document.querySelector('.js-cart-quantity').innerHTML = `${quantity}`;
  }


  export function updateQuantity(productId, newQuantity,container){
    cart.forEach((cartItem) =>{
      if(cartItem.productId === productId){
        cartItem.quantity = newQuantity;
        
      }
      
      updateCartQuantity();
      renderOrderSummary();
      renderPaymentSummary();

      
      
  })
  }



  export function updateDeliveryOption (productId , deliveryOptionId){

      let matchingitem;

      cart.forEach((cartItem) => {
        // console.log(productId , cartItem.productId);
        if(productId === cartItem.productId){
          matchingitem = cartItem;
        } 

        // console.log(cartItem)
        
      });

      matchingitem.deliveryOptionId = deliveryOptionId;

      // console.log(matchingitem);
      // console.log(matchingitem.deliveryOptionId)

      saveToStorage();

  }
