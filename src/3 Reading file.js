// 3. Reading files

let decoder = new TextDecoder();
let data = await Deno.readFile("hello.txt");

console.log(decoder.decode(data))

