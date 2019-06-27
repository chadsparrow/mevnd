<template>
  <div>
    <hello-world msg="This is the Contact Page"></hello-world>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "contact",
  components: {
    HelloWorld
  }
};
</script>
