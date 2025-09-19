/*
Collect 10 random pieces of wisdom and create a letter histogram.
*/
unwind range(0,10) as i
load json from "https://api.adviceslip.com/advice" as item
with join(collect(item.slip.advice),"") as wisdom
unwind split(wisdom,"") as letter
return letter, sum(1) as lettercount