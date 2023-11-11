// Responsible for detecting whether two objects collide.
// Borrowed from: https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection.
export class CollisionDetection {
  collides(box, otherBox) {
    return (
      // box.x < otherBox.x + otherBox.w
      box[2] < otherBox[2] + otherBox[0] &&
      // box.x + box.w > otherBox.x
      box[2] + box[0] > otherBox[2] &&
      // box.y < otherBox.y + otherBox.h
      box[3] < otherBox[3] + otherBox[1] &&
      // box.h + box.y > otherBox.y
      box[1] + box[3] > otherBox[3]
    );
  }
}
