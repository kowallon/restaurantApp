import { menuArray } from "./data.js"

//TO Dos && Ideas

//Validate card input
//Add timer for delivery time (e.g Pizza = 15 min, Burger = 20min, Pizza + Burger = 25 min etc...)
//More items (main categories: pizza, burger, drinks - more options will show on clicking on category icon)
//Dark theme
//PromoCode (will require new array in data, including valid promoCodes)
//Rating experience



let myOrderArr = []
let order = document.getElementById("orderBtn")
let orderNo = 1
let hasBeer = false
let hasPizza = false
let eligibleForDiscount = false



document.addEventListener("click", function(e){
    //add btn
    if (e.target.dataset.id){
    handleAddClick(e.target.dataset.id)
    document.getElementById("summary").classList.remove("hidden")
    renderSummary()
    }
    //remove Btn
    else if(e.target.dataset.remove){
       deleteItem(e.target.dataset.remove)
    }
        else if (e.target.id != "modal" && 
                e.target.id != "orderBtn" && 
                e.target.id != "inputCard" &&
                e.target.id != "inputName" &&
                e.target.id != "inputCvc" &&
                e.target.id != "submitCard" &&
                e.target.id != "form" &&
                e.target.id != "modal-header" &&
                e.target.id != "modal-inner"){
            closeModal()
        }
    
    else if (e.target.id == "submitCard"){
        e.preventDefault()
        submitOrder() 
        }  
    })

order.addEventListener("click", function(){
    document.getElementById("modal").classList.remove("hidden")
})


function handleAddClick(itemId){
    const selectedMeal = menuArray.filter(function(meal){
        return meal.id == itemId
    })[0]
    myOrderArr.unshift(selectedMeal)
   return myOrderArr
}

function renderSummary(){
    let totalcost = 0
    let summaryHTML = ``

    document.getElementById("basketHeader").classList.remove("hidden")

    myOrderArr.forEach(function(item){
        if(item.name === "Beer"){
           hasBeer = true
        } else if (item.name === "Pizza"){
            hasPizza = true
        }
    })

    if(hasBeer && hasPizza){
        eligibleForDiscount = true
    }
    
    

    myOrderArr.forEach(function(orderedMeal){

        
        if(eligibleForDiscount){
            summaryHTML += `
            <div class="currentOrder" id="currentOrder">
                <div class="orderedItem">
                    <div class="itemSummary">
                    <h2>${orderedMeal.name}</h2>
                    <button class="removeBtn" id="removeBtn" data-remove="${orderedMeal.id}">remove</button>
                    </div>
                    <h2 id="singleItemPrice">$${orderedMeal.price} <span class="promo">- $${(orderedMeal.price * 0.1).toFixed(2)}</span></h2>
                </div>
            </div>`

            totalcost += orderedMeal.price
        } else {
            summaryHTML += `
            <div class="currentOrder" id="currentOrder">
                <div class="orderedItem">
                    <div class="itemSummary">
                    <h2>${orderedMeal.name}</h2>
                    <button class="removeBtn" id="removeBtn" data-remove="${orderedMeal.id}">remove</button>
                    </div>
                    <h2 id="singleItemPrice">$${orderedMeal.price}</h2>
                </div>
            </div>`

            totalcost += orderedMeal.price
        }
        


    })
    document.getElementById("summary").innerHTML = summaryHTML            
   
    if(eligibleForDiscount){
        let discounted = totalcost - totalcost * 0.1
        discounted.toFixed(2)
        let discountVal = totalcost - discounted

        let discountedPrice = totalcost - discountVal
        
        let checkoutHTML = ``
        checkoutHTML += `<div class="checkout">
        <h2>Total price:</h2>
        <h2><span class="promo">Your discount is $${discountVal.toFixed(2)}</span> Total: $${discountedPrice.toFixed(2)}</h2>
        </div>`
        document.getElementById('checkout').innerHTML = checkoutHTML

        document.getElementById("summary").classList.remove('hidden')
        document.getElementById("basket").classList.remove('hidden')

    } else {

    let checkoutHTML = ``
    checkoutHTML += `<div class="checkout">
    <h2>Total price:</h2>
    <h2>$${totalcost}</h2>
    </div>`
    document.getElementById('checkout').innerHTML = checkoutHTML

    document.getElementById("summary").classList.remove('hidden')
    document.getElementById("basket").classList.remove('hidden')
    }   
}

function deleteItem(itemId){
    const targetOrderedItem = myOrderArr.filter(function(item){
        return item.id == itemId
    })[0] 
    const indexofObject = myOrderArr.indexOf(targetOrderedItem)
    console.log(indexofObject)
    myOrderArr.splice(indexofObject, 1)
    if (myOrderArr.length < 1){
        document.getElementById("basket").classList.add('hidden')
    } else {
    renderSummary()
    }
       
}


function getMenuHTML(){
    let menuHTML = ``
    menuArray.forEach(function(meal){
        menuHTML += `
        <div class="productCard-wrap">
            <div>
                <p class="food-icon">${meal.emoji}</p>
            </div>
            <div class="product-details">
                <h2>${meal.name}</h2>
                <h4>${meal.ingredients}</h4>
                <h3>$${meal.price}</h3>  
            </div>
            <button class="addBtn" data-id="${meal.id}">+</button>
        </div>      

    `
    })
    return menuHTML
    
}

function render(){
    document.getElementById('menu').innerHTML = getMenuHTML()
}


function submitOrder(){

    let customerName = ''
    customerName = document.getElementById("inputName").value

    let orderNo = localStorage.getItem("orderNumber")

    orderNo++

    document.getElementById("modal-inner").innerHTML = `
    <img class="gif" src="https://media3.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif?cid=ecf05e47rpaz06nlbetff6dbbi8kj9lqf2xdoen3vm8tc6sz&rid=giphy.gif&ct=g" alt="checking card">
    <h3>Processing...</h3>
    `

    setTimeout(function(){
        document.getElementById("modal").classList.add("hidden")
        
    }, 3000)

    setTimeout(function(){    
    let summaryHTML = `<div class="confirmation">
    <h1>Thanks ${customerName}, your order number is #${orderNo} and it is being prepared</h1>
    <button class="orderBtn" onClick="document.location.reload(true)">New order</button>
    </div>`
    console.log(customerName)
    document.getElementById("basketTitle").classList.add("hidden")
    document.getElementById("checkout").classList.add("hidden")
    document.getElementById("modal").classList.add("hidden")
    document.getElementById("btnWrapper").classList.add("hidden")
    document.getElementById("summary").innerHTML = summaryHTML
    },3000)

    localStorage.setItem("orderNumber", orderNo);
    
    }

function closeModal(){
    document.getElementById("modal").classList.add("hidden")
}

render()
