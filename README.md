# DVD Screensaver

Inspired by the [DVD screensaver](https://www.youtube.com/watch?v=-pdVUsCqd2U) we all know and love.
Big thanks to [@adeshar00](https://github.com/adeshar00) for helping me think through collision detection.
Built during my time at [Recurse Center](https://www.recurse.com)

## Development

`F5` will launch an instance of Chrome and the VS Code Debugger.

## Todo

- Refactor
     - [ ] Should we use the same code to make a dynamic rectangle bounce off of the walls? Then we could remove the offscreen bug section.
    - Add some nicer docs
    - Potentially some sort of currying method on `Point` to make working points a bit easier in places?
- [x] Implement collision detection working off of [this tutorial] (https://youtu.be/8JJ-4JgR7Dg?t=2003)
    - [x] Get collision vector working perfectly with a ray coming from any angle.
    - [x] Get a dynamic rectangle to bounce correctly off of a static rectangle?
    - [x] Implement sort and sweep first with static rectangles
    - [x] Get two rectangles to bounce off of one another using sort and sweep.

## Maybe later
- [ ] Give an option to hit the corner every time.
- [ ] Maybe rebuild this in Elm?