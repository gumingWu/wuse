# Best Practice

## Destructuring
Most of the functions in VueUse returns an object of refs that you can use ES6's object destructure syntax to take what you need. For example:
```js
import { useMouse } from '@vueuse/core'

// "x" and "y" are refs
const { x, y } = useMouse()

console.log(x.value)

const mouse = useMouse()

console.log(mouse.x.value)
```

If you prefer to use them as object properties style, you can unwrap the refs by using `reactive()`. For example:
```js
import { reactive } from 'vue'
import { useMouse } from '@vueuse/core'

const mouse = reactive(useMouse())

// "x" and "y" will be auto unwrapped, no `.value` needed
console.log(mouse.x)
```
