<template>
  <div id="app">
    <div id="nav" class="text-center">
      <router-link to="/">Home</router-link>|
      <router-link to="/about">About</router-link>|
      <router-link to="/contact">Contact</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>

<style>
#nav a {
  color: red;
  text-decoration: none;
  margin: 0px 5px;
}

#nav a:hover {
  color: red;
  text-decoration: underline;
}
</style>
