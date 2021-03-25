<template>
  <div id="container"></div>
</template>

<script>
import Sketch from "sketch-js";

export default {
  props: ["brushSize", "brushColor"],
  created() {
    var self = this;

    Sketch.create({
      container: document.getElementById("container"),
      autoclear: false,
      retina: "auto",

      setup: function () {
        console.log("setup");
      },

      // Event handlers

      keydown: function () {
        if (this.keys.C) this.clear();
      },

      // Mouse & touch events are merged, so handling touch events by default
      // and powering sketches using the touches array is recommended for easy
      // scalability. If you only need to handle the mouse / desktop browsers,
      // use the 0th touch element and you get wider device support for free.
      touchmove: function () {
        for (var i = this.touches.length - 1, touch; i >= 0; i--) {
          touch = this.touches[i];

          this.lineCap = "round";
          this.lineJoin = "round";
          this.fillStyle = this.strokeStyle = self.brushColor;
          this.lineWidth = self.brushSize;

          this.beginPath();
          this.moveTo(touch.ox, touch.oy);
          this.lineTo(touch.x, touch.y);
          this.stroke();
        }
      },
    });
  },
};
</script>

<style scoped></style>
