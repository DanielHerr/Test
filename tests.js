"use strict"

test("sync pass 1", function(pass) {
 pass()
})
test("sync pass 2", function() { })

test("async pass 1", function() {
 return(Promise.resolve())
})
test("async pass 2", function() {
 return(new Promise(function(resolve) {
  resolve()
})) })
test("async pass 3", function(pass) {
 Promise.resolve().then(pass)
})

test("sync fail 1", function(pass, fail) {
 fail(new Error)
})
test("sync fail 2", function() {
 throw(new Error)
})

test("async fail 1", function() {
 return(Promise.reject(new Error))
})
test("async fail 2", function() {
 return(new Promise(function(resolve, reject) {
  reject(new Error)
})) })
test("async fail 3", function(pass, fail) {
 Promise.reject(new Error).catch(fail)
})
test("async fail 4", function(pass) {
 setTimeout(function() {
  throw(new Error)
 }, 1)
})
test("async fail 5", function(pass) {
 Promise.resolve().then(function() {
  throw(new Error)
}) })
test("async fail 6", function(pass) {
 setTimeout(function() {
  throw(null)
 }, 1)
})
test("async fail 7", function(pass) {
 Promise.resolve().then(function() {
  throw(null)
}) })

test("not implemented")

test("infinite running", function(pass) { })

test("hide test elements using shadow dom", function() {
 if(document.documentElement.createShadowRoot) {
  let result = document.querySelectorAll("*")
  if(result.length != 4) {
   throw(new Error("elements visible should be 4 but is " + result.length))
  }
 } else {
  throw(new Error("not supported by browser"))
} })