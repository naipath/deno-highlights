import {adder} from "./9 Testing.js"
import { assertEquals } from "https://deno.land/std/testing/asserts.ts"

Deno.test("Simple", () => {
  assertEquals(2, adder(1,1))
})

Deno.test({
  name: "Longer form",
  fn: () => {
    assertEquals(3, adder(1,2))
  },
})

