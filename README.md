# DVD Screensaver

Inspired by: https://www.youtube.com/watch?v=-pdVUsCqd2U

## Development

`F5` will launch an instance of Chrome and the VS Code Debugger.

## Todo

- [ ] Implement collision detection working off of [this tutorial] (https://youtu.be/8JJ-4JgR7Dg?t=2003)
    - [x] Get collision vector working perfectly with a ray coming from any angle.
    - [x] Get a dynamic rectangle to bounce correctly off of a static rectangle?
    - [x] Implement sort and sweep first with static rectangles
    - [ ] Get two rectangles to bounce off of one another using sort and sweep.
    - [ ] Should we use the same code to make a dynamic rectangle bounce off of the walls? Then we could remove the offscreen bug section.
        - This might actually be part of a bigger refactor...
- Add some nicer documentation/comments
- Give an option to hit the corner every time.
- Maybe rebuild this in Elm?

[@adesharnais]