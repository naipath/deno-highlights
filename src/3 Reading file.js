// 3. Reading files

let decoder = new TextDecoder();
let data = await Deno.readFile("hello2.txt");

console.log(decoder.decode(data))

