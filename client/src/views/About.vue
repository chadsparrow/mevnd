<template>
  <div>
    <hello-world msg="This is the About page"></hello-world>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "about",
  components: {
    HelloWorld
  }
};
</script>
