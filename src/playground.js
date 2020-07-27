// 1.Hello world

// console.log("hello world")



// 2.Deno global

console.log(Deno.cwd())
// !! SECURITY !!

// or
let { cwd } = Deno;
console.log(cwd(), Deno.args)



// 3.Reading files

let decoder = new TextDecoder();
let data = await Deno.readFile("hello.txt");
console.log(decoder.decode(data));



// 4.Browser Like

let res = await fetch("https://meowfacts.herokuapp.com/");
let { data: [leFact] } = await res.json();

console.log(leFact)
// Only 2 globals: Deno and Window




// 5.Modules

import * as o from "https://deno.land/x/cowsay/mod.ts"

// Modules get cached forever
// Can force a refresh

let msg = o.say({ text: "hello from OpenValue" })

console.log(msg)

// Std
import { blue } from "https://deno.land/std/fmt/colors.ts"

console.log(blue(msg))

// Deno global is quite bare and technical
// Std is there to help you out


// 6. Bundling + TS


// 7. Formatting


// 8. Installing

// 9. Testing
//
// -> playground_test.js

//Function under test:
export const adder = (a, b) => a + b;





