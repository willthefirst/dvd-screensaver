# DVD Screensaver

Inspired by: https://www.youtube.com/watch?v=-pdVUsCqd2U

## Development

`F5` will launch an instance of Chrome and the VS Code Debugger.

## Todo

- [ ] Implement collision detection working off of [this tutorial] (https://youtu.be/8JJ-4JgR7Dg?t=2003)
    - [x] Get collision vector working perfectly with a ray coming from any angle.
    - [x] Get a dynamic rectangle to bounce correctly off of a static rectangle?~~
    - [ ] Should we use the same code to make a dynamic rectangle bounce off of the walls? Then we could remove the offscreen bug section.
    - [ ] If so, can we get two rectangles to bounce dynamically off of one another?
- Implement collision detection explained [here](https://www.youtube.com/watch?v=8JJ-4JgR7Dg);
- Get a code review...use Typescript, classes?
    - Add some nicer documentation/comments
- Give an option to hit the corner every time.
- Maybe rebuild this in Elm?
