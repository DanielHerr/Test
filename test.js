"use strict"

function test(testname = "", testcode = function(){} ) {
 if(typeof(testname) == "function") {
  testcode = testname
  testname = testcode.name
 }
 testname = testname || testcode.name
 let result, failed
 try {
  result = testcode()
 } catch(error) {
  test.fail(testname, error)
  failed = true
 }
 if(result && typeof(result.then) == "function") {
  result.then(function(result) {
   test.pass(testname, result)
  }, function(error) {
   test.fail(testname, error)
  })
 } else if(failed != true) {
  test.pass(testname, result)
 }
 test.totaltests = test.totaltests + 1
 test.totalcounter.textContent = test.totaltests
}

test.pass = function(testname, results) {
 if(Array.isArray(results) == false) {
  if(results === undefined) {
   results = [ ]
  } else {
   results = [ results ]
 } }
 test.totalpassed = test.totalpassed + 1
 test.passedcounter.textContent = test.totalpassed
 let item = document.createElement("li")
 item.textContent = testname + " : "
 for(let result of results) {
  item.textContent = item.textContent + result + " "
 }
 test.passedlist.appendChild(item)
}

test.fail = function(testname, errors) {
 if(Array.isArray(errors) == false) {
  if(errors === undefined) {
   errors = [ ]
  } else {
   errors = [ errors ]
 } }
 test.totalfailed = test.totalfailed + 1
 test.failedcounter.textContent = test.totalfailed
 let item = document.createElement("li")
 item.textContent = testname + " : "
 for(let error of errors) {
  item.textContent = item.textContent + error + " "
 }
 test.failedlist.appendChild(item)
}

test.totaltests = 0
test.totalpassed = 0
test.totalfailed = 0

test.totalcounter = document.querySelector("total-tests")
test.passedcounter = document.querySelector("passed-total")
test.failedcounter = document.querySelector("failed-total")
test.passedlist = document.querySelector("#passed")
test.failedlist = document.querySelector("#failed")