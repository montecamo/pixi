<template>
  <div id="container"></div>
</template>

<script>
import { toRefs, watch } from "vue";
import Sketch from "sketch-js";
import { getPixels, setPixels } from "./canvas.ts";

export default {
  props: ["brushSize", "brushColor", "pixels"],
  emits: ["pixels:update"],
  setup(props) {
    const { brushSize, brushColor, pixels } = toRefs(props);

    const ctx = Sketch.create({
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
          this.fillStyle = this.strokeStyle = brushColor.value;
          this.lineWidth = brushSize.value;

          this.beginPath();
          this.moveTo(touch.ox, touch.oy);
          this.lineTo(touch.x, touch.y);
          this.stroke();
        }

        this.emit$("pixels:update", getPixels(this, this.width, this.height));
      },
    });

    watch(pixels, (newPixels) => {
      setPixels(ctx, newPixels, ctx.width, ctx.height);
    });
  },
};
</script>

<style scoped></style>
