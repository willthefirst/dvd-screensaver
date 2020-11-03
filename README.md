# DVD Screensaver

Inspired by the [DVD screensaver](https://www.youtube.com/watch?v=-pdVUsCqd2U) we all know and love.  

## Development

`F5` will launch an instance of Chrome and the VS Code Debugger.

## Todo
- >>>> [ ] Would be nice to really make collision detection work :(˝
- [ ] Refactor
    - [ ] Determine highest variance axis.
    - [ ] Potentially some sort of currying method on `Point` to make working points a bit easier in places?
    - [ ] For the `Rect` class, renam `.vector` to `.dir` and make vector a computer prop from `.dir * .vel`
    - [ ] Why does the whole program slow down over time?
    - [x] All images load immediately
    - [x] Overflow hidden/improve on mobile
    - [x] Should we use the same code to make a dynamic rectangle bounce off of the walls? Then we could remove the offscreen bug section.
    - [x] Add some nicer docs.
- [x] Implement collision detection working off of [this tutorial] (https://youtu.be/8JJ-4JgR7Dg?t=2003)
    - [x] Get collision vector working perfectly with a ray coming from any angle.
    - [x] Get a dynamic rectangle to bounce correctly off of a static rectangle?
    - [x] Implement sort and sweep first with static rectangles.
    - [x] Get two rectangles to bounce off of one another using sort and sweep.
- [x] More self-explanatory user interface
- [x] Busted mouseout bug.

## Maybe later
- [ ] Give an option to hit the corner every time.
- [ ] Maybe rebuild this in Elm?

Big thanks to [@adeshar00](https://github.com/adeshar00) for helping me think through collision detection.  
Built during my time at [Recurse Center](https://www.recurse.com)
