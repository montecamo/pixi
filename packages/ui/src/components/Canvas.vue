<template>
  <div id="container"></div>
</template>

<script lang="ts">
import { toRefs, watch, defineComponent } from "vue";

// @ts-ignore
import Sketch from "sketch-js";
import { makeAction, renderAction } from "./action";
import type { Actions } from "./action";
import io from "socket.io-client";

export default defineComponent({
  props: ["brushSize", "brushColor", "actions", "canvasRef"],
  emit: ["update:canvasRef"],
  setup(props, { emit }) {
    const socket = io("ws://localhost:3001");

    const { brushSize, brushColor, canvasRef } = toRefs(props);

    const update = (nextActions: Actions) => {
      socket.emit("fibers", nextActions);
      // emit("update:actions", actions.value.concat(nextActions));
    };

    watch(brushSize, console.warn);

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
        for (let i = this.touches.length - 1; i >= 0; i--) {
          const touch = this.touches[i];

          this.lineCap = "round";
          this.lineJoin = "round";
          this.fillStyle = this.strokeStyle = brushColor.value;
          this.lineWidth = brushSize.value;

          this.beginPath();
          this.moveTo(touch.ox, touch.oy);
          this.lineTo(touch.x, touch.y);
          this.stroke();
        }

        update(
          this.touches.map((touch: any) =>
            makeAction(
              touch.ox,
              touch.oy,
              touch.x,
              touch.y,
              brushColor.value,
              brushSize.value
            )
          )
        );
      },
    });

    emit("update:canvasRef", ctx.canvas);

    // @ts-ignore
    window.ctx = ctx;

    socket.on("fibers", (acts: Actions) => {
      acts.forEach((a) => renderAction(ctx, a));
    });
  },
});
</script>

<style scoped></style>
