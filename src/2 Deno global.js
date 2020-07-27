// 2. Deno global

console.log(Deno.cwd())

// or

let { cwd, args } = Deno;

console.log(cwd(), args.map(a => a.toUpperCase()))

