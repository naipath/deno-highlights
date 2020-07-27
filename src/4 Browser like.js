// 4. Browser Like

let res = await fetch("https://meowfacts.herokuapp.com/")
let { data: [leFact] } = await res.json()

console.log(leFact)

// The only globals are: Deno + window


