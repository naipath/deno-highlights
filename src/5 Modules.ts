// 5.Modules

import * as o from "https://deno.land/x/cowsay/mod.ts"
// Is cached forever

let msg = o.say({ text: "hello from OpenValue" })

console.log(msg)

// Standard library:
import { blue } from "https://deno.land/std/fmt/colors.ts"

console.log(blue(msg))

