<template>
  <div>
    <HelloWorld msg="This is the about page"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "About",
  components: {
    HelloWorld
  }
};
</script>
