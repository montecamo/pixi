<template>
  <div class="container">
    <div
      v-for="color in colors"
      :key="color"
      class="color-container"
      :class="{ active: color === brushColor }"
      @click="changeBrushColor(color)"
    >
      <div class="color" :style="{ background: color }"></div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["update:brushColor"],
  props: {
    brushColor: String,
  },
  data() {
    return { colors: ["#E3EB64", "#A7EBCA", "#FFFFFF", "#D8EBA7", "#868E80"] };
  },
  methods: {
    changeBrushColor(color) {
      this.$emit("update:brushColor", color);
    },
  },
};
</script>

<style scoped>
.container {
  position: fixed;
  top: 50%;
  right: 0;

  transform: translateY(-50%);
}

.color-container {
  width: 80px;
  height: 80px;
  position: relative;
  cursor: pointer;
}

.color-container:hover {
  background: lightcoral;
}

.color {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  width: 50%;
  height: 50%;

  transform: translate(-50%, -50%);
  background: black;
}
.color-container.active {
  background: lightblue;
}
</style>
