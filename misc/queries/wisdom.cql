/*
Collect 10 random pieces of wisdom from the Advice Slip API and return them.
*/
unwind range(0,10) as i
load json from "https://api.adviceslip.com/advice" as item
return item.slip.advice as `Wisdom`