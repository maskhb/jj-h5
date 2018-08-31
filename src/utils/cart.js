export const initCart = function () {
  localStorage.cart = JSON.stringify({accountId: localStorage.accountId, list: []})
  return JSON.parse(localStorage.cart)
}

export const getCart = function () {
  localStorage.cart = localStorage.cart || JSON.stringify({accountId: localStorage.accountId, list: []})
  return JSON.parse(localStorage.cart)
}

export const setCart = function (cart) {
  localStorage.cart = JSON.stringify(cart)
}

export const clearCart = function () {
  localStorage.removeItem('cart')
}

export const removeCart = function (skuId) {
  skuId = typeof skuId === 'number' ? [skuId] : skuId
  let cart = getCart()

  skuId.forEach((v) => {
    let Index = cart.list.findIndex((v2) => {
      return v2.skuId === v
    })

    cart.list.splice(Index, 1)
  })

  setCart(cart)
}
