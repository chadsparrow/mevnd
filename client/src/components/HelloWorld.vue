<template>
  <div>
    <h1 class="text-center">{{ msg }}</h1>
    <form class="text-center">
      <label class="mr-2" for="name">Name:</label>
      <input type="text" id="name">
    </form>
  </div>
</template>

<script>
export default {
  name: "HelloWorld",
  props: {
    msg: String
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
