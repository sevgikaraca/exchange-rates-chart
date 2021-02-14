<template>
  <div id="app"
    :style="cssProps"
  >
    <div class="container">
      <br/>
      <div id="nav">
        <router-link to="/">Tarih Bazlı Döviz Kurları Grafiği</router-link>
      </div>
      <br/>
      <router-view/>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cssProps: {
        backgroundImage: `url(${require('@/assets/rupixen-com-BCRzMNq9jBc-unsplash.jpg')})`
      }
    }
  },
}
</script>

<style>
@import url(https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css);
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  min-height: 100vh;
  background-repeat:no-repeat;
  background-size:cover;
}

#nav {
  padding: 30px;
}

#nav a {
  font-size: 24px;
  font-weight: bold;
  color:white;
  background-color: #1D9BFA;
  border-radius: 40px;
  padding: 6px 
}
 @media screen and (max-width: 1000px) {
   #nav {
  padding: 0;
}
 }

</style>
